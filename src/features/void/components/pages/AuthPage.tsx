import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { GitHubIcon, GoogleIcon } from '../common/Icons';
import { ArrowLeft, Cpu, Terminal, ShieldCheck, Zap, Box } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
        <div className="fixed inset-0 bg-black text-white font-sans overflow-hidden selection:bg-white selection:text-black">
            {/* 2026 Dynamic Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-blue-600/10 blur-[150px] rounded-full animate-pulse" />
                <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-purple-600/5 blur-[120px] rounded-full" />
                <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
            </div>

            <div className="relative z-10 h-full flex items-center justify-center p-6">
                <Link
                    to="/"
                    className="absolute top-10 left-10 flex items-center gap-3 text-zinc-500 hover:text-white transition-all group font-bold uppercase tracking-[0.4em] text-[10px]"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Reality
                </Link>

                <div className="w-full max-w-lg">
                    <AnimatePresence mode="wait">
                        {authMethod === 'connect' ? (
                            <motion.div
                                key="connect"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-zinc-950/50 backdrop-blur-3xl border border-blue-500/30 p-12 rounded-[40px] text-center shadow-3xl shadow-blue-500/10"
                            >
                                <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-10">
                                    <Terminal className="text-blue-500 animate-pulse" size={32} />
                                </div>
                                <h2 className="text-4xl font-bold tracking-tighter uppercase mb-4">Neural Uplink Active</h2>
                                <p className="text-zinc-400 text-sm tracking-widest uppercase mb-10 leading-relaxed">
                                    Linking terminal challenge: <span className="text-white font-mono">{challenge}</span>
                                </p>
                                <div className="p-10 bg-zinc-900/50 rounded-2xl border border-zinc-800 text-left mb-10">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-2 h-2 rounded-full bg-green-500" />
                                        <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">Identity Verified</span>
                                    </div>
                                    <p className="text-xs font-bold text-zinc-300 tracking-wider">FOUNDER DETECTED: @iamyash.io</p>
                                </div>
                                <button
                                    onClick={() => navigate('/void/dashboard')}
                                    className="w-full h-16 bg-white text-black text-[12px] font-bold uppercase tracking-[0.4em] rounded-full hover:bg-blue-500 hover:text-white transition-all"
                                >
                                    Access Nexus
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="auth"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-12"
                            >
                                <div className="text-center space-y-4">
                                    <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-bold text-blue-400 uppercase tracking-[0.3em] mb-4">
                                        <ShieldCheck size={14} />
                                        <span>Sovereign Identity Protocol</span>
                                    </div>
                                    <h1 className="text-6xl md:text-7xl font-bold tracking-tighter uppercase leading-[0.85]">
                                        OPENDEV<br /><span className="text-zinc-600">LABS.</span>
                                    </h1>
                                    <p className="text-zinc-500 text-sm font-medium tracking-widest uppercase">
                                        The unified identity for the 2026 AI Era
                                    </p>
                                </div>

                                <div className="bg-zinc-950/40 backdrop-blur-2xl border border-zinc-900 p-10 rounded-[40px] shadow-2xl">
                                    {error && (
                                        <div className="p-4 rounded-xl mb-8 bg-red-500/10 border border-red-500/20 text-red-500 text-center text-[10px] font-bold uppercase tracking-widest">
                                            {error}
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 gap-4">
                                        <button
                                            onClick={handleGitHubLogin}
                                            disabled={isLoading}
                                            className="group relative w-full h-16 flex items-center justify-center gap-4 bg-white text-black rounded-2xl text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-blue-500 hover:text-white transition-all active:scale-[0.98] overflow-hidden"
                                        >
                                            <div className="absolute inset-0 bg-blue-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300 -z-0" />
                                            <GitHubIcon className="w-5 h-5 relative z-10" />
                                            <span className="relative z-10">Continue with GitHub</span>
                                        </button>

                                        <button
                                            onClick={handleGoogleLogin}
                                            disabled={isLoading}
                                            className="w-full h-16 flex items-center justify-center gap-4 bg-black border border-zinc-800 text-white rounded-2xl text-[11px] font-bold uppercase tracking-[0.3em] hover:border-zinc-500 transition-all active:scale-[0.98]"
                                        >
                                            <GoogleIcon className="w-5 h-5" />
                                            <span>Continue with Google</span>
                                        </button>
                                    </div>

                                    <div className="relative py-10">
                                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-900" /></div>
                                        <div className="relative flex justify-center"><span className="bg-black/80 px-4 text-[10px] font-bold text-zinc-700 uppercase tracking-widest">Or Secure Entry</span></div>
                                    </div>

                                    <form className="space-y-4">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="IDENTITY@OPENDEV-LABS.IO"
                                            className="w-full h-16 bg-zinc-900/50 border border-zinc-800 rounded-2xl px-8 text-xs font-bold tracking-widest text-white placeholder:text-zinc-700 focus:outline-none focus:border-blue-500/50 transition-all"
                                        />
                                        <button
                                            disabled={isLoading}
                                            className="w-full h-16 bg-black border border-zinc-800 text-zinc-500 rounded-2xl text-[11px] font-bold uppercase tracking-[0.3em] hover:text-white hover:border-zinc-600 transition-all opacity-50 cursor-not-allowed"
                                        >
                                            Continue with Email
                                        </button>
                                    </form>

                                    <div className="mt-12 text-center text-[10px] font-bold text-zinc-700 uppercase tracking-[0.4em] flex items-center justify-center gap-4">
                                        <Zap size={14} />
                                        <span>Nexus Registry v11.11</span>
                                    </div>
                                </div>

                                <div className="text-center space-y-6">
                                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.3em]">
                                        Created by <a href="https://instagram.com/iamyash.io" className="text-white hover:text-blue-500 transition-colors">@iamyash.io</a>
                                    </p>
                                    <div className="flex items-center justify-center gap-8 text-zinc-800">
                                        <Box size={18} />
                                        <div className="w-px h-6 bg-zinc-900" />
                                        <Zap size={18} />
                                        <div className="w-px h-6 bg-zinc-900" />
                                        <Cpu size={18} />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};
