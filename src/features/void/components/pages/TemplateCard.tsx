import React, { useState } from 'react';
import type { Template } from '../../types';
import { DeploymentConfigForm, DeploymentPlatform } from './DeploymentConfigForm';
import { motion } from 'framer-motion';

interface TemplateCardProps {
    template: Template;
    onDeploy: (template: Template, projectName: string, platform: DeploymentPlatform, isPrivate?: boolean) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({ template, onDeploy }) => {
    const [isConfiguring, setIsConfiguring] = useState(false);

    const handleLaunch = (projectName: string, platform: DeploymentPlatform, isPrivate?: boolean) => {
        onDeploy(template, projectName, platform, isPrivate);
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

                {/* Action Buttons */}
                {!isConfiguring ? (
                    <div className="grid grid-cols-2 gap-2 mt-auto">
                        <button
                            onClick={() => setIsConfiguring(true)}
                            className="h-10 bg-white text-black text-[10px] font-bold uppercase tracking-wider hover:bg-zinc-200 transition-all"
                        >
                            Deploy
                        </button>
                        <button
                            onClick={() => template.previewUrl && window.open(template.previewUrl, '_blank')}
                            disabled={!template.previewUrl}
                            className="h-10 border border-zinc-800 text-white text-[10px] font-bold uppercase tracking-wider hover:bg-zinc-900 transition-all flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            Preview
                        </button>
                    </div>
                ) : (
                    <div className="mt-auto">
                        <DeploymentConfigForm
                            templateName={template.name}
                            onDeploy={handleLaunch}
                            onCancel={() => setIsConfiguring(false)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
