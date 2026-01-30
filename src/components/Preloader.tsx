import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BioRainbowLogo = ({ size = 120 }: { size?: number }) => (
    <motion.svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{
            scale: 1,
            opacity: 1,
            filter: ["hue-rotate(0deg) brightness(1)", "hue-rotate(360deg) brightness(1.5)", "hue-rotate(720deg) brightness(1)"]
        }}
        transition={{
            scale: { duration: 1, ease: "easeOut" },
            opacity: { duration: 0.8 },
            filter: { duration: 3, repeat: Infinity, ease: "linear" }
        }}
    >
        <defs>
            <filter id="preloader-glow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="3" result="blur" />
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

        {/* Enhanced Tunnel - More layers for the preloader */}
        <g>
            {[...Array(6)].map((_, i) => (
                <path
                    key={i}
                    d="M10 25H90L50 90L10 25Z"
                    stroke={`url(#p-rainbow-${(i % 3) + 1})`}
                    strokeWidth="0.5"
                    className="animate-tunnel"
                    style={{
                        animationDelay: `${-i * 0.3}s`,
                        opacity: 0.6 - (i * 0.1)
                    }}
                />
            ))}
        </g>

        {/* Pulsating Core Ring */}
        <motion.circle
            cx="50" cy="56" r="10"
            stroke="white"
            strokeWidth="0.5"
            fill="white"
            fillOpacity="0.05"
            animate={{
                r: [10, 15, 10],
                opacity: [0.2, 0.5, 0.2]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Core Geometry */}
        <path
            d="M10 25H90L50 90L10 25Z"
            stroke="white"
            strokeWidth="1.5"
            filter="url(#preloader-glow)"
            className="opacity-40"
        />

        {/* Perfect Central Hole */}
        <path d="M42.5 52.5H57.5L50 65L42.5 52.5Z" stroke="white" strokeWidth="1" className="opacity-90" />
    </motion.svg>
);

const ScanningText = () => {
    const lines = [
        "IDENTIFYING_NODES...",
        "SYNCING_LAMADB_STATE...",
        "ESTABLISHING_NEURAL_UPLINK...",
        "READYING_MAX_FIDELITY..."
    ];
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % lines.length);
        }, 800);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="mt-12 flex flex-col items-center">
            <AnimatePresence mode="wait">
                <motion.p
                    key={index}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-[10px] font-mono font-bold tracking-[0.4em] text-zinc-500 uppercase"
                >
                    {lines[index]}
                </motion.p>
            </AnimatePresence>
            <div className="mt-4 w-48 h-[1px] bg-zinc-900 overflow-hidden relative">
                <motion.div
                    className="absolute inset-0 bg-blue-600"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>
        </div>
    );
};

export const Preloader: React.FC = () => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Minimum visible time to ensure the animation is seen
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 2200);
        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        transition: { duration: 1, ease: "easeInOut" }
                    }}
                    className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center overflow-hidden"
                >
                    {/* Background Depth */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(24,24,27,0.5)_0%,_transparent_70%)] opacity-50" />

                    <div className="relative z-10 flex flex-col items-center">
                        <BioRainbowLogo />
                        <ScanningText />
                    </div>

                    {/* Corner Brackets */}
                    <div className="absolute top-12 left-12 w-8 h-8 border-t border-l border-white/10" />
                    <div className="absolute top-12 right-12 w-8 h-8 border-t border-r border-white/10" />
                    <div className="absolute bottom-12 left-12 w-8 h-8 border-b border-l border-white/10" />
                    <div className="absolute bottom-12 right-12 w-8 h-8 border-b border-r border-white/10" />

                    <div className="absolute top-12 left-12 text-[8px] font-mono text-white/10 tracking-widest uppercase ml-12">System_Boot</div>
                    <div className="absolute bottom-12 right-12 text-[8px] font-mono text-white/10 tracking-widest uppercase mr-12">v11.12_Authenticated</div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
