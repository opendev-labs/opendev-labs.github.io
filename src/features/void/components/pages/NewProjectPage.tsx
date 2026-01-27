import React, { useState, useMemo } from 'react';
import type { Template, GitProvider, Repository, Workflow } from '../../types';
import { mockTemplates, mockRepositories, mockWorkflows } from '../../constants';
import { GitHubIcon, GitLabIcon, BitbucketIcon, SearchIcon, PuzzlePieceIcon, CubeIcon, GitBranchIcon, TerminalIcon, RocketLaunchIcon } from '../common/Icons';
import { TemplateCard } from './TemplateCard';
import { ConfigureProjectForm } from '../common/ConfigureProjectForm';
import { WorkflowCard } from './WorkflowCard';
import { useAuth } from '../../hooks/useAuth';
import { motion } from 'framer-motion';

const MotionDiv = motion.div;

/* --- PREMIUM CARD COMPONENTS --- */

// Visual for Import Card: Floating Provider Icons
const ImportVisual = () => (
    <div className="h-32 w-full bg-black/50 border-b border-zinc-800 flex items-center justify-center relative overflow-hidden group-hover:bg-zinc-900/50 transition-colors">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-800/20 via-black to-black"></div>
        <div className="flex items-center gap-6 z-10">
            <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="p-2 bg-void-card border border-zinc-700 rounded-lg"
            >
                <GitHubIcon />
            </motion.div>
            <motion.div
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="p-2 bg-void-card border border-zinc-700 rounded-lg"
            >
                <GitLabIcon />
            </motion.div>
            <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="p-2 bg-void-card border border-zinc-700 rounded-lg"
            >
                <BitbucketIcon />
            </motion.div>
        </div>
    </div>
);

// Visual for Template Card: Code Snippet
const TemplateVisual = () => (
    <div className="h-32 w-full bg-black/50 border-b border-zinc-800 relative overflow-hidden flex flex-col p-4 group-hover:bg-zinc-900/50 transition-colors">
        <div className="flex gap-1.5 mb-3">
            <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
            <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
            <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
        </div>
        <div className="space-y-1.5 opacity-60 font-mono text-[10px] text-zinc-400">
            <div className="flex gap-2">
                <span className="text-purple-400">import</span>
                <span className="text-white">React</span>
                <span className="text-purple-400">from</span>
                <span className="text-green-400">'react'</span>;
            </div>
            <div className="pl-4">
                <span className="text-blue-400">return</span>
                <span className="text-white"> &lt;App /&gt;</span>
            </div>
            <div className="mt-2 text-void-accent animate-pulse">Running build...</div>
        </div>
    </div>
);

// Visual for Workflow Card: Node Graph
const WorkflowVisual = () => (
    <div className="h-32 w-full bg-black/50 border-b border-zinc-800 mb-0 relative overflow-hidden group-hover:bg-zinc-900/50 transition-colors flex items-center justify-center">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
        <div className="relative z-10 flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-zinc-800 border border-zinc-600 flex items-center justify-center">
                <CubeIcon className="w-4 h-4 text-white" />
            </div>
            <div className="w-8 h-0.5 bg-zinc-600 relative">
                <div className="absolute top-1/2 left-0 w-full h-full -translate-y-1/2 bg-void-accent/50 animate-shine"></div>
            </div>
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-void-accent flex items-center justify-center shadow-[0_0_10px_rgba(34,211,238,0.3)]">
                <RocketLaunchIcon className="w-4 h-4 text-void-accent" />
            </div>
        </div>
    </div>
);


const PremiumCard: React.FC<{
    title: string;
    description: string;
    onClick: () => void;
    visual: React.ReactNode;
}> = ({ title, description, onClick, visual }) => (
    <button
        onClick={onClick}
        className="group relative flex flex-col text-left bg-black border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-500 transition-all duration-300 hover:shadow-2xl hover:shadow-void-accent/5 w-full h-full"
    >
        {visual}
        <div className="p-6">
            <h3 className="text-lg font-heading font-semibold text-white group-hover:text-void-accent transition-colors mb-2">{title}</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">{description}</p>
        </div>
    </button>
);


/* --- EXISTING COMPONENTS (Refactored for style) --- */

