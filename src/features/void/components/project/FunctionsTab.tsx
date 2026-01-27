import React from 'react';
import type { ServerlessFunction } from '../../types';
import { FunctionStatus } from '../../types';

const FunctionStatusIndicator: React.FC<{ status: FunctionStatus }> = ({ status }) => {
    const config = {
        [FunctionStatus.ACTIVE]: 'bg-green-500',
        [FunctionStatus.IDLE]: 'bg-zinc-500',
        [FunctionStatus.ERROR]: 'bg-red-500',
    };
    return <div className={`w-2.5 h-2.5 rounded-full ${config[status]}`}></div>;
};


export const FunctionsTab: React.FC<{ functions: ServerlessFunction[] }> = ({ functions }) => {
    return (
        <div className="bg-void-card border border-void-line rounded-lg overflow-hidden">
             <div className="p-6 border-b border-void-line">
                <h3 className="font-semibold text-white text-xl">Serverless Functions</h3>
            </div>
            <table className="w-full text-sm">
                <thead className="text-left text-xs text-zinc-400 uppercase bg-void-line/30">
                    <tr>
                        <th className="p-3 font-semibold">Status</th>
                        <th className="p-3 font-semibold">Name</th>
                        <th className="p-3 font-semibold">Path</th>
                        <th className="p-3 font-semibold">Region</th>
                        <th className="p-3 font-semibold text-right">Invocations</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-void-line">
                    {functions.map(fn => (
                        <tr key={fn.id}>
                            <td className="p-3">
                                <div className="flex items-center gap-2">
                                    <FunctionStatusIndicator status={fn.status} />
                                    <span className="text-zinc-300">{fn.status}</span>
                                </div>
                            </td>
                            <td className="p-3 text-white font-medium font-mono">{fn.name}</td>
                            <td className="p-3 text-zinc-400 font-mono">{fn.path}</td>
                            <td className="p-3 text-zinc-400">{fn.region}</td>
                            <td className="p-3 text-white text-right font-mono">{fn.invocations.toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};