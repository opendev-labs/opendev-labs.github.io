import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Workflow } from '../../../types';
import { mockWorkflows } from '../../../constants';
import { WorkflowCard } from '../WorkflowCard';

export const MeshPage: React.FC<{
    onDeployWorkflow: (workflow: Workflow, projectName: string) => void;
}> = ({ onDeployWorkflow }) => {
    const navigate = useNavigate();

    return (
        <div className="max-w-7xl mx-auto py-10">
            <button onClick={() => navigate('/void/new')} className="group flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-zinc-600 hover:text-white mb-12 transition-all">
                <span className="group-hover:-translate-x-1 transition-transform">&larr;</span>
                Genesis Options
            </button>

            <h2 className="text-3xl font-bold text-white tracking-tighter mb-10">Mesh Architectures</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
                {mockWorkflows.map(workflow => (
                    <WorkflowCard
                        key={workflow.id}
                        workflow={workflow}
                        onDeploy={onDeployWorkflow}
                    />
                ))}
            </div>
        </div>
    );
};
