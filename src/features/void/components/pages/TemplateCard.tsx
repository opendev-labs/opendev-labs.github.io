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

            {/* Preview Image */}
            <div className="relative h-48 w-full bg-zinc-950 overflow-hidden border-b border-zinc-900">
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
                            className="h-full w-full"
                        >
                            {template.imageUrl ? (
                                <img src={template.imageUrl} alt={template.name} className="w-full h-full object-cover opacity-40 group-hover:opacity-80 group-hover:scale-110 transition-all duration-[2000ms] ease-out grayscale hover:grayscale-0" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-zinc-800">
                                    <span className="text-[10px] font-bold uppercase tracking-widest">No Preview</span>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Framework Badge */}
                <div className="absolute top-4 left-4 flex items-center gap-2 px-2.5 py-1 bg-black/90 backdrop-blur-xl border border-zinc-800 rounded-none z-10">
                    {template.logoUrl && <img src={template.logoUrl} className="w-3.5 h-3.5 grayscale invert brightness-200" alt="" />}
                    <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">{template.framework}</span>
                </div>
            </div>

            <div className="p-8 flex flex-col flex-grow relative z-10">
                {/* Header with Name */}
                <div className="mb-4">
                    <h3 className="font-black text-white tracking-tighter leading-tight text-xl uppercase group-hover:text-orange-500 transition-colors duration-500">{template.name}</h3>
                </div>

                {/* Description */}
                <div className="flex-grow mb-8">
                    <p className="text-xs text-zinc-500 font-medium leading-relaxed tracking-tight group-hover:text-zinc-300 transition-colors duration-500">
                        {template.description}
                    </p>
                </div>

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
