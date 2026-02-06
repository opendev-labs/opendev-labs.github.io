
import React from 'react';
import { OpendevLabsLogo, NewChatIcon, ChatsIcon, SettingsIcon, GithubIcon, CloseIcon, ChevronLeftIcon, TrashIcon } from './icons/Icons';
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
  return (
    <aside className="w-64 bg-black border-r border-zinc-900 p-6 flex flex-col justify-between hidden md:flex selection:bg-white selection:text-black">
      <div>
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white rounded-none flex items-center justify-center">
              <div className="w-3 h-3 bg-black" />
            </div>
            <span className="text-xl font-bold tracking-tighter text-white lowercase">sub0.</span>
          </div>
          <button
            onClick={onToggle}
            className="p-1.5 border border-zinc-900 hover:border-zinc-700 transition-colors rounded-none"
            aria-label="Collapse sidebar"
          >
            <ChevronLeftIcon className="h-4 w-4 text-zinc-500" />
          </button>
        </div>

        <button
          onClick={() => onNavigate('new-chat')}
          className="w-full flex items-center justify-center gap-3 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest bg-white text-black hover:bg-orange-500 hover:text-white transition-all duration-300 rounded-none">
          <NewChatIcon className="h-4 w-4" />
          Materialize Node
        </button>

        <nav className="mt-10 space-y-2">
          {[
            { id: 'all-chats' as View, label: 'Neural Archives', icon: ChatsIcon },
            { id: 'settings' as View, label: 'Core Configuration', icon: SettingsIcon },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full text-left flex items-center gap-3 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all border border-transparent ${activeView === item.id ? 'bg-zinc-900 border-zinc-800 text-white' : 'text-zinc-600 hover:text-zinc-300'}`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>

        {recentChats.length > 0 && (
          <div className="mt-12">
            <p className="px-4 text-[9px] font-bold text-zinc-700 uppercase tracking-[0.4em] mb-4">Active Nodes</p>
            <nav className="space-y-1">
              {recentChats.slice(0, 5).map(chat => (
                <div key={chat.id} className="group relative px-2">
                  <button
                    onClick={() => onSelectChat(chat.id)}
                    className={`w-full text-left flex items-center justify-between gap-3 px-3 py-2 text-[11px] font-medium text-zinc-500 truncate transition-all border border-transparent hover:border-zinc-900 ${chat.id === activeChatId ? 'text-white bg-zinc-900/50' : 'hover:bg-zinc-950 hover:text-zinc-300'}`}>
                    <span className="truncate lowercase">{chat.title}</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Are you sure you want to delete "${chat.title}"?`)) {
                        onDeleteSession(chat.id);
                      }
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-zinc-800 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all"
                    aria-label={`Delete chat ${chat.title}`}
                  >
                    <TrashIcon className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </nav>
          </div>
        )}
      </div>

      <div className="pt-6 border-t border-zinc-900">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-4 text-[9px] font-bold text-zinc-700 uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Sovereign</a>
            <a href="#" className="hover:text-white transition-colors">Audit</a>
          </div>
          <a href="#" className="text-zinc-700 hover:text-white transition-colors"><GithubIcon className="h-4 w-4" /></a>
        </div>
      </div>
    </aside>
  );
}
