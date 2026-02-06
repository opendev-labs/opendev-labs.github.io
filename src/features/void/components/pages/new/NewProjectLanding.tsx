import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Github, Search, Plus, Filter, ArrowRight,
    ExternalLink, ChevronDown, GitBranch, Terminal as TerminalIcon,
    ShieldCheck, Globe, Zap
} from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { mockTemplates } from '../../../constants';
import type { Repository, Template } from '../../../types';
import { GitHubIcon, SearchIcon, GitBranchIcon } from '../../common/Icons';

const TemplateMiniCard: React.FC<{ template: Template, onClick: () => void }> = ({ template, onClick }) => (
    <button
        onClick={onClick}
        className="group flex flex-col bg-zinc-950/50 border border-zinc-900 rounded-xl overflow-hidden hover:border-zinc-700 transition-all text-left"
    >
        <div className="h-32 w-full bg-black flex items-center justify-center p-6 bg-gradient-to-br from-zinc-900/20 to-black">
            <img src={template.logoUrl} alt={template.name} className="w-12 h-12 object-contain grayscale group-hover:grayscale-0 transition-grayscale duration-500" />
        </div>
        <div className="p-5 border-t border-zinc-900">
            <h4 className="text-sm font-bold text-white mb-1 group-hover:text-white transition-colors">{template.name}</h4>
            <p className="text-[11px] text-zinc-500 line-clamp-2 leading-relaxed">{template.description}</p>
        </div>
    </button>
);

const RepoItem: React.FC<{ repo: Repository, onImport: () => void }> = ({ repo, onImport }) => (
    <div className="flex items-center justify-between p-4 group hover:bg-zinc-900/50 transition-colors">
        <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-black border border-zinc-800 flex items-center justify-center rounded-lg">
                <GitHubIcon className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
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
            onClick={onImport}
            className="h-8 px-4 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-md hover:bg-zinc-200 transition-all opacity-0 group-hover:opacity-100"
        >
            Import
        </button>
    </div>
);

