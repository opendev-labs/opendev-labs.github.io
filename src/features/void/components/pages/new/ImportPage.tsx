import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../hooks/useAuth';
import { Repository } from '../../../types';
import { AlertCircle, ArrowRight, ShieldCheck, Zap, Globe, Github, Key, Check, X } from 'lucide-react';
import { GitHubIcon, SearchIcon, GitBranchIcon } from '../../common/Icons';
import { ConfigureProjectForm } from '../../common/ConfigureProjectForm';
import { githubPATService } from '../../../services/githubPATService';

const MotionDiv = motion.div;

/* --- PREMIUM UI COMPONENTS --- */

const TerminalLine: React.FC<{ text: string, delay?: number, type?: 'info' | 'error' | 'success' }> = ({ text, delay = 0, type = 'info' }) => {
    const colors = {
        info: 'text-zinc-500',
        error: 'text-red-500',
        success: 'text-emerald-500'
    };
    return (
        <motion.div
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay }}
            className={`font-mono text-[10px] leading-relaxed flex gap-2 ${colors[type]}`}
        >
            <span className="opacity-30">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
            <span className="font-bold opacity-50">▸</span>
            <span className="tracking-tight">{text}</span>
        </motion.div>
    );
};

const SimpleAuthAlert: React.FC<{ message: string, onRetry: () => void, onSwitchAccount: () => void }> = ({ message, onRetry, onSwitchAccount }) => (
    <MotionDiv
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 p-6 bg-zinc-950 border border-zinc-800 rounded-none shadow-xl"
    >
        <div className="flex items-start gap-4 mb-6">
            <AlertCircle className="text-white mt-1" size={20} />
            <div>
                <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-1">Authentication Failure</h4>
                <p className="text-zinc-500 text-sm leading-relaxed">{message}</p>
            </div>
        </div>
        <div className="flex gap-4">
            <button
                onClick={onSwitchAccount}
                className="h-10 px-6 bg-white text-black text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all"
            >
                Switch Account
            </button>
            <button
                onClick={onRetry}
                className="h-10 px-6 border border-zinc-900 text-zinc-500 text-[10px] font-bold uppercase tracking-widest hover:text-white hover:border-zinc-700 transition-all"
            >
                Try Again
            </button>
        </div>
    </MotionDiv>
);

const ConnectedRepoView: React.FC<{
    onDisconnect: () => void,
    onImport: (repo: Repository, projectName: string) => void
}> = ({ onDisconnect, onImport }) => {
    const { fetchRepositories, user, githubUser } = useAuth();
    const [repos, setRepos] = useState<Repository[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const loadRepos = async () => {
            if (!user?.uid) return;
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
        };
        loadRepos();
        return () => { isMounted = false; };
    }, [fetchRepositories, user?.uid]);

    return (
        <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 p-8 bg-zinc-950 border border-zinc-900">
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <div className="w-16 h-16 bg-black border border-zinc-800 flex items-center justify-center relative z-10">
                            {githubUser?.avatar_url ? (
                                <img src={githubUser.avatar_url} alt="Profile" className="w-full h-full opacity-80" />
                            ) : (
                                <Github className="text-zinc-500" />
                            )}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 flex items-center justify-center border border-black z-20">
                            <ShieldCheck size={12} className="text-black" />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Connected</span>
                            <span className="text-[10px] text-zinc-600 font-mono">NODE_UID: {user?.uid?.slice(0, 8)}...</span>
                        </div>
                        <h3 className="text-xl font-bold text-white tracking-tighter">@{githubUser?.login || user?.name || 'User'}</h3>
                        <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-widest mt-1 opacity-60">Identity Source: GitHub</p>
                    </div>
                </div>
                <button onClick={onDisconnect} className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 hover:text-white transition-colors border-b border-transparent hover:border-white pb-1">
                    Disconnect Account
                </button>
            </div>

            {loading ? (
                <div className="space-y-4 py-20 px-8 border border-zinc-900 bg-zinc-950/50 flex flex-col items-center justify-center text-center">
                    <div className="w-8 h-8 border-2 border-white/20 border-t-white animate-spin mb-4"></div>
                    <span className="text-[10px] font-bold text-white tracking-[0.2em] uppercase">Auditing Neural Mesh...</span>
                    <p className="text-zinc-600 text-[9px] mt-2 uppercase tracking-widest">Fetching repositories from GitHub API</p>
                </div>
            ) : repos.length > 0 ? (
                <RepoList repos={repos} onImport={onImport} />
            ) : (
                <div className="text-center py-20 border border-zinc-900 bg-zinc-950/50">
                    <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold mb-4">No accessible repositories detected</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="text-[10px] font-bold text-white border border-zinc-800 px-6 py-2 hover:bg-zinc-900 transition-all uppercase tracking-widest"
                    >
                        Re-scan Repositories
                    </button>
                </div>
            )}
        </MotionDiv>
    );
};

