import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Dashboard } from '../features/void/components/Dashboard';
import { LamaDBConsole } from './LamaDBConsole';
import { useAuth } from '../features/void/hooks/useAuth';
import { LamaDB } from '../lib/lamaDB';
import { Project } from '../features/void/types';
import { GlobalLoader } from '../features/void/components/common/GlobalLoader';
import { SyncStackConsole } from './SyncStackConsole';
import { LamaDBTelemetry } from './LamaDBTelemetry';
import AgentsDashboard from './AgentsDashboard';
import BotsDashboard from './BotsDashboard';
import SystemsRegistry from './SystemsRegistry';

import { Activity, Cpu, Shield, Zap, Database, Terminal, Bot } from 'lucide-react';

export const UnifiedOfficeCockpit: React.FC = () => {
    const { isAuthenticated, user } = useAuth();
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [dbStats, setDbStats] = useState({ vaults: 0, status: 'Active' });

    useEffect(() => {
        const fetchState = async () => {
            if (!isAuthenticated || !user) return;
            try {
                const userContext = { uid: user.email, email: user.email };
                const userProjects = await LamaDB.store.collection('projects', userContext).get() as Project[];
                setProjects(userProjects.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()));

                // Simulated LamaDB Stats for Dashboard
                setDbStats({ vaults: 12, status: 'Active' });
            } catch (error) {
                console.error("Failed to fetch cockpit state:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchState();
    }, [isAuthenticated, user]);

    if (isLoading) return <GlobalLoader />;

    return (
        <div className="max-w-[1400px] mx-auto p-8 md:p-12 animate-in fade-in duration-700">
            {/* Header / Brand Context */}
            <div className="flex flex-col mb-12 pt-10">
                <div className="flex items-center gap-4 mb-8">
                    <Link to="/" className="text-[10px] font-bold text-zinc-600 hover:text-orange-500 transition-colors uppercase tracking-[0.4em]">
                        &larr; Return to Mesh
                    </Link>
                    <div className="w-1 h-1 rounded-full bg-zinc-800" />
                    <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em]">
                        Product: <span className="text-white">Void // Fleet Control</span>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 text-[9px] font-bold text-zinc-500 mb-6 uppercase tracking-[0.3em]">
                            <Terminal size={12} />
                            <span>Void-Control // Operations Hub</span>
                        </div>
                        <h1 className="text-5xl font-bold tracking-tighter lowercase leading-none">
                            fleet<br /><span className="text-zinc-600">manager.</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-4 bg-zinc-950 border border-zinc-900 p-4 rounded-none">
                        <div className="w-2 h-2 rounded-none bg-orange-500 animate-pulse" />
                        <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none">
                            Mesh Connectivity: <span className="text-orange-500">Optimized</span>
                        </div>
                    </div>
                </div>

                {/* Hybrid Telemetry (Cloud Console Vibes) */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
                    {[
                        { label: 'Neural Uplink', value: '100%', icon: Activity, color: 'text-orange-500' },
                        { label: 'DB Mesh (LamaDB)', value: dbStats.vaults, icon: Database, color: 'text-orange-500' },
                        { label: 'Latency', value: '0.4ms', icon: Zap, color: 'text-orange-500' },
                        { label: 'Security Node', value: 'Titan-Sovereign', icon: Shield, color: 'text-white' }
                    ].map((stat, i) => (
                        <div key={i} className="bg-zinc-950 border border-zinc-900 p-6 hover:border-orange-500/30 transition-all group rounded-none">
                            <div className="flex items-center gap-3 mb-2">
                                <stat.icon size={12} className={`${stat.color} opacity-20 group-hover:opacity-100 transition-opacity`} />
                                <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.2em]">{stat.label}</span>
                            </div>
                            <div className="text-xl font-bold tracking-tighter text-zinc-300">{stat.value}</div>
                        </div>
                    ))}
                </div>

                {/* Project Surface (Firebase Vibes) */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
                        <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-400">Deployed Primaries</h3>
                        <div className="flex items-center gap-2 text-[10px] text-zinc-700 font-bold uppercase tracking-widest">
                            <span>Total: {projects.length} Nodes</span>
                        </div>
                    </div>
                    {/* Dashboard component handles the grid layout */}
                    <div className="-mx-6">
                        <Dashboard
                            projects={projects}
                            onUpdateProject={(updated) => setProjects(prev => prev.map(p => p.id === updated.id ? updated : p))}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export const LamaDBOfficeCockpit: React.FC = () => {
    return (
        <div className="-mt-24">
            <LamaDBConsole />
        </div>
    );
};



export const SyncStackOfficeCockpit: React.FC = () => {
    return (
        <div className="pt-0 h-screen bg-black overflow-hidden">
            <SyncStackConsole />
        </div>
    );
};

export const LamaDBTelemetryCockpit: React.FC = () => {
    return (
        <div className="min-h-screen bg-black">
            <LamaDBTelemetry />
        </div>
    );
};

export const AgentsOfficeCockpit: React.FC = () => {
    return (
        <div className="min-h-screen bg-black">
            <AgentsDashboard />
        </div>
    );
};
export const BotsOfficeCockpit: React.FC = () => {
    return (
        <div className="min-h-screen bg-black">
            <BotsDashboard />
        </div>
    );
};
export const SystemsOfficeCockpit: React.FC = () => {
    return (
        <div className="min-h-screen bg-black">
            <SystemsRegistry />
        </div>
    );
};
