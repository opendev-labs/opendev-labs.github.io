import React, { useState, useEffect } from 'react';
import { UserIcon, BuildingIcon, CreditCardIcon, KeyIcon, ShieldIcon } from './icons/Icons';
import { useAuth } from '../../../../../hooks/useAuth';
import { getSystemIntegrity } from '../../../../../../../lib/lamaDB/config';
import { toast } from 'sonner';

// Reusable component for a setting card
const SettingsCard: React.FC<{ icon: React.ReactNode; title: string; description: string; children: React.ReactNode }> = ({ icon, title, description, children }) => (
    <div className="bg-zinc-950 border border-zinc-900 rounded-none overflow-hidden mb-8">
        <div className="p-8 border-b border-zinc-900">
            <div className="flex items-start gap-6">
                <div className="text-zinc-500">{icon}</div>
                <div>
                    <h2 className="text-[11px] font-bold text-white uppercase tracking-[0.3em] mb-1">{title}</h2>
                    <p className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest">{description}</p>
                </div>
            </div>
        </div>
        <div className="p-8 bg-black">
            {children}
        </div>
    </div>
);

const SettingsRow: React.FC<{ label: string; children: React.ReactNode; }> = ({ label, children }) => (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 border-b border-zinc-900 last:border-b-0">
        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4 sm:mb-0">{label}</label>
        <div className="w-full sm:w-auto">{children}</div>
    </div>
);

