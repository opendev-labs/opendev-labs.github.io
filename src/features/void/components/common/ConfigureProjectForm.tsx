import React, { useState } from 'react';
import { AnimatedLoaderIcon } from './AnimatedLoaderIcon';

interface ConfigureProjectFormProps {
    defaultName: string;
    onDeploy: (projectName: string, createRepo?: boolean, isPrivate?: boolean) => void;
    onCancel: () => void;
    showRepoOptions?: boolean;
}

export const ConfigureProjectForm: React.FC<ConfigureProjectFormProps> = ({ defaultName, onDeploy, onCancel, showRepoOptions = false }) => {
    const [projectName, setProjectName] = useState(defaultName);
    const [createRepo, setCreateRepo] = useState(false);
    const [isPrivate, setIsPrivate] = useState(false);
    const [isDeploying, setIsDeploying] = useState(false);

    const urlFriendlyName = projectName.toLowerCase().replace(/[^a-z0-9-]/g, '-');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (projectName.trim() && !isDeploying) {
            setIsDeploying(true);
            setTimeout(() => {
                onDeploy(projectName.trim(), createRepo, isPrivate);
            }, 1000);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="border border-zinc-900 bg-black p-8 space-y-8 selection:bg-white selection:text-black">
            <div className="space-y-4">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] block">Project Identifier</label>
                <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-900 h-12 px-4 text-xs font-bold text-white placeholder:text-zinc-800 focus:outline-none focus:border-white transition-all uppercase tracking-widest"
                    required
                    autoFocus
                />
                <p className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest leading-loose">
                    This project will be initialized at <code className="text-white italic">{urlFriendlyName}.opendev.app</code>
                </p>
            </div>

            <div className="flex justify-end gap-4">
                <button type="button" onClick={onCancel} className="h-10 border border-zinc-900 text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-8 hover:border-white hover:text-white transition-all disabled:opacity-20" disabled={isDeploying}>
                    Abort
                </button>
                <button type="submit" className="h-10 bg-white text-black text-[10px] font-bold uppercase tracking-widest px-8 hover:bg-zinc-200 transition-all disabled:bg-zinc-800 disabled:text-zinc-500" disabled={isDeploying}>
                    {isDeploying ? <AnimatedLoaderIcon size={16} className="text-black" /> : 'Launch'}
                </button>
            </div>

            <div className="mt-8 pt-8 border-t border-zinc-900 space-y-5">
                <label className="flex items-center gap-4 cursor-pointer group">
                    <input
                        type="checkbox"
                        checked={createRepo}
                        onChange={(e) => setCreateRepo(e.target.checked)}
                        className="form-checkbox h-4 w-4 bg-black border border-zinc-900 rounded-none checked:bg-white checked:border-white focus:ring-0 focus:ring-offset-0 transition-all"
                    />
                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest group-hover:text-white transition-colors">Synchronize Nexus Repository</span>
                </label>

                {createRepo && (
                    <label className="flex items-center gap-4 cursor-pointer group pl-8">
                        <input
                            type="checkbox"
                            checked={isPrivate}
                            onChange={(e) => setIsPrivate(e.target.checked)}
                            className="form-checkbox h-4 w-4 bg-black border border-zinc-900 rounded-none checked:bg-white checked:border-white focus:ring-0 focus:ring-offset-0 transition-all"
                        />
                        <span className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest group-hover:text-zinc-400 transition-colors">Encrypted Fragment Protocol</span>
                    </label>
                )}
            </div>
        </form>
    );
};
