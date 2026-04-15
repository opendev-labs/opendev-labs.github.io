import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
    return (
        <footer className="border-t border-zinc-900 bg-black py-12 px-6">
            <div className="max-w-[1100px] mx-auto text-center">
                <p className="text-[13px] text-zinc-600">
                    MIT License · <a href="https://github.com/opendev-labs" className="hover:text-white transition-colors">GitHub</a> · <Link to="/docs" className="hover:text-white transition-colors">Documentation</Link>
                </p>
            </div>
        </footer>
    );
};
