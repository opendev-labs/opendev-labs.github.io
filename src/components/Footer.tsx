import React from 'react';
import { Link } from 'react-router-dom';

const Logo = () => (
    <svg width="24" height="24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="footer-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00f2ff" />
                <stop offset="50%" stopColor="#bc00ff" />
                <stop offset="100%" stopColor="#ff00d4" />
            </linearGradient>
        </defs>
        <path d="M50 90L10 15H90L50 90Z" stroke="url(#footer-logo-grad)" strokeWidth="4" />
        <path d="M50 75L30 35H70L50 75Z" fill="url(#footer-logo-grad)" opacity="0.6" />
    </svg>
);

export const Footer: React.FC = () => {
    return (
        <footer className="border-t border-zinc-900 bg-black py-16 px-6">
            <div className="container mx-auto max-w-[1200px]">
                <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <Logo />
                            <span className="font-bold tracking-tighter text-xl lowercase">opendev-labs</span>
                        </div>
                        <p className="text-zinc-500 text-sm max-w-xs font-medium leading-relaxed">
                            The sovereign intelligence ecosystem for high-fidelity autonomy and distributed state.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 md:gap-20">
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-bold text-white uppercase tracking-[0.3em] mb-6">Platform</h4>
                            <Link to="/void" className="block text-[11px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest transition-colors">Void Hub</Link>
                            <Link to="/lamadb" className="block text-[11px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest transition-colors">LamaDB</Link>
                            <Link to="/cli" className="block text-[11px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest transition-colors">Spoon CLI</Link>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-bold text-white uppercase tracking-[0.3em] mb-6">Resources</h4>
                            <Link to="/docs" className="block text-[11px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest transition-colors">Documentation</Link>
                            <Link to="/changelog" className="block text-[11px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest transition-colors">Changelog</Link>
                            <a href="https://github.com/opendev-labs" className="block text-[11px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest transition-colors" target="_blank" rel="noopener noreferrer">Community</a>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-bold text-white uppercase tracking-[0.3em] mb-6">Legal</h4>
                            <Link to="/terms" className="block text-[11px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest transition-colors">Digital Pact</Link>
                            <Link to="/privacy" className="block text-[11px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest transition-colors">Privacy Protocol</Link>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-t border-zinc-900 pt-8">
                    <p className="text-[10px] font-bold text-zinc-700 uppercase tracking-[0.2em]">
                        &copy; 2026 Nexus Registry Protocol // Distributed Intel.
                    </p>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Hardline: All Nodes Operational</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};
