import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MinimalSVGLogo = ({ size = 120 }: { size?: number }) => (
    <motion.div
        className="relative flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.9 }}
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
            <motion.path
                d="M10 25H90L50 90L10 25Z"
                stroke="white"
                strokeWidth="2"
                initial={{ pathLength: 0, opacity: 0.2 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
            />
            <motion.path
                d="M22.5 35H77.5L50 80L22.5 35Z"
                stroke="white"
                strokeWidth="1.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.4, 0.2] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            />
            <motion.path
                d="M35 45H65L50 70L35 45Z"
                stroke="white"
                strokeWidth="1.2"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
            <circle cx="50" cy="55" r="2" fill="white" className="animate-pulse" />
        </motion.svg>
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
