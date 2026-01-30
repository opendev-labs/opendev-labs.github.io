import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { GitHubIcon, GitLabIcon, BitbucketIcon, PuzzlePieceIcon, CubeIcon, RocketLaunchIcon } from '../../common/Icons';

/* --- VISUAL COMPONENTS --- */

const HostingVisual = () => (
    <div className="h-40 w-full bg-black border-b border-zinc-900 relative overflow-hidden group-hover:bg-zinc-950 transition-colors duration-500 flex items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-black to-black"></div>
        <div className="relative z-10 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full border border-emerald-500/30 flex items-center justify-center animate-pulse-slow">
                <Globe className="w-8 h-8 text-emerald-500" />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-dashed border-emerald-500/10 rounded-full animate-spin-slow"></div>
        </div>
    </div>
);

const ImportVisual = () => (
    <div className="h-40 w-full bg-black border-b border-zinc-900 flex items-center justify-center relative overflow-hidden group-hover:bg-zinc-950 transition-colors duration-500">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/40 via-black to-black"></div>
        <div className="flex items-center gap-8 z-10">
            <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="p-3 bg-zinc-950 border border-zinc-800 rounded-none shadow-2xl"
            >
                <GitHubIcon className="w-6 h-6 text-white" />
            </motion.div>
            <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="p-3 bg-zinc-950 border border-zinc-800 rounded-none shadow-2xl"
            >
                <GitLabIcon className="w-6 h-6 text-white" />
            </motion.div>
            <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="p-3 bg-zinc-950 border border-zinc-800 rounded-none shadow-2xl"
            >
                <BitbucketIcon className="w-6 h-6 text-white" />
            </motion.div>
        </div>
    </div>
);

const TemplateVisual = () => (
    <div className="h-40 w-full bg-black border-b border-zinc-900 relative overflow-hidden flex flex-col p-6 group-hover:bg-zinc-950 transition-colors duration-500">
        <div className="flex gap-2 mb-4">
            <div className="w-2.5 h-2.5 rounded-none bg-zinc-800"></div>
            <div className="w-2.5 h-2.5 rounded-none bg-zinc-800"></div>
            <div className="w-2.5 h-2.5 rounded-none bg-zinc-800"></div>
        </div>
        <div className="space-y-2 font-mono text-[11px] leading-relaxed">
            <div className="flex gap-2">
                <span className="text-zinc-600">import</span>
                <span className="text-white">Logic</span>
                <span className="text-zinc-600">from</span>
                <span className="text-zinc-400">'@opendev-labs/core'</span>;
            </div>
            <div className="pl-4">
                <span className="text-zinc-500">return</span>
                <span className="text-white"> &lt;AutonomousNode /&gt;</span>
            </div>
            <div className="mt-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-none bg-white animate-pulse" />
                <span className="text-white font-bold tracking-tighter uppercase text-[9px]">Initializing Protocol...</span>
            </div>
        </div>
    </div>
);

const WorkflowVisual = () => (
    <div className="h-40 w-full bg-black border-b border-zinc-900 relative overflow-hidden group-hover:bg-zinc-950 transition-colors duration-500 flex items-center justify-center">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        <div className="relative z-10 flex items-center gap-4">
            <div className="w-10 h-10 rounded-none bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-xl">
                <CubeIcon className="w-5 h-5 text-white" />
            </div>
            <div className="w-12 h-[1px] bg-zinc-800 relative">
                <div className="absolute top-1/2 left-0 w-full h-[2px] -translate-y-1/2 bg-white/20 animate-shine"></div>
            </div>
            <div className="w-10 h-10 rounded-none bg-black border border-white flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                <RocketLaunchIcon className="w-5 h-5 text-white" />
            </div>
        </div>
    </div>
);

const PremiumCard: React.FC<{
    title: string;
    description: string;
    onClick: () => void;
    visual: React.ReactNode;
}> = ({ title, description, onClick, visual }) => (
    <button
        onClick={onClick}
        className="group relative flex flex-col text-left bg-black border border-zinc-900 rounded-none overflow-hidden transition-all duration-500 hover:bg-zinc-950 w-full h-full"
    >
        {visual}
        <div className="p-8">
            <h3 className="text-lg font-bold text-white mb-3 tracking-tighter group-hover:translate-x-1 transition-transform">{title}</h3>
            <p className="text-sm text-zinc-500 font-medium leading-relaxed">{description}</p>
        </div>
    </button>
);

export const NewProjectLanding: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="space-y-24">
            <div className="text-center pt-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center"
                >
                    <span className="inline-block px-3 py-1 rounded-none bg-zinc-900 border border-zinc-800 text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500 mb-8">
                        Genesis Protocol
                    </span>
                    <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white mb-8">
                        Build something <span className="text-zinc-600 italic font-serif">new.</span>
                    </h1>
                    <p className="text-lg text-zinc-500 max-w-xl mx-auto font-medium leading-relaxed">
                        Initialize from your Git fleet, clone a boilerplate, or orchestrate high-fidelity systems with Mesh Workflows.
                    </p>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1 max-w-7xl mx-auto">
                <PremiumCard
                    title="Git Import"
                    description="Deploy an existing architecture directly from your VCS fleet."
                    visual={<ImportVisual />}
                    onClick={() => navigate('import')}
                />
                <PremiumCard
                    title="Boilerplates"
                    description="Initialize with optimized Next.js, Vite, or Neural clusters."
                    visual={<TemplateVisual />}
                    onClick={() => navigate('templates')}
                />
                <PremiumCard
                    title="Logic Mesh"
                    description="Orchestrate full-stack autonomous systems with managed logic."
                    visual={<WorkflowVisual />}
                    onClick={() => navigate('mesh')}
                />
                <PremiumCard
                    title="OpenDev Hosting"
                    description="Free, high-performance static hosting on the OpenDev network."
                    visual={<HostingVisual />}
                    onClick={() => navigate('hosting')}
                />
            </div>
        </div>
    );
};
