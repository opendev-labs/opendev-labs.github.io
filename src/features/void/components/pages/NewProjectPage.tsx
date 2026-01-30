import { OpenURLDeploy } from '../deployment/OpenURLDeploy';
import React, { useState, useMemo } from 'react';
import { Template, Repository, Workflow, GitProvider } from '../../types';
import { mockTemplates, mockWorkflows, mockRepositories } from '../../constants';
import { GitHubIcon, GitLabIcon, BitbucketIcon, SearchIcon, PuzzlePieceIcon, CubeIcon, GitBranchIcon, TerminalIcon, RocketLaunchIcon } from '../common/Icons';
import { TemplateCard } from './TemplateCard';
import { ConfigureProjectForm } from '../common/ConfigureProjectForm';
import { WorkflowCard } from './WorkflowCard';
import { useAuth } from '../../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe } from 'lucide-react';

const MotionDiv = motion.div;

/* --- PREMIUM CARD COMPONENTS --- */

// Visual for Open Hosting Card
const HostingVisual = () => (
    <div className="h-40 w-full bg-black border-b border-zinc-900 relative overflow-hidden group-hover:bg-zinc-950 transition-colors duration-500 flex items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-black to-black"></div>
        <div className="relative z-10 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full border border-emerald-500/30 flex items-center justify-center animate-pulse-slow">
                <Globe className="w-8 h-8 text-emerald-500" />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-dashed border-emerald-500/10 rounded-full animate-spin-slow"></div>
        </div>
    </div>
);


// Visual for Import Card: Floating Provider Icons
const ImportVisual = () => (
    <div className="h-40 w-full bg-black border-b border-zinc-900 flex items-center justify-center relative overflow-hidden group-hover:bg-zinc-950 transition-colors duration-500">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/40 via-black to-black"></div>
        <div className="flex items-center gap-8 z-10">
            <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="p-3 bg-zinc-950 border border-zinc-800 rounded-none shadow-2xl"
            >
                <GitHubIcon className="w-6 h-6 text-white" />
            </motion.div>
            <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="p-3 bg-zinc-950 border border-zinc-800 rounded-none shadow-2xl"
            >
                <GitLabIcon className="w-6 h-6 text-white" />
            </motion.div>
            <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="p-3 bg-zinc-950 border border-zinc-800 rounded-none shadow-2xl"
            >
                <BitbucketIcon className="w-6 h-6 text-white" />
            </motion.div>
        </div>
    </div>
);

// Visual for Template Card: Code Snippet
const TemplateVisual = () => (
    <div className="h-40 w-full bg-black border-b border-zinc-900 relative overflow-hidden flex flex-col p-6 group-hover:bg-zinc-950 transition-colors duration-500">
        <div className="flex gap-2 mb-4">
            <div className="w-2.5 h-2.5 rounded-none bg-zinc-800"></div>
            <div className="w-2.5 h-2.5 rounded-none bg-zinc-800"></div>
            <div className="w-2.5 h-2.5 rounded-none bg-zinc-800"></div>
        </div>
        <div className="space-y-2 font-mono text-[11px] leading-relaxed">
            <div className="flex gap-2">
                <span className="text-zinc-600">import</span>
                <span className="text-white">Logic</span>
                <span className="text-zinc-600">from</span>
                <span className="text-zinc-400">'@opendev-labs/core'</span>;
            </div>
            <div className="pl-4">
                <span className="text-zinc-500">return</span>
                <span className="text-white"> &lt;AutonomousNode /&gt;</span>
            </div>
            <div className="mt-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-none bg-white animate-pulse" />
                <span className="text-white font-bold tracking-tighter uppercase text-[9px]">Initializing Protocol...</span>
            </div>
        </div>
    </div>
);

