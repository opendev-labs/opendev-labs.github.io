import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { GitHubIcon } from '../common/Icons';
import loginBg from '../../../../assets/login-bg.jpg';

export const LoginPage: React.FC = () => {
    const { loginWithGitHub, isAuthenticated } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // If already authenticated, redirect to dashboard
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
            console.error("Login Error:", err);
            setError(err.message || "Failed to authenticate with GitHub. Infrastructure is in simulation mode.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex flex-col md:flex-row bg-black overflow-hidden selection:bg-white selection:text-black">
            {/* Left Side: Cyberpunk Immersion */}
            <div className="hidden md:flex md:w-3/5 lg:w-2/3 relative h-full overflow-hidden border-r border-zinc-900">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] hover:scale-110"
                    style={{ backgroundImage: `url(${loginBg})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-60" />
                <div className="absolute inset-0 bg-black/20" />

                <div className="absolute bottom-12 left-12 max-w-lg z-20">
                    <div className="flex items-center gap-3 mb-6 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 w-fit">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        <span className="text-[10px] text-white font-bold uppercase tracking-[0.2em]">Global Edge Network</span>
                    </div>
                    <h1 className="text-5xl font-bold text-white tracking-tighter mb-4 leading-none">
                        ENTER THE<br /><span className="text-zinc-400">INTELLIGENCE.</span>
                    </h1>
                    <p className="text-zinc-400 text-lg font-medium tracking-tight">
                        Deploy your infrastructure at the speed of thought.
                        Join the elite protocol favored by architecture architects.
                    </p>
                </div>

                <div className="absolute top-12 left-12 z-20">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            <div className="w-4 h-4 border-2 border-black rounded-sm" />
                        </div>
                        <span className="text-white font-bold tracking-tighter text-xl">opendev-labs</span>
                    </Link>
                </div>
            </div>

            {/* Right Side: Professional Protocol Authorization */}
            <div className="w-full md:w-2/5 lg:w-1/3 h-full flex items-center justify-center p-8 bg-black">
                <div className="w-full max-w-sm">
                    <div className="md:hidden flex flex-col items-center mb-12">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                                <div className="w-5 h-5 border-[2.5px] border-black rounded-sm" />
                            </div>
                            <span className="text-white font-bold tracking-tighter text-2xl">opendev-labs</span>
                        </Link>
                    </div>

                    <div className="mb-10 text-center md:text-left">
                        <h2 className="text-3xl font-bold text-white tracking-tighter mb-2">Initialize Session</h2>
                        <p className="text-zinc-500 text-sm font-medium">Authenticate to access the orchestration dashboard.</p>
                    </div>

                    <div className="space-y-4">
                        {error && (
                            <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl mb-6">
                                <p className="text-xs text-zinc-400 leading-relaxed italic">{error}</p>
                                <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-2 border-t border-zinc-800 pt-2">Fallback protocol active</p>
                            </div>
                        )}

                        <button
                            onClick={handleGitHubLogin}
                            disabled={isLoading}
                            className="w-full h-12 flex items-center justify-center gap-3 bg-white text-black rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-white/5 disabled:opacity-50"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <GitHubIcon className="w-5 h-5" />
                            )}
                            <span>Continue with GitHub</span>
                        </button>

                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-zinc-900"></div>
                            </div>
                            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-[0.2em]">
                                <span className="bg-black px-4 text-zinc-700">or management</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <input
                                type="email"
                                placeholder="ACCESS_IDENTITY@DOMAIN"
                                className="w-full h-12 bg-black border border-zinc-900 rounded-xl px-5 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-zinc-500 transition-colors tracking-tight font-mono"
                            />
                            <button className="w-full h-12 bg-zinc-950 border border-zinc-900 text-zinc-500 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-900 hover:text-white transition-all">
                                Request Access Link
                            </button>
                        </div>
                    </div>

                    <p className="mt-12 text-center md:text-left text-xs text-zinc-600 font-medium leading-relaxed">
                        By initializing, you agree to our <Link to="/terms" className="text-zinc-400 hover:underline">Terms of Protocol</Link> and <Link to="/privacy" className="text-zinc-400 hover:underline">Privacy Policy</Link>.
                    </p>

                    <div className="mt-12 pt-8 border-t border-zinc-900 text-center md:text-left">
                        <p className="text-xs text-zinc-500">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-white font-bold hover:underline ml-1">
                                Join Protocol
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
