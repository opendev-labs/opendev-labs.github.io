import React, { useState } from 'react';
import type { Project } from '../types';
import { ProjectCard } from './ProjectCard';
import { safeNavigate } from '../services/navigation';
import { SearchIcon, PlusIcon, RefreshIcon } from './common/Icons';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';

const MotionDiv = motion.div;

interface DashboardProps {
  projects: Project[];
  onUpdateProject: (project: Project) => void;
}

/* --- DASHBOARD COMPONENTS --- */

export const Dashboard: React.FC<DashboardProps> = ({ projects, onUpdateProject }) => {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('Overview');

  const filteredProjects = projects.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const handleNewProjectClick = (e: React.MouseEvent) => {
    e.preventDefault();
    safeNavigate('/new');
  };

  const tabs = ['Overview', 'Integrations', 'Activity', 'Domains', 'Usage', 'Observability', 'Storage', 'Settings'];

  return (
    <div className="min-h-[calc(100vh-200px)] animate-in fade-in duration-700">
      {/* Top Navigation Layout */}
      <div className="flex items-center gap-8 border-b border-white/[0.08] mb-10 overflow-x-auto no-scrollbar scroll-smooth">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-sm font-medium transition-all duration-300 relative whitespace-nowrap px-1 ${activeTab === tab
              ? 'text-white'
              : 'text-zinc-500 hover:text-zinc-300'
              }`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-void-accent shadow-[0_0_12px_rgba(0,242,255,0.8)]"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-10 items-start">

        {/* Sidebar (Usage) */}
        <div className="hidden lg:block w-80 shrink-0 space-y-8 sticky top-24">
          <div className="glass-panel rounded-2xl p-6 space-y-6 overflow-hidden relative group">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-void-accent/10 blur-[80px] rounded-full group-hover:bg-void-accent/20 transition-colors duration-700" />

            <div className="flex items-center justify-between relative z-10">
              <h3 className="text-sm font-bold tracking-tight text-white uppercase opacity-70">Current Usage</h3>
              <span className="text-[10px] bg-void-accent/10 text-void-accent px-2 py-0.5 rounded-full border border-void-accent/20">PRO TRIAL</span>
            </div>

            <div className="space-y-6 relative z-10">
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-400">Total Requests</span>
                  <span className="text-white font-medium">3.7M / 10M</span>
                </div>
                <div className="h-1.5 bg-white/[0.03] rounded-full overflow-hidden border border-white/[0.05]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "37%" }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-void-accent to-void-neon shadow-[0_0_8px_rgba(0,242,255,0.4)]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-400">Bandwidth</span>
                  <span className="text-white font-medium">142.5 GB / 500 GB</span>
                </div>
                <div className="h-1.5 bg-white/[0.03] rounded-full overflow-hidden border border-white/[0.05]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "28.5%" }}
                    transition={{ duration: 1, delay: 0.7 }}
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-[0_0_8px_rgba(168,85,247,0.4)]"
                  />
                </div>
              </div>
            </div>

            <button className="w-full relative group overflow-hidden bg-white text-black text-xs font-bold py-3 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
              <span className="relative z-10">UPGRADE TO ENTERPRISE</span>
              <div className="absolute inset-0 bg-gradient-to-r from-zinc-200 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </div>

          <div className="glass-panel rounded-2xl p-6 border-void-accent/20 bg-void-accent/[0.02]">
            <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-void-accent animate-pulse" />
              Trial Status
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed mb-4">Your premium trial for <span className="text-white font-medium">opendev-labs</span> is currently active and will expire in <span className="text-void-accent">4 days</span>.</p>
            <button className="text-xs text-void-accent font-semibold hover:text-white transition-colors flex items-center gap-1 group">
              Manage Subscription
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-grow w-full">
          {/* Search & Actions Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <div className="relative flex-grow group">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-void-accent transition-colors" />
              <input
                type="text"
                placeholder="Find a project..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/[0.08] text-sm text-white rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-void-accent/50 focus:ring-4 focus:ring-void-accent/5 transition-all placeholder:text-zinc-600"
              />
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 glass-panel rounded-xl text-zinc-400 hover:text-white hover:border-white/20 transition-all active:scale-95 shadow-lg shadow-black/20">
                <RefreshIcon className="w-4 h-4" />
              </button>
              <button
                onClick={handleNewProjectClick}
                className="bg-white text-black text-sm font-bold px-6 py-3.5 rounded-xl hover:bg-zinc-200 transition-all flex items-center gap-2 whitespace-nowrap active:scale-95 shadow-xl shadow-void-accent/10"
              >
                <PlusIcon className="w-4 h-4" />
                NEW PROJECT
              </button>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold tracking-tight text-white uppercase opacity-70">Active Projects</h3>
            <span className="text-[10px] text-zinc-500 font-medium">{filteredProjects.length} TOTAL</span>
          </div>

          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="glass-panel border-dashed rounded-3xl p-20 text-center relative overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-void-accent/5 blur-[100px] rounded-full" />
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/[0.03] border border-white/[0.08] rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <SearchIcon className="w-6 h-6 text-zinc-600" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">No projects found</h4>
                <p className="text-zinc-500 mb-8 max-w-xs mx-auto">We couldn't find any projects matching your search criteria. Try a different term or create a new one.</p>
                <button onClick={() => setSearch('')} className="text-sm font-bold text-void-accent hover:text-white transition-colors underline underline-offset-8 decoration-void-accent/30 hover:decoration-void-accent">Clear Search Filters</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};