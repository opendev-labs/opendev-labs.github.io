import React from 'react';
import { PageWrapper } from './common/PageWrapper';
import { mockUsageData } from '../constants';
import type { UsageMetrics } from '../types';
import { safeNavigate } from '../services/navigation';

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
        <div>
            <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-semibold text-white">{label}</h3>
                <div className="text-sm text-zinc-400 flex items-baseline gap-4">
                    <span className="font-mono text-base text-white">{percentage.toFixed(1)}%</span>
                    <span>
                        <span className="font-bold text-white">{formattedUsed}</span> / {formattedTotal} {unit}
                    </span>
                </div>
            </div>
            <div className="w-full bg-void-line h-3 rounded-full overflow-hidden">
                <div
                    className="bg-gradient-to-r from-void-accent to-void-neon h-3 rounded-full transition-all duration-500"
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

    const handleManagePlan = (e: React.MouseEvent) => {
        e.preventDefault();
        safeNavigate('/pricing');
    };

    return (
        <PageWrapper
            title="Usage"
            subtitle="Monitor your resource consumption for the current billing period."
        >
            <div className="bg-void-card border border-void-line rounded-lg">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-white">Current Period Usage</h2>
                            <p className="text-sm text-zinc-500">Resets on {nextResetDate.toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-semibold text-void-neon">Pro Plan</p>
                            <button onClick={handleManagePlan} className="text-sm text-zinc-400 hover:text-white hover:underline">Manage Plan</button>
                        </div>
                    </div>
                    <div className="space-y-8">
                        <UsageBar
                            label="Bandwidth"
                            used={usage.bandwidth.used}
                            total={usage.bandwidth.total}
                            unit={usage.bandwidth.unit}
                        />
                        <UsageBar
                            label="Build Minutes"
                            used={usage.buildMinutes.used}
                            total={usage.buildMinutes.total}
                            unit={usage.buildMinutes.unit}
                        />
                        <UsageBar
                            label="Function Invocations"
                            used={usage.functionInvocations.used}
                            total={usage.functionInvocations.total}
                            unit={usage.functionInvocations.unit}
                        />
                        <UsageBar
                            label="Storage"
                            used={usage.storage.used}
                            total={usage.storage.total}
                            unit={usage.storage.unit}
                        />
                    </div>
                </div>
                <div className="p-4 bg-void-line/30 border-t border-void-line rounded-b-lg">
                    <p className="text-xs text-zinc-500 text-center">Need more resources? <a href="/#/upgrade" onClick={(e) => { e.preventDefault(); safeNavigate('/upgrade'); }} className="text-void-neon hover:underline">Upgrade to Enterprise</a>.</p>
                </div>
            </div>
        </PageWrapper>
    );
};