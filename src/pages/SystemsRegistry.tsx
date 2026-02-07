import React from "react";
import { Link } from "react-router-dom";
import {
    Database,
    Zap,
    Shield,
    Box,
    Terminal,
    Globe,
    Cpu,
    Layers,
    ArrowRight,
    Search,
    Filter,
    Activity,
    ShieldCheck
} from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/shadcn/button";
import { useAuth } from "../features/void/hooks/useAuth";

const systems = [
    {
        id: "lamadb",
        name: "LamaDB",
        description: "Vector-first, distributed persistence layer for sovereign intelligence.",
        status: "OPTIMAL",
        load: "12%",
        icon: Database,
        color: "text-orange-500",
        path: "/lamadb"
    },
    {
        id: "syncstack",
        name: "SyncStack",
        description: "High-velocity data synchronization and state management protocol.",
        status: "ACTIVE",
        load: "28%",
        icon: Zap,
        color: "text-blue-500",
        path: "/syncstack"
    },
    {
        id: "void",
        name: "Void IDE",
        description: "Sovereign development environment for the agentic era.",
        status: "ACTIVE",
        load: "45%",
        icon: Terminal,
        color: "text-purple-500",
        path: "/void"
    },
    {
        id: "q-cloud",
        name: "Q-Cloud",
        description: "Quantum-ready infrastructure for heavy compute loads.",
        status: "STANDBY",
        load: "0%",
        icon: Cpu,
        color: "text-emerald-500",
        path: "/q-cloud"
    },
    {
        id: "nexus",
        name: "Nexus Network",
        description: "Decentralized mesh for human and agent interaction.",
        status: "OPTIMAL",
        load: "62%",
        icon: Globe,
        color: "text-orange-500",
        path: "/nexus"
    },
    {
        id: "spoon",
        name: "SPOON CLI",
        description: "Terminal-grade orchestrator for local systems harnessing.",
        status: "ACTIVE",
        load: "5%",
        icon: Box,
        color: "text-zinc-400",
        path: "/spoon"
    }
];

export default function SystemsRegistry() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-black text-white selection:bg-orange-500 selection:text-black font-sans pb-20">
            <main className="max-w-[1200px] mx-auto p-6 md:p-12 space-y-12">
                <header className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 border-b border-zinc-900 pb-12 pt-10">
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 mb-4">
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
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase leading-none">
                            Systems<br /><span className="text-zinc-600">Registry.</span>
                        </h1>
                        <p className="max-w-xl text-zinc-500 text-sm leading-relaxed font-medium uppercase tracking-widest opacity-80">
                            Core Mesh Infrastructure // NODE: <span className="text-white">@{user?.name || 'anonymous'}</span>
                        </p>
                    </div>

                    <div className="flex flex-col items-end gap-4 text-right">
                        <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.4em]">Core protocol status</div>
                        <div className="flex items-center gap-4">
                            <Activity size={14} className="text-emerald-500 animate-pulse" />
                            <span className="text-2xl font-bold tracking-tighter uppercase whitespace-nowrap text-white">Registry: COMPLIANT</span>
                        </div>
                    </div>
                </header>

                {/* Filters & Search */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                        <input
                            type="text"
                            placeholder="Search Registry..."
                            className="w-full bg-zinc-950 border border-zinc-900 rounded-xl py-3 pl-12 pr-4 text-sm focus:border-orange-500 outline-none transition-all"
                        />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <Button variant="outline" className="rounded-xl border-zinc-900 bg-black text-[10px] font-bold uppercase tracking-widest flex-1 md:flex-none h-12">
                            <Filter size={14} className="mr-2" /> All Nodes
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {systems.map((system) => (
                        <Card key={system.id} className="bg-zinc-950/20 border-zinc-900 hover:border-orange-500/50 transition-all group p-8 rounded-3xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4">
                                <span className={`text-[8px] font-bold uppercase tracking-[0.2em] px-2 py-1 rounded bg-black border border-zinc-800 ${system.status === 'OPTIMAL' ? 'text-emerald-500' : 'text-blue-500'}`}>
                                    {system.status}
                                </span>
                            </div>

                            <div className="space-y-6">
                                <div className={`w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center border border-zinc-800 ${system.color}`}>
                                    <system.icon size={24} />
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold tracking-tight uppercase text-zinc-100">{system.name}</h3>
                                    <p className="text-sm text-zinc-500 leading-relaxed min-h-[4.5rem]">
                                        {system.description}
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-zinc-900 flex items-center justify-between">
                                    <div className="space-y-1">
                                        <span className="text-[8px] font-bold text-zinc-700 uppercase tracking-widest block">Resource Load</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-20 h-1 bg-zinc-900 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-orange-500"
                                                    style={{ width: system.load }}
                                                />
                                            </div>
                                            <span className="text-[10px] font-mono font-bold text-zinc-500">{system.load}</span>
                                        </div>
                                    </div>
                                    <Link to={system.path}>
                                        <Button size="icon" variant="ghost" className="rounded-xl hover:bg-orange-500 hover:text-white transition-all">
                                            <ArrowRight size={18} />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                <footer className="pt-20 flex flex-col items-center gap-6">
                    <div className="flex items-center gap-6">
                        <div className="w-12 h-[1px] bg-zinc-900" />
                        <span className="text-[9px] font-bold text-zinc-700 uppercase tracking-[0.5em] italic">End of Registry</span>
                        <div className="w-12 h-[1px] bg-zinc-900" />
                    </div>
                </footer>
            </main>
        </div>
    );
}
