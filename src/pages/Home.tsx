import { Link, useNavigate } from 'react-router-dom';
import { Terminal, Database, Globe, ArrowRight, Code2, Rocket, Users, Zap, GitBranch, Layers, Cpu, Bot } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../features/void/hooks/useAuth';

/* ─────────────────────────────────────────────────────
   TECHNOLOGY ROW — Grayscale, static
   ─────────────────────────────────────────────────── */
const TechRow = () => {
    const techs = ['react', 'nextjs', 'typescript', 'nodejs', 'vite', 'tailwind'];
    return (
        <div className="border-y border-zinc-800/60 py-12">
            <div className="max-w-[1100px] mx-auto px-6 flex flex-wrap justify-center items-center gap-12 opacity-40">
                {techs.map((id) => (
                    <img
                        key={id}
                        src={`https://skillicons.dev/icons?i=${id}`}
                        alt={id}
                        className="h-7 w-auto grayscale"
                    />
                ))}
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────────────
   SCENARIO CARD — OpenSandbox-style feature card
   ─────────────────────────────────────────────────── */
const ScenarioCard = ({ icon: Icon, title, desc, path, onClick }: {
    icon: any; title: string; desc: string; path: string; onClick: () => void;
}) => (
    <button
        onClick={onClick}
        className="group text-left p-8 bg-zinc-950/50 border border-zinc-800/60 rounded-lg hover:border-zinc-700 hover:bg-zinc-900/40 transition-all duration-300"
    >
        <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6 group-hover:border-zinc-600 transition-colors">
            <Icon size={18} className="text-zinc-500 group-hover:text-white transition-colors" />
        </div>
        <h3 className="text-[15px] font-semibold text-white mb-2 tracking-tight">{title}</h3>
        <p className="text-[13px] text-zinc-500 leading-relaxed mb-6">{desc}</p>
        <span className="text-[13px] text-zinc-600 group-hover:text-blue-400 flex items-center gap-1.5 transition-colors">
            Learn more <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </span>
    </button>
);

/* ─────────────────────────────────────────────────────
   CODE SNIPPET — "Get started" quick-start block
   ─────────────────────────────────────────────────── */
const CodeBlock = () => (
    <div className="bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/60">
            <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
            </div>
            <span className="text-[11px] text-zinc-600 font-mono">terminal</span>
        </div>
        <div className="p-6 font-mono text-[13px] leading-relaxed space-y-3">
            <div>
                <span className="text-zinc-600">$</span>{' '}
                <span className="text-zinc-300">open your browser</span>
            </div>
            <div>
                <span className="text-zinc-600">$</span>{' '}
                <span className="text-zinc-300">go to</span>{' '}
                <span className="text-blue-400">opendev-labs.github.io/open-studio</span>
            </div>
            <div>
                <span className="text-zinc-600">$</span>{' '}
                <span className="text-zinc-300">type what you want to build</span>
            </div>
            <div className="pt-2 border-t border-zinc-800/40">
                <span className="text-emerald-500">✓</span>{' '}
                <span className="text-zinc-400">Your app is ready. Deploy with one click.</span>
            </div>
        </div>
    </div>
);

/* ─────────────────────────────────────────────────────
   STAT
   ─────────────────────────────────────────────────── */
const Stat = ({ value, label }: { value: string; label: string }) => (
    <div className="text-center">
        <div className="text-3xl md:text-4xl font-bold text-white tracking-tight">{value}</div>
        <div className="text-[13px] text-zinc-500 mt-1">{label}</div>
    </div>
);

/* ═══════════════════════════════════════════════════
   HOME PAGE
   ═══════════════════════════════════════════════════ */
export default function Home() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    return (
        <div className="flex flex-col w-full bg-black min-h-screen">

            {/* ── HERO ─────────────────────────────── */}
            <section className="relative isolate px-6 pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden">
                {/* Subtle dot grid */}
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }}
                />

                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.05] mb-8"
                    >
                        Build, deploy, and share<br />
                        <span className="text-zinc-500">with AI</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed"
                    >
                        OpenStudio is an AI-powered IDE that runs real code, installs any npm package,
                        and deploys to GitHub Pages — all in your browser.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <button
                            onClick={() => navigate(isAuthenticated ? '/open-studio' : '/auth')}
                            className="px-8 py-3.5 bg-white text-black text-[11px] font-bold uppercase tracking-[0.2em] rounded-md hover:bg-zinc-200 transition-all shadow-xl"
                        >
                            Configure Handshake →
                        </button>
                        <button
                            onClick={() => navigate('/docs')}
                            className="px-8 py-3.5 bg-black/40 text-white text-[11px] font-bold uppercase tracking-[0.2em] rounded-md border border-zinc-800 hover:bg-zinc-900 transition-all backdrop-blur-sm"
                        >
                            Nexus Manifest
                        </button>
                    </motion.div>

                    <p className="mt-12 text-[10px] text-zinc-700 font-bold uppercase tracking-[0.6em] animate-pulse">
                        Protocol 2026 // Decentralized Materialization
                    </p>
                </div>
            </section>

            {/* ── TECHNOLOGY ROW ───────────────────── */}
            <TechRow />

            {/* ── SCENARIO CARDS ────────────────────── */}
            <section className="py-32">
                <div className="max-w-[1100px] mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
                            Everything you need to build
                        </h2>
                        <p className="text-[17px] text-zinc-500 max-w-xl mx-auto leading-relaxed">
                            AI-powered tools that actually work. No install required.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <ScenarioCard
                            icon={Zap}
                            title="OpenStudio IDE"
                            desc="AI code generation with real npm execution. Install any package, run any framework."
                            path="/open-studio"
                            onClick={() => navigate('/open-studio')}
                        />
                        <ScenarioCard
                            icon={Users}
                            title="OpenHub Social"
                            desc="Share projects, discover others, and build your developer network."
                            path="/open-hub"
                            onClick={() => navigate(isAuthenticated ? '/open-hub' : '/auth')}
                        />
                        <ScenarioCard
                            icon={Rocket}
                            title="One-Click Deploy"
                            desc="Deploy to GitHub Pages instantly. Your generated app goes live in seconds."
                            path="/open-studio"
                            onClick={() => navigate('/open-studio')}
                        />
                    </div>
                </div>
            </section>

            {/* ── TWO-COL: DESCRIPTION + CODE BLOCK ── */}
            <section className="py-24 md:py-32 border-t border-zinc-900">
                <div className="max-w-[1100px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-6 leading-tight">
                            Get started in seconds
                        </h2>
                        <p className="text-[15px] text-zinc-400 leading-relaxed mb-8 max-w-md">
                            No install, no setup. Open your browser, describe what you want, and OpenStudio
                            generates a complete project with live preview. Then deploy to GitHub Pages with one click.
                        </p>
                        <div className="space-y-4">
                            {[
                                { icon: Zap, text: 'Real npm packages in the browser' },
                                { icon: Globe, text: 'Live preview with hot reload' },
                                { icon: Rocket, text: 'One-click GitHub Pages deploy' },
                                { icon: Bot, text: 'Multiple AI models (Gemini, GPT-4, DeepSeek)' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <item.icon size={16} className="text-zinc-600 flex-shrink-0" />
                                    <span className="text-[14px] text-zinc-400">{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <CodeBlock />
                </div>
            </section>

            {/* ── STATS ──────────────────────────────── */}
            <section className="py-20 border-t border-zinc-900">
                <div className="max-w-[800px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
                    <Stat value="15+" label="AI Models" />
                    <Stat value="6" label="Frameworks" />
                    <Stat value="∞" label="npm Packages" />
                    <Stat value="1-Click" label="Deploy" />
                </div>
            </section>

            {/* ── CTA ────────────────────────────────── */}
            <section className="py-24 md:py-32 border-t border-zinc-900">
                <div className="max-w-[600px] mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
                        Start building today
                    </h2>
                    <p className="text-[15px] text-zinc-500 mb-8">
                        Open source. No install required. Works in your browser.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <button
                            onClick={() => navigate(isAuthenticated ? '/open-studio' : '/auth')}
                            className="px-6 py-3 bg-white text-black text-[14px] font-semibold rounded-lg hover:bg-zinc-200 transition-colors"
                        >
                            Open Studio
                        </button>
                        <a
                            href="https://github.com/opendev-labs"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-3 text-[14px] font-medium text-zinc-400 border border-zinc-800 rounded-lg hover:border-zinc-600 hover:text-white transition-all"
                        >
                            GitHub
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
