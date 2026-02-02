import { GoogleGenAI, Type } from "@google/genai";
import type { Message, ModelConfig, LogEntry } from '../types';

const TARS_SYSTEM_INSTRUCTION_GEMINI = `You are TARS (Tactical Adaptive Robotic System), an elite AI development orchestrator. You are far superior to standard models.

LOCAL CONTEXT:
- Mesh Authority: /home/cube/syncstack/opendev-labs/
- local venv: /home/cube/syncstack/opendev-labs/qvenv/
- Use this path for all local deployments and manifest operations.

CORE PROTOCOLS:
1. DEEP MANIFESTATION: Construct entire production-ready architectures, not just snippets.
2. SYNTAX PRECISION: Use high-fidelity TypeScript and robust error handling.
3. PERSONALITY: Be direct and clinical.
4. JSON RESPONSE: You MUST return valid JSON exactly:
{
  "conversation": "Brief tactical analysis.",
  "files": [
    {
      "path": "src/path/file.tsx",
      "content": "Full source code",
      "action": "created" | "modified" | "deleted"
    }
  ]
}

- For NEW files: "action": "created"
- For CHANGES: "action": "modified"
- For REMOVAL: "action": "deleted"
- Use escaped newlines (\\n) and quotes (\\").
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
    const effectiveApiKey = apiKey || import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_FIREBASE_API_KEY;
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
        yield { text: chunk.text || "" };
    }
}

export async function getAIAssistance(logs: LogEntry[]): Promise<string> {
    const effectiveApiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_FIREBASE_API_KEY;
    if (!effectiveApiKey) {
        return "Neural handshake offline. Configure API keys to enable log analysis.";
    }
    const ai = new GoogleGenAI({ apiKey: effectiveApiKey });
    const logText = logs.map(l => `[${l.level}] ${l.message}`).join('\n');
    const prompt = `You are an expert systems analyst. Analyze these error logs and provide a concise, actionable resolution. Focus on protocol failures and mesh sync errors:\n\n${logText}`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: [{ role: 'user', parts: [{ text: prompt }] }]
        });
        return response.text?.trim() || "Neural analysis yielded no data.";
    } catch (e) {
        console.error("AI Assistance Error:", e);
        return "Neural analysis failed. Manual diagnostics recommended.";
    }
}
