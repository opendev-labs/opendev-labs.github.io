import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Box, Cpu, Activity, Shield, Zap, User, Key, Save, RefreshCw, X, Maximize2, Minimize2, ChevronRight, Command } from 'lucide-react';
import { githubPATService } from '../features/void/services/githubPATService';

export const SyncStackConsole: React.FC = () => {
    const [username, setUsername] = useState(githubPATService.getUsername() || '');
    const [pat, setPat] = useState(githubPATService.getPAT() || '');
    const [logs, setLogs] = useState<{ id: string; text: string; type: 'info' | 'success' | 'warn' | 'error'; timestamp: string }[]>([]);
    const [status, setStatus] = useState<'IDLE' | 'CONNECTING' | 'SYNCED' | 'ERROR'>('IDLE');
    const [isSaving, setIsSaving] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const addLog = (text: string, type: 'info' | 'success' | 'warn' | 'error' = 'info') => {
        setLogs(prev => [...prev, {
            id: Math.random().toString(36).substr(2, 9),
            text,
            type,
            timestamp: new Date().toLocaleTimeString([], { hour12: false })
        }].slice(-50));
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    useEffect(() => {
        if (pat) {
            setStatus('SYNCED');
            addLog('SyncStack core initialized', 'success');
            addLog('Established secure handshake with github.com', 'info');
        } else {
            addLog('Waiting for authentication credentials...', 'warn');
        }
    }, []);

    const handleSave = async () => {
        if (!username || !pat) return;
        setIsSaving(true);
        setStatus('CONNECTING');
        addLog(`Initiating connection for @${username}...`, 'info');

        // Simulate handshake
        await new Promise(resolve => setTimeout(resolve, 1500));

        try {
            const result = await githubPATService.validatePAT(pat);
            if (result.valid) {
                githubPATService.setPAT(pat);
                githubPATService.setUsername(username);
                setStatus('SYNCED');
                addLog(`Authentication successful. Welcome, @${result.username}.`, 'success');
                addLog('Local mesh synchronized with global state.', 'success');
            } else {
                setStatus('ERROR');
                addLog(`Authentication failed: ${result.error}`, 'error');
            }
        } catch (err) {
            setStatus('ERROR');
            addLog('Network error during handshake', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] bg-black text-zinc-400 font-mono overflow-hidden border border-zinc-900 mx-8 my-12 shadow-2xl">
            {/* Console Header / Title Bar */}
            <div className="h-12 border-b border-zinc-900 bg-zinc-950 flex items-center justify-between px-6 shrink-0">
                <div className="flex items-center gap-4">
                    <Box size={16} className={status === 'SYNCED' ? 'text-emerald-500' : 'text-zinc-600'} />
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-white tracking-widest uppercase">SyncStack Console v2.0.4</span>
                        <div className="flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full ${status === 'SYNCED' ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-700'}`} />
                            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-tighter">{status} // HUB_OFFICE_CONTRL</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="flex flex-col items-end">
                            <span className="text-[8px] font-bold text-zinc-600 uppercase">Uplink</span>
                            <span className="text-[10px] font-bold text-emerald-500/80 tracking-tighter">4.2 GB/s</span>
                        </div>
                        <Activity size={14} className="text-emerald-500/50" />
                    </div>
                    <div className="h-4 w-[1px] bg-zinc-800" />
                    <div className="flex items-center gap-2">
                        <Minimize2 size={12} className="text-zinc-700 hover:text-white transition-colors cursor-pointer" />
                        <Maximize2 size={12} className="text-zinc-700 hover:text-white transition-colors cursor-pointer" />
                        <X size={12} className="text-zinc-700 hover:text-white transition-colors cursor-pointer" />
                    </div>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Left Panel: Auth & Config */}
                <div className="w-80 border-r border-zinc-900 flex flex-col shrink-0">
                    <div className="p-8 space-y-8">
                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                <Command size={14} className="text-white" />
                                <span className="text-[10px] font-bold text-white uppercase tracking-widest">Nexus Binding</span>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest block">GitHub Identity</label>
                                    <div className="relative group">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-emerald-500 transition-colors" size={12} />
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            placeholder="USERNAME"
                                            className="w-full bg-black border border-zinc-800 h-10 pl-9 pr-4 text-[11px] text-white focus:outline-none focus:border-white transition-all placeholder:text-zinc-800"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest block">Session Key (PAT)</label>
                                    <div className="relative group">
                                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-emerald-500 transition-colors" size={12} />
                                        <input
                                            type="password"
                                            value={pat}
                                            onChange={(e) => setPat(e.target.value)}
                                            placeholder="GHP_REDACTED"
                                            className="w-full bg-black border border-zinc-800 h-10 pl-9 pr-4 text-[11px] text-zinc-200 focus:outline-none focus:border-white transition-all placeholder:text-zinc-800 font-password"
                                        />
                                    </div>
                                    <p className="text-[8px] text-zinc-700 font-medium">Token must include `repo` and `workflow` scopes.</p>
                                </div>

                                <button
                                    onClick={handleSave}
                                    disabled={isSaving || !username || !pat}
                                    className="w-full h-10 bg-white text-black text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isSaving ? <RefreshCw size={12} className="animate-spin" /> : <Save size={12} />}
                                    Sync Identity
                                </button>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-zinc-900/50 space-y-6">
                            <div className="flex items-center gap-2">
                                <Shield size={14} className="text-emerald-500/50" />
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Sovereign Encryption</span>
                            </div>
                            <div className="p-4 bg-zinc-900/30 border border-zinc-900 space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-[9px] font-bold text-zinc-600 uppercase">Local Mesh</span>
                                    <span className="text-[9px] font-bold text-emerald-500 uppercase">ACTIVE</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[9px] font-bold text-zinc-600 uppercase">Hardware Key</span>
                                    <span className="text-[9px] font-bold text-zinc-400 uppercase">TPM_LOCKED</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto p-8 bg-zinc-950 border-t border-zinc-900">
                        <div className="flex items-center gap-3">
                            <Cpu size={14} className="text-zinc-500" />
                            <div className="flex flex-col">
                                <span className="text-[9px] font-bold text-white uppercase tracking-widest">System Load</span>
                                <div className="w-full h-[2px] bg-zinc-900 mt-2">
                                    <div className="w-1/3 h-full bg-emerald-500" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Terminal Output */}
                <div className="flex-1 flex flex-col bg-black">
                    <div className="flex-1 overflow-y-auto p-8 scrollbar-hide" ref={scrollRef}>
                        <div className="space-y-1">
                            {logs.map((log) => (
                                <div key={log.id} className="flex gap-4 animate-in fade-in slide-in-from-left-2 duration-300">
                                    <span className="text-[10px] text-zinc-700 font-bold shrink-0">[{log.timestamp}]</span>
                                    <span className="text-[11px] font-bold text-zinc-800 shrink-0 select-none">▸</span>
                                    <p className={`text-[11px] font-medium leading-relaxed tracking-tight ${log.type === 'success' ? 'text-emerald-500' :
                                            log.type === 'error' ? 'text-red-500' :
                                                log.type === 'warn' ? 'text-amber-500' :
                                                    'text-zinc-500'
                                        }`}>
                                        {log.text}
                                    </p>
                                </div>
                            ))}
                            {status === 'CONNECTING' && (
                                <div className="flex gap-4">
                                    <span className="text-[10px] text-zinc-700 font-bold">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                                    <span className="text-[11px] font-bold text-zinc-800">▸</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[11px] font-medium text-emerald-500 animate-pulse tracking-widest">EXECUTING_HANDSHAKE</span>
                                        <span className="flex gap-1">
                                            {[1, 2, 3].map(i => (
                                                <motion.span
                                                    key={i}
                                                    animate={{ opacity: [0, 1, 0] }}
                                                    transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                                                    className="w-1 h-1 bg-emerald-500"
                                                />
                                            ))}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Terminal Footer */}
                    <div className="h-14 border-t border-zinc-900 flex items-center px-8 gap-4 bg-zinc-950/50 shrink-0">
                        <ChevronRight size={14} className="text-zinc-700" />
                        <input
                            type="text"
                            placeholder="Awaiting command..."
                            className="bg-transparent border-none focus:outline-none text-[11px] text-white w-full placeholder:text-zinc-800 tracking-tight"
                            readOnly
                        />
                        <div className="flex items-center gap-4">
                            <span className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest whitespace-nowrap">UTF-8 // [LN 142, COL 1]</span>
                            <div className="flex items-center gap-2 px-2 py-1 bg-zinc-900 border border-zinc-800">
                                <Zap size={10} className="text-emerald-500" />
                                <span className="text-[9px] font-bold text-zinc-500 uppercase">GPU_ACCEL</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
