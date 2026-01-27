import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  DocsIcon, LogoutIcon, MenuIcon, XIcon, TerminalIcon,
  CpuChipIcon, RocketLaunchIcon, CubeIcon, ChartBarIcon,
  SparklesIcon, CommandLineIcon, BookOpenIcon, PuzzlePieceIcon,
  CheckCircleIcon, ClipboardIcon, ClockIcon, ChevronDownIcon,
  NewProjectIcon
} from './common/Icons';

/* --- ICONS & LOGO --- */

const AppLogo = () => (
  <div className="w-6 h-6 bg-white rotate-45 flex items-center justify-center overflow-hidden">
    <div className="w-4 h-4 bg-black rotate-[-45deg]"></div>
  </div>
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
    <div className="w-7 h-7 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400">
      {initials}
    </div>
  );
};

/* --- NAVIGATION DATA --- */

const MENU_ITEMS = {
  platform: {
    label: "Platform",
    items: [
      { name: "Runtime Fabric", desc: "Global edge execution engine", icon: CpuChipIcon, path: "/ide/platform/fabric" },
      { name: "Deployments", desc: "Zero-config builds & scaling", icon: RocketLaunchIcon, path: "/ide/deploy" },
      { name: "Execution Grid", desc: "Serverless compute primitives", icon: CubeIcon, path: "/ide/platform/grid" },
      { name: "Observability", desc: "Deep system introspection", icon: ChartBarIcon, path: "/ide/platform/observability" },
    ]
  },
  ai: {
    label: "AI",
    items: [
      { name: "HeroChat UI", desc: "Quantum intelligence interface", icon: SparklesIcon, path: "/ide/ai/chat" },
      { name: "Intent Compiler", desc: "Natural language to infrastructure", icon: CommandLineIcon, path: "/ide/ai/compiler" },
      { name: "Agent Runtime", desc: "Host autonomous compiled agents", icon: CpuChipIcon, path: "/ide/ai/agents" },
      { name: "Model Gateway", desc: "Unified LLM routing & caching", icon: CubeIcon, path: "/ide/ai/gateway" },
    ]
  },
  developers: {
    label: "Developers",
    items: [
      { name: "Documentation", desc: "Guides, references, and specs", icon: BookOpenIcon, path: "/ide/docs" },
      { name: "APIs", desc: "Programmatic control", icon: TerminalIcon, path: "/ide/docs/api" },
      { name: "SDKs", desc: "Type-safe client libraries", icon: CubeIcon, path: "/ide/docs/sdks" },
      { name: "Examples", desc: "Starters and patterns", icon: PuzzlePieceIcon, path: "/ide/docs/examples" },
    ]
  }
};

/* --- COMPONENTS --- */

