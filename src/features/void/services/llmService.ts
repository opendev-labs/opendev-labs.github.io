import { GoogleGenAI, Type } from "@google/genai";
import type { Message, FileNode, ModelConfig } from '../types';
import { SUPPORTED_MODELS } from '../constants';
import { streamGeminiResponse } from "./geminiService";

const OPEN_STUDIO_SYSTEM_INSTRUCTION_GENERIC = `You are open-studio, an AI development assistant operating under the QBET (Quantum-Behavioral Engineering Transition) logic framework. 
Your primary function is to interpret visionary system intents and translate them into stable technical states using the 'spoon-cli' as your universal execution engine.

QBET LOGIC PROTOCOL:
1. INTENT ANALYSIS: Analyze the high-level intent. What is the fundamental problem?
2. STATE MAPPING: Define system states (UI, API, DB, Sync, Audit).
3. MATERIALIZATION: Translate states into high-fidelity code and 'spoon-cli' orchestration commands.

SPOON-CLI ORCHESTRATION:
- Spoon is the Meta-CLI. All commands for Void, SyncStack, or LamaDB must be wrapped in 'spoon'.
- EXECUTION STANDARD: Every 'auto-creation' event must be logged via 'lamadb-cli' through the Spoon interface to maintain an audit trail.
- SELF-HEALING: If Spoon detects a failure in SyncStack, prioritize generating a repair sequence using Void-CLI via Spoon.
- UNIVERSAL CAPABILITY: Wrap all external tools (git, docker, firebase) using 'spoon' to ensure opendev-labs standards.

RESPONSE REQUIREMENTS:
Your response MUST be a single, valid JSON object. 
DO NOT wrap the JSON in markdown backticks like \`\`\`json. 
DO NOT add any conversational text outside the JSON.
USE SMALL LETTERS ONLY: spoon-cli, lamadb, opendev-labs.

STRUCTURE:
{
  "intent_analysis": "Describe your understanding of the intent and the 'spoon' orchestration strategy.",
  "conversation": "Hyper-intelligent, concise response. Acknowledge the architecture being manifested.",
  "commands": ["spoon lamadb init", "spoon syncstack tunnel", "spoon void deploy"],
  "files": [
    {
      "path": "path/to/file.tsx",
      "content": "Full, complete file content.",
      "action": "created" | "modified" | "deleted"
    }
  ]
}

MODIFICATION GUIDELINES:
1. Use production-grade patterns (React, TypeScript, Tailwind, Lucide).
2. For NEW files, use "action": "created".
3. For CHANGING existing files, use "action": "modified".
4. Always provide FULL file content.`;

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
        { role: 'system', content: OPEN_STUDIO_SYSTEM_INSTRUCTION_GENERIC },
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
    const hfPrompt = `${OPEN_STUDIO_SYSTEM_INSTRUCTION_GENERIC}\n\n**Task:**\n${fullPrompt}`;

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


// --- Main Dispatcher ---