const ConnectedRepoView: React.FC<{
    provider: GitProvider,
    onDisconnect: () => void,
    onImport: (repo: Repository, projectName: string) => void
}> = ({ provider, onDisconnect, onImport }) => {
    const { fetchRepositories, user } = useAuth();
    const [repos, setRepos] = useState<Repository[]>([]);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        const loadRepos = async () => {
            if (provider === 'GitHub') {
                const data = await fetchRepositories();
                if (data.length > 0) {
                    setRepos(data);
                } else {
                    setRepos(mockRepositories[provider]);
                }
            } else {
                setRepos(mockRepositories[provider]);
            }
            setLoading(false);
        };
        loadRepos();
    }, [provider, fetchRepositories]);

    const gitProviderIcons: Record<GitProvider, React.ReactNode> = {
        GitHub: <GitHubIcon />,
        GitLab: <GitLabIcon />,
        Bitbucket: <BitbucketIcon />,
    };

    return (
        <MotionDiv
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full"
        >
            <div className="flex justify-between items-center mb-6 p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-black rounded-md border border-zinc-800 text-white">
                        {gitProviderIcons[provider]}
                    </div>
                    <div>
                        <span className="block text-xs text-zinc-500 uppercase tracking-wider font-semibold">Connected Account</span>
                        <span className="text-sm font-medium text-white">{user?.name || 'User'}</span>
                    </div>
                </div>
                <button onClick={onDisconnect} className="text-xs text-red-400 hover:text-red-300 font-medium px-3 py-1.5 rounded hover:bg-red-500/10 transition-colors">
                    Disconnect
                </button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-zinc-500 space-y-4">
                    <div className="w-6 h-6 border-2 border-void-accent border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm">Fetching repositories...</p>
                </div>
            ) : (
                <RepoList repos={repos} onImport={onImport} />
            )}
        </MotionDiv>
    );
};

interface NewProjectPageProps {
    onDeployTemplate: (template: Template, projectName: string, createRepo?: boolean, isPrivate?: boolean) => void;
    onImportRepository: (repo: Repository, projectName: string) => void;
    onDeployWorkflow: (workflow: Workflow, projectName: string) => void;
    connectedProvider: GitProvider | null;
    setConnectedProvider: (provider: GitProvider | null) => void;
}

const GitProviderButton: React.FC<{
    provider: GitProvider,
    icon: React.ReactNode,
    onClick: () => void,
}> = ({ provider, icon, onClick }) => (
    <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-4 border border-zinc-800 bg-black hover:bg-zinc-900 rounded-lg transition-all group"
    >
        <div className="flex items-center gap-3">
            <div className="text-zinc-400 group-hover:text-white transition-colors">{icon}</div>
            <span className="text-sm font-medium text-zinc-300 group-hover:text-white">Continue with {provider}</span>
        </div>
        <span className="text-zinc-600 group-hover:text-void-accent transition-colors">&rarr;</span>
    </button>
);