const RepoList: React.FC<{
    repos: Repository[],
    onImport: (repo: Repository, projectName: string) => void
}> = ({ repos, onImport }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredRepos = useMemo(() =>
        repos.filter(repo => repo.name.toLowerCase().includes(searchTerm.toLowerCase())),
        [repos, searchTerm]
    );

    return (
        <div className="space-y-6">
            <div className="relative">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                    type="text"
                    placeholder="Search repositories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-900 h-12 pl-12 pr-6 text-sm text-white focus:outline-none focus:border-white transition-all placeholder:text-zinc-700"
                />
            </div>

            <div className="border border-zinc-900 bg-zinc-950 divide-y divide-zinc-900">
                {filteredRepos.map(repo => (
                    <div key={repo.id} className="flex items-center justify-between p-4 hover:bg-zinc-900/50 transition-colors group">
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 bg-black border border-zinc-900 flex items-center justify-center shrink-0">
                                <GitBranchIcon className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white tracking-tight">{repo.name}</h4>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[10px] text-zinc-600 font-medium">{repo.updatedAt}</span>
                                    <span className="w-1 h-1 rounded-full bg-zinc-800" />
                                    <span className="text-[10px] text-zinc-600 font-medium">main</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => onImport(repo, repo.name)}
                            className="h-9 px-6 bg-white text-black text-[11px] font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all opacity-0 group-hover:opacity-100"
                        >
                            Import
                        </button>
                    </div>
                ))}

                {filteredRepos.length === 0 && (
                    <div className="p-12 text-center">
                        <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest">No matching repositories</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export const ImportPage: React.FC<{
    onImportRepository: (repo: Repository, projectName: string) => void;
}> = ({ onImportRepository }) => {
    const navigate = useNavigate();
    const { loginWithGitHub, linkWithGitHub, user, isGithubConnected, logout, githubUser } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);

    // Configuration state for Step 2
    const [projectName, setProjectName] = useState('');
    const [framework, setFramework] = useState('nextjs');
    const [isDeploying, setIsDeploying] = useState(false);

    const handleInitialImport = (repo: Repository) => {
        setSelectedRepo(repo);
        setProjectName(repo.name);
    };

    const handleFinalDeploy = async () => {
        if (!selectedRepo || !projectName.trim()) return;
        setIsDeploying(true);
        setTimeout(() => {
            onImportRepository(selectedRepo, projectName);
            setIsDeploying(false);
        }, 1500);
    };

    const handleConnect = async () => {
        setIsLoading(true);
        setError(null);
        try {
            if (user) await linkWithGitHub();
            else await loginWithGitHub();
        } catch (e: any) {
            setError(e.message || 'Authentication failed.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-12 md:py-24 px-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Nav Context */}
            <div className="flex items-center justify-between mb-16">
                <button onClick={() => navigate('/void/new')} className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">
                    &larr; Back to Selection
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                {/* Left Column: UI Context */}
                <div className="lg:col-span-5">
                    <div className="sticky top-24">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 text-[9px] font-bold text-zinc-500 mb-8 uppercase tracking-[0.3em]">
                            <Zap size={12} className="text-emerald-500" />
                            <span>Vercel-Grade // Import Protocol</span>
                        </div>
                        <h1 className="text-6xl font-bold tracking-tighter mb-6 lowercase leading-[0.9]">
                            {selectedRepo ? "finalize" : "import"}<br /><span className="text-zinc-600">project.</span>
                        </h1>
                        <p className="text-zinc-500 text-lg leading-relaxed max-w-sm mb-12">
                            {selectedRepo
                                ? "Configure your project settings before we manifest the infrastructure nodes."
                                : "Connect your source provider to synchronize your existing repositories with the OpenDev Mesh."}
                        </p>

                        {!isGithubConnected && (
                            <div className="space-y-4">
                                <button
                                    onClick={handleConnect}
                                    disabled={isLoading}
                                    className="h-14 w-full bg-white text-black text-xs font-bold uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all flex items-center justify-center gap-3"
                                >
                                    <Github size={18} />
                                    {isLoading ? "Synchronizing..." : "Continue with GitHub"}
                                </button>
                                {error && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest text-center mt-4">{error}</p>}
                            </div>
                        )}

                        {isGithubConnected && !selectedRepo && (
                            <div className="flex items-center gap-4 p-4 bg-zinc-950 border border-zinc-900 mb-8">
                                <div className="w-10 h-10 bg-black border border-zinc-800 flex items-center justify-center overflow-hidden">
                                    <img src={githubUser?.avatar_url} alt="Profile" className="w-full h-full opacity-80" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-white">@{githubUser?.login}</h4>
                                    <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">GitHub Connected (Auth OK)</p>
                                </div>
                                <button onClick={logout} className="text-[9px] font-bold text-zinc-700 hover:text-white uppercase tracking-widest transition-colors">Disconnect</button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Interaction Surface */}
                <div className="lg:col-span-7">
                    <AnimatePresence mode="wait">
                        {!isGithubConnected ? (
                            <MotionDiv key="guest" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-12 border border-zinc-900 bg-zinc-950/50 flex flex-col items-center justify-center text-center">
                                <div className="w-16 h-16 border border-zinc-800 flex items-center justify-center mb-8 bg-black">
                                    <Github className="text-zinc-700" size={32} />
                                </div>
                                <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-2">Awaiting Authentication</h3>
                                <p className="text-zinc-600 text-[11px] leading-relaxed max-w-xs mb-8 uppercase tracking-widest opacity-60">Please connect your git provider to access the neural project registry.</p>
                            </MotionDiv>
                        ) : !selectedRepo ? (
                            <MotionDiv key="repo-list" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <ConnectedRepoViewWrapper onImport={handleInitialImport} />
                            </MotionDiv>
                        ) : (
                            <MotionDiv key="config" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                                <div className="p-8 border border-zinc-900 bg-zinc-950">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-12 h-12 bg-black border border-zinc-800 flex items-center justify-center">
                                            <GitBranchIcon className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-white tracking-tight">{selectedRepo.name}</h4>
                                            <p className="text-xs text-zinc-600 uppercase tracking-widest font-bold">Selected Repository</p>
                                        </div>
                                        <button onClick={() => setSelectedRepo(null)} className="ml-auto text-[10px] font-bold text-zinc-700 hover:text-white uppercase tracking-widest">Switch</button>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Project Name</label>
                                            <input
                                                type="text"
                                                value={projectName}
                                                onChange={(e) => setProjectName(e.target.value)}
                                                className="w-full bg-black border border-zinc-900 h-12 px-4 text-sm text-white focus:outline-none focus:border-white transition-all"
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Framework Preset</label>
                                            <select
                                                value={framework}
                                                onChange={(e) => setFramework(e.target.value)}
                                                className="w-full bg-black border border-zinc-900 h-12 px-4 text-sm text-white focus:outline-none focus:border-white transition-all appearance-none"
                                            >
                                                <option value="nextjs">Next.js</option>
                                                <option value="vite">Vite (React)</option>
                                                <option value="node">Node.js</option>
                                                <option value="remix">Remix</option>
                                                <option value="astro">Astro</option>
                                            </select>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-3 opacity-30 cursor-not-allowed">
                                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Build Command</label>
                                                <div className="bg-zinc-900/50 border border-zinc-900 h-12 px-4 flex items-center text-sm text-zinc-700">npm run build</div>
                                            </div>
                                            <div className="space-y-3 opacity-30 cursor-not-allowed">
                                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Output Dir</label>
                                                <div className="bg-zinc-900/50 border border-zinc-900 h-12 px-4 flex items-center text-sm text-zinc-700">dist / .next</div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleFinalDeploy}
                                            disabled={isDeploying || !projectName.trim()}
                                            className="h-14 w-full bg-emerald-500 text-black text-xs font-bold uppercase tracking-[0.2em] hover:bg-emerald-400 transition-all flex items-center justify-center gap-3 mt-8 disabled:bg-zinc-900 disabled:text-zinc-600"
                                        >
                                            {isDeploying ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-black/20 border-t-black animate-spin" />
                                                    Initializing Nodes...
                                                </>
                                            ) : (
                                                <>Manifest Project</>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </MotionDiv>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

const ConnectedRepoViewWrapper: React.FC<{
    onImport: (repo: Repository) => void
}> = ({ onImport }) => {
    const { fetchRepositories, user } = useAuth();
    const [repos, setRepos] = useState<Repository[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const loadRepos = async () => {
            if (!user?.uid) return;
            setLoading(true);
            try {
                const data = await fetchRepositories();
                if (isMounted) setRepos(data);
            } catch (e) {
                console.error("Repo fetch error", e);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        loadRepos();
        return () => { isMounted = false; };
    }, [fetchRepositories, user?.uid]);

    if (loading) {
        return (
            <div className="p-20 border border-zinc-900 bg-zinc-950/50 flex flex-col items-center justify-center">
                <div className="w-10 h-10 border-2 border-white/20 border-t-white animate-spin mb-4" />
                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.3em]">Synchronizing Registry...</span>
            </div>
        );
    }

    return <RepoList repos={repos} onImport={(repo) => onImport(repo)} />;
};
