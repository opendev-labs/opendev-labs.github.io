import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { GitHubIcon } from '../common/Icons';
import loginBg from '../../../../assets/login-bg.jpg';

export const AuthPage: React.FC = () => {
    const { loginWithGitHub, isAuthenticated } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    // Check if we should show 'signup' mode (though UI is similar)
    const isSignUp = location.pathname.includes('signup') || location.search.includes('mode=signup');

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/ide/dashboard');
        }
    }, [isAuthenticated, navigate]);

    const handleGitHubLogin = async () => {
        setIsLoading(true);
        setError('');
        try {
            await loginWithGitHub();
            // Redirect happens via useEffect if successful
        } catch (err: any) {
            console.error("Auth Error:", err);
            setError(err.message || "Protocol transmission failed. Re-initializing node...");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex flex-col md:flex-row bg-black overflow-hidden selection:bg-white selection:text-black">
            {/* Left Side: Cyberpunk Immersion - High-Fidelity Rendering */}
            <div className="hidden md:flex md:w-1/2 lg:w-3/5 relative h-full overflow-hidden border-r border-zinc-900">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[30s] hover:scale-110 will-change-transform"
                    style={{
                        backgroundImage: `url(${loginBg})`,
                        imageRendering: 'auto'
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-70" />
                <div className="absolute inset-0 bg-black/30 backdrop-grayscale-[0.5]" />

                <div className="absolute bottom-16 left-16 max-w-lg z-20">
                    <div className="flex items-center gap-3 mb-8 bg-white/5 backdrop-blur-xl px-5 py-2.5 rounded-full border border-white/10 w-fit">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse shadow-[0_0_10px_white]" />
                        <span className="text-[10px] text-zinc-100 font-bold uppercase tracking-[0.3em]">Neural Node 01</span>
                    </div>
                    <h1 className="text-6xl font-black text-white tracking-tighter mb-6 leading-[0.9] uppercase">
                        Protocol<br /><span className="text-zinc-500">Initiated.</span>
                    </h1>
                    <p className="text-zinc-400 text-xl font-medium tracking-tight leading-relaxed max-w-sm">
                        Orchestrate your intelligence across the global edge network with millisecond precision.
                    </p>
                </div>

            </div>

            {/* Right Side: Professional Protocol Authorization */}
            <div className="w-full md:w-1/2 lg:w-2/5 h-full flex flex-col items-center justify-center p-8 md:p-12 lg:p-20 bg-[#020202] relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }}
                />

                <div className="w-full max-w-sm relative z-10">

                    <div className="mb-12 text-center md:text-left">
                        <div className="inline-block px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-md mb-4">
                            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Global Auth Gateway</span>
                        </div>
                        <h2 className="text-4xl font-bold text-white tracking-tighter mb-3 leading-none">
                            {isSignUp ? 'Establish Identity' : 'Authorize Protocol'}
                        </h2>
                        <p className="text-zinc-500 text-base font-medium">Access your intelligence nodes and orchestration tools.</p>
                    </div>

                    <div className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl mb-8 animate-in fade-in slide-in-from-top-4">
                                <p className="text-xs text-red-400 leading-relaxed font-medium italic">{error}</p>
                            </div>
                        )}

                        <button
                            onClick={handleGitHubLogin}
                            disabled={isLoading}
                            className="w-full h-14 flex items-center justify-center gap-4 bg-white text-black rounded-full text-[12px] font-black uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all hover:scale-[1.02] active:scale-95 shadow-2xl shadow-white/5 disabled:opacity-50"
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-[3px] border-black border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <GitHubIcon className="w-6 h-6" />
                            )}
                            <span>Continue with GitHub</span>
                        </button>

                        <div className="relative my-10">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-zinc-900/50"></div>
                            </div>
                            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-[0.4em]">
                                <span className="bg-[#020202] px-6 text-zinc-700">or use workspace identity</span>
                            </div>
                        </div>

                        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="IDENTITY_IDENTIFIER@NODE.COM"
                                className="w-full h-14 bg-black border border-zinc-900 rounded-2xl px-6 text-sm text-white placeholder:text-zinc-800 focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700/50 transition-all tracking-tight font-mono"
                            />
                            <button
                                type="submit"
                                className="w-full h-14 bg-zinc-950/50 border border-zinc-900 text-zinc-500 rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black hover:border-white transition-all duration-300"
                            >
                                Dispatch Verification link
                            </button>
                        </form>
                    </div>

                    <p className="mt-16 text-center md:text-left text-[11px] text-zinc-600 font-bold uppercase tracking-widest leading-relaxed">
                        By proceeding, you agree to the <Link to="/terms" className="text-zinc-400 hover:text-white transition-colors">Digital Protocol</Link> and <Link to="/privacy" className="text-zinc-400 hover:text-white transition-colors">Privacy Encryption</Link>.
                    </p>

                    <div className="mt-16 pt-10 border-t border-zinc-900">
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-zinc-500 font-medium">
                                {isSignUp ? 'Already established?' : 'Node not registered?'}
                            </p>
                            <Link
                                to={isSignUp ? "/auth" : "/auth?mode=signup"}
                                className="text-white text-xs font-black uppercase tracking-widest hover:underline underline-offset-8 transition-all"
                            >
                                {isSignUp ? 'Authorize' : 'Join Network'}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
