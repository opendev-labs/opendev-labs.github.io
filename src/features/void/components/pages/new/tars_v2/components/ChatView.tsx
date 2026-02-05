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
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-[#0A0A0A] relative">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6">
        {messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
        {isThinking && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
          <ChatMessage message={{ id: Date.now(), role: 'sub0', content: 'Thinking...' }} />
        )}
      </div>
      <div className="px-4 md:px-6 lg:px-8 pb-4 bg-gradient-to-t from-[#0A0A0A] to-transparent">
        {!isThinking && suggestions && suggestions.length > 0 && (
          <SuggestedPromptsView suggestions={suggestions} onSendMessage={onSendMessage} />
        )}
        <PromptInput
          onSendMessage={onSendMessage}
          disabled={isThinking}
          selectedModelId={selectedModelId}
          onModelChange={onModelChange}
        />
      </div>
    </div>
  );
}