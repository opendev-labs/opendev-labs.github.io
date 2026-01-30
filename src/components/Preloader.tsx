import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FullScreenTunnel = () => (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
        <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid meet"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
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

            {/* Immersive 12-Layer Tunnel scaling from Off-Screen (scale 12x) to Core (0x) */}
            {[...Array(12)].map((_, i) => (
                <motion.path
                    key={i}
                    d="M10 25H90L50 90L10 25Z"
                    stroke={`url(#fs-rainbow-${(i % 3) + 1})`}
                    strokeWidth="0.2"
                    initial={{ scale: 12, opacity: 0 }}
                    animate={{
                        scale: [12, 0],
                        opacity: [0, 0.4, 0]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                        delay: i * 0.25
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
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
    >
        <motion.svg
            width="200"
            height="200"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            animate={{
                filter: ["hue-rotate(0deg) brightness(1)", "hue-rotate(360deg) brightness(1.5)", "hue-rotate(720deg) brightness(1)"]
            }}
            transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
            }}
        >
            <defs>
                <filter id="c-hyper-glow" x="-100%" y="-100%" width="300%" height="300%">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>

            {/* Exact Header Logo Paths */}
            <path d="M10 25H90L50 90L10 25Z" stroke="url(#fs-rainbow-1)" strokeWidth="3" filter="url(#c-hyper-glow)" />
            <path d="M22.5 35H77.5L50 80L22.5 35Z" stroke="url(#fs-rainbow-2)" strokeWidth="2.5" filter="url(#c-hyper-glow)" />
            <path d="M35 45H65L50 70L35 45Z" stroke="url(#fs-rainbow-3)" strokeWidth="2" filter="url(#c-hyper-glow)" />

            {/* Perfect Central Hole */}
            <path d="M42.5 52.5H57.5L50 65L42.5 52.5Z" stroke="white" strokeWidth="1.5" className="opacity-100" />
        </motion.svg>

        {/* Dynamic Static Stimuli Reflection */}
        <motion.div
            className="absolute -bottom-12 w-16 h-2 bg-cyan-500 blur-3xl opacity-100"
            animate={{
                width: [16, 120, 16],
                opacity: [0.3, 0.7, 0.3],
                backgroundColor: ["rgba(0, 242, 255, 0.8)", "rgba(188, 0, 255, 0.8)", "rgba(0, 242, 255, 0.8)"]
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
    </motion.div>
);

export const Preloader: React.FC = () => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        scale: 1.2,
                        filter: "blur(40px)",
                        transition: { duration: 1, ease: "easeInOut" }
                    }}
                    className="fixed inset-0 z-[1000] bg-black flex items-center justify-center overflow-hidden"
                >
                    {/* Dark Grid Background spanning full viewport */}
                    <div className="absolute inset-0 opacity-[0.05]"
                        style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }}
                    />

                    <FullScreenTunnel />
                    <CentralLogo />
                </motion.div>
            )}
        </AnimatePresence>
    );
};
