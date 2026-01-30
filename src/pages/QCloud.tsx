import React from 'react';
import { Server, Zap, Shield, Cpu, Cloud, Activity, Network } from 'lucide-react';
import { ProductPageTemplate } from '../components/ProductPageTemplate';
import { motion } from 'framer-motion';

export default function QCloud() {
    const features = [
        {
            title: "Sovereign Edge",
            desc: "Dedicated compute resources that you truly own. No noisy neighbors, no shared kernels. Pure performance at the boundaries.",
            icon: Server
        },
        {
            title: "Intent Execution",
            desc: "Optimized for AI agent workloads and real-time inference at the edge. High-fidelity logic processing with sub-atomic latency.",
            icon: Zap
        },
        {
            title: "Zero-Trust Fabric",
            desc: "Automated certificate rotation and advanced DDoS protection integrated at the packet level for maximum node security.",
            icon: Shield
        }
    ];

    const performanceMetrics = [
        {
            title: "Real-time Telemetry",
            desc: "Deep visibility into every function execution and network hop with sub-second resolution and automated alerting.",
            icon: Activity
        },
        {
            title: "Mesh Routing",
            desc: "Proprietary routing protocol that finds the fastest path through the global internet mesh automatically.",
            icon: Network
        },
        {
            title: "Unified Control Plane",
            desc: "Manage global infrastructure with a single CLI or API call. Zero configuration required for multi-region deployment.",
            icon: Cpu
        }
    ];

    const statsOverlay = (
        <div className="space-y-6 font-mono text-[13px] w-full">
            <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
                <span className="text-zinc-600 uppercase tracking-widest text-[10px] font-bold">Node Region</span>
                <span className="text-zinc-600 uppercase tracking-widest text-[10px] font-bold">Protocol Status</span>
            </div>
            <div className="flex justify-between items-center border-b border-zinc-900 pb-3 group/row">
                <span className="text-zinc-400 group-hover/row:text-white transition-colors">US-EAST-1 (CLE)</span>
                <span className="text-green-500 font-bold tracking-tighter uppercase">Operational</span>
            </div>
            <div className="flex justify-between items-center border-b border-zinc-900 pb-3 group/row">
                <span className="text-zinc-400 group-hover/row:text-white transition-colors">EU-CENTRAL-1 (FRA)</span>
                <span className="text-green-500 font-bold tracking-tighter uppercase">Operational</span>
            </div>
            <div className="flex justify-between items-center border-b border-zinc-900 pb-3 group/row">
                <span className="text-zinc-400 group-hover/row:text-white transition-colors">AP-NORTHEAST-1 (TYO)</span>
                <span className="text-green-500 font-bold tracking-tighter uppercase">Operational</span>
            </div>
            <div className="pt-6">
                <div className="text-zinc-700 text-[10px] font-bold uppercase tracking-[0.3em] mb-4">Neural Compilation Flow</div>
                <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "75%" }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                        className="h-full bg-blue-500"
                    />
                </div>
            </div>
        </div>
    );

    return (
        <ProductPageTemplate
            badge="Quantum Ready Infrastructure"
            badgeIcon={Cloud}
            title="Q-Cloud"
            description="Global edge network for sovereign application logic. Sub-atomic latency for the next generation of neural systems and distributed intelligence."
            features={features}
            performanceTitle="The Network is the Computer."
            performanceMetrics={performanceMetrics}
            codeSnippet={statsOverlay}
        />
    );
}
