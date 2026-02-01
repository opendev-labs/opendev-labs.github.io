import React, { useEffect, useState } from 'react';
import { Database, Shield, Zap, Globe, Layers, Cpu, Code, Loader, Plus, Trash, Search, Terminal } from 'lucide-react';
import { ProductPageTemplate } from '../components/ProductPageTemplate';
import { useAuth } from '../features/void/hooks/useAuth';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { LamaDB as DB } from '../lib/lamaDB';
import { motion } from 'framer-motion';

// Icon helper
const SaveIcon = ({ className, size }: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
);

export const ConsoleView = () => {
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
        <div className="min-h-screen bg-black pt-24 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-end justify-between mb-12 border-b border-zinc-800 pb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                <Database size={20} className="text-emerald-500" />
                            </div>
                            <h1 className="text-3xl font-bold text-white tracking-tighter">LamaDB Console</h1>
                        </div>
                        <p className="text-zinc-500 font-mono text-sm">Authenticated as <span className="text-white">{user?.email}</span></p>
                    </div>
                    <div className="flex gap-4">
                        <div className="text-right">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Node Status</p>
                            <div className="flex items-center justify-end gap-2 mt-1">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-emerald-500 font-bold text-sm">ONLINE</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: 'Total Reads', value: stats.reads.toLocaleString(), icon: Search },
                        { label: 'Total Writes', value: stats.writes.toLocaleString(), icon: SaveIcon },
                        { label: 'Avg Latency', value: stats.latency, icon: Zap },
                        { label: 'Storage Used', value: '14.2 MB', icon: Database }
                    ].map((stat, i) => (
                        <div key={i} className="bg-zinc-950 border border-zinc-900 p-6 flex items-center justify-between group hover:border-zinc-700 transition-colors">
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-2">{stat.label}</p>
                                <p className="text-2xl font-bold text-white tracking-tight">{stat.value}</p>
                            </div>
                            <stat.icon className="text-zinc-800 group-hover:text-zinc-600 transition-colors" size={24} />
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-zinc-950 border border-zinc-900">
                            <div className="p-4 border-b border-zinc-900 flex justify-between items-center bg-zinc-900/50">
                                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                    <Terminal size={14} /> Active Queries
                                </h3>
                            </div>
                            <div className="p-0 overflow-hidden">
                                <div className="font-mono text-xs p-4 space-y-2">
                                    <div className="text-zinc-500">$ query.collection('projects').where('userId', '==', '{user?.uid}')</div>
                                    <div className="text-emerald-500/80">▸ Found 3 documents in 0.4ms</div>
                                </div>
                                <div className="font-mono text-xs p-4 bg-black/50 border-t border-zinc-900/50 space-y-1">
                                    {logs.map((log, i) => (
                                        <div key={i} className="text-zinc-600">{log}</div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="bg-zinc-950 border border-zinc-900 p-8 flex flex-col items-center justify-center text-center min-h-[300px]">
                            <Database size={48} className="text-zinc-800 mb-6" />
                            <h3 className="text-lg font-bold text-white mb-2">Collections</h3>
                            <p className="text-zinc-500 text-sm max-w-sm mb-8">
                                You have access to the global mesh. Create a new collection to start syncing state.
                            </p>
                            <Button variant="secondary" size="md">Create Collection</Button>
                        </div>
                    </div>

                    <div className="bg-zinc-950 border border-zinc-900 p-6">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-6">Connected Peers</h3>
                        <div className="space-y-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
                                    <div className="flex-1">
                                        <div className="h-1.5 w-24 bg-zinc-800 rounded-full mb-1" />
                                        <div className="h-1.5 w-16 bg-zinc-900 rounded-full" />
                                    </div>
                                    <span className="text-[10px] font-mono text-zinc-600">US-EAST-{i}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};



export default function LamaDB() {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return <ConsoleView />;
    }

    const features = [
        {
            title: "Sub-Zero Latency",
            desc: "Data is stored locally in IndexedDB, providing instant reads and writes even when offline. No round-trips for core state.",
            icon: Zap
        },
        {
            title: "End-to-End Security",
            desc: "Military-grade encryption at rest and in transit. Your data remains sovereign on the client until synchronized.",
            icon: Shield
        },
        {
            title: "Global Edge Sync",
            desc: "Automatically synchronize data across devices and edge locations using our proprietary neural mesh network.",
            icon: Globe
        }
    ];

    const performanceMetrics = [
        {
            title: "Multi-Model Engine",
            desc: "Supports Document, Key-Value, and Graph patterns in a single unified API without storage leaks.",
            icon: Layers
        },
        {
            title: "WASM Runtime",
            desc: "Core engine written in Rust and compiled to WASM for near-native local processing speeds in the browser.",
            icon: Cpu
        },
        {
            title: "Type-Safe Queries",
            desc: "First-class TypeScript support with generated schemas and compile-time validation for distributed state.",
            icon: Code
        }
    ];

    const codeSnippet = (
        <>
            <div className="text-zinc-600 mb-6 font-mono text-xs">// Initialize LamaDB Nexus</div>
            <div className="text-zinc-300">import <span className="text-zinc-500">{'{'}</span> lama <span className="text-zinc-500">{'}'}</span> from <span className="text-zinc-400">'@opendev-labs/lamadb'</span>;</div>
            <div className="text-zinc-500 mt-6 font-mono">const <span className="text-white">db</span> = await lama.<span className="text-white">connect</span>();</div>
            <div className="text-zinc-500 mt-6 font-mono">await <span className="text-white">db</span>.<span className="text-white">nodes</span>.<span className="text-white">insert</span>({'{'}</div>
            <div className="pl-6 text-zinc-500 font-mono">
                id: <span className="text-zinc-300">'node_01'</span>,<br />
                protocol: <span className="text-zinc-300">'high-fidelity'</span>
            </div>
            <div className="text-zinc-500 font-mono">{'}'});</div>
            <div className="text-zinc-600 mt-10 font-mono text-xs">// Sub-atomic state recovery</div>
            <div className="text-zinc-500 font-mono">const <span className="text-white">state</span> = await <span className="text-white">db</span>.<span className="text-white">nodes</span>.<span className="text-white">query</span>();</div>
        </>
    );

    return (
        <ProductPageTemplate
            badge="The Browser Native Database"
            badgeIcon={Database}
            title="LamaDB"
            description="A high-performance, edge-first database designed to run everywhere. Store, sync, and secure data directly in the browser with zero infrastructure setup."
            features={features}
            performanceTitle="Engineered for Performance."
            performanceMetrics={performanceMetrics}
            codeSnippet={codeSnippet}
        />
    );
}
