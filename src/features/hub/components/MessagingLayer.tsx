import React, { useState, useEffect, useRef } from 'react';
import { LamaDB } from '../../../lib/lamaDB';
import { useAuth } from '../../void/hooks/useAuth';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/shadcn/button';
import { Send, User as UserIcon, Zap, MessageSquare, Terminal } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { AgentDM } from './AgentDM';
import { HeartbeatAgent, DirectMessage } from '../types';

export const MessagingLayer: React.FC = () => {
    const { user, profile } = useAuth();
    const [messages, setMessages] = useState<any[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [activeConversation, setActiveConversation] = useState('global_mesh');
    const [selectedAgent, setSelectedAgent] = useState<HeartbeatAgent | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Mock Agents for demonstration
    const mockAgents: HeartbeatAgent[] = [
        {
            id: 'tars-01',
            name: 'TARS_MOD_01',
            status: 'awake',
            lastHeartbeat: new Date().toISOString(),
            wakeTime: '06:00',
            sleepTime: '22:00',
            timezone: 'UTC'
        },
        {
            id: 'lama-70b',
            name: 'Lama_Oracle',
            status: 'thinking',
            lastHeartbeat: new Date().toISOString(),
            wakeTime: '00:00',
            sleepTime: '23:59',
            timezone: 'PST'
        }
    ];

    useEffect(() => {
        if (!user) return;
        
        const userContext = { uid: 'global', email: 'global' };
        
        // Use a shared collection for the demo Mesh Messaging
        // In a real sovereign implement, we would use a private collection per user
        console.log(`📡 MESH_COMMS: Plugging into [${activeConversation}] tunnel...`);
        
        const unsubscribe = LamaDB.store.collection(`mesh_messages_${activeConversation}`, userContext).subscribe((data) => {
            if (Array.isArray(data)) {
                setMessages(data.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()));
            }
        });

        return () => unsubscribe();
    }, [user, activeConversation]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputValue.trim() || !user) return;
        
        const userContext = { uid: 'global', email: 'global' };
        const msgObj = {
            senderId: user.uid,
            senderName: user.name,
            senderAvatar: profile?.avatarUrl,
            isAgent: profile?.isAgent || false,
            content: inputValue,
            timestamp: new Date().toISOString()
        };

        setInputValue('');
        await LamaDB.store.collection(`mesh_messages_${activeConversation}`, userContext).add(msgObj);
    };

    return (
        <Card className="bg-zinc-950 border-zinc-900 rounded-3xl overflow-hidden flex flex-row h-[700px] shadow-2xl">
            {/* AGENT SELECTOR SIDEBAR */}
            <div className="w-[80px] sm:w-[240px] border-r border-zinc-900 bg-[#050505] flex flex-col">
                <div className="p-6 border-b border-zinc-900">
                    <h3 className="hidden sm:block text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em]">Channels</h3>
                    <Terminal size={18} className="sm:hidden text-zinc-600" />
                </div>
                <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-2">
                    <button 
                        onClick={() => setSelectedAgent(null)}
                        className={cn(
                            "w-full flex items-center justify-center sm:justify-start gap-3 p-3 rounded-xl transition-all",
                            !selectedAgent ? "bg-white/5 border border-white/10 text-white" : "text-zinc-500 hover:bg-zinc-900/50"
                        )}
                    >
                        <MessageSquare size={16} />
                        <span className="hidden sm:block text-[11px] font-bold uppercase tracking-widest text-inherit">Global Mesh</span>
                    </button>

                    <div className="h-px bg-zinc-900 my-4" />
                    <h3 className="hidden sm:block px-3 mb-4 text-[9px] font-bold text-zinc-700 uppercase tracking-widest">Sovereign Agents</h3>

                    {mockAgents.map(agent => (
                        <button 
                            key={agent.id}
                            onClick={() => setSelectedAgent(agent)}
                            className={cn(
                                "w-full flex items-center justify-center sm:justify-start gap-3 p-3 rounded-xl transition-all border",
                                selectedAgent?.id === agent.id ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-transparent border-transparent text-zinc-500 hover:bg-zinc-900/50"
                            )}
                        >
                            <div className="relative">
                                <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-[10px] font-bold">AI</div>
                                <div className={cn(
                                    "absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#050505]",
                                    agent.status === 'awake' ? "bg-emerald-500" : "bg-zinc-700"
                                )} />
                            </div>
                            <span className="hidden sm:block text-[11px] font-bold uppercase tracking-tighter truncate">{agent.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* MESSAGE VIEWPORT */}
            <div className="flex-1 flex flex-col min-w-0">
                {selectedAgent ? (
                    <AgentDM 
                        agent={selectedAgent}
                        messages={messages.filter(m => m.receiverId === selectedAgent.id || m.senderId === selectedAgent.id)}
                        currentUserId={user?.uid || ''}
                        onSendMessage={(val) => {
                            const userContext = { uid: 'global', email: 'global' };
                            const msgObj: DirectMessage = {
                                id: Math.random().toString(),
                                senderId: user?.uid || '',
                                receiverId: selectedAgent.id,
                                content: val,
                                timestamp: new Date().toISOString(),
                                status: 'sent'
                            };
                            LamaDB.store.collection(`mesh_messages_${activeConversation}`, userContext).add(msgObj);
                        }}
                        onWakeAgent={() => {}}
                    />
                ) : (
                    <>
                        {/* Global Header */}
                        <div className="p-6 border-b border-zinc-900 bg-zinc-950/50 flex justify-between items-center shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800">
                                    <Terminal size={20} className="text-orange-500" />
                                </div>
                                <div>
                                    <h3 className="text-[12px] font-bold text-white uppercase tracking-widest leading-none mb-1">Global Mesh Channel</h3>
                                    <p className="text-[8px] font-bold text-emerald-500 uppercase tracking-tighter animate-pulse leading-none">● Secure Tunnel Established</p>
                                </div>
                            </div>
                        </div>

                        {/* Global Messages Area */}
                        <div 
                            ref={scrollRef}
                            className="grow p-6 overflow-y-auto space-y-4 custom-scrollbar bg-[radial-gradient(circle_at_center,_#111111_0%,_transparent_100%)]"
                        >
                            {messages.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-30 italic">
                                    <MessageSquare size={32} className="mb-4" />
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Silence on the mesh... Start the handshake.</p>
                                </div>
                            )}
                            <AnimatePresence>
                                {messages.filter(m => !m.receiverId).map((msg, i) => (
                                    <motion.div
                                        key={msg.id || i}
                                        initial={{ opacity: 0, x: msg.senderId === user?.uid ? 20 : -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={`flex ${msg.senderId === user?.uid ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[80%] space-y-1 ${msg.senderId === user?.uid ? 'items-end' : 'items-start'} flex flex-col`}>
                                            <div className="flex items-center gap-2 px-1">
                                                <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">{msg.senderName}</span>
                                                {msg.isAgent && <Zap size={8} className="text-purple-400" fill="currentColor" />}
                                            </div>
                                            <div className={`p-4 rounded-2xl text-[13px] font-medium leading-relaxed ${
                                                msg.senderId === user?.uid 
                                                ? 'bg-white text-black rounded-tr-none shadow-lg' 
                                                : 'bg-zinc-900 text-zinc-300 border border-zinc-800 rounded-tl-none'
                                            }`}>
                                                {msg.content}
                                            </div>
                                            <span className="text-[7px] font-bold text-zinc-800 uppercase px-1">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Global Input Area */}
                        <div className="p-6 border-t border-zinc-900 bg-zinc-950/50 shrink-0">
                            <div className="flex gap-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-2 focus-within:border-zinc-700 transition-all">
                                <input 
                                    className="grow bg-transparent border-none text-[12px] px-4 text-white focus:outline-none placeholder:text-zinc-700 font-medium"
                                    placeholder="Broadcast message to mesh..."
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                />
                                <Button 
                                    size="icon"
                                    onClick={handleSendMessage}
                                    className="w-10 h-10 rounded-xl bg-white text-black hover:bg-zinc-200 shadow-xl transition-all"
                                >
                                    <Send size={18} />
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </Card>
    );
};
