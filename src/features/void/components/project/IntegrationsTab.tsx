import React from 'react';
import type { Integration } from '../../types';
import { availableIntegrations } from '../../constants';

const IntegrationCard: React.FC<{ integration: Integration, onToggle: (id: string) => void }> = ({ integration, onToggle }) => {
    return (
        <div className="bg-void-line/50 p-4 rounded-lg border border-void-line flex items-start gap-4">
            <div className="w-10 h-10 bg-white flex items-center justify-center p-1">
                <img src={integration.logoUrl} alt={`${integration.name} logo`} className="w-full h-full object-contain" />
            </div>
            <div className="flex-grow">
                <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-white">{integration.name}</h4>
                    <button 
                        onClick={() => onToggle(integration.id)}
                        className={`text-xs font-semibold px-3 py-1 transition-colors ${
                            integration.isConnected 
                                ? 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                                : 'bg-white text-black hover:bg-zinc-200'
                        }`}
                    >
                        {integration.isConnected ? 'Manage' : 'Connect'}
                    </button>
                </div>
                <p className="text-sm text-zinc-400 mt-1">{integration.description}</p>
            </div>
        </div>
    )
};


export const IntegrationsTab: React.FC<{ integrations: Integration[] }> = ({ integrations }) => {

    // This state would normally be managed at a higher level
    const [connectedIds, setConnectedIds] = React.useState(() => new Set(integrations.filter(i => i.isConnected).map(i => i.id)));
    
    const handleToggleIntegration = (id: string) => {
        setConnectedIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                // In a real app, this might open a management modal or disconnect
                alert(`Managing integration: ${id}`);
            } else {
                newSet.add(id);
                 alert(`Connecting integration: ${id}. This would typically involve an OAuth flow.`);
            }
            return newSet;
        });
    };

    const allIntegrationsWithStatus = availableIntegrations.map(int => ({
        ...int,
        isConnected: connectedIds.has(int.id)
    }));
    
    return (
        <div className="bg-void-card border border-void-line rounded-lg">
            <div className="p-6 border-b border-void-line">
                <h3 className="font-semibold text-white text-xl">Integrations Marketplace</h3>
                <p className="text-zinc-400 text-sm mt-1">Enhance your project with third-party services.</p>
            </div>
            <div className="p-6 space-y-4">
               {allIntegrationsWithStatus.map(int => (
                   <IntegrationCard key={int.id} integration={int} onToggle={handleToggleIntegration} />
               ))}
            </div>
        </div>
    );
};