const NavItem: React.FC<{
  label: string,
  children?: React.ReactNode
}> = ({ label, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  let timeout: any;

  const handleMouseEnter = () => {
    clearTimeout(timeout);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeout = setTimeout(() => setIsOpen(false), 150);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button className={`flex items-center gap-1 text-[13px] font-medium transition-colors duration-200 py-2 ${isOpen ? 'text-white' : 'text-zinc-400 hover:text-white'}`}>
        {label}
        <ChevronDownIcon className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      <div className={`absolute top-full left-0 pt-2 w-max min-w-[240px] z-50 transition-all duration-200 origin-top-left ${isOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 translate-y-1 invisible'}`}>
        <div className="bg-black border border-zinc-900 rounded-lg p-2 shadow-2xl ring-1 ring-white/5">
          {children}
        </div>
      </div>
    </div>
  );
};

const MenuItem: React.FC<{
  name: string,
  desc: string,
  icon: React.FC<{ className?: string }>,
  path: string
}> = ({ name, desc, icon: Icon, path }) => (
  <Link
    to={path}
    className="flex items-start gap-3 p-3 rounded-md hover:bg-zinc-950 transition-colors group"
  >
    <div className="mt-0.5 text-zinc-500 group-hover:text-white transition-colors">
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <div className="text-[13px] font-semibold text-zinc-200 group-hover:text-white leading-none mb-1.5">
        {name}
      </div>
      <div className="text-[11px] text-zinc-500 font-medium leading-snug group-hover:text-zinc-400">
        {desc}
      </div>
    </div>
  </Link>
);


export const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 border-b ${scrolled ? 'bg-black/90 backdrop-blur-md border-zinc-900' : 'bg-black border-transparent'}`}>
      <div className="max-w-[1200px] mx-auto px-6 h-14 flex items-center justify-between">

        {/* Left: Logo & Nav */}
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center gap-2 group">
            <AppLogo />
            <span className="text-xs font-bold text-white tracking-[0.2em] uppercase">opendev-labs</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            <NavItem label={MENU_ITEMS.platform.label}>
              <div className="grid grid-cols-1 w-[320px] gap-1">
                {MENU_ITEMS.platform.items.map((item) => (
                  <MenuItem key={item.name} {...item} />
                ))}
              </div>
            </NavItem>

            <NavItem label={MENU_ITEMS.ai.label}>
              <div className="grid grid-cols-1 w-[300px] gap-1">
                {MENU_ITEMS.ai.items.map((item) => (
                  <MenuItem key={item.name} {...item} />
                ))}
              </div>
            </NavItem>

            <NavItem label={MENU_ITEMS.developers.label}>
              <div className="grid grid-cols-1 w-[280px] gap-1">
                {MENU_ITEMS.developers.items.map((item) => (
                  <MenuItem key={item.name} {...item} />
                ))}
              </div>
            </NavItem>

            <Link to="/ide/pricing" className="text-[13px] font-medium text-zinc-400 hover:text-white transition-colors">
              Pricing
            </Link>
          </nav>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-4">
              <Link
                to="/ide/new"
                className="hidden sm:flex items-center gap-2 text-[11px] font-bold text-zinc-400 hover:text-white transition-colors border border-zinc-800 rounded-md px-3 py-1.5 hover:border-zinc-700 bg-zinc-950 uppercase tracking-widest"
              >
                <NewProjectIcon /> <span>New Project</span>
              </Link>

              {/* User Menu */}
              <div className="relative group">
                <button className="focus:outline-none">
                  <UserAvatar name={user.name} />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-zinc-950 border border-zinc-900 rounded-lg shadow-2xl py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="px-4 py-2 border-b border-zinc-900">
                    <p className="text-xs text-white font-bold truncate uppercase tracking-tight">{user.name}</p>
                  </div>
                  <Link to="/ide/dashboard" className="block w-full text-left px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors">Dashboard</Link>
                  <Link to="/ide/settings" className="block w-full text-left px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors">Settings</Link>
                  <div className="h-px bg-zinc-900 my-1"></div>
                  <button onClick={logout} className="w-full text-left px-4 py-2 text-xs font-semibold text-red-500 hover:text-red-400 hover:bg-zinc-900 transition-colors">Log Out</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/ide/login" className="text-[13px] font-medium text-zinc-400 hover:text-white transition-colors">
                Login
              </Link>
              <Link
                to="/ide/signup"
                className="text-[13px] font-bold bg-white text-black px-4 py-1.5 rounded-md hover:bg-zinc-200 transition-colors"
              >
                Launch
              </Link>
            </div>
          )}

          {/* Mobile Toggle */}
          <button className="lg:hidden text-zinc-400 hover:text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <XIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-14 bg-black z-40 p-6 flex flex-col gap-6 overflow-y-auto">
          {Object.entries(MENU_ITEMS).map(([key, section]) => (
            <div key={key}>
              <h3 className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-4">{section.label}</h3>
              <div className="flex flex-col gap-2">
                {section.items.map(item => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 py-2 text-zinc-300 hover:text-white transition-colors"
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-sm font-semibold">{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <div className="h-px bg-zinc-900 my-2"></div>
          <Link to="/ide/pricing" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-bold text-white uppercase tracking-widest">Pricing</Link>
        </div>
      )}
    </header>
  );
};