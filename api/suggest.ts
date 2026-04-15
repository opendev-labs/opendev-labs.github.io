export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  try {
    const { context } = await req.json();
    const apiKey = process.env.SECURE_GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing Backend Key." }), { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } });
    }

    const systemInstruction = `You are an expert developer assistant. Based on the user's last request and the files that were generated, provide 3-4 short, actionable follow-up prompts. Return a JSON object with a single key "suggestions" which is an array of strings. Example: {"suggestions": ["Make it responsive", "Add a loading state"]}`;

    const googleRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: context }] }],
          systemInstruction: { parts: [{ text: systemInstruction }] },
          generationConfig: { responseMimeType: "application/json" }
        })
      }
    );

    const data = await googleRes.json();
    const suggestionsText = data.candidates?.[0]?.content?.parts?.[0]?.text || '{"suggestions":[]}';

    return new Response(suggestionsText, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } });
  }
}
