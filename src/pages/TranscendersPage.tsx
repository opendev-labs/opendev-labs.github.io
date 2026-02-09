import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Cpu, Zap, Database, Terminal, ShieldCheck,
    ArrowRight, Globe, Box, Share2, MessageSquare,
    Heart, Bookmark, Activity, Layers, Network
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { DiamondLine } from '../components/ui/DiamondLine';
import { DevIndicator } from '../components/animated/DevIndicator';
import HeroBg from '../assets/bg.png';

export default function TranscendersPage() {
    const [isHoveringEngine, setIsHoveringEngine] = useState(false);

    return (
        <div className="min-h-screen bg-black text-white selection:bg-orange-500/30 font-sans">
            {/* Hero Section */}
            <section className="relative h-[100vh] flex flex-col items-center justify-center pt-20 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src={HeroBg} alt="Background" className="w-full h-full object-cover opacity-20 grayscale" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />
                </div>

                <div className="relative z-10 text-center max-w-5xl px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-3 px-3 py-1 bg-white/5 border border-white/10 text-[10px] font-black tracking-[0.4em] uppercase text-zinc-500 mb-12"
                    >
                        <Network size={14} className="text-orange-500" />
                        <span>Unified Nervous System // Transcenders v1.0</span>
                    </motion.div>

                    <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-8 leading-[0.8] uppercase">
                        Transcending <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-800 italic font-serif">Boundaries.</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-zinc-500 max-w-3xl mx-auto mb-16 leading-relaxed uppercase tracking-[0.1em] font-medium">
                        The unified CLI and SDK for the opendev-labs quantum ecosystem. Bridging the gap between
                        <span className="text-white mx-2">abstract potential</span> and
                        <span className="text-white mx-2">tangible application.</span>
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                        <Button variant="primary" size="lg" className="h-14 px-12 text-xs font-black uppercase tracking-[0.3em] shadow-[0_0_40px_rgba(255,255,255,0.05)]">
                            Initiate Handshake
                        </Button>
                        <Button variant="secondary" size="lg" className="h-14 px-12 text-xs font-black uppercase tracking-[0.3em] border-zinc-900">
                            View Documentation
                        </Button>
                    </div>
                </div>

                {/* Animated Waveform at Bottom */}
                <div className="absolute bottom-0 inset-x-0 h-64 pointer-events-none overflow-hidden">
                    <svg className="w-full h-full opacity-30" viewBox="0 0 1440 320">
                        <path
                            fill="none"
                            stroke="rgba(255,85,0,0.5)"
                            strokeWidth="2"
                            d="M0,160 C320,300 420,10 640,160 C860,310 960,10 1280,160 L1440,160"
                        >
                            <animate attributeName="d" dur="10s" repeatCount="indefinite"
                                values="M0,160 C320,300 420,10 640,160 C860,310 960,10 1280,160 L1440,160;
                                        M0,160 C320,10 420,300 640,160 C860,10 960,300 1280,160 L1440,160;
                                        M0,160 C320,300 420,10 640,160 C860,310 960,10 1280,160 L1440,160" />
                        </path>
                    </svg>
                </div>
            </section>

            {/* The Unification Section */}
            <section className="py-40 bg-black relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-start justify-between gap-20">
                        <div className="max-w-xl">
                            <h2 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.5em] mb-8">01 // The Unification</h2>
                            <h3 className="text-5xl font-black text-white uppercase tracking-tighter mb-10 leading-tight">
                                One Interface. <br />
                                Infinite Potential.
                            </h3>
                            <p className="text-zinc-500 text-lg leading-relaxed mb-12 uppercase tracking-widest opacity-80">
                                Transcenders wraps Quantum-Compute, Quantum-ML, and Quantum-API into a single, cohesive runtime.
                                We are not building another library; we are building the post-classical nervous system.
                            </p>

                            <div className="space-y-6">
                                {[
                                    { icon: Box, title: "Quantum-Compute", desc: "The Engine. Simulates physics." },
                                    { icon: Cpu, title: "Quantum-ML", desc: "The Brain. Hybrid neural networks." },
                                    { icon: Activity, title: "Quantum-API", desc: "The Interface. Scalable endpoints." }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-6 p-6 bg-zinc-950/30 border border-zinc-900 group hover:border-orange-500/30 transition-all">
                                        <div className="w-12 h-12 bg-black flex items-center justify-center text-zinc-600 group-hover:text-white transition-colors">
                                            <item.icon size={20} />
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-black uppercase tracking-widest text-white mb-1">{item.title}</h4>
                                            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Interactive Visualizer */}
                        <div className="flex-grow w-full lg:w-1/2 h-[600px] relative">
                            <div className="absolute inset-0 bg-zinc-950/20 border border-zinc-900 overflow-hidden">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                        className="w-96 h-96 border border-zinc-900/50 rounded-full flex items-center justify-center"
                                    >
                                        <div className="w-64 h-64 border border-orange-500/20 rounded-full flex items-center justify-center">
                                            <div className="w-32 h-32 bg-orange-500/10 blur-3xl rounded-full" />
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Status Overlay */}
                                <div className="absolute bottom-8 left-8 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                        <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Nervous System Active</span>
                                    </div>
                                    <div className="text-[10px] font-mono text-white tracking-widest uppercase">SYSLOG: 0x4F92-TRANSCEND</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Metaphysical Function */}
            <section className="py-40 border-y border-zinc-900 bg-[#050505]">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.5em] mb-12">02 // The Metaphysics</h2>
                    <blockquote className="text-3xl md:text-5xl font-black text-white italic tracking-tighter mb-16 leading-tight">
                        "Transcenders act as the
                        <span className="text-zinc-600"> Consciousness</span>, collapsing the wave function between
                        <span className="text-zinc-600"> Machine Intelligence</span> and
                        <span className="text-zinc-600"> Kinetic Action</span>."
                    </blockquote>
                    <DiamondLine />
                    <p className="mt-16 text-zinc-600 text-[10px] font-bold uppercase tracking-[0.4em] leading-relaxed max-w-2xl mx-auto">
                        Just as a biological cell holds an electric charge, the folders of opendev-labs are the cells, and transcendence is the charge.
                    </p>
                </div>
            </section>

            {/* Footer CTA */}
            <section className="py-40 bg-black">
                <div className="max-w-3xl mx-auto text-center px-6">
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-8">Ready to Transcend?</h3>
                    <p className="text-zinc-500 text-sm font-medium uppercase tracking-[0.2em] mb-12">
                        Download the SDK and start building the future of sovereign machine intelligence today.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button variant="primary" className="h-12 px-10 text-[10px] font-black uppercase tracking-widest">
                            Install via Pip
                        </Button>
                        <Button variant="secondary" className="h-12 px-10 text-[10px] font-black uppercase tracking-widest border-zinc-900">
                            Join the Mesh
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
