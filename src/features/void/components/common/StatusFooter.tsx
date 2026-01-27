import React, { useState, useEffect, useRef } from 'react';
import { ChevronUpIcon, ChevronDownIcon } from './Icons';

const systemStatus = [
    { name: 'Nexus API', status: 'Operational' },
    { name: 'Neural Pipeline', status: 'Operational' },
    { name: 'Edge Registry', status: 'Degraded High-Latency' },
    { name: 'Protocol Databases', status: 'Operational' },
];

const StatusDot: React.FC<{ status: string }> = ({ status }) => {
    const color = status === 'Operational' ? 'bg-white' : status.includes('Degraded') ? 'bg-zinc-600' : 'bg-red-900';
    return <div className={`w-1.5 h-1.5 rounded-full ${color}`}></div>;
};

export const StatusFooter: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const footerRef = useRef<HTMLDivElement>(null);

    const overallStatus = systemStatus.some(s => s.status !== 'Operational') ? 'Latency Detected' : 'All Nexus Operational';
    const hasIssue = overallStatus !== 'All Nexus Operational';
    const overallStatusColor = 'text-white';
    const overallStatusBgColor = hasIssue ? 'bg-zinc-600' : 'bg-white';

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (footerRef.current && !footerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={footerRef} className="fixed bottom-6 right-6 z-50 selection:bg-white selection:text-black">
            <div className="relative">
                {/* Expanded Panel */}
                <div
                    id="status-panel"
                    className={`
                        absolute bottom-full right-0 mb-4 w-72 bg-black border border-zinc-900 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] transition-all duration-500 ease-[0.22,1,0.36,1] origin-bottom-right
                        ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
                    `}
                >
                    <div className="px-6 py-5 border-b border-zinc-900 bg-zinc-950/50">
                        <h4 className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">Nexus Status</h4>
                    </div>
                    <div className="p-6 space-y-5">
                        {systemStatus.map(item => (
                            <div key={item.name} className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                                <span className="text-zinc-500">{item.name}</span>
                                <div className="flex items-center gap-3">
                                    <StatusDot status={item.status} />
                                    <span className={item.status === 'Operational' ? 'text-zinc-400' : 'text-zinc-600 underline decoration-zinc-800'}>
                                        {item.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 border-t border-zinc-900 text-center bg-black">
                        <a href="#" onClick={(e) => e.preventDefault()} className="text-[9px] font-bold text-zinc-700 hover:text-white uppercase tracking-widest transition-colors">Nexus Telemetry &rarr;</a>
                    </div>
                </div>

                {/* Toggle Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-4 bg-black border border-zinc-900 h-10 px-4 shadow-2xl hover:border-white transition-all duration-500 group"
                    aria-expanded={isOpen}
                    aria-controls="status-panel"
                >
                    <div className="flex items-center gap-3">
                        <div className="relative flex h-1.5 w-1.5">
                            {hasIssue && (
                                <div className="absolute inline-flex h-full w-full rounded-full bg-white opacity-40 animate-ping"></div>
                            )}
                            <div className={`relative inline-flex rounded-full h-1.5 w-1.5 ${overallStatusBgColor}`}></div>
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-[0.2em] transform transition-all duration-500 ${isOpen ? 'translate-x-1' : ''} ${overallStatusColor}`}>{overallStatus}</span>
                    </div>
                    {isOpen ? <ChevronDownIcon className="h-3 w-3 text-white" /> : <ChevronUpIcon className="h-3 w-3 text-zinc-600 group-hover:text-white transition-colors" />}
                </button>
            </div>
        </div>
    );
};

