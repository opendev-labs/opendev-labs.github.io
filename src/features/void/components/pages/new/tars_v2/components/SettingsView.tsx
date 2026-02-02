
import React from 'react';
import { UserIcon, BuildingIcon, CreditCardIcon, KeyIcon, ShieldIcon } from './icons/Icons';

// Reusable component for a setting card
const SettingsCard: React.FC<{ icon: React.ReactNode; title: string; description: string; children: React.ReactNode }> = ({ icon, title, description, children }) => (
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
        <div className="p-6 border-b border-neutral-800">
            <div className="flex items-start gap-4">
                <div className="bg-neutral-800 p-2 rounded-md">{icon}</div>
                <div>
                    <h2 className="text-lg font-semibold text-white">{title}</h2>
                    <p className="text-sm text-gray-400 mt-1">{description}</p>
                </div>
            </div>
        </div>
        <div className="p-6 bg-black/20">
            {children}
        </div>
    </div>
);

// Reusable component for a form-like row
const SettingsRow: React.FC<{ label: string; children: React.ReactNode; }> = ({ label, children }) => (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-3 border-b border-neutral-800 last:border-b-0">
        <label className="text-sm text-gray-300 mb-2 sm:mb-0">{label}</label>
        <div className="w-full sm:w-auto">{children}</div>
    </div>
);

export function SettingsView() {
  return (
    <div className="h-full overflow-y-auto bg-[#0A0A0A] text-white">
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-400 mb-8">Manage your account, organization, and platform settings.</p>

        <div className="space-y-8">
            <SettingsCard
                icon={<UserIcon className="w-5 h-5 text-gray-300" />}
                title="Profile"
                description="Manage your personal information and preferences."
            >
                <div className="space-y-2">
                    <SettingsRow label="Full Name">
                        <input type="text" disabled value="John Doe" className="bg-neutral-700/50 border border-neutral-700 rounded-md px-3 py-1.5 text-sm w-full sm:w-64 text-gray-300 cursor-not-allowed" />
                    </SettingsRow>
                    <SettingsRow label="Email Address">
                         <input type="email" disabled value="john.doe@example.com" className="bg-neutral-700/50 border border-neutral-700 rounded-md px-3 py-1.5 text-sm w-full sm:w-64 text-gray-300 cursor-not-allowed" />
                    </SettingsRow>
                     <SettingsRow label="Theme">
                        <select disabled className="bg-neutral-700/50 border border-neutral-700 rounded-md px-3 py-1.5 text-sm w-full sm:w-64 text-gray-300 cursor-not-allowed appearance-none">
                            <option>Dark</option>
                        </select>
                    </SettingsRow>
                </div>
            </SettingsCard>

             <SettingsCard
                icon={<BuildingIcon className="w-5 h-5 text-gray-300" />}
                title="Organization"
                description="Manage your organization settings, members, and roles."
            >
                <div className="space-y-2">
                    <SettingsRow label="Organization Name">
                        <input type="text" disabled value="Acme Corporation" className="bg-neutral-700/50 border border-neutral-700 rounded-md px-3 py-1.5 text-sm w-full sm:w-64 text-gray-300 cursor-not-allowed" />
                    </SettingsRow>
                    <SettingsRow label="Members">
                        <button disabled className="px-4 py-1.5 text-sm font-medium bg-neutral-700 text-gray-400 rounded-md cursor-not-allowed">Invite Members</button>
                    </SettingsRow>
                </div>
            </SettingsCard>
            
            <SettingsCard
                icon={<CreditCardIcon className="w-5 h-5 text-gray-300" />}
                title="Billing"
                description="Manage your subscription, payment methods, and view invoices."
            >
                 <SettingsRow label="Current Plan">
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-semibold bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full">Enterprise</span>
                        <button disabled className="px-4 py-1.5 text-sm font-medium bg-neutral-700 text-gray-400 rounded-md cursor-not-allowed">Manage Subscription</button>
                    </div>
                 </SettingsRow>
            </SettingsCard>
            
            <SettingsCard
                icon={<KeyIcon className="w-5 h-5 text-gray-300" />}
                title="API Keys"
                description="Manage API keys for integrations and external services."
            >
                 <SettingsRow label="Your API Keys">
                    <button disabled className="px-4 py-1.5 text-sm font-medium bg-neutral-700 text-gray-400 rounded-md cursor-not-allowed">Create New Key</button>
                 </SettingsRow>
            </SettingsCard>
            
             <SettingsCard
                icon={<ShieldIcon className="w-5 h-5 text-gray-300" />}
                title="Security"
                description="Manage your organization's security settings."
            >
                 <SettingsRow label="Single Sign-On (SSO)">
                    <button disabled className="px-4 py-1.5 text-sm font-medium bg-neutral-700 text-gray-400 rounded-md cursor-not-allowed">Configure SSO</button>
                 </SettingsRow>
                  <SettingsRow label="Audit Logs">
                    <button disabled className="px-4 py-1.5 text-sm font-medium bg-neutral-700 text-gray-400 rounded-md cursor-not-allowed">View Logs</button>
                 </SettingsRow>
            </SettingsCard>
        </div>
      </div>
    </div>
  );
}
