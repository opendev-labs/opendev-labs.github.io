import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles, Send, Terminal, Box, Layers, Play,
    History, Plus, MessageSquare, MoreVertical,
    Trash2, Search, Cpu, Globe, Zap, Settings,
    Layout, Code, CheckCircle2, AlertCircle, Rocket,
    Download, ExternalLink, X
} from 'lucide-react';
import { streamChatResponse } from '../../../services/llmService';
import type { Message } from '../../../types';
import { useAuth } from '../../../contexts/AuthContext';
import { huggingFaceService } from '../../../services/huggingFaceService';

interface ChatSession {
    id: string;
    title: string;
    timestamp: number;
    messages: Message[];
}

export const TarsPage: React.FC = () => {
    const { user } = useAuth();
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [currentSessionId, setCurrentSessionId] = useState<string>(Date.now().toString());
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [constructedFiles, setConstructedFiles] = useState<{ path: string, content: string }[]>([]);
    const [showSidebar, setShowSidebar] = useState(true);
    const [showDeployModal, setShowDeployModal] = useState(false);
    const [isDeploying, setIsDeploying] = useState(false);
    const [deploymentResult, setDeploymentResult] = useState<{ success: boolean; url?: string; error?: string } | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);

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

            try {
                const parsed = JSON.parse(fullResponse);
                if (parsed.files) {
                    setConstructedFiles(parsed.files);
                }
            } catch (e) {
                // Try to extract JSON if it's wrapped in text
                const jsonMatch = fullResponse.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    try {
                        const parsed = JSON.parse(jsonMatch[0]);
                        if (parsed.files) setConstructedFiles(parsed.files);
                    } catch (innerE) { }
                }
            }

        } catch (error) {
            console.error("TARS Generation Error:", error);
            setMessages(prev => [...prev, { id: Date.now(), role: 'tars', content: "Neural handshake failed. Error: " + (error instanceof Error ? error.message : "Unknown error") }]);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="flex bg-black text-white min-h-screen overflow-hidden border-t border-zinc-900">
            {/* Sidebar */}
            <AnimatePresence>
                {showSidebar && (
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 280, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        className="border-right border-zinc-900 bg-zinc-950 flex flex-col"
                    >
                        <div className="p-4">
                            <button
                                onClick={handleNewChat}
                                className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition-all text-xs font-bold uppercase tracking-widest rounded-lg"
                            >
                                <div className="flex items-center gap-3">
                                    <Plus size={14} />
                                    <span>New Manifest</span>
                                </div>
                                <Layout size={12} className="text-zinc-500" />
                            </button>
                        </div>

                        <div className="flex-grow overflow-y-auto px-2 space-y-1 scrollbar-hide">
                            <div className="px-3 py-2 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-2">Recent Intervals</div>
                            {sessions.length === 0 && (
                                <div className="p-4 text-center">
                                    <p className="text-[10px] text-zinc-600 font-medium uppercase tracking-widest italic leading-relaxed">No active neural<br />sessions logged.</p>
                                </div>
                            )}
                            {sessions.map(session => (
                                <button
                                    key={session.id}
                                    onClick={() => {
                                        setCurrentSessionId(session.id);
                                        setMessages(session.messages);
                                    }}
                                    className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium flex items-center gap-3 transition-all ${currentSessionId === session.id ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'}`}
                                >
                                    <MessageSquare size={14} className={currentSessionId === session.id ? 'text-black' : 'text-zinc-600'} />
                                    <span className="truncate">{session.title}</span>
                                </button>
                            ))}
                        </div>

                        <div className="p-4 border-t border-zinc-900 bg-black/50">
                            <div className="flex items-center gap-3 p-2">
                                <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                    <Cpu size={14} className="text-emerald-500" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-white uppercase tracking-widest">TARS-2026</p>
                                    <p className="text-[9px] text-emerald-500 uppercase tracking-widest font-bold">Local Auth: Active</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Chat Area */}
            <div className="flex-grow flex flex-col relative bg-black">
                {/* Header Overlay */}
                <div className="absolute top-0 left-0 right-0 z-20 h-16 bg-gradient-to-b from-black to-transparent flex items-center justify-between px-6">
                    <button
                        onClick={() => setShowSidebar(!showSidebar)}
                        className="p-2 hover:bg-zinc-900 rounded-lg transition-all text-zinc-400 hover:text-white"
                    >
                        <History size={20} />
                    </button>

                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">Node Architecture: Core</span>
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    </div>
                </div>

                {/* Messages Container */}
                <div className="flex-grow overflow-y-auto px-4 pt-24 pb-32 scrollbar-thin scrollbar-thumb-zinc-800">
                    <div className="max-w-3xl mx-auto space-y-12">
                        {messages.length === 0 && (
                            <div className="h-[60vh] flex flex-col items-center justify-center text-center">
                                <div className="w-16 h-16 bg-white text-black flex items-center justify-center rounded-2xl mb-8 rotate-3 shadow-2xl shadow-white/10">
                                    <Sparkles size={32} />
                                </div>
                                <h1 className="text-4xl font-bold tracking-tighter text-white mb-4 uppercase italic">Manifest Vision</h1>
                                <p className="text-zinc-500 max-w-sm mx-auto text-sm font-medium leading-relaxed uppercase tracking-widest">
                                    Describe the architecture you wish to materialize into the Void.
                                </p>
                                <div className="grid grid-cols-2 gap-3 mt-12 w-full max-w-md">
                                    {[
                                        "Build an e-commerce dashboard",
                                        "Materialize a landing page",
                                        "Construct an API bridge",
                                        "Optimize neural mesh"
                                    ].map(suggestion => (
                                        <button
                                            key={suggestion}
                                            onClick={() => setPrompt(suggestion)}
                                            className="p-4 text-left border border-zinc-900 bg-zinc-950 hover:bg-zinc-900 hover:border-zinc-800 transition-all rounded-xl text-[10px] font-bold uppercase tracking-widest text-zinc-400"
                                        >
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {messages.map((msg, idx) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex gap-6 ${msg.role === 'tars' ? 'items-start' : 'justify-end'}`}
                            >
                                {msg.role === 'tars' && (
                                    <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                                        <Terminal size={14} className="text-zinc-400" />
                                    </div>
                                )}
                                <div className={`max-w-[85%] group ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                                    {msg.role === 'user' ? (
                                        <div className="bg-zinc-900 text-white px-5 py-3 rounded-2xl inline-block text-sm font-medium shadow-xl border border-zinc-800">
                                            {msg.content}
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            <div className="text-sm font-medium text-zinc-300 leading-relaxed prose prose-invert overflow-hidden">
                                                {msg.content.startsWith('{') ? (
                                                    <div className="flex flex-col gap-4">
                                                        <div className="flex items-center gap-2 text-emerald-500">
                                                            <Zap size={14} />
                                                            <span className="text-[10px] font-bold uppercase tracking-widest">Manifesting structural nodes...</span>
                                                        </div>
                                                        <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-4 font-mono text-[10px] text-zinc-500">
                                                            {JSON.parse(msg.content).conversation || "Manifesting structural changes..."}
                                                        </div>
                                                    </div>
                                                ) : msg.content || (
                                                    <div className="flex items-center gap-1.5 py-4">
                                                        <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                                        <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                                        <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce" />
                                                    </div>
                                                )}
                                            </div>

                                            {idx === messages.length - 1 && constructedFiles.length > 0 && (
                                                <div className="mt-8 space-y-3">
                                                    <div className="flex items-center gap-2 mb-4">
                                                        <Layout size={14} className="text-zinc-500" />
                                                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Construct Manifest</span>
                                                    </div>
                                                    <div className="grid grid-cols-1 gap-4">
                                                        {constructedFiles.map((file, i) => (
                                                            <div key={i} className="bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden group/file">
                                                                <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/50 border-b border-zinc-900">
                                                                    <div className="flex items-center gap-2">
                                                                        <Code size={12} className="text-zinc-500" />
                                                                        <span className="text-[11px] font-bold text-white font-mono">{file.path}</span>
                                                                    </div>
                                                                    <span className="text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded">Materialized</span>
                                                                </div>
                                                                <div className="p-4 bg-black/40 font-mono text-[10px] text-zinc-400 overflow-x-auto">
                                                                    <pre>{file.content.slice(0, 200)}{file.content.length > 200 && '...'}</pre>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <button
                                                        onClick={() => setShowDeployModal(true)}
                                                        className="mt-6 w-full bg-white text-black py-4 rounded-xl text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-zinc-200 transition-all shadow-2xl shadow-white/5 active:scale-[0.98]"
                                                    >
                                                        <Rocket size={16} />
                                                        Deploy to Hosting
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                        <div ref={messagesEndRef} className="h-4" />
                    </div>
                </div>

                {/* Input Area */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/90 to-transparent">
                    <div className="max-w-3xl mx-auto">
                        <form onSubmit={handleGenerate} className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-1000"></div>
                            <div className="relative bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden focus-within:border-zinc-500 transition-all">
                                <input
                                    type="text"
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="Describe your manifestation..."
                                    className="w-full bg-transparent px-6 py-6 pr-16 text-sm font-medium text-white placeholder:text-zinc-700 focus:outline-none uppercase tracking-widest"
                                    disabled={isGenerating}
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                    <button
                                        type="submit"
                                        disabled={isGenerating || !prompt.trim()}
                                        className="w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center hover:bg-zinc-200 disabled:opacity-50 transition-all active:scale-[0.9]"
                                    >
                                        {isGenerating ? (
                                            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <Send size={18} />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                        <div className="mt-4 flex items-center justify-center gap-6">
                            <div className="flex items-center gap-2 opacity-30">
                                <Globe size={10} className="text-zinc-500" />
                                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest italic">SyncStack Mesh v4.2</span>
                            </div>
                            <div className="flex items-center gap-2 opacity-30">
                                <Zap size={10} className="text-zinc-500" />
                                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest italic">Low Latency Manifest</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Deployment Modal */}
            <AnimatePresence>
                {showDeployModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-6"
                        onClick={() => !isDeploying && setShowDeployModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                        >
                            {/* Modal Header */}
                            <div className="sticky top-0 bg-zinc-950 border-b border-zinc-900 p-6 flex items-center justify-between z-10">
                                <div>
                                    <h2 className="text-xl font-black text-white uppercase tracking-tight">Deploy Manifest</h2>
                                    <p className="text-xs text-zinc-500 font-medium mt-1">Choose your hosting destination</p>
                                </div>
                                <button
                                    onClick={() => !isDeploying && setShowDeployModal(false)}
                                    className="p-2 hover:bg-zinc-900 rounded-lg transition-colors"
                                    disabled={isDeploying}
                                >
                                    <X size={20} className="text-zinc-500" />
                                </button>
                            </div>

                            {/* Deployment Result */}
                            {deploymentResult && (
                                <div className={`m-6 p-4 rounded-xl border ${deploymentResult.success ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                                    <div className="flex items-start gap-3">
                                        {deploymentResult.success ? (
                                            <CheckCircle2 size={20} className="text-emerald-500  shrink-0 mt-0.5" />
                                        ) : (
                                            <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
                                        )}
                                        <div className="flex-grow">
                                            <p className={`text-sm font-bold ${deploymentResult.success ? 'text-emerald-500' : 'text-red-500'}`}>
                                                {deploymentResult.success ? 'Deployment Successful!' : 'Deployment Failed'}
                                            </p>
                                            {deploymentResult.url && (
                                                <a
                                                    href={deploymentResult.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-zinc-400 hover:text-white mt-1 flex items-center gap-2 group"
                                                >
                                                    {deploymentResult.url}
                                                    <ExternalLink size={12} className="group-hover:translate-x-0.5 transition-transform" />
                                                </a>
                                            )}
                                            {deploymentResult.error && (
                                                <p className="text-xs text-red-400 mt-1">{deploymentResult.error}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Deployment Options */}
                            <div className="p-6 space-y-4">
                                {/* HuggingFace Space */}
                                <DeploymentOption
                                    title="HuggingFace Space"
                                    description="Deploy as a public HF Space with instant CDN"
                                    icon={<Globe size={20} className="text-yellow-500" />}
                                    badge="Free"
                                    badgeColor="emerald"
                                    onClick={async () => {
                                        setIsDeploying(true);
                                        setDeploymentResult(null);
                                        try {
                                            const projectName = `tars-${Date.now()}`;
                                            const result = await huggingFaceService.createSpace({
                                                name: projectName,
                                                files: constructedFiles,
                                                sdk: 'static',
                                            });
                                            setDeploymentResult({ success: true, url: result.url });
                                        } catch (error) {
                                            setDeploymentResult({
                                                success: false,
                                                error: error instanceof Error ? error.message : 'Unknown error'
                                            });
                                        } finally {
                                            setIsDeploying(false);
                                        }
                                    }}
                                    isDeploying={isDeploying}
                                />

                                {/* HuggingFace Repository */}
                                <DeploymentOption
                                    title="HuggingFace Repository"
                                    description="Create a new HF repository with your code"
                                    icon={<Code size={20} className="text-orange-500" />}
                                    badge="Free"
                                    badgeColor="emerald"
                                    onClick={async () => {
                                        setIsDeploying(true);
                                        setDeploymentResult(null);
                                        try {
                                            const projectName = `tars-repo-${Date.now()}`;
                                            const result = await huggingFaceService.createRepo({
                                                name: projectName,
                                                files: constructedFiles,
                                            });
                                            setDeploymentResult({ success: true, url: result.url });
                                        } catch (error) {
                                            setDeploymentResult({
                                                success: false,
                                                error: error instanceof Error ? error.message : 'Unknown error'
                                            });
                                        } finally {
                                            setIsDeploying(false);
                                        }
                                    }}
                                    isDeploying={isDeploying}
                                />

                                {/* Download as ZIP */}
                                <DeploymentOption
                                    title="Download as ZIP"
                                    description="Download all files as a compressed archive"
                                    icon={<Download size={20} className="text-blue-500" />}
                                    onClick={() => {
                                        // Create ZIP and download
                                        const zip = constructedFiles.map(f => `${f.path}:\n${f.content}`).join('\n\n---\n\n');
                                        const blob = new Blob([zip], { type: 'text/plain' });
                                        const url = URL.createObjectURL(blob);
                                        const a = document.createElement('a');
                                        a.href = url;
                                        a.download = `tars-manifest-${Date.now()}.txt`;
                                        a.click();
                                        URL.revokeObjectURL(url);
                                        setDeploymentResult({ success: true });
                                    }}
                                    isDeploying={false}
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
};

// Deployment Option Component
const DeploymentOption: React.FC<{
    title: string;
    description: string;
    icon: React.ReactNode;
    badge?: string;
    badgeColor?: 'emerald' | 'orange' | 'blue';
    onClick: () => void;
    isDeploying: boolean;
}> = ({ title, description, icon, badge, badgeColor = 'emerald', onClick, isDeploying }) => (
    <button
        onClick={onClick}
        disabled={isDeploying}
        className="w-full p-6 bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 rounded-xl transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed"
    >
        <div className="flex items-start gap-4">
            <div className="p-3 bg-black border border-zinc-800 rounded-lg shrink-0">
                {icon}
            </div>
            <div className="flex-grow">
                <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-black text-white uppercase tracking-tight">{title}</h3>
                    {badge && (
                        <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${badgeColor === 'emerald' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : badgeColor === 'orange' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'}`}>
                            {badge}
                        </span>
                    )}
                </div>
                <p className="text-xs text-zinc-500 font-medium">{description}</p>
            </div>
            <div className="shrink-0">
                <ExternalLink size={16} className="text-zinc-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>
        </div>
    </button>
);
