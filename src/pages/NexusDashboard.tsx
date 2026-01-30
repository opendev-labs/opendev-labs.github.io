import React from 'react';
import { Terminal, Database, Cpu, Zap, Box, Code, Activity, Users, ShieldCheck, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { useAuth } from '../contexts/AuthContext';

const products = [
    { name: 'SPOON CLI', icon: Terminal, status: 'SYSTEM_ACTIVE', color: 'text-green-500', desc: 'Universal AI Orchestration Engine' },
    { name: 'VOID HUB', icon: Box, status: 'DEPLOYED', color: 'text-blue-500', desc: 'Sovereign Deployment Platform' },
    { name: 'LamaDB', icon: Database, status: 'NATIVE_SYNC', color: 'text-orange-500', desc: 'Intelligent Persistence Layer' },
    { name: 'QBET', icon: Activity, status: 'MANIFESTING', color: 'text-purple-500', desc: 'Quantum Bayesian Execution Terminal' },
    { name: 'Quantum-API', icon: Code, status: 'SYNCHRONIZED', color: 'text-emerald-500', desc: 'High-Fidelity Interface Protocol' },
    { name: 'Quantum-Compute', icon: Cpu, status: 'OPERATIONAL', color: 'text-cyan-500', desc: 'Scalable Neural Distribution' },
    { name: 'Quantum-ML', icon: Zap, status: 'TRAINING', color: 'text-yellow-500', desc: 'Autonomous Intelligence Training' },
    { name: 'Transcenders', icon: Users, status: 'LINKED', color: 'text-rose-500', desc: 'Cross-Scale Collaborative Intelligence' }
];

export default function NexusDashboard() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-12 font-sans selection:bg-white selection:text-black">
            {/* Background Atmosphere */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full opacity-[0.03]"
                    style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '50px 50px' }}
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1500px] h-[1000px] bg-blue-500/5 blur-[200px] rounded-full" />
            </div>

            <main className="relative z-10 max-w-[1400px] mx-auto space-y-24">
                {/* Header Section */}
                <header className="flex flex-col md:flex-row items-end justify-between gap-12 border-b border-zinc-900 pb-20">
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-bold text-blue-500 uppercase tracking-[0.4em]">
                            <ShieldCheck size={14} />
                            <span>Nexus Registry Status // v11.12</span>
                        </div>
                        <h1 className="text-7xl md:text-9xl font-bold tracking-tighter uppercase leading-[0.8] mb-4">
                            NEXUS<br /><span className="text-zinc-700">DASHBOARD.</span>
                        </h1>
                        <p className="text-zinc-500 text-lg font-medium tracking-tight uppercase tracking-[0.3em] opacity-80">
                            Unified Intelligence Network // NODE: <span className="text-white">@{user?.name || 'anonymous'}</span>
                        </p>
                    </div>

                    <div className="flex flex-col items-end gap-4 text-right">
                        <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.4em]">Core protocol status</div>
                        <div className="flex items-center gap-4">
                            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
                            <span className="text-3xl font-bold tracking-tighter uppercase whitespace-nowrap">Hardline Protocol: ACTIVE</span>
                        </div>
                    </div>
                </header>

                {/* Product Grid */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((p, i) => (
                        <Card key={p.name} className="p-8 h-full bg-zinc-950/20">
                            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity">
                                <Zap className="text-white" size={120} />
                            </div>

                            <div className="relative z-10 h-full flex flex-col justify-between min-h-[220px]">
                                <div className="space-y-8">
                                    <div className={`w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center transition-all group-hover:border-zinc-600 duration-500`}>
                                        <p.icon className={p.color} size={24} />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-bold tracking-tight uppercase text-zinc-100">{p.name}</h3>
                                        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-loose">{p.desc}</p>
                                    </div>
                                </div>

                                <div className="mt-12 flex items-center justify-between border-t border-zinc-900/50 pt-6">
                                    <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-zinc-500">{p.status}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[8px] font-bold text-zinc-800 uppercase tracking-widest">Linked</span>
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500/30" />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </section>

                {/* System Activity Integration */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { label: "Neural Uplink", key: "SPOON_TERMINAL_01", value: "CONNECTED", vColor: "text-green-500" },
                        { label: "Identity Source", key: "NEXUS_ID", value: `@${user?.uid?.slice(0, 8) || 'anonymous'}`, vColor: "text-white" },
                        { label: "Registry Status", key: "LAMADB_SYNC", value: "SYNCHRONIZED", vColor: "text-orange-500" }
                    ].map((item, i) => (
                        <div key={i} className="space-y-6">
                            <h4 className="text-[10px] font-bold text-zinc-700 uppercase tracking-[0.6em] ml-2">{item.label}</h4>
                            <Card className="p-8 bg-zinc-950/40 border border-zinc-900 flex items-center justify-between font-mono text-xs">
                                <span className="text-zinc-600 uppercase tracking-widest font-bold">{item.key}:</span>
                                <span className={`${item.vColor} font-bold tracking-[0.2em] uppercase shrink-0`}>{item.value}</span>
                            </Card>
                        </div>
                    ))}
                </section>

                <div className="h-20" />
            </main>
        </div>
    );
}
