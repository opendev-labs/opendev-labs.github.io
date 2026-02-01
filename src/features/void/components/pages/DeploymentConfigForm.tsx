import React, { useState } from 'react';
import { Github, Rocket, Flame, Box, Check } from 'lucide-react';
import { AnimatedLoaderIcon } from '../common/AnimatedLoaderIcon';

export type DeploymentPlatform = 'github' | 'vercel' | 'firebase' | 'huggingface' | 'syncstack';

interface DeploymentConfigFormProps {
    templateName: string;
    onDeploy: (projectName: string, platform: DeploymentPlatform, isPrivate?: boolean) => void;
    onCancel: () => void;
}

const platforms = [
    {
        id: 'github' as DeploymentPlatform,
        name: 'GitHub Pages',
        icon: Github,
        description: 'Free static hosting',
        recommended: true,
        color: 'text-white'
    },
    {
        id: 'vercel' as DeploymentPlatform,
        name: 'Vercel',
        icon: Rocket,
        description: 'Edge network deployment',
        recommended: false,
        color: 'text-white'
    },
    {
        id: 'firebase' as DeploymentPlatform,
        name: 'Firebase',
        icon: Flame,
        description: 'Google Cloud hosting',
        recommended: false,
        color: 'text-orange-500'
    },
    {
        id: 'huggingface' as DeploymentPlatform,
        name: 'HuggingFace',
        icon: Box,
        description: 'ML-powered hosting',
        recommended: false,
        color: 'text-yellow-500'
    },
    {
        id: 'syncstack' as DeploymentPlatform,
        name: 'SyncStack',
        icon: Rocket,
        description: 'Native OpenDev Cloud',
        recommended: true,
        color: 'text-emerald-500'
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
            }, 500);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-zinc-950 border border-zinc-900 p-8 space-y-6">
            {/* Header */}
            <div className="border-b border-zinc-900 pb-4">
                <h3 className="text-lg font-bold text-white mb-1">Deploy Configuration</h3>
                <p className="text-xs text-zinc-600 uppercase tracking-widest">{templateName}</p>
            </div>

            {/* Project Name */}
            <div className="space-y-3">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] block">
                    Project Name
                </label>
                <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full bg-black border border-zinc-800 h-12 px-4 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all"
                    required
                    autoFocus
                />
                <p className="text-[10px] text-zinc-600">
                    Live URL: <code className="text-emerald-500 font-mono">{getPreviewURL()}</code>
                </p>
            </div>

            {/* Platform Selection */}
            <div className="space-y-3">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] block">
                    Deployment Platform
                </label>
                <div className="grid grid-cols-2 gap-3">
                    {platforms.map((platform) => {
                        const Icon = platform.icon;
                        const isSelected = selectedPlatform === platform.id;

                        return (
                            <button
                                key={platform.id}
                                type="button"
                                onClick={() => setSelectedPlatform(platform.id)}
                                className={`
                                    relative p-4 border transition-all text-left
                                    ${isSelected
                                        ? 'border-emerald-500 bg-emerald-500/5'
                                        : 'border-zinc-800 hover:border-zinc-700'
                                    }
                                `}
                            >
                                {platform.recommended && (
                                    <span className="absolute top-2 right-2 px-2 py-0.5 bg-emerald-500 text-black text-[8px] font-bold uppercase tracking-widest">
                                        Recommended
                                    </span>
                                )}
                                <div className="flex items-start gap-3">
                                    <Icon size={20} className={platform.color} />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-sm font-bold text-white">{platform.name}</h4>
                                            {isSelected && <Check size={16} className="text-emerald-500" />}
                                        </div>
                                        <p className="text-[10px] text-zinc-600 mt-1">{platform.description}</p>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Privacy Option */}
            <div className="flex items-center gap-3 p-4 bg-black border border-zinc-900">
                <input
                    type="checkbox"
                    id="private-repo"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                    className="w-4 h-4 bg-zinc-900 border-zinc-800"
                />
                <label htmlFor="private-repo" className="text-xs text-zinc-500 cursor-pointer">
                    Make repository private
                </label>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-900">
                <button
                    type="button"
                    onClick={onCancel}
                    className="h-10 px-6 border border-zinc-800 text-xs font-bold text-zinc-500 uppercase tracking-widest hover:text-white hover:border-zinc-700 transition-all disabled:opacity-50"
                    disabled={isDeploying}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="h-10 px-8 bg-emerald-500 text-black text-xs font-bold uppercase tracking-widest hover:bg-emerald-400 transition-all disabled:bg-zinc-800 disabled:text-zinc-600 flex items-center gap-2"
                    disabled={isDeploying}
                >
                    {isDeploying ? (
                        <>
                            <AnimatedLoaderIcon size={14} className="text-black" />
                            Deploying...
                        </>
                    ) : (
                        <>
                            Deploy to {platforms.find(p => p.id === selectedPlatform)?.name}
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};
