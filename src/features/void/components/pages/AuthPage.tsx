import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { GitHubIcon, GoogleIcon } from '../common/Icons';
import loginBg from '../../../../assets/login-bg.jpg';

export const AuthPage: React.FC = () => {
    const { loginWithGitHub, loginWithGoogle, isAuthenticated } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [authMethod, setAuthMethod] = useState<'none' | 'github' | 'google' | 'email'>('none');
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const isSignUp = location.pathname.includes('signup') || location.search.includes('mode=signup');

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/ide/dashboard');
        }
    }, [isAuthenticated, navigate]);

    const handleGitHubLogin = async () => {
        setIsLoading(true);
        setAuthMethod('github');
        setError('');
        try {
            await loginWithGitHub();
        } catch (err: any) {
            console.error("Auth Error:", err);
            setError(err.message || "GitHub protocol transmission failed.");
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
            console.error("Auth Error:", err);
            setError(err.message || "Google protocol transmission failed.");
            setAuthMethod('none');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setAuthMethod('email');
        setTimeout(() => {
            setError("Simulation Mode: Email verification dispatched to " + email);
            setIsLoading(false);
            setAuthMethod('none');
        }, 1500);
    };

    return (
        <div className="fixed inset-0 flex flex-col md:flex-row bg-[#050505] overflow-hidden selection:bg-white selection:text-black">
            {/* Left Side: Immersive Background Side */}
            <div className="hidden md:flex md:w-1/2 lg:w-3/5 relative h-full overflow-hidden border-r border-zinc-900/50">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[40s] hover:scale-105 will-change-transform opacity-60"
                    style={{ backgroundImage: `url(${loginBg})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black via-black/40 to-black opacity-80" />
                <div className="absolute inset-0 backdrop-blur-[2px]" />

                {/* Decorative Elements */}
                <div className="absolute inset-0 opacity-[0.1] pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }}
                />

                <div className="absolute bottom-20 left-20 max-w-lg z-20">
                    <div className="flex items-center gap-3 mb-8 bg-white/5 backdrop-blur-2xl px-5 py-2.5 rounded-full border border-white/10 w-fit">
                        <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-pulse" />
                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.3em]">Protocol Identity Verified</span>
                    </div>
                    <h1 className="text-7xl font-bold text-white tracking-tighter mb-6 leading-[0.85] lowercase">
                        opendev-labs<br /><span className="text-zinc-600 font-light italic">intelligent ecosystem</span>
                    </h1>
                    <p className="text-zinc-500 text-lg font-medium tracking-tight leading-relaxed max-w-sm">
                        Experience the next generation of intelligent software orchestration. High-fidelity, edge-powered, and infinitely scalable.
                    </p>
                </div>
            </div>

            {/* Right Side: Standard Premium Auth Card */}
            <div className="w-full md:w-1/2 lg:w-2/5 h-full flex flex-col items-center justify-center p-6 md:p-12 bg-black relative">
                <div className="w-full max-w-[400px] relative z-20">
                    {/* Auth Card */}
                    <div className="bg-[#0A0A0A] border border-zinc-900 rounded-[32px] p-8 md:p-10 shadow-[0_24px_80px_rgba(0,0,0,0.5)]">
                        <div className="mb-10 text-center">
                            <h2 className="text-3xl font-bold text-white tracking-tight mb-3">
                                {isSignUp ? 'Create Account' : 'Welcome Back'}
                            </h2>
                            <p className="text-zinc-500 text-sm font-medium">Continue to the opendev-labs protocol.</p>
                        </div>

                        {error && (
                            <div className={`p-4 rounded-2xl mb-8 border animate-in fade-in slide-in-from-top-2 ${error.includes('Simulation') ? 'bg-zinc-900/50 border-zinc-800' : 'bg-red-500/10 border-red-500/20'}`}>
                                <p className={`text-xs leading-relaxed font-medium ${error.includes('Simulation') ? 'text-zinc-400' : 'text-red-400'}`}>{error}</p>
                            </div>
                        )}

                        <div className="space-y-3">
                            <button
                                onClick={handleGitHubLogin}
                                disabled={isLoading}
                                className="group relative w-full h-12 flex items-center justify-center gap-3 bg-white text-black rounded-xl text-[13px] font-bold transition-all hover:bg-zinc-200 active:scale-[0.98] disabled:opacity-50"
                            >
                                {isLoading && authMethod === 'github' ? (
                                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <GitHubIcon className="w-5 h-5" />
                                )}
                                <span>Continue with GitHub</span>
                            </button>

                            <button
                                onClick={handleGoogleLogin}
                                disabled={isLoading}
                                className="group relative w-full h-12 flex items-center justify-center gap-3 bg-[#111] border border-zinc-800 text-white rounded-xl text-[13px] font-bold transition-all hover:bg-zinc-900 active:scale-[0.98] disabled:opacity-50"
                            >
                                {isLoading && authMethod === 'google' ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <GoogleIcon className="w-5 h-5" />
                                )}
                                <span>Continue with Google</span>
                            </button>
                        </div>

                        <div className="relative my-10">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-zinc-900"></div>
                            </div>
                            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-[0.2em]">
                                <span className="bg-[#0A0A0A] px-4 text-zinc-600">or use security code</span>
                            </div>
                        </div>

                        <form className="space-y-4" onSubmit={handleEmailLogin}>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black tracking-widest text-zinc-500 ml-1">Work Email</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@company.com"
                                    className="w-full h-12 bg-black border border-zinc-900 rounded-xl px-4 text-sm text-white placeholder:text-zinc-800 focus:outline-none focus:border-zinc-700 transition-all font-medium"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading || !email}
                                className="w-full h-12 bg-zinc-900 text-zinc-300 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-zinc-800 hover:text-white transition-all disabled:opacity-30 flex items-center justify-center"
                            >
                                {isLoading && authMethod === 'email' ? (
                                    <div className="w-4 h-4 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    'Continue with Email'
                                )}
                            </button>
                        </form>
                    </div>

                    <div className="mt-10 flex flex-col items-center gap-6">
                        <p className="text-[11px] text-zinc-500 font-medium">
                            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                            <Link
                                to={isSignUp ? "/auth" : "/auth?mode=signup"}
                                className="text-white ml-2 font-bold hover:underline underline-offset-4"
                            >
                                {isSignUp ? 'Log in' : 'Sign up'}
                            </Link>
                        </p>

                        <div className="flex gap-4">
                            <Link to="/terms" className="text-[10px] text-zinc-700 font-bold uppercase tracking-widest hover:text-zinc-400 transition-colors">Terms</Link>
                            <Link to="/privacy" className="text-[10px] text-zinc-700 font-bold uppercase tracking-widest hover:text-zinc-400 transition-colors">Privacy</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
