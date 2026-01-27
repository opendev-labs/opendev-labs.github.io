import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  ChevronDownIcon, MenuIcon, XIcon, CpuChipIcon,
  TerminalIcon, SparklesIcon, RocketLaunchIcon,
  CubeIcon, BookOpenIcon, PuzzlePieceIcon,
  CommandLineIcon
} from '../features/void/components/common/Icons';

/* --- LOGO --- */
const Logo = () => (
  <svg width="24" height="24" viewBox="0 0 116 100" fill="white" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M57.5 100L0 0H116L57.5 100Z" />
  </svg>
);

/* --- NAVIGATION DATA --- */
const PLATFORM_SECTIONS = [
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
      { name: "QBET", desc: "High-fidelity terminal for sovereign nodes", icon: CommandLineIcon, path: "/ide" },
      { name: "LamaDB", desc: "Native browser database for high-velocity state", icon: CubeIcon, path: "/lamadb" },
      { name: "Q-Cloud", desc: "Quantum-ready serverless infrastructure", icon: RocketLaunchIcon, path: "/q-cloud" },
    ]
  },
  {
    title: "Infrastructure",
    items: [
      { name: "Transcender", desc: "Neural mesh connectivity protocol", icon: CpuChipIcon, path: "/transcender" },
      { name: "SyncStack", desc: "Distributed state synchronization layer", icon: PuzzlePieceIcon, path: "/syncstack" },
      { name: "Spoon-CLI", desc: "The standard for high-pressure clusters", icon: TerminalIcon, path: "/cli" },
    ]
  }
];

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
      <div className={`absolute top-full left-0 pt-2 z-50 transition-all duration-300 origin-top-left ${isOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 translate-y-1 invisible'}`}>
        <div className="bg-[#050505] border border-zinc-900 rounded-xl p-6 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] ring-1 ring-white/10">
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
    className="flex items-start gap-4 p-3 rounded-lg hover:bg-zinc-900/50 transition-all duration-200 group border border-transparent hover:border-zinc-800"
  >
    <div className="w-8 h-8 rounded-md bg-zinc-950 border border-zinc-900 flex items-center justify-center flex-shrink-0 group-hover:border-zinc-700 transition-colors">
      <Icon className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
    </div>
    <div>
      <div className="text-[13px] font-bold text-zinc-100 group-hover:text-white leading-tight mb-0.5">
        {name}
      </div>
      <div className="text-[11px] text-zinc-500 font-medium leading-snug group-hover:text-zinc-400 max-w-[200px]">
        {desc}
      </div>
    </div>
  </Link>
);

const Footer = () => (
  <footer className="border-t border-zinc-900 bg-black py-12 px-6">
    <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-8 max-w-[1200px]">
      <div className="flex items-center gap-2">
        <Logo />
        <span className="font-bold tracking-tighter text-lg lowercase">opendev-labs</span>
      </div>
      <div className="flex gap-8 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
        <Link to="/changelog" className="hover:text-white transition-colors">Changelog</Link>
        <Link to="/docs" className="hover:text-white transition-colors">Docs</Link>
        <Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link>
        <a href="https://github.com/opendev-labs" className="hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">GitHub</a>
      </div>
      <p className="text-[10px] font-bold text-zinc-700 uppercase tracking-[0.2em]">
        &copy; 2026 Nexus Registry Protocol
      </p>
    </div>
  </footer>
);

export default function Layout() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans">
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b h-14 ${scrolled ? 'bg-black/80 backdrop-blur-xl border-zinc-900' : 'bg-black border-transparent'}`}>
        <div className="h-full flex items-center justify-between px-6 md:px-12 max-w-[1400px] mx-auto">
          <div className="flex items-center gap-10">
            <Link to="/" className="flex items-center gap-3 group">
              <Logo />
              <span className="font-bold tracking-tighter text-sm uppercase tracking-[0.2em] group-hover:opacity-80 transition-opacity">opendev-labs</span>
            </Link>

            <div className="hidden lg:flex items-center gap-6">
              <NavItem label="Products">
                <div className="flex gap-8 w-[900px]">
                  {PLATFORM_SECTIONS.map((section) => (
                    <div key={section.title} className="flex-1">
                      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-3 mb-3">
                        {section.title}
                      </div>
                      <div className="grid grid-cols-1 gap-1">
                        {section.items.map(p => <MenuItem key={p.name} {...p} />)}
                      </div>
                    </div>
                  ))}
                </div>
              </NavItem>
              <Link to="/solutions" className="text-[13px] font-medium text-zinc-400 hover:text-white transition-colors">Solutions</Link>
              <Link to="/pricing" className="text-[13px] font-medium text-zinc-400 hover:text-white transition-colors">Pricing</Link>
              <Link to="/docs" className="text-[13px] font-medium text-zinc-400 hover:text-white transition-colors">Docs</Link>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[13px] font-medium">
            {isAuthenticated ? (
              <div className="flex items-center gap-6">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest hidden sm:block">
                  node: {user?.email?.split('@')[0]}
                </span>
                <button
                  onClick={logout}
                  className="h-8 px-4 bg-white text-black text-[11px] font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all rounded hover:scale-105 active:scale-95"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <Link to="/auth" className="text-zinc-400 hover:text-white transition-colors">
                  Log In
                </Link>
                <Link
                  to="/ide"
                  className="h-8 px-5 bg-white text-black text-[11px] font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all flex items-center rounded hover:scale-105 active:scale-95 shadow-lg"
                >
                  Deploy
                </Link>
              </div>
            )}

            <button className="lg:hidden p-2 text-zinc-400 hover:text-white" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <XIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="absolute top-14 left-0 w-full h-[calc(100vh-3.5rem)] bg-black border-b border-zinc-900 p-6 flex flex-col gap-6 lg:hidden animate-in fade-in slide-in-from-top-4 duration-200 overflow-y-auto">
            <div className="space-y-4">
              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Products</p>
              <div className="grid grid-cols-1 gap-4">
                {PLATFORM_SECTIONS.flatMap(s => s.items).map(p => (
                  <Link key={p.name} to={p.path} onClick={() => setIsOpen(false)} className="flex items-center gap-3">
                    <p.icon className="w-5 h-5 text-zinc-500" />
                    <span className="text-sm font-semibold">{p.name}</span>
                  </Link>
                ))}
              </div>
            </div>
            <div className="h-px bg-zinc-900 my-2" />
            <Link to="/solutions" className="text-sm font-bold uppercase tracking-widest" onClick={() => setIsOpen(false)}>Solutions</Link>
            <Link to="/pricing" className="text-sm font-bold uppercase tracking-widest" onClick={() => setIsOpen(false)}>Pricing</Link>
            <Link to="/docs" className="text-sm font-bold uppercase tracking-widest" onClick={() => setIsOpen(false)}>Docs</Link>
          </div>
        )}
      </nav>

      <main className="pt-14">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
