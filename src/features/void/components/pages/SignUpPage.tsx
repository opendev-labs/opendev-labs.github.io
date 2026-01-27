import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GitHubIcon, GitLabIcon, GmailIcon } from '../common/Icons';
import { useAuth } from '../../hooks/useAuth';
import { ErrorMessage } from '../common/ErrorMessage';
import { GITHUB_CLIENT_ID, GITHUB_OAUTH_URL, GITHUB_SCOPES } from '../../config';

const SocialButton: React.FC<{ provider: string, icon: React.ReactNode, href?: string, onClick?: () => void }> = ({ provider, icon, href, onClick }) => {
    const Tag = href ? 'a' : 'button';
    return (
        <Tag href={href} onClick={onClick} className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-zinc-900 bg-zinc-950 hover:bg-zinc-900 transition-all rounded-md">
            {icon}
            <span className="text-sm font-bold text-zinc-300">Continue with {provider}</span>
        </Tag>
    )
}

const AppLogo = () => (
    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
        <div className="w-6 h-6 border-[3px] border-black rounded-sm" />
    </div>
);


export const SignUpPage: React.FC = () => {
    const { login } = useAuth();
    const [error, setError] = useState('');
    const navigate = useNavigate();

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

        localStorage.setItem('opendev_verification_user', JSON.stringify({ name, email }));
        navigate('/ide/verify-email');
    }

    const gitHubAuthUrl = `${GITHUB_OAUTH_URL}?client_id=${GITHUB_CLIENT_ID}&scope=${encodeURIComponent(GITHUB_SCOPES)}`;

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 bg-black">
            <div className="w-full max-w-md p-10 bg-black border border-zinc-900 rounded-2xl shadow-2xl">
                <AppLogo />
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold tracking-tighter text-white mb-2">Join opendev-labs</h1>
                    <p className="text-zinc-500 text-sm font-medium">Deploy your first project in minutes.</p>
                </div>

                <div className="space-y-3 mb-8">
                    <SocialButton provider="GitHub" icon={<GitHubIcon />} href={gitHubAuthUrl} />
                    <SocialButton provider="GitLab" icon={<GitLabIcon />} onClick={handleGitLabSignUp} />
                    <SocialButton provider="Gmail" icon={<GmailIcon />} onClick={handleGmailSignUp} />
                </div>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-zinc-900"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-black px-4 text-zinc-600 font-bold tracking-widest">or</span>
                    </div>
                </div>

                <form className="space-y-4" onSubmit={handleSignUp}>
                    {error && <ErrorMessage message={error} />}
                    <div>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="w-full bg-zinc-950 border border-zinc-900 py-3 px-4 text-sm text-white rounded-md placeholder:text-zinc-700 focus:outline-none focus:ring-1 focus:ring-white transition-all"
                            placeholder="Full Name"
                        />
                    </div>
                    <div>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="w-full bg-zinc-950 border border-zinc-900 py-3 px-4 text-sm text-white rounded-md placeholder:text-zinc-700 focus:outline-none focus:ring-1 focus:ring-white transition-all"
                            placeholder="Email Address"
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="w-full bg-zinc-950 border border-zinc-900 py-3 px-4 text-sm text-white rounded-md placeholder:text-zinc-700 focus:outline-none focus:ring-1 focus:ring-white transition-all"
                            placeholder="Password (8+ characters)"
                        />
                    </div>
                    <button type="submit" className="w-full h-11 bg-white text-black font-bold text-sm rounded-md hover:bg-zinc-200 transition-all active:scale-95 shadow-lg shadow-white/5">
                        Create Account
                    </button>
                </form>

                <p className="mt-10 text-center text-sm text-zinc-500 font-medium">
                    By signing up, you agree to our <Link to="/terms" className="text-white hover:underline">Terms</Link> and <Link to="/privacy" className="text-white hover:underline">Privacy Policy</Link>.
                </p>

                <div className="mt-8 pt-6 border-t border-zinc-900 text-center">
                    <p className="text-sm text-zinc-500">
                        Already have an account?{' '}
                        <Link to="/ide/login" className="text-white font-bold hover:underline ml-1">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

