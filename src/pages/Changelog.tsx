import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Cpu, Globe, Zap, Shield, GitBranch, Terminal, ArrowRight } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

interface ChangeEntry {
    version: string;
    date: string;
    type: 'CORE' | 'AI' | 'NEXUS' | 'SYSTEM';
    title: string;
    description: string;
    updates: string[];
    icon: any;
}

const changelogData: ChangeEntry[] = [
    {
        version: "v2.4.0",
        date: "FEB 02, 2026",
        type: "AI",
        title: "open-studio Superagent & Core",
        description: "A major overhaul of the AI orchestrator and workspace management.",
        icon: Sparkles,
        updates: [
            "Evolved sub0 to open-studio with 'Neural Handshake' chat interface.",
            "Implemented buttery smooth 'Infrastructure Slide-in' for builds.",
            "Created Agents Registry for managing specialized AI personas.",
            "Fixed Pulse V2 Preview with robust Babel-powered runtime.",
            "Integrated SyncStack connection UI for GitHub, Vercel, and Firebase."
        ]
    },
    {
        version: "v2.3.5",
        date: "JAN 30, 2026",
        type: "NEXUS",
        title: "Official Identity & Branding",
        description: "Establishing a unified visual language and secure authentication flow.",
        icon: Shield,
        updates: [
            "Deployed the official OpenDev-Labs high-fidelity logo.",
            "Refined Preloader experience with SVG path animations.",
            "Upgraded Digital Pact (Terms) and Privacy Protocol.",
            "Established Hardline Protocol for cross-node authentication."
        ]
    },
    {
        version: "v2.3.0",
        date: "JAN 28, 2026",
        type: "CORE",
        title: "LamaDB & Void Integration",
        description: "The primary database layer is now fully connected to the engine.",
        icon: Cpu,
        updates: [
            "LamaDB integrated as the primary persistence engine for Void.",
            "Implemented Delta Reconciliation for 90% faster state sync.",
            "Added Universal CLI Harness via Spoon CLI.",
            "Optimized state propagation across sovereign nodes."
        ]
    }
];

const CategoryBadge = ({ type }: { type: ChangeEntry['type'] }) => {
    const colors = {
        CORE: "bg-blue-500/10 text-blue-500 border-blue-500/20",
        AI: "bg-orange-500/10 text-orange-500 border-orange-500/20",
        NEXUS: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
        SYSTEM: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20"
    };

    return (
        <span className={`px-2 py-0.5 rounded text-[9px] font-bold border uppercase tracking-widest ${colors[type]}`}>
            {type}
        </span>
    );
};

export const Changelog: React.FC = () => {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-orange-500/30">
            <Header />

            <main className="container mx-auto max-w-4xl px-6 pt-32 pb-40">
                {/* Hero Section */}
                <header className="mb-24 space-y-6 text-center md:text-left">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-zinc-500 text-[10px] font-bold uppercase tracking-[0.4em] justify-center md:justify-start"
                    >
                        <Terminal size={14} className="text-orange-500" /> Registry // Evolution Path
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-6xl md:text-8xl font-black tracking-tighter lowercase leading-[0.8]"
                    >
                        change<br /><span className="text-zinc-700 italic">log.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-zinc-500 text-lg max-w-xl font-medium"
                    >
                        Tracking the evolution of the sovereign intelligence ecosystem. Every node modification, every neural shift, registered in perpetuity.
                    </motion.p>
                </header>

                {/* Timeline */}
                <div className="relative space-y-24">
                    {/* Vertical Line */}
                    <div className="absolute left-0 md:left-1/2 top-4 bottom-0 w-[1px] bg-zinc-900 -translate-x-1/2 hidden md:block" />

                    {changelogData.map((entry, index) => (
                        <motion.section
                            key={entry.version}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className={`relative flex flex-col md:flex-row gap-12 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                        >
                            {/* Marker */}
                            <div className="absolute left-0 md:left-1/2 top-4 -translate-x-1/2 z-10 hidden md:block">
                                <div className="w-4 h-4 rounded-full bg-black border-2 border-zinc-700 flex items-center justify-center">
                                    <div className="w-1 h-1 rounded-full bg-orange-500 animate-pulse" />
                                </div>
                            </div>

                            {/* Content Side */}
                            <div className="md:w-1/2 space-y-6">
                                <div className="flex items-center gap-4">
                                    <span className="text-[11px] font-black text-white bg-zinc-900 border border-white/5 px-3 py-1 rounded-full tabular-nums">
                                        {entry.version}
                                    </span>
                                    <span className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest">
                                        {entry.date}
                                    </span>
                                    <CategoryBadge type={entry.type} />
                                </div>

                                <div className="space-y-4">
                                    <h2 className="text-3xl font-bold tracking-tight text-white group cursor-default">
                                        {entry.title}
                                    </h2>
                                    <p className="text-zinc-500 font-medium leading-relaxed">
                                        {entry.description}
                                    </p>
                                </div>

                                <ul className="space-y-3">
                                    {entry.updates.map((update, idx) => (
                                        <li key={idx} className="flex items-start gap-3 group">
                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-800 group-hover:bg-orange-500 transition-colors shrink-0" />
                                            <span className="text-[13px] text-zinc-400 font-medium leading-relaxed group-hover:text-zinc-200 transition-colors">
                                                {update}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Decorative Side (Icon/Visual) */}
                            <div className="md:w-1/2 flex items-center justify-center md:px-12">
                                <div className="w-full aspect-square md:aspect-video rounded-3xl bg-[#0D0D0D] border border-zinc-900 flex flex-col items-center justify-center gap-6 group hover:border-zinc-700 transition-all p-8 text-center">
                                    <div className="w-20 h-20 rounded-2xl bg-black border border-zinc-900 flex items-center justify-center text-zinc-700 group-hover:text-orange-500 group-hover:scale-110 transition-all duration-500">
                                        <entry.icon size={40} strokeWidth={1.5} />
                                    </div>
                                    <div className="space-y-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Protocol Registry</p>
                                        <p className="text-[9px] font-bold text-zinc-800 uppercase tracking-tighter">SIG: 0x{Math.random().toString(16).substring(2, 10)}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.section>
                    ))}
                </div>

                {/* Bottom CTA */}
                <motion.footer
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mt-40 pt-20 border-t border-zinc-900 text-center space-y-8"
                >
                    <div className="space-y-2">
                        <h3 className="text-2xl font-bold tracking-tight">Stay synchronized.</h3>
                        <p className="text-zinc-500 font-medium">Follow our GitHub for real-time node updates and commit logs.</p>
                    </div>
                    <a
                        href="https://github.com/opendev-labs"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 h-12 px-8 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-full hover:bg-zinc-200 transition-all group"
                    >
                        Explore Repository <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                </motion.footer>
            </main>

            <Footer />
        </div>
    );
};

export default Changelog;
