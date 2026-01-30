import React from 'react';
import { Link } from 'react-router-dom';
import { socialProofLogos } from '../../constants';
import { SparklesIcon, CpuChipIcon, PuzzlePieceIcon, GitBranchIcon, ArrowRightIcon } from '../common/Icons';
import { motion } from 'framer-motion';

const AppBackground = () => (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-white/5 blur-[120px] rounded-full" />
    </div>
);

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="group p-8 border border-zinc-900 transition-all hover:bg-zinc-950 duration-500 relative overflow-hidden">
        <div className="relative z-10">
            <div className="w-10 h-10 flex items-center justify-center bg-zinc-900 border border-zinc-800 text-white rounded mb-6 group-hover:border-zinc-700 transition-colors">{icon}</div>
            <h3 className="text-lg font-bold text-white mb-3 tracking-tight">{title}</h3>
            <p className="text-zinc-500 text-sm font-medium leading-relaxed">{children}</p>
        </div>
    </div>
);


export const HomePage: React.FC = () => {
    return (
        <div className="relative overflow-hidden bg-black -mx-4 -mt-8 pt-20">
            <AppBackground />

            <div className="relative z-10 container mx-auto px-6">
                {/* Hero Section */}
                <div className="min-h-[80vh] flex flex-col justify-center items-center text-center py-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl mx-auto"
                    >
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-zinc-900 border border-zinc-800 text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400 mb-8 select-none">
                            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            Next-Generation Neural Infrastructure
                        </span>

                        <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-white leading-[0.85] mb-10">
                            The Standard for <br />
                            <span className="text-zinc-500 italic font-serif">Cloud Logic.</span>
                        </h1>

                        <p className="max-w-xl mx-auto text-lg text-zinc-500 leading-relaxed font-medium mb-12">
                            opendev-labs is the modular serverless platform built for autonomous systems and high-fidelity web experiences.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                to="/auth?mode=signup"
                                className="w-full sm:w-auto h-12 px-10 rounded-none bg-white text-black text-sm font-bold hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                            >
                                Start Building <ArrowRightIcon className="w-4 h-4" />
                            </Link>
                            <Link
                                to="/void/docs"
                                className="w-full sm:w-auto h-12 px-10 rounded-none bg-black border border-zinc-800 text-white text-sm font-bold hover:bg-zinc-900 transition-all flex items-center justify-center"
                            >
                                Documentation
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Social Proof Section */}
                <div className="py-20 border-y border-zinc-900 overflow-hidden">
                    <p className="text-[10px] font-bold tracking-[0.3em] text-zinc-600 mb-12 uppercase text-center">Engineered globally by the best</p>
                    <div className="flex justify-center items-center gap-12 md:gap-24 flex-wrap opacity-40 grayscale contrast-125">
                        {socialProofLogos.map(logo => (
                            <img key={logo.name} src={logo.url} alt={logo.name} className="h-4 md:h-5 object-contain" />
                        ))}
                    </div>
                </div>

                {/* Features Section */}
                <div className="py-32 max-w-[1200px] mx-auto">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-1">
                        <FeatureCard icon={<GitBranchIcon />} title="Neural Previews">
                            Every code push generates a production-grade shadow environment for instant verification.
                        </FeatureCard>
                        <FeatureCard icon={<SparklesIcon />} title="Edge Sovereignty">
                            Execute logic milliseconds from the user via our global high-fidelity edge clusters.
                        </FeatureCard>
                        <FeatureCard icon={<CpuChipIcon />} title="Autonomous Scaling">
                            Zero-config infrastructure that scales with your intelligence flow, not just your traffic.
                        </FeatureCard>
                        <FeatureCard icon={<PuzzlePieceIcon />} title="Unified Tooling">
                            Integrated database, auth, and compute primitives designed to work as a single machine.
                        </FeatureCard>
                        <FeatureCard icon={<CpuChipIcon />} title="Logic Mesh">
                            Robust execution grid supporting WASM, Node, and Python runtime fabric.
                        </FeatureCard>
                        <FeatureCard icon={<SparklesIcon />} title="Deep Intelligence">
                            First-class support for LLM routing, agent hosting, and intent-based scaling.
                        </FeatureCard>
                    </div>
                </div>
            </div>
        </div>
    );
};