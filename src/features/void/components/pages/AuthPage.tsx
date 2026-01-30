import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../../contexts/AuthContext';
import { GitHubIcon, GoogleIcon } from '../common/Icons';
import { ArrowLeft, Cpu, Terminal, ShieldCheck, Zap, Box, Mail, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../../../components/ui/Button';
import loginBg from '../../../../assets/login-bg.jpg';

export const AuthPage: React.FC = () => {
    const { loginWithGitHub, loginWithGoogle, isAuthenticated } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [authMethod, setAuthMethod] = useState<'none' | 'github' | 'google' | 'email' | 'connect'>('none');
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showEmailFields, setShowEmailFields] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const isSignUp = location.pathname.includes('signup') || location.search.includes('mode=signup');
    const isConnectMode = location.search.includes('mode=connect');
    const challenge = new URLSearchParams(location.search).get('challenge');

    useEffect(() => {
        if (isAuthenticated && !isConnectMode) {
            navigate('/office');
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
            console.error("GitHub Auth Error:", err);
            const errorCode = err.code ? `[${err.code}] ` : "";
            if (err.code === 'auth/account-exists-with-different-credential') {
                setError("Account exists with different credentials. Please sign in with Google or Email first to link your account.");
            } else {
                setError(`${errorCode}${err.message || "GitHub protocol transmission failed."}`);
            }
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
            console.error("Google Auth Error:", err);
            const errorCode = err.code ? `[${err.code}] ` : "";
            setError(`${errorCode}${err.message || "Google protocol transmission failed."}`);
            setAuthMethod('none');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailProtocol = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        // Simulated email flow
        setTimeout(() => {
            setIsLoading(false);
            setError("Email protocol requires manual node verification. Check your neural uplink.");
        }, 1500);
    };

    return (
        <div className="fixed inset-0 flex flex-col md:flex-row bg-black text-white font-sans overflow-hidden selection:bg-white selection:text-black">
            {/* Left Side: Cinematic Immersive Panel */}
            <div className="hidden md:flex md:w-1/2 lg:w-[55%] relative h-full overflow-hidden border-r border-zinc-900 shadow-[40px_0_80px_rgba(0,0,0,0.8)] z-20">
                <motion.div
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.6 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${loginBg})` }}
                />

                {/* Dynamic Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-95" />
                <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />

                <div className="absolute bottom-10 left-10 max-w-xl z-20 space-y-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-4 px-5 py-2 rounded-none bg-white/5 backdrop-blur-xl border border-white/10 text-[10px] font-bold text-zinc-400 uppercase tracking-[0.5em]"
                    >
                        <Cpu size={14} className="text-blue-500" />
                        <span>Sovereign ID Protocol // ACTIVE</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl lg:text-6xl font-bold text-white tracking-tighter leading-[0.9] lowercase"
                    >
                        connect<br /><span className="text-white block mt-2">the nexus.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-zinc-500 text-lg font-medium tracking-tight leading-relaxed max-w-sm uppercase tracking-[0.2em] opacity-80"
                    >
                        Access high-fidelity autonomy and distributed state orchestration.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.4 }}
                        transition={{ delay: 0.4 }}
                        className="flex items-center gap-10 pt-10"
                    >
                        <Box size={24} />
                        <Zap size={24} />
                        <ShieldCheck size={24} />
                        <div className="h-px w-20 bg-zinc-800" />
                        <span className="text-[10px] font-bold tracking-widest text-zinc-600 uppercase">Registry v11.12</span>
                    </motion.div>
                </div>
            </div>

            {/* Right Side: Shared UI Auth Section */}
            <div className="w-full md:w-1/2 lg:w-[45%] h-full flex flex-col items-center justify-center p-8 md:p-24 bg-black relative overflow-y-auto z-10">
                {/* Background Grid - Matching Home */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '50px 50px' }}
                />

                <Link
                    to="/"
                    className="absolute top-12 left-12 flex items-center gap-3 text-zinc-700 hover:text-white transition-all group font-bold uppercase tracking-[0.5em] text-[10px]"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Exit Nexus
                </Link>

                <div className="w-full max-w-[380px] relative z-20">
                    <AnimatePresence mode="wait">
                        {authMethod === 'connect' ? (
                            <motion.div
                                key="connect"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-zinc-950 border border-blue-500/20 p-12 rounded-none text-center shadow-3xl shadow-blue-500/5 ring-1 ring-white/5"
                            >
                                <div className="w-20 h-20 bg-blue-500/10 rounded-none flex items-center justify-center mx-auto mb-10 border border-blue-500/20">
                                    <Terminal className="text-blue-500 animate-pulse" size={32} />
                                </div>
                                <h2 className="text-4xl font-bold tracking-tighter uppercase mb-4">Neural Uplink</h2>
                                <p className="text-zinc-600 text-[10px] tracking-[0.4em] uppercase mb-10">
                                    Challenge: <span className="text-white font-mono lowercase tracking-normal">{challenge}</span>
                                </p>
                                <div className="p-8 bg-black/50 rounded-none border border-zinc-900 text-left mb-10">
                                    <p className="text-[9px] font-bold text-zinc-700 tracking-[0.4em] uppercase mb-2 ml-1">Detected ID</p>
                                    <p className="text-sm font-bold text-white font-mono lowercase">authenticating_node_alpha</p>
                                </div>
                                <Button
                                    variant="primary"
                                    size="xl"
                                    className="w-full"
                                    onClick={() => navigate('/office')}
                                >
                                    Confirm Session
                                </Button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="auth"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-16"
                            >
                                <div className="space-y-6">
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.6em] mb-4"
                                    >
                                        Protocol Gateway
                                    </motion.div>
                                    <h1 className="text-6xl font-bold tracking-tighter uppercase leading-tight">
                                        {isSignUp ? 'Initialize' : 'Authenticate'}.
                                    </h1>
                                    <p className="text-zinc-600 text-[11px] font-bold uppercase tracking-[0.4em] leading-relaxed max-w-[280px]">
                                        {isSignUp ? 'Establish your neural node in the official registry.' : 'Resume your session within the Nexus ecosystem.'}
                                    </p>
                                </div>

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-4 rounded-none bg-red-500/5 border border-red-500/10 text-red-500 text-[10px] font-bold uppercase tracking-[0.2em] text-center"
                                    >
                                        {error}
                                    </motion.div>
                                )}

                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 gap-4">
                                        <Button
                                            variant="outline"
                                            size="xl"
                                            className="w-full border-zinc-900/50 hover:bg-zinc-900/20 group"
                                            icon={<GitHubIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />}
                                            isLoading={isLoading && authMethod === 'github'}
                                            onClick={handleGitHubLogin}
                                        >
                                            Continue with GitHub
                                        </Button>

                                        <Button
                                            variant="outline"
                                            size="xl"
                                            className="w-full border-zinc-900/50 hover:bg-zinc-900/20 group"
                                            icon={<GoogleIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />}
                                            isLoading={isLoading && authMethod === 'google'}
                                            onClick={handleGoogleLogin}
                                        >
                                            Continue with Google
                                        </Button>

                                        <Button
                                            variant="outline"
                                            size="xl"
                                            className={`w-full border-zinc-900/50 hover:bg-zinc-900/20 group ${showEmailFields ? 'bg-zinc-900/40 border-zinc-700' : ''}`}
                                            icon={<Mail className={`w-5 h-5 group-hover:scale-110 transition-transform ${showEmailFields ? 'text-blue-500' : ''}`} />}
                                            onClick={() => setShowEmailFields(!showEmailFields)}
                                        >
                                            Continue with Email
                                        </Button>
                                    </div>

                                    <AnimatePresence>
                                        {showEmailFields && (
                                            <motion.form
                                                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                                animate={{ height: "auto", opacity: 1, marginTop: 24 }}
                                                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                                                className="overflow-hidden space-y-4 px-1"
                                                onSubmit={handleEmailProtocol}
                                            >
                                                <div className="space-y-3">
                                                    <div className="relative">
                                                        <Mail size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-700" />
                                                        <input
                                                            type="email"
                                                            value={email}
                                                            onChange={(e) => setEmail(e.target.value)}
                                                            placeholder="identity@opendev-labs.io"
                                                            className="w-full h-14 bg-zinc-950 border border-zinc-900 rounded-none pl-14 pr-6 text-[12px] font-bold tracking-widest text-white placeholder:text-zinc-800 focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-white/5 transition-all lowercase"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="relative">
                                                        <Lock size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-700" />
                                                        <input
                                                            type="password"
                                                            value={password}
                                                            onChange={(e) => setPassword(e.target.value)}
                                                            placeholder="••••••••"
                                                            className="w-full h-14 bg-zinc-950 border border-zinc-900 rounded-none pl-14 pr-6 text-[12px] font-bold tracking-widest text-white placeholder:text-zinc-800 focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-white/5 transition-all"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="primary"
                                                    size="lg"
                                                    className="w-full shadow-2xl shadow-white/5"
                                                    type="submit"
                                                    isLoading={isLoading}
                                                >
                                                    Deploy Protocol
                                                </Button>
                                            </motion.form>
                                        )}
                                    </AnimatePresence>

                                    <div className="relative py-10 opacity-30">
                                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-900" /></div>
                                        <div className="relative flex justify-center"><span className="bg-black px-4 text-[9px] font-bold text-zinc-700 uppercase tracking-[0.5em]">Nexus ID</span></div>
                                    </div>

                                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.4em]">
                                        <p className="text-zinc-700">
                                            {isSignUp ? 'Registered?' : 'New Node?'}
                                        </p>
                                        <Link
                                            to={isSignUp ? "/auth" : "/auth?mode=signup"}
                                            className="text-white hover:text-blue-500 transition-colors"
                                        >
                                            {isSignUp ? 'Authorize Session' : 'Register Entry'}
                                        </Link>
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
