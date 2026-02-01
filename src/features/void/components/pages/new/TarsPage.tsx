import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles, Send, Terminal, Box, Layers, Play,
    History, Plus, MessageSquare, MoreVertical,
    Trash2, Search, Cpu, Globe, Zap, Settings,
    Layout, Code, CheckCircle2, AlertCircle, Rocket,
    Download, ExternalLink, X, ChevronRight, Monitor,
    Laptop, Tablet, Smartphone, Maximize2, Minimize2,
    RefreshCw, Share2
} from 'lucide-react';
import { streamChatResponse } from '../../../services/llmService';
import type { Message } from '../../../types';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface ChatSession {
    id: string;
    title: string;
    timestamp: number;
    messages: Message[];
}

export const TarsPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [currentSessionId, setCurrentSessionId] = useState<string>(Date.now().toString());
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [constructedFiles, setConstructedFiles] = useState<{ path: string, content: string }[]>([]);
    const [activeFileIndex, setActiveFileIndex] = useState(0);
    const [showSidebar, setShowSidebar] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleNewChat = () => {
        const newSessionId = Date.now().toString();
        setCurrentSessionId(newSessionId);
        setMessages([]);
        setConstructedFiles([]);
    };

    const syncToLocal = async (files: { path: string, content: string }[]) => {
        setIsSyncing(true);
        try {
            const response = await fetch('http://localhost:8080/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ files })
            });
            if (response.ok) {
                setLastSyncTime(new Date().toLocaleTimeString());
            }
        } catch (error) {
            console.warn("Local agent sync failed. Is SyncStack Desktop running?");
        } finally {
            setIsSyncing(false);
        }
    };

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim() || isGenerating) return;

        const currentPrompt = prompt;
        setPrompt('');
        setIsGenerating(true);

        const userMessage: Message = { id: Date.now(), role: 'user', content: currentPrompt };
        setMessages(prev => [...prev, userMessage]);

        try {
            let fullResponse = '';
            const generator = streamChatResponse(
                currentPrompt,
                messages,
                [],
                'openrouter/anthropic/claude-3.5-sonnet',
                undefined
            );

            const tarsMessageId = Date.now() + 1;
            setMessages(prev => [...prev, { id: tarsMessageId, role: 'tars', content: '' }]);

            for await (const chunk of generator) {
                fullResponse += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    const tarsMsg = newMessages.find(m => m.id === tarsMessageId);
                    if (tarsMsg) tarsMsg.content = fullResponse;
                    return newMessages;
                });
            }

            // Sync to sessions
            const updatedSessions = [...sessions];
            const existingIdx = updatedSessions.findIndex(s => s.id === currentSessionId);
            if (existingIdx >= 0) {
                updatedSessions[existingIdx].messages = [...messages, userMessage, { id: tarsMessageId, role: 'tars', content: fullResponse }];
            } else {
                updatedSessions.unshift({
                    id: currentSessionId,
                    title: currentPrompt.slice(0, 30) + (currentPrompt.length > 30 ? '...' : ''),
                    timestamp: Date.now(),
                    messages: [userMessage, { id: tarsMessageId, role: 'tars', content: fullResponse }]
                });
            }
            setSessions(updatedSessions);

            // Extract files and intent analysis
            try {
                const jsonMatch = fullResponse.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const parsed = JSON.parse(jsonMatch[0]);

                    if (parsed.intent_analysis || parsed.conversation || parsed.commands) {
                        setMessages(prev => {
                            const newMessages = [...prev];
                            const tarsMsg = newMessages.find(m => m.id === tarsMessageId);
                            if (tarsMsg) {
                                tarsMsg.intentAnalysis = parsed.intent_analysis;
                                tarsMsg.content = parsed.conversation || fullResponse;
                                tarsMsg.commands = parsed.commands;
                            }
                            return newMessages;
                        });
                    }

                    if (parsed.files) {
                        setConstructedFiles(parsed.files);
                        // Bi-directional Tunnel Trigger
                        syncToLocal(parsed.files);
                    }
                }
            } catch (e) { }

        } catch (error) {
            console.error("TARS Generation Error:", error);
            setMessages(prev => [...prev, { id: Date.now(), role: 'tars', content: "Neural handshake failed. Error: " + (error instanceof Error ? error.message : "Unknown error") }]);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="h-screen w-screen bg-black text-white flex flex-col overflow-hidden font-sans selection:bg-white selection:text-black">
            {/* Minimalist Geist Header */}
            <header className="h-14 border-b border-zinc-900 bg-black/50 backdrop-blur-xl flex items-center justify-between px-6 shrink-0 z-50">
                <div className="flex items-center gap-6">
                    <button onClick={() => navigate('/office')} className="flex items-center gap-3 group transition-opacity hover:opacity-80">
                        <div className="w-8 h-8 bg-white text-black flex items-center justify-center rounded-lg shadow-2xl shadow-white/10">
                            <Sparkles size={16} />
                        </div>
                        <span className="text-sm font-bold tracking-tighter uppercase italic">TARS Workspace</span>
                    </button>
                    <div className="h-4 w-px bg-zinc-800" />
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">v0-Clone Protocol</span>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-tighter">Sync Active</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-zinc-900/50 border border-zinc-800 px-3 py-1.5 rounded-full">
                        <Monitor size={12} className="text-zinc-500" />
                        <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Desktop Tunnel: {lastSyncTime ? `LIVE (${lastSyncTime})` : 'AWAITING'}</span>
                    </div>
                    <button onClick={() => navigate('/office')} className="p-2 hover:bg-zinc-900 rounded-lg transition-colors text-zinc-400">
                        <X size={18} />
                    </button>
                </div>
            </header>

            {/* Main Workspace */}
            <main className="flex-grow flex overflow-hidden">
                {/* Left Pane: Chat Interface */}
                <section className="w-[450px] border-r border-zinc-900 flex flex-col bg-[#050505] relative">
                    {/* Chat Messages */}
                    <div className="flex-grow overflow-y-auto px-6 py-8 pb-32 scrollbar-hide" ref={scrollRef}>
                        <div className="space-y-8">
                            {messages.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-20">
                                    <Terminal size={40} className="mb-6 text-zinc-700" />
                                    <h2 className="text-xl font-bold tracking-tight text-white mb-2 uppercase">Command the manifest</h2>
                                    <p className="text-xs text-zinc-500 max-w-xs mx-auto leading-relaxed border-t border-zinc-900 pt-4 mt-4 uppercase tracking-widest">Your intent will be filtered through the QBET logic framework and materialized into code.</p>
                                </div>
                            )}

                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex flex-col gap-3 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                    <div className={`flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest ${msg.role === 'user' ? 'text-zinc-600' : 'text-emerald-500'}`}>
                                        {msg.role === 'user' ? 'Initiator' : 'TARS Response'}
                                    </div>
                                    <div className={`max-w-[90%] px-5 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-white text-black font-medium shadow-2xl shadow-white/5' : 'bg-zinc-900 text-zinc-300 border border-zinc-800'}`}>
                                        <div className="flex flex-col gap-2">
                                            {msg.intentAnalysis && (
                                                <div className="mb-2 p-3 bg-white/5 border-l-2 border-blue-500 font-mono text-zinc-400">
                                                    <div className="flex items-center gap-2 mb-1 text-blue-400 uppercase tracking-widest text-[9px] font-bold">
                                                        <Cpu size={10} />
                                                        Intent Analysis
                                                    </div>
                                                    <div className="text-[11px] leading-relaxed lowercase">{msg.intentAnalysis}</div>
                                                </div>
                                            )}
                                            {msg.commands && msg.commands.length > 0 && (
                                                <div className="mb-2 p-3 bg-black/40 border border-zinc-800 rounded-lg">
                                                    <div className="flex items-center gap-2 mb-2 text-[9px] font-bold text-emerald-500 uppercase tracking-widest">
                                                        <Terminal size={10} />
                                                        Spoon Orchestration
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        {msg.commands.map((cmd, idx) => (
                                                            <div key={idx} className="flex items-center gap-2 text-[10px] font-mono text-zinc-500">
                                                                <span className="text-emerald-900">▸</span>
                                                                <span>{cmd}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            <div className="text-[13px] leading-relaxed text-zinc-300">
                                                {msg.role === 'tars' && msg.content.includes('{') ? (
                                                    <div className="flex flex-col gap-3 italic text-zinc-400">
                                                        <span>Materializing architectural nodes...</span>
                                                        <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                                                            <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 1 }} className="h-full bg-emerald-500" />
                                                        </div>
                                                    </div>
                                                ) : msg.content}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Chat Input */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#050505] via-[#050505] to-transparent">
                        <form onSubmit={handleGenerate} className="relative">
                            <input
                                type="text"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Describe intent..."
                                className="w-full bg-black border border-zinc-800 h-14 pl-6 pr-14 text-sm font-medium text-white focus:outline-none focus:border-white transition-all rounded-xl placeholder:text-zinc-700 uppercase tracking-widest"
                                disabled={isGenerating}
                            />
                            <button
                                type="submit"
                                disabled={isGenerating || !prompt.trim()}
                                className="absolute right-2 top-2 w-10 h-10 bg-white text-black rounded-lg flex items-center justify-center hover:bg-zinc-200 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {isGenerating ? <RefreshCw size={16} className="animate-spin" /> : <Send size={16} />}
                            </button>
                        </form>
                    </div>
                </section>

                {/* Right Pane: Construct Workspace */}
                <section className="flex-1 flex flex-col bg-black">
                    {/* Workspace Header */}
                    <div className="h-12 border-b border-zinc-900 flex items-center justify-between px-6 bg-zinc-950/30">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Code size={14} className="text-zinc-500" />
                                <span className="text-[10px] font-bold text-white uppercase tracking-widest">Materialized Stack</span>
                            </div>
                            {constructedFiles.length > 0 && (
                                <div className="flex items-center gap-1">
                                    {constructedFiles.map((file, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setActiveFileIndex(i)}
                                            className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${activeFileIndex === i ? 'bg-white text-black' : 'text-zinc-600 hover:text-white'}`}
                                        >
                                            {file.path.split('/').pop()}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => syncToLocal(constructedFiles)}
                                disabled={constructedFiles.length === 0 || isSyncing}
                                className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-[9px] font-bold text-emerald-500 uppercase tracking-widest hover:bg-emerald-500/20 transition-all active:scale-95 disabled:opacity-30"
                            >
                                <Zap size={10} /> {isSyncing ? 'Syncing...' : 'Sync to Local'}
                            </button>
                            <button className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-[9px] font-bold text-zinc-400 uppercase tracking-widest hover:bg-zinc-800 transition-all">
                                <Rocket size={10} /> Deploy
                            </button>
                        </div>
                    </div>

                    {/* Code Viewer */}
                    <div className="flex-grow overflow-hidden relative">
                        {constructedFiles.length > 0 ? (
                            <div className="h-full flex flex-col">
                                <div className="px-6 py-4 bg-zinc-950/50 border-b border-zinc-900 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                        <span className="text-xs font-mono text-zinc-400">{constructedFiles[activeFileIndex].path}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Share2 size={14} className="text-zinc-600 hover:text-white cursor-pointer" />
                                        <Maximize2 size={14} className="text-zinc-600 hover:text-white cursor-pointer" />
                                    </div>
                                </div>
                                <div className="flex-grow overflow-auto p-8 font-mono text-sm leading-relaxed text-zinc-400 bg-black/40">
                                    <pre>
                                        <code className="language-tsx">
                                            {constructedFiles[activeFileIndex].content}
                                        </code>
                                    </pre>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                                <Monitor size={60} className="mb-8 text-zinc-800" />
                                <h3 className="text-2xl font-black uppercase tracking-tighter">Awaiting Manifestation</h3>
                                <p className="text-xs mt-4 uppercase tracking-[0.4em] font-bold">Construct nodes will materialize here</p>
                            </div>
                        )}
                    </div>

                    {/* Workspace Footer */}
                    <div className="h-10 border-t border-zinc-900 px-6 flex items-center justify-between bg-zinc-950/50 shrink-0">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.2em]">OpenDev Mesh: Operational</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Cpu size={12} className="text-zinc-700" />
                                <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.2em]">Compute Node: Alpha-7</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-[9px] font-bold text-zinc-700 uppercase tracking-widest">
                            <span>UTF-8</span>
                            <span>TypeScript</span>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};
