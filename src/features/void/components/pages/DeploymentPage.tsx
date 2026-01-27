import React, { useEffect, useState, useRef } from 'react';
import { ExternalLinkIcon, CheckCircleIcon, RefreshIcon, TerminalIcon } from '../common/Icons';
import { useAuth } from '../../hooks/useAuth';
import { motion } from 'framer-motion';

interface DeploymentPageProps {
    projectId: string;
}

const LogLine: React.FC<{ text: string; delay: number }> = ({ text, delay }) => (
    <motion.div
        initial={{ opacity: 0, x: -4 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: delay * 0.1, duration: 0.5 }}
        className="font-mono text-[12px] text-zinc-600 mb-1.5 flex gap-4 selection:bg-white selection:text-black"
    >
        <span className="text-zinc-800 font-bold tabular-nums w-4 shrink-0">{'>'}</span>
        <span className={text.includes('✓') || text.includes('Success') ? 'text-white font-bold' : ''}>
            {text}
        </span>
    </motion.div>
);

export const DeploymentPage: React.FC<DeploymentPageProps> = ({ projectId }) => {
    const { user } = useAuth();
    const [isLive, setIsLive] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    const projectName = projectId || 'nexus-core';

    const buildSteps = [
        "Initializing neural environment...",
        "Cloning repository from nexus...",
        "Resolving protocol dependencies...",
        "✓ Dependencies synchronized",
        "Executing build manifest...",
        "Optimizing cognitive assets...",
        "Synthesizing edge logic...",
        "✓ Build verified in 0.8s",
        "Propagating to Global Nexus Network...",
        "Finalizing DNS handshake...",
        "✓ Protocol Live: Node Active"
    ];

    useEffect(() => {
        let currentStep = 0;

        const interval = setInterval(() => {
            if (currentStep < buildSteps.length) {
                setLogs(prev => [...prev, buildSteps[currentStep]]);
                currentStep++;

                if (scrollRef.current) {
                    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                }
            } else {
                setIsLive(true);
                clearInterval(interval);
            }
        }, 500);

        return () => clearInterval(interval);
    }, [projectId]);

    return (
        <div className="min-h-screen bg-black text-white font-sans flex flex-col selection:bg-white selection:text-black">
            {/* Header */}
            <div className="bg-black border-b border-zinc-900 px-8 py-5 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest z-20">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-white' : 'bg-zinc-800 animate-pulse'}`}></div>
                        <span className="text-white">Node Host <span className="text-zinc-700 ml-2">Preview</span></span>
                    </div>
                    {isLive ? (
                        <span className="text-white border border-white px-3 py-1 leading-none">
                            Active
                        </span>
                    ) : (
                        <span className="text-zinc-600 border border-zinc-900 px-3 py-1 leading-none animate-pulse">
                            Provisioning
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-6">
                    <span className="font-mono text-zinc-500 tabular-nums lowercase tracking-normal">{`https://${projectName}.opendev.app`}</span>
                    <a href={`https://${projectName}.opendev.app`} target="_blank" rel="noopener noreferrer" className="text-zinc-600 hover:text-white transition-colors">
                        <ExternalLinkIcon className="w-4 h-4" />
                    </a>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-grow flex flex-col md:flex-row h-[calc(100vh-60px)]">

                {/* Left: Terminal */}
                <div className="w-full md:w-1/2 p-10 flex flex-col bg-black border-r border-zinc-900">
                    <div className="flex items-center gap-3 mb-8 text-zinc-600">
                        <TerminalIcon className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Build Telemetry</span>
                    </div>
                    <div
                        ref={scrollRef}
                        className="flex-grow bg-black rounded-none p-0 font-mono overflow-y-auto no-scrollbar"
                    >
                        <div className="space-y-1">
                            {logs.map((log, index) => (
                                <LogLine key={index} text={log} delay={index} />
                            ))}
                            {!isLive && (
                                <motion.div
                                    animate={{ opacity: [0, 1, 0] }}
                                    transition={{ repeat: Infinity, duration: 1 }}
                                    className="w-1.5 h-4 bg-zinc-800 mt-2"
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Preview Window */}
                <div className="w-full md:w-1/2 bg-zinc-950 relative flex items-center justify-center overflow-hidden border-t md:border-t-0 border-zinc-900">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-black to-black opacity-40"></div>

                    {isLive ? (
                        <motion.div
                            initial={{ scale: 0.98, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                            className="text-center relative z-10 p-16 bg-black border border-zinc-900 rounded-none w-full max-w-md mx-6"
                        >
                            <div className="w-20 h-20 bg-black border border-zinc-900 text-white rounded-none flex items-center justify-center text-4xl font-bold mb-10 mx-auto shadow-[0_30px_60px_-15px_rgba(255,255,255,0.1)]">
                                NV
                            </div>
                            <h1 className="text-4xl font-bold text-white mb-4 tracking-tighter">
                                {projectName}
                            </h1>
                            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] mb-12">
                                Node successfully synchronized with Nexus.
                            </p>

                            <button className="w-full h-14 bg-white text-black font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all flex items-center justify-center gap-4">
                                <ExternalLinkIcon className="w-4 h-4" />
                                Expose Node
                            </button>
                        </motion.div>
                    ) : (
                        <div className="text-center z-10 space-y-8">
                            <div className="relative flex h-16 w-16 mx-auto">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-20"></span>
                                <span className="relative inline-flex rounded-full h-16 w-16 bg-white opacity-10"></span>
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-[10px] font-bold text-white uppercase tracking-[0.3em]">Provisioning protocol...</h2>
                                <p className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">Allocating nexus resources</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

