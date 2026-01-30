import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Database, Box, Cpu, Activity, Shield, Zap, ArrowUpRight, Plus, Settings, LayoutGrid, LogOut, Search } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';

export const OfficeDashboard: React.FC = () => {
    const nodes = [
        {
            id: 'void',
            name: 'VOID INFRASTRUCTURE',
            status: 'OPERATIONAL',
            desc: 'Neural orchestration and compute clusters.',
            icon: Terminal,
            path: '/void',
            color: 'text-blue-500',
            bg: 'bg-blue-500/5'
        },
        {
            id: 'syncstack',
            name: 'SYNCSTACK PROTOCOL',
            status: 'SYNCHRONIZED',
            desc: 'Global state replication and distributed consensus.',
            icon: Box,
            path: '/syncstack',
            color: 'text-purple-500',
            bg: 'bg-purple-500/5'
        },
        {
            id: 'lamadb',
            name: 'LAMADB REGISTRY',
            status: 'ACTIVE',
            desc: 'Native browser database for local-first state.',
            icon: Database,
            path: '/lamadb',
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/5'
        }
    ];

    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();

    const SidebarItem = ({ icon: Icon, label, path, active }: any) => (
        <button
            onClick={() => navigate(path)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-[11px] font-bold uppercase tracking-widest transition-colors ${active
                ? 'bg-zinc-900 text-white border-r-2 border-white'
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'
                }`}
        >
            <Icon size={16} />
            {label}
        </button>
    );

    return (
        <div className="flex min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans">
            {/* Left Sidebar */}
            <div className="w-64 border-r border-zinc-900 bg-black flex flex-col fixed h-full z-20">
                <div className="p-8 border-b border-zinc-900">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white flex items-center justify-center">
                            <Cpu size={16} className="text-black" />
                        </div>
                        <span className="font-bold tracking-tighter text-lg">OPENDEV</span>
                    </div>
                </div>

                <div className="flex-1 py-8 space-y-1">
                    <SidebarItem icon={LayoutGrid} label="Dashboard" path="/office" active={location.pathname === '/office'} />
                    <SidebarItem icon={Terminal} label="Void Engine" path="/void" active={location.pathname.startsWith('/void') && location.pathname !== '/void/settings' && location.pathname !== '/void/new'} />
                    <SidebarItem icon={Box} label="SyncStack" path="/syncstack" active={location.pathname.startsWith('/syncstack')} />
                    <SidebarItem icon={Database} label="LamaDB" path="/lamadb" active={location.pathname.startsWith('/lamadb')} />
                </div>

                <div className="border-t border-zinc-900 pt-1">
                    <SidebarItem icon={Plus} label="Init Node" path="/void/new" active={location.pathname === '/void/new'} />
                    <SidebarItem icon={Settings} label="Settings" path="/void/settings" active={location.pathname === '/void/settings'} />
                </div>

                <div className="p-6 border-t border-zinc-900 mt-auto">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-zinc-900 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-zinc-500">
                                {user?.name?.charAt(0).toUpperCase() || 'U'}
                            </span>
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-xs font-bold text-white truncate">{user?.name || 'Unknown'}</p>
                            <p className="text-[10px] text-zinc-600 truncate">{user?.email || 'N/A'}</p>
                        </div>
                    </div>
                    <button onClick={logout} className="flex items-center gap-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest hover:text-white transition-colors">
                        <LogOut size={12} /> Disconnect
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 ml-64">
                <div className="max-w-[1400px] mx-auto p-12 md:p-24">
                    {/* Header Context */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 text-[10px] font-bold text-zinc-400 mb-6 uppercase tracking-[0.3em]">
                                <Cpu size={12} />
                                <span>System Office // Primary Hub</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter lowercase leading-none">
                                mission<br /><span className="text-zinc-600">control.</span>
                            </h1>
                        </div>

                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-hover:text-white transition-colors" size={16} />
                            <input
                                type="text"
                                placeholder="Search nodes..."
                                className="bg-zinc-900/50 border border-zinc-800 text-sm p-3 pl-12 w-64 text-white focus:outline-none focus:border-zinc-700 transition-colors"
                            />
                        </div>
                    </div>

                    {/* System Telemetry Row */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-1 bg-zinc-900 border border-zinc-900 mb-1">
                        {[
                            { label: 'Uplink Status', value: 'STRATOSPHERIC', icon: Activity },
                            { label: 'Neural Load', value: '14.2%', icon: Cpu },
                            { label: 'Security Level', value: 'BLACK-OPS', icon: Shield },
                            { label: 'Protocol Latency', value: '0.04ms', icon: Zap }
                        ].map((stat, i) => (
                            <div key={i} className="bg-black p-8 group">
                                <div className="flex items-center gap-3 mb-4">
                                    <stat.icon size={14} className="text-zinc-700 group-hover:text-white transition-colors" />
                                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{stat.label}</span>
                                </div>
                                <div className="text-xl font-bold tracking-tighter">{stat.value}</div>
                            </div>
                        ))}
                    </div>

                    {/* Primary Nodes Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-1 bg-zinc-900 border border-zinc-900">
                        {nodes.map((node) => (
                            <Link
                                key={node.id}
                                to={node.path}
                                className="group relative bg-black p-12 hover:bg-zinc-950 transition-all duration-500 flex flex-col justify-between min-h-[400px]"
                            >
                                <div>
                                    <div className={`w-12 h-12 ${node.bg} border border-zinc-900 flex items-center justify-center mb-10 group-hover:border-zinc-700 transition-colors`}>
                                        <node.icon className={`w-5 h-5 ${node.color}`} />
                                    </div>
                                    <h3 className="text-xl font-bold tracking-tight mb-4 uppercase leading-none">{node.name}</h3>
                                    <p className="text-zinc-500 text-sm font-medium leading-relaxed max-w-[240px]">
                                        {node.desc}
                                    </p>
                                </div>

                                <div className="flex justify-between items-end">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest mb-1">Node Status</span>
                                        <span className="text-[11px] font-bold tracking-widest group-hover:text-white text-zinc-400 transition-colors">{node.status}</span>
                                    </div>
                                    <div className="w-10 h-10 border border-zinc-900 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                                        <ArrowUpRight size={18} />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Active Sync Section */}
                    <div className="mt-1 bg-black border border-zinc-900 p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-8">
                            <div className="relative w-16 h-16">
                                <div className="absolute inset-0 border-2 border-zinc-900 animate-spin-slow" />
                                <div className="absolute inset-2 border border-blue-500/20" />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold tracking-tight mb-1 uppercase">SyncStack Live Mesh</h4>
                                <p className="text-zinc-500 text-xs font-medium uppercase tracking-widest">Active nodes across 12 regions // latency optimal</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-12">
                            <div className="text-right">
                                <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] mb-1">Packet Throughput</div>
                                <div className="text-lg font-bold tracking-tighter">8.4 GB/s</div>
                            </div>
                            <Button variant="outline" className="h-12 border-zinc-800">
                                Open Telemetry
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
