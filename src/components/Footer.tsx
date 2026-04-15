import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
    return (
        <footer className="border-t border-zinc-900 bg-black py-8 px-6">
            <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-[13px] text-zinc-600">
                    © {new Date().getFullYear()} OpenDev-Labs
                </p>
                <div className="flex items-center gap-6">
                    <a
                        href="https://github.com/opendev-labs"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[13px] text-zinc-600 hover:text-zinc-300 transition-colors"
                    >
                        GitHub
                    </a>
                    <Link to="/docs" className="text-[13px] text-zinc-600 hover:text-zinc-300 transition-colors">
                        Documentation
                    </Link>
                    <Link to="/changelog" className="text-[13px] text-zinc-600 hover:text-zinc-300 transition-colors">
                        Changelog
                    </Link>
                </div>
            </div>
        </footer>
    );
};
