import React from 'react';
import type { Message } from '../types';
import { UserIcon, NexusIcon, SpinnerIcon } from './icons/Icons';
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
    <div className={`flex flex-col gap-6 w-full max-w-5xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500`}>
      <div className={`flex gap-6 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* AVATAR */}
        <div className={`flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-xl border transition-all duration-300 ${
          isUser 
            ? 'bg-white border-white text-black' 
            : 'bg-zinc-900 border-zinc-800 text-white'
        }`}>
          {isUser ? <UserIcon className="h-5 w-5" /> : <NexusIcon className="h-5 w-5" />}
        </div>

        {/* CONTENT AREA */}
        <div className={`flex-1 min-w-0 flex flex-col gap-3 ${isUser ? 'items-end' : 'items-start'}`}>
          <div className="flex items-center gap-2 px-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600 font-mono">
              {isUser ? 'Architect' : 'OpenStudio'}
            </span>
            <div className="w-1 h-1 rounded-full bg-zinc-800" />
            <span className="text-[9px] text-zinc-700 font-mono uppercase">
               {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <div className={`w-full p-6 transition-all duration-500 ${
            isUser 
              ? 'text-zinc-300' 
              : 'bg-[#0A0A0A]/50 backdrop-blur-sm border border-zinc-900/50 text-zinc-100 rounded-2xl shadow-sm'
          }`}>
            {isThinkingPhase ? (
              <div className="flex items-center gap-3 py-1">
                <SpinnerIcon className="h-3.5 w-3.5 animate-spin text-zinc-500" />
                <p className="text-[10px] font-bold tracking-[0.2em] text-zinc-600 uppercase font-mono">Synthesizing Response...</p>
              </div>
            ) : (
              <div className="text-[15px] leading-relaxed font-normal selection:bg-white/10 whitespace-pre-wrap">
                {content.trim().startsWith('{') && content.trim().endsWith('}') ? (
                  <div className="bg-red-500/5 border border-red-500/10 p-5 rounded-xl font-mono text-xs overflow-x-auto">
                    <div className="flex items-center gap-2 mb-3 text-red-500/80 font-bold uppercase tracking-widest text-[9px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                      Runtime Protocol Error
                    </div>
                    <pre className="whitespace-pre-wrap text-zinc-500">
                      {(() => {
                        try { return JSON.stringify(JSON.parse(content), null, 2); } catch (e) { return content; }
                      })()}
                    </pre>
                  </div>
                ) : (
                  content
                )}
              </div>
            )}

            {message.generationInfo && message.generationInfo.files.length > 0 && (
              <div className="mt-8 pt-6 border-t border-zinc-900/50">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-1 rounded-full bg-blue-500" />
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-600 font-mono">Materialized Modules</span>
                </div>
                <div className="bg-black/20 rounded-xl border border-zinc-900/30 overflow-hidden">
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