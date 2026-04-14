import React, { useState, useEffect } from 'react';
import { UserIcon, BuildingIcon, CreditCardIcon, KeyIcon, ShieldIcon } from './icons/Icons';
import { useAuth } from '../../../../../hooks/useAuth';
import { getSystemIntegrity } from '../../../../../../../lib/lamaDB/config';
import { toast } from 'sonner';

// Reusable component for a setting card
const SettingsCard: React.FC<{ icon: React.ReactNode; title: string; description: string; children: React.ReactNode }> = ({ icon, title, description, children }) => (
    <div className="bg-[#0A0A0A]/50 backdrop-blur-sm border border-zinc-900/50 rounded-2xl overflow-hidden mb-6 shadow-sm">
        <div className="p-8 border-b border-zinc-900/30">
            <div className="flex items-start gap-4">
                <div className="text-zinc-600 p-2 bg-zinc-900/50 rounded-lg border border-zinc-800/50">{icon}</div>
                <div>
                    <h2 className="text-[11px] font-bold text-white uppercase tracking-[0.2em] mb-1">{title}</h2>
                    <p className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest opacity-80">{description}</p>
                </div>
            </div>
        </div>
        <div className="p-8 bg-transparent">
            {children}
        </div>
    </div>
);

const SettingsRow: React.FC<{ label: string; children: React.ReactNode; }> = ({ label, children }) => (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-6 border-b border-zinc-900/30 last:border-b-0">
        <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.3em] mb-4 sm:mb-0">{label}</label>
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
        <div className="h-full overflow-y-auto bg-[#080808] text-white selection:bg-white/10 selection:text-white custom-scrollbar transition-all duration-500">
            <div className="max-w-5xl mx-auto p-12 lg:p-20">
                <header className="mb-20">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-900/50 border border-zinc-800/50 text-[9px] font-bold text-zinc-600 mb-8 uppercase tracking-[0.3em] rounded-lg font-mono">
                        <div className="w-1 h-1 rounded-full bg-zinc-700" />
                        System // Core Parameters
                    </div>
                    <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-white mb-4">
                        Handshake.<br /><span className="text-zinc-800">Uplink Configuration.</span>
                    </h1>
                </header>

                <div className="space-y-6">
                    <SettingsCard
                        icon={<UserIcon className="w-4 h-4" />}
                        title="Neural Profile"
                        description="Identity parameters and handshake preferences."
                    >
                        <div className="space-y-2">
                            <SettingsRow label="Full Name">
                                <input type="text" disabled value="Sovereign User" className="bg-zinc-900/30 border border-zinc-800/30 rounded-xl px-4 py-2.5 text-[11px] font-mono w-full sm:w-80 text-zinc-600 cursor-not-allowed focus:outline-none" />
                            </SettingsRow>
                            <SettingsRow label="Uplink ID">
                                <input type="email" disabled value="uplink@opendev-labs.io" className="bg-zinc-900/30 border border-zinc-800/30 rounded-xl px-4 py-2.5 text-[11px] font-mono w-full sm:w-80 text-zinc-600 cursor-not-allowed focus:outline-none" />
                            </SettingsRow>
                            <SettingsRow label="System Theme">
                                <div className="bg-zinc-900/30 border border-zinc-800/30 rounded-xl px-4 py-2.5 text-[11px] font-mono w-full sm:w-80 text-zinc-600 opacity-50">
                                   Titan // Black (Standard)
                                </div>
                            </SettingsRow>
                        </div>
                    </SettingsCard>

                    <SettingsCard
                        icon={<BuildingIcon className="w-4 h-4" />}
                        title="Consortium"
                        description="Cluster management and role distribution."
                    >
                        <div className="space-y-2">
                            <SettingsRow label="Consortium Name">
                                <input type="text" disabled value="OpenDev Labs" className="bg-zinc-900/30 border border-zinc-800/30 rounded-xl px-4 py-2.5 text-[11px] font-mono w-full sm:w-80 text-zinc-600 cursor-not-allowed focus:outline-none" />
                            </SettingsRow>
                            <SettingsRow label="Active Nodes">
                                <button disabled className="px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest bg-zinc-900/50 text-zinc-700 cursor-not-allowed border border-zinc-800/50 rounded-xl">Invite Architects</button>
                            </SettingsRow>
                        </div>
                    </SettingsCard>

                    <SettingsCard
                        icon={<CreditCardIcon className="w-4 h-4" />}
                        title="Compute Credits"
                        description="Resource allocation and usage history."
                    >
                        <SettingsRow label="Resource Plan">
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500/80 border border-emerald-500/20 px-4 py-2 bg-emerald-500/5 rounded-full">Unlimited Compute // Active</span>
                                <button disabled className="px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest bg-zinc-900/50 text-zinc-700 cursor-not-allowed border border-zinc-800/50 rounded-xl">Manage Allocation</button>
                            </div>
                        </SettingsRow>
                    </SettingsCard>

                    <SettingsCard
                        icon={<KeyIcon className="w-4 h-4" />}
                        title="Materialization Handshake"
                        description="Custom model authentication for decentralized materialization."
                    >
                        <div className="space-y-4">
                            <div className="p-4 bg-zinc-900/30 border border-zinc-800/30 rounded-xl mb-6">
                               <p className="text-[10px] text-zinc-600 uppercase font-bold tracking-[0.2em] leading-relaxed">
                                   Uplink Priority: Local materialization keys will override system mesh protocols. Ensure integrity before application.
                               </p>
                            </div>
                            
                            <SettingsRow label="Gemini API Key">
                                <input 
                                    type="password" 
                                    placeholder="Enter your Google Gemini key..."
                                    value={apiKeys.geminiApiKey}
                                    onChange={(e) => setApiKeys({...apiKeys, geminiApiKey: e.target.value})}
                                    className="bg-[#050505] border border-zinc-900/80 focus:border-zinc-700 rounded-xl px-4 py-3 text-[11px] font-mono w-full sm:w-80 text-white transition-all focus:outline-none" 
                                />
                            </SettingsRow>
                            
                            <SettingsRow label="OpenRouter Key">
                                <input 
                                    type="password" 
                                    placeholder="Enter your OpenRouter key..."
                                    value={apiKeys.openRouterApiKey}
                                    onChange={(e) => setApiKeys({...apiKeys, openRouterApiKey: e.target.value})}
                                    className="bg-[#050505] border border-zinc-900/80 focus:border-zinc-700 rounded-xl px-4 py-3 text-[11px] font-mono w-full sm:w-80 text-white transition-all focus:outline-none" 
                                />
                            </SettingsRow>
                            
                            <SettingsRow label="OpenAI Key">
                                <input 
                                    type="password" 
                                    placeholder="Enter your OpenAI key..."
                                    value={apiKeys.openaiApiKey}
                                    onChange={(e) => setApiKeys({...apiKeys, openaiApiKey: e.target.value})}
                                    className="bg-[#050505] border border-zinc-900/80 focus:border-zinc-700 rounded-xl px-4 py-3 text-[11px] font-mono w-full sm:w-80 text-white transition-all focus:outline-none" 
                                />
                            </SettingsRow>

                            <div className="pt-8 flex justify-end">
                                <button 
                                    onClick={handleSaveKeys}
                                    className="px-10 py-3 text-[10px] font-bold uppercase tracking-[0.3em] bg-white text-black hover:bg-zinc-200 transition-all duration-300 rounded-xl shadow-lg"
                                >
                                    Apply Handshake
                                </button>
                            </div>
                        </div>
                    </SettingsCard>

                    <SettingsCard
                        icon={<ShieldIcon className="w-4 h-4" />}
                        title="System Integrity"
                        description="Core mesh diagnostics and connectivity reporting."
                    >
                        <div className="space-y-6">
                            <div className="p-6 bg-[#050505] border border-zinc-900/80 rounded-2xl">
                                <div className="flex items-center justify-between mb-6">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Database Cluster Status</span>
                                    <div className="flex items-center gap-2">
                                       <div className={`w-1.5 h-1.5 rounded-full ${integrity.mode === 'PRODUCTION' ? 'bg-emerald-500' : 'bg-orange-500 animate-pulse'}`} />
                                       <span className={`text-[10px] font-bold uppercase tracking-widest ${integrity.mode === 'PRODUCTION' ? 'text-emerald-500' : 'text-orange-500'}`}>
                                           {integrity.mode} Mode
                                       </span>
                                    </div>
                                </div>
                                
                                <div className="space-y-3">
                                    {integrity.missingVariables.length > 0 ? (
                                        <>
                                            <p className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest mb-2">// Missing Environment Parameters:</p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {integrity.missingVariables.map(v => (
                                                    <div key={v} className="flex items-center gap-3 px-3 py-2 bg-zinc-900/30 border border-zinc-800/30 rounded-lg text-[10px] font-mono text-zinc-500">
                                                        <span className="text-red-900 text-[8px]">×</span> {v}
                                                    </div>
                                                ))}
                                            </div>
                                            <p className="mt-6 text-[9px] text-zinc-700 uppercase leading-relaxed font-bold tracking-widest italic opacity-60">
                                                Uplink notice: Materialize these parameters in your host controller to enable specialized mesh features.
                                            </p>
                                        </>
                                    ) : (
                                        <div className="flex items-center gap-3 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-[10px] font-mono text-emerald-600/80">
                                            <span className="text-emerald-900 font-bold">✓</span> All core parameters materialized. Mesh integrity at 100%.
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <SettingsRow label="Uplink Logs">
                                <button disabled className="px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest bg-zinc-900/50 text-zinc-700 cursor-not-allowed border border-zinc-800/50 rounded-xl">View Transaction Manifest</button>
                            </SettingsRow>
                        </div>
                    </SettingsCard>
                </div>

                <div className="mt-20 pt-10 border-t border-zinc-900/50 flex flex-col items-center">
                    <p className="text-[9px] font-bold text-zinc-800 uppercase tracking-[0.5em]">End of Core Manifest</p>
                </div>
            </div>
        </div>
    );
}
