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
    _manualApiKey?: string // Ignored in Zero-Config standard
): AsyncGenerator<{ text: string; }> {
    const effectiveApiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!effectiveApiKey) {
        throw new Error("Materialization handshake failed: VITE_GEMINI_API_KEY is not configured in the mesh environment.");
    }
    const ai = new GoogleGenAI({
        apiKey: effectiveApiKey,
        apiVersion: 'v1'
    });

    const contents = [
        ...toGeminiHistory(history),
        { role: 'user', parts: [{ text: fullPrompt }] }
    ];

    const result = await ai.models.generateContentStream({
        model: modelConfig.apiIdentifier,
        contents: contents,
        config: {
            systemInstruction: TARS_SYSTEM_INSTRUCTION_GEMINI,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    conversation: { type: Type.STRING },
                    files: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                path: { type: Type.STRING },
                                content: { type: Type.STRING },
                                action: { type: Type.STRING }
                            },
                            required: ['path', 'action']
                        }
                    }
                },
                required: ['conversation', 'files']
            }
        }
    });

    for await (const chunk of result) {
        yield { text: chunk.text || '' };
    }
}
