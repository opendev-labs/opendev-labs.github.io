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
    <div className="min-h-[calc(100vh-200px)] animate-in fade-in duration-700 max-w-[1400px] mx-auto px-4">
      {/* Secondary Navigation */}
      <div className="flex items-center gap-8 border-b border-zinc-900 mb-12 overflow-x-auto no-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-xs font-bold tracking-widest uppercase transition-all duration-300 relative whitespace-nowrap px-1 ${activeTab === tab
              ? 'text-white'
              : 'text-zinc-600 hover:text-zinc-400'
              }`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div
                layoutId="activeTabDashboard"
                className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-white"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* Sidebar (Usage) */}
        <div className="hidden lg:block w-72 shrink-0 space-y-8 sticky top-24">
          <div className="border border-zinc-900 bg-black p-6 space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-bold tracking-[0.2em] text-zinc-600 uppercase">Protocol Usage</h3>
              <span className="text-[9px] font-bold text-white bg-zinc-900 px-2 py-0.5 rounded-none">NODE PRO</span>
            </div>

            <div className="space-y-8">
              <div className="space-y-3">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-zinc-500 uppercase tracking-widest">Logic Flow</span>
                  <span className="text-white tracking-tighter">3.7M / 10M</span>
                </div>
                <div className="h-[2px] bg-zinc-900 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "37%" }}
                    transition={{ duration: 1.5, ease: "circOut" }}
                    className="h-full bg-white"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-zinc-500 uppercase tracking-widest">Telemetry</span>
                  <span className="text-white tracking-tighter">142.5 GB / 500 GB</span>
                </div>
                <div className="h-[2px] bg-zinc-900 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "28.5%" }}
                    transition={{ duration: 1.5, ease: "circOut", delay: 0.2 }}
                    className="h-full bg-zinc-400"
                  />
                </div>
              </div>
            </div>

            <button className="w-full h-11 bg-white text-black text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 hover:bg-zinc-200 rounded-xl">
              Scale Infrastructure
            </button>
          </div>

          <div className="p-6 border border-zinc-900 bg-zinc-950/50">
            <h4 className="text-[10px] font-bold text-white uppercase tracking-widest mb-3 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Neural Status
            </h4>
            <p className="text-[13px] text-zinc-500 leading-relaxed font-medium mb-6">Your professional node fleet is synchronized. Cycle reset in <span className="text-white">4 days</span>.</p>
            <button className="text-[10px] text-white font-bold uppercase tracking-widest hover:underline transition-all flex items-center gap-2 group">
              Manage Nodes
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-grow w-full">
          {/* Search & Actions Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <div className="relative flex-grow">
              <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
              <input
                type="text"
                placeholder="Synchronize with node..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-black border border-zinc-900 text-sm font-medium text-white rounded-none pl-14 pr-6 py-4 focus:outline-none focus:border-white transition-all placeholder:text-zinc-700"
              />
            </div>
            <div className="flex gap-2">
              <button className="h-14 px-5 border border-zinc-900 text-zinc-500 hover:text-white transition-all">
                <RefreshIcon className="w-5 h-5" />
              </button>
              <button
                onClick={handleNewProjectClick}
                className="h-14 bg-white text-black text-[11px] font-bold tracking-[0.2em] px-8 hover:bg-zinc-200 transition-all flex items-center gap-3 whitespace-nowrap"
              >
                <PlusIcon className="w-4 h-4" />
                INITIALIZE NODE
              </button>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-900">
            <h3 className="text-[10px] font-bold tracking-[0.2em] text-zinc-500 uppercase">Synchronized Nodes</h3>
            <span className="text-[10px] font-bold text-zinc-700 uppercase">{filteredProjects.length} ACTIVE</span>
          </div>

          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1 bg-zinc-900 border border-zinc-900">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="bg-black"
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="border border-zinc-900 bg-zinc-950 py-32 text-center relative overflow-hidden">
              <div className="relative z-10">
                <div className="w-16 h-16 bg-black border border-zinc-900 flex items-center justify-center mx-auto mb-8">
                  <SearchIcon className="w-6 h-6 text-zinc-800" />
                </div>
                <h4 className="text-xl font-bold text-white tracking-tight mb-2">No nodes found</h4>
                <p className="text-zinc-500 mb-10 max-w-xs mx-auto text-sm font-medium">Verify your search parameters or initialize a new node cluster.</p>
                <button
                  onClick={() => setSearch('')}
                  className="text-[10px] font-bold text-white uppercase tracking-widest hover:underline"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};