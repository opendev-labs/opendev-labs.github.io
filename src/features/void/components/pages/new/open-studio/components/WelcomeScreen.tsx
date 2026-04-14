import React from 'react';
import { SUGGESTED_PROMPTS } from '../constants';
import { PromptInput } from './PromptInput';
import { motion } from 'framer-motion';

interface WelcomeScreenProps {
    onSendMessage: (prompt: string) => void;
    isThinking: boolean;
    // Model props
    selectedModelId: string;
    onModelChange: (modelId: string) => void;
}

export function WelcomeScreen({ onSendMessage, isThinking, selectedModelId, onModelChange }: WelcomeScreenProps) {
    return (
        <div className="flex flex-col h-full w-full bg-black text-white selection:bg-white selection:text-black relative overflow-hidden">
            {/* Background Image with Cinematic Depth */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div 
                    className="absolute inset-0 bg-[#050505]"
                    style={{
                        backgroundImage: `
                            radial-gradient(circle at 50% -20%, rgba(255, 100, 0, 0.05) 0%, transparent 60%),
                            radial-gradient(circle at 0% 100%, rgba(0, 100, 255, 0.03) 0%, transparent 50%)
                        `
                    }}
                />

                {/* Grid Overlay with Perspective */}
                <div className="absolute inset-0 opacity-[0.03] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]"
                    style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }}
                />
                
                {/* Noise texture for premium feel */}
                <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />
            </div>

            <main className="relative z-10 flex-grow flex flex-col items-center justify-center text-center px-6 pt-20">
                <div className="w-full max-w-5xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-3 px-4 py-1.5 bg-white/5 border border-white/10 text-[9px] font-bold text-zinc-500 mb-10 uppercase tracking-[0.5em] backdrop-blur-xl"
                    >
                        <span className="w-1.5 h-1.5 rounded-none bg-orange-500 animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
                        Open-Studio // Prime Evolution Protocol
                    </motion.div>

                    <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 tracking-[-0.04em] leading-[0.8] lowercase">
                        evolve your<br />
                        <span className="text-zinc-800">imagination.</span>
                    </h1>

                    <p className="text-zinc-500 text-base md:text-lg font-bold mb-16 max-w-2xl mx-auto leading-relaxed uppercase tracking-[0.3em] opacity-60">
                        architect, build, and deploy high-fidelity nodes across the sovereign mesh with zero-shot intelligence.
                    </p>

                    <div className="mb-20">
                        <PromptInput
                            onSendMessage={onSendMessage}
                            disabled={isThinking}
                            selectedModelId={selectedModelId}
                            onModelChange={onModelChange}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        {[
                            { title: 'Wormhole Nexus', desc: 'Liquid Three.js generative environment', icon: '🌀' },
                            { title: 'Neural Dash', desc: 'AI-centric glassmorphic monitor', icon: '🧠' },
                            { title: 'Chrome Artifact', desc: 'High-fidelity WebGL studio', icon: '✨' }
                        ].map((template, i) => (
                            <motion.button
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + (i * 0.1) }}
                                onClick={() => onSendMessage(`Build a ${template.title}: ${template.desc}`)}
                                className="group p-8 bg-black border border-zinc-900 text-left hover:border-zinc-500 transition-all duration-500 rounded-none relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-zinc-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="text-3xl mb-6 opacity-30 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">{template.icon}</div>
                                <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.3em] mb-3 group-hover:text-white transition-colors">{template.title}</h3>
                                <p className="text-[9px] text-zinc-700 font-bold leading-relaxed uppercase tracking-widest group-hover:text-zinc-500 transition-colors">{template.desc}</p>
                            </motion.button>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}