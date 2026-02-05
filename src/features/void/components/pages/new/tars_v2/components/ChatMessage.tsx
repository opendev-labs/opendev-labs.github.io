import React from 'react';
import type { Message } from '../types';
import { UserIcon, Sub0Icon, SpinnerIcon } from './icons/Icons';
import { GenerationStatusView } from './GenerationStatusView';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { role, content, generationInfo } = message;
  const isUser = role === 'user';

  const isSub0Generating = role === 'sub0' && generationInfo?.status === 'generating';
  // "Thinking" phase is when generation has started, but no conversational content or file list has arrived yet.
  const isThinkingPhase = isSub0Generating && generationInfo?.files.length === 0 && !content;


  return (
    <div className={`flex items-start gap-4 w-full max-w-4xl mx-auto ${isUser ? 'flex-row-reverse' : ''} mb-8`}>
      <div className={`flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center ${isUser ? 'bg-white/10' : 'bg-black border border-white/5 shadow-2xl'}`}>
        {isUser ? <UserIcon className="h-6 w-6 text-white" /> : <Sub0Icon className="h-6 w-6 text-orange-500" />}
      </div>

      <div className={`flex flex-col w-full ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`px-5 py-4 rounded-2xl max-w-2xl ${isUser ? 'bg-zinc-900/50 border border-white/5 text-gray-100 rounded-tr-none shadow-xl backdrop-blur-md' : 'bg-transparent text-gray-200 border-none'}`}>
          {isThinkingPhase ? (
            <div className="flex items-center gap-3 py-2">
              <SpinnerIcon className="h-5 w-5 animate-spin text-orange-500" />
              <p className="text-sm font-bold tracking-widest text-zinc-500 uppercase">Neural Handshake in Progress...</p>
            </div>
          ) : (
            <p className="whitespace-pre-wrap text-[15px] leading-relaxed font-medium">{content}</p>
          )}
          {message.generationInfo && message.generationInfo.files.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/5">
              <GenerationStatusView info={message.generationInfo} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};