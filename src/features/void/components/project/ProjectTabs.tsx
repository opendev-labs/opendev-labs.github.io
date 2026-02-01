import React from 'react';

export const TABS = [
    { id: 'deployments', label: 'Nodes' },
    { id: 'activity', label: 'History' },
    { id: 'analytics', label: 'Telemetry' },
    { id: 'logs', label: 'Console' },
    { id: 'functions', label: 'Logic' },
    { id: 'storage', label: 'Storage' },
    { id: 'integrations', label: 'Integrations' },
    { id: 'domains', label: 'Nexus' },
    { id: 'environment', label: 'Secrets' },
    { id: 'team', label: 'Registry' },
];

interface ProjectTabsProps {
    activeTab: string;
    setActiveTab: (tabId: string) => void;
}

const TabButton: React.FC<{
    tabName: string;
    label: string;
    isActive: boolean;
    onClick: (tabName: string) => void;
}> = ({ tabName, label, isActive, onClick }) => (
    <button
        onClick={() => onClick(tabName)}
        className={`px-0 py-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-all border-b-2 whitespace-nowrap ${isActive
            ? 'border-white text-white'
            : 'border-transparent text-zinc-600 hover:text-zinc-400'
            }`}
        aria-current={isActive ? 'page' : undefined}
    >
        {label}
    </button>
);

export const ProjectTabs: React.FC<ProjectTabsProps> = ({ activeTab, setActiveTab }) => {
    return (
        <div className="border-b border-zinc-900">
            <nav className="flex items-center gap-10 -mb-px overflow-x-auto no-scrollbar" aria-label="Project sections">
                {TABS.map(tab => (
                    <TabButton
                        key={tab.id}
                        tabName={tab.id}
                        label={tab.label}
                        isActive={activeTab === tab.id}
                        onClick={setActiveTab}
                    />
                ))}
            </nav>
        </div>
    );
};