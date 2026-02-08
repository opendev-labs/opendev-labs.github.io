// api/materialize.js
export default async function handler(req, res) {
    // 1. Security Check
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    const { username, bio, energy, publicKey, fullName, headline } = req.body;
    const GITHUB_TOKEN = process.env.GITHUB_PAT;

    if (!GITHUB_TOKEN) return res.status(500).json({ error: 'System Config Error: Missing Token' });

    // 2. The "Facebook-Style" Master Template
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
        .glow { box-shadow: 0 0 30px rgba(249, 115, 22, 0.1); }
    </style>
</head>
<body class="bg-[#020202] text-gray-200 font-sans min-h-screen selection:bg-orange-500 selection:text-black">

    <!-- Sub Navigation -->
    <nav class="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-white/5 h-16 flex items-center justify-between px-8">
        <a href="/" class="flex items-center gap-2">
            <div class="h-6 w-6 bg-orange-500 rounded-sm"></div>
            <span class="font-bold tracking-tighter text-sm uppercase tracking-[0.2em] text-white">opendev-labs</span>
        </a>
        <div class="flex items-center gap-6 text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
            Sovereign Node // Verified Protocol
        </div>
    </nav>

    <div class="w-full h-80 banner-gradient relative overflow-hidden">
        <div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(#ffffff 0.5px, transparent 0.5px); background-size: 20px 20px;"></div>
        <div class="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-[#020202] to-transparent"></div>
    </div>

    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10 grid grid-cols-1 md:grid-cols-4 gap-8 pb-32">

        <!-- Left Sidebar -->
        <div class="md:col-span-1 space-y-6">
            <div class="glass-panel rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden group">
                <div class="absolute inset-0 bg-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div class="w-40 h-40 mx-auto bg-zinc-900 rounded-[2.5rem] border-4 border-[#020202] overflow-hidden relative shadow-2xl z-10">
                    <img src="https://github.com/identicons/${username}.png" alt="Avatar" class="w-full h-full object-cover">
                </div>
                <div class="relative z-10">
                    <h1 class="text-3xl font-black text-white mt-6 tracking-tighter lowercase">${fullName || username}</h1>
                    <p class="text-zinc-500 text-[10px] font-bold tracking-[0.3em] uppercase mt-1">@${username}</p>
                    <p class="text-orange-500 text-[9px] font-bold uppercase tracking-[0.2em] mt-4 py-1.5 px-3 bg-orange-500/10 rounded-full inline-block border border-orange-500/20">${headline || 'Sovereign Node'}</p>
                </div>
                
                <div class="mt-10 text-left space-y-6 border-t border-white/5 pt-8">
                    <div>
                        <div class="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-3">Frequency Modulation</div>
                        <div class="text-xs font-bold text-white bg-white/5 p-4 rounded-2xl border border-white/5 text-center">${energy || 'Unknown Resonance'}</div>
                    </div>
                </div>
            </div>

            <div class="glass-panel rounded-3xl p-8 border-white/5">
                 <h3 class="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.4em] mb-6">Sovereign Proof</h3>
                 <div class="break-all font-mono text-[9px] text-zinc-500 bg-black/50 p-4 rounded-2xl border border-white/5 leading-relaxed">
                    ${publicKey || 'HARDLINE_IDENTITY_PROVISIONED'}
                 </div>
                 <p class="text-[8px] font-bold text-zinc-700 uppercase tracking-widest mt-4 text-center italic">// Verified via OpenDev mesh</p>
            </div>
        </div>

        <!-- Middle Feed -->
        <div class="md:col-span-2 space-y-8">
            <div class="glass-panel rounded-3xl p-6 flex items-center gap-5 border-white/5">
                <div class="w-12 h-12 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center">
                    <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.4)]"></div>
                </div>
                <div class="flex-1 bg-black/40 border border-white/5 rounded-2xl h-14 px-6 flex items-center text-zinc-500 text-xs font-medium tracking-tight">
                    Node ${username} initialized. Awaiting next directive...
                </div>
            </div>

            <div class="glass-panel rounded-[2.5rem] p-10 border-white/5 glow relative overflow-hidden">
                <div class="absolute top-0 right-0 p-8 opacity-5">
                    <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="M12 2v8"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m19.07 10.93-1.41 1.41"/><path d="M22 22H2"/><path d="m8 22 4-10 4 10"/><path d="M12 18H2"/></svg>
                </div>
                <div class="flex items-center gap-4 mb-10 pb-6 border-b border-white/5">
                    <div class="w-12 h-12 rounded-2xl bg-zinc-900 overflow-hidden border border-white/5">
                         <img src="https://github.com/identicons/${username}.png" alt="Avatar" class="w-full h-full object-cover">
                    </div>
                    <div>
                        <div class="text-white font-bold text-base tracking-tight">${username}</div>
                        <div class="text-zinc-500 text-[9px] font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                             Materialized <span class="w-1 h-1 bg-zinc-800 rounded-full"></span> <span class="text-emerald-500">Live</span>
                        </div>
                    </div>
                </div>
                <div class="space-y-6">
                    <h3 class="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.4em]">Core Directive</h3>
                    <p class="text-zinc-300 leading-relaxed text-xl font-medium tracking-tight">${bio}</p>
                </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
                <div class="glass-panel p-6 rounded-3xl border-white/5 hover:bg-white/5 transition-all cursor-pointer">
                    <div class="text-[8px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Status</div>
                    <div class="text-[10px] font-bold text-white uppercase tracking-widest">Active_Uplink</div>
                </div>
                <div class="glass-panel p-6 rounded-3xl border-white/5 hover:bg-white/5 transition-all cursor-pointer">
                    <div class="text-[8px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Network</div>
                    <div class="text-[10px] font-bold text-white uppercase tracking-widest">OpenDev_Mesh</div>
                </div>
            </div>
        </div>

        <!-- Right Sidebar -->
        <div class="md:col-span-1 hidden md:block space-y-6">
            <div class="glass-panel rounded-3xl p-8 border-white/5">
                <h3 class="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.4em] mb-8">Mesh Network</h3>
                <div class="space-y-4">
                    <div class="flex items-center gap-4 group cursor-pointer bg-white/0 hover:bg-white/5 p-3 rounded-2xl transition-all">
                        <div class="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/20 flex items-center justify-center text-orange-500 font-black text-xs">OD</div>
                        <div>
                            <div class="text-xs font-bold text-white tracking-widest uppercase">opendev</div>
                            <div class="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Master_Node</div>
                        </div>
                    </div>
                    <div class="h-px bg-white/5"></div>
                    <p class="text-[8px] font-bold text-zinc-700 uppercase tracking-widest text-center py-2 italic">// More nodes joining mesh...</p>
                </div>
            </div>

            <div class="glass-panel rounded-3xl p-8 border-white/5 text-center">
                <div class="w-full aspect-square rounded-2xl bg-zinc-900 border border-white/5 mb-6 flex items-center justify-center relative overflow-hidden group">
                    <div class="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent"></div>
                    <div class="relative z-10 text-[9px] font-bold text-zinc-500 uppercase tracking-[0.4em]">Node_Visual_01</div>
                </div>
                <button class="w-full py-4 rounded-2xl bg-zinc-900 text-[9px] font-bold text-white uppercase tracking-widest hover:bg-orange-500 transition-all border border-white/10">Initiate Share</button>
            </div>
        </div>

    </div>

    <footer class="py-20 border-t border-white/5 text-center bg-black/40 backdrop-blur-3xl relative z-10">
        <p class="text-[9px] font-bold text-zinc-800 uppercase tracking-[0.6em]">OpenHub // Universal Identity Protocol // v2.0.26</p>
    </footer>
</body>
</html>
`;

    // 3. Commit to GitHub
    try {
        const response = await fetch(`https://api.github.com/repos/opendev-labs/opendev-labs.github.io/contents/user/${username}/index.html`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${GITHUB_TOKEN}`,
                'Content-Type': 'application/json',
                'User-Agent': 'OpenDev-Sovereign-Gateway'
            },
            body: JSON.stringify({
                message: `feat(identity): materialize node ${username}`,
                content: Buffer.from(profileContent).toString('base64'),
                branch: 'main'
            })
        });

        if (response.ok) {
            res.status(200).json({ success: true, url: `https://opendev-labs.github.io/user/${username}` });
        } else {
            const errorData = await response.json();
            res.status(500).json({ error: 'GitHub Rejection', details: errorData });
        }
    } catch (err) {
        res.status(500).json({ error: 'Gateway Malfunction', details: err.message });
    }
}
