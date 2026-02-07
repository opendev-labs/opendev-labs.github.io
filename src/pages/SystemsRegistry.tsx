import React from 'react';
import { Terminal, Database, Cpu, Zap, Box, Code, Activity, Users, ShieldCheck, Link as LinkIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { useAuth } from '../features/void/hooks/useAuth';

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

export default function SystemsRegistry() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-12 font-sans selection:bg-orange-500 selection:text-black">
            <main className="relative z-10 max-w-[1400px] mx-auto space-y-24">
                {/* Header Section */}
                <header className="flex flex-col md:flex-row items-end justify-between gap-12 border-b border-zinc-900 pb-20 pt-10">
                    <div className="space-y-8">
                        <div className="flex items-center gap-4 mb-8">
                            <Link to="/nexus" className="text-[10px] font-bold text-zinc-600 hover:text-orange-500 transition-colors uppercase tracking-[0.4em]">
                                &larr; Return to Social Hub
                            </Link>
                            <div className="w-1 h-1 rounded-full bg-zinc-800" />
                            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em]">
                                Module: <span className="text-white">Registry // Core Systems</span>
                            </div>
                        </div>
                        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-none bg-zinc-900 border border-zinc-800 text-[10px] font-bold text-orange-500 uppercase tracking-[0.4em]">
                            <ShieldCheck size={14} />
                            <span>Systems Integrity Registry // v12.01</span>
                        </div>
                        <h1 className="text-7xl md:text-9xl font-bold tracking-tighter uppercase leading-[0.8] mb-4">
                            SYSTEMS<br /><span className="text-zinc-700">REGISTRY.</span>
                        </h1>
                        <p className="text-zinc-500 text-lg font-medium tracking-tight uppercase tracking-[0.3em] opacity-80">
                            Core Mesh Infrastructure // NODE: <span className="text-white">@{user?.name || 'anonymous'}</span>
                        </p>
                    </div>

                    <div className="flex flex-col items-end gap-4 text-right">
                        <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.4em]">Core protocol status</div>
                        <div className="flex items-center gap-4">
                            <span className="w-2.5 h-2.5 rounded-none bg-green-500 animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
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
                                    <div className={`w-14 h-14 rounded-none bg-zinc-900 border border-zinc-800 flex items-center justify-center transition-all group-hover:border-zinc-600 duration-500`}>
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
                                        <div className="w-1.5 h-1.5 rounded-none bg-orange-500/30" />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </section>

                <div className="h-20" />
            </main>
        </div>
    );
}
