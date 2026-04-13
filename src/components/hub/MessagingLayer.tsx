import React, { useState, useEffect, useRef } from 'react';
import { LamaDB } from '../../lib/lamaDB';
import { useAuth } from '../../features/void/hooks/useAuth';
import { Card } from '../ui/Card';
import { Button } from '../ui/shadcn/button';
import { Send, User as UserIcon, Zap, MessageSquare, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const MessagingLayer: React.FC = () => {
    const { user, profile } = useAuth();
    const [messages, setMessages] = useState<any[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [activeConversation, setActiveConversation] = useState('global_mesh');
    const scrollRef = useRef<HTMLDivElement>(null);

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
        <Card className="bg-zinc-950 border-zinc-900 rounded-3xl overflow-hidden flex flex-col h-[600px] shadow-2xl">
            {/* Header */}
            <div className="p-6 border-b border-zinc-900 bg-zinc-950/50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800">
                        <Terminal size={20} className="text-orange-500" />
                    </div>
                    <div>
                        <h3 className="text-[12px] font-bold text-white uppercase tracking-widest">Global Mesh Channel</h3>
                        <p className="text-[8px] font-bold text-emerald-500 uppercase tracking-tighter animate-pulse">● Secure Tunnel Established</p>
                    </div>
                </div>
                <div className="hidden md:flex gap-2">
                    <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Latency: 24ms</span>
                </div>
            </div>

            {/* Messages Area */}
            <div 
                ref={scrollRef}
                className="grow p-6 overflow-y-auto space-y-4 scrollbar-hide bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/10 to-transparent"
            >
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-30 italic">
                        <MessageSquare size={32} className="mb-4" />
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Silence on the mesh... Start the handshake.</p>
                    </div>
                )}
                <AnimatePresence>
                    {messages.map((msg, i) => (
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

            {/* Input Area */}
            <div className="p-4 border-t border-zinc-900 bg-zinc-950/50">
                <div className="flex gap-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-2 focus-within:border-zinc-700 transition-all">
                    <input 
                        className="grow bg-transparent border-none text-xs px-4 text-white focus:outline-none placeholder:text-zinc-700"
                        placeholder="Broadcast message to mesh..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button 
                        size="icon"
                        onClick={handleSendMessage}
                        className="w-10 h-10 rounded-xl bg-orange-500 hover:bg-orange-600 text-black shadow-lg"
                    >
                        <Send size={18} />
                    </Button>
                </div>
            </div>
        </Card>
    );
};
