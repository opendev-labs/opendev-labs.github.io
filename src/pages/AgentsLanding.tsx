import { Bot, Sparkles, Brain, Zap, Globe, Search, MessageSquare, Shield, Cpu, Activity, Network } from "lucide-react";
import { ProductPageTemplate } from "../components/ProductPageTemplate";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function AgentsLanding() {
    const navigate = useNavigate();

    const features = [
        {
            title: "Autonomous Intelligence",
            desc: "Deploy agents that perceive, reason, and act independently across your digital infrastructure with zero-shot task execution.",
            icon: Brain
        },
        {
            title: "Multi-Agent Mesh",
            desc: "Experience seamless collaboration as agents communicate via high-fidelity protocols to solve complex multi-step objectives.",
            icon: Network
        },
        {
            title: "Titan-Secure Execution",
            desc: "Every agent operation is sandboxed within a sovereign execution node, ensuring 100% data privacy and cryptographic integrity.",
            icon: Shield
        }
    ];

    const performanceMetrics = [
        {
            title: "Neural Pathing",
            desc: "Advanced intent-based routing ensures agents take the most efficient path to task completion with minimal token waste.",
            icon: Zap
        },
        {
            title: "Agent Architect",
            desc: "Visual flow-based builder allows you to materialize complex agent behaviors without writing a single line of logic.",
            icon: Cpu
        },
        {
            title: "Persistent Memory",
            desc: "Integrated LamaDB binding allows agents to maintain long-term context and learn from every interaction across the mesh.",
            icon: Activity
        }
    ];

    const meshStatus = (
        <div className="space-y-8 font-mono text-[13px]">
            <div className="flex justify-between items-center border-b border-zinc-900 pb-4">
                <span className="text-zinc-600 uppercase tracking-widest text-[10px] font-bold">Autonomous Protocol</span>
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-none bg-orange-500 animate-pulse" />
                    <span className="text-[11px] font-bold uppercase text-orange-500">
                        Mesh Online
                    </span>
                </div>
            </div>

            <div className="p-6 bg-zinc-950 border border-zinc-900 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-[2px] h-full bg-orange-600" />
                <div className="text-zinc-500 font-mono text-[9px] font-bold uppercase tracking-[0.3em] mb-3 opacity-50">Active Agents</div>
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-zinc-400">▸ OPEN_STUDIO_NODE_01</span>
                        <span className="text-orange-500/80 text-[10px]">COLLECTING_LOGS</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-zinc-400">▸ ARCHITECT_CORE</span>
                        <span className="text-emerald-500/80 text-[10px]">READY</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-zinc-400">▸ SENTINEL_PRIME</span>
                        <span className="text-blue-500/80 text-[10px]">MONITORING</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-2 mt-8">
                <div className="p-4 bg-zinc-900/30 border border-zinc-800 rounded-none group hover:bg-zinc-900/50 transition-all cursor-default">
                    <p className="text-[11px] text-zinc-400 leading-relaxed italic opacity-80">
                        "Initialize the neural handshake. We are ready to materialize your objectives across the sovereign cluster."
                    </p>
                    <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-3 text-right">
                        — Core Intelligence
                    </p>
                </div>
            </div>
        </div>
    );

    return (
        <ProductPageTemplate
            badge="Autonomous Agent Ecosystem"
            badgeIcon={Bot}
            title="Agent Mesh"
            description="High-fidelity autonomous agents for the 2026 AI era. Build, deploy, and orchestrate sovereign intelligence across your entire infrastructure."
            features={features}
            performanceTitle="Engineered for Autonomy."
            performanceMetrics={performanceMetrics}
            codeSnippet={meshStatus}
            primaryActionLabel="Launch Architect"
            onPrimaryAction={() => navigate('/agents/dashboard')}
            secondaryActionLabel="View Templates"
            onSecondaryAction={() => navigate('/agents/dashboard')}
        />
    );
}
