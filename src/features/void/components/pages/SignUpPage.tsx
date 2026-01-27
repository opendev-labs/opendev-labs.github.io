import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { safeNavigate } from '../../services/navigation';
import { GitHubIcon, GitLabIcon, GmailIcon } from '../common/Icons';
import { useAuth } from '../../hooks/useAuth';
import { ErrorMessage } from '../common/ErrorMessage';
import { GITHUB_CLIENT_ID, GITHUB_OAUTH_URL, GITHUB_SCOPES } from '../../config';

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


export const SignUpPage: React.FC = () => {
    const { login } = useAuth();
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
        e.preventDefault();
        navigate(path);
    };

    const handleGmailSignUp = () => {
        login({ name: 'New User', email: 'new.user@gmail.com' });
    };

    const handleGitLabSignUp = () => {
        login({ name: 'New GitLab User', email: 'new.user@gitlab.com' });
    };

    const handleSignUp = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const formData = new FormData(e.target as HTMLFormElement);
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        if (!name || !email || !password) {
            setError('Please fill in all fields.');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }

        localStorage.setItem('void_verification_user', JSON.stringify({ name, email }));
        navigate('/verify-email');
    }

    const gitHubAuthUrl = `${GITHUB_OAUTH_URL}?client_id=${GITHUB_CLIENT_ID}&scope=${encodeURIComponent(GITHUB_SCOPES)}`;

    return (
        <div className="py-12 sm:py-20 flex items-center justify-center">
            <div className="w-full max-w-sm p-8 bg-void-card border border-void-line rounded-lg">
                <VoidLogo />
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold tracking-tighter text-white">Create your Void Account</h1>
                    <p className="mt-2 text-zinc-400 text-sm">Deploy your first project in minutes.</p>
                </div>

                <div className="space-y-3">
                    <SocialButton provider="GitHub" icon={<GitHubIcon />} href={gitHubAuthUrl} />
                    <SocialButton provider="GitLab" icon={<GitLabIcon />} onClick={handleGitLabSignUp} />
                    <SocialButton provider="Gmail" icon={<GmailIcon />} onClick={handleGmailSignUp} />
                </div>

                <div className="my-6 flex items-center">
                    <div className="flex-grow border-t border-void-line"></div>
                    <span className="flex-shrink mx-4 text-xs text-zinc-500">OR</span>
                    <div className="flex-grow border-t border-void-line"></div>
                </div>

                <form className="space-y-4" onSubmit={handleSignUp}>
                    {error && <ErrorMessage message={error} />}
                    <div>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="w-full bg-void-bg border border-void-line py-2 px-3 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-void-neon"
                            placeholder="Your Name"
                        />
                    </div>
                    <div>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="w-full bg-void-bg border border-void-line py-2 px-3 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-void-neon"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="w-full bg-void-bg border border-void-line py-2 px-3 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-void-neon"
                            placeholder="Password (8+ characters)"
                        />
                    </div>
                    <button type="submit" className="w-full bg-white text-black font-semibold py-2.5 px-4 hover:bg-zinc-200 transition-colors">
                        Sign Up with Email
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-zinc-400">
                    Already have an account?{' '}
                    <a href="/#/login" onClick={(e) => handleNav(e, '/login')} className="text-void-neon hover:underline font-semibold">
                        Log in
                    </a>
                </p>
            </div>
        </div>
    );
};
