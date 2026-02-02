import React from 'react';
import { UserIcon, SidebarIcon as BuildingIcon, CreditCardIcon, KeyIcon, ShieldIcon } from './icons/Icons';

const SettingsCard: React.FC<{ icon: React.ReactNode; title: string; description: string; children: React.ReactNode }> = ({ icon, title, description, children }) => (
    <div className="bg-[#121212] border border-neutral-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-neutral-800">
            <div className="flex items-start gap-4">
                <div className="bg-neutral-900 border border-white/5 p-2 rounded-lg">{icon}</div>
                <div>
                    <h2 className="text-lg font-semibold text-white">{title}</h2>
                    <p className="text-sm text-neutral-500 mt-1">{description}</p>
                </div>
            </div>
        </div>
        <div className="p-6 bg-black/40">
            {children}
        </div>
    </div>
);

const SettingsRow: React.FC<{ label: string; children: React.ReactNode; }> = ({ label, children }) => (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 border-b border-neutral-800/50 last:border-b-0">
        <label className="text-sm text-neutral-400 mb-2 sm:mb-0">{label}</label>
        <div className="w-full sm:w-auto">{children}</div>
    </div>
);

export function SettingsView() {
    return (
        <div className="h-full overflow-y-auto bg-black text-white scrollbar-hide">
            <div className="max-w-4xl mx-auto p-8">
                <h1 className="text-3xl font-bold mb-2">Settings</h1>
                <p className="text-neutral-500 mb-8">Manage your TARS neural node, engineering protocols, and environment configuration.</p>

                <div className="space-y-8 pb-20">
                    <SettingsCard
                        icon={<UserIcon className="w-5 h-5 text-gray-300" />}
                        title="Profile"
                        description="Manage your identity across the opendev-labs mesh."
                    >
                        <div className="space-y-1">
                            <SettingsRow label="Identity Alias">
                                <input type="text" disabled value="QBET-Operator" className="bg-neutral-900/50 border border-neutral-800 rounded-md px-3 py-1.5 text-sm w-full sm:w-64 text-neutral-400 cursor-not-allowed" />
                            </SettingsRow>
                            <SettingsRow label="Protocol Sync">
                                <input type="email" disabled value="operator@opendev-labs.io" className="bg-neutral-900/50 border border-neutral-800 rounded-md px-3 py-1.5 text-sm w-full sm:w-64 text-neutral-400 cursor-not-allowed" />
                            </SettingsRow>
                            <SettingsRow label="Visual UI">
                                <select disabled className="bg-neutral-900/50 border border-neutral-800 rounded-md px-3 py-1.5 text-sm w-full sm:w-64 text-neutral-400 cursor-not-allowed appearance-none">
                                    <option>Titan Black (Default)</option>
                                </select>
                            </SettingsRow>
                        </div>
                    </SettingsCard>

                    <SettingsCard
                        icon={<BuildingIcon className="w-5 h-5 text-gray-300" />}
                        title="Neural Node"
                        description="Configuration for your local execution environment (qvenv)."
                    >
                        <div className="space-y-1">
                            <SettingsRow label="Node Location">
                                <div className="bg-neutral-900/50 border border-neutral-800 rounded-md px-3 py-1.5 text-sm w-full sm:w-64 text-mono text-neutral-500 truncate">
                                    ~/syncstack/opendev-labs/qvenv/
                                </div>
                            </SettingsRow>
                            <SettingsRow label="Execution Context">
                                <span className="text-xs font-mono bg-green-500/10 text-green-400 px-2 py-0.5 rounded border border-green-500/20">Active</span>
                            </SettingsRow>
                        </div>
                    </SettingsCard>

                    <SettingsCard
                        icon={<KeyIcon className="w-5 h-5 text-gray-300" />}
                        title="Provider Protocols"
                        description="Manage secure handshake keys for LLM providers."
                    >
                        <SettingsRow label="Active Integrations">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold bg-neutral-800 text-neutral-400 px-2 py-1 rounded">GOOGLE</span>
                                <span className="text-[10px] font-bold bg-neutral-800 text-neutral-400 px-2 py-1 rounded">OPENROUTER</span>
                            </div>
                        </SettingsRow>
                    </SettingsCard>
                </div>
            </div>
        </div>
    );
}
