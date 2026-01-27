import React, { useEffect, useState, useRef } from 'react';
import { ExternalLinkIcon, CheckCircleIcon, RefreshIcon, TerminalIcon } from '../common/Icons';
import { useAuth } from '../../hooks/useAuth';
import { motion } from 'framer-motion';

interface DeploymentPageProps {
    projectId: string;
}

const LogLine: React.FC<{ text: string; delay: number }> = ({ text, delay }) => (
    <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: delay * 0.5, duration: 0.3 }}
        className="font-mono text-xs md:text-sm text-zinc-400 mb-1"
    >
        <span className="text-zinc-600 mr-2">{'>'}</span>
        {text.includes('Success') ? <span className="text-void-accent">{text}</span> : text}
    </motion.div>
);

export const DeploymentPage: React.FC<DeploymentPageProps> = ({ projectId }) => {
    const { user } = useAuth();
    const [isLive, setIsLive] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Derive project name 
    const projectName = projectId || 'Unknown Project';

    const buildSteps = [
        "Initializing build environment...",
        "Cloning repository...",
        "Installing dependencies (npm install)...",
        "✓ Dependencies installed",
        "Running build command...",
        "Optimizing static assets...",
        "Generating serverless functions...",
        "✓ Build completed in 1.2s",
        "Deploying to Edge Network...",
        "Verifying DNS configuration...",
        "✓ Deployment Success!"
    ];

    useEffect(() => {
        let currentStep = 0;

        const interval = setInterval(() => {
            if (currentStep < buildSteps.length) {
                setLogs(prev => [...prev, buildSteps[currentStep]]);
                currentStep++;

                // Auto-scroll
                if (scrollRef.current) {
                    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                }
            } else {
                setIsLive(true);
                clearInterval(interval);
            }
        }, 600); // 600ms per step

        return () => clearInterval(interval);
    }, [projectId]);

    return (
        <div className="min-h-screen bg-black text-white font-sans flex flex-col">
            {/* Simulation Header */}
            <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-3 flex items-center justify-between text-sm shadow-sm z-20">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-void-accent animate-pulse"></div>
                    <span className="font-semibold text-white tracking-wide">Void Host <span className="text-zinc-500 font-normal">Preview</span></span>
                    {isLive ? (
                        <span className="bg-green-500/10 text-green-400 px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-green-500/20 flex items-center gap-1 uppercase tracking-wider">
                            Live
                        </span>
                    ) : (
                        <span className="bg-yellow-500/10 text-yellow-400 px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-yellow-500/20 flex items-center gap-1 uppercase tracking-wider animate-pulse transition-opacity">
                            Building
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-3 text-zinc-500">
                    <span className="font-mono bg-black border border-zinc-800 px-3 py-1 rounded text-xs text-zinc-400">{`https://${projectName}.void.app`}</span>
                    <a href={`https://${projectName}.void.app`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                        <ExternalLinkIcon className="w-4 h-4" />
                    </a>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-grow relative flex flex-col md:flex-row h-[calc(100vh-50px)]">

                {/* Left: Interactive Terminal */}
                <div className="w-full md:w-1/2 p-6 flex flex-col bg-black border-r border-zinc-900">
                    <div className="flex items-center gap-2 mb-4 text-zinc-500">
                        <TerminalIcon className="w-4 h-4" />
                        <span className="text-xs font-mono uppercase tracking-widest">Build Logs</span>
                    </div>
                    <div
                        ref={scrollRef}
                        className="flex-grow bg-[#050505] border border-zinc-800 rounded-lg p-5 font-mono overflow-y-auto no-scrollbar shadow-inner"
                    >
                        {logs.map((log, index) => (
                            <LogLine key={index} text={log} delay={index} />
                        ))}
                        {!isLive && (
                            <motion.div
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{ repeat: Infinity, duration: 0.8 }}
                                className="w-2 h-4 bg-void-accent mt-1"
                            />
                        )}
                    </div>
                </div>

                {/* Right: Preview Window */}
                <div className="w-full md:w-1/2 bg-zinc-900/50 relative flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-800/10 via-black to-black opacity-50"></div>

                    {isLive ? (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            className="text-center relative z-10 p-12 bg-black border border-zinc-800 rounded-2xl shadow-2xl max-w-sm"
                        >
                            <div className="w-20 h-20 bg-black border border-zinc-800 text-void-accent rounded-full flex items-center justify-center text-4xl font-bold mb-6 mx-auto shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                                V
                            </div>
                            <h1 className="text-3xl font-heading font-bold text-white mb-2">
                                {projectName}
                            </h1>
                            <p className="text-zinc-500 mb-8">
                                Deployed successfully to the Edge.
                            </p>

                            <button className="w-full py-2.5 bg-white text-black font-semibold rounded-md hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2">
                                <ExternalLinkIcon className="w-4 h-4" />
                                Visit Website
                            </button>
                        </motion.div>
                    ) : (
                        <div className="text-center z-10">
                            <div className="w-16 h-16 border-4 border-zinc-800 border-t-void-accent rounded-full animate-spin mx-auto mb-6"></div>
                            <h2 className="text-xl font-semibold text-white">Deploying...</h2>
                            <p className="text-zinc-500 mt-2">Allocating resources</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
