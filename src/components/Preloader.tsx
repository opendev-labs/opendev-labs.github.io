import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedLoaderIcon } from '../features/void/components/common/AnimatedLoaderIcon';
import { DiamondLine } from './ui/DiamondLine';

export const Preloader: React.FC = () => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 1200); // Faster entry
        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        transition: { duration: 0.8, ease: "easeInOut" }
                    }}
                    className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center overflow-hidden"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative z-10 flex flex-col items-center gap-12"
                    >
                        <AnimatedLoaderIcon size={80} strokeWidth={1} className="text-white" />

                        <div className="w-64 flex flex-col items-center">
                            <DiamondLine />
                            <div className="mt-6">
                                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.6em] animate-pulse">Syncing Nexus</span>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
