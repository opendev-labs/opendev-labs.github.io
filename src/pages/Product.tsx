import { Terminal, Database, Cpu, Globe, ArrowRight, ShieldCheck, Zap, Box, Layout as LayoutIcon, Code, Command } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Product() {
    return (
        <div className="flex flex-col w-full bg-black text-white selection:bg-blue-500 selection:text-white">
            {/* Minimalist Hero Section */}
            <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-20 overflow-hidden border-b border-zinc-900">
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1400px] h-[1000px] bg-blue-500/5 blur-[180px] rounded-full" />
                    <div className="absolute inset-0 opacity-5 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />
                </div>

                <div className="relative z-10 text-center max-w-5xl px-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 text-[11px] font-bold text-blue-400 mb-10 uppercase tracking-[0.4em] backdrop-blur-md">
                        <Box size={14} />
                        <span>Product Engine v1.0 Live</span>
                    </div>

                    <h1 className="text-6xl md:text-9xl font-bold tracking-tighter mb-10 leading-[0.85] uppercase">
                        PRODUCT<span className="text-zinc-600">.</span>ENGINE
                    </h1>
                    <p className="text-xl md:text-3xl text-zinc-400 max-w-3xl mx-auto mb-16 font-light leading-snug tracking-tight">
                        The definitive foundation for high-fidelity SaaS architecture.
                        Scalable by design, secure by instinct.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                        <Link to="/auth" className="w-full sm:w-auto h-16 px-16 rounded-full bg-white text-black text-[12px] font-bold uppercase tracking-[0.3em] hover:bg-blue-500 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 shadow-2xl shadow-blue-500/20">
                            Launch Engine <ArrowRight size={18} />
                        </Link>
                        <a href="https://github.com/opendev-labs/spoon" className="w-full sm:w-auto h-16 px-16 rounded-full bg-black border border-zinc-800 text-white text-[12px] font-bold uppercase tracking-[0.3em] hover:border-blue-500 transition-all hover:scale-105 active:scale-95 flex items-center justify-center shadow-xl">
                            Read Specs
                        </a>
                    </div>
                </div>

                {/* Sub-hero details */}
                <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-16 text-[10px] uppercase tracking-[0.5em] font-bold text-zinc-700">
                    <div className="flex flex-col items-center gap-3">
                        <span className="text-white text-xl tracking-normal">0.1ms</span>
                        <span>State Sync</span>
                    </div>
                    <div className="w-px h-10 bg-zinc-900" />
                    <div className="flex flex-col items-center gap-3">
                        <span className="text-white text-xl tracking-normal">∞</span>
                        <span>Scalability</span>
                    </div>
                </div>
            </section>

            {/* Core Stack Section */}
            <section className="py-40">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-32">
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase mb-6">The Sovereign Stack</h2>
                        <div className="h-1 w-20 bg-blue-500 mx-auto" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {/* feature 1 */}
                        <div className="group p-10 bg-zinc-950 border border-zinc-900 rounded-2xl hover:border-blue-500/50 transition-all duration-500">
                            <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
                                <Database className="text-blue-500" size={28} />
                            </div>
                            <h3 className="text-lg font-bold uppercase tracking-widest mb-6 text-white text-blue-400">LamaDB Protocol</h3>
                            <p className="text-sm font-medium text-zinc-500 leading-relaxed uppercase tracking-wider">
                                Native intelligence synchronization. Your state is distributed across the matrix with sub-atomic latency.
                            </p>
                        </div>
                        {/* feature 2 */}
                        <div className="group p-10 bg-zinc-950 border border-zinc-900 rounded-2xl hover:border-blue-500/50 transition-all duration-500">
                            <div className="w-14 h-14 bg-purple-500/10 rounded-xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
                                <Zap className="text-purple-500" size={28} />
                            </div>
                            <h3 className="text-lg font-bold uppercase tracking-widest mb-6 text-purple-400">SyncStack Flux</h3>
                            <p className="text-sm font-medium text-zinc-500 leading-relaxed uppercase tracking-wider">
                                Dynamic cluster management. Automatically rebalances infrastructure load across the global Q-Cloud.
                            </p>
                        </div>
                        {/* feature 3 */}
                        <div className="group p-10 bg-zinc-950 border border-zinc-900 rounded-2xl hover:border-blue-500/50 transition-all duration-500">
                            <div className="w-14 h-14 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
                                <Globe className="text-emerald-500" size={28} />
                            </div>
                            <h3 className="text-lg font-bold uppercase tracking-widest mb-6 text-emerald-400">Q-Cloud Edge</h3>
                            <p className="text-sm font-medium text-zinc-500 leading-relaxed uppercase tracking-wider">
                                Global deployment without boundaries. Your engine lives everywhere simultaneously.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Terminal Demonstration */}
            <section className="py-40 border-y border-zinc-900 bg-zinc-950/30">
                <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
                    <div>
                        <h2 className="text-5xl font-bold tracking-tighter mb-10 leading-[0.9] uppercase">
                            Engineered for <br /><span className="text-zinc-600">Pure Performance.</span>
                        </h2>
                        <ul className="space-y-10">
                            <li className="flex items-start gap-6">
                                <ShieldCheck className="text-blue-500 mt-1" size={20} />
                                <div className="space-y-2">
                                    <h4 className="text-sm font-bold uppercase tracking-widest text-white">Quantum Security</h4>
                                    <p className="text-[12px] font-medium text-zinc-500 leading-relaxed uppercase tracking-widest">End-to-end encryption woven into the fabric of every deployment.</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-6">
                                <LayoutIcon className="text-blue-500 mt-1" size={20} />
                                <div className="space-y-2">
                                    <h4 className="text-sm font-bold uppercase tracking-widest text-white">High-Fidelity GUI</h4>
                                    <p className="text-[12px] font-medium text-zinc-500 leading-relaxed uppercase tracking-widest">A seamless transition from CLI control to visual orchestration.</p>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div className="relative group">
                        <div className="absolute inset-0 bg-blue-500/5 blur-[100px] rounded-full group-hover:bg-blue-500/10 transition-all duration-1000" />
                        <div className="relative bg-[#050505] border border-zinc-800 p-10 rounded-3xl shadow-3xl font-mono text-[13px] overflow-hidden">
                            <div className="flex items-center gap-3 mb-10 border-b border-zinc-900 pb-6">
                                <div className="w-3 h-3 rounded-full bg-zinc-800" />
                                <div className="w-3 h-3 rounded-full bg-zinc-800" />
                                <div className="w-3 h-3 rounded-full bg-zinc-800" />
                                <span className="ml-6 text-zinc-600 uppercase tracking-[0.3em] text-[10px] font-bold">engine-controller</span>
                            </div>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <span className="text-zinc-700">$</span>
                                    <span className="text-white font-bold tracking-tight">spoon deploy --prod</span>
                                </div>
                                <div className="text-blue-500 ml-8 leading-relaxed space-y-1">
                                    ▸ ANALYZING CLUSTER...<br />
                                    ▸ OPTIMIZING BUNDLES...<br />
                                    ▸ UPLOADING TO EDGE...<br />
                                </div>
                                <div className="mt-8 p-6 bg-zinc-900/50 rounded-xl border border-zinc-800">
                                    <div className="text-zinc-400 font-bold mb-2 uppercase tracking-widest text-[11px]">Success! Engine is live at:</div>
                                    <div className="text-white text-lg font-bold tracking-tighter underline decoration-blue-500 underline-offset-4">https://product.opendev-labs.io</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-60 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_70%)]" />
                <h2 className="text-6xl md:text-8xl font-bold tracking-tighter uppercase mb-16 relative z-10 leading-[0.8]">
                    Master the <br /><span className="text-zinc-700">Production Engine.</span>
                </h2>
                <Link to="/auth" className="h-18 px-20 rounded-full bg-blue-600 text-white text-[13px] font-bold uppercase tracking-[0.4em] hover:bg-blue-500 transition-all relative z-10 inline-flex items-center gap-4 hover:scale-105 shadow-2xl shadow-blue-500/40">
                    Get Started <ArrowRight size={20} />
                </Link>
            </section>
        </div>
    );
}
