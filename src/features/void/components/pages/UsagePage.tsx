import React from 'react';
import { Link } from 'react-router-dom';
import { mockUsageData } from '../../constants';
import type { UsageMetrics } from '../../types';

const UsageBar: React.FC<{
    label: string;
    used: number;
    total: number;
    unit: string;
}> = ({ label, used, total, unit }) => {
    const percentage = total > 0 ? (used / total) * 100 : 0;

    const formattedUsed = used.toLocaleString();
    const formattedTotal = total.toLocaleString();

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-end">
                <div>
                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">{label}</h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-white tracking-tighter">{formattedUsed}</span>
                        <span className="text-sm font-bold text-zinc-600 tracking-tighter">/ {formattedTotal} {unit}</span>
                    </div>
                </div>
                <span className="text-sm font-bold text-white tracking-tighter">{percentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-zinc-900 h-1 overflow-hidden">
                <div
                    className="bg-white h-full transition-all duration-700 ease-out"
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
};

export const UsagePage: React.FC = () => {
    const usage: UsageMetrics = mockUsageData;
    const nextResetDate = new Date();
    nextResetDate.setMonth(nextResetDate.getMonth() + 1);
    nextResetDate.setDate(1);

    return (
        <div className="max-w-[1240px] mx-auto px-6 py-20">
            <div className="mb-16">
                <span className="inline-block px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500 mb-6">
                    Fleet Metrics
                </span>
                <h1 className="text-5xl font-bold tracking-tighter text-white mb-4">Resource Analytics.</h1>
                <p className="text-zinc-500 text-lg font-medium">Monitor your node consumption for the active protocol cycle.</p>
            </div>

            <div className="border border-zinc-900 bg-black overflow-hidden">
                <div className="p-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 pb-12 border-b border-zinc-900">
                        <div>
                            <h2 className="text-xl font-bold text-white tracking-tight mb-1">Cycle Consumption</h2>
                            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Resets {nextResetDate.toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="px-3 py-1 bg-white text-black text-[10px] font-bold uppercase tracking-widest">Node Pro</span>
                            <Link to="/ide/pricing" className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest hover:text-white transition-colors">Economic Settings</Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-16">
                        <UsageBar
                            label="Mesh Bandwidth"
                            used={usage.bandwidth.used}
                            total={usage.bandwidth.total}
                            unit={usage.bandwidth.unit}
                        />
                        <UsageBar
                            label="Neural Build Cycles"
                            used={usage.buildMinutes.used}
                            total={usage.buildMinutes.total}
                            unit={usage.buildMinutes.unit}
                        />
                        <UsageBar
                            label="Logic Invocations"
                            used={usage.functionInvocations.used}
                            total={usage.functionInvocations.total}
                            unit={usage.functionInvocations.unit}
                        />
                        <UsageBar
                            label="Edge Storage"
                            used={usage.storage.used}
                            total={usage.storage.total}
                            unit={usage.storage.unit}
                        />
                    </div>
                </div>

                <div className="px-10 py-6 bg-zinc-950 border-t border-zinc-900 flex justify-between items-center">
                    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest italic">Protocol status: Operational</p>
                    <Link to="/ide/upgrade" className="text-[10px] font-bold text-white uppercase tracking-widest hover:underline">Scale Infrastructure &rarr;</Link>
                </div>
            </div>
        </div>
    );
};