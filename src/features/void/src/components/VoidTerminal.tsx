import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Command {
    input: string;
    output: React.ReactNode;
    timestamp: number;
}

export const VoidTerminal: React.FC = () => {
    const [history, setHistory] = useState<Command[]>([]);
    const [input, setInput] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Initial welcome message from the "Mirror"
        if (history.length === 0) {
            addOutput('VOID [Mirror v1.0.0] - opendev-labs', 'system');
            addOutput('Connecting to local qvenv...', 'info');
            setTimeout(() => {
                addOutput('Connection established. Quantum state: STABLE.', 'success');
                addOutput('Type "help" for available commands.', 'info');
            }, 800);
        }
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [history]);

    const addOutput = (text: string | React.ReactNode, type: 'info' | 'error' | 'success' | 'system' = 'info') => {
        const content = typeof text === 'string' ? (
            <span className={`
        ${type === 'error' ? 'text-red-400' : ''}
        ${type === 'success' ? 'text-green-400' : ''}
        ${type === 'system' ? 'text-void-neon font-bold' : ''}
        ${type === 'info' ? 'text-zinc-400' : ''}
      `}>{text}</span>
        ) : text;

        setHistory(prev => [...prev, {
            input: '',
            output: content,
            timestamp: Date.now()
        }]);
    };

    const handleCommand = (cmd: string) => {
        const trimmed = cmd.trim().toLowerCase();

        // Echo the command
        setHistory(prev => [...prev, {
            input: cmd,
            output: null,
            timestamp: Date.now()
        }]);

        switch (trimmed) {
            case 'help':
                addOutput(
                    <div className="flex flex-col gap-1 mt-1 mb-2">
                        <div><span className="text-void-neon">void create sanc</span>   : Visualise Sanctum creation</div>
                        <div><span className="text-void-neon">void stabilize</span>     : Trigger stability simulation</div>
                        <div><span className="text-void-neon">void resonate</span>      : Analyze dependency frequencies</div>
                        <div><span className="text-void-neon">void status</span>        : Check connection to Core</div>
                        <div><span className="text-void-neon">clear</span>              : Clear terminal</div>
                    </div>
                );
                break;
            case 'clear':
                setHistory([]);
                break;
            case 'void status':
                addOutput('Scanning connection to local VOID core...', 'info');
                setTimeout(() => addOutput('Core: ONLINE | Latency: <1ms (Entangled)', 'success'), 600);
                break;
            case 'void stabilize':
                addOutput('Initiating stabilization protocol...', 'info');
                // Visual flair could go here
                setTimeout(() => addOutput('Entropy reduced by 42%. State maximized.', 'success'), 1200);
                break;
            case 'void resonate':
                addOutput('Analyzing project resonance...', 'info');
                // This is where we will hook up AI later
                setTimeout(() => addOutput('Resonance analysis complete. No dissonant dependencies found.', 'success'), 1500);
                break;
            default:
                if (trimmed.startsWith('void create sanc')) {
                    addOutput('Sanctum creation visualizer initialized.', 'success');
                } else if (trimmed !== '') {
                    addOutput(`Command not found: ${trimmed}`, 'error');
                }
        }
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input) return;
        handleCommand(input);
        setInput('');
    };

    return (
        <div
            className="w-full max-w-4xl h-[600px] border border-void-line bg-void-bg/90 backdrop-blur-md rounded-lg overflow-hidden flex flex-col font-mono text-sm shadow-2xl relative glow-border"
            onClick={() => inputRef.current?.focus()}
        >
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-void-line bg-void-card">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                </div>
                <div className="text-zinc-500 text-xs">qvenv-shell @ opendev-labs</div>
            </div>

            {/* Output Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar" ref={scrollRef}>
                {history.map((entry, i) => (
                    <div key={i} className="flex flex-col">
                        {entry.input && (
                            <div className="flex gap-2 text-zinc-300">
                                <span className="text-void-neon">❯</span>
                                <span>{entry.input}</span>
                            </div>
                        )}
                        {entry.output && (
                            <div className="ml-4 mb-1">
                                {entry.output}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Input Area */}
            <form onSubmit={onSubmit} className="p-4 bg-void-card/50 border-t border-void-line flex gap-2 items-center">
                <span className="text-void-neon flicker">❯</span>
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="bg-transparent outline-none flex-1 text-zinc-100 placeholder-zinc-700"
                    placeholder="Enter void command..."
                    autoFocus
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />
                {isFocused && <span className="w-2 h-4 bg-void-neon animate-pulse"></span>}
            </form>
        </div>
    );
};
