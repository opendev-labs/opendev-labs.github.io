import { useState } from 'react';
import { Menu, X, Command, Code2, ChevronDown, LogOut, LayoutDashboard, Terminal, Database, Server } from 'lucide-react';
import { Outlet, Link } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const Logo = () => (
    <svg width="24" height="24" viewBox="0 0 116 100" fill="white" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M57.5 100L0 0H116L57.5 100Z" />
    </svg>
);

const MegaMenu = ({ items }: { items: any[] }) => (
    <div className="absolute top-12 left-0 w-[600px] bg-black border border-[#333] rounded-xl p-6 shadow-2xl grid grid-cols-2 gap-4 z-50 animate-in fade-in zoom-in-95 duration-200">
        {items.map((item, i) => (
            <Link to={item.href} key={i} className="group block p-3 rounded-lg hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3 mb-1">
                    <div className="p-2 bg-[#111] border border-[#333] rounded-md group-hover:border-[#555] transition-colors">
                        <item.icon size={16} className="text-white" />
                    </div>
                    <span className="font-semibold text-sm">{item.name}</span>
                </div>
                <p className="text-[#666] text-xs ml-[44px]">{item.desc}</p>
            </Link>
        ))}
    </div>
);

const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const { user, logout } = useAuth();
    let timeoutId: any = null;

    const handleMouseEnter = (item: string) => {
        if (timeoutId) clearTimeout(timeoutId);
        setHoveredItem(item);
    };

    const handleMouseLeave = () => {
        timeoutId = setTimeout(() => {
            setHoveredItem(null);
        }, 150); // Small delay to allow moving to menu
    };

    const productItems = [
        { name: 'Void', desc: 'Sovereign AI Environment', icon: Terminal, href: '/void' },
        { name: 'LamaDB', desc: 'Native Browser Database', icon: Database, href: '/lamadb' },
        { name: 'Q-Cloud', desc: 'Quantum Infrastructure', icon: Server, href: '/q-cloud' },
        { name: 'Dashboard', desc: 'Manage your projects', icon: LayoutDashboard, href: '/ide' },
    ];

    return (
        <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-[#333] h-16 flex items-center justify-between px-6 md:px-8">

            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`text-[13px] font-medium transition-colors hover:text-white ${
                    pathname === link.href ? 'text-white' : 'text-zinc-400'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-[13px] text-zinc-400 hidden sm:block">{user?.name}</span>
                <button
                  onClick={logout}
                  className="px-3 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-[13px] font-medium hover:bg-zinc-800 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-[13px] font-medium text-zinc-400 hover:text-white transition-colors">
                  Log In
                </Link>
                <Link
                  to="/ide"
                  className="px-4 py-1.5 rounded-full bg-white text-black text-[13px] font-bold hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95"
                >
                  Get Started
                </Link>
              </div>
            )}
                <Outlet />
            </main>
            <Footer />
        </div >
    );
}
