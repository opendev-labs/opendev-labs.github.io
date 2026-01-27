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
        <div className="bg-void-card rounded-lg border border-void-line p-5 group transition-all duration-300 flex flex-col text-left h-full">
            {/* Header with Logo and Name */}
            <div className="flex items-start gap-3 mb-3">
                {template.logoUrl && (
                    <div className="w-10 h-10 bg-void-line flex items-center justify-center p-1.5 border border-zinc-700 shrink-0">
                        <img src={template.logoUrl} alt={`${template.framework} logo`} className="w-full h-full object-contain" />
                    </div>
                )}
                <div>
                    <h3 className="font-semibold text-white leading-tight">{template.name}</h3>
                    <p className="text-xs text-zinc-500">{template.framework}</p>
                </div>
            </div>

            {/* Description (will grow) */}
            <div className="flex-grow mb-4">
                <p className="text-sm text-zinc-400">{template.description}</p>
            </div>

            {/* Action Button/Form at the bottom */}
            <div className="mt-auto pt-4 border-t border-void-line">
                {!isConfiguring ? (
                    <button
                        onClick={() => setIsConfiguring(true)}
                        className="w-full text-sm bg-white text-black font-semibold px-4 py-2 hover:bg-zinc-200 transition-colors"
                    >
                        Deploy
                    </button>
                ) : (
                    <ConfigureProjectForm
                        defaultName={template.name.replace(/boilerplate|starter/i, 'app').trim()}
                        onDeploy={(projectName, createRepo, isPrivate) => {
                            onDeploy(template, projectName, createRepo, isPrivate);
                            setIsConfiguring(false);
                        }}
                        onCancel={() => setIsConfiguring(false)}
                        showRepoOptions={true}
                    />
                )}
            </div>
        </div>
    );
};
