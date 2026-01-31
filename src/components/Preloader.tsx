import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HUDLines = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
        {/* Monochromatic Scanning Grid */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        {/* Horizontal Scanlines */}
        <motion.div
            className="absolute inset-0 z-0"
            style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.05) 50%)', backgroundSize: '100% 4px' }}
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 0.1, repeat: Infinity }}
        />
        {/* Static noise / grain (Monochrome) */}
        <div className="absolute inset-0 opacity-[0.03] grayscale pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
);

const CentralLogo = () => (
    <motion.div
        className="relative z-20 flex flex-col items-center justify-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
    >
        <motion.svg
            width="120"
            height="120"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="filter drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]"
        >
            <path
                d="M10 25H90L50 90L10 25Z"
                stroke="white"
                strokeWidth="1"
                style={{ opacity: 0.15 }}
            />
            <path
                d="M22.5 35H77.5L50 80L22.5 35Z"
                stroke="white"
                strokeWidth="1"
                style={{ opacity: 0.3 }}
            />
            <motion.path
                d="M42.5 52.5H57.5L50 65L42.5 52.5Z"
                fill="white"
                stroke="white"
                strokeWidth="2"
                animate={{
                    opacity: [0.4, 1, 0.4],
                    scale: [1, 1.1, 1],
                    filter: [
                        "drop-shadow(0 0 5px #fff)",
                        "drop-shadow(0 0 20px #fff)",
                        "drop-shadow(0 0 5px #fff)"
                    ]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
        </motion.svg>
    </motion.div>
);

const LoadingText: React.FC = () => {
    const text = "INITIALIZING...";
    return (
        <div className="mt-10 flex gap-[0.5em]">
            {text.split('').map((char, i) => (
                <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{
                        opacity: [0, 1, 0],
                        y: [5, 0, -5]
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.1,
                        ease: "easeInOut"
                    }}
                    className="text-[12px] font-bold tracking-[0.5em] text-white/40 uppercase font-mono"
                >
                    {char}
                </motion.span>
            ))}
        </div>
    );
};

export const Preloader: React.FC = () => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        backgroundColor: "#fff",
                        filter: "brightness(5) blur(40px)",
                        transition: { duration: 0.8, ease: "circIn" }
                    }}
                    className="fixed inset-0 z-[1000] bg-black flex items-center justify-center overflow-hidden"
                >
                    {/* Titan Grid Background */}
                    <div className="absolute inset-0 z-0">
                        <HUDLines />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none" />
                    </div>

                    <div className="flex flex-col items-center relative z-10">
                        <CentralLogo />
                        <LoadingText />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
