import React, { useRef, useEffect } from 'react';
import type { Message } from '../../../../../types';
import { PromptInput } from './PromptInput';
import { ChatMessage } from './ChatMessage';

interface ChatViewProps {
    messages: Message[];
    isThinking: boolean;
    onSendMessage: (prompt: string) => void;
    suggestions: string[] | undefined;
    selectedModelId: string;
    apiKeys: Record<string, string>;
    onModelChange: (modelId: string) => void;
    onApiKeySave: (provider: string, key: string) => void;
}

export function ChatView({ messages, isThinking, onSendMessage, suggestions, selectedModelId, apiKeys, onModelChange, onApiKeySave }: ChatViewProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="flex flex-col h-full bg-black relative">
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6 scrollbar-hide">
                {messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
                {isThinking && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
                    <ChatMessage message={{ id: Date.now(), role: 'tars', content: 'Thinking...' }} />
                )}
            </div>
            <div className="px-4 md:px-6 lg:px-8 pb-6 bg-gradient-to-t from-black via-black/80 to-transparent">
                <PromptInput
                    onSendMessage={onSendMessage}
                    disabled={isThinking}
                    selectedModelId={selectedModelId}
                    apiKeys={apiKeys}
                    onModelChange={onModelChange}
                    onApiKeySave={onApiKeySave}
                />
            </div>
        </div>
    );
}
