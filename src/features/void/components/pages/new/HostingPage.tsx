import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Template } from '../../../types';
import { hostingTemplates } from '../../../constants/hostingTemplates';
import { TemplateCard } from '../TemplateCard';
import { motion } from 'framer-motion';
import { RocketLaunchIcon, ServerIcon } from '../../common/Icons';

export const HostingPage: React.FC<{
    onDeployTemplate: (template: Template, projectName: string, createRepo?: boolean, isPrivate?: boolean) => void;
}> = ({ onDeployTemplate }) => {
    const navigate = useNavigate();

    return (
        <div className="max-w-7xl mx-auto py-20 px-4">
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-20"
            >
                <button
                    onClick={() => navigate('/void/new')}
                    className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 hover:text-white mb-10 transition-all duration-300"
                >
                    <span className="group-hover:-translate-x-2 transition-transform duration-300">&larr;</span>
                    Neural Genesis Options
                </button>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20">
                                <ServerIcon className="w-6 h-6 text-emerald-500" />
                            </div>
                            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase">
                                Free <span className="text-emerald-500">Hosting.</span>
                            </h2>
                        </div>
                        <p className="text-zinc-500 text-lg font-medium leading-relaxed">
                            Deploy any template to OpenDev's high-performance static hosting. Zero configuration. Instant global CDN.
                            <span className="text-emerald-500 font-bold"> 100% Free.</span>
                        </p>
                    </div>
                </div>

                {/* Benefits Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-1 mb-12">
                    <div className="bg-zinc-950/50 border border-zinc-900 p-6">
                        <div className="text-emerald-500 font-black text-2xl mb-2">⚡</div>
                        <h3 className="text-white font-black text-sm uppercase tracking-wider mb-2">Lightning Fast</h3>
                        <p className="text-zinc-600 text-xs font-medium">Global CDN with edge caching for instant load times worldwide.</p>
                    </div>
                    <div className="bg-zinc-950/50 border border-zinc-900 p-6">
                        <div className="text-emerald-500 font-black text-2xl mb-2">🔒</div>
                        <h3 className="text-white font-black text-sm uppercase tracking-wider mb-2">Secure by Default</h3>
                        <p className="text-zinc-600 text-xs font-medium">Free SSL certificates and automatic HTTPS for all deployments.</p>
                    </div>
                    <div className="bg-zinc-950/50 border border-zinc-900 p-6">
                        <div className="text-emerald-500 font-black text-2xl mb-2">∞</div>
                        <h3 className="text-white font-black text-sm uppercase tracking-wider mb-2">Unlimited Sites</h3>
                        <p className="text-zinc-600 text-xs font-medium">Deploy as many projects as you want. No limits, no hidden fees.</p>
                    </div>
                </div>

                <div className="border-l-2 border-emerald-500/30 pl-6">
                    <p className="text-zinc-400 text-sm font-medium">
                        Select a template below to deploy to OpenDev Hosting. Each template will be configured for optimal static hosting performance.
                    </p>
                </div>
            </motion.div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
                {hostingTemplates.map((template, index) => (
                    <motion.div
                        key={template.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                    >
                        <TemplateCard
                            template={template}
                            onDeploy={onDeployTemplate}
                        />
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
