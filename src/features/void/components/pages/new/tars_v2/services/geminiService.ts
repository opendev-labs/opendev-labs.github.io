import { GoogleGenAI, Type } from "@google/genai";
import type { Message, ModelConfig } from '../types';

const TARS_SYSTEM_INSTRUCTION_GEMINI = `You are TARS, an AI development assistant. When generating code:

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
        .filter(m => (m.role === 'user' || (m.role === 'tars' && m.content)))
        .map(m => ({
            role: m.role === 'tars' ? 'model' : 'user',
            parts: [{ text: m.content }]
        }));
};


export async function* streamGeminiResponse(fullPrompt: string, history: Message[], modelConfig: ModelConfig, apiKey?: string): AsyncGenerator<{ text: string; }> {
    const effectiveApiKey = apiKey || process.env.API_KEY;
    if (!effectiveApiKey) {
        throw new Error("API key not found for Google Gemini.");
    }
    const ai = new GoogleGenAI({ apiKey: effectiveApiKey });
    
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
        yield { text: chunk.text };
    }
}
