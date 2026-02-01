import { Box, Layers, Zap, Shield, GitBranch, Cpu, Network, Download, Monitor, HardDrive, Smartphone, Check, ExternalLink, Key, User } from 'lucide-react';
import { ProductPageTemplate } from '../components/ProductPageTemplate';
import { motion } from 'framer-motion';
import { githubPATService } from '../features/void/services/githubPATService';
import { useNavigate } from 'react-router-dom';
import syncstackLogo from '../assets/syncstack-logo.svg';

export default function SyncStack() {
    const navigate = useNavigate();
    const features = [
        {
            title: "Quantum Sharding",
            desc: "Distributed data fragments optimized for instantaneous reconciliation across globally indexed nodes with zero-latency state propagation.",
            icon: Layers
        },
        {
            title: "Light-speed Sync",
            desc: "Sub-millisecond latency for state propagation using advanced binary delta protocols and neural-path optimization.",
            icon: Zap
        },
        {
            title: "Immutable Integrity",
            desc: "Every synchronization block is strictly validated against a zero-knowledge proof mesh for bulletproof cryptographic integrity.",
            icon: Shield
        }
    ];

    const performanceMetrics = [
        {
            title: "Unified Cluster Binding",
            desc: "Bind disparate infrastructure nodes into a single coherent synchronisation stack. Automatically handles network partitioning.",
            icon: Network
        },
        {
            title: "Neural Load Balancing",
            desc: "Intelligently routes synchronization traffic based on cluster health and proximity, ensuring peak performance under stress.",
            icon: Cpu
        },
        {
            title: "Delta Reconciliation",
            desc: "Minimal payload size by only transmitting modified states, reducing bandwidth consumption by up to 90% across the nexus.",
            icon: GitBranch
        }
    ];

    const patUsername = githubPATService.getUsername();
    const isConnected = !!githubPATService.getPAT();

    const clusterStatus = (
        <div className="space-y-8 font-mono text-[13px]">
            {/* Connection Status Badge */}
            <div className="flex justify-between items-center border-b border-zinc-900 pb-4">
                <span className="text-zinc-600 uppercase tracking-widest text-[10px] font-bold">Protocol Link</span>
                <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                    <span className={`text-[11px] font-bold uppercase ${isConnected ? 'text-emerald-500' : 'text-red-500'}`}>
                        {isConnected ? 'Linked' : 'Offline'}
                    </span>
                </div>
            </div>

            {/* Account Info */}
            {isConnected && (
                <div className="p-4 bg-zinc-900/50 border border-zinc-800 space-y-2">
                    <div className="flex items-center gap-3">
                        <User size={14} className="text-zinc-500" />
                        <span className="text-zinc-400 capitalize">@{patUsername}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Key size={14} className="text-zinc-500" />
                        <span className="text-zinc-600">••••••••••••••••</span>
                    </div>
                </div>
            )}

            {/* Telemetry */}
            <div className="space-y-4 pt-2">
                <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-none bg-blue-500 animate-pulse" />
                    <span className="text-zinc-500 text-[11px] uppercase tracking-widest">Sharding protocol: {isConnected ? 'active' : 'idle'}</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-none bg-blue-500 animate-pulse delay-75" />
                    <span className="text-zinc-500 text-[11px] uppercase tracking-widest">State Reconciliation: {isConnected ? '99.9%' : '0%'}</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-none bg-blue-500 animate-pulse delay-150" />
                    <span className="text-zinc-500 text-[11px] uppercase tracking-widest">Node consensus: established</span>
                </div>
            </div>

            {/* Multi-Platform Connection Matrix */}
            <div className="grid grid-cols-2 gap-4 mt-8">
                {[
                    { name: 'GitHub', icon: GitBranch, connected: isConnected, path: '/void/new/import' },
                    { name: 'Vercel', icon: Zap, connected: false, path: '#' },
                    { name: 'Firebase', icon: Shield, connected: false, path: '#' },
                    { name: 'HuggingFace', icon: Cpu, connected: false, path: '#' }
                ].map((platform) => (
                    <div key={platform.name} className="p-4 bg-zinc-900 border border-zinc-800 flex flex-col justify-between group hover:border-zinc-600 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <platform.icon size={16} className={platform.connected ? 'text-emerald-500' : 'text-zinc-600'} />
                            <div className={`w-1.5 h-1.5 rounded-full ${platform.connected ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-800'}`} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-white mb-2">{platform.name}</p>
                            {platform.connected ? (
                                <p className="text-[9px] text-emerald-500/60 uppercase font-bold">Synchronized</p>
                            ) : (
                                <button
                                    onClick={() => navigate(platform.path)}
                                    className="text-[9px] text-zinc-500 hover:text-white uppercase font-bold transition-colors"
                                >
                                    Connect Node &rarr;
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop Link CTA */}
            <div className="mt-8 p-6 bg-blue-500/5 border border-blue-500/10 rounded-none group hover:bg-blue-500/10 transition-all cursor-default">
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-3 font-mono flex items-center gap-2">
                    <Monitor size={12} /> Desktop Core Synchronization
                </p>
                <p className="text-[11px] text-blue-200/60 leading-relaxed mb-4">
                    SyncStack Desktop connects your local workspace directly to the OpenDev Nexus. Download the client to begin hardware-level orchestration.
                </p>
                <div className="grid grid-cols-2 gap-2">
                    <button className="h-9 bg-white text-black text-[9px] font-bold uppercase tracking-widest hover:bg-zinc-200 flex items-center justify-center gap-2">
                        <Download size={12} /> Windows
                    </button>
                    <button className="h-9 border border-zinc-800 text-white text-[9px] font-bold uppercase tracking-widest hover:bg-zinc-900 flex items-center justify-center gap-2">
                        <Download size={12} /> Linux
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <ProductPageTemplate
            badge="SyncStack Official Protocol"
            badgeIcon={() => <img src={syncstackLogo} className="w-4 h-4 grayscale opacity-50" alt="" />}
            title="SyncStack"
            description="The distributed synchronization layer for modern nexus clusters. Zero-latency state propagation with cryptographic integrity across sovereign nodes."
            features={features}
            performanceTitle="Seamless Synchronization."
            performanceMetrics={performanceMetrics}
            codeSnippet={clusterStatus}
            primaryActionLabel="Connect Now"
            onPrimaryAction={() => navigate('/office/syncstack')}
        />
    );
}
