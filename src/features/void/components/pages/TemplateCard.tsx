import React, { useState, useEffect } from 'react';
import type { Template } from '../../types';
import { ConfigureProjectForm } from '../common/ConfigureProjectForm';
import { motion, AnimatePresence } from 'framer-motion';

interface TemplateCardProps {
    template: Template;
    onDeploy: (template: Template, projectName: string, createRepo?: boolean, isPrivate?: boolean) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({ template, onDeploy }) => {
    const [isConfiguring, setIsConfiguring] = useState(false);
    const [isInitializing, setIsInitializing] = useState(false);
    const [terminalLines, setTerminalLines] = useState<string[]>([]);

    useEffect(() => {
        if (isInitializing) {
            const lines = [
                `> INITIALIZING ${template.framework.toUpperCase()} PROTOCOL...`,
                `> CLONING GENESIS REPOSITORY...`,
                `> INJECTING NEURAL MANIFESTS...`,
                `> SYNCING WITH EDGE MESH...`,
                `> PROTOCOL ESTABLISHED.`
            ];
            let currentLine = 0;
            const interval = setInterval(() => {
                if (currentLine < lines.length) {
                    setTerminalLines(prev => [...prev.slice(-3), lines[currentLine]]);
                    currentLine++;
                } else {
                    clearInterval(interval);
                }
            }, 400);
            return () => clearInterval(interval);
        }
    }, [isInitializing, template.framework]);

    const handleLaunch = (projectName: string, createRepo?: boolean, isPrivate?: boolean) => {
        setIsInitializing(true);
        setTimeout(() => {
            onDeploy(template, projectName, createRepo, isPrivate);
            setIsInitializing(false);
            setIsConfiguring(false);
        }, 2500);
    };

    return (
        <div className="group relative bg-black border border-zinc-900 overflow-hidden transition-all duration-700 hover:border-zinc-500/50 flex flex-col text-left h-[500px] w-full">
            {/* Glossy Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-tr from-zinc-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

            {/* Official Logo Preview */}
            <div className="relative h-48 w-full bg-zinc-950 overflow-hidden border-b border-zinc-900 flex items-center justify-center">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/3 via-black to-black" />

                <AnimatePresence mode="wait">
                    {isInitializing ? (
                        <motion.div
                            key="terminal"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-zinc-950 p-6 flex flex-col justify-end font-mono text-[9px] text-emerald-500/80 uppercase tracking-tighter"
                        >
                            {terminalLines.map((line, i) => (
                                <div key={i} className="mb-1 leading-none">{line}</div>
                            ))}
                            <div className="w-2 h-3 bg-emerald-500 animate-pulse mt-1" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="image"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="h-full w-full flex items-center justify-center"
                        >
                            {template.imageUrl ? (
                                <img
                                    src={template.imageUrl}
                                    alt={template.name}
                                    className="max-h-28 max-w-[85%] object-contain opacity-60 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
                                />
                            ) : (
                                <div className="text-zinc-800">
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Official Template</span>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Category & Official Badge */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                    {template.category && (
                        <div className="px-2.5 py-1 bg-emerald-500/10 backdrop-blur-xl border border-emerald-500/20">
                            <span className="text-[8px] font-black text-emerald-500 uppercase tracking-[0.25em]">{template.category}</span>
                        </div>
                    )}
                    <div className="ml-auto px-2.5 py-1 bg-black/90 backdrop-blur-xl border border-zinc-800">
                        <span className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.25em]">Official</span>
                    </div>
                </div>
            </div>

            <div className="p-8 flex flex-col flex-grow relative z-10">
                {/* Header with Name */}
                <div className="mb-4">
                    <h3 className="font-black text-white tracking-tighter leading-tight text-xl uppercase group-hover:text-orange-500 transition-colors duration-500">{template.name}</h3>
                </div>

                {/* Description */}
                <div className="flex-grow mb-6">
                    <p className="text-xs text-zinc-500 font-medium leading-relaxed tracking-tight group-hover:text-zinc-300 transition-colors duration-500">
                        {template.description}
                    </p>
                </div>

                {/* Features */}
                {template.features && template.features.length > 0 && (
                    <div className="mb-8">
                        <div className="grid grid-cols-2 gap-2">
                            {template.features.slice(0, 4).map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-1.5">
                                    <div className="w-1 h-1 bg-emerald-500 rounded-full" />
                                    <span className="text-[10px] text-zinc-600 font-medium">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Action Button/Form */}
                <div className="mt-auto">
                    {!isConfiguring ? (
                        <button
                            onClick={() => setIsConfiguring(true)}
                            className="w-full h-11 text-[11px] bg-zinc-900 border border-zinc-800 text-white font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-500 relative overflow-hidden group/btn"
                        >
                            <span className="relative z-10">Initialize Node</span>
                            <div className="absolute inset-y-0 left-0 w-1 bg-orange-500 group-hover/btn:w-full transition-all duration-500 z-0 opacity-20" />
                        </button>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <ConfigureProjectForm
                                defaultName={template.name.toLowerCase().replace(/[.\s+]/g, '-')}
                                onDeploy={handleLaunch}
                                onCancel={() => setIsConfiguring(false)}
                                showRepoOptions={true}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Corner Decor */}
            <div className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-to-tl from-zinc-800/10 to-transparent pointer-events-none" />
        </div>
    );
};