// Visual for Workflow Card: Node Graph
const WorkflowVisual = () => (
    <div className="h-40 w-full bg-black border-b border-zinc-900 relative overflow-hidden group-hover:bg-zinc-950 transition-colors duration-500 flex items-center justify-center">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        <div className="relative z-10 flex items-center gap-4">
            <div className="w-10 h-10 rounded-none bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-xl">
                <CubeIcon className="w-5 h-5 text-white" />
            </div>
            <div className="w-12 h-[1px] bg-zinc-800 relative">
                <div className="absolute top-1/2 left-0 w-full h-[2px] -translate-y-1/2 bg-white/20 animate-shine"></div>
            </div>
            <div className="w-10 h-10 rounded-none bg-black border border-white flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                <RocketLaunchIcon className="w-5 h-5 text-white" />
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
        className="group relative flex flex-col text-left bg-black border border-zinc-900 rounded-none overflow-hidden transition-all duration-500 hover:bg-zinc-950 w-full h-full"
    >
        {visual}
        <div className="p-8">
            <h3 className="text-lg font-bold text-white mb-3 tracking-tighter group-hover:translate-x-1 transition-transform">{title}</h3>
            <p className="text-sm text-zinc-500 font-medium leading-relaxed">{description}</p>
        </div>
    </button>
);


/* --- REFACTORED VIEWS --- */

const ConnectedRepoView: React.FC<{
    provider: GitProvider,
    onDisconnect: () => void,
    onImport: (repo: Repository, projectName: string) => void
}> = ({ provider, onDisconnect, onImport }) => {
    const { fetchRepositories, user } = useAuth();
    const [repos, setRepos] = useState<Repository[]>([]);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        let isMounted = true;
        const loadRepos = async () => {
            if (provider === 'GitHub') {
                if (!user?.uid) return; // Wait for user to be ready

                setRepos([]);
                setLoading(true);
                try {
                    const data = await fetchRepositories();
                    if (isMounted) setRepos(data);
                } catch (e) {
                    console.error("Repo fetch error", e);
                } finally {
                    if (isMounted) setLoading(false);
                }
            } else {
                setRepos(mockRepositories[provider]);
                setLoading(false);
            }
        };
        loadRepos();
        return () => { isMounted = false; };
    }, [provider, fetchRepositories, user?.uid]);

    const gitProviderIcons: Record<GitProvider, React.ReactNode> = {
        GitHub: <GitHubIcon />,
        GitLab: <GitLabIcon />,
        Bitbucket: <BitbucketIcon />,
    };

    const handleRefresh = async () => {
        setLoading(true);
        if (provider === 'GitHub') {
            const data = await fetchRepositories();
            setRepos(data);
        } else {
            setRepos(mockRepositories[provider]);
        }
        setLoading(false);
    };

    return (
        <MotionDiv
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
        >
            <div className="flex justify-between items-center mb-10 p-6 bg-zinc-950 border border-zinc-900 rounded-none">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-black rounded-none border border-zinc-800 flex items-center justify-center text-white">
                        {gitProviderIcons[provider]}
                    </div>
                    <div>
                        <span className="block text-[10px] text-zinc-600 uppercase tracking-widest font-bold mb-1">Authenticated via {provider}</span>
                        <span className="text-sm font-bold text-white tracking-tight">{user?.name || 'Authorized Architect'}</span>
                    </div>
                </div>
                <button onClick={onDisconnect} className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">
                    Logout
                </button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 text-zinc-600 space-y-6">
                    <div className="w-8 h-8 border-[3px] border-white border-t-transparent rounded-none animate-spin"></div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Synchronizing Nodes...</p>
                </div>
            ) : (
                <RepoList repos={repos} onImport={onImport} onRefresh={handleRefresh} />
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
        className="w-full flex items-center justify-between h-14 px-6 border border-zinc-900 bg-black hover:bg-zinc-950 transition-all group rounded-none"
    >
        <div className="flex items-center gap-4">
            <div className="text-zinc-500 group-hover:text-white transition-colors">{icon}</div>
            <span className="text-[13px] font-bold text-zinc-400 group-hover:text-white tracking-tight">Connect {provider}</span>
        </div>
        <span className="text-zinc-800 group-hover:text-white transition-colors">&rarr;</span>
    </button>
);

