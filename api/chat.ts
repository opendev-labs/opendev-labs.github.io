export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  // 1. Handle CORS for requests coming from opendev-labs.github.io
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
    // 2. Read the prompt request sent by your frontend
    const body = await req.json();
    const { model, contents, systemInstruction } = body;

    // 3. SECURELY read the API key from Vercel's backend environment
    const apiKey = process.env.SECURE_GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing Backend Key. Add SECURE_GEMINI_API_KEY to Vercel Env Vars." }), { 
          status: 500,
          headers: { 'Access-Control-Allow-Origin': '*' }
      });
    }

    // Normalize model name - strip any "models/" prefix
    const rawModel = model || 'gemini-2.0-flash';
    const modelId = rawModel.replace(/^models\//, '');
    
    // Prepare system instruction part safely
    const sysInstPayload = systemInstruction 
        ? { parts: [{ text: systemInstruction }] }
        : undefined;

    // 4. Forward the exact request to Google's REST API securely
    // Must use v1beta — systemInstruction and responseMimeType are NOT in v1
    const googleRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:streamGenerateContent?alt=sse&key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          ...(sysInstPayload && { systemInstruction: sysInstPayload }),
        }),
      }
    );

    if (!googleRes.ok) {
         const errText = await googleRes.text();
         return new Response(JSON.stringify({ error: `Google API Error: ${errText}` }), { 
             status: googleRes.status,
             headers: { 'Access-Control-Allow-Origin': '*' }
         });
    }

    // 5. Stream the response directly back to your frontend
    return new Response(googleRes.body, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { 
        status: 500,
        headers: { 'Access-Control-Allow-Origin': '*' }
    });
  }
}
