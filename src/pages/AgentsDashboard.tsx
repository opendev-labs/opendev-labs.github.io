import React, { useState } from 'react';
import { Bot, Github, Zap, Shield, Sparkles, Plus, ExternalLink, ChevronRight, Search, Activity, Cpu, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const AgentsDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const agents = [
        {
            id: 'tars',
            name: 'TARS',
            role: 'Neural Architect & Superagent',
            status: 'ONLINE',
            description: 'Hyperintelligent agent specialized in building full-stack infrastructure from natural language.',
            icon: Sparkles,
            color: 'text-orange-500',
            bg: 'bg-orange-500/10'
        },
        {
            id: 'smith',
            name: 'SMITH',
            role: 'Nexus Orchestrator',
            status: 'STANDBY',
            description: 'Advanced CLI agent for universal hardware-level orchestration and task delegation.',
            icon: Cpu,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10'
        }
    ];

    const connections = [
        { id: 'github', name: 'GitHub', status: 'Connected', icon: Github, color: 'text-white' },
        { id: 'vercel', name: 'Vercel', status: 'Link Ready', icon: Zap, color: 'text-emerald-500' },
        { id: 'firebase', name: 'Firebase', status: 'Link Ready', icon: Shield, color: 'text-amber-500' }
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-900 pb-8">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em]">
                        <Bot size={14} /> Neural Nexus Registry
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter text-white">AGENTS <span className="text-zinc-700 italic">CORE</span></h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
                        <input
                            type="text"
                            placeholder="FIND AGENT..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 h-10 text-[11px] font-bold text-white focus:outline-none focus:border-zinc-500 transition-colors w-64 uppercase tracking-widest placeholder:text-zinc-800"
                        />
                    </div>
                    <button className="h-10 px-6 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-zinc-200 transition-all flex items-center gap-2">
                        <Plus size={14} /> Initialize Agent
                    </button>
                </div>
            </div>

            {/* SyncStack Connection Strip */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {connections.map((conn) => (
                    <div key={conn.id} className="p-6 bg-zinc-950 border border-zinc-900 rounded-xl flex items-center justify-between group hover:border-zinc-700 transition-all">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-lg bg-black border border-zinc-800 flex items-center justify-center ${conn.color}`}>
                                <conn.icon size={20} />
                            </div>
                            <div>
                                <h4 className="text-[11px] font-bold text-white uppercase tracking-widest">{conn.name}</h4>
                                <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-tighter mt-0.5">{conn.status}</p>
                            </div>
                        </div>
                        <button className="p-2 text-zinc-600 hover:text-white transition-colors">
                            <ExternalLink size={14} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Agents Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {agents.map((agent) => (
                    <motion.div
                        key={agent.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="group relative bg-[#0D0D0D] border border-zinc-900 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all"
                    >
                        <div className="absolute top-0 right-0 p-6">
                            <div className="flex items-center gap-2 px-2 py-1 rounded bg-black border border-emerald-500/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">{agent.status}</span>
                            </div>
                        </div>

                        <div className="p-10 space-y-6">
                            <div className={`w-16 h-16 rounded-2xl ${agent.bg} flex items-center justify-center ${agent.color}`}>
                                <agent.icon size={32} />
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-2xl font-black tracking-tighter text-white">{agent.name}</h3>
                                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">{agent.role}</p>
                            </div>

                            <p className="text-sm text-zinc-400 leading-relaxed font-medium">
                                {agent.description}
                            </p>

                            <div className="pt-6 flex items-center gap-4">
                                <button
                                    onClick={() => agent.id === 'tars' ? navigate('/void/new/tars') : null}
                                    className="h-11 px-8 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-zinc-200 transition-all flex items-center gap-2"
                                >
                                    Initiate Prototype <ChevronRight size={14} />
                                </button>
                                <button className="h-11 px-6 border border-zinc-800 text-zinc-500 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:border-zinc-600 hover:text-white transition-all">
                                    Configure
                                </button>
                            </div>
                        </div>

                        <div className="border-t border-zinc-900/50 p-6 bg-black/50 flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <Activity size={12} className="text-zinc-700" />
                                    <span className="text-[9px] font-bold text-zinc-600 uppercase">99.2% Uptime</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Globe size={12} className="text-zinc-700" />
                                    <span className="text-[9px] font-bold text-zinc-600 uppercase">Global Edge</span>
                                </div>
                            </div>
                            <span className="text-[9px] font-bold text-zinc-800 uppercase tabular-nums">ID: 0x{Math.random().toString(16).substring(2, 8)}</span>
                        </div>
                    </motion.div>
                ))}

                {/* Create New Agent Placeholder */}
                <div className="border-2 border-dashed border-zinc-900 rounded-2xl p-10 flex flex-col items-center justify-center text-center space-y-4 hover:border-zinc-800 hover:bg-zinc-950/20 transition-all cursor-pointer group">
                    <div className="w-16 h-16 rounded-2xl bg-zinc-950 border border-zinc-900 flex items-center justify-center text-zinc-700 group-hover:text-zinc-400 transition-colors">
                        <Plus size={32} />
                    </div>
                    <div className="space-y-1">
                        <h4 className="text-sm font-bold text-zinc-600 uppercase tracking-widest group-hover:text-zinc-400 transition-colors">Forge New Agent</h4>
                        <p className="text-[10px] text-zinc-800 font-bold uppercase tracking-tighter">Initialize custom neural baseline</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgentsDashboard;
