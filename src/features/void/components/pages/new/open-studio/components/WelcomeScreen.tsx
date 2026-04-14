import React from 'react';
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
        <div className="flex flex-col h-full w-full bg-[#080808] text-white selection:bg-white/10 selection:text-white relative overflow-hidden">
            {/* BACKGROUND EFFECTS */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div 
                    className="absolute inset-x-0 top-0 h-[800px] bg-gradient-to-b from-white/[0.02] via-transparent to-transparent opacity-50"
                    style={{ maskImage: 'radial-gradient(circle at 50% 0%, black, transparent 80%)' }}
                />
            </div>

            {/* CONTENT AREA */}
            <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-8">
                <div className="w-full max-w-6xl flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 bg-zinc-900/50 border border-zinc-800/50 text-[10px] font-bold text-zinc-500 mb-10 uppercase tracking-[0.3em] rounded-lg font-mono"
                    >
                        <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
                        nexus // core workstation
                    </motion.div>

                    <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 tracking-tight leading-[0.9]">
                        OpenStudio.<br />
                        <span className="text-zinc-800">The Neural Architect.</span>
                    </h1>

                    <p className="text-zinc-600 text-sm md:text-base font-bold mb-16 max-w-xl mx-auto leading-relaxed uppercase tracking-[0.4em] opacity-80 font-mono">
                        Build, deploy, and materialize complex nodes.
                    </p>

                    <div className="w-full max-w-4xl mb-24">
                        <PromptInput
                            onSendMessage={onSendMessage}
                            disabled={isThinking}
                            selectedModelId={selectedModelId}
                            onModelChange={onModelChange}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
                        {[
                            { title: 'Materialize UI', desc: 'Generate a professional dashboard', icon: '💎' },
                            { title: 'Build Backend', desc: 'Create a robust serverless node', icon: '⚡' },
                            { title: 'System Architecture', desc: 'Map out your next big project', icon: '🗺️' }
                        ].map((template, i) => (
                            <motion.button
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + (i * 0.1) }}
                                onClick={() => onSendMessage(`Build a ${template.title}: ${template.desc}`)}
                                className="group p-6 bg-transparent border border-zinc-900 hover:border-zinc-700 transition-all duration-300 rounded-2xl text-left relative overflow-hidden"
                            >
                                <div className="text-2xl mb-4 grayscale group-hover:grayscale-0 transition-opacity opacity-40 group-hover:opacity-100">{template.icon}</div>
                                <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1 group-hover:text-white transition-colors">{template.title}</h3>
                                <p className="text-[9px] text-zinc-700 font-bold leading-relaxed uppercase tracking-widest opacity-80 group-hover:opacity-100">{template.desc}</p>
                            </motion.button>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}