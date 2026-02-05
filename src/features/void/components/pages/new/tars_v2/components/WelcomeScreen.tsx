import React from 'react';
import { SUGGESTED_PROMPTS } from '../constants';
import { PromptInput } from './PromptInput';

interface WelcomeScreenProps {
    onSendMessage: (prompt: string) => void;
    isThinking: boolean;
    // Model props
    selectedModelId: string;
    apiKeys: Record<string, string>;
    onModelChange: (modelId: string) => void;
    onApiKeySave: (provider: string, key: string) => void;
}

export function WelcomeScreen({ onSendMessage, isThinking, selectedModelId, apiKeys, onModelChange, onApiKeySave }: WelcomeScreenProps) {
    const renderPromptButton = (prompt: string) => (
        <button
            key={prompt}
            onClick={() => onSendMessage(prompt)}
            disabled={isThinking}
            className="bg-[#1C1C1C] border border-white/10 text-gray-400 text-sm px-4 py-2 rounded-full hover:bg-[#2A2A2A] hover:text-gray-200 transition-colors duration-200 disabled:opacity-50"
        >
            {prompt}
        </button>
    );

    return (
        <div className="flex flex-col h-screen w-full bg-black selection:bg-white selection:text-black">
            <main className="flex-grow flex flex-col items-center justify-center text-center px-6">
                <div className="w-full max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 text-[10px] font-bold text-zinc-500 mb-8 uppercase tracking-[0.4em]">
                        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                        Quantum // Materialization Hub
                    </div>

                    <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 tracking-tighter leading-[0.85] lowercase">
                        what shall we<br />
                        <span className="text-zinc-600">materialize?</span>
                    </h1>

                    <p className="text-zinc-500 text-lg md:text-xl font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
                        architect, build, and deploy high-fidelity nodes across the sovereign mesh with zero-shot intelligence.
                    </p>

                    <div className="mb-12">
                        <PromptInput
                            onSendMessage={onSendMessage}
                            disabled={isThinking}
                            selectedModelId={selectedModelId}
                            apiKeys={apiKeys}
                            onModelChange={onModelChange}
                            onApiKeySave={onApiKeySave}
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
                                className="group p-6 bg-zinc-950 border border-zinc-900 text-left hover:border-orange-500/50 transition-all duration-300 rounded-none relative overflow-hidden"
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