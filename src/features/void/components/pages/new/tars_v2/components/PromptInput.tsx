import React, { useState, useRef, useEffect } from 'react';
import { ArrowUpIcon, StarIcon, ImageIcon, GridIcon, BrainCircuitIcon } from './icons/Icons';
import { ModelDropdown } from './ModelDropdown';
import { ApiKeyModal } from './ApiKeyModal';
import { SUPPORTED_MODELS } from '../constants';
import type { ModelConfig } from '../types';

interface PromptInputProps {
  onSendMessage: (prompt: string) => void;
  disabled: boolean;
  selectedModelId: string;
  apiKeys: Record<string, string>;
  onModelChange: (modelId: string) => void;
  onApiKeySave: (provider: string, key: string) => void;
}

export function PromptInput({ onSendMessage, disabled, selectedModelId, apiKeys, onModelChange, onApiKeySave }: PromptInputProps) {
  const [prompt, setPrompt] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const modelSelectorButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; // Reset height before calculating
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [prompt]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !disabled) {
      onSendMessage(prompt);
      setPrompt('');
    }
  };
  
  const handleModelSelect = (modelId: string) => {
    onModelChange(modelId);
    setIsModelDropdownOpen(false);
    setIsApiKeyModalOpen(true);
  };

  const hasContent = prompt.trim().length > 0;
  const currentModel = SUPPORTED_MODELS.find(m => m.id === selectedModelId);

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto relative">
      <div className="bg-[#212121] border border-white/10 rounded-2xl px-4 py-2 flex flex-col justify-between transition-shadow focus-within:ring-1 focus-within:ring-white/20">
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          placeholder="Create a pricing page..."
          className="w-full bg-transparent text-gray-200 text-base placeholder-gray-500 resize-none focus:outline-none"
          rows={1}
          disabled={disabled}
          style={{ maxHeight: '200px' }}
        />
        <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1 text-gray-500">
                <button type="button" className="hover:text-white transition-colors p-1" aria-label="Add image">
                    <ImageIcon className="h-5 w-5"/>
                </button>
                <button type="button" className="hover:text-white transition-colors p-1" aria-label="Surprise me">
                    <StarIcon className="h-5 w-5"/>
                </button>
                <button type="button" className="hover:text-white transition-colors p-1" aria-label="Use template">
                    <GridIcon className="h-5 w-5"/>
                </button>
                <div className="h-5 border-l border-white/20 mx-2"></div>
                <div className="relative">
                     <button 
                        ref={modelSelectorButtonRef}
                        type="button" 
                        className="flex items-center gap-2 hover:text-white transition-colors text-xs px-2 py-1 rounded-md hover:bg-white/10" 
                        aria-label="Select model"
                        onClick={() => setIsModelDropdownOpen(prev => !prev)}
                    >
                        <BrainCircuitIcon className="h-4 w-4"/>
                        <span className="truncate max-w-[120px]">{currentModel?.name || 'Select Model'}</span>
                    </button>
                    <ModelDropdown
                        isOpen={isModelDropdownOpen}
                        onClose={() => setIsModelDropdownOpen(false)}
                        anchorRef={modelSelectorButtonRef}
                        selectedModelId={selectedModelId}
                        onModelSelect={handleModelSelect}
                    />
                </div>
            </div>
            <button
              type="submit"
              disabled={disabled || !hasContent}
              className={`h-8 w-8 rounded-full flex items-center justify-center transition-all disabled:cursor-not-allowed ${hasContent ? 'bg-neutral-600 hover:bg-neutral-500' : 'bg-neutral-800'}`}
              aria-label="Send message"
            >
              <ArrowUpIcon className={`h-5 w-5 transition-colors ${hasContent ? 'text-white' : 'text-neutral-500'}`} />
            </button>
        </div>
      </div>
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        model={currentModel || null}
        apiKeys={apiKeys}
        onApiKeySave={onApiKeySave}
      />
    </form>
  );
}