import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GitHubIcon } from '../common/Icons';
import { useAuth } from '../../hooks/useAuth';
import { ErrorMessage } from '../common/ErrorMessage';

export const SignUpPage: React.FC = () => {
    const { loginWithGitHub } = useAuth();
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignUp = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const formData = new FormData(e.target as HTMLFormElement);
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        if (!name || !email || !password) {
            setError('All deployment coordinates are required.');
            return;
        }

        if (password.length < 8) {
            setError('Security key must be at least 8 segments.');
            return;
        }

        localStorage.setItem('opendev_verification_user', JSON.stringify({ name, email }));
        navigate('/verify-email');
    }

    const handleGitHubSignUp = async () => {
        try {
            await loginWithGitHub();
            navigate('/ide/dashboard');
        } catch (err: any) {
            setError(err.message || "GitHub protocol failed.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-black selection:bg-white selection:text-black">
            <div className="w-full max-w-md">
                <div className="text-center mb-12">
                    <Link to="/" className="inline-flex items-center gap-2 mb-8 group">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            <div className="w-5 h-5 border-[2.5px] border-black rounded-sm" />
                        </div>
                        <span className="text-white font-bold tracking-tighter text-2xl">opendev-labs</span>
                    </Link>
                    <h1 className="text-4xl font-bold tracking-tighter text-white mb-3">Join the Protocol</h1>
                    <p className="text-zinc-500 text-sm font-medium">Provision your developer identity in the global edge network.</p>
                </div>

                <div className="space-y-5 bg-zinc-950/30 border border-zinc-900 p-10 rounded-[32px] shadow-2xl backdrop-blur-sm">
                    {error && <ErrorMessage message={error} />}

                    <button
                        onClick={handleGitHubSignUp}
                        className="w-full h-12 flex items-center justify-center gap-3 bg-white text-black rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-white/5"
                    >
                        <GitHubIcon className="w-5 h-5" />
                        <span>Initialize with GitHub</span>
                    </button>

                    <div className="relative my-10">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-zinc-900"></div>
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-[0.3em]">
                            <span className="bg-[#050505] px-4 text-zinc-700">or manual entry</span>
                        </div>
                    </div>

                    <form className="space-y-4" onSubmit={handleSignUp}>
                        <input
                            type="text"
                            name="name"
                            className="w-full h-12 bg-black border border-zinc-900 px-5 text-sm text-white rounded-xl placeholder:text-zinc-700 focus:outline-none focus:border-zinc-500 transition-colors"
                            placeholder="Full Legal Name"
                        />
                        <input
                            type="email"
                            name="email"
                            className="w-full h-12 bg-black border border-zinc-900 px-5 text-sm text-white rounded-xl placeholder:text-zinc-700 focus:outline-none focus:border-zinc-500 transition-colors"
                            placeholder="Provisioning Email"
                        />
                        <input
                            type="password"
                            name="password"
                            className="w-full h-12 bg-black border border-zinc-900 px-5 text-sm text-white rounded-xl placeholder:text-zinc-700 focus:outline-none focus:border-zinc-500 transition-colors"
                            placeholder="New Access Key (8+ segments)"
                        />
                        <button type="submit" className="w-full h-12 bg-zinc-950 border border-zinc-900 text-white text-[11px] font-bold uppercase tracking-widest rounded-full hover:bg-zinc-900 transition-all hover:scale-[1.02] active:scale-95 shadow-lg mt-4">
                            Establish Identity
                        </button>
                    </form>

                    <p className="mt-8 text-center text-[10px] text-zinc-600 font-bold uppercase tracking-widest leading-relaxed">
                        By establishing identity, you agree to our<br />
                        <Link to="/terms" className="text-zinc-400 hover:underline">Terms of Protocol</Link> and <Link to="/privacy" className="text-zinc-400 hover:underline">Privacy</Link>.
                    </p>
                </div>

                <div className="mt-10 text-center">
                    <p className="text-sm text-zinc-500">
                        Already established?{' '}
                        <Link to="/login" className="text-white font-bold hover:underline ml-1">
                            Authorize Session
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

