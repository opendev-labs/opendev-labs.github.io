
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
            const storedUser = localStorage.getItem('opendev_verification_user');
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
                localStorage.removeItem('opendev_verification_user');
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
        <div className="min-h-[70vh] flex items-center justify-center px-4 bg-black py-20">
            <div className="w-full max-w-sm">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold tracking-tighter text-white mb-2">Check your email</h1>
                    <p className="text-zinc-500 text-sm font-medium">We sent a verification code to <span className="text-white font-mono">{emailDisplay}</span>.</p>
                </div>

                <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-8 text-center mb-10 shadow-2xl">
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-4">Your Code</p>
                    <p className="text-4xl font-mono tracking-[0.2em] text-white font-bold my-4 select-all">{FAKE_CODE}</p>
                    <div className="pt-4 border-t border-zinc-900">
                        <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-tighter italic">Simulation Mode: No email was dispatched.</p>
                    </div>
                </div>

                <form className="space-y-6" onSubmit={handleVerify}>
                    <div>
                        <label htmlFor="code" className="sr-only">Verification Code</label>
                        <input
                            type="text"
                            id="code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-900 py-3 px-4 text-[13px] text-center text-white font-mono rounded-md placeholder:text-zinc-700 focus:outline-none focus:ring-1 focus:ring-white transition-all"
                            placeholder="Enter 6-digit code"
                            required
                        />
                    </div>

                    {error && <p className="text-xs text-red-500 text-center font-bold uppercase tracking-tight">{error}</p>}

                    <button type="submit" className="w-full h-11 bg-white text-black text-[11px] font-bold uppercase tracking-widest rounded-full hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-white/5">
                        Verify Identity
                    </button>

                    <button type="button" className="w-full text-zinc-500 text-xs font-bold hover:text-white transition-colors uppercase tracking-widest">
                        Resend Code
                    </button>
                </form>
            </div>
        </div>
    );
};

