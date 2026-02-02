import React, { useState, useMemo } from 'react';
import type { ChatSession, TarsView as View } from '../../../../../types';
import { NewChatIcon, SearchIcon, TrashIcon } from './icons/Icons';

function timeAgo(timestamp: number): string {
    const now = Date.now();
    const seconds = Math.floor((now - timestamp) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return "Just now";
}

interface AllChatsViewProps {
    sessions: ChatSession[];
    onSelectChat: (chatId: string) => void;
    onDeleteSession: (chatId: string) => void;
    onNavigate: (view: View) => void;
}

export function AllChatsView({ sessions, onSelectChat, onDeleteSession, onNavigate }: AllChatsViewProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredSessions = useMemo(() => {
        return sessions
            .filter(session => session.title.toLowerCase().includes(searchTerm.toLowerCase()))
            .sort((a, b) => b.lastUpdated - a.lastUpdated);
    }, [sessions, searchTerm]);

    return (
        <div className="h-full overflow-y-auto bg-black text-white">
            <div className="max-w-4xl mx-auto p-8">
                <header className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Chats</h1>
                        <p className="text-gray-400 mt-1">
                            {sessions.length > 0 ? `You have ${sessions.length} conversations.` : 'Start a new conversation.'}
                        </p>
                    </div>
                    <button
                        onClick={() => onNavigate('new-chat')}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-white text-black hover:bg-gray-200 transition-colors"
                    >
                        <NewChatIcon className="h-5 w-5" />
                        Start New Chat
                    </button>
                </header>

                <div className="relative mb-6">
                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search chats..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-11 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20"
                    />
                </div>

                <div className="grid grid-cols-1 gap-3">
                    {filteredSessions.length > 0 ? (
                        filteredSessions.map(session => (
                            <div key={session.id} className="group relative">
                                <button
                                    onClick={() => onSelectChat(session.id)}
                                    className="w-full text-left p-4 bg-neutral-900/40 border border-neutral-800/50 rounded-xl hover:bg-neutral-800 transition-all duration-200 flex items-center justify-between group-hover:border-neutral-700"
                                >
                                    <div>
                                        <h2 className="font-semibold text-white truncate">{session.title}</h2>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Last active: {timeAgo(session.lastUpdated)}
                                        </p>
                                    </div>
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (window.confirm(`Are you sure you want to delete "${session.title}"?`)) {
                                            onDeleteSession(session.id);
                                        }
                                    }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-md text-gray-500 opacity-0 group-hover:opacity-100 bg-neutral-800/50 hover:bg-neutral-700 hover:text-red-500 transition-all"
                                    aria-label={`Delete chat ${session.title}`}
                                >
                                    <TrashIcon className="h-4 w-4" />
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 px-4 border border-dashed border-neutral-800 rounded-2xl">
                            <h3 className="text-lg font-medium text-gray-400">No chats found</h3>
                            <p className="text-neutral-500 mt-2">
                                {searchTerm ? 'Try a different search term or start a new engineering protocol.' : 'Your neural sessions will appear here.'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
