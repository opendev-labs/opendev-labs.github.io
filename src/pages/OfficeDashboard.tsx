import { Terminal, Database, Box, Cpu, Activity, Shield, Zap, ArrowUpRight, Plus, Settings, LayoutGrid, LogOut, Search } from 'lucide-react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useAuth } from '../features/void/hooks/useAuth';

export const OfficeDashboard: React.FC = () => {
    const nodes = [
        {
            id: 'void',
            name: 'VOID INFRASTRUCTURE',
            status: 'OPERATIONAL',
            desc: 'Neural orchestration and compute clusters.',
            icon: Terminal,
            path: '/office/void',
            color: 'text-blue-500',
            bg: 'bg-blue-500/5'
        },
        {
            id: 'syncstack',
            name: 'SYNCSTACK PROTOCOL',
            status: 'SYNCHRONIZED',
            desc: 'Global state replication and distributed consensus.',
            icon: Box,
            path: '/office/syncstack',
            color: 'text-purple-500',
            bg: 'bg-purple-500/5'
        },
        {
            id: 'lamadb',
            name: 'LAMADB REGISTRY',
            status: 'ACTIVE',
            desc: 'Native browser database for local-first state.',
            icon: Database,
            path: '/office/lamadb',
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
                    <SidebarItem icon={LayoutGrid} label="Office Cockpit" path="/office" active={location.pathname === '/office'} />
                    <SidebarItem icon={Box} label="SyncStack" path="/office/syncstack" active={location.pathname === '/office/syncstack'} />
                    <SidebarItem icon={Terminal} label="Void Engine" path="/office/void" active={location.pathname === '/office/void'} />
                    <SidebarItem icon={Database} label="LamaDB" path="/office/lamadb" active={location.pathname === '/office/lamadb'} />
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
            <div className="flex-1 ml-64 min-h-screen">
                <Outlet />
            </div>
        </div>
    );
};
