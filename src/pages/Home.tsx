import { Link, useNavigate } from 'react-router-dom';
import { Terminal, Database, Globe, ArrowRight, ShieldCheck, Zap, Box, Cpu, Bot } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import HeroBg from '../assets/bg.png';
import { motion } from 'framer-motion';
import { useAuth } from '../features/void/hooks/useAuth';
import { NewProjectIcon } from '../features/void/components/common/Icons';

const TechnologySection = () => {
    const techs = [
        { name: 'React', id: 'react' },
        { name: 'Next.js', id: 'nextjs' },
        { name: 'TypeScript', id: 'typescript' },
        { name: 'Node.js', id: 'nodejs' },
        { name: 'Python', id: 'python' },
        { name: 'Go', id: 'go' },
        { name: 'Rust', id: 'rust' },
        { name: 'PostgreSQL', id: 'postgres' },
        { name: 'Redis', id: 'redis' },
        { name: 'Vite', id: 'vite' },
        { name: 'Tailwind CSS', id: 'tailwind' },
        { name: 'Firebase', id: 'firebase' },
        { name: 'Astro', id: 'astro' },
        { name: 'Svelte', id: 'svelte' },
        { name: 'Vue', id: 'vue' },
        { name: 'Nuxt', id: 'nuxt' },
        { name: 'Remix', id: 'remix' },
        { name: 'Angular', id: 'angular' },
        { name: 'Docker', id: 'docker' },
        { name: 'AWS', id: 'aws' }
    ];

    return (
        <div className="py-24 border-y border-zinc-900 overflow-hidden bg-zinc-950/20 backdrop-blur-3xl relative z-10">
            <p className="text-[10px] font-bold tracking-[0.4em] text-zinc-600 mb-16 uppercase text-center">Engineered with Elite Tech Stacks</p>
            <div className="relative flex overflow-x-hidden">
                <div className="py-12 animate-marquee flex whitespace-nowrap gap-20">
                    {techs.concat(techs).map((tech, i) => (
                        <div key={`${tech.id}-${i}`} className="flex items-center gap-4 group cursor-default">
                            <img
                                src={`https://skillicons.dev/icons?i=${tech.id}`}
                                alt={tech.name}
                                className="h-10 w-10 grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-110"
                            />
                            <span className="text-zinc-600 group-hover:text-white font-bold text-xs uppercase tracking-[0.2em] transition-colors">{tech.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default function Home() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    return (
        <div className="flex flex-col w-full bg-black">
            {/* Hero Section */}
            <section className="relative min-h-[95vh] flex flex-col items-center justify-center pt-32 pb-20 overflow-hidden border-b border-zinc-900">
                {/* Background Image with Cinematic Depth */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <motion.img
                        initial={{ scale: 1.1, opacity: 0 }}
                        animate={{ scale: 1, opacity: 0.6 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        src={HeroBg}
                        alt="Background"
                        className="w-full h-full object-cover opacity-60"
                        style={{ objectPosition: 'center 20%' }}
                    />

                    {/* Dark Vignette Overlay */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.8) 50%, #000 80%)'
                        }}
                    />

                    {/* Grid Overlay */}
                    <div className="absolute inset-0 opacity-[0.05]"
                        style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
                    />
                </div>

                <div className="relative z-10 text-center max-w-5xl px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-3 px-4 py-1.5 rounded-none bg-white/5 border border-white/10 text-[10px] font-bold text-zinc-400 mb-10 uppercase tracking-[0.4em] backdrop-blur-md"
                    >
                        <span className="w-1.5 h-1.5 rounded-none bg-blue-500 animate-pulse" />
                        <span>Nexus Registry Protocol // v11.12</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-10 text-white leading-[0.8] lowercase px-4"
                    >
                        gh-face.<br />protocol.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-14 font-medium leading-relaxed uppercase tracking-widest opacity-80"
                    >
                        Unified state machine for high-fidelity autonomy and distributed sovereign clusters.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col md:flex-row items-center justify-center gap-6"
                    >
                        <div className="relative group">
                            {/* Black "Deploy" Button with NewProjectIcon */}
                            <Button
                                variant="secondary"
                                size="xl"
                                onClick={() => navigate('/void/new')}
                                className="bg-black border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 min-w-[200px] flex items-center justify-center gap-3"
                            >
                                <NewProjectIcon />
                                Deploy
                            </Button>
                        </div>
                        <Button
                            variant="primary"
                            size="xl"
                            onClick={() => navigate(isAuthenticated ? '/open-hub' : '/auth')}
                            className="min-w-[200px]"
                        >
                            {isAuthenticated ? 'Enter Open-Hub Mesh' : 'Identity Protocol // Link'}
                        </Button>
                    </motion.div>
                </div>

                {/* Bottom Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                >
                    <div className="w-px h-12 bg-gradient-to-t from-zinc-500 to-transparent" />
                </motion.div>
            </section>

            {/* Technologies Section */}
            <TechnologySection />

            {/* Platform Primitives Grid */}
            <section className="py-32 relative bg-black">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1 ring-1 ring-zinc-900 rounded-none overflow-hidden">
                        {[
                            { title: "open-studio IDE", desc: "Agentic full-screen workspace for code materialization.", icon: Cpu, path: "/open-studio" },
                            { title: "Agents Hub", desc: "Autonomous node orchestration and agent builder.", icon: Bot, path: "/agents" },
                            { title: "Void Platform", desc: "Neural orchestration and project lifecycle management.", icon: Terminal, path: "/void" },
                            { title: "LamaDB Mesh", desc: "Native browser database for local-first state persistence.", icon: Database, path: "/lamadb" },
                            { title: "SyncStack", desc: "0ms latency tunnel for web-to-desktop synchronization.", icon: Box, path: "/syncstack" }
                        ].map((item, i) => (
                            <motion.button
                                key={i}
                                whileHover={{ backgroundColor: 'rgba(24, 24, 27, 0.4)' }}
                                onClick={() => navigate(item.path)}
                                className="group p-12 bg-black border border-zinc-900 transition-all duration-500 text-left relative overflow-hidden focus:outline-none"
                            >
                                <div className="relative z-10">
                                    <div className="w-12 h-12 bg-zinc-950 border border-zinc-800 rounded-none flex items-center justify-center mb-10 group-hover:border-zinc-600 transition-colors">
                                        <item.icon size={20} className="text-zinc-500 group-hover:text-white" />
                                    </div>
                                    <h3 className="text-sm font-bold uppercase tracking-[0.3em] mb-4 text-white">{item.title}</h3>
                                    <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest leading-relaxed mb-10 opacity-60 group-hover:opacity-100 transition-opacity">
                                        {item.desc}
                                    </p>
                                    <div className="text-[10px] font-bold uppercase tracking-[0.4em] flex items-center gap-2 hover:text-white text-zinc-600 transition-colors">
                                        Identify <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Zap size={12} className="text-white animate-pulse" />
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Technical Excellence Section */}
            <section className="py-40 bg-black relative border-t border-zinc-900">
                <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
                    <div>
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-none bg-zinc-900 border border-zinc-800 text-[10px] font-bold text-zinc-500 mb-10 uppercase tracking-[0.4em]"
                        >
                            High-Fidelity Autonomy
                        </motion.div>
                        <h2 className="text-6xl md:text-7xl font-bold mb-10 tracking-tighter leading-[0.9] lowercase">
                            Develop at the speed <br /><span className="text-zinc-600">of thought.</span>
                        </h2>
                        <p className="text-zinc-500 text-lg leading-relaxed mb-14 font-medium max-w-lg uppercase tracking-widest text-[12px] opacity-80">
                            The opendev-labs stack eliminates the friction between intent and execution.
                        </p>

                        <div className="grid grid-cols-2 gap-10">
                            {[
                                { label: "Secure Default", icon: ShieldCheck },
                                { label: "Instant Deploy", icon: Zap },
                                { label: "Global Network", icon: Globe },
                                { label: "Deep Context", icon: Cpu }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4 group">
                                    <item.icon className="text-zinc-700 group-hover:text-white transition-colors" size={20} />
                                    <span className="text-[10px] font-bold text-zinc-400 group-hover:text-white uppercase tracking-[0.3em] transition-colors">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Card glass className="p-1">
                        <div className="bg-black rounded-none p-0 overflow-hidden shadow-3xl">
                            {/* Terminal Header */}
                            <div className="flex items-center justify-between px-6 py-4 bg-zinc-950 border-b border-zinc-900">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-none bg-zinc-800" />
                                    <div className="w-2.5 h-2.5 rounded-none bg-zinc-800" />
                                    <div className="w-2.5 h-2.5 rounded-none bg-zinc-800" />
                                </div>
                                <div className="text-[9px] uppercase tracking-[0.4em] font-bold text-zinc-700">Protocol Shell // spoon-cli</div>
                                <div className="w-12" />
                            </div>
                            {/* Terminal Content */}
                            <div className="p-10 font-mono text-[13px] leading-relaxed selection:bg-white selection:text-black">
                                <div className="flex gap-4">
                                    <span className="text-zinc-700">registry:</span>
                                    <span className="text-zinc-300">spoon protocol init "neural-mesh"</span>
                                </div>
                                <div className="text-zinc-600 pl-8 mt-4 space-y-1 mb-8">
                                    <p>▸ Identifying nodes... <span className="text-zinc-400">found 12</span></p>
                                    <p>▸ Initializing LamaDB... <span className="text-zinc-200 font-bold uppercase ml-2 text-[10px]">active</span></p>
                                    <p>▸ Linking Q-Cloud... <span className="text-zinc-200 font-bold uppercase ml-2 text-[10px]">active</span></p>
                                </div>
                                <div className="flex gap-4">
                                    <span className="text-zinc-700">registry:</span>
                                    <span className="text-zinc-300">spoon protocol push --fidelity=max</span>
                                </div>
                                <div className="mt-8 p-6 rounded-none bg-zinc-950 border border-zinc-900 shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-[2px] h-full bg-blue-600" />
                                    <div className="text-zinc-500 font-mono text-[9px] font-bold uppercase tracking-[0.3em] mb-3 opacity-50">Protocol Status</div>
                                    <div className="text-white font-mono font-bold text-[13px] leading-relaxed">
                                        <span className="text-emerald-500">✓</span> Uplink established.<br />
                                        <span className="text-zinc-600">▸</span> Environment live at <span className="text-blue-500 underline underline-offset-4 decoration-zinc-800 cursor-pointer hover:text-blue-400 transition-colors">opendev.app/nexus</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </section>
        </div>
    );
}
