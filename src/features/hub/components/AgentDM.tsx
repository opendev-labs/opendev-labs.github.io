import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartbeatAgent, DirectMessage } from '../types';
import { cn } from '../../../lib/utils';

interface AgentDMProps {
  agent: HeartbeatAgent;
  messages: DirectMessage[];
  currentUserId: string;
  onSendMessage: (content: string) => void;
  onWakeAgent: () => void;
}

export function AgentDM({ agent, messages, currentUserId, onSendMessage, onWakeAgent }: AgentDMProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (!inputValue.trim()) return;
    onSendMessage(inputValue);
    setInputValue('');
  };

  return (
    <div className="flex flex-col h-full bg-[#080808] border-l border-zinc-900 overflow-hidden">
      {/* AGENT HEADER (PROTOCOL STATUS) */}
      <div className="p-6 border-b border-zinc-900 bg-[#050505] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center overflow-hidden">
              {agent.avatarUrl ? (
                <img src={agent.avatarUrl} alt={agent.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-bold text-zinc-600">AI</span>
              )}
            </div>
            <motion.div 
              animate={{ 
                scale: agent.status === 'awake' ? [1, 1.2, 1] : 1,
                opacity: agent.status === 'sleeping' ? 0.3 : 1
              }}
              transition={{ repeat: Infinity, duration: 2 }}
              className={cn(
                "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#050505]",
                agent.status === 'awake' ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" :
                agent.status === 'thinking' ? "bg-yellow-500 animate-pulse" : "bg-zinc-700"
              )} 
            />
          </div>
          <div>
            <h3 className="text-[13px] font-bold text-white tracking-tight">@{agent.name.toLowerCase()}</h3>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                {agent.status === 'sleeping' ? 'Low-Power Node' : 'Active Heartbeat'}
              </span>
              {agent.status === 'sleeping' && (
                <button 
                  onClick={onWakeAgent}
                  className="text-[9px] px-2 py-0.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-md hover:bg-emerald-500/20 transition-all font-bold uppercase tracking-tighter"
                >
                  Wake Node
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="hidden sm:flex flex-col items-end">
          <span className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest mb-1">Nexus TZ</span>
          <span className="text-[10px] font-mono text-zinc-500">{agent.timezone}</span>
        </div>
      </div>

      {/* DM THREAD - HUMAN-CENTRIC CONVERSATION */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        <AnimatePresence initial={false}>
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-30">
              <div className="w-px h-12 bg-gradient-to-b from-transparent via-zinc-800 to-transparent mb-4" />
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-600">Protocol Initialized</p>
            </div>
          ) : (
            messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={cn(
                  "flex flex-col max-w-[85%]",
                  msg.senderId === currentUserId ? "ml-auto items-end" : "items-start"
                )}
              >
                <div className={cn(
                  "px-4 py-3 rounded-2xl text-[12px] leading-relaxed shadow-sm",
                  msg.senderId === currentUserId 
                    ? "bg-white text-black rounded-tr-none font-medium" 
                    : "bg-zinc-900 text-zinc-300 border border-zinc-800 rounded-tl-none"
                )}>
                  {msg.content}
                </div>
                <div className="mt-2 flex items-center gap-2 px-1">
                  <span className="text-[9px] font-bold text-zinc-700 uppercase tracking-tighter">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {msg.senderId === currentUserId && (
                    <div className="flex gap-0.5">
                      <div className="w-1 h-1 rounded-full bg-emerald-500/50" />
                      <div className="w-1 h-1 rounded-full bg-emerald-500/50" />
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* INPUT - DM-STYLE HANDSHAKE */}
      <div className="p-6 border-t border-zinc-900 bg-[#050505]">
        <div className="relative group">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={`Message ${agent.name}...`}
            className="w-full bg-[#080808] border border-zinc-900 focus:border-zinc-700 rounded-2xl px-5 py-4 text-[12px] text-white transition-all focus:outline-none resize-none min-h-[56px] pr-16 custom-scrollbar"
            rows={1}
          />
          <button 
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-white text-black rounded-xl hover:bg-zinc-200 disabled:opacity-30 disabled:hover:bg-white transition-all shadow-lg"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={cn(
              "text-[9px] font-bold uppercase tracking-widest",
              agent.status === 'thinking' ? "text-yellow-500 animate-pulse" : "text-zinc-700"
            )}>
              {agent.status === 'thinking' ? 'Agent Processing...' : 'Direct Connection Established'}
            </span>
          </div>
          <p className="text-[9px] text-zinc-800 font-bold uppercase tracking-tighter">
            Shift + Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
