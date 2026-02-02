import { useState } from 'react';
import { Terminal, Database, Box, Cpu, Activity, Shield, Zap, ArrowUpRight, Plus, Settings, LayoutGrid, LogOut, Search, ChevronLeft, ChevronRight, Menu, Bot } from 'lucide-react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useAuth } from '../features/void/hooks/useAuth';

const OfficeDashboard: React.FC = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
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
    const [localAgentOnline, setLocalAgentOnline] = useState(false);

    // Initial agent handshake
    useState(() => {
        const checkAgent = async () => {
            try {
                const res = await fetch('http://localhost:8080/health').catch(() => ({ ok: false }));
                setLocalAgentOnline(res.ok);
            } catch (e) {
                setLocalAgentOnline(false);
            }
        };
        checkAgent();
        const interval = setInterval(checkAgent, 30000);
        return () => clearInterval(interval);
    });

    const SidebarItem = ({ icon: Icon, label, path, active, id }: any) => {
        const handleClick = () => {
            if (id === 'syncstack' && localAgentOnline) {
                // Trigger local app focus/open via a custom protocol or just inform the user
                // For now, we still navigate normally but could provide a deep link
                window.location.href = 'syncstack://open';
                // Fallback to normal navigation after a delay if protocol fails
                setTimeout(() => navigate(path), 500);
            } else {
                navigate(path);
            }
        };

        return (
            <button
                onClick={handleClick}
                className={`w-full flex items-center gap-3 px-4 py-3 text-[11px] font-bold uppercase tracking-widest transition-colors ${active
                    ? 'bg-zinc-900 text-white border-r-2 border-white'
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'
                    } ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? label : ''}
            >
                <div className="relative">
                    <Icon size={16} />
                    {id === 'syncstack' && localAgentOnline && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full border border-black animate-pulse" />
                    )}
                </div>
                {!isCollapsed && <span>{label}</span>}
            </button>
        );
    };

    return (
        <div className="flex min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans">
            {/* Left Sidebar */}
            <div className={`${isCollapsed ? 'w-20' : 'w-64'} border-r border-zinc-900 bg-black flex flex-col fixed h-full z-20 transition-all duration-300`}>
                <div className="p-8 h-20 border-b border-zinc-900 flex items-center justify-center">
                    {!isCollapsed && <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.4em]">Office Mesh</span>}
                    {isCollapsed && <Menu size={16} className="text-zinc-600" />}
                </div>

                <div className="flex-1 py-8 space-y-1">
                    <SidebarItem icon={LayoutGrid} label="Office Cockpit" path="/office" active={location.pathname === '/office'} id="cockpit" />
                    <SidebarItem icon={Bot} label="Agents" path="/office/agents" active={location.pathname === '/office/agents'} id="agents" />
                    <SidebarItem icon={Box} label="SyncStack" path="/office/syncstack" active={location.pathname === '/office/syncstack'} id="syncstack" />
                    <SidebarItem icon={Terminal} label="Void Engine" path="/office/void" active={location.pathname === '/office/void'} id="void" />
                    <SidebarItem icon={Database} label="LamaDB" path="/office/lamadb" active={location.pathname === '/office/lamadb'} id="lamadb" />
                    <SidebarItem icon={Activity} label="LamaDB Telemetry" path="/office/telemetry" active={location.pathname === '/office/telemetry'} id="telemetry" />
                </div>

                <div className="border-t border-zinc-900 pt-1">
                    <SidebarItem icon={Plus} label="Init Node" path="/void/new" active={location.pathname === '/void/new'} />
                    <SidebarItem icon={Settings} label="Settings" path="/void/settings" active={location.pathname === '/void/settings'} />
                </div>

                <div className="p-6 border-t border-zinc-900 mt-auto">
                    <div className={`flex items-center gap-3 mb-4 ${isCollapsed ? 'justify-center' : ''}`}>
                        <div className="w-8 h-8 bg-zinc-900 rounded-full flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-zinc-500">
                                {user?.name?.charAt(0).toUpperCase() || 'U'}
                            </span>
                        </div>
                        {!isCollapsed && (
                            <div className="overflow-hidden">
                                <p className="text-xs font-bold text-white truncate">{user?.name || 'Unknown'}</p>
                                <p className="text-[10px] text-zinc-600 truncate">{user?.email || 'N/A'}</p>
                            </div>
                        )}
                    </div>
                    <button onClick={logout} className={`flex items-center gap-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest hover:text-white transition-colors ${isCollapsed ? 'justify-center' : ''}`}>
                        <LogOut size={12} /> {!isCollapsed && "Disconnect"}
                    </button>
                </div>

                <div className="p-4 border-t border-zinc-900/50 bg-zinc-950/30">
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="w-full flex items-center gap-3 px-2 py-2 text-[9px] font-bold text-zinc-600 hover:text-white uppercase tracking-[0.2em] transition-colors"
                    >
                        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                        {!isCollapsed && <span>Hide Panel</span>}
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className={`flex-1 ${isCollapsed ? 'ml-20' : 'ml-64'} min-h-screen transition-all duration-300`}>
                <Outlet />
            </div>
        </div>
    );
};

export default OfficeDashboard;
