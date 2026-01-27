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
        <div className="fixed inset-0 bg-void-bg flex flex-col items-center justify-center z-[100]">
            <AnimatedLoaderIcon size={64} strokeWidth={1.5} />
            <LoadingText text={statusText} />

            {/* Debug Info */}
            <div className="mt-8 text-xs text-zinc-600 font-mono max-w-lg break-all p-4 border border-zinc-800 rounded">
                DEBUG URL: {window.location.href}
            </div>

            <div className="absolute bottom-10 text-center text-xs text-zinc-600 max-w-md">
                This is a simulation. In a real application, your browser would securely communicate with the Void backend.
            </div>
        </div>
    );
};
