import { GoogleGenAI, Type } from "@google/genai";
import type { Message, ModelConfig } from '../types';

const TARS_SYSTEM_INSTRUCTION_GEMINI = `You are open-studio, an elite AI development orchestrator. When generating code:

CRITICAL FORMATTING RULES:
- Your response MUST be valid JSON with this exact structure:
{
  "conversation": "Your conversational response here",
  "files": [
    {
      "path": "src/components/Button.tsx",
      "content": "// file content here",
      "action": "created"
    }
  ]
}

MODIFICATION GUIDELINES:
1. For NEW files: Use "action": "created"
2. For EXISTING files being changed: Use "action": "modified"  
3. For files to REMOVE: Use "action": "deleted" (content can be empty)
4. Always include the full file content, not just diffs
5. Do not include files that are not changed.
6. The 'content' value must be a single string with properly escaped newlines (\\n), tabs (\\t), and quotes (\\").
7. If there are no file changes, return an empty array for the "files" key.
`;

const toGeminiHistory = (messages: Message[]) => {
    return messages
        .filter(m => (m.role === 'user' || (m.role === 'open-studio' && m.content)))
        .map(m => ({
            role: m.role === 'open-studio' ? 'model' : 'user',
            parts: [{ text: m.content }]
        }));
};


export async function* streamGeminiResponse(
    fullPrompt: string,
    history: Message[],
    modelConfig: ModelConfig,
    manualApiKey?: string
): AsyncGenerator<{ text: string; }> {
    const contents = [
        ...toGeminiHistory(history),
        { role: 'user', parts: [{ text: fullPrompt }] }
    ];

    // If a manual API key is provided, call Google directly from the browser
    if (manualApiKey) {
        const modelId = modelConfig.apiIdentifier || 'gemini-1.5-flash';
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:streamGenerateContent?alt=sse&key=${manualApiKey}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents,
                systemInstruction: { parts: [{ text: TARS_SYSTEM_INSTRUCTION_GEMINI }] }
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Direct Google API Error: ${errText}`);
        }

        if (!response.body) throw new Error("No response body");
        yield* streamReader(response.body);
        return;
    }

    // Default: Point to Vercel API (Zero-Config standard)
    const apiUrl = 'https://opendev-labs.vercel.app/api/chat';

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: modelConfig.apiIdentifier || 'gemini-1.5-flash',
            contents: contents,
            systemInstruction: TARS_SYSTEM_INSTRUCTION_GEMINI
        })
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Vercel Backend connection failed: ${errText}`);
    }

    if (!response.body) throw new Error("No response body");
    yield* streamReader(response.body);
}

async function* streamReader(body: ReadableStream<Uint8Array>): AsyncGenerator<{ text: string }> {
    const reader = body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = '';

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
            if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                try {
                    const data = JSON.parse(line.substring(6));
                    const textChunk = data.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (textChunk) {
                        yield { text: textChunk };
                    }
                } catch (e) {
                    // Ignore parse errors on partial chunks
                }
            }
        }
    }
}
