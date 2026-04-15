import React from 'react';
import { PromptInput } from './PromptInput';
import { motion } from 'framer-motion';
import { useAuth } from '../../void/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface WelcomeScreenProps {
    onSendMessage: (prompt: string) => void;
    isThinking: boolean;
    // Model props
    selectedModelId: string;
    onModelChange: (modelId: string) => void;
}

export function WelcomeScreen({ onSendMessage, isThinking, selectedModelId, onModelChange }: WelcomeScreenProps) {
    const { hasApiKeys } = useAuth();
    const navigate = useNavigate();

    if (!hasApiKeys) {
        return (
            <div className="flex flex-col h-full w-full bg-[#080808] text-white p-8 items-center justify-center relative overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-[800px] bg-gradient-to-b from-yellow-500/[0.02] via-transparent to-transparent opacity-50" />
                
                <div className="relative z-10 w-full max-w-lg text-center p-12 bg-zinc-900/10 border border-zinc-800/50 rounded-[30px] backdrop-blur-xl">
                    <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-yellow-500/20">
                        <span className="text-2xl">🔑</span>
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-4 tracking-tight">Materialization Keys Required</h3>
                    <p className="text-zinc-500 text-sm mb-10 leading-relaxed font-medium">
                        To begin high-fidelity code generation, initialize your API handshake in the system settings. This ensures secure, sovereign materialization across the mesh.
                    </p>
                    
                    <div className="space-y-4">
                        <button 
                            onClick={() => navigate('/settings/profile')}
                            className="w-full bg-white text-black py-4 rounded-xl font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all shadow-xl"
                        >
                            Configure Handshake →
                        </button>
                        
                        <a 
                            href="https://aistudio.google.com/app/apikey" 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-[10px] text-zinc-600 font-bold uppercase tracking-widest hover:text-white transition-colors"
                        >
                            Get free Gemini API key
                        </a>
                    </div>
                </div>
                
                <p className="absolute bottom-12 text-[9px] text-zinc-800 uppercase font-bold tracking-[0.5em]">
                    OpenStudio Protocol // Gate 101
                </p>
            </div>
        );
    }

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

                    <div className="flex flex-wrap items-center justify-center gap-6 w-full max-w-4xl">
                        {[
                            'Create a beautiful landing page design',
                            'Build a serverless Node backend',
                            'Map out system architecture',
                            'Generate a React dashboard'
                        ].map((suggestion, i) => (
                            <motion.button
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + (i * 0.05) }}
                                onClick={() => onSendMessage(suggestion)}
                                className="text-sm text-zinc-500 hover:text-white transition-colors cursor-pointer flex items-center gap-2 tracking-wide"
                            >
                                <span className="opacity-40">✦</span> {suggestion}
                            </motion.button>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}