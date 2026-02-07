import React, { useState, useEffect, useMemo } from 'react';
import { useAuth, User as LocalUser } from '../../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { Card } from '../../../../components/ui/Card';

const FAKE_CODE = '123456';

export const VerifyEmailPage: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [userToVerify, setUserToVerify] = useState<LocalUser | null>(null);

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
                navigate('/open-hub');
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
        <div className="min-h-screen flex items-center justify-center px-4 bg-black py-20 selection:bg-white selection:text-black relative overflow-hidden">
            {/* Grid Backdrop */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }}
            />

            {/* Back to Home Button */}
            <Link
                to="/"
                className="absolute top-10 left-10 flex items-center gap-3 text-zinc-600 hover:text-white transition-all group z-30 font-bold uppercase tracking-[0.4em] text-[10px]"
            >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Back to Hub
            </Link>

            <div className="w-full max-w-[380px] relative z-10">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-3 mb-10 px-4 py-1.5 rounded-full bg-zinc-900/50 border border-zinc-800 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.4em]">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                        <span>Identity Audit Protocol</span>
                    </div>
                    <h1 className="text-5xl font-bold tracking-tighter text-white mb-6 lowercase">Verify Transmission.</h1>
                    <p className="text-zinc-500 text-sm font-medium leading-relaxed uppercase tracking-widest opacity-80">
                        Dispatching sequence to <br /><span className="text-white font-mono lowercase tracking-normal">{emailDisplay}</span>
                    </p>
                </div>

                <Card glass className="p-1 mb-12">
                    <div className="bg-black rounded-[30px] p-12 text-center border border-zinc-900/50 shadow-2xl">
                        <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.4em] mb-8 opacity-60">Sequence Payload</p>
                        <p className="text-6xl font-mono tracking-[0.1em] text-white font-bold my-8 select-all drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">{FAKE_CODE}</p>
                        <div className="pt-8 border-t border-zinc-900/50">
                            <p className="text-[9px] text-zinc-700 font-bold uppercase tracking-[0.2em] italic leading-relaxed">Simulation Protocol Override: Dispatch Bypassed.</p>
                        </div>
                    </div>
                </Card>

                <form className="space-y-6" onSubmit={handleVerify}>
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full h-14 bg-zinc-950 border border-zinc-900 px-6 text-center text-white font-mono text-xl font-bold rounded-2xl placeholder:text-zinc-800 focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-white/5 transition-all"
                        placeholder="000000"
                        required
                    />

                    {error && <p className="text-[10px] text-red-500 text-center font-bold uppercase tracking-widest bg-red-500/5 py-2 rounded-lg border border-red-500/10 animate-in shake duration-300">{error}</p>}

                    <div className="space-y-4 pt-4">
                        <Button type="submit" variant="primary" size="xl" className="w-full">
                            Complete Uplink
                        </Button>

                        <button type="button" className="w-full text-zinc-700 text-[9px] font-bold hover:text-white transition-colors uppercase tracking-[0.4em]">
                            Re-dispatch Protocol Sequence
                        </button>
                    </div>
                </form>

                <div className="mt-16 text-center">
                    <Link to="/auth" className="text-[10px] text-zinc-700 hover:text-white font-bold uppercase tracking-[0.3em] transition-all">
                        Abort Protocol & Return
                    </Link>
                </div>
            </div>
        </div>
    );
};
