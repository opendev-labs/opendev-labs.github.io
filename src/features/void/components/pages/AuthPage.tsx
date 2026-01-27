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
            setError("Protocol restricted: Email verification dispatched to " + email);
            setIsLoading(false);
            setAuthMethod('none');
        }, 1500);
    };

    return (
        <div className="fixed inset-0 flex flex-col md:flex-row bg-black overflow-hidden selection:bg-white selection:text-black">
            {/* Left Side: Cinematic Immersive Panel (High-Res) */}
            <div className="hidden md:flex md:w-1/2 lg:w-3/5 relative h-full overflow-hidden border-r border-[#333]">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[40s] hover:scale-105 will-change-transform opacity-80"
                    style={{ backgroundImage: `url(${loginBg})` }}
                />

                {/* Dark Vignette - Matching Homepage Hero */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'radial-gradient(circle at center, transparent 20%, rgba(0,0,0,0.8) 60%, #000 90%)'
                    }}
                />

                <div className="absolute bottom-16 left-16 max-w-lg z-20">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 border border-white/10 text-[10px] font-bold text-zinc-400 mb-8 uppercase tracking-widest backdrop-blur-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-pulse" />
                        <span>Sovereign Protocol Identity</span>
                    </div>
                    <h1 className="text-7xl font-bold text-white tracking-tighter mb-6 leading-[0.9] lowercase">
                        opendev-labs<br /><span className="text-zinc-500 group-hover:text-white transition-colors">intelligent ecosystem.</span>
                    </h1>
                    <p className="text-zinc-400 text-lg font-medium tracking-tight leading-relaxed max-w-sm">
                        Bootstrap, scale, and secure your intelligence nodes with the industry standard for programmable reality.
                    </p>
                </div>
            </div>

            {/* Right Side: Home-Aligned Auth Section (Minimal/Standard) */}
            <div className="w-full md:w-1/2 lg:w-2/5 h-full flex flex-col items-center justify-center p-6 md:p-12 bg-black relative overflow-y-auto">
                {/* Background Grid Pattern - Subtly matching homepage sections */}
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
                    style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }}
                />

                <div className="w-full max-w-[420px] relative z-20">
                    <div className="mb-12">
                        <h2 className="text-4xl font-bold text-white tracking-tighter mb-4">
                            {isSignUp ? 'Establish Identity' : 'Welcome Back.'}
                        </h2>
                        <p className="text-zinc-500 text-sm font-medium leading-relaxed">
                            {isSignUp
                                ? 'Join the network of sovereign nodes developing at the speed of thought.'
                                : 'Re-authenticate your node to continue orchestrating high-fidelity intelligence.'
                            }
                        </p>
                    </div>

                    {error && (
                        <div className={`p-4 rounded-2xl mb-8 border animate-in fade-in slide-in-from-top-2 backdrop-blur-sm ${error.includes('restricted') ? 'bg-zinc-900/50 border-zinc-800 text-zinc-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                            <p className="text-xs font-medium italic">{error}</p>
                        </div>
                    )}

                    <div className="space-y-4">
                        <button
                            onClick={handleGitHubLogin}
                            disabled={isLoading}
                            className="w-full h-12 flex items-center justify-center gap-3 bg-white text-black rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 shadow-lg"
                        >
                            {isLoading && authMethod === 'github' ? (
                                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <GitHubIcon className="w-5 h-5" />
                            )}
                            Continue with GitHub
                        </button>

                        <button
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                            className="w-full h-12 flex items-center justify-center gap-3 bg-black border border-zinc-800 text-white rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-zinc-950 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 shadow-lg"
                        >
                            {isLoading && authMethod === 'google' ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <GoogleIcon className="w-5 h-5" />
                            )}
                            Continue with Google
                        </button>
                    </div>

                    <div className="relative my-10 flex items-center">
                        <div className="flex-grow border-t border-zinc-900"></div>
                        <span className="px-4 text-[9px] uppercase font-bold tracking-[0.4em] text-zinc-700">Protocol Link</span>
                        <div className="flex-grow border-t border-zinc-900"></div>
                    </div>

                    <form className="space-y-6" onSubmit={handleEmailLogin}>
                        <div className="space-y-3">
                            <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-600 ml-1">Identity Identifier</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="IDENTITY@PROXIMA.OPK"
                                className="w-full h-12 bg-black border border-zinc-900 rounded-xl px-4 text-sm text-white placeholder:text-zinc-800 focus:outline-none focus:border-zinc-700 transition-all font-mono tracking-tight"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading || !email}
                            className="w-full h-12 bg-zinc-950/50 border border-zinc-900 text-zinc-500 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black hover:border-white transition-all duration-300 flex items-center justify-center"
                        >
                            {isLoading && authMethod === 'email' ? (
                                <div className="w-4 h-4 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
                            ) : (
                                'Dispatch Authorized Link'
                            )}
                        </button>
                    </form>

                    <div className="mt-16 flex flex-col items-center gap-8 border-t border-zinc-900 pt-10">
                        <p className="text-xs text-zinc-500 font-medium tracking-tight">
                            {isSignUp ? 'Identity already established?' : "Identity not registered?"}
                            <Link
                                to={isSignUp ? "/auth" : "/auth?mode=signup"}
                                className="text-white ml-2 font-bold hover:underline underline-offset-8 transition-all"
                            >
                                {isSignUp ? 'Authorize Node' : 'Initialize Node'}
                            </Link>
                        </p>

                        <div className="flex gap-8">
                            <Link to="/terms" className="text-[9px] text-zinc-700 font-black uppercase tracking-[0.3em] hover:text-zinc-400 transition-colors">Digital Pact</Link>
                            <Link to="/privacy" className="text-[9px] text-zinc-700 font-black uppercase tracking-[0.3em] hover:text-zinc-400 transition-colors">Privacy Protocol</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
