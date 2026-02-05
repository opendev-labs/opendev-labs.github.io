import React from 'react';
import type { Message } from '../../../../../types';
import { UserIcon, TarsIcon, SpinnerIcon } from './icons/Icons';
import { GenerationStatusView } from './GenerationStatusView';

interface ChatMessageProps {
    message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
    const { role, content, generationInfo } = message;
    const isUser = role === 'user';

    const isSub0Generating = role === 'sub0' && generationInfo?.status === 'generating';
    const isThinkingPhase = isSub0Generating && generationInfo?.files.length === 0 && !content;

    return (
        <div className={`flex items-start gap-4 w-full max-w-4xl mx-auto ${isUser ? 'flex-row-reverse' : ''}`}>
            <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${isUser ? 'bg-white/10' : 'bg-neutral-900 border border-white/10'}`}>
                {isUser ? <UserIcon className="h-5 w-5 text-white" /> : <TarsIcon className="h-5 w-5 text-gray-300" />}
            </div>

            <div className={`flex flex-col w-full ${isUser ? 'items-end' : 'items-start'}`}>
                <div className={`px-4 py-3 rounded-2xl max-w-2xl ${isUser ? 'bg-[#1C1C1C] text-gray-100 rounded-br-none' : 'bg-[#121212] text-gray-200 border border-white/5 rounded-bl-none'}`}>
                    {isThinkingPhase ? (
                        <div className="flex items-center gap-2">
                            <SpinnerIcon className="h-5 w-5 animate-spin text-gray-400" />
                            <p className="text-gray-300">Thinking...</p>
                        </div>
                    ) : (
                        <p className="whitespace-pre-wrap text-base leading-relaxed">{content}</p>
                    )}
                    {message.generationInfo && message.generationInfo.files.length > 0 && <GenerationStatusView info={message.generationInfo} />}
                </div>
            </div>
        </div>
    );
};
