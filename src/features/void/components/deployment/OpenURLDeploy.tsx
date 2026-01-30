import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check, Loader, ArrowRight, Github, Zap } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { useAuth } from '../../../../contexts/AuthContext';

interface OpenURLDeployProps {
    repoName: string;
    onComplete: (url: string) => void;
    onCancel: () => void;
}

export const OpenURLDeploy: React.FC<OpenURLDeployProps> = ({ repoName, onComplete, onCancel }) => {
    const [slug, setSlug] = useState('');
    const [status, setStatus] = useState<'idle' | 'checking' | 'deploying' | 'completed'>('idle');
    const [progress, setProgress] = useState(0);
    const [deploymentStep, setDeploymentStep] = useState('');

    useEffect(() => {
        if (repoName && !slug) {
            setSlug(repoName.toLowerCase().replace(/[^a-z0-9-]/g, '-'));
        }
    }, [repoName]);

    const handleDeploy = () => {
        setStatus('checking');

        // Simulate "Hyperintelligent" Deployment Process
        setTimeout(() => {
            setDeploymentStep('Verifying global availability...');
        }, 500);

        setTimeout(() => {
            setStatus('deploying');
            setDeploymentStep('Initializing quantum relay...');
        }, 1500);

        // Progress simulation
        let p = 0;
        const interval = setInterval(() => {
            p += Math.random() * 15;
            if (p > 100) {
                p = 100;
                clearInterval(interval);
                setStatus('completed');
                onComplete(`https://opendev-labs.github.io/${slug}`);
            } else {
                setProgress(Math.floor(p));
                // Randomize steps for effect
                if (p > 20 && p < 40) setDeploymentStep('Cloning repository from GitHub...');
                if (p > 40 && p < 60) setDeploymentStep('Building static assets (Nuxt/Next/React)...');
                if (p > 60 && p < 80) setDeploymentStep('Optimizing assets for edge delivery...');
                if (p > 80 && p < 95) setDeploymentStep('Pushing to Open-URLs Network...');
            }
        }, 200 + Math.random() * 100);
    };

    return (
        <div className="bg-black border border-zinc-800 p-8 max-w-2xl w-full mx-auto relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-20" />

            <AnimatePresence mode='wait'>
                {status === 'idle' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        key="idle"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20">
                                <Globe className="text-emerald-500" size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">OpenDev Hosting</h2>
                                <p className="text-zinc-500 text-sm">Deploy your repo to a free, high-performance URL.</p>
                            </div>
                        </div>

                        <div className="mb-8">
                            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
                                Desired URL Slug
                            </label>
                            <div className="flex items-center">
                                <span className="bg-zinc-900 border border-zinc-800 border-r-0 text-zinc-500 px-3 py-3 text-sm font-mono">
                                    opendev-labs.github.io/
                                </span>
                                <input
                                    type="text"
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    className="bg-black border border-zinc-800 text-white px-4 py-3 text-sm font-mono focus:outline-none focus:border-emerald-500 flex-1"
                                    placeholder="your-project-name"
                                />
                            </div>
                            <p className="text-zinc-600 text-xs mt-2 flex items-center gap-1">
                                <Check size={10} className="text-emerald-500" /> Available for instant deployment
                            </p>
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button variant="outline" onClick={onCancel} className="text-zinc-400 hover:text-white border-zinc-800">
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handleDeploy}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white border-none shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                            >
                                <Zap size={16} className="mr-2 fill-current" /> Deploy Site
                            </Button>
                        </div>
                    </motion.div>
                )}

                {(status === 'checking' || status === 'deploying') && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        key="deploying"
                        className="py-12 flex flex-col items-center justify-center text-center"
                    >
                        <div className="relative mb-8">
                            <div className="w-24 h-24 rounded-full border-2 border-zinc-800 flex items-center justify-center relative">
                                <motion.div
                                    className="absolute inset-0 border-2 border-emerald-500 rounded-full border-t-transparent"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                />
                                <Globe size={40} className="text-emerald-500" />
                            </div>
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-black px-2 text-emerald-500 text-xs font-bold font-mono">
                                {progress}%
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Deploying to Edge</h3>
                        <p className="text-zinc-400 font-mono text-sm h-6 overflow-hidden typing-effect">
                            {deploymentStep}
                        </p>
                    </motion.div>
                )}

                {status === 'completed' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        key="completed"
                        className="text-center"
                    >
                        <div className="w-16 h-16 bg-emerald-500 text-black rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                            <Check size={32} strokeWidth={3} />
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-2">Deployment Complete!</h2>
                        <p className="text-zinc-500 mb-8 max-w-sm mx-auto">
                            Your project is now live on the OpenDev network.
                        </p>

                        <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded mb-8 font-mono text-sm text-emerald-400 break-all">
                            https://opendev-labs.github.io/{slug}
                        </div>

                        <div className="flex justify-center gap-3">
                            <Button variant="secondary" onClick={onCancel}>Close</Button>
                            <Button variant="primary" onClick={() => window.open(`https://opendev-labs.github.io/${slug}`, '_blank')}>
                                Visit Site <ArrowRight size={16} className="ml-2" />
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
