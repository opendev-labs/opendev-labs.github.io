import React, { useState } from 'react';
import type { Workflow } from '../../types';
import { ConfigureProjectForm } from '../common/ConfigureProjectForm';
import { FrameworkIcon } from '../common/Indicators';

interface WorkflowCardProps {
    workflow: Workflow;
    onDeploy: (workflow: Workflow, projectName: string) => void;
}

const ComponentIcon: React.FC<{ component: Workflow['components'][0] }> = ({ component }) => {
    if (component.logoUrl) {
        return (
            <div className="w-7 h-7 bg-zinc-950 flex items-center justify-center p-1.5 border border-zinc-900 shrink-0 rounded-md">
                <img src={component.logoUrl} alt={`${component.name} logo`} className="w-full h-full object-contain filter grayscale invert brightness-200" />
            </div>
        );
    }
    return <FrameworkIcon framework={component.name} size="small" />;
};

export const WorkflowCard: React.FC<WorkflowCardProps> = ({ workflow, onDeploy }) => {
    const [isConfiguring, setIsConfiguring] = useState(false);

    return (
        <div className="bg-black border border-zinc-900 p-8 transition-all duration-500 hover:bg-zinc-950 flex flex-col text-left h-full">
            {/* Header with Name and Component Icons */}
            <div className="mb-6">
                <div className="flex items-center gap-2">
                    {workflow.components.map((comp, index) => (
                        <React.Fragment key={index}>
                            <ComponentIcon component={comp} />
                            {index < workflow.components.length - 1 && <span className="text-zinc-700 text-lg font-bold">+</span>}
                        </React.Fragment>
                    ))}
                </div>
                <h3 className="font-bold text-white tracking-tighter leading-tight mt-6 text-lg">{workflow.name}</h3>
            </div>

            {/* Description (will grow) */}
            <div className="flex-grow mb-8">
                <p className="text-sm text-zinc-500 font-medium leading-relaxed">{workflow.description}</p>
            </div>

            {/* Action Button/Form at the bottom */}
            <div className="mt-auto pt-6 border-t border-zinc-900">
                {!isConfiguring ? (
                    <button
                        onClick={() => setIsConfiguring(true)}
                        className="w-full h-10 text-[11px] bg-white text-black font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all rounded-md"
                    >
                        Deploy Workflow
                    </button>
                ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-2">
                        <ConfigureProjectForm
                            defaultName={workflow.name.replace(/ /g, '-').toLowerCase()}
                            onDeploy={(projectName) => {
                                onDeploy(workflow, projectName);
                                setIsConfiguring(false);
                            }}
                            onCancel={() => setIsConfiguring(false)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
