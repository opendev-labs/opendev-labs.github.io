import React, { useState, useRef, useEffect } from 'react';
import { safeNavigate } from '../services/navigation';
import { useAuth } from '../hooks/useAuth';
import type { User } from '../types';
import {
  DocsIcon, LogoutIcon, MenuIcon, XIcon, TerminalIcon,
  CpuChipIcon, RocketLaunchIcon, CubeIcon, ChartBarIcon,
  SparklesIcon, CommandLineIcon, BookOpenIcon, PuzzlePieceIcon,
  CheckCircleIcon, ClipboardIcon, ClockIcon, ChevronDownIcon,
  NewProjectIcon
} from './common/Icons';

/* --- ICONS & LOGO --- */

const VoidLogo = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform duration-300 group-hover:scale-105">
    {/* Outer Hollow Diamond - slightly thicker for strict infra feel */}
    <path
      d="M12 3L21 12L12 21L3 12L12 3Z"
      stroke="white"
      strokeWidth="2"
      strokeLinejoin="miter"
      className="transition-opacity duration-300"
    />

    {/* Inner Solid Diamond - The "Core" */}
    <path
      d="M12 8L16 12L12 16L8 12L12 8Z"
      className="fill-white transition-all duration-300 ease-out 
                       group-hover:fill-blue-500 
                       group-hover:drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]"
    />
  </svg>
);

const UserAvatar = ({ name }: { name: string }) => {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-medium text-zinc-300">
      {initials}
    </div>
  );
};

/* --- NAVIGATION DATA --- */

