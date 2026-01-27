
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
            <div className="w-6 h-6 bg-white/10 flex items-center justify-center p-1 border border-zinc-700 shrink-0">
                <img src={component.logoUrl} alt={`${component.name} logo`} className="w-full h-full object-contain" />
            </div>
        );
    }
    return <FrameworkIcon framework={component.name} size="small" />;
};

export const WorkflowCard: React.FC<WorkflowCardProps> = ({ workflow, onDeploy }) => {
  const [isConfiguring, setIsConfiguring] = useState(false);

  return (
    <div className="bg-void-card rounded-lg border border-void-line p-5 group transition-all duration-300 flex flex-col text-left h-full">
        {/* Header with Name and Component Icons */}
        <div className="mb-3">
            <div className="flex items-center gap-2">
                {workflow.components.map((comp, index) => (
                    <React.Fragment key={index}>
                        <ComponentIcon component={comp} />
                        {index < workflow.components.length - 1 && <span className="text-zinc-500 text-lg">+</span>}
                    </React.Fragment>
                ))}
            </div>
            <h3 className="font-semibold text-white leading-tight mt-3">{workflow.name}</h3>
        </div>

        {/* Description (will grow) */}
        <div className="flex-grow mb-4">
             <p className="text-sm text-zinc-400">{workflow.description}</p>
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
                    defaultName={workflow.name.replace(/ /g, '-').toLowerCase()}
                    onDeploy={(projectName) => {
                        onDeploy(workflow, projectName);
                        setIsConfiguring(false);
                    }}
                    onCancel={() => setIsConfiguring(false)}
                />
            )}
        </div>
    </div>
  );
};