export function SettingsView() {
    const { profile, updateProfile } = useAuth();
    const integrity = getSystemIntegrity();
    
    const [apiKeys, setApiKeys] = useState({
        geminiApiKey: profile?.geminiApiKey || '',
        openRouterApiKey: profile?.openRouterApiKey || '',
        openaiApiKey: profile?.openaiApiKey || '',
        deepseekApiKey: profile?.deepseekApiKey || '',
    });

    useEffect(() => {
        if (profile) {
            setApiKeys({
                geminiApiKey: profile.geminiApiKey || '',
                openRouterApiKey: profile.openRouterApiKey || '',
                openaiApiKey: profile.openaiApiKey || '',
                deepseekApiKey: profile.deepseekApiKey || '',
            });
        }
    }, [profile]);

    const handleSaveKeys = async () => {
        try {
            await updateProfile(apiKeys);
            toast.success("Materialization Handshake Updated");
        } catch (error) {
            toast.error("Failed to update handshake parameters");
        }
    };

    return (
        <div className="h-full overflow-y-auto bg-black text-white selection:bg-white selection:text-black">
            <div className="max-w-4xl mx-auto p-12">
                <header className="mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 text-[9px] font-bold text-zinc-500 mb-6 uppercase tracking-[0.3em]">
                        System // Core Configuration
                    </div>
                    <h1 className="text-6xl font-bold tracking-tighter lowercase leading-none">
                        uplink<br /><span className="text-zinc-600">parameters.</span>
                    </h1>
                </header>

                <div className="space-y-4">
                    <SettingsCard
                        icon={<UserIcon className="w-5 h-5" />}
                        title="Neural Profile"
                        description="Identity parameters and handshake preferences."
                    >
                        <div className="space-y-2">
                            <SettingsRow label="Full Name">
                                <input type="text" disabled value="Sovereign User" className="bg-zinc-900/50 border border-zinc-800 rounded-none px-4 py-2 text-[11px] font-mono w-full sm:w-80 text-zinc-500 cursor-not-allowed focus:outline-none" />
                            </SettingsRow>
                            <SettingsRow label="Uplink ID">
                                <input type="email" disabled value="uplink@opendev-labs.io" className="bg-zinc-900/50 border border-zinc-800 rounded-none px-4 py-2 text-[11px] font-mono w-full sm:w-80 text-zinc-500 cursor-not-allowed focus:outline-none" />
                            </SettingsRow>
                            <SettingsRow label="System Theme">
                                <select disabled className="bg-zinc-900/50 border border-zinc-800 rounded-none px-4 py-2 text-[11px] font-mono w-full sm:w-80 text-zinc-500 cursor-not-allowed appearance-none focus:outline-none">
                                    <option>Titan // Black</option>
                                </select>
                            </SettingsRow>
                        </div>
                    </SettingsCard>

                    <SettingsCard
                        icon={<BuildingIcon className="w-5 h-5" />}
                        title="Consortium"
                        description="Cluster management and role distribution."
                    >
                        <div className="space-y-2">
                            <SettingsRow label="Consortium Name">
                                <input type="text" disabled value="OpenDev Labs" className="bg-zinc-900/50 border border-zinc-800 rounded-none px-4 py-2 text-[11px] font-mono w-full sm:w-80 text-zinc-500 cursor-not-allowed focus:outline-none" />
                            </SettingsRow>
                            <SettingsRow label="Active Nodes">
                                <button disabled className="px-6 py-2 text-[10px] font-bold uppercase tracking-widest bg-zinc-900 text-zinc-700 cursor-not-allowed border border-zinc-800">Invite Architects</button>
                            </SettingsRow>
                        </div>
                    </SettingsCard>

                    <SettingsCard
                        icon={<CreditCardIcon className="w-5 h-5" />}
                        title="Compute Credits"
                        description="Resource allocation and usage history."
                    >
                        <SettingsRow label="Resource Plan">
                            <div className="flex items-center gap-6">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-orange-500 border border-orange-500/30 px-3 py-1 bg-orange-500/5">Unlimited Compute</span>
                                <button disabled className="px-6 py-2 text-[10px] font-bold uppercase tracking-widest bg-zinc-900 text-zinc-700 cursor-not-allowed border border-zinc-800">Manage Allocation</button>
                            </div>
                        </SettingsRow>
                    </SettingsCard>

                    <SettingsCard
                        icon={<KeyIcon className="w-5 h-5" />}
                        title="Materialization Handshake"
                        description="Custom model authentication for decentralized materialization."
                    >
                        <div className="space-y-4">
                            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-[0.2em] leading-relaxed mb-4">
                                Pro-Tip: User-provided keys prioritize local materialization over the mesh-wide defaults.
                            </p>
                            
                            <SettingsRow label="Gemini API Key">
                                <input 
                                    type="password" 
                                    placeholder="Enter your Google Gemini key..."
                                    value={apiKeys.geminiApiKey}
                                    onChange={(e) => setApiKeys({...apiKeys, geminiApiKey: e.target.value})}
                                    className="bg-zinc-950 border border-zinc-900 focus:border-orange-500/50 rounded-none px-4 py-2 text-[11px] font-mono w-full sm:w-80 text-white transition-all focus:outline-none" 
                                />
                            </SettingsRow>
                            
                            <SettingsRow label="OpenRouter Key">
                                <input 
                                    type="password" 
                                    placeholder="Enter your OpenRouter key..."
                                    value={apiKeys.openRouterApiKey}
                                    onChange={(e) => setApiKeys({...apiKeys, openRouterApiKey: e.target.value})}
                                    className="bg-zinc-950 border border-zinc-900 focus:border-orange-500/50 rounded-none px-4 py-2 text-[11px] font-mono w-full sm:w-80 text-white transition-all focus:outline-none" 
                                />
                            </SettingsRow>
                            
                            <SettingsRow label="OpenRouter Key">
                                <input 
                                    type="password" 
                                    placeholder="Enter your OpenAI key..."
                                    value={apiKeys.openaiApiKey}
                                    onChange={(e) => setApiKeys({...apiKeys, openaiApiKey: e.target.value})}
                                    className="bg-zinc-950 border border-zinc-900 focus:border-orange-500/50 rounded-none px-4 py-2 text-[11px] font-mono w-full sm:w-80 text-white transition-all focus:outline-none" 
                                />
                            </SettingsRow>

                            <div className="pt-6 flex justify-end">
                                <button 
                                    onClick={handleSaveKeys}
                                    className="px-8 py-2 text-[10px] font-bold uppercase tracking-[0.3em] bg-white text-black hover:bg-orange-500 hover:text-white transition-all duration-300"
                                >
                                    Apply Configuration
                                </button>
                            </div>
                        </div>
                    </SettingsCard>

                    <SettingsCard
                        icon={<ShieldIcon className="w-5 h-5" />}
                        title="System Integrity"
                        description="Core mesh diagnostics and connectivity reporting."
                    >
                        <div className="space-y-6">
                            <div className="p-4 bg-zinc-950 border border-zinc-900">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Database Cluster Status</span>
                                    <span className={`text-[10px] font-bold uppercase tracking-widest ${integrity.mode === 'PRODUCTION' ? 'text-green-500' : 'text-orange-500 animate-pulse'}`}>
                                        {integrity.mode} Mode
                                    </span>
                                </div>
                                
                                <div className="space-y-2">
                                    {integrity.missingVariables.length > 0 ? (
                                        <>
                                            <p className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest mb-2">// Missing Environment Variables (Vercel):</p>
                                            {integrity.missingVariables.map(v => (
                                                <div key={v} className="flex items-center gap-2 text-[10px] font-mono text-zinc-700">
                                                    <span className="text-red-900">❌</span> {v}
                                                </div>
                                            ))}
                                            <p className="mt-4 text-[9px] text-zinc-700 uppercase leading-relaxed font-bold tracking-widest italic">
                                                Note: Add these variables to your Vercel Dashboard to enable 'Production' mode and global search.
                                            </p>
                                        </>
                                    ) : (
                                        <div className="flex items-center gap-2 text-[10px] font-mono text-green-700">
                                            <span className="text-green-900">✅</span> All core variables materialized. Mesh integrity is 100%.
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <SettingsRow label="Uplink Logs">
                                <button disabled className="px-6 py-2 text-[10px] font-bold uppercase tracking-widest bg-zinc-900 text-zinc-700 cursor-not-allowed border border-zinc-800">View Transactions</button>
                            </SettingsRow>
                        </div>
                    </SettingsCard>
                </div>
            </div>
        </div>
    );
}
