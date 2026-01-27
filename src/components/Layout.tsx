import { useState } from 'react';
import { Menu, X, LayoutDashboard, Terminal, Database, Server, Box } from 'lucide-react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Logo = () => (
  <svg width="24" height="24" viewBox="0 0 116 100" fill="white" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M57.5 100L0 0H116L57.5 100Z" />
  </svg>
);

const Footer = () => (
  <footer className="border-t border-zinc-900 bg-black py-12 px-6">
    <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
      <div className="flex items-center gap-2">
        <Logo />
        <span className="font-bold tracking-tighter text-lg uppercase">opendev-labs.</span>
      </div>
      <div className="flex gap-8 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
        <Link to="/docs" className="hover:text-white transition-colors">Documentation</Link>
        <Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link>
        <Link to="/cli" className="hover:text-white transition-colors">CLI</Link>
        <a href="https://github.com/opendev-labs" className="hover:text-white transition-colors">GitHub</a>
      </div>
      <p className="text-[10px] font-bold text-zinc-700 uppercase tracking-[0.2em]">
        &copy; 2026 Nexus Registry Protocol
      </p>
    </div>
  </footer>
);

export default function Layout() {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'LamaDB', href: '/lamadb' },
    { name: 'Q-Cloud', href: '/q-cloud' },
    { name: 'SyncStack', href: '/syncstack' },
    { name: 'Dashboard', href: '/ide' },
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans">
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-zinc-900 h-16 flex items-center justify-between px-6 md:px-12">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-3 group">
            <Logo />
            <span className="font-bold tracking-tighter text-xl group-hover:opacity-80 transition-opacity uppercase">opendev-labs.</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`text-[11px] font-bold uppercase tracking-widest transition-colors hover:text-white ${pathname === link.href ? 'text-white' : 'text-zinc-500'
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-6">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest hidden sm:block">
                node: {user?.email?.split('@')[0]}
              </span>
              <button
                onClick={logout}
                className="h-9 px-4 border border-zinc-900 text-[10px] font-bold uppercase tracking-widest hover:border-white hover:text-white transition-all"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <Link to="/login" className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">
                Log In
              </Link>
              <Link
                to="/ide"
                className="h-9 px-6 bg-white text-black text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all flex items-center"
              >
                Get Started
              </Link>
            </div>
          )}

          <button className="md:hidden p-2 text-zinc-400 hover:text-white" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="absolute top-16 left-0 w-full bg-black border-b border-zinc-900 p-6 flex flex-col gap-6 md:hidden animate-in fade-in slide-in-from-top-4 duration-200">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className="text-sm font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
            {isAuthenticated && (
              <button
                onClick={() => { logout(); setIsOpen(false); }}
                className="text-sm font-bold uppercase tracking-widest text-red-500 hover:text-red-400 transition-colors text-left"
              >
                Disconnect
              </button>
            )}
          </div>
        )}
      </nav>

      <main className="pt-16 min-h-[calc(100vh-16rem)]">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
