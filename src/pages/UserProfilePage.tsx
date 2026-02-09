import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Terminal, Globe, Github, Rocket, Box, Flame,
    Share2, Cpu, Database, Zap, ArrowRight, ShieldCheck,
    MessageSquare, Heart, Bookmark
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { DiamondLine } from '../components/ui/DiamondLine';
import { DevIndicator } from '../components/animated/DevIndicator';
import HeroBg from '../assets/bg.png';

export default function UserProfilePage() {
    const { username } = useParams<{ username: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'projects' | 'automation' | 'mesh'>('projects');

    // Mock data for the profile
    const profile = {
        name: username,
        handle: `@${username}`,
        bio: "Sovereign Infrastructure Architect // Neural Mesh Specialist. Building the distributed state of autonomy.",
        stats: {
            nodes: 12,
            uplinks: "4.2Pb/s",
            reputation: "99.9%"
        },
        projects: [
            { id: 1, name: "quantum-router", platform: "GitHub", status: "Live", url: "quantum.opendev.app" },
            { id: 2, name: "neural-mesh-core", platform: "SyncStack", status: "Live", url: "mesh.opendev.app" },
            { id: 3, name: "sovereign-db", platform: "LamaDB", status: "Syncing", url: "db.opendev.app" },
        ]
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-orange-500/30">
            {/* Cover Area */}
            <div className="h-64 md:h-80 relative overflow-hidden">
                <img src={HeroBg} className="w-full h-full object-cover opacity-40 grayscale hover:grayscale-0 transition-all duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute inset-0 backdrop-blur-[2px]" />
            </div>

            {/* Profile Content */}
            <div className="max-w-7xl mx-auto px-6 -mt-32 relative z-10 pb-40">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Left Column: Sidebar Profile */}
                    <div className="w-full lg:w-96 flex-shrink-0">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-zinc-950 border border-zinc-900 overflow-hidden relative"
                        >
                            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent" />

                            <div className="p-8">
                                {/* Avatar */}
                                <div className="w-32 h-32 bg-black border border-zinc-800 rounded-none mb-6 relative group">
                                    <div className="absolute inset-0 bg-[#ff5500]/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="w-full h-full flex items-center justify-center text-4xl font-black text-zinc-800 uppercase">
                                        {username?.charAt(0)}
                                    </div>
                                    <div className="absolute -bottom-2 -right-2">
                                        <DevIndicator />
                                    </div>
                                </div>

                                <h1 className="text-3xl font-black tracking-tighter mb-1 uppercase">{profile.name}</h1>
                                <p className="text-emerald-500 font-mono text-[10px] font-bold tracking-[0.2em] mb-4">{profile.handle}</p>

                                <p className="text-zinc-500 text-xs font-medium leading-relaxed mb-8 uppercase tracking-widest opacity-80">
                                    {profile.bio}
                                </p>

                                <div className="flex flex-col gap-4 mb-8">
                                    <Button variant="primary" size="lg" className="w-full shadow-[0_0_20px_rgba(255,85,0,0.1)]">
                                        Establish Uplink
                                    </Button>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Button variant="secondary" className="w-full h-10 flex items-center justify-center gap-2">
                                            <MessageSquare size={14} /> Talk
                                        </Button>
                                        <Button variant="secondary" className="w-full h-10 flex items-center justify-center gap-2">
                                            <Share2 size={14} /> Share
                                        </Button>
                                    </div>
                                </div>

                                <DiamondLine />

                                <div className="mt-8 space-y-6">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Active Nodes</span>
                                        <span className="text-white font-mono text-xs">{profile.stats.nodes}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Mesh Throughput</span>
                                        <span className="text-white font-mono text-xs">{profile.stats.uplinks}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Trust Protocol</span>
                                        <span className="text-emerald-500 font-mono text-xs">{profile.stats.reputation}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Content Area */}
                    <div className="flex-grow">
                        {/* Tabs */}
                        <div className="flex items-center gap-12 border-b border-zinc-900 mb-12">
                            {[
                                { id: 'projects', label: 'Nodes & Projects', icon: Box },
                                { id: 'automation', label: 'Flow Automation', icon: Zap },
                                { id: 'mesh', label: 'Neutral Mesh', icon: Cpu }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`pb-4 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3 transition-all relative
                                        ${activeTab === tab.id ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'}`}
                                >
                                    <tab.icon size={14} />
                                    {tab.label}
                                    {activeTab === tab.id && (
                                        <motion.div
                                            layoutId="profileTabLine"
                                            className="absolute bottom-0 inset-x-0 h-1 bg-orange-500"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Projects Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-1 rounded-none overflow-hidden bg-zinc-900/20 ring-1 ring-zinc-900">
                            {activeTab === 'projects' && profile.projects.map((project, i) => (
                                <motion.div
                                    key={project.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="group p-8 bg-black hover:bg-zinc-950 transition-all border border-zinc-900"
                                >
                                    <div className="flex items-start justify-between mb-8">
                                        <div className="w-12 h-12 bg-zinc-950 border border-zinc-800 flex items-center justify-center rounded-none group-hover:border-orange-500/30 transition-colors">
                                            <Database size={20} className="text-zinc-600 group-hover:text-white" />
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-bold text-emerald-500 uppercase tracking-widest">
                                            <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                            {project.status}
                                        </div>
                                    </div>

                                    <h3 className="text-sm font-bold uppercase tracking-[0.2em] mb-2 text-white">{project.name}</h3>
                                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-10 opacity-60">
                                        Deployed to {project.platform}
                                    </p>

                                    <div className="flex items-center justify-between mt-auto">
                                        <span className="text-[10px] font-mono text-zinc-700">{project.url}</span>
                                        <button className="text-zinc-600 hover:text-white transition-colors">
                                            <ArrowRight size={16} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}

                            {activeTab === 'automation' && (
                                <div className="col-span-2 p-20 text-center flex flex-col items-center">
                                    <Zap size={48} className="text-zinc-800 mb-8" />
                                    <h4 className="text-xl font-bold uppercase tracking-widest text-white mb-4">Intelligent Machine Intelligence</h4>
                                    <p className="text-zinc-500 text-xs font-medium uppercase tracking-[0.2em] max-w-md leading-relaxed mb-10">
                                        Automate your GitHub, Vercel, Firebase and HuggingFace orchestration with high-fidelity sovereign protocols.
                                    </p>
                                    <Button variant="secondary" className="px-12 h-12">Configure Automation</Button>
                                </div>
                            )}

                            {activeTab === 'mesh' && (
                                <div className="col-span-2 p-20 text-center flex flex-col items-center">
                                    <Cpu size={48} className="text-zinc-800 mb-8" />
                                    <h4 className="text-xl font-bold uppercase tracking-widest text-white mb-4">Mesh Networking Inactive</h4>
                                    <p className="text-zinc-500 text-xs font-medium uppercase tracking-[0.2em] max-w-md leading-relaxed mb-10">
                                        This user has not established a public neutral mesh node for distributed distributed compute yet.
                                    </p>
                                    <Button variant="secondary" className="px-12 h-12">Establish Mesh Node</Button>
                                </div>
                            )}
                        </div>

                        {/* Recent Activity Feed (Social Style) */}
                        <div className="mt-20">
                            <h3 className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.5em] mb-10 text-center">Protocol Feed</h3>
                            <div className="space-y-4">
                                {[
                                    { user: username, action: "materialized", project: "quantum-router", time: "2h ago" },
                                    { user: username, action: "uplinked", project: "neural-mesh-core", time: "5h ago" },
                                    { user: username, action: "pushed", project: "sovereign-db", time: "1d ago" },
                                ].map((act, i) => (
                                    <div key={i} className="p-6 bg-zinc-950/20 border border-zinc-900 flex items-center justify-between group hover:bg-zinc-950 transition-all">
                                        <div className="flex items-center gap-6">
                                            <div className="w-10 h-10 bg-black border border-zinc-900 flex items-center justify-center font-bold text-zinc-700 group-hover:text-white transition-colors">
                                                {act.user?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-xs text-white tracking-widest uppercase font-bold">
                                                    {act.user} <span className="text-zinc-600 lowercase font-medium mx-2">{act.action}</span> {act.project}
                                                </p>
                                                <span className="text-[9px] text-zinc-700 font-mono mt-1 block uppercase tracking-tighter">{act.time} // Protocol v4.2</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Heart size={14} className="text-zinc-600 hover:text-red-500 cursor-pointer" />
                                            <Bookmark size={14} className="text-zinc-600 hover:text-white cursor-pointer" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
