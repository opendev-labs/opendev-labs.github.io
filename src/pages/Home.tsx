import { Link } from 'react-router-dom';
import { Terminal, Database, Cpu, Globe, ArrowRight, ShieldCheck, Zap, Box } from 'lucide-react';
import HeroBg from '../assets/bg.png';

export default function Home() {
    return (
        <div className="flex flex-col w-full">
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex flex-col items-center justify-start pt-32 pb-20 overflow-hidden border-b border-[#333]">
                {/* Background Image with Cinematic Blur */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <img
                        src={HeroBg}
                        alt="Background"
                        className="w-full h-full object-cover opacity-60 scale-105 will-change-transform"
                        style={{ objectPosition: 'center 20%' }}
                    />

                    {/* Dark Vignette Overlay - Darker at edges */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background: 'radial-gradient(circle at center, transparent 5%, rgba(0,0,0,0.95) 45%, #000 75%)'
                        }}
                    />
                </div>

                <div className="relative z-10 text-center max-w-5xl px-6">
                    {/* Transparent Text Container */}
                    <div className="p-8 md:p-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 border border-white/10 text-sm text-zinc-200 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 backdrop-blur-sm">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span>LamaDB 2.0 is now available in Beta</span>
                        </div>

                        <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-8 text-white drop-shadow-xl leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
                            Build and deploy <br /> on the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 drop-shadow-none">Q-Cloud</span>.
                        </h1>
                        <p className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow-lg font-medium animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                            opendev-labs provides the sovereign tools and quantum infrastructure to build, scale, and secure a faster, more programmable reality.
                        </p>

                        <div className="flex flex-col md:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                            <Link to="/void" className="h-12 px-10 rounded-full bg-white text-black text-[11px] font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 justify-center shadow-lg">
                                <svg className="w-4 h-4" viewBox="0 0 116 100" fill="currentColor"><path fillRule="evenodd" clipRule="evenodd" d="M57.5 100L0 0H116L57.5 100Z" /></svg>
                                Deploy Now
                            </Link>
                            <Link to="/contact" className="h-12 px-10 rounded-full bg-black border border-zinc-800 text-white text-[11px] font-bold uppercase tracking-widest hover:bg-zinc-900 transition-all hover:scale-105 active:scale-95 flex items-center justify-center shadow-lg">
                                Documentation
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 relative overflow-hidden">
                <div className="max-w-[1200px] mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1">
                        <div className="group p-8 bg-black border border-zinc-900 transition-all hover:bg-zinc-950 duration-500">
                            <div className="w-10 h-10 bg-white/5 border border-white/10 rounded flex items-center justify-center mb-8 group-hover:border-zinc-500 transition-colors">
                                <Terminal size={18} className="text-zinc-400 group-hover:text-white" />
                            </div>
                            <h3 className="text-sm font-bold uppercase tracking-widest mb-3 text-white">Platform</h3>
                            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed mb-6">
                                High-performance development environment with built-in AI intelligence.
                            </p>
                            <Link to="/void" className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 hover:text-white transition-colors">
                                Open Platform <ArrowRight size={14} />
                            </Link>
                        </div>

                        <div className="group p-8 bg-black border border-zinc-900 transition-all hover:bg-zinc-950 duration-500">
                            <div className="w-10 h-10 bg-white/5 border border-white/10 rounded flex items-center justify-center mb-8 group-hover:border-zinc-500 transition-colors">
                                <Database size={18} className="text-zinc-400 group-hover:text-white" />
                            </div>
                            <h3 className="text-sm font-bold uppercase tracking-widest mb-3 text-white">LamaDB</h3>
                            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed mb-6">
                                Native browser database for high-velocity local state management.
                            </p>
                            <Link to="/lamadb" className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 hover:text-white transition-colors">
                                Explore DB <ArrowRight size={14} />
                            </Link>
                        </div>

                        <div className="group p-8 bg-black border border-zinc-900 transition-all hover:bg-zinc-950 duration-500">
                            <div className="w-10 h-10 bg-white/5 border border-white/10 rounded flex items-center justify-center mb-8 group-hover:border-zinc-500 transition-colors">
                                <Globe size={18} className="text-zinc-400 group-hover:text-white" />
                            </div>
                            <h3 className="text-sm font-bold uppercase tracking-widest mb-3 text-white">Q-Cloud</h3>
                            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed mb-6">
                                Quantum-ready serverless infrastructure with sub-atomic latency.
                            </p>
                            <Link to="/q-cloud" className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 hover:text-white transition-colors">
                                View Infra <ArrowRight size={14} />
                            </Link>
                        </div>

                        <div className="group p-8 bg-black border border-zinc-900 transition-all hover:bg-zinc-950 duration-500">
                            <div className="w-10 h-10 bg-white/5 border border-white/10 rounded flex items-center justify-center mb-8 group-hover:border-zinc-500 transition-colors">
                                <Box size={18} className="text-zinc-400 group-hover:text-white" />
                            </div>
                            <h3 className="text-sm font-bold uppercase tracking-widest mb-3 text-white">SyncStack</h3>
                            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed mb-6">
                                Distributed state synchronization layer for high-pressure clusters.
                            </p>
                            <Link to="/syncstack" className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 hover:text-white transition-colors">
                                Synchronize <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Code / Terminal Section */}
            <section className="py-32 bg-black relative border-t border-zinc-900">
                <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-400 mb-8 uppercase tracking-widest">
                            Built for Engineers
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-8 tracking-tighter leading-[1.1]">
                            Develop at the <span className="text-zinc-500">speed of thought.</span>
                        </h2>
                        <p className="text-zinc-500 text-lg leading-relaxed mb-10 font-medium max-w-lg">
                            Boost your productivity with a unified stack. Bootstrap, deploy, and monitor without context switching.
                        </p>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-sm font-semibold text-zinc-300">
                                    <ShieldCheck className="text-zinc-500" size={18} />
                                    <span>Secure By Default</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm font-semibold text-zinc-300">
                                    <Zap className="text-zinc-500" size={18} />
                                    <span>Instant Deploy</span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-sm font-semibold text-zinc-300">
                                    <Globe className="text-zinc-500" size={18} />
                                    <span>Global Network</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm font-semibold text-zinc-300">
                                    <ArrowRight className="text-zinc-500" size={18} />
                                    <span>Deep Integration</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative group perspective-1000">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-zinc-500/10 to-white/10 rounded-xl opacity-0 blur group-hover:opacity-100 transition duration-1000"></div>
                        <div className="relative bg-[#050505] rounded-xl border border-zinc-800 p-0 overflow-hidden shadow-2xl">
                            {/* Terminal Header */}
                            <div className="flex items-center justify-between px-4 py-3 bg-zinc-950 border-b border-zinc-900">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-800"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-800"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-800"></div>
                                </div>
                                <div className="text-[10px] uppercase tracking-widest font-bold text-zinc-600">opendev-labs shell</div>
                                <div className="w-12"></div>
                            </div>
                            {/* Terminal Content */}
                            <div className="p-6 font-mono text-[13px] leading-relaxed">
                                <div className="flex gap-3">
                                    <span className="text-zinc-600">~</span>
                                    <span className="text-zinc-300">spoon init product-engine</span>
                                </div>
                                <div className="text-zinc-500 pl-6 mt-1 mb-4">
                                    ▸ Resolving dependencies...
                                    <br />
                                    ▸ Bootstrapping LamaDB... <span className="text-zinc-300">Done</span>
                                    <br />
                                    ▸ Initializing SyncStack... <span className="text-zinc-300">Synchronized</span>
                                    <br />
                                    ▸ Connecting Q-Cloud... <span className="text-zinc-300">Ready</span>
                                </div>
                                <div className="flex gap-3">
                                    <span className="text-zinc-600">~</span>
                                    <span className="text-zinc-300">spoon deploy --prod</span>
                                </div>
                                <div className="mt-4 pl-6 border-l-2 border-zinc-800">
                                    <div className="text-zinc-400">Success! Project is live at:</div>
                                    <div className="text-white font-bold tracking-tight mt-1 underline decoration-zinc-800">https://product.opendev-labs.io</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

