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
    <div className={`flex items-start gap-6 w-full max-w-5xl mx-auto ${isUser ? 'flex-row-reverse' : ''} mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500`}>
      <div className={`flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-none border ${isUser ? 'bg-white border-white text-black' : 'bg-black border-zinc-900 shadow-2xl'}`}>
        {isUser ? <UserIcon className="h-5 w-5" /> : <Sub0Icon className="h-5 w-5 text-orange-500" />}
      </div>

      <div className={`flex flex-col w-full ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`w-full max-w-3xl ${isUser ? 'text-right' : 'text-left'}`}>
          <div className="flex items-center gap-2 mb-2 opacity-30">
            <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-500">
              {isUser ? 'Materializer // User' : 'Architect // sub0'}
            </span>
          </div>

          <div className={`px-0 py-2 ${isUser ? 'text-zinc-200' : 'text-white'}`}>
            {isThinkingPhase ? (
              <div className="flex items-center gap-4 py-4 bg-zinc-950/50 border border-zinc-900 px-6">
                <SpinnerIcon className="h-4 w-4 animate-spin text-orange-500" />
                <p className="text-[10px] font-bold tracking-[0.4em] text-zinc-500 uppercase">Synchronizing Neural Mesh...</p>
              </div>
            ) : (
              <div className={`text-[15px] leading-relaxed font-medium ${isUser ? 'bg-zinc-900/30 p-6 border border-zinc-800' : ''}`}>
                {content}
              </div>
            )}

            {message.generationInfo && message.generationInfo.files.length > 0 && (
              <div className="mt-8">
                <div className="flex items-center gap-2 mb-4 opacity-50">
                  <div className="w-1.5 h-1.5 rounded-none bg-emerald-500" />
                  <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-500">Nodes Materializing</span>
                </div>
                <div className="bg-zinc-950 border border-zinc-900 p-6">
                  <GenerationStatusView info={message.generationInfo} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};