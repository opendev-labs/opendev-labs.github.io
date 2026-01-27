import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { safeNavigate } from '../../services/navigation'; // Keep for other uses if needed, or remove
import { GitHubIcon, GitLabIcon, GmailIcon } from '../common/Icons';
import { useAuth } from '../../hooks/useAuth';
import { ErrorMessage } from '../common/ErrorMessage';
import { GITHUB_CLIENT_ID, GITHUB_OAUTH_URL, GITHUB_SCOPES } from '../../config';
import { motion } from 'framer-motion';

const AppLogo = () => (
    <div className="w-8 h-8 bg-white rotate-45 flex items-center justify-center overflow-hidden mx-auto mb-4">
        <div className="w-6 h-6 bg-black rotate-[-45deg]"></div>
    </div>
);


export const LoginPage: React.FC = () => {
    const { login, loginWithGitHub } = useAuth();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleGitHubLogin = async () => {
        setIsLoading(true);
        try {
            await loginWithGitHub();
        } catch (err: any) {
            console.error(err);
            setError('Failed to sign in with GitHub. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
        e.preventDefault();
        navigate(path);
    };

    const handleGmailLogin = () => {
        login({ name: 'Demo User', email: 'demo.user@gmail.com' });
    };

    const handleGitLabLogin = () => {
        login({ name: 'GitLab User', email: 'user@gitlab.com' });
    };

    const handleEmailLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const formData = new FormData(e.target as HTMLFormElement);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        localStorage.setItem('void_verification_user', JSON.stringify({ email, name: 'Valued User' }));
        navigate('/ide/verify-email');
    };

    return (
        <div className="py-20 flex items-center justify-center relative overflow-hidden bg-black">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 blur-[120px] rounded-full pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md p-10 bg-zinc-950 border border-zinc-900 rounded-2xl relative z-10"
            >
                <div className="text-center mb-10">
                    <AppLogo />
                    <h1 className="text-2xl font-bold tracking-tighter text-white mb-2 uppercase tracking-[0.2em]">opendev-labs</h1>
                    <p className="text-zinc-500 text-sm font-medium">Log in to your account</p>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={handleGitHubLogin}
                        disabled={isLoading}
                        className="w-full h-11 flex items-center justify-center gap-3 bg-white text-black rounded-md font-bold hover:bg-zinc-200 transition-all active:scale-[0.98] disabled:opacity-50 text-sm"
                    >
                        <GitHubIcon className="w-5 h-5 text-black" />
                        <span>Continue with GitHub</span>
                    </button>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={handleGitLabLogin}
                            className="flex items-center justify-center h-10 gap-3 bg-zinc-900 border border-zinc-800 rounded-md text-zinc-300 hover:text-white hover:border-zinc-700 transition-all active:scale-[0.98]"
                        >
                            <GitLabIcon className="w-4 h-4" />
                            <span className="text-xs font-bold">GitLab</span>
                        </button>
                        <button
                            onClick={handleGmailLogin}
                            className="flex items-center justify-center h-10 gap-3 bg-zinc-900 border border-zinc-800 rounded-md text-zinc-300 hover:text-white hover:border-zinc-700 transition-all active:scale-[0.98]"
                        >
                            <GmailIcon className="w-4 h-4" />
                            <span className="text-xs font-bold">Google</span>
                        </button>
                    </div>
                </div>

                <div className="my-8 flex items-center">
                    <div className="flex-grow border-t border-zinc-900"></div>
                    <span className="flex-shrink mx-4 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">OR</span>
                    <div className="flex-grow border-t border-zinc-900"></div>
                </div>

                <form className="space-y-4" onSubmit={handleEmailLogin}>
                    {error && <ErrorMessage message={error} />}
                    <div className="space-y-4">
                        <input
                            type="email"
                            name="email"
                            className="w-full bg-zinc-900 border border-zinc-800 py-3 px-4 rounded-md text-sm text-white focus:outline-none focus:border-zinc-600 transition-all placeholder:text-zinc-700 font-medium"
                            placeholder="Email address"
                        />
                        <input
                            type="password"
                            name="password"
                            className="w-full bg-zinc-900 border border-zinc-800 py-3 px-4 rounded-md text-sm text-white focus:outline-none focus:border-zinc-600 transition-all placeholder:text-zinc-700 font-medium"
                            placeholder="Password"
                        />
                    </div>
                    <button type="submit" className="w-full py-3 px-4 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 text-white text-sm font-bold rounded-md transition-all active:scale-[0.98]">
                        Sign in with Email
                    </button>
                </form>

                <p className="mt-10 text-center text-xs text-zinc-500 font-medium">
                    Don't have an account?{' '}
                    <Link to="/ide/signup" className="text-white hover:underline transition-colors">
                        Create an account
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

