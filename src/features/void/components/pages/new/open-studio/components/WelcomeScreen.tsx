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
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-900/50 border border-zinc-800 text-xs font-medium text-zinc-400 mb-10 rounded-full"
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        OpenStudio AI IDE
                    </motion.div>

                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-[1.1]">
                        Code at the speed<br />
                        <span className="text-zinc-500">of thought.</span>
                    </h1>

                    <p className="text-zinc-400 text-lg md:text-xl mb-16 max-w-2xl mx-auto leading-relaxed">
                        AI-powered code generation with real npm execution.<br className="hidden md:block" /> Build, preview, and deploy instantly in your browser.
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
                                <h3 className="text-sm font-semibold text-zinc-300 mb-1 group-hover:text-white transition-colors">{template.title}</h3>
                                <p className="text-xs text-zinc-500 leading-relaxed group-hover:text-zinc-400 transition-colors">{template.desc}</p>
                            </motion.button>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}