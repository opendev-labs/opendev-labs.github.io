import React from 'react';
import type { Project, GitProvider } from '../types';
import { safeNavigate } from '../services/navigation';
import { GitHubIcon, GitLabIcon, BitbucketIcon, GitBranchIcon, EllipsisHorizontalIcon } from './common/Icons';

/* --- SUB-COMPONENTS --- */

const Sparkline: React.FC = () => {
  // Generates a random-looking sparkline path
  const points = Array.from({ length: 12 }, (_, i) => {
    const x = i * 10;
    const y = 20 + Math.random() * 10 - 5; // Variation around center
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="h-8 w-24 flex items-center">
      <svg width="100%" height="100%" viewBox="0 0 120 40" preserveAspectRatio="none">
        <polyline
          points={points}
          fill="none"
          stroke="#52525b" // zinc-600
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-50"
        />
      </svg>
    </div>
  );
};

const FrameworkIcon: React.FC<{ framework: string }> = ({ framework }) => {
  const f = framework.toLowerCase();
  // Simplified framework detection visuals
  if (f.includes('next')) {
    return (
      <div className="w-8 h-8 rounded-full bg-black border border-zinc-800 flex items-center justify-center">
        <svg viewBox="0 0 180 180" className="w-5 h-5 fill-white"><path d="M90 0a90 90 0 1 0 0 180A90 90 0 0 0 90 0Zm33.66 128.23-42.34-54.66-20.2 26.24v28.42H48.4V51.77h12.72v44.64l38.74-51.2 5.09-6.73h17.65l-44.5 57.5 25.56 32.25Z" /></svg>
      </div>
    );
  }
  if (f.includes('vite') || f.includes('react')) {
    return (
      <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
        <div className="w-4 h-4 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
      </div>
    );
  }
  // Default generic "Void" icon
  return (
    <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold text-xs">
      V
    </div>
  );
};


const GitInfo: React.FC<{ project: Project }> = ({ project }) => {
  if (!project.deployments || project.deployments.length === 0) return null;
  const latest = project.deployments[0];

  return (
    <div className="mt-4 pt-4 border-t border-zinc-900">
      <div className="text-xs text-zinc-500 font-mono mb-1 truncate">
        {latest.commit}
      </div>
      <div className="flex items-center gap-2 text-xs text-zinc-400">
        <span className="flex items-center gap-1">
          <GitBranchIcon className="w-3 h-3" />
          {latest.branch}
        </span>
        <span className="text-zinc-600">•</span>
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
  const href = `#/projects/${project.id}`;
  const displayUrl = project.domains?.[0]?.name.replace('https://', '') || 'pending...';

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    safeNavigate(href);
  };

  return (
    <div className="group relative">
      <a
        href={href}
        onClick={handleNav}
        className="block h-full bg-black border border-zinc-800 rounded-lg p-5 hover:border-zinc-500 transition-colors duration-200"
      >
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-4">
            <FrameworkIcon framework={project.framework} />
            <div>
              <h3 className="font-semibold text-white text-sm leading-snug">{project.name}</h3>
              <p className="text-xs text-zinc-500 hover:underline hover:text-zinc-300 mt-0.5 transition-colors">
                {displayUrl}
              </p>
            </div>
          </div>

          {/* Right side: Sparkline or Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <Sparkline />
            </div>
            <button className="text-zinc-600 hover:text-white transition-colors p-1 rounded hover:bg-zinc-900">
              <EllipsisHorizontalIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        <GitInfo project={project} />

        {project.gitProvider && (
          <div className="absolute top-5 right-5 hidden"> {/* Could enable this if we wanted the git icon visible */}
            <GitHubIcon />
          </div>
        )}
      </a>
    </div>
  );
};