const MENU_ITEMS = {
  platform: {
    label: "Platform",
    items: [
      { name: "Runtime Fabric", desc: "Global edge execution engine", icon: CpuChipIcon, path: "/#/platform/fabric" },
      { name: "Deployments", desc: "Zero-config builds & scaling", icon: RocketLaunchIcon, path: "/#/deploy" },
      { name: "Execution Grid", desc: "Serverless compute primitives", icon: CubeIcon, path: "/#/platform/grid" },
      { name: "Observability", desc: "Deep system introspection", icon: ChartBarIcon, path: "/#/platform/observability" },
    ]
  },
  ai: {
    label: "AI",
    items: [
      { name: "HeroChat UI", desc: "Quantum intelligence interface", icon: SparklesIcon, path: "/#/qvenv" },
      { name: "Intent Compiler", desc: "Natural language to infrastructure", icon: CommandLineIcon, path: "/#/ai/compiler" },
      { name: "Agent Runtime", desc: "Host autonomous compiled agents", icon: CpuChipIcon, path: "/#/ai/agents" },
      { name: "Model Gateway", desc: "Unified LLM routing & caching", icon: CubeIcon, path: "/#/ai/gateway" },
    ]
  },
  developers: {
    label: "Developers",
    items: [
      { name: "Documentation", desc: "Guides, references, and specs", icon: BookOpenIcon, path: "/#/docs" },
      { name: "APIs", desc: "Programmatic control", icon: TerminalIcon, path: "/#/docs/api" },
      { name: "SDKs", desc: "Type-safe client libraries", icon: CubeIcon, path: "/#/docs/sdks" },
      { name: "Examples", desc: "Starters and patterns", icon: PuzzlePieceIcon, path: "/#/docs/examples" },
    ]
  },
  enterprise: {
    label: "Enterprise",
    items: [
      { name: "Security", desc: "SOC2, HIPAA, ISO 27001", icon: CheckCircleIcon, path: "/#/enterprise/security" },
      { name: "Compliance", desc: "Audit logs & policy enforcement", icon: ClipboardIcon, path: "/#/enterprise/compliance" },
      { name: "SLA", desc: "99.99% uptime guarantees", icon: ClockIcon, path: "/#/enterprise/sla" },
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
    timeout = setTimeout(() => setIsOpen(false), 150); // Small delay for smoothness
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button className={`flex items-center gap-1 text-sm font-medium transition-colors duration-200 py-2 ${isOpen ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'}`}>
        {label}
        <ChevronDownIcon className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      <div className={`absolute top-full left-0 pt-2 w-max min-w-[240px] z-50 transition-all duration-200 origin-top-left ${isOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 translate-y-1 invisible'}`}>
        <div className="bg-black/95 backdrop-blur-3xl border border-zinc-800 rounded-lg p-2 shadow-2xl ring-1 ring-white/5">
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
  path: string,
  onClick: (path: string) => void
}> = ({ name, desc, icon: Icon, path, onClick }) => (
  <a
    href={path}
    onClick={(e) => { e.preventDefault(); onClick(path); }}
    className="flex items-start gap-3 p-3 rounded-md hover:bg-zinc-900/50 transition-colors group"
  >
    <div className="mt-0.5 text-zinc-500 group-hover:text-white transition-colors">
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <div className="text-sm font-medium text-zinc-200 group-hover:text-white leading-none mb-1.5">
        {name}
      </div>
      <div className="text-xs text-zinc-500 font-normal leading-snug group-hover:text-zinc-400">
        {desc}
      </div>
    </div>
  </a>
);


export const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (path: string) => {
    safeNavigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 border-b ${scrolled ? 'bg-black/80 backdrop-blur-xl border-zinc-800' : 'bg-black border-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">

        {/* Left: Logo & Nav */}
        <div className="flex items-center gap-10">
          <a href="/#/" onClick={(e) => { e.preventDefault(); handleNav('/'); }} className="flex items-center gap-2 group">
            <VoidLogo />
            <span className="text-lg font-bold text-white tracking-widest font-mono">VOID</span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            <NavItem label={MENU_ITEMS.platform.label}>
              <div className="grid grid-cols-1 w-[320px] gap-1">
                {MENU_ITEMS.platform.items.map((item) => (
                  <MenuItem key={item.name} {...item} onClick={handleNav} />
                ))}
              </div>
            </NavItem>

            <NavItem label={MENU_ITEMS.ai.label}>
              <div className="grid grid-cols-1 w-[300px] gap-1">
                {MENU_ITEMS.ai.items.map((item) => (
                  <MenuItem key={item.name} {...item} onClick={handleNav} />
                ))}
              </div>
            </NavItem>

            <NavItem label={MENU_ITEMS.developers.label}>
              <div className="grid grid-cols-1 w-[280px] gap-1">
                {MENU_ITEMS.developers.items.map((item) => (
                  <MenuItem key={item.name} {...item} onClick={handleNav} />
                ))}
              </div>
            </NavItem>

            <NavItem label={MENU_ITEMS.enterprise.label}>
              <div className="grid grid-cols-1 w-[280px] gap-1">
                {MENU_ITEMS.enterprise.items.map((item) => (
                  <MenuItem key={item.name} {...item} onClick={handleNav} />
                ))}
              </div>
            </NavItem>

            <a href="https://qvenv.web.app" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
              HeroChat
            </a>
            <a href="/#/pricing" onClick={(e) => { e.preventDefault(); handleNav('/pricing'); }} className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
              Pricing
            </a>
          </nav>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-4">
              {/* Dashboard/Project Shortcuts could go here */}
              <button
                onClick={() => handleNav('/new')}
                className="hidden sm:flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors border border-zinc-800 rounded-full px-3 py-1.5 hover:border-zinc-600 bg-zinc-900/50"
              >
                <NewProjectIcon /> <span>New Project</span>
              </button>

              {/* User Menu */}
              <div className="relative group">
                <button className="focus:outline-none">
                  <UserAvatar name={user.name} />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="px-4 py-2 border-b border-zinc-800">
                    <p className="text-sm text-white font-medium truncate">{user.name}</p>
                  </div>
                  <button onClick={() => handleNav('/dashboard')} className="w-full text-left px-4 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">Dashboard</button>
                  <button onClick={() => handleNav('/settings')} className="w-full text-left px-4 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">Settings</button>
                  <div className="h-px bg-zinc-800 my-1"></div>
                  <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-zinc-800 transition-colors">Log Out</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <a href="/#/login" onClick={(e) => { e.preventDefault(); handleNav('/login'); }} className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                Login
              </a>
              <a
                href="/#/signup"
                onClick={(e) => { e.preventDefault(); handleNav('/signup'); }}
                className="text-sm font-medium bg-white text-black px-4 py-2 rounded-md hover:bg-zinc-200 transition-colors"
              >
                Launch VOID
              </a>
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
        <div className="lg:hidden fixed inset-0 top-16 bg-black z-40 p-6 flex flex-col gap-6 overflow-y-auto">
          {Object.entries(MENU_ITEMS).map(([key, section]) => (
            <div key={key}>
              <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">{section.label}</h3>
              <div className="flex flex-col gap-1">
                {section.items.map(item => (
                  <a
                    key={item.name}
                    href={item.path}
                    onClick={(e) => { e.preventDefault(); handleNav(item.path); }}
                    className="flex items-center gap-3 py-2 text-zinc-300 hover:text-white"
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-base">{item.name}</span>
                  </a>
                ))}
              </div>
            </div>
          ))}
          <div className="h-px bg-zinc-800 my-2"></div>
          <a href="/#/pricing" onClick={(e) => { e.preventDefault(); handleNav('/pricing'); }} className="text-lg font-medium text-white">Pricing</a>
        </div>
      )}
    </header>
  );
};