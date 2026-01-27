import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
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
        <div className="min-h-screen flex items-center justify-center px-4 bg-black py-20 selection:bg-white selection:text-black">
            <div className="w-full max-w-sm">
                <div className="text-center mb-12">
                    <Link to="/" className="inline-flex items-center gap-2 mb-8 group">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            <div className="w-5 h-5 border-[2.5px] border-black rounded-sm" />
                        </div>
                        <span className="text-white font-bold tracking-tighter text-2xl">opendev-labs</span>
                    </Link>
                    <h1 className="text-4xl font-bold tracking-tighter text-white mb-3">Identity Audit</h1>
                    <p className="text-zinc-500 text-sm font-medium">Verify your transmission to <span className="text-white font-mono">{emailDisplay}</span>.</p>
                </div>

                <div className="bg-zinc-950/50 border border-zinc-900 rounded-[32px] p-10 text-center mb-10 shadow-2xl backdrop-blur-sm">
                    <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.3em] mb-6">Sequence Payload</p>
                    <p className="text-5xl font-mono tracking-[0.2em] text-white font-bold my-6 select-all">{FAKE_CODE}</p>
                    <div className="pt-6 border-t border-zinc-900">
                        <p className="text-[10px] text-zinc-700 font-bold uppercase tracking-widest italic leading-relaxed">Simulation Protocol: Hardware dispatch bypassed.</p>
                    </div>
                </div>

                <form className="space-y-6" onSubmit={handleVerify}>
                    <div>
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full h-12 bg-black border border-zinc-900 px-5 text-center text-white font-mono text-lg rounded-xl placeholder:text-zinc-800 focus:outline-none focus:border-zinc-500 transition-colors"
                            placeholder="000000"
                            required
                        />
                    </div>

                    {error && <p className="text-[10px] text-red-500 text-center font-bold uppercase tracking-widest">{error}</p>}

                    <button type="submit" className="w-full h-12 bg-white text-black text-[11px] font-bold uppercase tracking-widest rounded-full hover:bg-zinc-200 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-white/5">
                        Verify Identity
                    </button>

                    <button type="button" className="w-full text-zinc-500 text-[10px] font-bold hover:text-white transition-colors uppercase tracking-[0.3em]">
                        Re-dispatch Sequence
                    </button>
                </form>

                <div className="mt-12 text-center">
                    <Link to="/login" className="text-xs text-zinc-600 hover:text-white font-bold uppercase tracking-widest transition-colors">
                        Abort Mission & Return
                    </Link>
                </div>
            </div>
        </div>
    );
};

