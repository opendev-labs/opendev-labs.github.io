import React from 'react';
import { AnimatedLoaderIcon } from './AnimatedLoaderIcon';

const LoadingText: React.FC = () => {
    const text = "INITIALIZING...";
    return (
        <p className="mt-6 text-lg text-zinc-400 tracking-widest font-mono">
            {text.split('').map((char, i) => (
                <span 
                    key={i} 
                    className="opacity-0 animate-fade-in-up" 
                    style={{ animationDelay: `${500 + i * 50}ms` }}
                >
                    {char}
                </span>
            ))}
        </p>
    )
}

export const GlobalLoader: React.FC = () => {
    return (
        <div className="fixed inset-0 bg-void-bg flex flex-col items-center justify-center z-[100]">
            <AnimatedLoaderIcon size={64} strokeWidth={1.5} />
            <LoadingText />
        </div>
    );
};