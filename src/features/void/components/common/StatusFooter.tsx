import React, { useState, useEffect, useRef } from 'react';
import { ChevronUpIcon, ChevronDownIcon } from './Icons';

const systemStatus = [
    { name: 'Global API', status: 'Operational' },
    { name: 'Build Pipeline', status: 'Operational' },
    { name: 'Edge Network', status: 'Degraded Performance' },
    { name: 'Databases', status: 'Operational' },
];

const StatusDot: React.FC<{ status: string }> = ({ status }) => {
    const color = status === 'Operational' ? 'bg-green-500' : status.includes('Degraded') ? 'bg-yellow-500' : 'bg-red-500';
    return <div className={`w-2 h-2 rounded-full ${color}`}></div>;
};

export const StatusFooter: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const footerRef = useRef<HTMLDivElement>(null);

    const overallStatus = systemStatus.some(s => s.status !== 'Operational') ? 'Degraded Performance' : 'All Systems Operational';
    const hasIssue = overallStatus !== 'All Systems Operational';
    const overallStatusColor = hasIssue ? 'text-yellow-400' : 'text-green-400';
    const overallStatusBgColor = hasIssue ? 'bg-yellow-500' : 'bg-green-500';
    const overallStatusPingColor = hasIssue ? 'bg-yellow-400' : 'bg-green-400';

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
        <div ref={footerRef} className="fixed bottom-4 right-4 z-50">
            <div className="relative">
                {/* Expanded Panel */}
                <div 
                    id="status-panel"
                    className={`
                        absolute bottom-full right-0 mb-2 w-80 bg-void-card border border-void-line rounded-lg shadow-2xl transition-all duration-300 ease-in-out origin-bottom-right
                        ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
                    `}
                >
                    <div className="p-4 border-b border-void-line">
                        <h4 className="font-semibold text-white">System Status</h4>
                    </div>
                    <div className="p-4 space-y-3">
                        {systemStatus.map(item => (
                            <div key={item.name} className="flex justify-between items-center text-sm">
                                <span className="text-zinc-300">{item.name}</span>
                                <div className="flex items-center gap-2">
                                    <StatusDot status={item.status} />
                                    <span className={item.status === 'Operational' ? 'text-green-400' : 'text-yellow-400'}>
                                        {item.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-2 border-t border-void-line text-center bg-void-line/20 rounded-b-lg">
                        <a href="#" onClick={(e) => e.preventDefault()} className="text-xs text-zinc-400 hover:text-void-neon">Visit Status Page &rarr;</a>
                    </div>
                </div>

                {/* Toggle Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-3 bg-void-card border border-zinc-700 px-3 py-1.5 text-sm shadow-lg rounded-lg w-full justify-between"
                    aria-expanded={isOpen}
                    aria-controls="status-panel"
                >
                    <div className="flex items-center gap-2">
                        <div className="relative flex h-2.5 w-2.5">
                            {hasIssue && (
                                <div className={`absolute inline-flex h-full w-full rounded-full ${overallStatusPingColor} opacity-75 animate-ping`}></div>
                            )}
                            <div className={`relative inline-flex rounded-full h-2.5 w-2.5 ${overallStatusBgColor}`}></div>
                        </div>
                        <span className={`${overallStatusColor}`}>{overallStatus}</span>
                    </div>
                    {isOpen ? <ChevronDownIcon className="h-4 w-4 text-zinc-400" /> : <ChevronUpIcon className="h-4 w-4 text-zinc-400 hover:text-white" />}
                </button>
            </div>
        </div>
    );
};
