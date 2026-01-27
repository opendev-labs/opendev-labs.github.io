import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { GitHubIcon, GoogleIcon } from '../common/Icons';
import { ArrowLeft } from 'lucide-react';
import loginBg from '../../../../assets/login-bg.jpg';

export const AuthPage: React.FC = () => {
    const { loginWithGitHub, loginWithGoogle, isAuthenticated } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [authMethod, setAuthMethod] = useState<'none' | 'github' | 'google' | 'email'>('none');
    const [showEmailFields, setShowEmailFields] = useState(false);
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');
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
            console.error("Auth Error:", err);
            setError(err.message || "Google authentication failed.");
            setAuthMethod('none');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailAction = (e: React.FormEvent) => {
        e.preventDefault();
        if (!showEmailFields) {
            setShowEmailFields(true);
            return;
        }
        setIsLoading(true);
        setAuthMethod('email');
        setTimeout(() => {
            setError("Verification code sent to " + email);
            setIsLoading(false);
            setAuthMethod('none');
        }, 1500);
    };

    return (
        <div className="fixed inset-0 flex flex-col md:flex-row bg-black overflow-hidden selection:bg-white selection:text-black">
            {/* Left Side: Cinematic Immersive Panel */}
            <div className="hidden md:flex md:w-1/2 lg:w-3/5 relative h-full overflow-hidden border-r border-[#111]">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[40s] hover:scale-105 will-change-transform opacity-70"
                    style={{ backgroundImage: `url(${loginBg})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

                <div className="absolute bottom-16 left-16 max-w-lg z-20">
                    <h1 className="text-7xl font-bold text-white tracking-tighter mb-6 leading-[0.9] lowercase">
                        opendev-labs<br /><span className="text-zinc-500 transition-colors">intelligent ecosystem.</span>
                    </h1>
                    <p className="text-zinc-400 text-lg font-medium tracking-tight leading-relaxed max-w-sm">
                        Build, deploy, and scale your intelligent applications with the industry standard for developer workflows.
                    </p>
                </div>
            </div>

            {/* Right Side: Simple Auth Section */}
            <div className="w-full md:w-1/2 lg:w-2/5 h-full flex flex-col items-center justify-center p-6 md:p-12 bg-black relative overflow-y-auto">
                <Link
                    to="/"
                    className="absolute top-8 left-8 flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group z-30"
                >
                    <ArrowLeft size={16} />
                    <span className="text-xs font-bold uppercase tracking-widest">Home</span>
                </Link>

                <div className="w-full max-w-[340px] relative z-20">
                    <div className="mb-10 text-center">
                        <h2 className="text-3xl font-bold text-white tracking-tight mb-2">
                            {isSignUp ? 'Create an account' : 'Log in to OpenDev'}
                        </h2>
                        <p className="text-zinc-500 text-sm font-medium">
                            {isSignUp ? 'Start building in seconds.' : 'Welcome back.'}
                        </p>
                    </div>

                    {error && (
                        <div className="p-3 rounded-lg mb-6 bg-red-500/10 border border-red-500/20 text-red-400 text-center">
                            <p className="text-[11px] font-medium">{error}</p>
                        </div>
                    )}

                    <div className="space-y-3">
                        {!showEmailFields && (
                            <>
                                <button
                                    onClick={handleGitHubLogin}
                                    disabled={isLoading}
                                    className="w-full h-11 flex items-center justify-center gap-3 bg-white text-black rounded-lg text-xs font-bold hover:bg-zinc-200 transition-all disabled:opacity-50"
                                >
                                    <GitHubIcon className="w-4 h-4" />
                                    Continue with GitHub
                                </button>

                                <button
                                    onClick={handleGoogleLogin}
                                    disabled={isLoading}
                                    className="w-full h-11 flex items-center justify-center gap-3 bg-black border border-zinc-800 text-white rounded-lg text-xs font-bold hover:bg-zinc-950 transition-all disabled:opacity-50"
                                >
                                    <GoogleIcon className="w-4 h-4" />
                                    Continue with Google
                                </button>
                            </>
                        )}

                        <form onSubmit={handleEmailAction} className="space-y-3">
                            <div className={`space-y-3 transition-all duration-500 ease-in-out ${showEmailFields ? 'opacity-100 translate-y-0 h-auto mb-4' : 'opacity-0 -translate-y-2 h-0 overflow-hidden'}`}>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email Address"
                                    className="w-full h-11 bg-black border border-zinc-800 rounded-lg px-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-white transition-all"
                                />
                                <input
                                    type="password"
                                    required={showEmailFields}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    className="w-full h-11 bg-black border border-zinc-800 rounded-lg px-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-white transition-all"
                                />
                                <input
                                    type="text"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    placeholder="Verification Code (optional)"
                                    className="w-full h-11 bg-black border border-zinc-800 rounded-lg px-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-white transition-all"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full h-11 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${showEmailFields ? 'bg-white text-black hover:bg-zinc-200' : 'bg-black border border-zinc-800 text-white hover:border-zinc-500'}`}
                            >
                                {isLoading ? (
                                    <div className={`w-4 h-4 border-2 rounded-full animate-spin ${showEmailFields ? 'border-black border-t-transparent' : 'border-white border-t-transparent'}`} />
                                ) : (
                                    showEmailFields ? 'Sign in' : 'Continue with Email'
                                )}
                            </button>
                        </form>
                    </div>

                    <div className="mt-8 pt-8 border-t border-zinc-900 text-center space-y-4">
                        <p className="text-[11px] text-zinc-500 font-medium">
                            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                            <Link
                                to={isSignUp ? "/auth" : "/auth?mode=signup"}
                                className="text-white ml-1 font-bold hover:underline underline-offset-4"
                                onClick={() => setShowEmailFields(false)}
                            >
                                {isSignUp ? 'Log in' : 'Sign up'}
                            </Link>
                        </p>

                        <div className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest flex items-center justify-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-zinc-800" />
                            Powered by Void • Auto-deploy to GitHub
                        </div>
                    </div>
                </div>
            </div>
            );
};
