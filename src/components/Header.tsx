import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import officialLogo from '../assets/official-logo.png';
import { useAuth } from '../features/void/hooks/useAuth';

export const Header: React.FC = () => {
    const { isAuthenticated, logout } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const { pathname } = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isOpenStudioRoute = pathname.startsWith('/open-studio');
    if (isOpenStudioRoute) return null;

    return (
        <header className={`fixed top-0 z-50 w-full border-b transition-all duration-300 ${
            scrolled ? 'border-zinc-800 bg-black/80 backdrop-blur-md' : 'border-transparent bg-transparent'
        }`}>
            <div className="container mx-auto flex h-14 max-w-[1100px] items-center justify-between px-6">
                <div className="flex items-center gap-8">
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <img src={officialLogo} alt="OpenDev-Labs" className="h-6 w-auto object-contain" />
                        <span className="text-[15px] font-bold text-white tracking-tight">OpenDev-Labs</span>
                    </Link>
                    
                    <nav className="hidden md:flex items-center gap-6 text-[13px] font-medium">
                        <Link to="/open-studio" className="text-zinc-400 hover:text-white transition-colors">IDE</Link>
                        <Link to="/open-hub" className="text-zinc-400 hover:text-white transition-colors">Hub</Link>
                        <Link to="/docs" className="text-zinc-400 hover:text-white transition-colors">Docs</Link>
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <a 
                        href="https://github.com/opendev-labs" 
                        target="_blank" 
                        rel="noreferrer" 
                        className="hidden sm:flex items-center gap-1.5 rounded-md border border-zinc-800 px-3 py-1.5 text-[12px] text-zinc-400 hover:text-white hover:border-zinc-700 transition-all"
                    >
                        <span>GitHub</span>
                        <span className="flex h-4 items-center rounded bg-zinc-800 px-1 text-[10px] text-zinc-300">Star</span>
                    </a>
                    
                    {isAuthenticated ? (
                        <button 
                            onClick={logout}
                            className="rounded-md bg-zinc-900 border border-zinc-800 px-4 py-1.5 text-[13px] font-medium text-white hover:bg-zinc-800 transition-colors"
                        >
                            Sign Out
                        </button>
                    ) : (
                        <button 
                            onClick={() => navigate('/auth')}
                            className="rounded-md bg-white px-4 py-1.5 text-[13px] font-medium text-black hover:bg-zinc-200 transition-colors"
                        >
                            Sign In
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};
