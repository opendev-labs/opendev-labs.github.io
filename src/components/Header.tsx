import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
    ChevronDownIcon, MenuIcon, XIcon, TerminalIcon,
    CpuChipIcon, RocketLaunchIcon, CubeIcon,
    SparklesIcon, CommandLineIcon, BookOpenIcon, PuzzlePieceIcon,
    NewProjectIcon
} from '../features/void/components/common/Icons';
import { Button } from './ui/Button';

/* --- LOGO --- */
const Logo = () => (
    <svg width="24" height="24" viewBox="0 0 116 100" fill="white" xmlns="http://www.w3.org/2000/svg" className="rotate-0 group-hover:rotate-180 transition-transform duration-700">
        <path fillRule="evenodd" clipRule="evenodd" d="M57.5 100L0 0H116L57.5 100Z" />
    </svg>
);

const UserAvatar = ({ name }: { name: string }) => {
    const initials = name
        .split(' ')
        .filter(Boolean)
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    return (
        <div className="w-8 h-8 rounded-none bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400 group-hover:border-zinc-600 transition-colors">
            {initials || '??'}
        </div>
    );
};

/* --- NAVIGATION DATA --- */
const MENU_DATA = [
    {
        title: "Intelligence",
        items: [
            { name: "Project Quantum", desc: "Intelligent quantum-logic orchestration", icon: SparklesIcon, path: "/quantum" },
            { name: "Co-Writer", desc: "Collaborative neural-assisted composition", icon: BookOpenIcon, path: "/co-writer" },
            { name: "AgentBash", desc: "Autonomous agentic CLI primitives", icon: TerminalIcon, path: "/agentbash" },
        ]
    },
    {
        title: "Compute & State",
        items: [
            { name: "Office Dashboard", desc: "High-fidelity terminal for sovereign nodes", icon: CommandLineIcon, path: "/office" },
            { name: "LamaDB", desc: "Native browser database for high-velocity state", icon: CubeIcon, path: "/lamadb" },
            { name: "Q-Cloud", desc: "Quantum-ready serverless infrastructure", icon: RocketLaunchIcon, path: "/q-cloud" },
        ]
    },
    {
        title: "Infrastructure",
        items: [
            { name: "Spoon-CLI", desc: "Universal AI Orchestration Engine", icon: TerminalIcon, path: "/cli" },
            { name: "Transcender", desc: "Neural mesh connectivity protocol", icon: CpuChipIcon, path: "/transcender" },
            { name: "SyncStack", desc: "Distributed state synchronization layer", icon: PuzzlePieceIcon, path: "/syncstack" },
        ]
    }
];

