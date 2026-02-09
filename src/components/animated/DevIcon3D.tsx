import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const DevIcon3D: React.FC = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [isClicked, setIsClicked] = useState(false);

    const activeState = isHovered || isClicked;

    return (
        <div
            className="relative w-64 h-64 flex items-center justify-center cursor-pointer overflow-visible"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => setIsClicked(!isClicked)}
            style={{ perspective: '1200px' }}
        >
            <AnimatePresence mode="wait">
                {!activeState ? (
                    <motion.div
                        key="cube-container"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5, rotateY: 180 }}
                        className="relative w-32 h-32"
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        <motion.div
                            animate={{
                                rotateY: [0, 360],
                                rotateX: [0, 360],
                                rotateZ: [0, 360]
                            }}
                            transition={{
                                duration: 20,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                            className="absolute inset-0 w-full h-full"
                            style={{ transformStyle: 'preserve-3d' }}
                        >
                            {/* 6 Faces of the Wireframe Cube */}
                            {[
                                { rotateY: 0, translateZ: '64px' },
                                { rotateY: 90, translateZ: '64px' },
                                { rotateY: 180, translateZ: '64px' },
                                { rotateY: 270, translateZ: '64px' },
                                { rotateX: 90, translateZ: '64px' },
                                { rotateX: -90, translateZ: '64px' }
                            ].map((style, i) => (
                                <div
                                    key={i}
                                    className="absolute inset-0 border border-[#ff5500]/40 bg-[#ff5500]/5 backdrop-blur-[2px]"
                                    style={{
                                        transform: `rotateY(${style.rotateY || 0}deg) rotateX(${style.rotateX || 0}deg) translateZ(${style.translateZ})`,
                                        backfaceVisibility: 'visible'
                                    }}
                                />
                            ))}

                            {/* Inner Core */}
                            <div className="absolute inset-[35%] bg-[#ff5500] blur-[15px] opacity-40 animate-pulse rounded-full" />
                            <div className="absolute inset-[45%] bg-white blur-[2px] shadow-[0_0_20px_#ff5500] rounded-full" />
                        </motion.div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="status-text"
                        initial={{ opacity: 0, rotateY: -90, scale: 0.8 }}
                        animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                        exit={{ opacity: 0, rotateY: 90, scale: 0.8 }}
                        transition={{ type: "spring", damping: 15 }}
                        className="flex flex-col items-center gap-4"
                    >
                        <div className="relative group">
                            {/* Glassmorphic Container */}
                            <div className="px-8 py-4 bg-zinc-900/40 backdrop-blur-2xl border border-white/10 rounded-lg shadow-2xl relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ff550010] to-transparent animate-scanline" />

                                <span className="text-xl font-mono font-black text-white tracking-[0.4em] whitespace-nowrap inline-block relative">
                                    <span className="text-[#ff5500]">UNDER</span> DEVELOPMENT
                                    <motion.span
                                        animate={{ opacity: [1, 0] }}
                                        transition={{ duration: 0.8, repeat: Infinity }}
                                        className="inline-block ml-1 w-2 h-5 bg-[#ff5500]"
                                    />
                                </span>
                            </div>

                            {/* Ambient Glow */}
                            <div className="absolute -inset-4 bg-[#ff5500]/20 blur-3xl -z-10 rounded-full animate-pulse" />
                        </div>

                        <div className="flex gap-4 text-[10px] font-mono text-zinc-500 tracking-tighter uppercase">
                            <span className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#ff5500] animate-ping" />
                                MESH: ACTIVE
                            </span>
                            <span>|</span>
                            <span>NODE: 0x2A9</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                @keyframes scanline {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(100%); }
                }
                .animate-scanline {
                    animation: scanline 3s linear infinite;
                }
            `}</style>
        </div>
    );
};
