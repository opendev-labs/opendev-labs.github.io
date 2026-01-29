import React from 'react';
import { Terminal, Database, Cpu, Zap, Box, Layout as LayoutIcon, Code, Command, Globe, ShieldCheck, Activity, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const products = [
    { name: 'SPOON CLI', icon: Terminal, status: 'SYSTEM_ACTIVE', color: 'text-green-500', desc: 'Universal AI Orchestration Engine' },
    { name: 'VOID APP', icon: Box, status: 'DEPLOYED', color: 'text-blue-500', desc: 'Sovereign Deployment Platform' },
    { name: 'LamaDB', icon: Database, status: 'NATIVE_SYNC', color: 'text-orange-500', desc: 'Intelligent Persistence Layer' },
    { name: 'QBET', icon: Activity, status: 'MANIFESTING', color: 'text-purple-500', desc: 'Quantum Bayesian Execution Terminal' },
    { name: 'Quantum-API', icon: Code, status: 'SYNCHRONIZED', color: 'text-emerald-500', desc: 'High-Fidelity Interface Protocol' },
    { name: 'Quantum-Compute', icon: Cpu, status: 'OPERATIONAL', color: 'text-cyan-500', desc: 'Scalable Neural Distribution' },
    { name: 'Quantum-ML', icon: Zap, status: 'TRAINING', color: 'text-yellow-500', desc: 'Autonomous Intelligence Training' },
    { name: 'Transcenders', icon: Users, status: 'LINKED', color: 'text-rose-500', desc: 'Cross-Scale Collaborative Intelligence' }
];

export default function NexusDashboard() {
    return (
        <div className="min-h-screen bg-black text-white p-10 font-sans selection:bg-white selection:text-black">
            {/* Background elements */}
            <div className="fixed inset-0 pointer-events-none opacity-5">
                <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1500px] h-[1000px] bg-blue-500/10 blur-[200px] rounded-full" />
            </div>

            <main className="relative z-10 max-w-7xl mx-auto space-y-20 pt-10">
                {/* Header Section */}
                <header className="flex flex-col md:flex-row items-end justify-between gap-10 border-b border-zinc-900 pb-16">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-bold text-blue-400 uppercase tracking-[0.4em]">
                            <ShieldCheck size={14} />
                            <span>Nexus Registry v11.11.0</span>
                        </div>
                        <h1 className="text-8xl font-bold tracking-tighter uppercase leading-[0.8] mb-4">
                            NEXUS<br /><span className="text-zinc-700">DASHBOARD.</span>
                        </h1>
                        <p className="text-zinc-500 text-lg font-medium tracking-tight uppercase tracking-[0.2em]">
                            Unified Intelligence Network // Founder: @iamyash.io
                        </p>
                    </div>

                    <div className="flex flex-col items-end gap-3 text-right">
                        <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">System Status</div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-2xl font-bold tracking-tighter uppercase whitespace-nowrap">Hardline Protocol: ACTIVE</span>
                        </div>
                    </div>
                </header>

                {/* Product Grid */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((p, i) => (
                        <motion.div
                            key={p.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="group p-8 bg-zinc-950/40 border border-zinc-900 rounded-[32px] hover:border-blue-500/40 hover:bg-zinc-900/40 transition-all duration-500 cursor-pointer backdrop-blur-3xl overflow-hidden relative"
                        >
                            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Zap className="text-blue-500/30" size={100} />
                            </div>

                            <div className="relative z-10 h-full flex flex-col justify-between">
                                <div className="space-y-6">
                                    <div className={`w-14 h-14 rounded-2xl bg-zinc-900 flex items-center justify-center transition-transform group-hover:scale-110 duration-500`}>
                                        <p.icon className={p.color} size={28} />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-bold tracking-tight uppercase">{p.name}</h3>
                                        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{p.desc}</p>
                                    </div>
                                </div>

                                <div className="mt-12 flex items-center justify-between border-t border-zinc-900/50 pt-6">
                                    <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-500">{p.status}</span>
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </section>

                {/* System Activity Footer */}
                <footer className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-zinc-900 pt-16 pb-20">
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.4em]">Neural Uplink</h4>
                        <div className="p-6 bg-zinc-900/30 rounded-2xl border border-zinc-800 flex items-center justify-between font-mono text-xs">
                            <span className="text-zinc-500">SPOON_TERMINAL_01:</span>
                            <span className="text-green-500 tracking-widest">CONNECTED</span>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.4em]">Identity Source</h4>
                        <div className="p-6 bg-zinc-900/30 rounded-2xl border border-zinc-800 flex items-center justify-between font-mono text-xs">
                            <span className="text-zinc-500">GITHUB:</span>
                            <span className="text-white tracking-widest">@opendev-labs</span>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.4em]">Registry Status</h4>
                        <div className="p-6 bg-zinc-900/30 rounded-2xl border border-zinc-800 flex items-center justify-between font-mono text-xs">
                            <span className="text-zinc-500">LAMADB:</span>
                            <span className="text-orange-500 tracking-widest">SYNCHRONIZED</span>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
}
