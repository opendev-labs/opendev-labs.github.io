import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { GitHubIcon, GoogleIcon } from '../common/Icons';
import { ArrowLeft, Cpu, Terminal, ShieldCheck, Zap, Box } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import loginBg from '../../../../assets/login-bg.jpg';

export const AuthPage: React.FC = () => {
    const { loginWithGitHub, loginWithGoogle, isAuthenticated } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [authMethod, setAuthMethod] = useState<'none' | 'github' | 'google' | 'email' | 'connect'>('none');
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const isSignUp = location.pathname.includes('signup') || location.search.includes('mode=signup');
    const isConnectMode = location.search.includes('mode=connect');
    const challenge = new URLSearchParams(location.search).get('challenge');

    useEffect(() => {
        if (isAuthenticated && !isConnectMode) {
            navigate('/void/dashboard');
        }
    }, [isAuthenticated, navigate, isConnectMode]);

    const handleGitHubLogin = async () => {
        setIsLoading(true);
        setAuthMethod('github');
        setError('');
        try {
            await loginWithGitHub();
            if (isConnectMode) setAuthMethod('connect');
        } catch (err: any) {
            setError(err.message || "GitHub authentication failed.");
            setAuthMethod('none');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        setAuthMethod('google');
        setError('');
        try {
            await loginWithGoogle();
        } catch (err: any) {
            setError(err.message || "Google authentication failed.");
            setAuthMethod('none');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex flex-col md:flex-row bg-black text-white font-sans overflow-hidden selection:bg-white selection:text-black">
            {/* Left Side: Cinematic Immersive Panel (Restored) */}
            <div className="hidden md:flex md:w-1/2 lg:w-[55%] relative h-full overflow-hidden border-r border-zinc-900">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[60s] animate-slow-zoom will-change-transform opacity-60"
                    style={{ backgroundImage: `url(${loginBg})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />

                {/* 2026 Overlay Elements */}
                <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />

                <div className="absolute bottom-20 left-20 max-w-xl z-20 space-y-8">
                    <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-[10px] font-bold text-blue-400 uppercase tracking-[0.4em]">
                        <Cpu size={14} />
                        <span>Sovereign Intelligence</span>
                    </div>
                    <h1 className="text-8xl font-bold text-white tracking-tighter leading-[0.8] lowercase">
                        opendev-labs<br /><span className="text-zinc-600 block mt-2">intelligent ecosystem.</span>
                    </h1>
                    <p className="text-zinc-400 text-lg font-medium tracking-tight leading-relaxed max-w-sm uppercase tracking-[0.1em]">
                        The standard for high-fidelity autonomy and neural orchestration.
                    </p>
                    <div className="flex items-center gap-6 pt-4 text-zinc-500">
                        <Box size={24} />
                        <Zap size={24} />
                        <ShieldCheck size={24} />
                    </div>
                </div>
            </div>

            {/* Right Side: Simple Auth Section */}
            <div className="w-full md:w-1/2 lg:w-[45%] h-full flex flex-col items-center justify-center p-8 md:p-20 bg-black relative overflow-y-auto z-10">
                <Link
                    to="/"
                    className="absolute top-10 left-10 md:left-20 flex items-center gap-3 text-zinc-500 hover:text-white transition-all group font-bold uppercase tracking-[0.4em] text-[10px]"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back
                </Link>

                <div className="w-full max-w-[380px]">
                    <AnimatePresence mode="wait">
                        {authMethod === 'connect' ? (
                            <motion.div
                                key="connect"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-zinc-950/50 backdrop-blur-3xl border border-blue-500/30 p-10 rounded-[40px] text-center shadow-3xl shadow-blue-500/10"
                            >
                                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
                                    <Terminal className="text-blue-500 animate-pulse" size={24} />
                                </div>
                                <h2 className="text-3xl font-bold tracking-tighter uppercase mb-2">Neural Uplink</h2>
                                <p className="text-zinc-400 text-[10px] tracking-[0.2em] uppercase mb-8">
                                    Challenge: <span className="text-white font-mono">{challenge}</span>
                                </p>
                                <div className="p-6 bg-zinc-900/50 rounded-2xl border border-zinc-800 text-left mb-8">
                                    <p className="text-[10px] font-bold text-zinc-300 tracking-[0.2em] uppercase">Founder Detected: @iamyash.io</p>
                                </div>
                                <button
                                    onClick={() => navigate('/dashboard')}
                                    className="w-full h-14 bg-white text-black text-[10px] font-bold uppercase tracking-[0.3em] rounded-full hover:bg-blue-500 hover:text-white transition-all"
                                >
                                    Access Nexus
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="auth"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-10"
                            >
                                <div className="space-y-2">
                                    <h1 className="text-4xl font-bold tracking-tighter uppercase">
                                        {isSignUp ? 'Initialize' : 'Authenticate'}
                                    </h1>
                                    <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em]">
                                        {isSignUp ? 'Create your neural node' : 'Welcome back to the Nexus'}
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    {error && (
                                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest text-center">
                                            {error}
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 gap-3">
                                        <button
                                            onClick={handleGitHubLogin}
                                            disabled={isLoading}
                                            className="w-full h-14 flex items-center justify-center gap-4 bg-white text-black rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all active:scale-[0.98]"
                                        >
                                            <GitHubIcon className="w-5 h-5" />
                                            Continue with GitHub
                                        </button>

                                        <button
                                            onClick={handleGoogleLogin}
                                            disabled={isLoading}
                                            className="w-full h-14 flex items-center justify-center gap-4 bg-black border border-zinc-800 text-white rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] hover:border-zinc-500 transition-all active:scale-[0.98]"
                                        >
                                            <GoogleIcon className="w-5 h-5" />
                                            Continue with Google
                                        </button>
                                    </div>

                                    <div className="relative py-6">
                                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-900" /></div>
                                        <div className="relative flex justify-center"><span className="bg-black px-4 text-[9px] font-bold text-zinc-700 uppercase tracking-widest">Or Secure Entry</span></div>
                                    </div>

                                    <div className="space-y-3">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="IDENTITY@OPENDEV-LABS.IO"
                                            className="w-full h-14 bg-zinc-900/30 border border-zinc-800 rounded-xl px-6 text-[10px] font-bold tracking-widest text-white placeholder:text-zinc-700 focus:outline-none focus:border-zinc-500 transition-all"
                                        />
                                        <button
                                            disabled={isLoading}
                                            className="w-full h-14 bg-zinc-900 border border-zinc-800 text-zinc-600 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 cursor-not-allowed"
                                        >
                                            Sign in with Email
                                        </button>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-zinc-900 flex justify-between items-center">
                                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                                        {isSignUp ? 'Member?' : 'New Node?'}
                                        <Link
                                            to={isSignUp ? "/auth" : "/auth?mode=signup"}
                                            className="text-white ml-2 hover:underline underline-offset-4"
                                        >
                                            {isSignUp ? 'Login' : 'Sign Up'}
                                        </Link>
                                    </p>
                                    <span className="text-[9px] font-bold text-zinc-800 uppercase tracking-widest">Registry v11.11</span>
                                </div>

                                <p className="text-[10px] text-zinc-700 font-bold uppercase tracking-[0.2em] text-center pt-4">
                                    Created by @iamyash.io
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};
