import React from 'react';
import { safeNavigate } from '../../services/navigation';

export const NotFoundPage: React.FC = () => {

    const handleNav = (e: React.MouseEvent<HTMLButtonElement>, path: string) => {
        e.preventDefault();
        safeNavigate(path);
    };

    return (
        <div className="flex flex-col items-center justify-center text-center h-[70vh] selection:bg-white selection:text-black">
            <div className="relative mb-16">
                <div className="w-24 h-24 border border-zinc-900 flex items-center justify-center bg-black rotate-45">
                    <div className="w-12 h-12 border border-white/20 -rotate-45 animate-pulse"></div>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] font-bold text-white uppercase tracking-[0.3em]">
                    404
                </div>
            </div>

            <h1 className="text-5xl font-bold tracking-tighter text-white mb-6 uppercase">Registry Error</h1>

            <p className="text-[11px] font-bold text-zinc-600 max-w-sm uppercase tracking-[0.2em] leading-loose mb-12">
                Neural handshake failed. Requested protocol has been purged from the nexus registry or does not exist.
            </p>

            <button
                onClick={(e) => handleNav(e, '/')}
                className="h-12 bg-white text-black font-bold px-12 uppercase tracking-widest hover:bg-zinc-200 transition-all"
            >
                Resync Terminal
            </button>
        </div>
    );
};

