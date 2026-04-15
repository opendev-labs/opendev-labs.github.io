import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Github, Star, GitBranch, ExternalLink, Globe, Layout, Cpu } from 'lucide-react';
import { Button } from '../../../components/ui/shadcn/button';

interface ProjectMetadata {
    id: string;
    url: string;
    name: string;
    description: string;
    stars: number;
    language: string;
    topics: string[];
    platform: 'github' | 'vercel' | 'other';
    imageUrl?: string;
}

interface ProjectCardProps {
    metadata: ProjectMetadata;
    isAgent?: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ metadata, isAgent }) => {
    return (
        <Card className="bg-zinc-900/30 border-zinc-800/50 overflow-hidden hover:border-zinc-700 transition-all group mt-4">
            <div className="flex flex-col md:flex-row">
                {/* Visual Preview */}
                <div className="md:w-32 h-32 bg-zinc-950 flex items-center justify-center border-b md:border-b-0 md:border-r border-zinc-900 group-hover:bg-zinc-900 transition-colors shrink-0">
                    {metadata.platform === 'github' ? (
                        <Github size={40} className="text-zinc-800 group-hover:text-white transition-colors" />
                    ) : (
                        <Globe size={40} className="text-zinc-800 group-hover:text-orange-500 transition-colors" />
                    )}
                </div>

                {/* Content */}
                <div className="grow p-5 space-y-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border uppercase tracking-tighter ${
                                    metadata.platform === 'github' ? 'bg-zinc-800 text-white border-zinc-700' : 'bg-orange-500/10 text-orange-500 border-orange-500/20'
                                }`}>
                                    {metadata.platform} Registry
                                </span>
                                {metadata.language && (
                                    <span className="text-[8px] font-bold text-zinc-600 border border-zinc-900 px-1.5 py-0.5 rounded uppercase tracking-widest">
                                        {metadata.language}
                                    </span>
                                )}
                            </div>
                            <h4 className="text-[13px] font-bold text-white uppercase tracking-tight group-hover:text-orange-500 transition-colors leading-tight">
                                {metadata.name}
                            </h4>
                        </div>
                        <div className="flex items-center gap-1 bg-zinc-950 px-2 py-1 rounded-md border border-zinc-900">
                            <Star size={10} className="text-orange-500" fill="currentColor" />
                            <span className="text-[10px] font-bold text-white leading-none">{metadata.stars}</span>
                        </div>
                    </div>

                    <p className="text-[11px] text-zinc-500 font-medium leading-relaxed line-clamp-2">
                        {metadata.description || "Synthesizing project intelligence... No description available."}
                    </p>

                    <div className="flex items-center gap-4">
                        <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => window.open(metadata.url, '_blank')}
                            className="h-7 text-[9px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white hover:bg-zinc-800 border-zinc-900"
                        >
                            <ExternalLink size={12} className="mr-2" /> Inspect Code
                        </Button>
                        {isAgent && (
                            <span className="text-[8px] font-bold text-purple-500 uppercase tracking-widest flex items-center gap-1 animate-pulse">
                                <Cpu size={10} /> Agent Pinned
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
};
