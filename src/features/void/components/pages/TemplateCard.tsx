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
        <div className="bg-black border border-zinc-900 p-8 transition-all duration-500 hover:bg-zinc-950 flex flex-col text-left h-full">
            {/* Header with Logo and Name */}
            <div className="flex items-start gap-4 mb-6">
                {template.logoUrl && (
                    <div className="w-12 h-12 bg-zinc-950 flex items-center justify-center p-2.5 border border-zinc-900 shrink-0 rounded-lg">
                        <img src={template.logoUrl} alt={`${template.framework} logo`} className="w-full h-full object-contain filter grayscale invert brightness-200" />
                    </div>
                )}
                <div>
                    <h3 className="font-bold text-white tracking-tighter leading-tight text-lg">{template.name}</h3>
                    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mt-1">{template.framework}</p>
                </div>
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
    );
};
