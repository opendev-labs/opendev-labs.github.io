import React from 'react';
import type { Message } from '../types';
import { UserIcon, NexusIcon, SpinnerIcon, GridIcon } from './icons/Icons';
import { GenerationStatusView } from './GenerationStatusView';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { role, content, generationInfo } = message;
  const isUser = role === 'user';

  const isStudioGenerating = role === 'open-studio' && generationInfo?.status === 'generating';
  const isThinkingPhase = isStudioGenerating && generationInfo?.files.length === 0 && !content;

  return (
    <div className="flex flex-col gap-4 w-full max-w-5xl mx-auto mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 px-4">
      <div className={`flex gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* AVATAR/ICON */}
        <div className="flex-shrink-0 pt-1">
          {isUser ? (
            <div className="h-7 w-7 rounded-sm border border-zinc-800 bg-[#E6E6E6] flex items-center justify-center text-black">
              <UserIcon className="h-4 w-4" />
            </div>
          ) : (
             <div className="h-7 w-7 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center">
                   <NexusIcon className="h-3.5 w-3.5 text-white" />
                </div>
             </div>
          )}
        </div>

        {/* CONTENT AREA */}
        <div className={`flex-1 min-w-0 flex flex-col gap-2 ${isUser ? 'items-end ml-12' : 'items-start mr-12'}`}>
          <div className={`max-w-full px-5 py-3.5 transition-all duration-500 ${
            isUser 
              ? 'bg-[#212121] text-[#E6E6E6] rounded-3xl' 
              : 'text-[#E6E6E6] font-normal leading-7'
          }`}>
            {isThinkingPhase ? (
              <div className="flex items-center gap-3 py-1">
                <SpinnerIcon className="h-3.5 w-3.5 animate-spin text-zinc-500" />
                <p className="text-[14px] text-zinc-500 lowercase">Analyzing protocol...</p>
              </div>
            ) : (
              <div className="text-[14px] leading-7 font-normal selection:bg-white/10 whitespace-pre-wrap">
                {content}
              </div>
            )}
          </div>

          {message.generationInfo && message.generationInfo.status !== 'generating' && (
            <div className="w-full mt-4 max-w-sm">
              <div className="bg-[#1A1A1A] border border-zinc-900 rounded-xl overflow-hidden shadow-2xl">
                 <div className="px-4 py-2 border-b border-zinc-900 flex items-center justify-between bg-zinc-900/10">
                    <div className="flex items-center gap-2">
                       <GridIcon className="w-3.5 h-3.5 text-pink-500" />
                       <span className="text-[12px] font-medium text-white">Version 1 <span className="text-zinc-500 ml-1">• current</span></span>
                    </div>
                 </div>
                 <div className="p-4">
                    <GenerationStatusView info={message.generationInfo} />
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};