import React from 'react';
import { safeNavigate } from '../../services/navigation';
import { AnimatedLoaderIcon } from '../common/AnimatedLoaderIcon';

export const NotFoundPage: React.FC = () => {
    
    const handleNav = (e: React.MouseEvent<HTMLButtonElement>, path: string) => {
        e.preventDefault();
        safeNavigate(path);
    };

    return (
        <div className="flex flex-col items-center justify-center text-center h-full py-20">
            <AnimatedLoaderIcon size={80} strokeWidth={1} className="text-void-neon opacity-50" />
            <h1 className="mt-8 text-6xl font-bold tracking-tighter text-white">404</h1>
            <p className="mt-4 text-lg text-zinc-400 max-w-md">
                Gravitational anomaly detected. This page appears to have been lost to the void.
            </p>
            <button
                onClick={(e) => handleNav(e, '/')}
                className="mt-10 bg-white text-black font-semibold px-6 py-2 hover:bg-zinc-200 transition-colors text-sm"
            >
                Return to Dashboard
            </button>
        </div>
    );
};
