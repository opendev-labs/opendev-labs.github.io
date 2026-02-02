import React, { useState, useEffect } from 'react';
import { Activity, Database, Zap, Shield, ArrowUpRight, ArrowDownRight, RefreshCcw, LayoutGrid } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StatCard: React.FC<{ label: string; value: string | number; change: number; icon: any; color: string }> = ({ label, value, change, icon: Icon, color }) => (
    <div className="bg-zinc-950 border border-zinc-900 p-6 relative overflow-hidden group hover:border-zinc-700 transition-all">
        <div className={`absolute top-0 right-0 w-24 h-24 ${color} opacity-[0.03] blur-3xl -mr-10 -mt-10 group-hover:opacity-10 transition-opacity`} />
        <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-zinc-900 rounded-lg">
                <Icon size={16} className={`${color}`} />
            </div>
            <div className={`flex items-center gap-1 text-[10px] font-bold ${change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {change >= 0 ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                {Math.abs(change)}%
            </div>
        </div>
        <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">{label}</div>
        <div className="text-2xl font-bold tracking-tighter text-white">{value}</div>
    </div>
);

const TelemetryChart: React.FC = () => {
    const [points, setPoints] = useState<number[]>(Array(20).fill(40));

    useEffect(() => {
        const interval = setInterval(() => {
            setPoints(prev => [...prev.slice(1), 30 + Math.random() * 40]);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="h-32 w-full flex items-end gap-1 px-4">
            {points.map((p, i) => (
                <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${p}%` }}
                    className="flex-1 bg-emerald-500/20 border-t border-emerald-500/50"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
            ))}
        </div>
    );
};

export const LamaDBTelemetry: React.FC = () => {
    const [logs, setLogs] = useState<string[]>([]);

    useEffect(() => {
        const messages = [
            "Handshake establishing with node_0x44...",
            "Registry sync complete (124ms)",
            "LamaDB protocol v2.4 initialized",
            "Vault encryption cycle: OK",
            "Clustering 4 primary shards...",
            "Telemetry stream redirected to /office/admin",
            "Peer discovery active: 12 nodes found"
        ];
        let i = 0;
        const interval = setInterval(() => {
            setLogs(prev => [messages[i % messages.length], ...prev.slice(0, 10)]);
            i++;
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-8 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                <div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-bold text-emerald-500 mb-4 uppercase tracking-[0.3em] w-fit">
                        <Activity size={10} />
                        <span>Live Telemetry // Administrative Console</span>
                    </div>
                    <h1 className="text-4xl font-bold tracking-tighter text-white lowercase">
                        lamadb<span className="text-zinc-600">.insight</span>
                    </h1>
                </div>

                <div className="flex items-center gap-4 border border-zinc-900 bg-zinc-950 p-1 px-4 py-2">
                    <div className="flex flex-col">
                        <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Master Node Status</span>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-xs font-bold text-white tracking-tight">OPERATIONAL</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <StatCard label="Ops/Second" value="1,244" change={12.5} icon={Zap} color="text-yellow-500" />
                <StatCard label="Total Shards" value="128" change={2.1} icon={Database} color="text-emerald-500" />
                <StatCard label="Sync Latency" value="0.44ms" change={-4.3} icon={RefreshCcw} color="text-blue-500" />
                <StatCard label="Data Integrity" value="99.98%" change={0.01} icon={Shield} color="text-white" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-zinc-950 border border-zinc-900 p-8">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-400">Traffic Distribution</h3>
                        <div className="flex gap-2">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 bg-emerald-500/50" />
                                <span className="text-[10px] text-zinc-600 font-bold uppercase">Writes</span>
                            </div>
                            <div className="flex items-center gap-1.5 ml-4">
                                <div className="w-2 h-2 bg-blue-500/50" />
                                <span className="text-[10px] text-zinc-600 font-bold uppercase">Reads</span>
                            </div>
                        </div>
                    </div>
                    <TelemetryChart />
                    <div className="mt-8 border-t border-zinc-900 pt-8 flex justify-between">
                        <div className="space-y-1">
                            <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Peak Load</div>
                            <div className="text-lg font-bold text-white tracking-tighter">8.4 GB/s</div>
                        </div>
                        <div className="space-y-1 text-right">
                            <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Global Rank</div>
                            <div className="text-lg font-bold text-white tracking-tighter">Top 0.01%</div>
                        </div>
                    </div>
                </div>

                <div className="bg-zinc-950 border border-zinc-900 p-8 flex flex-col">
                    <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-400 mb-8">Protocol Stream</h3>
                    <div className="flex-1 space-y-4 font-mono text-[11px] overflow-hidden">
                        <AnimatePresence>
                            {logs.map((log, i) => (
                                <motion.div
                                    key={log + i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="flex gap-3 text-zinc-500"
                                >
                                    <span className="text-zinc-800 tabular-nums shrink-0">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                                    <span className="truncate">{log}</span>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                    <button className="mt-8 w-full py-3 bg-zinc-900 border border-zinc-800 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all">
                        Access Deep Audit Logs
                    </button>
                </div>
            </div>
        </div>
    );
};
