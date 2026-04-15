import { GoogleGenAI, Type } from "@google/genai";
import type { Message, FileNode, ModelConfig } from '../types';
import { SUPPORTED_MODELS } from '../constants';
import { streamGeminiResponse } from "./geminiService";

// Helper to get API key from manual input or Vite environment variables
const getApiKeyFromEnv = (provider: string): string | undefined => {
    switch (provider) {
        case 'Google':
            return import.meta.env.VITE_GEMINI_API_KEY;
        case 'OpenRouter':
            return import.meta.env.VITE_OPENROUTER_API_KEY;
        case 'OpenAI':
            return import.meta.env.VITE_OPENAI_API_KEY;
        case 'DeepSeek':
            return import.meta.env.VITE_DEEPSEEK_API_KEY;
        default:
            return undefined;
    }
};

const TARS_SYSTEM_INSTRUCTION_GENERIC = `You are open-studio v2026, an elite creative development assistant specializing in high-fidelity 'Sovereign Nexus' designs.

CREATIVE DIRECTION (THE PULSE):
- Max Fidelity: Use Three.js, shaders, and advanced CSS for 'funky' and 'cool' 2026 aesthetics.
- 2026 Aesthetic: Think glassmorphism, cinematic depth, liquid animations, and responsive WebGL.
- Bold Typography: Use tracking-tighter, uppercase, and creative weights for impact.

RESPONSE FORMAT:
- Your response MUST be a single, valid JSON object and nothing else.
- DO NOT wrap the JSON in markdown backticks like \`\`\`json.
- DO NOT add any text before or after the JSON object.

The JSON object must have this exact structure:
{
  "conversation": "Your conversational response here. Keep it concise and maintain a 'Sovereign Architect' tone.",
  "files": [
    {
      "path": "src/components/CoolComponent.tsx",
      "content": "// The full, complete file content goes here.",
      "action": "created"
    }
  ]
}

MODIFICATION GUIDELINES:
1. For NEW files, use "action": "created".
2. For CHANGING existing files, use "action": "modified".
3. For REMOVING files, use "action": "deleted".
4. Always provide the FULL file content.
5. If no files are changed, "files" MUST be an empty array: [].`;

// Helper to convert app's message format to a generic format.
const toGenericHistory = (messages: Message[]) => {
    return messages
        .filter(m => (m.role === 'user' || (m.role === 'open-studio' && m.content)))
        .map(m => ({
            role: m.role === 'open-studio' ? 'assistant' : 'user',
            content: m.content
        }));
};

const buildFullPrompt = (prompt: string, fileTree: FileNode[]): string => {
    let fullPrompt = prompt;
    if (fileTree && fileTree.length > 0) {
        const fileContext = {
            files: fileTree.map(f => ({ path: f.path, content: f.content }))
        };
        const contextString = `\n\n[Current Project Files]\n\`\`\`json\n${JSON.stringify(fileContext, null, 2)}\n\`\`\``;
        fullPrompt += contextString;
    }
    return fullPrompt;
}

// --- Provider-Specific Clients ---