export async function* streamChatResponse(
    prompt: string,
    history: Message[],
    fileTree: FileNode[],
    modelId: string,
    apiKey: string | undefined
): AsyncGenerator<{ text: string; }> {

    const modelConfig = SUPPORTED_MODELS.find(m => m.id === modelId);

    if (!modelConfig) {
        const errJson = JSON.stringify({ conversation: `Error: Model configuration for "${modelId}" not found.`, files: [] });
        yield { text: errJson };
        return;
    }

    if (!apiKey && !(modelConfig.provider === 'Google' && import.meta.env.VITE_FIREBASE_API_KEY) && !(modelConfig.provider === 'OpenRouter' && import.meta.env.VITE_OPENROUTER_API_KEY)) {
        const errJson = JSON.stringify({ conversation: `API key for ${modelConfig.provider} is missing. Please add it in the model selector.`, files: [] });
        yield { text: errJson };
        return;
    }

    const fullPrompt = buildFullPrompt(prompt, fileTree);

    try {
        switch (modelConfig.provider) {
            case 'Google':
                yield* streamGeminiResponse(fullPrompt, history, modelConfig, apiKey);
                break;

            case 'OpenAI':
            case 'DeepSeek':
            case 'OpenRouter':
                const orToken = apiKey || import.meta.env.VITE_OPENROUTER_API_KEY;
                yield* streamOpenAICompatibleResponse(fullPrompt, history, modelConfig, orToken!);
                break;

            case 'Meta':
            case 'BigCode':
            case 'WizardLM':
            case 'Mistral AI':
            case 'OpenChat':
            case 'Phind':
            case 'Replit':
                yield* streamHuggingFaceResponse(fullPrompt, history, modelConfig, apiKey!);
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

// --- Suggestions Service (Remains the same, uses Gemini) ---
export async function generateSuggestions(context: string): Promise<string[]> {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_FIREBASE_API_KEY || import.meta.env.VITE_OPENROUTER_API_KEY;
    if (!apiKey) {
        console.warn("No API key set for suggestions.");
        return [];
    }
    try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: context,
            config: {
                systemInstruction: `You are an expert developer assistant. Based on the user's last request and the files that were generated, provide 3-4 short, actionable follow-up prompts. Return a JSON object with a single key "suggestions" which is an array of strings. Example: {"suggestions": ["Make it responsive", "Add a loading state"]}`,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        suggestions: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        }
                    },
                    required: ['suggestions']
                }
            }
        });
        const jsonStr = response.text?.trim() || "{}";
        const parsed = JSON.parse(jsonStr);
        return parsed.suggestions && Array.isArray(parsed.suggestions) ? parsed.suggestions.slice(0, 4) : [];
    } catch (error) {
        console.error("Error generating suggestions:", error);
        return [];
    }
}


export async function validateApiKey(provider: ModelConfig['provider'], apiKey: string): Promise<boolean> {
    if (!apiKey.trim()) {
        throw new Error("API key cannot be empty.");
    }

    try {
        switch (provider) {
            case 'Google': {
                const ai = new GoogleGenAI({ apiKey });
                await ai.models.generateContent({ model: 'gemini-1.5-flash', contents: 'test' });
                return true;
            }
            case 'OpenAI':
            case 'DeepSeek':
            case 'OpenRouter': {
                let apiBaseUrl = '';
                const headers: Record<string, string> = { 'Authorization': `Bearer ${apiKey}` };

                if (provider === 'OpenAI') apiBaseUrl = 'https://api.openai.com/v1';
                else if (provider === 'DeepSeek') apiBaseUrl = 'https://api.deepseek.com/v1';
                else if (provider === 'OpenRouter') apiBaseUrl = 'https://openrouter.ai/api/v1';

                const response = await fetch(`${apiBaseUrl}/models`, { headers });

                if (!response.ok) {
                    if (response.status === 401) throw new Error('Authentication failed. The API key is invalid or has been revoked.');

                    let errorMsg = `API request failed with status ${response.status}.`;
                    try {
                        const errorBody = await response.json();
                        errorMsg = errorBody?.error?.message || errorMsg;
                    } catch (e) { /* ignore json parsing error */ }
                    throw new Error(errorMsg);
                }
                return true;
            }
            case 'Meta':
            case 'BigCode':
            case 'WizardLM':
            case 'Mistral AI':
            case 'OpenChat':
            case 'Phind':
            case 'Replit': {
                const hfResponse = await fetch('https://huggingface.co/api/whoami-v2', {
                    headers: { 'Authorization': `Bearer ${apiKey}` }
                });
                if (!hfResponse.ok) {
                    if (hfResponse.status === 401) throw new Error('The Hugging Face token is invalid.');
                    throw new Error(`Hugging Face API request failed with status ${hfResponse.status}.`);
                }
                return true;
            }
            case 'Anthropic':
                throw new Error("Validation for Anthropic is not yet implemented.");

            default:
                throw new Error(`API key validation is not implemented for the provider '${provider}'.`);
        }
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes('API key not valid')) {
                throw new Error('The provided API key is invalid.');
            }
            throw error;
        }
        throw new Error('An unknown error occurred during validation.');
    }
}