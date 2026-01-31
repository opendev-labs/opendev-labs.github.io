import React, { useState } from 'react';
import type { Template } from '../../types';
import { ConfigureProjectForm } from '../common/ConfigureProjectForm';

interface TemplateCardProps {
    template: Template;
    onDeploy: (template: Template, projectName: string, createRepo?: boolean, isPrivate?: boolean) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({ template, onDeploy }) => {
    const [isConfiguring, setIsConfiguring] = useState(false);

    return (
        <div className="bg-black border border-zinc-900 overflow-hidden transition-all duration-500 hover:border-zinc-700 flex flex-col text-left h-full group">
            {/* Preview Image */}
            <div className="aspect-video w-full bg-zinc-950 border-b border-zinc-900 overflow-hidden relative">
                {template.imageUrl ? (
                    <img src={template.imageUrl} alt={template.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-800">
                        <span className="text-[10px] font-bold uppercase tracking-widest">No Preview</span>
                    </div>
                )}
                {/* Framework Badge on Image */}
                <div className="absolute top-4 left-4 flex items-center gap-2 px-2 py-1 bg-black/80 backdrop-blur-md border border-zinc-800 rounded">
                    {template.logoUrl && <img src={template.logoUrl} className="w-3 h-3 grayscale invert brightness-200" alt="" />}
                    <span className="text-[9px] font-bold text-white uppercase tracking-widest">{template.framework}</span>
                </div>
            </div>

            <div className="p-8 flex flex-col flex-grow">
                {/* Header with Name */}
                <div className="mb-6">
                    <h3 className="font-bold text-white tracking-tighter leading-tight text-lg group-hover:text-emerald-500 transition-colors uppercase">{template.name}</h3>
                </div>

                {/* Description (will grow) */}
                <div className="flex-grow mb-8">
                    <p className="text-sm text-zinc-500 font-medium leading-relaxed">{template.description}</p>
                </div>

                {/* Action Button/Form at the bottom */}
                <div className="mt-auto pt-6 border-t border-zinc-900">
                    {!isConfiguring ? (
                        <button
                            onClick={() => setIsConfiguring(true)}
                            className="w-full h-10 text-[11px] bg-white text-black font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all rounded-md"
                        >
                            Initialize
                        </button>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-bottom-2">
                            <ConfigureProjectForm
                                defaultName={template.name.replace(/boilerplate|starter/i, 'node').replace(/ /g, '-').toLowerCase()}
                                onDeploy={(projectName, createRepo, isPrivate) => {
                                    onDeploy(template, projectName, createRepo, isPrivate);
                                    setIsConfiguring(false);
                                }}
                                onCancel={() => setIsConfiguring(false)}
                                showRepoOptions={true}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
