import React from 'react';
import type { Deployment } from '../../types';
import { StatusIndicator } from '../common/Indicators';
import { LinkIcon } from '../common/Icons';

const DeploymentRow: React.FC<{ deployment: Deployment, isLatest: boolean }> = ({ deployment, isLatest }) => {
    return (
        <div className={`grid grid-cols-12 gap-6 items-center p-6 border-b border-zinc-900 last:border-0 hover:bg-zinc-950/50 transition-all ${isLatest ? 'bg-zinc-950/30' : ''}`}>
            <div className="col-span-6 flex items-center gap-6">
                <StatusIndicator status={deployment.status} />
                <div className="min-w-0">
                    <p className="text-[13px] font-bold text-white truncate tracking-tight">{deployment.commit}</p>
                    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mt-1">{deployment.branch}</p>
                </div>
            </div>
            <div className="col-span-3 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{new Date(deployment.timestamp).toLocaleDateString()}</div>
            <div className="col-span-3 text-right">
                <a
                    href={deployment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest hover:text-white transition-colors inline-flex items-center gap-2"
                >
                    Inspect <LinkIcon className="w-3 h-3" />
                </a>
            </div>
        </div>
    );
};

export const DeploymentsTab: React.FC<{ deployments: Deployment[] }> = ({ deployments }) => {
    return (
        <div className="border border-zinc-900 bg-black overflow-hidden">
            <div className="px-8 py-5 border-b border-zinc-900 bg-zinc-950/50">
                <h3 className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">Node Registry</h3>
            </div>
            <div className="divide-y divide-zinc-900">
                {deployments.map((dep, index) => (
                    <DeploymentRow key={dep.id} deployment={dep} isLatest={index === 0} />
                ))}
            </div>
        </div>
    );
};

