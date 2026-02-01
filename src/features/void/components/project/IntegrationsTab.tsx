import React from 'react';
import type { Integration } from '../../types';
import { availableIntegrations } from '../../constants';

const IntegrationCard: React.FC<{ integration: Integration, onToggle: (id: string) => void }> = ({ integration, onToggle }) => {
    return (
        <div className="border border-zinc-900 bg-black p-8 flex flex-col sm:flex-row items-start sm:items-center gap-8 group hover:bg-zinc-950/50 transition-all">
            <div className="w-16 h-16 bg-white border border-zinc-900 flex items-center justify-center p-3 shrink-0">
                <img src={integration.logoUrl} alt={`${integration.name} logo`} className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500" />
            </div>
            <div className="flex-grow space-y-2">
                <div className="flex justify-between items-center">
                    <h4 className="text-[13px] font-bold text-white tracking-tight">{integration.name}</h4>
                    <button
                        onClick={() => onToggle(integration.id)}
                        className={`h-10 px-6 text-[10px] font-bold uppercase tracking-widest transition-all ${integration.isConnected
                            ? 'border border-zinc-800 text-zinc-500 hover:border-white hover:text-white'
                            : 'bg-white text-black hover:bg-zinc-200'
                            }`}
                    >
                        {integration.isConnected ? 'Configure' : 'Initialize'}
                    </button>
                </div>
                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-relaxed max-w-xl">{integration.description}</p>
            </div>
        </div>
    )
};


export const IntegrationsTab: React.FC<{ integrations: Integration[] }> = ({ integrations }) => {

    const [connectedIds, setConnectedIds] = React.useState(() => new Set(integrations.filter(i => i.isConnected).map(i => i.id)));

    const handleToggleIntegration = (id: string) => {
        setConnectedIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                alert(`Managing integration protocol: ${id}`);
            } else {
                newSet.add(id);
                alert(`Initializing bridge with ${id}. Awaiting authentication sequence.`);
            }
            return newSet;
        });
    };

    const allIntegrationsWithStatus = availableIntegrations
        .filter(int => int.category !== 'Database')
        .map(int => ({
            ...int,
            isConnected: connectedIds.has(int.id)
        }));

    return (
        <div className="border border-zinc-900 bg-black overflow-hidden">
            <div className="px-8 py-10 border-b border-zinc-900 bg-zinc-950/50">
                <h3 className="text-xl font-bold text-white tracking-tighter mb-2">Network Links</h3>
                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">External protocol bridge.</p>
            </div>
            <div className="divide-y divide-zinc-900">
                {allIntegrationsWithStatus.map(int => (
                    <IntegrationCard key={int.id} integration={int} onToggle={handleToggleIntegration} />
                ))}
            </div>
        </div>
    );
};

