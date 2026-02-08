// api/materialize.js
export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    const { username, bio, energy, publicKey, fullName, headline } = req.body;
    const GITHUB_TOKEN = process.env.GITHUB_PAT;
    const REPO = 'opendev-labs/opendev-labs.github.io';
    const FILE_PATH = `user/${username}/index.html`;

    if (!GITHUB_TOKEN) {
        console.error('CRITICAL ERROR: GITHUB_PAT is missing from environment variables.');
        return res.status(500).json({ error: 'System Config Error: Missing Token' });
    }

    // 1. Construct Profile HTML
    const profileContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${username} | OpenDev Sovereign Node</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; }
        .glass-panel { background: rgba(10, 10, 10, 0.8); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.05); }
        .banner-gradient { background: linear-gradient(135deg, #0a0a0a 0%, #2a2a2a 100%); }
    </style>
</head>
<body class="bg-[#020202] text-gray-200 font-sans min-h-screen selection:bg-orange-500 selection:text-black">
    <nav class="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-white/5 h-16 flex items-center justify-between px-8">
        <a href="/" class="flex items-center gap-2">
            <div class="h-6 w-6 bg-orange-500 rounded-sm"></div>
            <span class="font-bold tracking-tighter text-sm uppercase tracking-[0.2em] text-white">opendev-labs</span>
        </a>
    </nav>

    <div class="w-full h-80 banner-gradient relative overflow-hidden">
        <div class="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-[#020202] to-transparent"></div>
    </div>

    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10 grid grid-cols-1 md:grid-cols-4 gap-8 pb-32">
        <div class="md:col-span-1 space-y-6">
            <div class="glass-panel rounded-3xl p-8 text-center shadow-2xl overflow-hidden">
                <div class="w-40 h-40 mx-auto bg-zinc-900 rounded-[2.5rem] border-4 border-[#020202] overflow-hidden relative shadow-2xl z-10">
                    <img src="https://github.com/identicons/${username}.png" alt="Avatar" class="w-full h-full object-cover">
                </div>
                <h1 class="text-3xl font-black text-white mt-6 tracking-tighter lowercase">${fullName || username}</h1>
                <p class="text-zinc-500 text-[10px] font-bold tracking-[0.3em] uppercase mt-1">@${username}</p>
                <p class="text-orange-500 text-[9px] font-bold uppercase tracking-[0.2em] mt-4 py-1.5 px-3 bg-orange-500/10 rounded-full inline-block border border-orange-500/20">${headline || 'Sovereign Node'}</p>
                <div class="mt-10 text-left space-y-6 border-t border-white/5 pt-8">
                    <div>
                        <div class="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-3">Frequency</div>
                        <div class="text-xs font-bold text-white bg-white/5 p-4 rounded-2xl border border-white/5 text-center">${energy || 'Unknown Resonance'}</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="md:col-span-2 space-y-8">
            <div class="glass-panel rounded-3xl p-6 flex items-center gap-5 border-white/5">
                <div class="w-12 h-12 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center">
                    <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <div class="flex-1 bg-black/40 border border-white/5 rounded-2xl h-14 px-6 flex items-center text-zinc-500 text-xs font-medium">
                    Node ${username} materialized. Live on OpenDev Mesh.
                </div>
            </div>
            <div class="glass-panel rounded-[2.5rem] p-10 border-white/5 relative overflow-hidden">
                <div class="flex items-center gap-4 mb-10 pb-6 border-b border-white/5">
                    <div class="w-12 h-12 rounded-2xl bg-zinc-900 overflow-hidden border border-white/5">
                         <img src="https://github.com/identicons/${username}.png" alt="Avatar" class="w-full h-full object-cover">
                    </div>
                    <div>
                        <div class="text-white font-bold text-base tracking-tight">${username}</div>
                        <div class="text-emerald-500 text-[9px] font-bold uppercase tracking-[0.2em]">Materialized // Sovereign</div>
                    </div>
                </div>
                <p class="text-zinc-300 leading-relaxed text-xl font-medium">${bio}</p>
            </div>
        </div>

        <div class="md:col-span-1 space-y-6">
            <div class="glass-panel rounded-3xl p-8 border-white/5">
                <h3 class="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.4em] mb-8">Proof of Identity</h3>
                <div class="break-all font-mono text-[9px] text-zinc-600 bg-black/50 p-4 rounded-2xl border border-white/5 leading-relaxed">
                    ${publicKey || 'N/A'}
                </div>
            </div>
        </div>
    </div>
</body>
</html>
`;

    try {
        // 2. Check if file exists to get SHA (needed for updates)
        let sha = null;
        try {
            const checkRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`, {
                headers: {
                    'Authorization': `Bearer ${GITHUB_TOKEN}`,
                    'User-Agent': 'OpenDev-Sovereign-Gateway'
                }
            });
            if (checkRes.ok) {
                const existingFile = await checkRes.json();
                sha = existingFile.sha;
            }
        } catch (e) {
            console.log("File is new, no SHA found.");
        }

        // 3. Commit to GitHub
        const response = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${GITHUB_TOKEN}`,
                'Content-Type': 'application/json',
                'User-Agent': 'OpenDev-Sovereign-Gateway'
            },
            body: JSON.stringify({
                message: `feat(identity): ${sha ? 'update' : 'materialize'} node ${username}`,
                content: Buffer.from(profileContent).toString('base64'),
                branch: 'main',
                ...(sha && { sha })
            })
        });

        if (response.ok) {
            return res.status(200).json({ success: true, url: `https://opendev-labs.github.io/user/${username}` });
        } else {
            const errorData = await response.json();
            console.error('GITHUB REJECTION:', errorData);
            return res.status(response.status).json({
                error: 'GitHub Rejection',
                message: errorData.message,
                details: errorData
            });
        }
    } catch (err) {
        console.error('GATEWAY MALFUNCTION:', err);
        return res.status(500).json({ error: 'Gateway Malfunction', message: err.message });
    }
}