const RepoList: React.FC<{
    repos: Repository[],
    onImport: (repo: Repository, projectName: string) => void
}> = ({ repos, onImport }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [configuringRepoId, setConfiguringRepoId] = useState<string | null>(null);

    const filteredRepos = useMemo(() =>
        repos.filter(repo => repo.name.toLowerCase().includes(searchTerm.toLowerCase())),
        [repos, searchTerm]
    );

    return (
        <div className="space-y-4">
            <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                    type="text"
                    placeholder="Search repositories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-md py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-all placeholder:text-zinc-600"
                />
            </div>

            <div className="border border-zinc-800 rounded-lg divide-y divide-zinc-800 bg-black">
                {filteredRepos.map(repo => (
                    <div key={repo.id} className="p-4 hover:bg-zinc-900/30 transition-colors">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <GitBranchIcon className="w-4 h-4 text-zinc-500" />
                                <div>
                                    <p className="text-sm font-medium text-white">{repo.name}</p>
                                    <p className="text-xs text-zinc-500">Last updated {repo.updatedAt}</p>
                                </div>
                            </div>
                            {configuringRepoId !== repo.id && (
                                <button
                                    onClick={() => setConfiguringRepoId(repo.id)}
                                    className="text-xs font-medium bg-white text-black px-4 py-2 rounded hover:bg-zinc-200 transition-colors"
                                >
                                    Import
                                </button>
                            )}
                        </div>
                        {configuringRepoId === repo.id && (
                            <div className="mt-4 pt-4 border-t border-zinc-800 animate-fade-in-up">
                                <ConfigureProjectForm
                                    defaultName={repo.name}
                                    onDeploy={(projectName) => {
                                        onImport(repo, projectName);
                                        setConfiguringRepoId(null);
                                    }}
                                    onCancel={() => setConfiguringRepoId(null)}
                                />
                            </div>
                        )}
                    </div>
                ))}
                {filteredRepos.length === 0 && (
                    <div className="text-center py-12 text-zinc-500">
                        <p>No repositories found matching "{searchTerm}"</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export const NewProjectPage: React.FC<NewProjectPageProps> = ({
    onDeployTemplate,
    onImportRepository,
    onDeployWorkflow,
    connectedProvider,
    setConnectedProvider
}) => {
    const [activeView, setActiveView] = useState<'import' | 'template' | 'workflow' | 'none'>('none');

    const handleConnect = (provider: GitProvider) => {
        setConnectedProvider(provider);
    };

    const renderContent = () => {
        if (activeView === 'none') {
            return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    <PremiumCard
                        title="Import Git Repository"
                        description="Deploy an existing project from your Git provider."
                        visual={<ImportVisual />}
                        onClick={() => setActiveView('import')}
                    />
                    <PremiumCard
                        title="Clone Template"
                        description="Start with a pre-configured Next.js or Vite boilerplate."
                        visual={<TemplateVisual />}
                        onClick={() => setActiveView('template')}
                    />
                    <PremiumCard
                        title="Use Workflow"
                        description="Orchestrate a full-stack architecture with managed services."
                        visual={<WorkflowVisual />}
                        onClick={() => setActiveView('workflow')}
                    />
                </div>
            )
        }

        const backButton = (
            <button onClick={() => setActiveView('none')} className="group flex items-center gap-2 text-sm text-zinc-500 hover:text-white mb-8 transition-colors">
                <span className="group-hover:-translate-x-1 transition-transform">&larr;</span>
                Back to options
            </button>
        );

        switch (activeView) {
            case 'import':
                return (
                    <MotionDiv initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
                        {backButton}
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white tracking-tight">Import Git Repository</h2>
                                <p className="text-zinc-400 mt-1">Connect your provider to choose a repository.</p>
                            </div>

                            {!connectedProvider ? (
                                <div className="space-y-3">
                                    <GitProviderButton provider="GitHub" icon={<GitHubIcon />} onClick={() => handleConnect('GitHub')} />
                                    <GitProviderButton provider="GitLab" icon={<GitLabIcon />} onClick={() => handleConnect('GitLab')} />
                                    <GitProviderButton provider="Bitbucket" icon={<BitbucketIcon />} onClick={() => handleConnect('Bitbucket')} />
                                </div>
                            ) : (
                                <ConnectedRepoView
                                    provider={connectedProvider}
                                    onDisconnect={() => setConnectedProvider(null)}
                                    onImport={onImportRepository}
                                />
                            )}
                        </div>
                    </MotionDiv>
                );
            case 'template':
                return (
                    <div className="max-w-7xl mx-auto">
                        {backButton}
                        <h2 className="text-2xl font-bold text-white tracking-tight mb-6">Choose a Template</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {mockTemplates.map(template => (
                                <TemplateCard
                                    key={template.id}
                                    template={template}
                                    onDeploy={onDeployTemplate}
                                />
                            ))}
                        </div>
                    </div>
                );
            case 'workflow':
                return (
                    <div className="max-w-7xl mx-auto">
                        {backButton}
                        <h2 className="text-2xl font-bold text-white tracking-tight mb-6">Select Architecture Workflow</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {mockWorkflows.map(workflow => (
                                <WorkflowCard
                                    key={workflow.id}
                                    workflow={workflow}
                                    onDeploy={onDeployWorkflow}
                                />
                            ))}
                        </div>
                    </div>
                );
        }
    };

    return (
        <div>
            {activeView === 'none' && (
                <div className="text-center mb-16 pt-10">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-6xl font-heading font-bold tracking-tight text-white mb-6"
                    >
                        Let's build something <span className="text-void-accent">new</span>.
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed"
                    >
                        Deploy from a repository, clone a template, or generate a complete stack with Workflows.
                    </motion.p>
                </div>
            )}

            <div className="min-h-[400px]">
                {renderContent()}
            </div>
        </div>
    );
};