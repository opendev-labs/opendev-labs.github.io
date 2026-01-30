import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Shield, CreditCard, Key, Settings, Github, Save } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';

type SettingsTab = 'general' | 'team' | 'billing' | 'tokens';

export const SettingsPage: React.FC = () => {
    const { user, linkGithub } = useAuth();
    const [activeTab, setActiveTab] = useState<SettingsTab>('general');
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 1500);
    };

    const tabs: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
        { id: 'general', label: 'General', icon: <Settings size={16} /> },
        { id: 'team', label: 'Team', icon: <User size={16} /> },
        { id: 'billing', label: 'Billing', icon: <CreditCard size={16} /> },
        { id: 'tokens', label: 'Tokens', icon: <Key size={16} /> }
    ];

    return (
        <div className="max-w-6xl mx-auto pb-20 pt-10 px-6">
            <div className="mb-12">
                <h1 className="text-4xl font-bold text-white tracking-tighter mb-4">Settings</h1>
                <p className="text-zinc-500 text-sm font-medium">Manage your workspace configuration and preferences.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Sidebar Navigation */}
                <div className="w-full lg:w-64 flex-shrink-0 space-y-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold tracking-tight rounded-none border transition-all ${activeTab === tab.id
                                ? 'bg-zinc-900 border-zinc-800 text-white'
                                : 'bg-transparent border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'
                                }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-grow">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        {activeTab === 'general' && (
                            <div className="space-y-8">
                                <Section title="Workspace Profile" description="This information will be visible to your team members.">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Input label="Workspace Name" defaultValue={user?.name || 'My Workspace'} />
                                        <Input label="Workspace Slug" defaultValue="opendev-labs" disabled />
                                    </div>
                                    <div className="pt-4">
                                        <div className="flex items-center gap-4 p-4 border border-zinc-900 bg-zinc-950/50">
                                            <div className="w-12 h-12 bg-black border border-zinc-800 flex items-center justify-center rounded-none">
                                                {user?.avatar ? (
                                                    <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                                                ) : (
                                                    <User className="text-zinc-600" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-white text-sm font-bold">Workspace Avatar</p>
                                                <p className="text-zinc-600 text-xs mt-1">Recommended size 400x400px</p>
                                            </div>
                                            <Button variant="outline" size="sm" className="ml-auto">Upload</Button>
                                        </div>
                                    </div>
                                </Section>

                                <Section title="Connected Accounts" description="Manage your Git provider connections.">
                                    <div className="border border-zinc-900 bg-black divide-y divide-zinc-900">
                                        <div className="flex items-center justify-between p-6">
                                            <div className="flex items-center gap-4">
                                                <Github className="text-white" size={24} />
                                                <div>
                                                    <p className="text-white text-sm font-bold">GitHub</p>
                                                    <p className="text-zinc-600 text-xs mt-1">
                                                        {user?.providers?.includes('github.com')
                                                            ? `Connected as ${user?.email}`
                                                            : 'Not connected'}
                                                    </p>
                                                </div>
                                            </div>
                                            {user?.providers?.includes('github.com') ? (
                                                <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest px-2 py-1 bg-emerald-500/10 border border-emerald-500/20">Connected</span>
                                            ) : (
                                                <Button size="sm" variant="outline" onClick={async () => {
                                                    try {
                                                        await linkGithub();
                                                    } catch (e: any) {
                                                        alert(e.message);
                                                    }
                                                }}>Connect</Button>
                                            )}
                                        </div>
                                    </div>
                                </Section>
                            </div>
                        )}

                        {activeTab === 'billing' && (
                            <div className="space-y-8">
                                <div className="p-8 border border-zinc-900 bg-zinc-950/30">
                                    <div className="flex justify-between items-start mb-8">
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-2">Pro Plan</h3>
                                            <p className="text-zinc-500 text-sm">$20 / month per seat</p>
                                        </div>
                                        <span className="text-xs font-bold text-blue-500 uppercase tracking-widest px-3 py-1 bg-blue-500/10 border border-blue-500/20">Active</span>
                                    </div>
                                    <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden mb-4">
                                        <div className="h-full bg-white w-[65%]" />
                                    </div>
                                    <div className="flex justify-between text-xs font-bold text-zinc-600 uppercase tracking-widest mb-8">
                                        <span>Usage: 65%</span>
                                        <span>Renews in 12 days</span>
                                    </div>
                                    <Button variant="outline">Manage Subscription</Button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'team' && (
                            <Section title="Team Members" description="Manage access to your workspace.">
                                <div className="border border-zinc-900 bg-black divide-y divide-zinc-900">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex items-center justify-between p-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 bg-zinc-900 rounded-full flex items-center justify-center text-xs font-bold text-zinc-500">
                                                    U{i}
                                                </div>
                                                <div>
                                                    <p className="text-white text-sm font-bold">User {i}</p>
                                                    <p className="text-zinc-600 text-xs">user{i}@opendev.io</p>
                                                </div>
                                            </div>
                                            <select className="bg-black border border-zinc-800 text-xs text-zinc-400 p-2 outline-none">
                                                <option>Admin</option>
                                                <option>Member</option>
                                                <option>Viewer</option>
                                            </select>
                                        </div>
                                    ))}
                                </div>
                            </Section>
                        )}

                        {activeTab === 'tokens' && (
                            <Section title="API Tokens" description="Manage your programmatic access tokens.">
                                <div className="p-12 border border-zinc-900 border-dashed flex flex-col items-center justify-center text-center">
                                    <Shield className="text-zinc-800 mb-4" size={32} />
                                    <h4 className="text-white font-bold mb-2">No Active Tokens</h4>
                                    <p className="text-zinc-600 text-sm mb-6 max-w-sm">
                                        You haven't generated any API tokens yet. Tokens allow you to access the Void API programmatically.
                                    </p>
                                    <Button variant="primary" size="sm">Generate Token</Button>
                                </div>
                            </Section>
                        )}

                        <div className="pt-8 border-t border-zinc-900 flex justify-end">
                            <Button variant="primary" size="lg" onClick={handleSave} isLoading={isLoading}>
                                <Save size={16} className="mr-2" /> Save Changes
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

const Section: React.FC<{ title: string; description: string; children: React.ReactNode }> = ({ title, description, children }) => (
    <div className="space-y-6">
        <div>
            <h3 className="text-lg font-bold text-white tracking-tight">{title}</h3>
            <p className="text-zinc-500 text-sm">{description}</p>
        </div>
        {children}
    </div>
);

const Input: React.FC<{ label: string; defaultValue?: string; disabled?: boolean }> = ({ label, defaultValue, disabled }) => (
    <div className="space-y-2">
        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{label}</label>
        <input
            type="text"
            defaultValue={defaultValue}
            disabled={disabled}
            className="w-full h-12 bg-black border border-zinc-800 px-4 text-sm text-white focus:outline-none focus:border-zinc-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        />
    </div>
);