export const NewProjectLanding: React.FC = () => {
    const navigate = useNavigate();
    const { loginWithGitHub, isGithubConnected, fetchRepositories, githubUser, user } = useAuth();
    const [repoSearch, setRepoSearch] = useState('');
    const [gitUrl, setGitUrl] = useState('');
    const [repos, setRepos] = useState<Repository[]>([]);
    const [isLoadingRepos, setIsLoadingRepos] = useState(false);

    useEffect(() => {
        if (isGithubConnected) {
            const loadRepos = async () => {
                setIsLoadingRepos(true);
                try {
                    const data = await fetchRepositories();
                    setRepos(data);
                } catch (e) {
                    console.error("Failed to load repos", e);
                } finally {
                    setIsLoadingRepos(false);
                }
            };
            loadRepos();
        }
    }, [isGithubConnected, fetchRepositories]);

    const filteredRepos = useMemo(() =>
        repos.filter(r => r.name.toLowerCase().includes(repoSearch.toLowerCase())),
        [repos, repoSearch]);

    const handleImportRepo = (repo: Repository) => {
        navigate(`/void/new/import?repo=${repo.name}`);
    };

    const handleTemplateClick = (template: Template) => {
        navigate(`/void/new/templates?id=${template.id}`);
    };

    return (
        <div className="max-w-[1400px] mx-auto pt-20 pb-40 px-6">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-20">
                <div className="space-y-4">
                    <button onClick={() => navigate('/void/dashboard')} className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest flex items-center gap-2 hover:text-white transition-colors">
                        <ArrowRight size={14} className="rotate-180" /> Back to Platform
                    </button>
                    <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white">
                        Let's build something <span className="text-zinc-600 italic">new.</span>
                    </h1>
                </div>

                <div className="flex flex-col items-end gap-3">
                    <div className="flex items-center gap-3 p-1.5 bg-zinc-900/50 border border-zinc-800 rounded-full pl-4 pr-1.5">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Collaborate on a Pro Trial</span>
                        <button className="h-8 px-4 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-zinc-200 transition-all">
                            Upgrade
                        </button>
                    </div>
                </div>
            </div>

            {/* Git URL Landing Strip */}
            <div className="relative group mb-24">
                <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent"></div>
                <div className="flex items-center bg-black border border-zinc-900 h-16 rounded-xl overflow-hidden focus-within:border-white transition-all shadow-2xl">
                    <div className="pl-6 pr-4 text-zinc-500">
                        <Globe size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder="Enter a Git repository URL to deploy..."
                        value={gitUrl}
                        onChange={(e) => setGitUrl(e.target.value)}
                        className="flex-grow bg-transparent border-none text-sm text-white focus:outline-none placeholder:text-zinc-700"
                    />
                    <button
                        disabled={!gitUrl.trim()}
                        className="h-10 px-6 mr-3 bg-white text-black text-[11px] font-bold uppercase tracking-widest rounded-lg hover:bg-zinc-200 transition-all disabled:opacity-20 flex items-center gap-2"
                    >
                        Continue <ArrowRight size={14} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                {/* Left Column: Import Git Repository */}
                <div className="lg:col-span-5 space-y-10">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-white mb-2">Import Git Repository</h2>
                        <p className="text-sm text-zinc-500 font-medium">Select a repository from your connected fleet.</p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex gap-2">
                            <div className="relative group/provider flex-grow max-w-[200px]">
                                <button className="w-full h-12 bg-black border border-zinc-900 rounded-xl flex items-center justify-between px-4 text-xs font-bold text-white hover:border-zinc-700 transition-all">
                                    <div className="flex items-center gap-3">
                                        <Github size={16} />
                                        <span>opendev-labs</span>
                                    </div>
                                    <ChevronDown size={14} className="text-zinc-600" />
                                </button>
                            </div>
                            <div className="relative flex-grow">
                                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={repoSearch}
                                    onChange={(e) => setRepoSearch(e.target.value)}
                                    className="w-full h-12 bg-black border border-zinc-900 rounded-xl pl-12 pr-4 text-sm text-white focus:outline-none focus:border-white transition-all placeholder:text-zinc-700"
                                />
                            </div>
                        </div>

                        <div className="bg-black border border-zinc-900 rounded-xl overflow-hidden divide-y divide-zinc-900 max-h-[500px] overflow-y-auto scrollbar-hide">
                            {!isGithubConnected ? (
                                <div className="p-12 text-center flex flex-col items-center">
                                    <div className="w-16 h-16 bg-zinc-950 border border-zinc-800 flex items-center justify-center rounded-2xl mb-6">
                                        <Github size={24} className="text-zinc-500" />
                                    </div>
                                    <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-2">Awaiting Handshake</h4>
                                    <p className="text-[11px] text-zinc-600 uppercase tracking-widest mb-8">Connect your source provider to view fleet nodes.</p>
                                    <button
                                        onClick={() => loginWithGitHub()}
                                        className="h-10 px-8 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-zinc-200 transition-all"
                                    >
                                        Connect GitHub
                                    </button>
                                </div>
                            ) : isLoadingRepos ? (
                                <div className="p-20 flex flex-col items-center justify-center gap-4">
                                    <div className="w-6 h-6 border-2 border-white/20 border-t-white animate-spin rounded-full"></div>
                                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Scanning Registry...</span>
                                </div>
                            ) : filteredRepos.length > 0 ? (
                                filteredRepos.map(repo => (
                                    <RepoItem key={repo.id} repo={repo} onImport={() => handleImportRepo(repo)} />
                                ))
                            ) : (
                                <div className="p-12 text-center text-zinc-600 text-[10px] font-bold uppercase tracking-widest">No matching nodes detected.</div>
                            )}
                        </div>
                    </div>

                    <div className="pt-8 border-t border-zinc-900">
                        <div className="flex items-center gap-4 p-5 bg-zinc-950/50 border border-zinc-900 rounded-2xl">
                            <div className="w-10 h-10 bg-black border border-zinc-800 flex items-center justify-center rounded-xl overflow-hidden shrink-0">
                                {isGithubConnected && githubUser?.avatar_url ? (
                                    <img src={githubUser.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <Filter size={18} className="text-zinc-700" />
                                )}
                            </div>
                            <div className="flex-grow">
                                <h4 className="text-xs font-bold text-white">{isGithubConnected ? `@${githubUser?.login}` : 'Protocol Inactive'}</h4>
                                <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">{isGithubConnected ? 'Identity Sync Active' : 'Bridge Handshake Pending'}</p>
                            </div>
                            {isGithubConnected && (
                                <button onClick={() => navigate('/void/new/import')} className="text-[9px] font-bold text-zinc-600 hover:text-white uppercase tracking-widest transition-colors">
                                    Configure
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Clone Template */}
                <div className="lg:col-span-7 space-y-10">
                    <div className="flex items-end justify-between">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-white mb-2">Clone Template</h2>
                            <p className="text-sm text-zinc-500 font-medium">Initialize from optimized production blueprints.</p>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest hover:text-white transition-colors cursor-pointer">
                                <span>Filter</span>
                                <ChevronDown size={14} />
                            </div>
                            <button onClick={() => navigate('templates')} className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2">
                                Browse All <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {mockTemplates.filter(t => ['tmpl_nextjs', 'tmpl_ai_chatbot', 'tmpl_react_vite', 'tmpl_express_on_vercel'].includes(t.id)).map(template => (
                            <TemplateMiniCard key={template.id} template={template} onClick={() => handleTemplateClick(template)} />
                        ))}
                    </div>

                    <div className="p-8 border border-zinc-900 bg-zinc-950/20 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-8 group">
                        <div className="space-y-2 text-center md:text-left">
                            <h4 className="text-sm font-bold text-white uppercase tracking-widest">open-studio v2 // Neural Genesis</h4>
                            <p className="text-[11px] text-zinc-600 uppercase tracking-widest leading-relaxed">Manifest entire architectures from pure thought using the upgraded open-studio orchestrator.</p>
                        </div>
                        <button
                            onClick={() => navigate('open-studio')}
                            className="h-12 px-10 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-zinc-200 transition-all flex items-center gap-3 shrink-0"
                        >
                            Initiate open-studio <Sparkles size={14} className="text-black" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Re-defining Sparkles since it was used in the button but not properly imported for that specific icon set if needed
const Sparkles: React.FC<{ size: number, className: string }> = ({ size, className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        <path d="M5 3v4" />
        <path d="M19 17v4" />
        <path d="M3 5h4" />
        <path d="M17 19h4" />
    </svg>
);