export const Header: React.FC = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const { pathname } = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    return (
        <nav className={`fixed top-0 w-full z-[100] transition-all duration-300 border-b h-14 ${scrolled ? 'bg-black/80 backdrop-blur-xl border-zinc-900' : 'bg-black border-transparent'}`}>
            <div className="h-full flex items-center justify-between px-6 md:px-12 max-w-[1400px] mx-auto">
                <div className="flex items-center gap-10">
                    <Link to="/" className="flex items-center gap-3 group">
                        <Logo />
                        <span className="font-bold tracking-tighter text-sm uppercase tracking-[0.2em] group-hover:opacity-80 transition-opacity">opendev-labs</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-6">
                        <div
                            className="relative"
                            onMouseEnter={() => setActiveDropdown('products')}
                            onMouseLeave={() => setActiveDropdown(null)}
                        >
                            <button className={`flex items-center gap-1 text-[13px] font-medium transition-colors duration-200 py-2 ${activeDropdown === 'products' ? 'text-white' : 'text-zinc-500 hover:text-white'}`}>
                                Products
                                <ChevronDownIcon className={`w-3 h-3 transition-transform duration-200 ${activeDropdown === 'products' ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Mega Dropdown */}
                            <div className={`absolute top-full left-0 pt-2 z-50 transition-all duration-300 origin-top-left ${activeDropdown === 'products' ? 'opacity-100 translate-y-0 visible' : 'opacity-0 translate-y-1 invisible'}`}>
                                <div className="bg-[#050505] border border-zinc-900 rounded-none p-8 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] ring-1 ring-white/5 w-[900px] grid grid-cols-3 gap-8">
                                    {MENU_DATA.map((section) => (
                                        <div key={section.title}>
                                            <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.3em] mb-4">{section.title}</div>
                                            <div className="space-y-1">
                                                {section.items.map(item => (
                                                    <Link
                                                        key={item.name}
                                                        to={item.path}
                                                        className="flex items-start gap-4 p-3 rounded-none hover:bg-zinc-900/50 transition-all duration-200 group border border-transparent hover:border-zinc-800"
                                                    >
                                                        <div className="w-8 h-8 rounded-none bg-zinc-950 border border-zinc-900 flex items-center justify-center flex-shrink-0 group-hover:border-zinc-700 transition-colors">
                                                            <item.icon className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
                                                        </div>
                                                        <div>
                                                            <div className="text-[13px] font-bold text-zinc-100 group-hover:text-white leading-tight mb-0.5">{item.name}</div>
                                                            <div className="text-[11px] text-zinc-500 font-medium leading-snug group-hover:text-zinc-400 max-w-[200px]">{item.desc}</div>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <Link to="/solutions" className="text-[13px] font-medium text-zinc-500 hover:text-white transition-colors">Solutions</Link>
                        <Link to="/pricing" className="text-[13px] font-medium text-zinc-500 hover:text-white transition-colors">Pricing</Link>
                        <Link to="/docs" className="text-[13px] font-medium text-zinc-500 hover:text-white transition-colors">Docs</Link>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    {isAuthenticated ? (
                        <div className="flex items-center gap-6">
                            <Link to="/office/new" className="hidden md:flex items-center gap-2 text-[10px] font-bold text-zinc-400 hover:text-white uppercase tracking-widest border border-zinc-800 px-3 py-1.5 rounded-none hover:bg-zinc-900 transition-all">
                                <NewProjectIcon /> <span>Deploy</span>
                            </Link>

                            <div className="relative group">
                                <button className="flex items-center gap-3 group">
                                    <div className="text-right hidden sm:block">
                                        <div className="text-[10px] font-bold text-white uppercase tracking-tight">{user?.name}</div>
                                        <div className="text-[9px] font-medium text-zinc-600 uppercase tracking-widest">Protocol Linked</div>
                                    </div>
                                    <UserAvatar name={user?.name || ''} />
                                </button>

                                <div className="absolute right-0 mt-3 w-56 bg-zinc-950 border border-zinc-900 rounded-none shadow-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[110] ring-1 ring-white/5">
                                    <div className="px-4 py-3 border-b border-zinc-900 mb-1">
                                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-none mb-1">Authenticated Node</p>
                                        <p className="text-[11px] text-zinc-200 font-bold truncate">{user?.email}</p>
                                    </div>
                                    <Link to="/office" className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-zinc-400 hover:text-white hover:bg-zinc-900/50 transition-all">
                                        Mission Control
                                    </Link>
                                    <Link to="/office/settings" className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-zinc-400 hover:text-white hover:bg-zinc-900/50 transition-all">
                                        Node Settings
                                    </Link>
                                    <div className="h-px bg-zinc-900 my-1 mx-2" />
                                    <button
                                        onClick={logout}
                                        className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-500/5 transition-all"
                                    >
                                        Initialize Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-6">
                            <Link to="/auth" className="text-[13px] font-medium text-zinc-500 hover:text-white transition-colors">Log In</Link>
                            <Button size="sm" onClick={() => navigate('/auth?mode=signup')}>Deploy Intelligence</Button>
                        </div>
                    )}

                    <button className="lg:hidden p-2 text-zinc-400 hover:text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        {isMobileMenuOpen ? <XIcon /> : <MenuIcon />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 top-14 bg-black z-40 p-8 flex flex-col gap-10 overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="space-y-8">
                        {MENU_DATA.map((section) => (
                            <div key={section.title}>
                                <h3 className="text-[10px] font-bold text-zinc-700 uppercase tracking-[0.4em] mb-6">{section.title}</h3>
                                <div className="grid grid-cols-1 gap-4">
                                    {section.items.map(item => (
                                        <Link key={item.name} to={item.path} className="flex items-center gap-4 group">
                                            <div className="w-10 h-10 rounded-none bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                                                <item.icon className="w-5 h-5 text-zinc-500 group-hover:text-white" />
                                            </div>
                                            <span className="text-sm font-bold text-zinc-300 group-hover:text-white uppercase tracking-widest">{item.name}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="h-px bg-zinc-900" />
                    <div className="flex flex-col gap-6">
                        <Link to="/solutions" className="text-sm font-bold text-zinc-400 hover:text-white uppercase tracking-widest">Solutions</Link>
                        <Link to="/pricing" className="text-sm font-bold text-zinc-400 hover:text-white uppercase tracking-widest">Pricing</Link>
                        <Link to="/docs" className="text-sm font-bold text-zinc-400 hover:text-white uppercase tracking-widest">Documentation</Link>
                    </div>
                </div>
            )}
        </nav>
    );
};
