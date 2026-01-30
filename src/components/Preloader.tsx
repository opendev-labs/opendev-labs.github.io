import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FullScreenTunnel = () => (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
        <svg
            className="w-full h-full scale-150"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid meet"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <filter id="wave-glow" x="-100%" y="-100%" width="300%" height="300%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>

                <linearGradient id="fs-rainbow-1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ff00d4" />
                    <stop offset="100%" stopColor="#bc00ff" />
                </linearGradient>
                <linearGradient id="fs-rainbow-2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00f2ff" />
                    <stop offset="100%" stopColor="#0062ff" />
                </linearGradient>
                <linearGradient id="fs-rainbow-3" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#4CAF50" />
                    <stop offset="100%" stopColor="#00f2ff" />
                </linearGradient>
            </defs>

            {/* High-Speed Bold Bio-Waves: 10 Layers with thicker strokes and glow */}
            {[...Array(10)].map((_, i) => (
                <motion.path
                    key={i}
                    d="M10 25H90L50 90L10 25Z"
                    stroke={`url(#fs-rainbow-${(i % 3) + 1})`}
                    strokeWidth="3"
                    filter="url(#wave-glow)"
                    initial={{ scale: 10, opacity: 0 }}
                    animate={{
                        scale: [10, 0],
                        opacity: [0, 0.7, 0]
                    }}
                    transition={{
                        duration: 1.2, // Snappy high-speed waves
                        repeat: Infinity,
                        ease: "easeIn",
                        delay: i * 0.12
                    }}
                    style={{ transformOrigin: "50% 50%" }}
                />
            ))}
        </svg>
    </div>
);

const CentralLogo = () => (
    <motion.div
        className="relative z-20 flex items-center justify-center"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "backOut" }}
    >
        <motion.svg
            width="220"
            height="220"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            animate={{
                filter: ["hue-rotate(0deg) brightness(1)", "hue-rotate(360deg) brightness(1.8)", "hue-rotate(720deg) brightness(1)"]
            }}
            transition={{
                duration: 1, // Faster disco cycle
                repeat: Infinity,
                ease: "linear"
            }}
        >
            <defs>
                <filter id="c-hyper-glow" x="-100%" y="-100%" width="300%" height="300%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>

            {/* Exact Header Logo Paths with Reinforced Boldness */}
            <path d="M10 25H90L50 90L10 25Z" stroke="url(#fs-rainbow-1)" strokeWidth="4" filter="url(#c-hyper-glow)" />
            <path d="M22.5 35H77.5L50 80L22.5 35Z" stroke="url(#fs-rainbow-2)" strokeWidth="3" filter="url(#c-hyper-glow)" />
            <path d="M35 45H65L50 70L35 45Z" stroke="url(#fs-rainbow-3)" strokeWidth="2.5" filter="url(#c-hyper-glow)" />

            {/* Perfect Central Hole */}
            <path d="M42.5 52.5H57.5L50 65L42.5 52.5Z" stroke="white" strokeWidth="2" className="opacity-100" />
        </motion.svg>

        {/* Intensified Bottom Reflection */}
        <motion.div
            className="absolute -bottom-16 w-32 h-4 bg-cyan-500 blur-[60px] opacity-100"
            animate={{
                width: [32, 180, 32],
                opacity: [0.4, 0.9, 0.4],
                backgroundColor: ["rgba(0, 242, 255, 1)", "rgba(188, 0, 255, 1)", "rgba(0, 242, 255, 1)"]
            }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
        />
    </motion.div>
);

export const Preloader: React.FC = () => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Snappier load time - 1.8s instead of 3s
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 1800);
        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        scale: 1.5,
                        filter: "blur(60px) brightness(2)",
                        transition: { duration: 0.6, ease: "circIn" }
                    }}
                    className="fixed inset-0 z-[1000] bg-black flex items-center justify-center overflow-hidden"
                >
                    {/* Dynamic High-Energy Grid */}
                    <motion.div
                        className="absolute inset-0 opacity-[0.08]"
                        style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
                        animate={{ opacity: [0.05, 0.1, 0.05] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                    />

                    <FullScreenTunnel />
                    <CentralLogo />
                </motion.div>
            )}
        </AnimatePresence>
    );
};
