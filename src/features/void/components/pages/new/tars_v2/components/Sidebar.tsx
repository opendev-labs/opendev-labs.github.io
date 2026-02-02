
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
    <aside className="w-64 bg-black border-r border-neutral-800 p-4 flex-col justify-between hidden md:flex">
      <div>
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-2">
              <OpendevLabsLogo className="h-7 w-7 text-white" />
              <span className="text-lg font-semibold text-white">opendev-labs</span>
          </div>
          <button 
                onClick={onToggle}
                className="p-1 rounded-md hover:bg-white/10"
                aria-label="Collapse sidebar"
            >
                <ChevronLeftIcon className="h-5 w-5 text-gray-400" />
            </button>
        </div>
        
        <button 
          onClick={() => onNavigate('new-chat')}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
          <NewChatIcon className="h-5 w-5" />
          Start new chat
        </button>

        <nav className="mt-6 space-y-1">
          <button 
            onClick={() => onNavigate('all-chats')} 
            className={`w-full text-left flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors text-gray-300 ${activeView === 'all-chats' ? 'bg-white/5' : 'hover:bg-white/5'}`}
          >
            <ChatsIcon className="h-5 w-5" />
            Chats
          </button>
          <button 
            onClick={() => onNavigate('settings')} 
            className={`w-full text-left flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors text-gray-300 ${activeView === 'settings' ? 'bg-white/5' : 'hover:bg-white/5'}`}
          >
            <SettingsIcon className="h-5 w-5" />
            Settings
          </button>
        </nav>
        
        {recentChats.length > 0 && (
          <div className="mt-8">
              <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Recents</p>
              <nav className="mt-2 space-y-1">
                  {recentChats.slice(0, 5).map(chat => (
                    <div key={chat.id} className="group relative">
                      <button 
                        onClick={() => onSelectChat(chat.id)}
                        className={`w-full text-left flex items-center justify-between gap-3 pr-8 px-3 py-2 text-sm font-medium rounded-md text-white truncate transition-colors ${chat.id === activeChatId ? 'bg-white/10' : 'hover:bg-white/5'}`}>
                          <span className="truncate">{chat.title}</span>
                      </button>
                      <button
                          onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm(`Are you sure you want to delete "${chat.title}"?`)) {
                                  onDeleteSession(chat.id);
                              }
                          }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-gray-500 opacity-0 group-hover:opacity-100 hover:bg-white/10 hover:text-red-500 transition-all"
                          aria-label={`Delete chat ${chat.title}`}
                      >
                          <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
              </nav>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between px-2 text-xs text-gray-500">
            <div className="flex items-center gap-4">
                <a href="#" className="hover:text-white">Privacy</a>
                <a href="#" className="hover:text-white">Terms</a>
            </div>
            <a href="#" className="hover:text-white"><GithubIcon className="h-5 w-5" /></a>
        </div>
      </div>
    </aside>
  );
}
