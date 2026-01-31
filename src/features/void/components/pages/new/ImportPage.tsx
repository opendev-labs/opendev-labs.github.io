import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../hooks/useAuth';
import { Repository } from '../../../types';
import { AlertCircle, ArrowRight, ShieldCheck, Zap, Globe, Github } from 'lucide-react';
import { GitHubIcon, SearchIcon, GitBranchIcon } from '../../common/Icons';
import { ConfigureProjectForm } from '../../common/ConfigureProjectForm';

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
    const [configuringRepoId, setConfiguringRepoId] = useState<string | null>(null);

    const filteredRepos = useMemo(() =>
        repos.filter(repo => repo.name.toLowerCase().includes(searchTerm.toLowerCase())),
        [repos, searchTerm]
    );

    return (
        <div className="space-y-8">
            <div className="relative group">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-white transition-colors" />
                <input
                    type="text"
                    placeholder="Search repositories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-900 h-14 pl-12 pr-6 text-sm text-white font-medium focus:outline-none focus:border-white transition-all placeholder:text-zinc-700"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:block">
                    <span className="text-[9px] font-bold text-zinc-700 tracking-widest uppercase bg-zinc-900 px-2 py-1">Type to filter</span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {filteredRepos.map(repo => (
                    <div key={repo.id} className="group relative bg-zinc-950 border border-zinc-900 p-8 transition-all hover:border-zinc-700">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div className="flex items-center gap-6">
                                <div className="w-12 h-12 bg-black border border-zinc-800 flex items-center justify-center group-hover:bg-zinc-900 transition-colors">
                                    <GitBranchIcon className="w-6 h-6 text-zinc-600 group-hover:text-white transition-colors" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <h4 className="text-lg font-bold text-white tracking-tighter">{repo.name}</h4>
                                        <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest border border-zinc-900 px-2">PUBLIC</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                                        <span className="flex items-center gap-1.5"><Zap size={10} /> Active</span>
                                        <span className="opacity-40">Last Updated {repo.updatedAt}</span>
                                    </div>
                                </div>
                            </div>
                            {configuringRepoId !== repo.id && (
                                <button
                                    onClick={() => setConfiguringRepoId(repo.id)}
                                    className="h-10 px-8 bg-white text-black text-[11px] font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all hover:translate-x-1 active:translate-x-0"
                                >
                                    Import Node
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
                    <div className="text-center py-32 border border-zinc-900 border-dashed">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-zinc-900 rounded-none mb-6">
                            <SearchIcon className="text-zinc-600" />
                        </div>
                        <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-2">No repositories found</h3>
                        <p className="text-zinc-600 text-xs">Try adjusting your search terms.</p>
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
    const { loginWithGitHub, linkWithGitHub, user, isGithubConnected, logout, loginWithGoogle } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [collisionCode, setCollisionCode] = useState<string | null>(null);

    const handleConnect = async () => {
        setIsLoading(true);
        setError(null);
        try {
            if (user) {
                // If already logged in (e.g. with Google), use linking to avoid collision
                await linkWithGitHub();
            } else {
                // Standard login
                await loginWithGitHub();
            }
        } catch (e: any) {
            console.error("Connection Error:", e);
            if (e.code === 'auth/account-exists-with-different-credential' || e.code === 'auth/credential-already-in-use') {
                setError('Your email is already registered with another provider (likely Google). Please switch accounts to continue.');
            } else {
                setError(e.message || 'Authentication failed.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSwitchAccount = async () => {
        setIsLoading(true);
        try {
            await logout();
            await loginWithGitHub();
        } catch (e: any) {
            console.error("Switch Error:", e);
            setError('Failed to switch accounts.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto py-20 px-6">
            <button onClick={() => navigate('/void/new')} className="group flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-zinc-600 hover:text-white mb-16 transition-all">
                <span className="group-hover:-translate-x-1 transition-transform tracking-normal">&larr; [ ESC ]</span>
                Return to Nexus
            </button>

            <div className="space-y-16">
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-[1px] w-12 bg-white/20"></div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">Import Projects</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tighter mb-4">Select projects <br /><span className="text-zinc-600 italic font-serif">to synchronize.</span></h1>
                    <p className="text-zinc-500 text-lg max-w-xl font-medium leading-relaxed"> Connect your GitHub account to import and manage your projects on OpenDev. </p>
                </div>

                <div className="relative">
                    <AnimatePresence mode='wait'>
                        {!isGithubConnected ? (
                            <MotionDiv
                                key="guest"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-8"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="bg-zinc-950 border border-zinc-900 p-8 flex flex-col justify-between h-64 hover:border-zinc-700 transition-all group">
                                        <div>
                                            <div className="w-12 h-12 bg-black border border-zinc-800 flex items-center justify-center mb-6 group-hover:bg-zinc-900 transition-colors">
                                                <GitHubIcon className="text-zinc-400 group-hover:text-white transition-colors" />
                                            </div>
                                            <h3 className="text-xl font-bold text-white tracking-tighter mb-2">GitHub</h3>
                                            <p className="text-sm text-zinc-500 font-medium">Connect your GitHub account to access your repositories.</p>
                                        </div>
                                        <button
                                            onClick={handleConnect}
                                            disabled={isLoading}
                                            className="h-12 w-full bg-white text-black text-[11px] font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 group/btn"
                                        >
                                            {isLoading ? (
                                                <div className="w-4 h-4 border-2 border-zinc-300 border-t-black animate-spin"></div>
                                            ) : (
                                                <>Connect GitHub <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" /></>
                                            )}
                                        </button>
                                    </div>

                                    <div className="bg-zinc-950 border border-zinc-900 p-8 flex flex-col justify-center items-center text-center h-64 opacity-40">
                                        <AlertCircle size={32} className="text-zinc-700 mb-4" />
                                        <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-1">Other Carriers</h3>
                                        <p className="text-[10px] text-zinc-700 uppercase tracking-widest font-bold">Encrypted / Off-Grid</p>
                                    </div>
                                </div>

                                {error && (
                                    <SimpleAuthAlert
                                        message={error}
                                        onRetry={handleConnect}
                                        onSwitchAccount={handleSwitchAccount}
                                    />
                                )}
                            </MotionDiv>
                        ) : (
                            <MotionDiv
                                key="auth"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <ConnectedRepoView
                                    onDisconnect={logout}
                                    onImport={onImportRepository}
                                />
                            </MotionDiv>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </MotionDiv>
    );
};
