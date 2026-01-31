import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { DiamondLine } from './ui/DiamondLine';

const MinimalSVGLogo = ({ size = 100 }: { size?: number }) => (
    <motion.div
        className="relative flex flex-col items-center justify-center gap-12"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
    >
        <motion.svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Outer Diamond */}
            <motion.path
                d="M50 10 L85 50 L50 90 L15 50 Z"
                stroke="white"
                strokeWidth="1.5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
            />
            {/* Inner Diamond */}
            <motion.path
                d="M50 30 L70 50 L50 70 L30 50 Z"
                stroke="white"
                strokeWidth="1"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.4, 0.2] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
            <circle cx="50" cy="50" r="1.5" fill="white" className="animate-pulse" />
        </motion.svg>

        <div className="w-64">
            <DiamondLine />
            <div className="mt-4 flex flex-col items-center">
                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.4em] animate-pulse">Initializing Neural Mesh</span>
            </div>
        </div>
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
                        transition: { duration: 1, ease: "easeInOut" }
                    }}
                    className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center overflow-hidden"
                >
                    <div className="relative z-10 flex flex-col items-center">
                        <MinimalSVGLogo />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
