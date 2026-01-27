

import React from 'react';
import { PageWrapper } from '../common/PageWrapper';
// FIX: Add missing ChartBarIcon import.
import { CheckCircleIcon, XCircleIcon, SparklesIcon, CpuChipIcon, UserGroupIcon, RocketLaunchIcon, ChartBarIcon } from '../common/Icons';

const FeatureRow: React.FC<{ feature: string; hobby: React.ReactNode; pro: React.ReactNode; icon: React.ReactNode }> = ({ feature, hobby, pro, icon }) => (
    <tr className="border-b border-void-line last:border-b-0">
        <td className="py-4 px-6 text-left">
            <div className="flex items-center gap-3">
                <span className="text-zinc-400">{icon}</span>
                <span className="text-zinc-300">{feature}</span>
            </div>
        </td>
        <td className="py-4 px-6 text-center text-zinc-400">{hobby}</td>
        <td className="py-4 px-6 text-center text-white font-medium glow-cell">{pro}</td>
    </tr>
);


export const UpgradePage: React.FC = () => {
    return (
        <PageWrapper
            title="Unlock the Full Power of Void"
            subtitle="Upgrade to Pro to access advanced features, enhanced performance, and priority support for your projects."
        >
            <div 
                className="bg-void-card border border-void-line rounded-lg overflow-hidden glow-border"
                onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    e.currentTarget.style.setProperty('--glow-x', `${e.clientX - rect.left}px`);
                    e.currentTarget.style.setProperty('--glow-y', `${e.clientY - rect.top}px`);
                }}
            >
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-void-neon/10 to-transparent" style={{ left: '66.66%' }}></div>
                    <table className="w-full text-sm relative">
                        <thead>
                            <tr className="border-b-2 border-void-line bg-void-line/30">
                                <th className="py-4 px-6 text-left font-semibold text-white tracking-wider uppercase w-1/3">Feature</th>
                                <th className="py-4 px-6 text-center font-semibold text-white tracking-wider uppercase w-1/3">Hobby</th>
                                <th className="py-4 px-6 text-center font-semibold text-void-neon tracking-wider uppercase rounded-tr-lg border-l border-b-2 border-void-neon/50 w-1/3">
                                    Pro
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <FeatureRow feature="Team Members" icon={<UserGroupIcon />} hobby="1 User" pro="Unlimited Users" />
                            <FeatureRow feature="Performance" icon={<RocketLaunchIcon />} hobby="Standard Network" pro="High-Performance Edge Network" />
                            <FeatureRow feature="Serverless Functions" icon={<CpuChipIcon />} hobby={<XCircleIcon className="mx-auto text-zinc-600" />} pro={<CheckCircleIcon className="mx-auto text-void-neon" />} />
                            <FeatureRow feature="AI Assistant" icon={<SparklesIcon />} hobby="Standard" pro="Advanced Analysis & Suggestions" />
                            <FeatureRow feature="Analytics" icon={<ChartBarIcon />} hobby="7-day Retention" pro="30-day Retention & Insights" />
                            <FeatureRow feature="Support" icon={<UserGroupIcon />} hobby="Community" pro="Priority Email Support" />
                        </tbody>
                    </table>
                </div>
                 <div className="p-8 text-center bg-void-neon/5 border-t border-void-neon/50">
                    <h3 className="text-2xl font-bold text-white">Ready to Level Up?</h3>
                    <p className="text-zinc-400 mt-2">Join thousands of developers building faster on the Void Pro plan.</p>
                     <button className="mt-6 group relative inline-flex items-center justify-center overflow-hidden rounded-md bg-void-neon px-8 py-3 text-base font-semibold text-black shadow-lg transition-all duration-300 hover:scale-105">
                         <span className="absolute -inset-full top-0 block -translate-y-full rounded-md bg-white/30 transition-all duration-500 group-hover:translate-y-0"></span>
                        <span className="relative">Upgrade to Pro for $20/month</span>
                    </button>
                </div>
            </div>
        </PageWrapper>
    );
};