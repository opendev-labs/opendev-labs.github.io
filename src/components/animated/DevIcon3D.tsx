import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const DevIcon3D: React.FC = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [isClicked, setIsClicked] = useState(false);

    const toggleState = () => setIsClicked(!isClicked);
    const activeState = isHovered || isClicked;

    return (
        <div
            className="relative w-48 h-48 flex items-center justify-center cursor-pointer perspective-1000"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={toggleState}
        >
            <AnimatePresence mode="wait">
                {!activeState ? (
                    <motion.div
                        key="icon"
                        initial={{ opacity: 0, rotateY: -90, scale: 0.8 }}
                        animate={{
                            opacity: 1,
                            rotateY: [0, 360],
                            rotateX: [0, 15, 0],
                            scale: 1
                        }}
                        exit={{ opacity: 0, rotateY: 90, scale: 0.8 }}
                        transition={{
                            rotateY: { duration: 10, repeat: Infinity, ease: "linear" },
                            rotateX: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                            opacity: { duration: 0.5 },
                            scale: { duration: 0.5 }
                        }}
                        className="relative w-24 h-24 flex items-center justify-center shadow-[0_0_50px_rgba(255,85,0,0.2)]"
                    >
                        {/* 3D Wireframe Cube Construction */}
                        <div className="absolute inset-0 border-2 border-[#ff5500]/40 rounded-lg transform rotate-45" />
                        <div className="absolute inset-0 border-2 border-white/20 rounded-lg transform -rotate-45" />
                        <div className="absolute w-4 h-4 bg-[#ff5500] rounded-sm blur-[2px] animate-pulse shadow-[0_0_15px_#ff5500]" />

                        {/* Orbits */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-[-10px] border border-zinc-800 rounded-full border-t-[#ff5500]/60"
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="text"
                        initial={{ opacity: 0, y: 20, rotateX: 45 }}
                        animate={{ opacity: 1, y: 0, rotateX: 0 }}
                        exit={{ opacity: 0, y: -20, rotateX: -45 }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 20
                        }}
                        className="flex flex-col items-center justify-center gap-2"
                    >
                        <div className="px-4 py-2 bg-zinc-900/80 backdrop-blur-xl border border-[#ff5500]/30 rounded-md shadow-[0_0_30px_rgba(255,85,0,0.1)]">
                            <span className="text-[12px] font-mono font-bold text-[#ff5500] tracking-[0.3em] whitespace-nowrap overflow-hidden border-r-2 border-[#ff5500] animate-typing">
                                UNDER DEVELOPMENT
                            </span>
                        </div>
                        <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-medium opacity-60">
                            Protocol Alpha-9.2
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Background Glow */}
            <div className={`absolute inset-0 bg-[#ff5500]/5 blur-[60px] rounded-full transition-opacity duration-700 ${activeState ? 'opacity-100' : 'opacity-40'}`} />

            <style>{`
                .perspective-1000 {
                    perspective: 1000px;
                }
                @keyframes typing {
                    from { width: 0 }
                    to { width: 100% }
                }
                .animate-typing {
                    display: inline-block;
                    animation: typing 2s steps(20, end) infinite alternate;
                }
            `}</style>
        </div>
    );
};
