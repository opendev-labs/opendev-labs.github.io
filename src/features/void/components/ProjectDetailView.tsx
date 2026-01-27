

import React, { useState, useEffect, useRef } from 'react';
import type { Project, LogEntry, Domain, Deployment, ActivityEvent } from '../types';
import { DeploymentStatus } from '../types';
import { LogViewer } from './LogViewer';
import { AIAssistant } from './AIAssistant';
import { FrameworkIcon, StatusIndicator } from './common/Indicators';
import { buildLogs, successBuildLogs } from '../constants';
import { safeNavigate } from '../services/navigation';
import { AnalyticsTab } from './project/AnalyticsTab';
import { FunctionsTab } from './project/FunctionsTab';
import { TeamTab } from './project/TeamTab';
import { ActivityTab } from './project/ActivityTab';
import { StorageTab } from './project/StorageTab';
import { IntegrationsTab } from './project/IntegrationsTab';
import { DeploymentsTab } from './project/DeploymentsTab';
import { ProjectTabs } from './project/ProjectTabs';
import { setBuildingFavicon, resetFavicon } from '../services/favicon';
import { GitBranchIcon, GitHubIcon } from './common/Icons';


interface ProjectDetailViewProps {
  project: Project;
  onUpdateProject: (project: Project) => void;
}

