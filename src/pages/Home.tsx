import { Link, useNavigate } from 'react-router-dom';
import { Terminal, Database, Globe, ArrowRight, Code2, Rocket, Users, Zap, GitBranch, Layers, Cpu, Bot } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../features/void/hooks/useAuth';

/* ─────────────────────────────────────────────────────
   TECHNOLOGY TICKER — Grayscale icons, auto-scroll
   ─────────────────────────────────────────────────── */
const TechTicker = () => {
    const techs = [
        'react', 'nextjs', 'typescript', 'nodejs', 'python', 'go', 'rust',
        'postgres', 'redis', 'vite', 'tailwind', 'firebase', 'svelte', 'vue', 'docker'
    ];
    return (
        <div className="border-y border-zinc-900 overflow-hidden py-8">
            <div className="relative flex overflow-x-hidden">
                <div className="animate-marquee flex whitespace-nowrap gap-12 items-center">
                    {techs.concat(techs).map((id, i) => (
                        <img
                            key={`${id}-${i}`}
                            src={`https://skillicons.dev/icons?i=${id}`}
                            alt={id}
                            className="h-8 w-8 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                        />
                    ))}
                </div>
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
            <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden">
                {/* Subtle dot grid */}
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }}
                />

                <div className="relative z-10 max-w-[900px] mx-auto px-6 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1] mb-6"
                    >
                        Universal Development{' '}
                        <span className="text-zinc-500">Platform</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed"
                    >
                        Code, deploy, and share — all in one place. AI-powered IDE with real npm execution
                        and one-click GitHub Pages deployment.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-3"
                    >
                        <button
                            onClick={() => navigate(isAuthenticated ? '/open-studio' : '/auth')}
                            className="px-6 py-3 bg-white text-black text-[14px] font-semibold rounded-lg hover:bg-zinc-200 transition-colors"
                        >
                            Get Started
                        </button>
                        <button
                            onClick={() => navigate('/docs')}
                            className="px-6 py-3 text-[14px] font-medium text-zinc-400 border border-zinc-800 rounded-lg hover:border-zinc-600 hover:text-white transition-all"
                        >
                            Documentation
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* ── TECH TICKER ──────────────────────── */}
            <TechTicker />

            {/* ── SCENARIO CARDS ────────────────────── */}
            <section className="py-24 md:py-32">
                <div className="max-w-[1100px] mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
                            Built for developers
                        </h2>
                        <p className="text-[15px] text-zinc-500 max-w-lg mx-auto">
                            Everything you need to build, share, and deploy software projects.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <ScenarioCard
                            icon={Code2}
                            title="OpenStudio IDE"
                            desc="AI code generation with real npm packages. Write a prompt, get a working app with live preview."
                            path="/open-studio"
                            onClick={() => navigate('/open-studio')}
                        />
                        <ScenarioCard
                            icon={Users}
                            title="OpenHub Social"
                            desc="Developer feed to share projects, follow builders, and discover what others are creating."
                            path="/open-hub"
                            onClick={() => navigate(isAuthenticated ? '/open-hub' : '/auth')}
                        />
                        <ScenarioCard
                            icon={Rocket}
                            title="Deploy to GitHub"
                            desc="One-click deployment to GitHub Pages. Your generated app goes live with a real URL instantly."
                            path="/open-studio"
                            onClick={() => navigate('/open-studio')}
                        />
                        <ScenarioCard
                            icon={Layers}
                            title="Multi-Framework"
                            desc="Generate React, Vue, Svelte, or vanilla HTML/CSS/JS projects. Sandpack handles all frameworks."
                            path="/open-studio"
                            onClick={() => navigate('/open-studio')}
                        />
                        <ScenarioCard
                            icon={Database}
                            title="Session Persistence"
                            desc="Your work saves automatically. Come back to any project — code, chat history, everything is preserved."
                            path="/open-studio"
                            onClick={() => navigate('/open-studio')}
                        />
                        <ScenarioCard
                            icon={GitBranch}
                            title="GitHub Integration"
                            desc="Connected to your GitHub account. Create repos, push code, and manage your projects seamlessly."
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
