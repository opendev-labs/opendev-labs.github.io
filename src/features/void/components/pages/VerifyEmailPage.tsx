
import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../hooks/useAuth';
import type { User } from '../../types';

const FAKE_CODE = '123456';

export const VerifyEmailPage: React.FC = () => {
    const { login } = useAuth();
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [userToVerify, setUserToVerify] = useState<User | null>(null);

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('void_verification_user');
            if (storedUser) {
                setUserToVerify(JSON.parse(storedUser));
            }
        } catch (e) {
            console.error("Failed to parse user for verification", e);
        }
    }, []);

    const handleVerify = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (code === FAKE_CODE) {
            if (userToVerify) {
                login(userToVerify);
                localStorage.removeItem('void_verification_user');
            } else {
                 setError('Could not find user to verify. Please try logging in again.');
            }
        } else {
            setError('Invalid verification code. Please try again.');
        }
    };
    
    const emailDisplay = useMemo(() => {
        if (!userToVerify?.email) return 'your email';
        const [local, domain] = userToVerify.email.split('@');
        return `${local.slice(0, 2)}...${local.slice(-1)}@${domain}`;
    }, [userToVerify]);

    return (
        <div className="py-12 sm:py-20 flex items-center justify-center">
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold tracking-tighter text-white">Check your email</h1>
                    <p className="mt-2 text-zinc-400">We sent a verification code to {emailDisplay}.</p>
                </div>

                <div className="bg-void-card border border-void-line rounded-lg p-6 text-center mb-6">
                    <p className="text-zinc-400 text-sm">Your verification code is:</p>
                    <p className="text-3xl font-mono tracking-widest text-white font-bold my-2 neon-text">{FAKE_CODE}</p>
                    <p className="text-xs text-zinc-500">(This is a simulation. No email was actually sent.)</p>
                </div>
                
                <form className="space-y-4" onSubmit={handleVerify}>
                    <div>
                        <label htmlFor="code" className="sr-only">Verification Code</label>
                        <input
                            type="text"
                            id="code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full bg-void-card border border-void-line py-2 px-3 text-sm text-center text-zinc-200 focus:outline-none focus:ring-1 focus:ring-void-neon"
                            placeholder="Enter code"
                            required
                        />
                    </div>

                    {error && <p className="text-sm text-red-400 text-center">{error}</p>}

                    <button type="submit" className="w-full bg-white text-black font-semibold py-2.5 px-4 hover:bg-zinc-200 transition-colors">
                        Verify
                    </button>
                </form>
            </div>
        </div>
    );
};
