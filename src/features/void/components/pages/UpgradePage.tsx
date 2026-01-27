import React from 'react';
import { CheckCircleIcon, XCircleIcon, SparklesIcon, CpuChipIcon, UserGroupIcon, RocketLaunchIcon, ChartBarIcon } from '../common/Icons';

const FeatureRow: React.FC<{ feature: string; hobby: React.ReactNode; pro: React.ReactNode; icon: React.ReactNode }> = ({ feature, hobby, pro, icon }) => (
    <tr className="border-b border-zinc-900 last:border-b-0 group">
        <td className="py-6 px-8 text-left transition-colors group-hover:bg-zinc-950">
            <div className="flex items-center gap-4">
                <span className="text-zinc-600 group-hover:text-white transition-colors">{icon}</span>
                <span className="text-sm font-bold text-zinc-400 group-hover:text-white transition-colors">{feature}</span>
            </div>
        </td>
        <td className="py-6 px-8 text-center text-zinc-600 text-[13px] font-medium transition-colors group-hover:bg-zinc-950">{hobby}</td>
        <td className="py-6 px-8 text-center text-white text-[13px] font-bold transition-colors group-hover:bg-zinc-950 bg-white/[0.02]">{pro}</td>
    </tr>
);


export const UpgradePage: React.FC = () => {
    return (
        <div className="max-w-[1000px] mx-auto px-6 py-20">
            <div className="text-center mb-20">
                <span className="inline-block px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500 mb-8">
                    Tier Escalation
                </span>
                <h1 className="text-5xl md:text-6xl font-bold tracking-tighter text-white mb-6">Scale your protocol.</h1>
                <p className="text-zinc-500 max-w-xl mx-auto text-lg font-medium leading-relaxed">Upgrade to Node Pro for advanced analysis, enhanced edge performance, and priority support.</p>
            </div>

            <div className="border border-zinc-900 bg-black overflow-hidden shadow-2xl">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-zinc-900 bg-zinc-950">
                            <th className="py-5 px-8 text-left text-[10px] font-bold text-zinc-500 uppercase tracking-widest w-1/3">Infrastructure</th>
                            <th className="py-5 px-8 text-center text-[10px] font-bold text-zinc-500 uppercase tracking-widest w-1/3">Hobby</th>
                            <th className="py-5 px-8 text-center text-[10px] font-bold text-white uppercase tracking-widest w-1/3 bg-white/[0.05]">
                                Node Pro
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <FeatureRow feature="Network Nodes" icon={<UserGroupIcon />} hobby="1 Architect" pro="Unlimited Fleet" />
                        <FeatureRow feature="Edge Velocity" icon={<RocketLaunchIcon />} hobby="Standard Routing" pro="High-Velocity Mesh" />
                        <FeatureRow feature="Logic Primitives" icon={<CpuChipIcon />} hobby={<XCircleIcon className="mx-auto w-5 h-5 text-zinc-800" />} pro={<CheckCircleIcon className="mx-auto w-5 h-5 text-white" />} />
                        <FeatureRow feature="Neural Assistant" icon={<SparklesIcon />} hobby="Standard" pro="Advanced Synthesis" />
                        <FeatureRow feature="Metric Retention" icon={<ChartBarIcon />} hobby="7-day Cycle" pro="Global History" />
                        <FeatureRow feature="Support Queue" icon={<UserGroupIcon />} hobby="Community" pro="Direct Architecture Support" />
                    </tbody>
                </table>

                <div className="p-12 text-center border-t border-zinc-900 bg-zinc-950">
                    <h3 className="text-2xl font-bold text-white tracking-tight mb-3">Ready to escalation protocol?</h3>
                    <p className="text-zinc-500 text-sm font-medium mb-10">Join thousands of developers building sovereign systems on opendev-labs.</p>

                    <button className="h-14 px-12 bg-white text-black text-xs font-bold tracking-[0.2em] uppercase hover:bg-zinc-200 transition-all shadow-lg shadow-white/5">
                        Upgrade to Node Pro &mdash; $20/mo
                    </button>
                </div>
            </div>
        </div>
    );
};