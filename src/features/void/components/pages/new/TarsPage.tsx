import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Terminal, Box, Layers, Play } from 'lucide-react';
import { streamChatResponse } from '../../services/llmService';

export const TarsPage: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'tars', content: string }[]>([]);
    const [constructedFiles, setConstructedFiles] = useState<{ path: string, content: string }[]>([]);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim() || isGenerating) return;

        const currentPrompt = prompt;
        setPrompt('');
        setIsGenerating(true);
        setMessages(prev => [...prev, { role: 'user', content: currentPrompt }]);

        try {
            let fullResponse = '';
            const generator = streamChatResponse(
                currentPrompt,
                messages,
                [], // Empty file tree for new projects
                'openrouter/anthropic/claude-3.5-sonnet', // Default high-fidelity model
                undefined // Will use the env key
            );

            setMessages(prev => [...prev, { role: 'tars', content: '' }]);

            for await (const chunk of generator) {
                fullResponse += chunk.text;
                // Basic parsing for streaming display (very simplified)
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].content = fullResponse;
                    return newMessages;
                });
            }

            // After streaming, try to parse JSON
            try {
                const parsed = JSON.parse(fullResponse);
                if (parsed.files) {
                    setConstructedFiles(parsed.files);
                }
            } catch (e) {
                console.error("Failed to parse TARS response as JSON:", e);
            }

        } catch (error) {
            console.error("TARS Generation Error:", error);
            setMessages(prev => [...prev, { role: 'tars', content: "Neural handshake failed. Error: " + (error instanceof Error ? error.message : "Unknown error") }]);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-200px)] max-w-6xl mx-auto">
            <div className="text-center mb-12">
                <span className="inline-block px-3 py-1 rounded-none bg-zinc-900 border border-zinc-800 text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500 mb-4">
                    TARS AI Engine
                </span>
                <h2 className="text-4xl font-bold tracking-tighter text-white uppercase italic">Neural Manifestation</h2>
            </div>

            <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-px bg-zinc-900 border border-zinc-900 overflow-hidden">
                {/* Chat Column */}
                <div className="bg-black flex flex-col p-6 space-y-6">
                    <div className="flex-grow overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-zinc-800">
                        {messages.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                                <Terminal className="w-12 h-12 mb-4 text-zinc-600" />
                                <p className="text-sm font-medium text-zinc-500 uppercase tracking-widest leading-loose">
                                    Awaiting initial<br />neural prompt...
                                </p>
                            </div>
                        )}
                        {messages.map((msg, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[85%] px-4 py-3 rounded-none text-xs font-medium leading-relaxed ${msg.role === 'user'
                                        ? 'bg-white text-black font-bold'
                                        : 'bg-zinc-950 border border-zinc-900 text-zinc-300'
                                    }`}>
                                    <pre className="whitespace-pre-wrap font-sans">
                                        {msg.role === 'tars' && msg.content.startsWith('{') ? "Manifesting structural changes..." : msg.content}
                                    </pre>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <form onSubmit={handleGenerate} className="relative">
                        <input
                            type="text"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Describe your vision..."
                            className="w-full bg-zinc-950 border border-zinc-800 px-6 py-5 pr-16 text-sm font-bold text-white placeholder:text-zinc-700 focus:outline-none focus:border-white transition-all uppercase tracking-widest"
                            disabled={isGenerating}
                        />
                        <button
                            type="submit"
                            disabled={isGenerating || !prompt.trim()}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white text-black flex items-center justify-center hover:bg-zinc-200 disabled:opacity-50 transition-colors"
                        >
                            {isGenerating ? <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
                        </button>
                    </form>
                </div>

                {/* Preview Column */}
                <div className="bg-zinc-950 flex flex-col p-6 overflow-hidden">
                    <div className="flex items-center justify-between mb-6 border-b border-zinc-900 pb-4">
                        <div className="flex items-center gap-2">
                            <Box className="w-4 h-4 text-zinc-500" />
                            <span className="text-[10px] font-bold text-white uppercase tracking-widest">Construct Manifest</span>
                        </div>
                        <div className="flex gap-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Neutral Live</span>
                        </div>
                    </div>

                    <div className="flex-grow overflow-y-auto space-y-4">
                        {constructedFiles.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                                <Layers className="w-16 h-16 mb-6 text-zinc-600" />
                                <p className="text-xs font-bold text-zinc-600 uppercase tracking-[0.3em]">
                                    Empty Cluster
                                </p>
                            </div>
                        ) : (
                            constructedFiles.map((file, i) => (
                                <div key={i} className="bg-black border border-zinc-900 p-4 font-mono text-[10px]">
                                    <div className="flex items-center justify-between mb-2 text-zinc-500 border-b border-zinc-900 pb-2">
                                        <span className="text-white font-bold">{file.path}</span>
                                        <span className="uppercase text-[8px] px-1.5 py-0.5 bg-zinc-900">Created</span>
                                    </div>
                                    <div className="text-zinc-400 overflow-x-auto">
                                        <pre>{file.content.slice(0, 500)}{file.content.length > 500 && '...'}</pre>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {constructedFiles.length > 0 && (
                        <button className="mt-6 w-full bg-white text-black py-4 text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-zinc-200 transition-colors">
                            <Play className="w-4 h-4" />
                            Initiate Deployment
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
