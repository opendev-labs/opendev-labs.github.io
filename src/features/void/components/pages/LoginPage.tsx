import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { safeNavigate } from '../../services/navigation'; // Keep for other uses if needed, or remove
import { GitHubIcon, GitLabIcon, GmailIcon } from '../common/Icons';
import { useAuth } from '../../hooks/useAuth';
import { ErrorMessage } from '../common/ErrorMessage';
import { GITHUB_CLIENT_ID, GITHUB_OAUTH_URL, GITHUB_SCOPES } from '../../config';
import { motion } from 'framer-motion';

const SocialButton: React.FC<{ provider: string, icon: React.ReactNode, href?: string, onClick?: () => void }> = ({ provider, icon, href, onClick }) => {
    const Tag = href ? 'a' : 'button';
    return (
        <Tag href={href} onClick={onClick} className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-void-line bg-void-line/50 hover:bg-void-card transition-colors">
            {icon}
            <span className="text-sm font-medium text-zinc-200">Continue with {provider}</span>
        </Tag>
    )
}

const VoidLogo = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-4">
        <path d="M12 2L2 12L12 22L22 12L12 2Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M12 7L7 12L12 17L17 12L12 7Z" fill="white" />
    </svg>
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
        navigate('/verify-email');
    };

    return (
        <div className="py-20 sm:py-32 flex items-center justify-center relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-void-accent/5 blur-[120px] rounded-full pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md p-10 glass-panel rounded-3xl relative z-10 shadow-2xl shadow-black"
            >
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.1] mb-6 shadow-inner">
                        <VoidLogo />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Welcome to Void</h1>
                    <p className="text-zinc-500 text-sm">Deploy high-performance web apps in seconds.</p>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={handleGitHubLogin}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-white text-black rounded-xl font-bold hover:bg-zinc-200 transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                        <GitHubIcon className="w-5 h-5 text-black" />
                        <span>Continue with GitHub</span>
                    </button>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={handleGitLabLogin}
                            className="flex items-center justify-center gap-3 py-3 px-4 glass-panel rounded-xl text-zinc-300 hover:text-white hover:border-white/20 transition-all active:scale-[0.98]"
                        >
                            <GitLabIcon className="w-4 h-4" />
                            <span className="text-xs font-bold">GitLab</span>
                        </button>
                        <button
                            onClick={handleGmailLogin}
                            className="flex items-center justify-center gap-3 py-3 px-4 glass-panel rounded-xl text-zinc-300 hover:text-white hover:border-white/20 transition-all active:scale-[0.98]"
                        >
                            <GmailIcon className="w-4 h-4" />
                            <span className="text-xs font-bold">Google</span>
                        </button>
                    </div>
                </div>

                <div className="my-8 flex items-center">
                    <div className="flex-grow border-t border-white/[0.08]"></div>
                    <span className="flex-shrink mx-4 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">OR</span>
                    <div className="flex-grow border-t border-white/[0.08]"></div>
                </div>

                <form className="space-y-4" onSubmit={handleEmailLogin}>
                    {error && <ErrorMessage message={error} />}
                    <div className="space-y-4">
                        <div className="group">
                            <input
                                type="email"
                                name="email"
                                className="w-full bg-white/[0.03] border border-white/[0.08] py-3.5 px-4 rounded-xl text-sm text-white focus:outline-none focus:border-void-accent/50 focus:ring-4 focus:ring-void-accent/5 transition-all placeholder:text-zinc-600"
                                placeholder="Email address"
                            />
                        </div>
                        <div className="group">
                            <input
                                type="password"
                                name="password"
                                className="w-full bg-white/[0.03] border border-white/[0.08] py-3.5 px-4 rounded-xl text-sm text-white focus:outline-none focus:border-void-accent/50 focus:ring-4 focus:ring-void-accent/5 transition-all placeholder:text-zinc-600"
                                placeholder="Password"
                            />
                        </div>
                    </div>
                    <button type="submit" className="w-full py-4 px-4 glass-panel border-white/[0.1] hover:border-white/20 text-white font-bold rounded-xl transition-all active:scale-[0.98]">
                        Sign in with Email
                    </button>
                </form>

                <p className="mt-10 text-center text-xs text-zinc-500 font-medium">
                    Don't have an account?{' '}
                    <a href="/#/signup" onClick={(e) => handleNav(e, '/signup')} className="text-void-accent hover:text-white transition-colors border-b border-void-accent/30 hover:border-white">
                        Create an account for free
                    </a>
                </p>
            </motion.div>
        </div>
    );
};
