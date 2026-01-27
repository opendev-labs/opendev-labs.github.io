import React from 'react';
import type { Deployment } from '../../types';
import { StatusIndicator } from '../common/Indicators';
import { LinkIcon } from '../common/Icons';

const DeploymentRow: React.FC<{ deployment: Deployment, isLatest: boolean }> = ({ deployment, isLatest }) => {
    return (
        <div className={`grid grid-cols-12 gap-4 items-center p-3 rounded-md transition-colors ${isLatest ? 'bg-void-line/50' : ''}`}>
            <div className="col-span-6 flex items-center">
                <StatusIndicator status={deployment.status} />
                <div className="ml-4">
                    <p className="text-white font-medium truncate">{deployment.commit}</p>
                    <p className="text-zinc-400 text-xs">{deployment.branch}</p>
                </div>
            </div>
            <div className="col-span-3 text-zinc-400 text-sm">{new Date(deployment.timestamp).toLocaleString()}</div>
            <div className="col-span-3 text-right">
                <a href={deployment.url} target="_blank" rel="noopener noreferrer" className="text-void-neon hover:text-white text-sm font-medium inline-flex items-center gap-1">
                    Visit <LinkIcon />
                </a>
            </div>
        </div>
    );
};

export const DeploymentsTab: React.FC<{ deployments: Deployment[] }> = ({ deployments }) => {
    return (
        <div className="bg-void-card border border-void-line rounded-lg">
            <div className="p-6 border-b border-void-line">
                <h3 className="font-semibold text-white text-xl">Deployment History</h3>
            </div>
            <div className="p-2 space-y-1">
                {deployments.map((dep, index) => (
                    <DeploymentRow key={dep.id} deployment={dep} isLatest={index === 0} />
                ))}
            </div>
        </div>
    );
};
