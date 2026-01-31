import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BioRainbowLogo = ({ size = 180 }: { size?: number }) => (
    <motion.div
        className="relative flex items-center justify-center"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
    >
        <motion.svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            animate={{
                filter: ["hue-rotate(0deg) brightness(1)", "hue-rotate(360deg) brightness(1.4)", "hue-rotate(720deg) brightness(1)"]
            }}
            transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
            }}
        >
            <defs>
                <filter id="p-hyper-glow" x="-100%" y="-100%" width="300%" height="300%">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>

                <linearGradient id="p-rainbow-1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ff00d4" />
                    <stop offset="100%" stopColor="#bc00ff" />
                </linearGradient>
                <linearGradient id="p-rainbow-2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00f2ff" />
                    <stop offset="100%" stopColor="#0062ff" />
                </linearGradient>
                <linearGradient id="p-rainbow-3" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#4CAF50" />
                    <stop offset="100%" stopColor="#00f2ff" />
                </linearGradient>
            </defs>

            {/* Intensified Tunnel Layers - 9 Recursive Layers for Preloader */}
            <g>
                {[...Array(9)].map((_, i) => (
                    <path
                        key={i}
                        d="M10 25H90L50 90L10 25Z"
                        stroke={`url(#p-rainbow-${(i % 3) + 1})`}
                        strokeWidth="0.5"
                        className="animate-tunnel"
                        style={{
                            animationDelay: `${-i * 0.2}s`,
                            opacity: 0.8 - (i * 0.08)
                        }}
                    />
                ))}
            </g>

            {/* Core Reactive Layers (Identity Source) */}
            <path d="M10 25H90L50 90L10 25Z" stroke="url(#p-rainbow-1)" strokeWidth="3" filter="url(#p-hyper-glow)" />
            <path d="M22.5 35H77.5L50 80L22.5 35Z" stroke="url(#p-rainbow-2)" strokeWidth="2.5" filter="url(#p-hyper-glow)" />
            <path d="M35 45H65L50 70L35 45Z" stroke="url(#p-rainbow-3)" strokeWidth="2" filter="url(#p-hyper-glow)" />

            {/* Perfect Central Hole */}
            <path d="M42.5 52.5H57.5L50 65L42.5 52.5Z" stroke="white" strokeWidth="1.5" className="opacity-100" />
        </motion.svg>

        {/* Dynamic Static Stimuli Reflection (Bottom Pulse) */}
        <motion.div
            className="absolute -bottom-8 w-12 h-2 bg-cyan-500 blur-2xl opacity-100"
            animate={{
                width: [12, 64, 12],
                opacity: [0.4, 0.8, 0.4],
                backgroundColor: ["rgba(0, 242, 255, 0.8)", "rgba(188, 0, 255, 0.8)", "rgba(0, 242, 255, 0.8)"]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
    </motion.div>
);

const ScanningText = () => {
    const lines = [
        "INITIALIZING_NEURAL_MESH...",
        "SYNCING_LAMADB_CLUSTERS...",
        "CALIBRATING_QUANTUM_UPLINK...",
        "AUTHENTICATING_SOVEREIGN_ID...",
        "BOOSTING_FIDELITY_TO_MAX..."
    ];
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % lines.length);
        }, 600);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="mt-20 flex flex-col items-center">
            <AnimatePresence mode="wait">
                <motion.p
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="text-[11px] font-mono font-bold tracking-[0.5em] text-white/50 uppercase"
                >
                    {lines[index]}
                </motion.p>
            </AnimatePresence>
            <div className="mt-6 w-64 h-[2px] bg-zinc-900 overflow-hidden relative">
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                />
            </div>
        </div>
    );
};

export const Preloader: React.FC = () => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 2800);
        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        scale: 1.1,
                        filter: "blur(20px)",
                        transition: { duration: 0.8, ease: "easeInOut" }
                    }}
                    className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center overflow-hidden"
                >
                    {/* Dark Grid Background */}
                    <div className="absolute inset-0 opacity-[0.03]"
                        style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
                    />

                    <div className="relative z-10 flex flex-col items-center scale-110">
                        <BioRainbowLogo />
                        <ScanningText />
                    </div>

                    {/* Metadata Overlays (No bulky frames) */}
                    <div className="absolute bottom-8 left-8 flex flex-col gap-1">
                        <div className="text-[9px] font-mono text-white/20 tracking-widest uppercase">NODE_STATUS: BOOTING</div>
                        <div className="text-[9px] font-mono text-white/10 tracking-widest uppercase">ENCRYPTION: ARC-FORCE_MAX</div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
