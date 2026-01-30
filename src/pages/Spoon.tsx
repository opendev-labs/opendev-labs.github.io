import React from 'react';
import { Terminal, Shield, Zap, Search, Cpu, Network, Activity } from 'lucide-react';
import { ProductPageTemplate } from '../components/ProductPageTemplate';
import { motion } from 'framer-motion';

export default function Spoon() {
    const features = [
        {
            title: "Trinity Companion",
            desc: "Your autonomous guide within the system. Predicts intent, automates complex workflows, and handles state synchronization via neural bridge.",
            icon: Shield
        },
        {
            title: "Tank Operator",
            desc: "The execution engine. Directly interfaces with the shell to build, deploy, and optimize local infrastructure in real-time with sub-atomic precision.",
            icon: Zap
        },
        {
            title: "Mouse Programmer",
            desc: "Deep analysis agent. Identifies security vulnerabilities, logic flaws, and architectural optimizations across your repository clusters.",
            icon: Search
        }
    ];

    const performanceMetrics = [
        {
            title: "Hardline Protocol",
            desc: "Enterprise-grade secure tunnel for agent communication and external LLM orchestration. No data leaks, purely encrypted logic paths.",
            icon: Network
        },
        {
            title: "WASM Runtime",
            desc: "Core CLI engine optimized for sub-millisecond response times across high-pressure development clusters.",
            icon: Activity
        },
        {
            title: "Unified Identity",
            desc: "Sync local tokens and session states across all OpenDev-Labs products with a single authenticated command.",
            icon: Cpu
        }
    ];

    const terminalContent = (
        <div className="space-y-6 font-mono text-[13px]">
            <div className="flex gap-4">
                <span className="text-zinc-700">$</span>
                <span className="text-zinc-100 font-bold tracking-tight">spoon opendev-labs login</span>
            </div>
            <div className="text-green-500/80 ml-8 leading-relaxed uppercase tracking-widest text-[11px] font-bold">
                <p>▸ Verifying Credentials...</p>
                <p>▸ Syncing Cloud State...</p>
                <p>▸ Linking Nexus ID...</p>
            </div>
            <div className="p-4 bg-zinc-900/30 rounded-xl border border-zinc-900/50 mt-6 animate-in fade-in duration-700">
                <div className="text-white font-mono leading-relaxed">
                    <span className="text-zinc-600 block mb-2 font-bold uppercase tracking-[0.2em] text-[10px]">Matrix Link established</span>
                    <span className="text-zinc-400">IDENTITY:</span> <span className="text-white">OPENDEV-REPOS</span><br />
                    <span className="text-zinc-400">STATUS:</span> <span className="text-green-500 font-bold tracking-widest">AUTHORIZED</span>
                </div>
            </div>
            <div className="flex gap-4 mt-8">
                <span className="text-zinc-700">$</span>
                <span className="text-white font-bold tracking-tight animate-pulse">spoon _</span>
            </div>
        </div>
    );

    return (
        <ProductPageTemplate
            badge="Universal AI Command Center"
            badgeIcon={Terminal}
            title="Spoon CLI"
            description="The agentic bridge between the Matrix and your local terminal. A high-fidelity CLI ecosystem designed for the next generation of autonomous development."
            features={features}
            performanceTitle="Reality is Programmable."
            performanceMetrics={performanceMetrics}
            codeSnippet={terminalContent}
        />
    );
}
