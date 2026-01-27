import React from 'react';

export const TABS = [
  { id: 'deployments', label: 'Deployments' },
  { id: 'activity', label: 'Activity' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'logs', label: 'Logs' },
  { id: 'functions', label: 'Functions' },
  { id: 'storage', label: 'Storage' },
  { id: 'integrations', label: 'Integrations' },
  { id: 'domains', label: 'Domains' },
  { id: 'environment', label: 'Environment' },
  { id: 'team', label: 'Team' },
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
        className={`px-1 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
            isActive 
            ? 'border-white text-white' 
            : 'border-transparent text-zinc-400 hover:text-white'
        }`}
        aria-current={isActive ? 'page' : undefined}
    >
        {label}
    </button>
);

export const ProjectTabs: React.FC<ProjectTabsProps> = ({ activeTab, setActiveTab }) => {
    return (
        <div className="border-b border-void-line">
            <nav className="flex items-center gap-6 -mb-px overflow-x-auto" aria-label="Project sections">
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