import React, { useState, useRef, useEffect } from 'react';
import { ArrowUpIcon, StarIcon, ImageIcon, GridIcon, BrainCircuitIcon } from './icons/Icons';
import { ModelDropdown } from './ModelDropdown';
import { SUPPORTED_MODELS } from '../constants';
import type { ModelConfig } from '../types';

interface PromptInputProps {
  onSendMessage: (prompt: string) => void;
  disabled: boolean;
  selectedModelId: string;
  onModelChange: (modelId: string) => void;
}

export function PromptInput({ onSendMessage, disabled, selectedModelId, onModelChange }: PromptInputProps) {
  const [prompt, setPrompt] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
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
  };

  const hasContent = prompt.trim().length > 0;
  const currentModel = SUPPORTED_MODELS.find(m => m.id === selectedModelId);

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto relative group">
      <div className="bg-zinc-950 border border-zinc-900 rounded-none px-6 py-4 flex flex-col justify-between transition-all duration-300 focus-within:border-orange-500/50 shadow-2xl">
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
          placeholder="What shall we materialize today?"
          className="w-full bg-transparent text-zinc-200 text-base placeholder-zinc-700 resize-none focus:outline-none font-medium mb-4"
          rows={1}
          disabled={disabled}
          style={{ maxHeight: '200px' }}
        />
        <div className="flex items-center justify-between border-t border-zinc-900 pt-4">
          <div className="flex items-center gap-2 text-zinc-600">
            {[
              { icon: ImageIcon, label: 'Visual Context' },
              { icon: StarIcon, label: 'Materialize' },
              { icon: GridIcon, label: 'Node Templates' }
            ].map((action, i) => (
              <button
                key={i}
                type="button"
                className="hover:text-white transition-colors p-1.5 hover:bg-zinc-900"
                aria-label={action.label}
                title={action.label}
              >
                <action.icon className="h-4 w-4" />
              </button>
            ))}

            <div className="h-4 border-l border-zinc-900 mx-1"></div>

            <div className="relative">
              <button
                ref={modelSelectorButtonRef}
                type="button"
                className="flex items-center gap-2 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 hover:bg-zinc-900"
                aria-label="Select model"
                onClick={() => setIsModelDropdownOpen(prev => !prev)}
              >
                <BrainCircuitIcon className="h-4 w-4 text-orange-500" />
                <span className="truncate max-w-[120px]">{currentModel?.name || 'Select Node'}</span>
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
            className={`h-9 w-9 flex items-center justify-center transition-all duration-300 rounded-none ${hasContent ? 'bg-white text-black hover:bg-orange-500 hover:text-white' : 'bg-zinc-900 text-zinc-700 cursor-not-allowed'}`}
            aria-label="Send message"
          >
            <ArrowUpIcon className={`h-5 w-5 transition-colors`} />
          </button>
        </div>
      </div>
    </form>
  );
}