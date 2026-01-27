import React from 'react';
import type { ServerlessFunction } from '../../types';
import { FunctionStatus } from '../../types';

const FunctionStatusIndicator: React.FC<{ status: FunctionStatus }> = ({ status }) => {
    const config = {
        [FunctionStatus.ACTIVE]: 'bg-white',
        [FunctionStatus.IDLE]: 'bg-zinc-800',
        [FunctionStatus.ERROR]: 'bg-red-600',
    };
    return <div className={`w-1.5 h-1.5 rounded-full ${config[status]}`}></div>;
};


export const FunctionsTab: React.FC<{ functions: ServerlessFunction[] }> = ({ functions }) => {
    return (
        <div className="border border-zinc-900 bg-black overflow-hidden">
            <div className="px-8 py-5 border-b border-zinc-900 bg-zinc-950/50">
                <h3 className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">Logic Primitives</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-zinc-900 bg-zinc-950/30">
                            <th className="px-8 py-4 text-[9px] font-bold text-zinc-600 uppercase tracking-[0.2em]">Protocol</th>
                            <th className="px-8 py-4 text-[9px] font-bold text-zinc-600 uppercase tracking-[0.2em]">Identity</th>
                            <th className="px-8 py-4 text-[9px] font-bold text-zinc-600 uppercase tracking-[0.2em]">Gateway</th>
                            <th className="px-8 py-4 text-[9px] font-bold text-zinc-600 uppercase tracking-[0.2em]">Nexus Node</th>
                            <th className="px-8 py-4 text-[9px] font-bold text-zinc-600 uppercase tracking-[0.2em] text-right">Executions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900">
                        {functions.map(fn => (
                            <tr key={fn.id} className="hover:bg-zinc-950/50 transition-all">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-3">
                                        <FunctionStatusIndicator status={fn.status} />
                                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none">{fn.status}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-[13px] font-bold text-white tracking-tight">{fn.name}</td>
                                <td className="px-8 py-6 text-[11px] font-mono text-zinc-500">{fn.path}</td>
                                <td className="px-8 py-6 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{fn.region}</td>
                                <td className="px-8 py-6 text-[11px] font-bold text-white text-right font-mono">{fn.invocations.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};