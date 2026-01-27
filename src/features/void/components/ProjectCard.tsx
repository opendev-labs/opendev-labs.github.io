import React from 'react';
import type { Project, GitProvider } from '../types';
import { safeNavigate } from '../services/navigation';
import { GitHubIcon, GitLabIcon, BitbucketIcon, GitBranchIcon, EllipsisHorizontalIcon, CubeIcon } from './common/Icons';

/* --- SUB-COMPONENTS --- */

const Sparkline: React.FC = () => {
  // Generates a random-looking sparkline path
  const points = Array.from({ length: 12 }, (_, i) => {
    const x = i * 10;
    const y = 20 + Math.random() * 10 - 5; // Variation around center
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="h-6 w-20 flex items-center">
      <svg width="100%" height="100%" viewBox="0 0 120 40" preserveAspectRatio="none">
        <polyline
          points={points}
          fill="none"
          stroke="#3f3f46" // zinc-700
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-40"
        />
      </svg>
    </div>
  );
};

const FrameworkIcon: React.FC<{ framework: string }> = ({ framework }) => {
  const f = framework.toLowerCase();

  if (f.includes('next')) {
    return (
      <div className="w-10 h-10 bg-zinc-950 border border-zinc-900 flex items-center justify-center rounded-lg">
        <svg viewBox="0 0 180 180" className="w-6 h-6 fill-white"><path d="M90 0a90 90 0 1 0 0 180A90 90 0 0 0 90 0Zm33.66 128.23-42.34-54.66-20.2 26.24v28.42H48.4V51.77h12.72v44.64l38.74-51.2 5.09-6.73h17.65l-44.5 57.5 25.56 32.25Z" /></svg>
      </div>
    );
  }

  return (
    <div className="w-10 h-10 bg-zinc-950 border border-zinc-900 flex items-center justify-center rounded-lg">
      <CubeIcon className="w-5 h-5 text-white" />
    </div>
  );
};


const GitInfo: React.FC<{ project: Project }> = ({ project }) => {
  if (!project.deployments || project.deployments.length === 0) return null;
  const latest = project.deployments[0];

  return (
    <div className="mt-8 pt-6 border-t border-zinc-900">
      <div className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mb-2 truncate">
        {latest.commit}
      </div>
      <div className="flex items-center gap-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
        <span className="flex items-center gap-1.5">
          <GitBranchIcon className="w-3.5 h-3.5" />
          {latest.branch}
        </span>
        <span className="text-zinc-800">•</span>
        <span>{project.lastUpdated}</span>
      </div>
    </div>
  );
};

/* --- MAIN COMPONENT --- */

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const href = `/projects/${project.id}`; // Relative within VoidApp
  const displayUrl = project.domains?.[0]?.name.replace('https://', '') || 'unassigned node';

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    // VoidApp safeNavigate prepends /void/ correctly if it's configured to do so,
    // but here we are in /void already.
    safeNavigate(href);
  };

  return (
    <div className="p-8 border border-zinc-900 bg-black hover:bg-zinc-950 transition-all duration-300 flex flex-col h-full relative group">
      <a
        href={href}
        onClick={handleNav}
        className="flex flex-col h-full"
      >
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-start gap-5">
            <FrameworkIcon framework={project.framework} />
            <div>
              <h3 className="text-lg font-bold text-white tracking-tighter leading-tight">{project.name}</h3>
              <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mt-1 group-hover:text-white transition-colors">
                {displayUrl}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <Sparkline />
            </div>
            <button className="text-zinc-700 hover:text-white transition-colors">
              <EllipsisHorizontalIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        <GitInfo project={project} />
      </a>
    </div>
  );
};