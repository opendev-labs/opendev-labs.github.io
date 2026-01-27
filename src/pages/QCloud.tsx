import { Server, Zap, Shield, Cpu, Cloud, ArrowRight, Activity, Network } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function QCloud() {
    return (
        <div className="flex flex-col w-full bg-black text-white selection:bg-white selection:text-black">
            {/* Hero Section */}
            <section className="relative min-h-[70vh] flex flex-col items-center justify-center pt-20 overflow-hidden border-b border-zinc-900">
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-20">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-zinc-800/10 blur-[120px] rounded-full" />
                </div>

                <div className="relative z-10 text-center max-w-4xl px-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-400 mb-8 uppercase tracking-widest">
                        <Cloud size={14} />
                        <span>Quantum Ready Infrastructure</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 leading-[0.9]">
                        Q-Cloud
                    </h1>
                    <p className="text-lg md:text-xl text-zinc-500 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
                        Global edge network for sovereign application logic.
                        Sub-atomic latency for the next generation of neural systems.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/void" className="w-full sm:w-auto h-12 px-10 rounded-full bg-white text-black text-[11px] font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg">
                            Deploy Now <ArrowRight size={16} />
                        </Link>
                        <Link to="/enterprise" className="w-full sm:w-auto h-12 px-10 rounded-full bg-black border border-zinc-800 text-white text-[11px] font-bold uppercase tracking-widest hover:bg-zinc-900 transition-all hover:scale-105 active:scale-95 flex items-center justify-center shadow-lg">
                            Contact Sales
                        </Link>
                    </div>
                </div>
            </section>

            {/* Core Stats / Tech Specs */}
            <section className="py-24 border-b border-zinc-900">
                <div className="max-w-[1200px] mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <div className="text-xs font-bold text-zinc-600 uppercase tracking-widest mb-2">Global Nodes</div>
                            <div className="text-3xl font-bold text-white tracking-tighter">2,400+</div>
                        </div>
                        <div>
                            <div className="text-xs font-bold text-zinc-600 uppercase tracking-widest mb-2">Avg. Latency</div>
                            <div className="text-3xl font-bold text-white tracking-tighter">1.2ms</div>
                        </div>
                        <div>
                            <div className="text-xs font-bold text-zinc-600 uppercase tracking-widest mb-2">Uptime Core</div>
                            <div className="text-3xl font-bold text-white tracking-tighter">99.999%</div>
                        </div>
                        <div>
                            <div className="text-xs font-bold text-zinc-600 uppercase tracking-widest mb-2">Encrypted Path</div>
                            <div className="text-3xl font-bold text-white tracking-tighter">100%</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-32 bg-black">
                <div className="max-w-[1200px] mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
                        <div className="group p-10 border border-zinc-900 transition-all hover:bg-zinc-950 duration-500">
                            <Server className="mb-8 text-white" size={20} />
                            <h3 className="text-lg font-semibold mb-3 tracking-tight">Sovereign Edge</h3>
                            <p className="text-zinc-500 text-sm leading-relaxed font-medium">
                                Dedicated compute resources that you truly own. No noisy neighbors, no shared kernels.
                            </p>
                        </div>
                        <div className="group p-10 border border-zinc-900 transition-all hover:bg-zinc-950 duration-500">
                            <Zap className="mb-8 text-white" size={20} />
                            <h3 className="text-lg font-semibold mb-3 tracking-tight">Intent Execution</h3>
                            <p className="text-zinc-500 text-sm leading-relaxed font-medium">
                                Optimized for AI agent workloads and real-time inference at the edge.
                            </p>
                        </div>
                        <div className="group p-10 border border-zinc-900 transition-all hover:bg-zinc-950 duration-500">
                            <Shield className="mb-8 text-white" size={20} />
                            <h3 className="text-lg font-semibold mb-3 tracking-tight">Zero-Trust Fabric</h3>
                            <p className="text-zinc-500 text-sm leading-relaxed font-medium">
                                Automated certificate rotation and advanced DDoS protection integrated at the packet level.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section: Architecture */}
            <section className="py-32 border-t border-zinc-900">
                <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-8 tracking-tighter leading-[1.1]">
                            The network is <br /><span className="text-zinc-500">the computer.</span>
                        </h2>
                        <div className="space-y-8">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded flex items-center justify-center shrink-0">
                                    <Activity size={18} className="text-white" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white mb-2">Real-time Telemetry</h4>
                                    <p className="text-zinc-500 text-sm font-medium leading-relaxed">
                                        Deep visibility into every function execution and network hop with sub-second resolution.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded flex items-center justify-center shrink-0">
                                    <Network size={18} className="text-white" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white mb-2">Mesh Routing</h4>
                                    <p className="text-zinc-500 text-sm font-medium leading-relaxed">
                                        Proprietary routing protocol that finds the fastest path through the global internet mesh.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded flex items-center justify-center shrink-0">
                                    <Cpu size={18} className="text-white" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white mb-2">Unified Control Plane</h4>
                                    <p className="text-zinc-500 text-sm font-medium leading-relaxed">
                                        Manage global infrastructure with a single CLI or API call. Zero configuration required.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative group p-1 bg-gradient-to-br from-zinc-800 to-black rounded-2xl">
                        <div className="bg-black rounded-xl p-8 border border-zinc-900 shadow-2xl overflow-hidden aspect-video flex flex-col justify-center">
                            <div className="space-y-4 font-mono text-[13px]">
                                <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                                    <span className="text-zinc-500">us-east-1</span>
                                    <span className="text-green-500 font-bold">● ACTIVE</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                                    <span className="text-zinc-500">eu-central-1</span>
                                    <span className="text-green-500 font-bold">● ACTIVE</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                                    <span className="text-zinc-500">ap-northeast-1</span>
                                    <span className="text-green-500 font-bold">● ACTIVE</span>
                                </div>
                                <div className="pt-4">
                                    <div className="text-zinc-600 mb-2">Compiling Intent...</div>
                                    <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                                        <div className="h-full bg-white w-2/3 animate-pulse" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