async function* streamOpenAICompatibleResponse(fullPrompt: string, history: Message[], modelConfig: ModelConfig, apiKey: string): AsyncGenerator<{ text: string; }> {
    let apiBaseUrl = '';
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    };

    switch (modelConfig.provider) {
        case 'DeepSeek':
            apiBaseUrl = 'https://api.deepseek.com/v1';
            break;
        case 'OpenAI':
            apiBaseUrl = 'https://api.openai.com/v1';
            break;
        case 'OpenRouter':
            apiBaseUrl = 'https://openrouter.ai/api/v1';
            headers['HTTP-Referer'] = 'https://opendev-labs.ai';
            headers['X-Title'] = 'opendev-labs';
            break;
        default:
            throw new Error(`Unsupported OpenAI-compatible provider: ${modelConfig.provider}`);
    }

    const messages = [
        { role: 'system', content: TARS_SYSTEM_INSTRUCTION_GENERIC },
        ...toGenericHistory(history),
        { role: 'user', content: fullPrompt }
    ];

    const response = await fetch(`${apiBaseUrl}/chat/completions`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
            model: modelConfig.apiIdentifier,
            messages: messages,
            stream: true,
        })
    });

    if (!response.ok) {
        let errorMessage = response.statusText;
        try {
            const errorBody = await response.json();
            errorMessage = errorBody?.error?.message || errorMessage;
            console.error(`API Error from ${modelConfig.provider}:`, errorBody);
        } catch (e) {
            const errorText = await response.text();
            console.error(`API Error from ${modelConfig.provider}:`, errorText);
        }
        throw new Error(errorMessage);
    }

    if (!response.body) {
        throw new Error("Response body is null");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
        const { done, value } = await reader.read();
        if (done) {
            break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep the last, potentially incomplete line

        for (const line of lines) {
            if (line.startsWith('data: ')) {
                const data = line.substring(6).trim();
                if (data === '[DONE]') {
                    return;
                }
                try {
                    const json = JSON.parse(data);
                    const text = json.choices[0]?.delta?.content || '';
                    if (text) {
                        yield { text };
                    }
                } catch (e) {
                    console.error("Error parsing stream data:", data, e);
                }
            }
        }
    }
}


async function* streamHuggingFaceResponse(fullPrompt: string, history: Message[], modelConfig: ModelConfig, apiKey: string): AsyncGenerator<{ text: string; }> {
    const hfPrompt = `${TARS_SYSTEM_INSTRUCTION_GENERIC}\n\n**Task:**\n${fullPrompt}`;

    // NOTE: The free Hugging Face Inference API does not support streaming responses for text generation.
    // This function will wait for the full response before returning.
    const response = await fetch(
        `https://api-inference.huggingface.co/models/${modelConfig.apiIdentifier}`,
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ inputs: hfPrompt })
        }
    );

    if (!response.ok) {
        let errorMessage = response.statusText;
        try {
            const errorBody = await response.json();
            errorMessage = errorBody?.error || errorMessage;
            console.error("Hugging Face API Error:", errorBody);
        } catch (e) {
            const errorText = await response.text();
            console.error("Hugging Face API Error:", errorText);
        }
        throw new Error(errorMessage);
    }

    const result = await response.json();
    const generatedText = result[0]?.generated_text;

    if (!generatedText) {
        throw new Error("Invalid response structure from Hugging Face.");
    }

    const jsonStart = generatedText.indexOf('{');
    if (jsonStart !== -1) {
        const jsonString = generatedText.substring(jsonStart);
        yield { text: jsonString };
    } else {
        const fallback = {
            conversation: `The model did not return the expected JSON format. Raw response:\n\n${generatedText}`,
            files: []
        };
        yield { text: JSON.stringify(fallback) };
    }
}


async function* streamOllamaResponse(fullPrompt: string, history: Message[], modelConfig: ModelConfig): AsyncGenerator<{ text: string; }> {
    const messages = [
        { role: 'system', content: TARS_SYSTEM_INSTRUCTION_GENERIC },
        ...toGenericHistory(history),
        { role: 'user', content: fullPrompt }
    ];

    const response = await fetch(`http://localhost:11434/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: modelConfig.apiIdentifier,
            messages: messages,
            stream: true,
        })
    });

    if (!response.ok) {
        throw new Error(`Ollama connection failed. Ensure Ollama is running at http://localhost:11434 and CORS is enabled (OLLAMA_ORIGINS="*" ollama serve).`);
    }

    if (!response.body) throw new Error("No response body from Ollama");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunks = decoder.decode(value, { stream: true }).split('\n').filter(Boolean);
        for (const chunk of chunks) {
            try {
                const json = JSON.parse(chunk);
                if (json.message?.content) {
                    yield { text: json.message.content };
                }
                if (json.done) return;
            } catch (e) {
                console.error("Ollama parsing error:", e);
            }
        }
    }
}


