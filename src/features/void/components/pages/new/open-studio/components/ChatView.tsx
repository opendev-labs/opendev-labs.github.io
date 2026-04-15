import React, { useRef, useEffect } from 'react';
import type { Message } from '../types';
import { PromptInput } from './PromptInput';
import { ChatMessage } from './ChatMessage';
import { SuggestedPromptsView } from './SuggestedPromptsView';

interface ChatViewProps {
  messages: Message[];
  isThinking: boolean;
  onSendMessage: (prompt: string) => void;
  suggestions: string[] | undefined;
  // Model props
  selectedModelId: string;
  onModelChange: (modelId: string) => void;
}

export function ChatView({ messages, isThinking, onSendMessage, suggestions, selectedModelId, onModelChange }: ChatViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  return (
    <div className="flex flex-col h-full bg-[#0C0C0C] relative">
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 pt-2 pb-8 space-y-4 custom-scrollbar scroll-smooth">
        {messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
        {isThinking && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
           <div className="animate-pulse flex items-center gap-3 px-8 text-zinc-600">
             <div className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
             <span className="text-[12px] font-medium lowercase">Nexus is thinking...</span>
           </div>
        )}
        <div className="h-32" /> {/* Space for floating input */}
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className="max-w-5xl mx-auto">
          {!isThinking && suggestions && suggestions.length > 0 && (
            <div className="px-8 pb-2">
               <SuggestedPromptsView suggestions={suggestions} onSendMessage={onSendMessage} />
            </div>
          )}
          <PromptInput
            onSendMessage={onSendMessage}
            disabled={isThinking}
            selectedModelId={selectedModelId}
            onModelChange={onModelChange}
          />
        </div>
      </div>
    </div>
  );
}