import React from 'react';
import { SUGGESTED_PROMPTS } from '../constants';
import { PromptInput } from './PromptInput';

interface WelcomeScreenProps {
    onSendMessage: (prompt: string) => void;
    isThinking: boolean;
    // Model props
    selectedModelId: string;
    apiKeys: Record<string, string>;
    onModelChange: (modelId: string) => void;
    onApiKeySave: (provider: string, key: string) => void;
}

export function WelcomeScreen({ onSendMessage, isThinking, selectedModelId, apiKeys, onModelChange, onApiKeySave }: WelcomeScreenProps) {
    const renderPromptButton = (prompt: string) => (
        <button
            key={prompt}
            onClick={() => onSendMessage(prompt)}
            disabled={isThinking}
            className="bg-[#1C1C1C] border border-white/10 text-gray-400 text-sm px-4 py-2 rounded-full hover:bg-[#2A2A2A] hover:text-gray-200 transition-colors duration-200 disabled:opacity-50"
        >
            {prompt}
        </button>
    );

    return (
        <div className="flex flex-col h-screen w-full">
            <main className="flex-grow flex flex-col items-center justify-center text-center px-4">
                <div className="w-full max-w-3xl">
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-10 tracking-tight">
                        What do you want to build?
                    </h1>
                    
                    <div className="mb-8">
                        <PromptInput 
                            onSendMessage={onSendMessage} 
                            disabled={isThinking}
                            selectedModelId={selectedModelId}
                            apiKeys={apiKeys}
                            onModelChange={onModelChange}
                            onApiKeySave={onApiKeySave}
                        />
                    </div>

                    <div className="flex flex-col items-center gap-3">
                        <div className="flex flex-wrap justify-center gap-3">
                            {SUGGESTED_PROMPTS.slice(0, 4).map(renderPromptButton)}
                        </div>
                        <div className="flex flex-wrap justify-center gap-3">
                            {SUGGESTED_PROMPTS.slice(4, 7).map(renderPromptButton)}
                        </div>
                        <div className="flex flex-wrap justify-center gap-3">
                            {SUGGESTED_PROMPTS.slice(7, 9).map(renderPromptButton)}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}