const ProjectHeader: React.FC<{ project: Project }> = ({ project }) => {
  const latestDeployment = project.deployments[0];
  const primaryDomain = project.domains.find(d => d.isPrimary) || project.domains[0];

  return (
    <div className="space-y-6">
      <a href="/#/" onClick={(e) => { e.preventDefault(); safeNavigate('/'); }} className="text-sm text-zinc-400 hover:text-white mb-2 inline-block transition-colors">&larr; Back to Projects</a>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <FrameworkIcon framework={project.framework} size="large" />
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white">{project.name}</h2>
            <div className="flex items-center gap-4 mt-2 text-sm">
              {primaryDomain && (
                <a href={`https://${primaryDomain.name}`} target="_blank" rel="noopener noreferrer" className="text-void-neon hover:underline">
                  {primaryDomain.name}
                </a>
              )}
              <a href="#" onClick={(e) => e.preventDefault()} className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5">
                <GitHubIcon />
                <span>opendev-labs/{project.name}</span>
              </a>
            </div>
          </div>
        </div>
        <div className="bg-void-card border border-void-line px-4 py-2 flex items-center gap-3">
          <StatusIndicator status={latestDeployment.status} />
          <div>
            <p className="text-sm text-white font-semibold">{latestDeployment.status}</p>
            <p className="text-xs text-zinc-400">{new Date(latestDeployment.timestamp).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};


const CICDCard: React.FC<{
  onSimulatePush: () => void;
  onSimulatePR: () => void;
  isBuildInProgress: boolean;
}> = ({ onSimulatePush, onSimulatePR, isBuildInProgress }) => {
  return (
    <div className="bg-void-card border border-void-line rounded-lg">
      <div className="p-6 border-b border-void-line">
        <div className="flex items-center gap-3">
          <GitBranchIcon className="h-5 w-5 text-zinc-400" />
          <h3 className="font-semibold text-white text-xl">Continuous Deployment</h3>
        </div>
        <p className="text-zinc-400 text-sm mt-1">Simulate Git events to trigger automated deployments.</p>
      </div>
      <div className="p-6 flex flex-col sm:flex-row gap-4">
        <button
          onClick={onSimulatePush}
          disabled={isBuildInProgress}
          className="w-full text-sm bg-zinc-800 text-zinc-200 border border-zinc-700 font-semibold px-4 py-2 hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          Simulate Push to `main`
        </button>
        <button
          onClick={onSimulatePR}
          disabled={isBuildInProgress}
          className="w-full text-sm bg-zinc-800 text-zinc-200 border border-zinc-700 font-semibold px-4 py-2 hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          Simulate PR from `feat/new-feature`
        </button>
      </div>
    </div>
  );
};


export const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({ project, onUpdateProject }) => {
  const [currentProject, setCurrentProject] = useState(project);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isBuilding, setIsBuilding] = useState(false);
  const [activeTab, setActiveTab] = useState('deployments');
  const [newDomain, setNewDomain] = useState('');
  const [currentBuildStatusText, setCurrentBuildStatusText] = useState('Queued');
  const buildSimulationDeploymentId = useRef<string | null>(null);

  const latestDeployment = project.deployments[0];
  const isBuildInProgress = [DeploymentStatus.BUILDING, DeploymentStatus.QUEUED, DeploymentStatus.DEPLOYING].includes(latestDeployment.status);

  // The tab to display. Force 'logs' if a build is happening, otherwise respect user selection.
  const effectiveTab = isBuildInProgress ? 'logs' : activeTab;

  const showAIAssistant = latestDeployment.status === DeploymentStatus.ERROR;

  useEffect(() => {
    setCurrentProject(project); // Sync with external changes
  }, [project]);

  // Effect for managing dynamic favicon based on build status
  useEffect(() => {
    if (isBuildInProgress) {
      setBuildingFavicon();
    } else {
      resetFavicon();
    }
    // Cleanup favicon on component unmount
    return () => resetFavicon();
  }, [isBuildInProgress]);


  useEffect(() => {
    const latestDeployment = project.deployments[0];

    if (buildSimulationDeploymentId.current !== latestDeployment.id) {
      setLogs([]);
      buildSimulationDeploymentId.current = latestDeployment.id;
    }

    if (latestDeployment.status === DeploymentStatus.QUEUED) {
      setIsBuilding(true);
      setCurrentBuildStatusText('Queued');
      setTimeout(() => {
        const buildingProject = {
          ...project,
          deployments: [{ ...latestDeployment, status: DeploymentStatus.BUILDING }, ...project.deployments.slice(1)]
        };
        onUpdateProject(buildingProject);
      }, 1000);
    } else if (latestDeployment.status === DeploymentStatus.BUILDING || latestDeployment.status === DeploymentStatus.DEPLOYING) {
      setIsBuilding(true);
      const logSource = latestDeployment.commit.includes('Initial') ? successBuildLogs : buildLogs;

      if (logs.length >= logSource.length) {
        if (isBuilding) {
          setIsBuilding(false);
          const finalStatus = logSource === buildLogs ? DeploymentStatus.ERROR : DeploymentStatus.DEPLOYED;
          setCurrentBuildStatusText(finalStatus === DeploymentStatus.DEPLOYED ? 'Deployed' : 'Error');
          const updatedDeployment = { ...latestDeployment, status: finalStatus };
          const updatedProject = { ...project, deployments: [updatedDeployment, ...project.deployments.slice(1)], lastUpdated: "Just now" };
          onUpdateProject(updatedProject);
        }
        return;
      }

      const timer = setTimeout(() => {
        const i = logs.length;
        const logEntry = logSource[i];
        setLogs(prev => [...prev, { ...logEntry, timestamp: new Date().toISOString() }]);

        let statusText = '';
        let newStatus: DeploymentStatus | null = null;

        if (logEntry.level === 'SYSTEM') {
          if (logEntry.message.includes('Cloning')) statusText = 'Cloning Repository';
          else if (logEntry.message.includes('Installing')) statusText = 'Installing Dependencies';
          else if (logEntry.message.includes('Running build command')) statusText = 'Building';
          else if (logEntry.message.includes('Deploying')) {
            statusText = 'Deploying';
            newStatus = DeploymentStatus.DEPLOYING;
          }
        }

        if (statusText) setCurrentBuildStatusText(statusText);

        if (newStatus && newStatus !== latestDeployment.status) {
          onUpdateProject({
            ...project,
            deployments: [{ ...latestDeployment, status: newStatus }, ...project.deployments.slice(1)]
          });
        }
      }, 500 + Math.random() * 500);

      return () => clearTimeout(timer);
    } else {
      setIsBuilding(false);
      const logSource = latestDeployment.status === DeploymentStatus.ERROR ? buildLogs : successBuildLogs;
      setLogs(logSource.map(l => ({ ...l, timestamp: new Date(latestDeployment.timestamp).toISOString() })));
      setCurrentBuildStatusText(latestDeployment.status);
    }
  }, [project, onUpdateProject, logs, isBuilding]);

  const handleAddDomain = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedDomain = newDomain.trim();
    if (!trimmedDomain || currentProject.domains.some(d => d.name === trimmedDomain)) {
      setNewDomain('');
      return;
    }

    const newDomainEntry: Domain = {
      name: trimmedDomain,
      isPrimary: currentProject.domains.length === 0,
    };

    const updatedProject = {
      ...currentProject,
      domains: [...currentProject.domains, newDomainEntry],
    };
    setCurrentProject(updatedProject);
    onUpdateProject(updatedProject);
    setNewDomain('');
  };

  const handleRemoveDomain = (domainName: string) => {
    const domainToRemove = currentProject.domains.find(d => d.name === domainName);
    let updatedDomains = currentProject.domains.filter(d => d.name !== domainName);

    if (domainToRemove?.isPrimary && updatedDomains.length > 0) {
      updatedDomains[0].isPrimary = true;
    }

    const updatedProject = { ...currentProject, domains: updatedDomains };
    setCurrentProject(updatedProject);
    onUpdateProject(updatedProject);
  };

  const handleSetPrimary = (domainName: string) => {
    const updatedDomains = currentProject.domains.map(d => ({
      ...d,
      isPrimary: d.name === domainName,
    }));
    const updatedProject = { ...currentProject, domains: updatedDomains };
    setCurrentProject(updatedProject);
    onUpdateProject(updatedProject);
  };

  const renderCard = (title: string, children: React.ReactNode, padding: boolean = true) => (
    <div className="bg-void-card border border-void-line rounded-lg">
      <div className="p-6 border-b border-void-line">
        <h3 className="font-semibold text-white text-xl">{title}</h3>
      </div>
      <div className={`${padding ? 'p-6' : ''}`}>
        {children}
      </div>
    </div>
  )

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    safeNavigate('/');
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const handleSimulatePush = () => {
    const newDeployment: Deployment = {
      id: `dpl_${Date.now()}`,
      commit: `build(ci): Automatic deployment from push`,
      branch: 'main',
      timestamp: new Date().toISOString(),
      status: DeploymentStatus.QUEUED,
      url: currentProject.domains.find(d => d.isPrimary)?.name || `https://${currentProject.name}.void.app`,
    };

    const newActivity: ActivityEvent = {
      id: `act_${Date.now()}`,
      type: 'Git',
      description: 'Triggered deployment from push to main',
      actor: 'System (CI)',
      timestamp: new Date().toISOString(),
    };

    const updatedProject = {
      ...currentProject,
      deployments: [newDeployment, ...currentProject.deployments],
      activityLog: [newActivity, ...(currentProject.activityLog || [])]
    };

    onUpdateProject(updatedProject);
    setActiveTab('logs');
  };

  const handleSimulatePR = () => {
    const branchName = 'feat/new-feature';
    const shortHash = Math.random().toString(36).substring(2, 8);
    const urlFriendlyBranch = branchName.replace('/', '-');
    const previewUrl = `https://${currentProject.name}-git-${urlFriendlyBranch}-${shortHash}.void.app`;

    const newDeployment: Deployment = {
      id: `dpl_${Date.now()}`,
      commit: `feat: Add dark mode toggle (#${Math.floor(Math.random() * 100) + 1})`,
      branch: branchName,
      timestamp: new Date().toISOString(),
      status: DeploymentStatus.QUEUED,
      url: previewUrl,
    };

    const newDomain: Domain = {
      name: previewUrl,
      isPrimary: false,
      gitBranch: branchName,
    };

    const newActivity: ActivityEvent = {
      id: `act_${Date.now()}`,
      type: 'Git',
      description: `Created preview deployment for branch ${branchName}`,
      actor: 'System (CI)',
      timestamp: new Date().toISOString(),
    };

    const updatedProject = {
      ...currentProject,
      deployments: [newDeployment, ...currentProject.deployments],
      domains: [...currentProject.domains, newDomain],
      activityLog: [newActivity, ...(currentProject.activityLog || [])]
    };

    onUpdateProject(updatedProject);
    setActiveTab('logs');
  };


  const renderTabContent = () => {
    switch (effectiveTab) {
      case 'deployments':
        return (
          <div className="space-y-6">
            <CICDCard
              onSimulatePush={handleSimulatePush}
              onSimulatePR={handleSimulatePR}
              isBuildInProgress={isBuildInProgress}
            />
            <DeploymentsTab deployments={project.deployments} />
          </div>
        );
      case 'activity':
        return currentProject.activityLog ? <ActivityTab events={currentProject.activityLog} /> : <p className="text-zinc-500 p-8 text-center">No activity found for this project.</p>;
      case 'analytics':
        return currentProject.analytics ? <AnalyticsTab data={currentProject.analytics} /> : <p className="text-zinc-500 p-8 text-center">Analytics data is not available for this project.</p>;
      case 'logs':
        return <LogViewer logs={logs} isBuilding={isBuilding} currentBuildStatusText={currentBuildStatusText} />;
      case 'functions':
        return currentProject.functions ? <FunctionsTab functions={currentProject.functions} /> : <p className="text-zinc-500 p-8 text-center">No serverless functions found for this project.</p>;
      case 'storage':
        return currentProject.storage ? <StorageTab databases={currentProject.storage} /> : <p className="text-zinc-500 p-8 text-center">No storage found for this project.</p>;
      case 'integrations':
        return currentProject.integrations ? <IntegrationsTab integrations={currentProject.integrations} /> : <p className="text-zinc-500 p-8 text-center">No integrations found for this project.</p>;
      case 'domains':
        return renderCard("Domains",
          <>
            <div className="p-6 space-y-3">
              {currentProject.domains.map(domain => (
                <div key={domain.name} className="flex justify-between items-center bg-void-line/50 p-3 rounded-md border border-void-line">
                  <div>
                    <a href={`https://${domain.name}`} target="_blank" rel="noopener noreferrer" className="text-void-neon hover:underline">{domain.name}</a>
                    {domain.gitBranch && <p className="text-xs text-zinc-500 flex items-center gap-1.5 mt-1"><GitBranchIcon className="h-3 w-3" /> {domain.gitBranch}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    {domain.isPrimary ? (
                      <span className="text-xs font-bold text-zinc-300 bg-zinc-700 px-2 py-1">Primary</span>
                    ) : (
                      <button onClick={() => handleSetPrimary(domain.name)} className="text-xs bg-zinc-700 text-zinc-300 px-2 py-1 hover:bg-zinc-600 transition-colors">Set as Primary</button>
                    )}
                    <button onClick={() => handleRemoveDomain(domain.name)} className="text-xs bg-red-900/50 text-red-400 px-2 py-1 hover:bg-red-900/80 transition-colors">Remove</button>
                  </div>
                </div>
              ))}
              {currentProject.domains.length === 0 && <p className="text-zinc-500 text-center py-4">No domains configured for this project.</p>}
            </div>

            <div className="p-6 border-t border-void-line bg-void-line/20 rounded-b-lg">
              <h4 className="font-semibold text-white mb-3">Add Domain</h4>
              <form onSubmit={handleAddDomain} className="flex gap-2">
                <input
                  type="text"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  placeholder="example.com"
                  className="flex-grow bg-void-card border border-void-line py-2 px-3 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-void-neon"
                />
                <button type="submit" className="bg-white text-black font-semibold px-4 py-2 hover:bg-zinc-200 transition-colors text-sm">
                  Add
                </button>
              </form>
              <p className="text-xs text-zinc-500 mt-2">You will need to configure DNS records for custom domains.</p>
            </div>
          </>,
          false
        );
      case 'environment':
        return renderCard("Environment Variables",
          <div className="space-y-3">
            {Object.entries(currentProject.envVars).map(([key, value]) => (
              <div key={key} className="flex items-center gap-4 font-mono text-sm">
                <span className="text-zinc-400 w-1/3 truncate">{key}</span>
                <span className="flex-1 p-2 bg-void-line border border-zinc-700 rounded-md text-zinc-300 truncate">{value}</span>
              </div>
            ))}
            {Object.keys(currentProject.envVars).length === 0 && <p className="text-zinc-500 text-center py-4">No environment variables set.</p>}
          </div>
        )
      case 'team':
        return currentProject.teamMembers ? <TeamTab members={currentProject.teamMembers} /> : <p className="text-zinc-500 p-8 text-center">Team information is not available.</p>;
      default: return null;
    }
  }

  return (
    <div className="space-y-8 flex flex-col flex-grow">
      <ProjectHeader project={project} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-grow">
        <div className={`${showAIAssistant ? 'lg:col-span-2' : 'lg:col-span-3'} space-y-6 flex flex-col`}>
          <ProjectTabs activeTab={effectiveTab} setActiveTab={handleTabChange} />
          <div className="flex-grow">
            {renderTabContent()}
          </div>
        </div>
        {showAIAssistant && (
          <div className="lg:col-span-1">
            <AIAssistant
              logs={logs}
              deploymentStatus={latestDeployment.status}
              deploymentId={latestDeployment.id}
            />
          </div>
        )}
      </div>
    </div>
  );
};