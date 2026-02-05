import React, { useEffect, useState } from 'react';
import { Database, Zap, Search, Terminal } from 'lucide-react';
import { useAuth } from '../features/void/hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';

const SaveIcon = ({ className, size }: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
);

export const LamaDBConsole = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ reads: 0, writes: 0, latency: '0.4ms' });
    const [logs, setLogs] = useState<string[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            setStats(prev => ({
                reads: prev.reads + Math.floor(Math.random() * 5),
                writes: prev.writes + Math.floor(Math.random() * 2),
                latency: (0.2 + Math.random() * 0.3).toFixed(2) + 'ms'
            }));
            if (Math.random() > 0.7) {
                const actions = ['SYNC_OUTBOUND', 'INDEX_REBUILD', 'CACHE_HIT', 'NODE_DISCOVERY'];
                setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${actions[Math.floor(Math.random() * actions.length)]} :: OK`, ...prev.slice(0, 5)]);
            }
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-black pt-12 pb-20 px-6 max-w-[1400px] mx-auto animate-in fade-in duration-700">
            <div className="flex flex-col mb-12">
                <div className="flex items-center gap-4 mb-8">
                    <Link to="/" className="text-[10px] font-bold text-zinc-600 hover:text-orange-500 transition-colors uppercase tracking-[0.4em]">
                        &larr; Return to Mesh
                    </Link>
                    <div className="w-1 h-1 rounded-full bg-zinc-800" />
                    <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em]">
                        Product: <span className="text-white">LamaDB // Registry</span>
                    </div>
                </div>

                <div className="flex items-end justify-between border-b border-zinc-900 pb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                                <Database size={20} className="text-orange-500" />
                            </div>
                            <h1 className="text-3xl font-bold text-white tracking-tighter">LamaDB // Registry</h1>
                        </div>
                        <p className="text-zinc-500 font-mono text-sm">Authenticated as <span className="text-white">{user?.email}</span></p>
                    </div>
                    <div className="flex gap-4">
                        <div className="text-right">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Protocol Status</p>
                            <div className="flex items-center justify-end gap-2 mt-1">
                                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                                <span className="text-orange-500 font-bold text-sm">SYNCHRONIZED</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
                {[
                    { label: 'Total Reads', value: stats.reads.toLocaleString(), icon: Search },
                    { label: 'Total Writes', value: stats.writes.toLocaleString(), icon: SaveIcon },
                    { label: 'Avg Latency', value: stats.latency, icon: Zap },
                    { label: 'Storage Used', value: '14.2 MB', icon: Database }
                ].map((stat, i) => (
                    <div key={i} className="bg-zinc-950 border border-zinc-900 p-6 flex items-center justify-between group hover:border-orange-500/30 transition-colors rounded-none">
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-2">{stat.label}</p>
                            <p className="text-2xl font-bold text-zinc-300 tracking-tight">{stat.value}</p>
                        </div>
                        <stat.icon size={20} className="text-zinc-800 group-hover:text-orange-500 transition-colors" />
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-zinc-950 border border-zinc-900">
                        <div className="p-4 border-b border-zinc-900 flex justify-between items-center bg-zinc-900/50">
                            <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                                <Terminal size={14} /> Active Queries
                            </h3>
                        </div>
                        <div className="p-0 overflow-hidden">
                            <div className="font-mono text-xs p-4 space-y-2">
                                <div className="text-zinc-500">$ query.collection('projects').where('userId', '==', '{user?.uid}')</div>
                                <div className="text-orange-500/80">▸ Found 3 documents in 0.4ms</div>
                            </div>
                            <div className="font-mono text-xs p-4 bg-black/50 border-t border-zinc-900/50 space-y-1">
                                {logs.map((log, i) => (
                                    <div key={i} className="text-zinc-600">{log}</div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-zinc-950 border border-zinc-900 p-12 flex flex-col items-center justify-center text-center min-h-[350px] group hover:border-orange-500/10 transition-colors">
                        <Database size={40} className="text-zinc-800 mb-6 group-hover:text-orange-500/40 transition-colors" />
                        <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-widest">Collections</h3>
                        <p className="text-zinc-600 text-[11px] font-bold uppercase tracking-widest max-w-sm mb-8 leading-relaxed">
                            You have access to the global mesh. Create a new collection to start syncing state.
                        </p>
                        <Button variant="secondary" size="md" className="rounded-none border-zinc-800 hover:border-orange-500 transition-colors uppercase tracking-widest text-[10px]">Create Collection</Button>
                    </div>
                </div>

                <div className="bg-zinc-950 border border-zinc-900 p-8">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-8 pb-4 border-b border-zinc-900">Connected Peers</h3>
                    <div className="space-y-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="w-1.5 h-1.5 rounded-none bg-orange-500/30 group-hover:bg-orange-500 animate-pulse" />
                                <div className="flex-1">
                                    <div className="h-[1px] w-full bg-zinc-900 mb-2" />
                                    <div className="flex justify-between items-center">
                                        <span className="text-[9px] font-mono text-zinc-600 font-bold">NODE_IDX_{i}</span>
                                        <span className="text-[9px] font-mono text-zinc-800">0.0{i}ms</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
