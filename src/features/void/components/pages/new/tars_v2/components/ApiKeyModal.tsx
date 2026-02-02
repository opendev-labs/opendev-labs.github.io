import React, { useState, useEffect } from 'react';
import type { ModelConfig } from '../types';
import { KeyIcon, CloseIcon, SpinnerIcon } from './icons/Icons';
import { validateApiKey } from '../services/llmService';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  model: ModelConfig | null;
  apiKeys: Record<string, string>;
  onApiKeySave: (provider: string, key: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, model, apiKeys, onApiKeySave }) => {
    const [apiKey, setApiKey] = useState('');
    const [isValidating, setIsValidating] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);

    useEffect(() => {
        if (model) {
            setApiKey(apiKeys[model.provider] || '');
            setValidationError(null); // Reset error when modal opens or model changes
        }
    }, [isOpen, model, apiKeys]);
    
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);


    const handleSave = async () => {
        if (!model) return;
        setIsValidating(true);
        setValidationError(null);
        try {
            await validateApiKey(model.provider, apiKey);
            onApiKeySave(model.provider, apiKey);
            onClose();
        } catch (error) {
            setValidationError(error instanceof Error ? error.message : "An unknown error occurred.");
        } finally {
            setIsValidating(false);
        }
    };

    if (!isOpen || !model) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" aria-modal="true" role="dialog" onClick={onClose}>
            <div className="bg-[#1C1C1C] border border-neutral-700 rounded-lg shadow-2xl w-full max-w-md p-6 m-4 text-white animate-fadeIn" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">API Key for {model.provider}</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10" disabled={isValidating}>
                        <CloseIcon className="w-5 h-5" />
                    </button>
                </div>
                <p className="text-sm text-gray-400 mb-4">
                    Please provide an API key to use {model.name}. Your key will be stored locally in your browser.
                </p>
                <div className="relative mb-2">
                    <KeyIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                        id="api-key-input"
                        type="password"
                        placeholder={`Enter your ${model.provider} API key...`}
                        value={apiKey}
                        onChange={(e) => {
                            setApiKey(e.target.value);
                            if (validationError) setValidationError(null); // Clear error on type
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && !isValidating && handleSave()}
                        className="w-full bg-neutral-800 border border-neutral-600 rounded-md pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                        autoFocus
                        disabled={isValidating}
                    />
                </div>
                
                {validationError && (
                    <p className="text-sm text-red-400 px-1">{validationError}</p>
                )}

                <div className="flex justify-end gap-3 mt-4">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md hover:bg-white/10 transition-colors disabled:opacity-50" disabled={isValidating}>
                        Cancel
                    </button>
                    <button onClick={handleSave} className="px-4 py-2 text-sm font-medium bg-white text-black rounded-md hover:bg-gray-200 transition-colors w-28 flex items-center justify-center disabled:bg-gray-400" disabled={isValidating}>
                        {isValidating ? (
                            <SpinnerIcon className="h-5 w-5 animate-spin" />
                        ) : (
                            'Save Key'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};