import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  OpendevLabsLogo, NewChatIcon, ChatsIcon, SettingsIcon, 
  GithubIcon, TrashIcon,
  DatabaseIcon, ZapIcon,
  PlusIcon
} from './icons/Icons';
import type { View, ChatSession } from '../types';

interface SidebarProps {
  onNavigate: (view: View) => void;
  recentChats: ChatSession[];
  onSelectChat: (chatId: string) => void;
  onDeleteSession: (chatId: string) => void;
  activeView: View;
  activeChatId: string | null;
  onToggle: () => void;
}

export function Sidebar({ onNavigate, recentChats, onSelectChat, onDeleteSession, activeView, activeChatId, onToggle }: SidebarProps) {
  const navItems = [
    { id: 'all-chats' as View, label: 'Archives', icon: ChatsIcon },
    { id: 'storage' as View, label: 'Memory', icon: DatabaseIcon },
    { id: 'deploy' as View, label: 'Void', icon: ZapIcon },
    { id: 'settings' as View, label: 'Core', icon: SettingsIcon },
  ];

  return (
    <aside className="w-[280px] bg-[#050505] border-r border-zinc-900/80 flex flex-col h-full shadow-2xl transition-all duration-500 overflow-hidden z-40">
      {/* 🏙️ LOGO & HEADER */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.1)]">
             <div className="w-3 h-3 bg-black rounded-full" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white tracking-widest uppercase font-mono">OpenStudio</span>
            <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.2em]">Sovereign // v2.0</span>
          </div>
        </div>
      </div>

      <div className="px-4 mb-8">
        <button
          onClick={() => onNavigate('new-chat')}
          className="w-full h-12 flex items-center justify-center gap-3 bg-white text-black rounded-2xl font-bold text-[11px] uppercase tracking-widest hover:bg-zinc-200 transition-all shadow-[0_4px_20px_rgba(255,255,255,0.1)]"
        >
          <PlusIcon className="w-4 h-4" />
          Start New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">
        {/* MAIN NAVIGATION */}
        <div className="space-y-1 mb-10">
          <div className="px-3 mb-3 text-[9px] font-bold text-zinc-600 uppercase tracking-[0.3em]">Environment</div>
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full group flex items-center gap-4 px-4 py-3 transition-all duration-300 rounded-xl ${
                  isActive 
                    ? 'bg-zinc-900 text-white shadow-lg' 
                    : 'text-zinc-500 hover:text-white hover:bg-zinc-950'
                }`}
              >
                <item.icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-zinc-600 group-hover:text-zinc-400'}`} />
                <span className="text-[11px] font-bold uppercase tracking-widest">{item.label}</span>
                {isActive && (
                  <motion.div 
                    layoutId="active-nav-dot"
                    className="ml-auto w-1 h-1 bg-white rounded-full"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* RECENT CHATS */}
        <div className="space-y-1">
          <div className="px-3 mb-3 text-[9px] font-bold text-zinc-600 uppercase tracking-[0.3em]">Recent Node Streams</div>
          <div className="space-y-1">
            {recentChats.map((chat) => (
              <div
                key={chat.id}
                className="group relative"
              >
                <button
                  onClick={() => onSelectChat(chat.id)}
                  className={`w-full flex flex-col items-start gap-1 px-4 py-3 transition-all duration-300 rounded-xl text-left ${
                    activeChatId === chat.id 
                      ? 'bg-zinc-900 text-white' 
                      : 'text-zinc-500 hover:text-white hover:bg-zinc-950'
                  }`}
                >
                  <span className="text-[11px] font-medium truncate w-full">{chat.title || 'Materializing...'}</span>
                  <span className="text-[8px] text-zinc-600 font-mono uppercase">Node: {chat.id.substring(0, 8)}</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSession(chat.id);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-500 transition-all"
                >
                  <TrashIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="p-6 border-t border-zinc-900/50 flex items-center justify-between">
         <div className="flex items-center gap-3">
           <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-500">
             JS
           </div>
           <div className="flex flex-col">
              <span className="text-[10px] font-bold text-white uppercase tracking-tighter">Guest Architect</span>
              <span className="text-[8px] text-zinc-600 font-mono">READY // ONLINE</span>
           </div>
         </div>
         <a 
          href="https://github.com/opendev-labs" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-zinc-600 hover:text-white transition-colors"
        >
          <GithubIcon className="h-4 w-4" />
        </a>
      </div>
    </aside>
  );
}
