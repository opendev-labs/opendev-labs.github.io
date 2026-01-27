import { Link } from 'react-router-dom';
import { Box, ArrowRight, Layers, Zap, Shield, GitBranch } from 'lucide-react';

export default function SyncStack() {
    return (
        <div className="flex flex-col w-full min-h-screen bg-black selection:bg-white selection:text-black">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 border-b border-zinc-900 overflow-hidden">
                <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-bold text-zinc-500 mb-8 uppercase tracking-[0.2em] animate-in fade-in slide-in-from-bottom-4 duration-1000">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <span>SyncStack v1.0.4 - Distributed Protocol Ready</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 text-white uppercase leading-[0.9] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
                        Seamless <br /> <span className="text-zinc-600">Synchronization.</span>
                    </h1>

                    <p className="text-lg text-zinc-500 max-w-2xl mx-auto mb-12 leading-relaxed font-bold uppercase tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                        The distributed synchronization layer for modern nexus clusters. Zero-latency state propagation with cryptographic integrity.
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                        <Link to="/ide" className="h-12 px-10 bg-white text-black text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all">
                            Initialize Cluster
                        </Link>
                        <a href="https://github.com/opendev-labs/syncstack" className="h-12 px-10 border border-zinc-900 text-white text-[10px] font-bold uppercase tracking-widest hover:border-white transition-all flex items-center">
                            Inspect Source
                        </a>
                    </div>
                </div>

                {/* Abstract Background Elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
            </section>

            {/* Feature Grid */}
            <section className="py-32 border-b border-zinc-900">
                <div className="max-w-[1200px] mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
                        <div className="p-10 border border-zinc-900 group hover:bg-zinc-950 transition-all duration-500 bg-black">
                            <Layers className="text-zinc-700 group-hover:text-blue-500 mb-8 transition-colors" size={24} />
                            <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-4 text-white">Quantum Sharding</h3>
                            <p className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest leading-loose">
                                Distributed data fragments optimized for instantaneous reconciliation across globally indexed nodes.
                            </p>
                        </div>
                        <div className="p-10 border border-zinc-900 group hover:bg-zinc-950 transition-all duration-500 bg-black">
                            <Zap className="text-zinc-700 group-hover:text-yellow-500 mb-8 transition-colors" size={24} />
                            <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-4 text-white">Light-speed Sync</h3>
                            <p className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest leading-loose">
                                Sub-millisecond latency for state propagation using advanced binary delta protocols.
                            </p>
                        </div>
                        <div className="p-10 border border-zinc-900 group hover:bg-zinc-950 transition-all duration-500 bg-black">
                            <Shield className="text-zinc-700 group-hover:text-green-500 mb-8 transition-colors" size={24} />
                            <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-4 text-white">Immutable Integrity</h3>
                            <p className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest leading-loose">
                                Every synchronization block is strictly validated against a zero-knowledge proof mesh.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Technical Specification Section */}
            <section className="py-32 bg-zinc-950">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="space-y-16">
                        <div className="flex gap-10 items-start">
                            <div className="flex-shrink-0 w-12 h-12 border border-zinc-800 flex items-center justify-center font-mono text-zinc-700 text-xs">
                                01
                            </div>
                            <div className="space-y-4">
                                <h4 className="text-sm font-bold uppercase tracking-widest text-white">Unified Cluster Binding</h4>
                                <p className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest leading-relaxed">
                                    Bind disparate infrastructure nodes into a single coherent synchronization stack. Automatically handles network partitioning and eventual consistency.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-10 items-start">
                            <div className="flex-shrink-0 w-12 h-12 border border-zinc-800 flex items-center justify-center font-mono text-zinc-700 text-xs">
                                02
                            </div>
                            <div className="space-y-4">
                                <h4 className="text-sm font-bold uppercase tracking-widest text-white">Neural Load balancing</h4>
                                <p className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest leading-relaxed">
                                    Intelligently routes synchronization traffic based on cluster health and proximity, ensuring peak performance under high-pressure state changes.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-40 text-center">
                <h2 className="text-4xl font-bold tracking-tighter uppercase mb-12">Synchronize Your Nexus.</h2>
                <Link to="/ide" className="group inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500 hover:text-white transition-all">
                    Initialize SyncStack Cluster <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                </Link>
            </section>
        </div>
    );
}
