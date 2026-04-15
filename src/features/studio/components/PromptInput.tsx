import React, { useState, useRef, useEffect } from 'react';
import { ArrowUpIcon, ImageIcon, GridIcon, BrainCircuitIcon, PlusIcon, StarIcon } from './icons/Icons';
import { ModelDropdown } from './ModelDropdown';
import { SUPPORTED_MODELS } from '../constants';

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
    <div className="w-full px-8 pb-8 pt-4">
      <form onSubmit={handleSubmit} className="w-full relative group">
        <div className="bg-[#1A1A1A] border border-zinc-900 rounded-2xl flex items-center gap-2 p-1.5 transition-all duration-300 focus-within:border-zinc-700 shadow-xl">
          <div className="flex items-center pl-2 pr-1">
             <button
               type="button"
               className="text-zinc-600 hover:text-white transition-all p-1.5 rounded-lg"
               title="Upload Image"
             >
               <ImageIcon className="h-4 w-4" />
             </button>
             <button
               type="button"
               className="text-zinc-600 hover:text-white transition-all p-1.5 rounded-lg"
               title="Star"
             >
               <StarIcon className="h-4 w-4" />
             </button>
          </div>

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
            placeholder="Ask a follow up question..."
            className="flex-1 bg-transparent text-white text-[14px] placeholder-zinc-600 resize-none focus:outline-none font-normal py-2.5 px-1 min-h-[40px] max-h-[200px] scrollbar-hide selection:bg-white/10"
            rows={1}
            disabled={disabled}
          />
          
          <div className="flex items-center gap-2 pr-1">
            <div className="relative">
              <button
                ref={modelSelectorButtonRef}
                type="button"
                className="flex items-center gap-1.5 text-zinc-500 hover:text-white transition-colors text-[11px] font-bold px-3 py-1 bg-black/50 border border-zinc-900 rounded-lg hover:border-zinc-700"
                aria-label="Select model"
                onClick={() => setIsModelDropdownOpen(prev => !prev)}
              >
                <span>{currentModel?.name || 'GPT-5'}</span>
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
              </button>
              <ModelDropdown
                isOpen={isModelDropdownOpen}
                onClose={() => setIsModelDropdownOpen(false)}
                anchorRef={modelSelectorButtonRef}
                selectedModelId={selectedModelId}
                onModelSelect={handleModelSelect}
              />
            </div>

            <button
              type="submit"
              disabled={disabled || !hasContent}
              className={`h-8 w-8 flex items-center justify-center transition-all duration-300 rounded-lg ${
                hasContent 
                  ? 'bg-zinc-800 text-white hover:bg-zinc-700' 
                  : 'bg-transparent text-zinc-700'
              }`}
              aria-label="Send message"
            >
              <ArrowUpIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}