import React from 'react';
import { Box, Layers, Zap, Shield, GitBranch, Cpu, Network } from 'lucide-react';
import { ProductPageTemplate } from '../components/ProductPageTemplate';

export default function SyncStack() {
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

    const clusterStatus = (
        <div className="space-y-6 font-mono text-[13px]">
            <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
                <span className="text-zinc-600 uppercase tracking-widest text-[10px] font-bold">Cluster ID</span>
                <span className="text-zinc-400 font-bold">NEXUS-STACK-091</span>
            </div>
            <div className="space-y-4 pt-4">
                <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-none bg-blue-500 animate-pulse" />
                    <span className="text-zinc-500 text-[11px] uppercase tracking-widest">Sharding protocol: active</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-none bg-blue-500 animate-pulse delay-75" />
                    <span className="text-zinc-500 text-[11px] uppercase tracking-widest">Global replication: 99.9%</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-none bg-blue-500 animate-pulse delay-150" />
                    <span className="text-zinc-500 text-[11px] uppercase tracking-widest">Node consensus: established</span>
                </div>
            </div>
            <div className="mt-8 p-4 bg-blue-500/5 border border-blue-500/10 rounded-none">
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1 font-mono">Synchronization Delta</p>
                <p className="text-xs text-blue-200 font-mono">PROG: [||||||||||||||||||||||] 100%</p>
            </div>
        </div>
    );

    return (
        <ProductPageTemplate
            badge="Distributed Protocol Ready"
            badgeIcon={Box}
            title="SyncStack"
            description="The distributed synchronization layer for modern nexus clusters. Zero-latency state propagation with cryptographic integrity across sovereign nodes."
            features={features}
            performanceTitle="Seamless Synchronization."
            performanceMetrics={performanceMetrics}
            codeSnippet={clusterStatus}
        />
    );
}
