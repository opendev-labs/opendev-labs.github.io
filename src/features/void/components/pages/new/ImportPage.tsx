import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../hooks/useAuth';
import { GitProvider, Repository } from '../../../types';
import { GitHubIcon, SearchIcon, GitBranchIcon } from '../../common/Icons';
import { ConfigureProjectForm } from '../../common/ConfigureProjectForm';

const MotionDiv = motion.div;

const ConnectedRepoView: React.FC<{
    onDisconnect: () => void,
    onImport: (repo: Repository, projectName: string) => void
}> = ({ onDisconnect, onImport }) => {
    const { fetchRepositories, user } = useAuth();
    const [repos, setRepos] = useState<Repository[]>([]);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
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

    const handleRefresh = async () => {
        setLoading(true);
        const data = await fetchRepositories();
        setRepos(data);
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
                        <GitHubIcon />
                    </div>
                    <div>
                        <span className="block text-[10px] text-zinc-600 uppercase tracking-widest font-bold mb-1">Authenticated via GitHub</span>
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
};

export const ImportPage: React.FC<{
    onImportRepository: (repo: Repository, projectName: string) => void;
}> = ({ onImportRepository }) => {
    const navigate = useNavigate();
    const { loginWithGitHub, user } = useAuth();
    const [connected, setConnected] = useState(!!user?.providers?.includes('github.com'));

    const handleConnect = async () => {
        try {
            await loginWithGitHub();
            setConnected(true);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <MotionDiv initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto py-10">
            <button onClick={() => navigate('/void/new')} className="group flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-zinc-600 hover:text-white mb-12 transition-all">
                <span className="group-hover:-translate-x-1 transition-transform">&larr;</span>
                Genesis Options
            </button>

            <div className="space-y-10">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tighter mb-2">Import Node</h2>
                    <p className="text-zinc-500 text-sm font-medium">Connect your GitHub account to synchronize your repository fleet.</p>
                </div>

                <div className="min-h-[300px] relative">
                    <AnimatePresence mode='wait'>
                        {!connected ? (
                            <MotionDiv
                                key="guest"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-1 absolute w-full"
                            >
                                <button
                                    onClick={handleConnect}
                                    className="w-full flex items-center justify-between h-14 px-6 border border-zinc-900 bg-black hover:bg-zinc-950 transition-all group rounded-none"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="text-zinc-500 group-hover:text-white transition-colors"><GitHubIcon /></div>
                                        <span className="text-[13px] font-bold text-zinc-400 group-hover:text-white tracking-tight">Connect GitHub</span>
                                    </div>
                                    <span className="text-zinc-800 group-hover:text-white transition-colors">&rarr;</span>
                                </button>
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
                                    onDisconnect={() => setConnected(false)}
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
