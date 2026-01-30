import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { AnimatedLoaderIcon } from '../common/AnimatedLoaderIcon';

const LoadingText: React.FC<{ text: string }> = ({ text }) => {
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

export const GitHubCallbackHandler: React.FC = () => {
    const { login } = useAuth();
    const [statusText, setStatusText] = useState("Authenticating with GitHub...");

    useEffect(() => {
        // Log the full URL for debugging purposes
        console.log("Current URL:", window.location.href);

        const params = new URLSearchParams(window.location.search);
        let code = params.get('code');

        // Fallback: Check if code is in the hash or part of the full URL string manually
        if (!code) {
            const match = window.location.href.match(/[?&]code=([^&#]+)/);
            if (match) {
                code = match[1];
            }
        }

        if (code) {
            // ... [Rest of the success logic]
            setStatusText("Authenticating with GitHub...");

            // Simulation of backend exchange
            setTimeout(() => {
                setStatusText("Fetching user details...");
                setTimeout(() => {
                    const mockUser = {
                        uid: 'mock_github_user',
                        name: 'GitHub User',
                        email: 'user.from.github@void.app'
                    };
                    login(mockUser);

                    // Clean up URL
                    const newUrl = window.location.pathname + window.location.hash;
                    window.history.replaceState({}, document.title, newUrl);

                }, 1500);
            }, 1000);

        } else {
            // Handle error case where no code is present
            setStatusText("Authentication failed. No code found.");
            setTimeout(() => {
                // For debugging, we pause here a bit longer or redirect
                window.location.href = window.location.pathname + '#/login';
            }, 3000);
        }

    }, [login]);

    return (
        <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[100] selection:bg-white selection:text-black">
            <AnimatedLoaderIcon size={64} strokeWidth={1.5} className="text-white" />
            <LoadingText text={statusText} />

            {/* Debug Info */}
            <div className="mt-8 text-[10px] font-bold text-zinc-700 font-mono max-w-lg break-all p-6 border border-zinc-900 bg-black/50 uppercase tracking-wider leading-relaxed">
                DEBUG PROTOCOL: {window.location.href}
            </div>

            <div className="absolute bottom-12 text-center text-[9px] font-bold text-zinc-600 max-w-md uppercase tracking-[0.2em] leading-loose">
                This is a neural simulation. In a live environment, your node would securely synchronize with the opendev-labs nexus registry.
            </div>
        </div>

    );
};