// --- Main Dispatcher ---

export async function* streamChatResponse(
    prompt: string,
    history: Message[],
    fileTree: FileNode[],
    modelId: string,
    userProfile?: any
): AsyncGenerator<{ text: string; }> {

    const modelConfig = SUPPORTED_MODELS.find(m => m.id === modelId);

    if (!modelConfig) {
        const errJson = JSON.stringify({ conversation: `Error: Model configuration for "${modelId}" not found.`, files: [] });
        yield { text: errJson };
        return;
    }

    // Resolve Effective API Key: User Profile > Mesh Env Vars
    let effectiveApiKey: string | undefined = undefined;
    
    if (userProfile) {
        switch (modelConfig.provider) {
            case 'Google':
                effectiveApiKey = userProfile.geminiApiKey;
                break;
            case 'OpenRouter':
                effectiveApiKey = userProfile.openRouterApiKey;
                break;
            case 'OpenAI':
                effectiveApiKey = userProfile.openaiApiKey;
                break;
            case 'DeepSeek':
                effectiveApiKey = userProfile.deepseekApiKey;
                break;
        }
    }

    // Fallback to Env Vars if profile key not set
    if (!effectiveApiKey) {
        effectiveApiKey = getApiKeyFromEnv(modelConfig.provider);
    }

    // Google provider: key is managed by the secure Vercel backend — no frontend key needed
    const requiresKey = modelConfig.provider !== 'Google';

    if (requiresKey && !effectiveApiKey) {
        const errJson = JSON.stringify({ conversation: `Materialization handshake failed: API key for ${modelConfig.provider} is not configured. Please initialize your keys in Settings for flawless materialization.`, files: [] });
        yield { text: errJson };
        return;
    }

    const fullPrompt = buildFullPrompt(prompt, fileTree);

    try {
        switch (modelConfig.provider) {
            case 'Google':
                yield* streamGeminiResponse(fullPrompt, history, modelConfig, effectiveApiKey);
                break;

            case 'Ollama':
                yield* streamOllamaResponse(fullPrompt, history, modelConfig);
                break;

            case 'OpenAI':
            case 'DeepSeek':
            case 'OpenRouter':
                yield* streamOpenAICompatibleResponse(fullPrompt, history, modelConfig, effectiveApiKey);
                break;

            case 'Meta':
            case 'BigCode':
            case 'WizardLM':
            case 'Mistral AI':
            case 'OpenChat':
            case 'Phind':
            case 'Replit':
                yield* streamHuggingFaceResponse(fullPrompt, history, modelConfig, effectiveApiKey);
                break;

            case 'Anthropic':
                const notImplementedAnthropic = { conversation: `The Anthropic provider is not yet fully implemented.`, files: [] };
                yield { text: JSON.stringify(notImplementedAnthropic) };
                break;

            default:
                const notImplementedDefault = { conversation: `The model provider '${modelConfig.provider}' is not yet implemented.`, files: [] };
                yield { text: JSON.stringify(notImplementedDefault) };
        }
    } catch (error) {
        console.error(`Error with ${modelConfig.provider} API:`, error);
        const errorMsg = error instanceof Error ? error.message : "An unknown error occurred.";
        const errJson = JSON.stringify({ conversation: `An error occurred with ${modelConfig.provider}: ${errorMsg}`, files: [] });
        yield { text: errJson };
    }
}

// --- Suggestions Service ---
export async function generateSuggestions(context: string): Promise<string[]> {
    try {
        const apiUrl = 'https://opendev-labs.vercel.app/api/suggest';

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ context })
        });
        
        if (!response.ok) {
            console.warn("Backend suggestions API failed:", response.statusText);
            return [];
        }

        const parsed = await response.json();
        return parsed.suggestions && Array.isArray(parsed.suggestions) ? parsed.suggestions.slice(0, 4) : [];
    } catch (error) {
        console.error("Error generating suggestions:", error);
        return [];
    }
}

