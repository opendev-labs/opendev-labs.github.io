import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import officialLogo from '../assets/official-logo.png';
import { useAuth } from '../features/void/hooks/useAuth';
import { MenuIcon, XIcon } from '../features/void/components/common/Icons';
import { ExternalLink } from 'lucide-react';

export const Header: React.FC = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { pathname } = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    const isOpenStudioRoute = pathname.startsWith('/open-studio');

    // Don't show header on OpenStudio (it has its own sidebar/header)
    if (isOpenStudioRoute) return null;

    const navLinks = [
        { label: 'Studio', path: '/open-studio' },
        { label: 'Hub', path: '/open-hub' },
        { label: 'Docs', path: '/docs' },
    ];

    return (
        <nav className={`fixed top-0 w-full z-[100] transition-all duration-300 h-14 ${scrolled ? 'bg-black/90 backdrop-blur-xl border-b border-zinc-800' : 'bg-black/50 backdrop-blur-sm border-b border-transparent'}`}>
            <div className="h-full max-w-[1100px] mx-auto flex items-center justify-between px-6">

                {/* Left: Logo + Nav */}
                <div className="flex items-center gap-8">
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <img
                            src={officialLogo}
                            alt="OpenDev-Labs"
                            className="h-7 w-auto object-contain"
                        />
                        <span className="text-[15px] font-semibold text-white tracking-tight group-hover:opacity-80 transition-opacity">
                            OpenDev-Labs
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map(link => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`px-3 py-1.5 text-[13px] font-medium rounded-md transition-colors ${
                                    pathname === link.path || pathname.startsWith(link.path + '/')
                                        ? 'text-white bg-zinc-800/50'
                                        : 'text-zinc-500 hover:text-zinc-300'
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-3">
                    {/* GitHub Link */}
                    <a
                        href="https://github.com/opendev-labs"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-[13px] text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                        <ExternalLink size={14} />
                        GitHub
                    </a>

                    {isAuthenticated ? (
                        <div className="flex items-center gap-3">
                            <div className="relative group">
                                <button className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[11px] font-semibold text-zinc-300">
                                        {user?.name?.[0]?.toUpperCase() || '?'}
                                    </div>
                                </button>

                                {/* Dropdown */}
                                <div className="absolute right-0 mt-2 w-52 bg-zinc-950 border border-zinc-800 rounded-lg shadow-2xl py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[110]">
                                    <div className="px-3 py-2.5 border-b border-zinc-800">
                                        <p className="text-[12px] text-zinc-300 font-medium truncate">{user?.name}</p>
                                        <p className="text-[11px] text-zinc-600 truncate">{user?.email}</p>
                                    </div>
                                    <Link to="/open-hub" className="block px-3 py-2 text-[13px] text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors">Hub</Link>
                                    <Link to="/open-studio" className="block px-3 py-2 text-[13px] text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors">Studio</Link>
                                    <Link to="/user/profile" className="block px-3 py-2 text-[13px] text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors">Profile</Link>
                                    <Link to="/settings/profile" className="block px-3 py-2 text-[13px] text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors">Settings</Link>
                                    <div className="h-px bg-zinc-800 my-1" />
                                    <button
                                        onClick={logout}
                                        className="w-full text-left px-3 py-2 text-[13px] text-red-400 hover:bg-red-500/10 transition-colors"
                                    >
                                        Log out
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => navigate('/auth')}
                            className="px-4 py-1.5 text-[13px] font-medium bg-white text-black rounded-md hover:bg-zinc-200 transition-colors"
                        >
                            Sign in
                        </button>
                    )}

                    {/* Mobile menu toggle */}
                    <button
                        className="md:hidden p-1.5 text-zinc-400 hover:text-white"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <XIcon /> : <MenuIcon />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 top-14 bg-black z-40 p-6 space-y-2">
                    {navLinks.map(link => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className="block px-4 py-3 text-[15px] font-medium text-zinc-400 hover:text-white border-b border-zinc-900 transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                    <a
                        href="https://github.com/opendev-labs"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-4 py-3 text-[15px] font-medium text-zinc-500 hover:text-white border-b border-zinc-900 transition-colors"
                    >
                        GitHub
                    </a>
                    {!isAuthenticated && (
                        <button
                            onClick={() => navigate('/auth')}
                            className="w-full mt-4 px-4 py-3 bg-white text-black text-[15px] font-semibold rounded-lg"
                        >
                            Sign in
                        </button>
                    )}
                </div>
            )}
        </nav>
    );
};
