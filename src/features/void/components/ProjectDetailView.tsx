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
    <div className="space-y-12">
      <button
        onClick={() => safeNavigate('/')}
        className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest hover:text-white transition-colors"
      >
        &larr; Return to Fleet
      </button>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="flex items-start gap-8">
          <FrameworkIcon framework={project.framework} size="large" />
          <div className="space-y-3">
            <h2 className="text-4xl font-bold tracking-tighter text-white">{project.name}</h2>
            <div className="flex flex-wrap items-center gap-6">
              {primaryDomain && (
                <a
                  href={`https://${primaryDomain.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-zinc-500 uppercase tracking-[0.15em] hover:text-white transition-colors underline underline-offset-4 decoration-zinc-800"
                >
                  {primaryDomain.name}
                </a>
              )}
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="text-xs font-bold text-zinc-600 uppercase tracking-[0.15em] hover:text-white transition-colors flex items-center gap-2"
              >
                <GitHubIcon className="w-4 h-4" />
                <span>opendev-labs / {project.name}</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border border-zinc-900 bg-black p-5 flex items-center gap-6">
          <StatusIndicator status={latestDeployment.status} />
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-white uppercase tracking-widest">{latestDeployment.status}</p>
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{new Date(latestDeployment.timestamp).toLocaleDateString()}</p>
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
    <div className="border border-zinc-900 bg-black overflow-hidden">
      <div className="p-8 border-b border-zinc-900 flex justify-between items-center bg-zinc-950/50">
        <div>
          <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-1 leading-none">Continuous Deployment</h3>
          <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-none">Simulate protocol events.</p>
        </div>
        <GitBranchIcon className="h-4 w-4 text-zinc-600" />
      </div>
      <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={onSimulatePush}
          disabled={isBuildInProgress}
          className="h-12 border border-zinc-900 text-[10px] font-bold text-zinc-500 uppercase tracking-widest hover:border-white hover:text-white transition-all disabled:opacity-20">
          Simulate Push [main]
        </button>
        <button
          onClick={onSimulatePR}
          disabled={isBuildInProgress}
          className="h-12 border border-zinc-900 text-[10px] font-bold text-zinc-500 uppercase tracking-widest hover:border-white hover:text-white transition-all disabled:opacity-20">
          Simulate PR [feat/nexus]
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

  const effectiveTab = isBuildInProgress ? 'logs' : activeTab;

  const showAIAssistant = latestDeployment.status === DeploymentStatus.ERROR;

  useEffect(() => {
    setCurrentProject(project);
  }, [project]);

  useEffect(() => {
    if (isBuildInProgress) {
      setBuildingFavicon();
    } else {
      resetFavicon();
    }
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
    <div className="border border-zinc-900 bg-black overflow-hidden">
      <div className="px-8 py-5 border-b border-zinc-900 bg-zinc-950/50">
        <h3 className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">{title}</h3>
      </div>
      <div className={`${padding ? 'p-8' : ''}`}>
        {children}
      </div>
    </div>
  )

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const handleSimulatePush = () => {
    const newDeployment: Deployment = {
      id: `dpl_${Date.now()}`,
      commit: `build(nexus): Protocol synchronization initiated`,
      branch: 'main',
      timestamp: new Date().toISOString(),
      status: DeploymentStatus.QUEUED,
      url: currentProject.domains.find(d => d.isPrimary)?.name || `${currentProject.name}.opendev.app`,
    };

    const newActivity: ActivityEvent = {
      id: `act_${Date.now()}`,
      type: 'Git',
      description: 'Triggered deployment from push to main',
      actor: 'System (Nexus)',
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
    const branchName = 'feat/nexus';
    const shortHash = Math.random().toString(36).substring(2, 8);
    const urlFriendlyBranch = branchName.replace('/', '-');
    const previewUrl = `${currentProject.name}-git-${urlFriendlyBranch}-${shortHash}.opendev.app`;

    const newDeployment: Deployment = {
      id: `dpl_${Date.now()}`,
      commit: `feat(core): Nexus expansion protocol (#${Math.floor(Math.random() * 100) + 1})`,
      branch: branchName,
      timestamp: new Date().toISOString(),
      status: DeploymentStatus.QUEUED,
      url: previewUrl,
    };

    const previewDomain: Domain = {
      name: previewUrl,
      isPrimary: false,
      gitBranch: branchName,
    };

    const newActivity: ActivityEvent = {
      id: `act_${Date.now()}`,
      type: 'Git',
      description: `Created preview deployment for branch ${branchName}`,
      actor: 'System (Nexus)',
      timestamp: new Date().toISOString(),
    };

    const updatedProject = {
      ...currentProject,
      deployments: [newDeployment, ...currentProject.deployments],
      domains: [...currentProject.domains, previewDomain],
      activityLog: [newActivity, ...(currentProject.activityLog || [])]
    };

    onUpdateProject(updatedProject);
    setActiveTab('logs');
  };


  const renderTabContent = () => {
    switch (effectiveTab) {
      case 'deployments':
        return (
          <div className="space-y-8">
            <CICDCard
              onSimulatePush={handleSimulatePush}
              onSimulatePR={handleSimulatePR}
              isBuildInProgress={isBuildInProgress}
            />
            <DeploymentsTab deployments={project.deployments} />
          </div>
        );
      case 'activity':
        return currentProject.activityLog ? <ActivityTab events={currentProject.activityLog} /> : <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest p-12 text-center">No protocol activity detected.</p>;
      case 'analytics':
        return currentProject.analytics ? <AnalyticsTab data={currentProject.analytics} /> : <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest p-12 text-center">Telemetry unavailable.</p>;
      case 'logs':
        return <LogViewer logs={logs} isBuilding={isBuilding} currentBuildStatusText={currentBuildStatusText} />;
      case 'functions':
        return currentProject.functions ? <FunctionsTab functions={currentProject.functions} /> : <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest p-12 text-center">Logic primitives not found.</p>;
      case 'storage':
        return currentProject.storage ? <StorageTab databases={currentProject.storage} /> : <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest p-12 text-center">Edge storage uninitialized.</p>;
      case 'integrations':
        return currentProject.integrations ? <IntegrationsTab integrations={currentProject.integrations} /> : <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest p-12 text-center">External links inactive.</p>;
      case 'domains':
        return renderCard("Nexus Bindings",
          <div className="space-y-8">
            <div className="space-y-4">
              {currentProject.domains.map(domain => (
                <div key={domain.name} className="flex justify-between items-center bg-zinc-950 p-6 border border-zinc-900">
                  <div className="space-y-1">
                    <a
                      href={`https://${domain.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-white uppercase tracking-widest hover:underline"
                    >
                      {domain.name}
                    </a>
                    {domain.gitBranch && (
                      <p className="text-[10px] font-bold text-zinc-600 flex items-center gap-2 uppercase tracking-widest">
                        <GitBranchIcon className="h-3 w-3" />
                        {domain.gitBranch}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    {domain.isPrimary ? (
                      <span className="text-[10px] font-bold text-white bg-zinc-900 px-3 py-1 uppercase tracking-widest">Primary</span>
                    ) : (
                      <button
                        onClick={() => handleSetPrimary(domain.name)}
                        className="text-[10px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest transition-colors"
                      >
                        Set Primary
                      </button>
                    )}
                    <button
                      onClick={() => handleRemoveDomain(domain.name)}
                      className="text-[10px] font-bold text-red-900/50 hover:text-red-600 uppercase tracking-widest transition-colors"
                    >
                      Purge
                    </button>
                  </div>
                </div>
              ))}
              {currentProject.domains.length === 0 && <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest text-center py-12">No domains bound.</p>}
            </div>

            <div className="pt-8 border-t border-zinc-900">
              <h4 className="text-[10px] font-bold text-white uppercase tracking-widest mb-6">Initialize Binding</h4>
              <form onSubmit={handleAddDomain} className="flex gap-2">
                <input
                  type="text"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  placeholder="nexus.mesh"
                  className="flex-grow bg-zinc-950 border border-zinc-900 p-4 text-xs font-bold text-white placeholder:text-zinc-800 focus:outline-none focus:border-white transition-all uppercase tracking-widest"
                />
                <button type="submit" className="bg-white text-black font-bold px-8 hover:bg-zinc-200 transition-colors text-[10px] uppercase tracking-widest">
                  Bind
                </button>
              </form>
              <p className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest mt-4 italic">Configure external DNS protocols for full mesh synchronization.</p>
            </div>
          </div>,
          true
        );
      case 'environment':
        return renderCard("Protocol Variables",
          <div className="space-y-6">
            {Object.entries(currentProject.envVars).map(([key, value]) => (
              <div key={key} className="flex flex-col sm:flex-row sm:items-center gap-4">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest w-1/3 truncate">{key}</span>
                <span className="flex-1 p-4 bg-zinc-950 border border-zinc-900 font-mono text-[11px] text-zinc-400 truncate tracking-tight">{value}</span>
              </div>
            ))}
            {Object.keys(currentProject.envVars).length === 0 && <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest p-12 text-center">No variables injected.</p>}
          </div>,
          true
        )
      case 'team':
        return currentProject.teamMembers ? <TeamTab members={currentProject.teamMembers} /> : <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest p-12 text-center">Fleet registry unavailable.</p>;
      default: return null;
    }
  }

  return (
    <div className="space-y-16 flex flex-col flex-grow max-w-[1400px] mx-auto w-full">
      <ProjectHeader project={project} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 flex-grow">
        <div className={`${showAIAssistant ? 'lg:col-span-3' : 'lg:col-span-4'} space-y-10 flex flex-col`}>
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