import React from 'react';
import { safeNavigate } from '../../services/navigation';
import { socialProofLogos } from '../../constants';
import { SparklesIcon, CpuChipIcon, PuzzlePieceIcon, GitBranchIcon } from '../common/Icons';
import { motion } from 'framer-motion';

const VoidBackground = () => (
    <>
        <div className="absolute inset-0 z-[-2] bg-black" />
        <div
            className="absolute inset-0 z-[-1] opacity-40"
            style={{
                backgroundImage: 'radial-gradient(circle at 25% 30%, #7DF9FF, transparent 30%), radial-gradient(circle at 75% 70%, #9b5cff, transparent 30%)',
                animation: 'gradient-fade 10s ease-in-out infinite',
                backgroundSize: '200% 200%',
                filter: 'blur(120px)',
            }}
        />
        <div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
                background: 'radial-gradient(circle at center, transparent 35%, #050507 70%)'
            }}
        />
    </>
);

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="bg-void-card/50 border border-void-line p-6 rounded-lg backdrop-blur-sm glow-border"
        onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            e.currentTarget.style.setProperty('--glow-x', `${e.clientX - rect.left}px`);
            e.currentTarget.style.setProperty('--glow-y', `${e.clientY - rect.top}px`);
        }}
    >
        <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 flex items-center justify-center bg-void-accent/20 text-void-accent rounded-md">{icon}</div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
        <p className="text-sm text-zinc-400">{children}</p>
    </div>
);


export const HomePage: React.FC = () => {

    const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
        e.preventDefault();
        safeNavigate(path);
    };

    return (
        <div className="relative overflow-hidden -mx-4 -mt-8">
            {/* Background Elements */}
            <VoidBackground />

            <div className="relative z-10 container mx-auto px-4">
                {/* Hero Section */}
                <div className="min-h-[90vh] flex flex-col justify-center items-center text-center py-20 relative">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-void-accent/10 blur-[150px] rounded-full pointer-events-none"
                    />

                    <div className="relative z-10 space-y-8 max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border-white/[0.08] text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400 mb-6 active:scale-95 transition-all cursor-default">
                                <div className="w-1.5 h-1.5 rounded-full bg-void-accent animate-pulse" />
                                The Future of Deployment is Here
                            </span>
                            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-white leading-[0.9] mb-8">
                                Build. Scale. <br />
                                <span className="gradient-text italic font-serif">Ascend.</span>
                            </h1>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="mt-8 max-w-2xl mx-auto text-lg md:text-xl text-zinc-400 leading-relaxed font-light"
                        >
                            Void is the hyper-intelligent serverless platform designed for the next generation of engineers. Experience the speed of light in every deployment.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6"
                        >
                            <a
                                href="/#/signup"
                                onClick={(e) => handleNav(e, '/signup')}
                                className="group relative inline-flex items-center justify-center px-10 py-4 text-sm font-bold text-black bg-white rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                            >
                                START DEPLOYING NOW
                            </a>
                            <a
                                href="/#/docs"
                                onClick={(e) => handleNav(e, '/docs')}
                                className="group px-8 py-4 glass-panel rounded-full text-sm font-bold text-white hover:text-void-accent hover:border-void-accent/30 transition-all active:scale-95"
                            >
                                VIEW DOCUMENTATION
                            </a>
                        </motion.div>
                    </div>

                    {/* Scroll Indicator */}
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-20">
                        <div className="w-px h-12 bg-gradient-to-b from-white to-transparent" />
                    </div>
                </div>

                {/* Social Proof Section */}
                <div className="py-24 border-y border-white/[0.05] relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/[0.01] pointer-events-none" />
                    <p className="text-[10px] font-bold tracking-[0.3em] text-zinc-500 mb-12 uppercase text-center opacity-50">Empowering the World's Digital Architects</p>
                    <div className="flex justify-center items-center gap-12 md:gap-20 flex-wrap px-4 grayscale opacity-30">
                        {socialProofLogos.map(logo => (
                            <img key={logo.name} src={logo.url} alt={logo.name} className="h-5 md:h-7 object-contain hover:grayscale-0 hover:opacity-100 transition-all duration-500" />
                        ))}
                    </div>
                </div>

                {/* Features Section */}
                <div className="py-32 max-w-6xl mx-auto">
                    <div className="text-center mb-24">
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">Engineered for Excellence.</h2>
                        <p className="mt-4 max-w-2xl mx-auto text-zinc-400 text-lg font-light leading-relaxed">Everything you need to build, deploy, and scale with absolute precision and unmatched performance.</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 px-4">
                        <FeatureCard icon={<GitBranchIcon />} title="Instant Dimensional Previews">
                            Every commit materializes into a live, production-grade environment. Collaborate across reality with unique preview URLs.
                        </FeatureCard>
                        <FeatureCard icon={<SparklesIcon />} title="Quantum Edge Network">
                            Your applications resonate globally via our ultra-low latency edge fabric. Deliver content at the speed of thought.
                        </FeatureCard>
                        <FeatureCard icon={<CpuChipIcon />} title="Autonomous Serverless Compute">
                            Scale your intelligence effortlessly. Our serverless architecture adapts to your traffic in real-time, with zero management.
                        </FeatureCard>
                        <FeatureCard icon={<PuzzlePieceIcon />} title="Integrated Storage Matrix">
                            Seamlessly connect high-performance databases and object storage with a single click. Your data, unified.
                        </FeatureCard>
                    </div>
                </div>
            </div>
        </div>
    );
};