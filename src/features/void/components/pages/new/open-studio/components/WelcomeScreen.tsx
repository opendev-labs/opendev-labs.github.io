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
        <div className="flex flex-col h-screen w-full bg-black text-white selection:bg-white selection:text-black relative overflow-hidden">
            {/* Background Image with Cinematic Depth */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <motion.img
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.4 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    src="/home/cube/Downloads/hyperspace-speed-5120x2880-18191.jpg"
                    alt="Hyperspace Background"
                    className="w-full h-full object-cover opacity-40"
                    style={{ objectPosition: 'center center' }}
                />

                {/* Dark Vignette Overlay */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.8) 50%, #000 80%)'
                    }}
                />

                {/* Grid Overlay */}
                <div className="absolute inset-0 opacity-[0.05]"
                    style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
                />
            </div>

            <main className="relative z-10 flex-grow flex flex-col items-center justify-center text-center px-6">
                <div className="w-full max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 text-[10px] font-bold text-zinc-500 mb-8 uppercase tracking-[0.4em] backdrop-blur-md">
                        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                        Open-Studio // Evolution Protocol
                    </div>

                    <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 tracking-tighter leading-[0.85] lowercase">
                        evolve your<br />
                        <span className="text-zinc-600">imagination.</span>
                    </h1>

                    <p className="text-zinc-500 text-lg md:text-xl font-medium mb-12 max-w-2xl mx-auto leading-relaxed uppercase tracking-widest opacity-80">
                        architect, build, and deploy high-fidelity nodes across the sovereign mesh with zero-shot intelligence.
                    </p>

                    <div className="mb-12">
                        <PromptInput
                            onSendMessage={onSendMessage}
                            disabled={isThinking}
                            selectedModelId={selectedModelId}
                            onModelChange={onModelChange}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                        {[
                            { title: 'SaaS Engine', desc: 'Full-stack node with auth & state', icon: '⚡' },
                            { title: 'Neural Dash', desc: 'AI-centric monitoring surface', icon: '🧠' },
                            { title: 'Edge API', desc: 'Native high-velocity protocol', icon: '🌐' }
                        ].map((template, i) => (
                            <button
                                key={i}
                                onClick={() => onSendMessage(`Build a ${template.title}: ${template.desc}`)}
                                className="group p-6 bg-zinc-950/20 backdrop-blur-md border border-zinc-900/50 text-left hover:border-orange-500/50 transition-all duration-300 rounded-none relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-[1px] h-full bg-orange-500/0 group-hover:bg-orange-500/50 transition-all" />
                                <div className="text-2xl mb-4 opacity-50 group-hover:opacity-100 transition-opacity">{template.icon}</div>
                                <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-widest mb-2">{template.title}</h3>
                                <p className="text-[10px] text-zinc-600 font-medium leading-relaxed uppercase">{template.desc}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}