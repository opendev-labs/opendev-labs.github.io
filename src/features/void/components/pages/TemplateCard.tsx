import React, { useState } from 'react';
import type { Template } from '../../types';
import { ConfigureProjectForm } from '../common/ConfigureProjectForm';
import { motion } from 'framer-motion';

interface TemplateCardProps {
    template: Template;
    onDeploy: (template: Template, projectName: string, createRepo?: boolean, isPrivate?: boolean) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({ template, onDeploy }) => {
    const [isConfiguring, setIsConfiguring] = useState(false);

    const handleLaunch = (projectName: string, createRepo?: boolean, isPrivate?: boolean) => {
        onDeploy(template, projectName, createRepo, isPrivate);
        setIsConfiguring(false);
    };

    return (
        <div className="group relative bg-zinc-950 border border-zinc-900 hover:border-zinc-700 transition-all duration-300 overflow-hidden flex flex-col h-full">
            {/* Template Image/Icon */}
            <div className="relative h-32 w-full bg-black border-b border-zinc-900 flex items-center justify-center overflow-hidden">
                {template.imageUrl ? (
                    <img
                        src={template.imageUrl}
                        alt={template.name}
                        className="h-16 w-auto object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                ) : (
                    <div className="text-4xl opacity-50">{template.category?.charAt(0) || '📦'}</div>
                )}
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-grow">
                {/* Category */}
                {template.category && (
                    <div className="mb-3">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-500">
                            {template.category}
                        </span>
                    </div>
                )}

                {/* Title */}
                <h3 className="text-lg font-bold text-white mb-2 tracking-tight">
                    {template.name}
                </h3>

                {/* Description */}
                <p className="text-xs text-zinc-500 font-medium leading-relaxed mb-4 flex-grow">
                    {template.description}
                </p>

                {/* Deploy Button or Form */}
                {!isConfiguring ? (
                    <button
                        onClick={() => setIsConfiguring(true)}
                        className="w-full h-10 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-zinc-200 transition-all"
                    >
                        Deploy
                    </button>
                ) : (
                    <ConfigureProjectForm
                        defaultName={template.name}
                        onDeploy={handleLaunch}
                        onCancel={() => setIsConfiguring(false)}
                    />
                )}
            </div>
        </div>
    );
};
