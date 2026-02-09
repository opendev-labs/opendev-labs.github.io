import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const DevIndicator: React.FC = () => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            className="relative cursor-default flex items-center justify-center h-8"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <motion.div
                initial={false}
                animate={{
                    width: isHovered ? '160px' : '12px',
                    height: isHovered ? '28px' : '12px',
                    borderRadius: isHovered ? '14px' : '50%',
                    backgroundColor: '#eab308', // yellow-500
                    boxShadow: isHovered
                        ? '0 0 20px rgba(234, 179, 8, 0.4)'
                        : '0 0 10px rgba(234, 179, 8, 0.2)'
                }}
                transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30
                }}
                className="flex items-center justify-center overflow-hidden border border-yellow-400 group"
            >
                <AnimatePresence>
                    {isHovered && (
                        <motion.span
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="text-[10px] font-black text-black uppercase tracking-[0.2em] whitespace-nowrap px-4"
                        >
                            Under Development
                        </motion.span>
                    )}
                </AnimatePresence>

                {!isHovered && (
                    <motion.div
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-1.5 h-1.5 bg-white/40 rounded-full"
                    />
                )}
            </motion.div>

            {/* Pulsing Aura */}
            <motion.div
                animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.2, 0, 0.2]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-yellow-400/20 rounded-full -z-10"
            />
        </motion.div>
    );
};
