import React, { useState, useMemo, useEffect, useRef } from 'react';
import { SUPPORTED_MODELS } from '../constants';
import type { ModelConfig } from '../types';
import { KeyIcon } from './icons/Icons';

interface ModelSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLButtonElement>;
  selectedModelId: string;
  apiKeys: Record<string, string>;
  onModelChange: (modelId: string) => void;
  onApiKeySave: (provider: string, key: string) => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({ isOpen, onClose, anchorRef, selectedModelId, apiKeys, onModelChange, onApiKeySave }) => {
  const popoverRef = useRef<HTMLDivElement>(null);
  const selectedModel = useMemo(() => SUPPORTED_MODELS.find(m => m.id === selectedModelId) || SUPPORTED_MODELS[0], [selectedModelId]);
  const [currentApiKey, setCurrentApiKey] = useState(apiKeys[selectedModel.provider] || '');

  const hasEnvKey = useMemo(() => {
    switch (selectedModel.provider) {
      case 'Google': return !!import.meta.env.VITE_GEMINI_API_KEY;
      case 'OpenRouter': return !!import.meta.env.VITE_OPENROUTER_API_KEY;
      case 'OpenAI': return !!import.meta.env.VITE_OPENAI_API_KEY;
      case 'DeepSeek': return !!import.meta.env.VITE_DEEPSEEK_API_KEY;
      default: return false;
    }
  }, [selectedModel]);

  useEffect(() => {
    setCurrentApiKey(apiKeys[selectedModel.provider] || '');
  }, [selectedModel, apiKeys]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, anchorRef]);

  if (!isOpen) {
    return null;
  }

  const handleSaveKey = () => {
    onApiKeySave(selectedModel.provider, currentApiKey);
  };

  const popoverStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '120%', // Position above the anchor
    left: '0',
    zIndex: 50
  };

  return (
    <div
      ref={popoverRef}
      style={popoverStyle}
      className="w-80 bg-[#1C1C1C] border border-neutral-700 rounded-lg shadow-2xl p-4 text-white animate-fadeIn"
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="model-select" className="block text-xs font-medium text-gray-400 mb-1">
            Model
          </label>
          <select
            id="model-select"
            value={selectedModelId}
            onChange={(e) => onModelChange(e.target.value)}
            className="w-full bg-neutral-800 border border-neutral-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            {SUPPORTED_MODELS.map(model => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="api-key-input" className="block text-xs font-medium text-gray-400 mb-1">
            {selectedModel.provider} API Key
          </label>
          <div className="relative">
            <KeyIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              id="api-key-input"
              type="password"
              placeholder={`Enter your ${selectedModel.provider} API key...`}
              value={currentApiKey}
              onChange={(e) => setCurrentApiKey(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-600 rounded-md pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
        </div>

        <button
          onClick={handleSaveKey}
          className="w-full bg-white/10 text-white font-semibold py-2 rounded-md hover:bg-white/20 transition-colors text-sm"
        >
          {hasEnvKey ? 'Override Env Key' : 'Save Key'}
        </button>

        {hasEnvKey && !currentApiKey && (
          <div className="pt-2">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-md p-2 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Environment Linked</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
