import React, { useEffect, useRef } from 'react';
import { SUPPORTED_MODELS } from '../../../../../constants';
import type { ModelConfig } from '../../../../../types';

const groupedModels = SUPPORTED_MODELS.reduce((acc, model) => {
    const provider = model.provider;
    if (!acc[provider]) {
        acc[provider] = [];
    }
    acc[provider].push(model);
    return acc;
}, {} as Record<string, ModelConfig[]>);

const providerOrder: ModelConfig['provider'][] = ['Google', 'OpenAI', 'Anthropic', 'OpenRouter', 'DeepSeek', 'Meta', 'Mistral AI', 'BigCode', 'WizardLM', 'OpenChat', 'Phind', 'Replit'];
const sortedProviderKeys = providerOrder.filter(p => groupedModels[p]);

interface ModelDropdownProps {
    isOpen: boolean;
    onClose: () => void;
    anchorRef: React.RefObject<HTMLButtonElement | null>;
    selectedModelId: string;
    onModelSelect: (modelId: string) => void;
}

export const ModelDropdown: React.FC<ModelDropdownProps> = ({ isOpen, onClose, anchorRef, selectedModelId, onModelSelect }) => {
    const popoverRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isOpen && popoverRef.current && !popoverRef.current.contains(event.target as Node) && anchorRef.current && !anchorRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose, anchorRef]);

    if (!isOpen) return null;

    const popoverStyle: React.CSSProperties = {
        position: 'absolute',
        top: 'calc(100% + 8px)',
        left: '0',
        zIndex: 50,
        width: '320px',
    };

    return (
        <div ref={popoverRef} style={popoverStyle} className="bg-[#1C1C1C] border border-neutral-700 rounded-lg shadow-2xl text-white animate-fadeIn max-h-80 overflow-y-auto">
            <div className="p-2">
                {sortedProviderKeys.map(provider => (
                    <div key={provider}>
                        <h3 className="px-2 pt-2 pb-1 text-xs font-semibold text-gray-400">{provider}</h3>
                        <ul className="space-y-1">
                            {groupedModels[provider].map(model => (
                                <li key={model.id}>
                                    <button
                                        onClick={() => onModelSelect(model.id)}
                                        className={`w-full text-left px-2 py-1.5 text-sm rounded-md transition-colors ${selectedModelId === model.id ? 'bg-white/10' : 'hover:bg-white/5'}`}
                                    >
                                        {model.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};
