import React, { useState } from 'react';
import { Github, Rocket, Flame, Box, Check, ShieldCheck, ArrowRight } from 'lucide-react';
import { AnimatedLoaderIcon } from '../common/AnimatedLoaderIcon';
import { DeploymentPlatform } from '../../types';

interface DeploymentConfigFormProps {
    templateName: string;
    onDeploy: (projectName: string, platform: DeploymentPlatform, isPrivate?: boolean) => void;
    onCancel: () => void;
}

const platforms = [
    {
        id: 'syncstack' as DeploymentPlatform,
        name: 'Sovereign Sync',
        icon: Rocket,
        description: 'Native OpenDev Mesh',
        recommended: true,
        color: 'text-[#ff5500]'
    },
    {
        id: 'github' as DeploymentPlatform,
        name: 'GitHub Registry',
        icon: Github,
        description: 'Sovereign source control',
        recommended: false,
        color: 'text-white'
    },
    {
        id: 'vercel' as DeploymentPlatform,
        name: 'Nexus Edge',
        icon: Rocket,
        description: 'Vercel distributed node',
        recommended: false,
        color: 'text-white'
    },
    {
        id: 'firebase' as DeploymentPlatform,
        name: 'Titan Firestore',
        icon: Flame,
        description: 'Google Cloud cluster',
        recommended: false,
        color: 'text-[#ff5500]'
    },
    {
        id: 'huggingface' as DeploymentPlatform,
        name: 'Neural Space',
        icon: Box,
        description: 'HuggingFace inference',
        recommended: false,
        color: 'text-yellow-500'
    }
];

export const DeploymentConfigForm: React.FC<DeploymentConfigFormProps> = ({
    templateName,
    onDeploy,
    onCancel
}) => {
    const [projectName, setProjectName] = useState(templateName.toLowerCase().replace(/\s+/g, '-'));
    const [selectedPlatform, setSelectedPlatform] = useState<DeploymentPlatform>('github');
    const [isPrivate, setIsPrivate] = useState(false);
    const [isDeploying, setIsDeploying] = useState(false);

    const urlFriendlyName = projectName.toLowerCase().replace(/[^a-z0-9-]/g, '-');

    // Generate preview URL based on platform
    const getPreviewURL = () => {
        switch (selectedPlatform) {
            case 'github':
                return `${urlFriendlyName}.github.io`;
            case 'vercel':
                return `${urlFriendlyName}.vercel.app`;
            case 'firebase':
                return `${urlFriendlyName}.web.app`;
            case 'huggingface':
                return `${urlFriendlyName}.hf.space`;
            case 'syncstack':
                return `${urlFriendlyName}.opendev.app`;
            default:
                return `${urlFriendlyName}.opendev.app`;
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (projectName.trim() && !isDeploying) {
            setIsDeploying(true);
            setTimeout(() => {
                onDeploy(projectName.trim(), selectedPlatform, isPrivate);
            }, 800);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-black border border-zinc-900 p-10 space-y-8 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#ff5500]/30 to-transparent" />

            {/* Header */}
            <div className="border-b border-zinc-900 pb-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 rounded-none bg-[#ff5500] animate-pulse" />
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter">Materialization Protocol</h3>
                </div>
                <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.4em]"> নীল ভয়েড // BLUE VOID SECURE GENESIS</p>
            </div>

            {/* Project Name */}
            <div className="space-y-4">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] block">
                    Node Identity (Username/Project)
                </label>
                <div className="relative">
                    <input
                        type="text"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-900 h-14 px-6 text-sm text-white font-mono focus:outline-none focus:border-[#ff5500] transition-all rounded-none"
                        required
                        autoFocus
                        placeholder="nexus-node-01"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-zinc-800 uppercase tracking-widest pointer-events-none">
                        Registry Active
                    </div>
                </div>
                <div className="p-4 bg-zinc-950/50 border border-zinc-900/50">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                        Uplink Preview: <span className="text-[#ff5500] ml-2 font-mono">opendev.app/{urlFriendlyName}</span>
                    </p>
                </div>
            </div>

            {/* Platform Selection */}
            <div className="space-y-4">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] block">
                    Execution Cluster
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {platforms.map((platform) => {
                        const Icon = platform.icon;
                        const isSelected = selectedPlatform === platform.id;

                        return (
                            <button
                                key={platform.id}
                                type="button"
                                onClick={() => setSelectedPlatform(platform.id)}
                                className={`
                                    relative p-5 border transition-all text-left bg-black group
                                    ${isSelected
                                        ? 'border-[#ff5500] shadow-[0_0_20px_rgba(255,85,0,0.05)]'
                                        : 'border-zinc-900 hover:border-zinc-700'
                                    }
                                `}
                            >
                                {platform.recommended && (
                                    <div className="absolute top-0 right-0 px-2 py-0.5 bg-[#ff5500] text-black text-[8px] font-black uppercase tracking-widest">
                                        Primary
                                    </div>
                                )}
                                <div className="flex items-center gap-4">
                                    <Icon size={18} className={`${isSelected ? 'text-[#ff5500]' : 'text-zinc-600'} group-hover:text-white transition-colors`} />
                                    <div>
                                        <h4 className={`text-[11px] font-black uppercase tracking-widest ${isSelected ? 'text-white' : 'text-zinc-500'}`}>
                                            {platform.name}
                                        </h4>
                                        <p className="text-[9px] text-zinc-700 font-bold uppercase tracking-tighter mt-0.5">{platform.description}</p>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Privacy Option */}
            <div className="flex items-center gap-4 p-5 bg-zinc-950/30 border border-zinc-900">
                <div className="relative flex items-center">
                    <input
                        type="checkbox"
                        id="private-repo"
                        checked={isPrivate}
                        onChange={(e) => setIsPrivate(e.target.checked)}
                        className="appearance-none w-5 h-5 bg-black border border-zinc-800 checked:bg-[#ff5500] checked:border-[#ff5500] transition-all cursor-pointer"
                    />
                    {isPrivate && <Check size={14} className="absolute inset-0 m-auto text-black pointer-events-none" />}
                </div>
                <label htmlFor="private-repo" className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest cursor-pointer select-none">
                    Encrypt Repository (Private Genesis)
                </label>
            </div>

            {/* Actions */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-zinc-900">
                <div className="flex items-center gap-4">
                    <ShieldCheck size={16} className="text-zinc-800" />
                    <span className="text-[9px] font-bold text-zinc-700 uppercase tracking-[0.2em]">Secure Node Orchestration // v1.0.4</span>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 md:flex-none h-12 px-8 border border-zinc-900 text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] hover:text-white hover:border-zinc-700 transition-all disabled:opacity-50"
                        disabled={isDeploying}
                    >
                        Abort
                    </button>
                    <button
                        type="submit"
                        className={`
                            flex-1 md:flex-none h-12 px-10 text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3
                            ${isDeploying
                                ? 'bg-zinc-900 text-zinc-600'
                                : 'bg-white text-black hover:bg-[#ff5500] hover:text-white shadow-[0_0_30px_rgba(255,255,255,0.05)]'
                            }
                        `}
                        disabled={isDeploying}
                    >
                        {isDeploying ? (
                            <>
                                <AnimatedLoaderIcon size={14} className="animate-spin" />
                                Materializing...
                            </>
                        ) : (
                            <>
                                Initiate Genesis
                                <ArrowRight size={14} />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
};
