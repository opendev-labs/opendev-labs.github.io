import React, { useState, useMemo } from 'react';
import type { ChatSession, View } from '../types';
import { NewChatIcon, SearchIcon, TrashIcon } from './icons/Icons';

// Helper function to format time since a timestamp
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
        <div className="h-full overflow-y-auto bg-black text-white selection:bg-white selection:text-black">
            <div className="max-w-4xl mx-auto p-12">
                <header className="flex items-center justify-between mb-16">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 text-[9px] font-bold text-zinc-500 mb-6 uppercase tracking-[0.3em]">
                            Archives // Neural Repository
                        </div>
                        <h1 className="text-6xl font-bold tracking-tighter lowercase leading-none">
                            node<br /><span className="text-zinc-600">archives.</span>
                        </h1>
                    </div>
                    <button
                        onClick={() => onNavigate('new-chat')}
                        className="flex items-center gap-3 px-6 py-3 text-[10px] font-bold uppercase tracking-widest bg-white text-black hover:bg-orange-500 hover:text-white transition-all duration-300 rounded-none shadow-2xl"
                    >
                        <NewChatIcon className="h-4 w-4" />
                        Materialize Node
                    </button>
                </header>

                <div className="relative mb-12">
                    <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                    <input
                        type="text"
                        placeholder="Search archives by project name or purpose..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-900 rounded-none pl-14 pr-6 py-4 text-[11px] font-mono text-zinc-300 placeholder-zinc-800 focus:outline-none focus:border-zinc-700 transition-colors"
                    />
                </div>

                <div className="space-y-4">
                    {filteredSessions.length > 0 ? (
                        filteredSessions.map(session => (
                            <div key={session.id} className="group relative">
                                <button
                                    onClick={() => onSelectChat(session.id)}
                                    className="w-full text-left p-8 bg-zinc-950/50 border border-zinc-900 rounded-none hover:border-zinc-700 transition-all duration-300 flex items-center justify-between"
                                >
                                    <div>
                                        <div className="flex items-center gap-4 mb-2">
                                            <div className="w-1.5 h-1.5 rounded-none bg-zinc-800 group-hover:bg-orange-500 transition-colors" />
                                            <h2 className="text-[12px] font-bold text-white uppercase tracking-widest truncate">{session.title}</h2>
                                        </div>
                                        <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.2em] mt-1 ml-5">
                                            Handshake: {timeAgo(session.lastUpdated)}
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
                                    className="absolute right-8 top-1/2 -translate-y-1/2 p-3 rounded-none text-zinc-700 opacity-0 group-hover:opacity-100 hover:bg-zinc-900 hover:text-red-500 transition-all border border-zinc-900"
                                    aria-label={`Delete chat ${session.title}`}
                                >
                                    <TrashIcon className="h-4 w-4" />
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-24 px-8 border border-dashed border-zinc-900 rounded-none">
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-500">Node records void</h3>
                            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-700 mt-4 leading-relaxed max-w-xs mx-auto">
                                {searchTerm ? 'The requested identifier does not exist in the current neural history.' : 'Initialize your first node to populate the system archives.'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}