const RepoList: React.FC<{
    repos: Repository[],
    onImport: (repo: Repository, projectName: string) => void,
    onRefresh: () => void
}> = ({ repos, onImport, onRefresh }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [configuringRepoId, setConfiguringRepoId] = useState<string | null>(null);

    const filteredRepos = useMemo(() =>
        repos.filter(repo => repo.name.toLowerCase().includes(searchTerm.toLowerCase())),
        [repos, searchTerm]
    );

    return (
        <div className="space-y-6">
            <div className="relative">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input
                    type="text"
                    placeholder="Search node library..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-black border border-zinc-900 h-12 pl-12 pr-6 text-sm text-white font-medium focus:outline-none focus:ring-1 focus:ring-white transition-all rounded-none placeholder:text-zinc-700"
                />
            </div>

            <div className="border border-zinc-900 divide-y divide-zinc-900 bg-black rounded-none overflow-hidden">
                {filteredRepos.map(repo => (
                    <div key={repo.id} className="p-6 hover:bg-zinc-950 transition-colors">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-zinc-950 border border-zinc-900 rounded-none flex items-center justify-center">
                                    <GitBranchIcon className="w-5 h-5 text-zinc-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white tracking-tight">{repo.name}</p>
                                    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mt-1">Updated {repo.updatedAt}</p>
                                </div>
                            </div>
                            {configuringRepoId !== repo.id && (
                                <button
                                    onClick={() => setConfiguringRepoId(repo.id)}
                                    className="h-10 px-8 text-[11px] font-bold uppercase tracking-widest bg-white text-black hover:bg-zinc-200 transition-all rounded-none hover:scale-105 active:scale-95 shadow-lg shadow-white/5"
                                >
                                    Import
                                </button>
                            )}
                        </div>
                        {configuringRepoId === repo.id && (
                            <div className="mt-8 pt-8 border-t border-zinc-900 animate-in fade-in slide-in-from-top-4">
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
                    <div className="text-center py-20 text-zinc-600 flex flex-col items-center">
                        <SearchIcon className="w-10 h-10 mb-4 opacity-20" />
                        <p className="text-xs font-bold uppercase tracking-[0.2em] mb-4">No Nodes Found</p>
                        <button
                            onClick={onRefresh}
                            className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all rounded-none"
                        >
                            Sync Nodes
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

interface NewProjectPageProps {
    onDeployTemplate: (template: Template, projectName: string, createRepo?: boolean, isPrivate?: boolean) => void;
    onImportRepository: (repo: Repository, projectName: string) => void;
    onDeployWorkflow: (workflow: Workflow, projectName: string) => void;
    connectedProvider: GitProvider | null;
    setConnectedProvider: (provider: GitProvider | null) => void;
}

export const NewProjectPage: React.FC<NewProjectPageProps> = ({
    onDeployTemplate,
    onImportRepository,
    onDeployWorkflow,
    connectedProvider,
    setConnectedProvider
}) => {
    const [activeView, setActiveView] = useState<'import' | 'template' | 'workflow' | 'open_url' | 'none'>('none');
    const { loginWithGitHub } = useAuth();

    const handleConnect = async (provider: GitProvider) => {
        if (provider === 'GitHub') {
            await loginWithGitHub();
        }
        setConnectedProvider(provider);
    };

    const renderContent = () => {
        if (activeView === 'none') {
            return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-1 max-w-7xl mx-auto">
                    <PremiumCard
                        title="Git Import"
                        description="Deploy an existing architecture directly from your VCS fleet."
                        visual={<ImportVisual />}
                        onClick={() => setActiveView('import')}
                    />
                    <PremiumCard
                        title="Boilerplates"
                        description="Initialize with optimized Next.js, Vite, or Neural clusters."
                        visual={<TemplateVisual />}
                        onClick={() => setActiveView('template')}
                    />
// ... Inside renderContent's 'none' block ...
                    <PremiumCard
                        title="Logic Mesh"
                        description="Orchestrate full-stack autonomous systems with managed logic."
                        visual={<WorkflowVisual />}
                        onClick={() => setActiveView('workflow')}
                    />
                    <PremiumCard
                        title="OpenDev Hosting"
                        description="Free, high-performance static hosting on the OpenDev network."
                        visual={<HostingVisual />}
                        onClick={() => setActiveView('open_url')}
                    />
                </div>
            )
        }

        const backButton = (
            <button onClick={() => setActiveView('none')} className="group flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-zinc-600 hover:text-white mb-12 transition-all">
                <span className="group-hover:-translate-x-1 transition-transform">&larr;</span>
                Options
            </button>
        );

        switch (activeView) {
            case 'import':
                return (
                    <MotionDiv initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto">
                        {backButton}
                        <div className="space-y-10">
                            <div>
                                <h2 className="text-3xl font-bold text-white tracking-tighter mb-2">Import Node</h2>
                                <p className="text-zinc-500 text-sm font-medium">Connect your VCS provider to synchronize your repository fleet.</p>
                            </div>

                            <div className="min-h-[300px] relative">
                                <AnimatePresence mode='wait'>
                                    {!connectedProvider ? (
                                        <MotionDiv
                                            key="guest"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            transition={{ duration: 0.3 }}
                                            className="space-y-1 absolute w-full"
                                        >
                                            <GitProviderButton provider="GitHub" icon={<GitHubIcon />} onClick={() => handleConnect('GitHub')} />
                                            <GitProviderButton provider="GitLab" icon={<GitLabIcon />} onClick={() => handleConnect('GitLab')} />
                                            <GitProviderButton provider="Bitbucket" icon={<BitbucketIcon />} onClick={() => handleConnect('Bitbucket')} />
                                        </MotionDiv>
                                    ) : (
                                        <MotionDiv
                                            key="auth"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.3 }}
                                            className="absolute w-full"
                                        >
                                            <ConnectedRepoView
                                                provider={connectedProvider}
                                                onDisconnect={() => setConnectedProvider(null)}
                                                onImport={onImportRepository}
                                            />
                                        </MotionDiv>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </MotionDiv>
                );
            case 'template':
                return (
                    <div className="max-w-7xl mx-auto">
                        {backButton}
                        <h2 className="text-3xl font-bold text-white tracking-tighter mb-10">Select Boilerplate</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1">
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
                        <h2 className="text-3xl font-bold text-white tracking-tighter mb-10">Mesh Architectures</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
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
            case 'open_url':
                return (
                    <div className="max-w-4xl mx-auto pb-20">
                        {backButton}
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold text-white tracking-tighter mb-4">Deploy to OpenDev</h2>
                            <p className="text-zinc-500 max-w-lg mx-auto">
                                Instant, global edge hosting for your portfolios and projects. Powered by the OpenDev GitHub network.
                            </p>
                        </div>

                        <OpenURLDeploy
                            repoName=""
                            onComplete={(url) => {
                                // In a real app, this would redirect or show success state permanently
                                // For now, we open the window and maybe reset
                            }}
                            onCancel={() => setActiveView('none')}
                        />
                    </div>
                );
        }
    };

    return (
        <div className="pb-32 px-6">
            {activeView === 'none' && (
                <div className="text-center mb-24 pt-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center"
                    >
                        <span className="inline-block px-3 py-1 rounded-none bg-zinc-900 border border-zinc-800 text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500 mb-8">
                            Genesis Protocol
                        </span>
                        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white mb-8">
                            Build something <span className="text-zinc-600 italic font-serif">new.</span>
                        </h1>
                        <p className="text-lg text-zinc-500 max-w-xl mx-auto font-medium leading-relaxed">
                            Initialize from your Git fleet, clone a boilerplate, or orchestrate high-fidelity systems with Mesh Workflows.
                        </p>
                    </motion.div>
                </div>
            )}

            <div className="min-h-[400px]">
                {renderContent()}
            </div>
        </div>
    );
};