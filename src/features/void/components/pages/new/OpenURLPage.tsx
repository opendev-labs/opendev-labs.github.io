import React from 'react';
import { useNavigate } from 'react-router-dom';
import { OpenURLDeploy } from '../../deployment/OpenURLDeploy';

export const OpenURLPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="max-w-4xl mx-auto pb-20 py-10">
            <button onClick={() => navigate('/void/new')} className="group flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-zinc-600 hover:text-white mb-12 transition-all">
                <span className="group-hover:-translate-x-1 transition-transform">&larr;</span>
                Genesis Options
            </button>

            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-white tracking-tighter mb-4">Deploy to OpenDev</h2>
                <p className="text-zinc-500 max-w-lg mx-auto">
                    Instant, global edge hosting for your portfolios and projects. Powered by the OpenDev GitHub network.
                </p>
            </div>

            <OpenURLDeploy
                repoName=""
                onComplete={(url) => {
                    // In a real app, this would redirect or show success state permanently
                }}
                onCancel={() => navigate('/void/new')}
            />
        </div>
    );
};
