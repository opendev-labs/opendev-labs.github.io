import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Template } from '../../../types';
import { hostingTemplates } from '../../../constants/hostingTemplates';
import { TemplateCard } from '../TemplateCard';
import { motion } from 'framer-motion';
import { Server, Zap, Lock, Infinity } from 'lucide-react';
import { templateDeploymentService } from '../../../services/templateDeploymentService';
import { DeploymentPlatform } from '../../../types';

// Background component matching HomePage
const AppBackground = () => (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full" />
    </div>
);

// Template Category Marquee
const CategoryMarquee = () => {
    const categories = [
        { name: 'Portfolio', emoji: '🎨' },
        { name: 'E-Commerce', emoji: '🛒' },
        { name: 'SaaS', emoji: '💼' },
        { name: 'Agency', emoji: '🏢' },
        { name: 'Restaurant', emoji: '🍽️' },
        { name: 'Real Estate', emoji: '🏘️' },
        { name: 'Blog', emoji: '📝' },
        { name: 'Startup', emoji: '🚀' },
        { name: 'Personal', emoji: '👤' },
        { name: 'Custom', emoji: '⚡' },
    ];

    return (
        <div className="py-24 border-y border-zinc-900 overflow-hidden bg-zinc-950/20 backdrop-blur-3xl">
            <p className="text-[10px] font-bold tracking-[0.4em] text-zinc-600 mb-16 uppercase text-center">Professional Templates for Every Business</p>
            <div className="relative flex overflow-x-hidden">
                <div className="py-12 animate-marquee flex whitespace-nowrap gap-20">
                    {categories.concat(categories).map((cat, i) => (
                        <div key={`${cat.name}-${i}`} className="flex items-center gap-4 group">
                            <span className="text-3xl grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-110">
                                {cat.emoji}
                            </span>
                            <span className="text-zinc-600 group-hover:text-white font-bold text-xs uppercase tracking-[0.2em] transition-colors">
                                {cat.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Benefit Card Component matching HomePage FeatureCard
const BenefitCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <motion.div
        whileHover={{ scale: 1.02 }}
        className="group p-8 border border-zinc-900 transition-all hover:bg-zinc-950 duration-500 relative overflow-hidden h-full"
    >
        <div className="relative z-10">
            <div className="w-10 h-10 flex items-center justify-center bg-zinc-900 border border-zinc-800 text-emerald-500 rounded mb-6 group-hover:border-emerald-500/30 transition-colors">
                {icon}
            </div>
            <h3 className="text-lg font-bold text-white mb-3 tracking-tight">{title}</h3>
            <p className="text-zinc-500 text-sm font-medium leading-relaxed">{children}</p>
        </div>
    </motion.div>
);

export const HostingPage: React.FC<{
    onDeployTemplate: (template: Template, projectName: string, platform: DeploymentPlatform, isPrivate?: boolean) => void;
}> = ({ onDeployTemplate }) => {
    const navigate = useNavigate();
    const [isDeploying, setIsDeploying] = useState(false);
    const [deploymentStatus, setDeploymentStatus] = useState<string | null>(null);

    // Handle template deployment with real code generation
    const handleDeploy = async (template: Template, projectName: string, platform: DeploymentPlatform, isPrivate?: boolean) => {
        if (platform === 'github' && !templateDeploymentService.isPATConfigured()) {
            alert('Please configure your GitHub PAT in the Import page first!');
            navigate('/void/new/import');
            return;
        }

        setIsDeploying(true);
        setDeploymentStatus(`Generating ${template.name} code...`);

        try {
            const result = await templateDeploymentService.deployTemplate({
                templateId: template.id,
                projectName,
                platform,
                isPrivate
            });

            if (result.success) {
                setDeploymentStatus(`✅ Deployed to ${platform.toUpperCase()}! Live at: ${result.liveUrl}`);
                setTimeout(() => {
                    if (result.liveUrl) window.open(result.liveUrl, '_blank');
                }, 2000);
            } else {
                setDeploymentStatus(`❌ Error: ${result.error}`);
            }
        } catch (error) {
            setDeploymentStatus(`❌ Deployment failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsDeploying(false);
            setTimeout(() => setDeploymentStatus(null), 5000);
        }
    };

    return (
        <div className="relative overflow-hidden bg-black -mx-4 -mt-8 pt-20">
            <AppBackground />

            <div className="relative z-10 container mx-auto px-6">
                {/* Back Navigation */}
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => navigate('/void/new')}
                    className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 hover:text-white mb-10 transition-all duration-300"
                >
                    <span className="group-hover:-translate-x-2 transition-transform duration-300">&larr;</span>
                    Neural Genesis Options
                </motion.button>

                {/* Hero Section */}
                <div className="min-h-[60vh] flex flex-col justify-center py-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl mx-auto text-center"
                    >
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-zinc-900 border border-zinc-800 text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400 mb-8 select-none">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Global Edge Infrastructure
                        </span>

                        <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-white leading-[0.85] mb-10">
                            Sync <br />
                            <span className="text-emerald-500 italic font-serif">Hosting.</span>
                        </h1>

                        <p className="max-w-xl mx-auto text-lg text-zinc-500 leading-relaxed font-medium mb-12">
                            Deploy any template to OpenDev's high-performance static hosting via SyncStack. Zero configuration. Instant global CDN. <span className="text-emerald-500 font-bold">100% Free.</span>
                        </p>
                    </motion.div>
                </div>

                {/* Category Marquee */}
                <CategoryMarquee />

                {/* Benefits Section */}
                <div className="py-32 max-w-[1200px] mx-auto">
                    <p className="text-[10px] font-bold tracking-[0.4em] text-zinc-600 mb-16 uppercase text-center">Production-Grade Infrastructure</p>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-1">
                        <BenefitCard icon={<Zap size={20} />} title="Lightning Fast">
                            Global CDN with edge caching for instant load times worldwide. Sub-100ms response times.
                        </BenefitCard>
                        <BenefitCard icon={<Lock size={20} />} title="Secure by Default">
                            Free SSL certificates and automatic HTTPS for all deployments. Enterprise-grade security.
                        </BenefitCard>
                        <BenefitCard icon={<Infinity size={20} />} title="Unlimited Sites">
                            Deploy as many projects as you want. No limits, no hidden fees, no credit card required.
                        </BenefitCard>
                        <BenefitCard icon={<Server size={20} />} title="99.9% Uptime">
                            Powered by multi-region architecture with automatic failover and redundancy.
                        </BenefitCard>
                    </div>
                </div>

                {/* Templates Section */}
                <div className="py-20">
                    <div className="mb-16 text-center">
                        <p className="text-[10px] font-bold tracking-[0.4em] text-zinc-600 mb-4 uppercase">Choose Your Template</p>
                        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase mb-6">
                            SyncStack <span className="text-emerald-500">Managed Nodes.</span>
                        </h2>
                        <p className="max-w-2xl mx-auto text-zinc-500 text-sm font-medium">
                            Select a template below. SyncStack will automatically provision a GitHub repository and deploy it to our global edge mesh. These repositories are managed locally and synced in real-time.
                        </p>
                    </div>

                    {/* Deployment Status Notification */}
                    {deploymentStatus && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8 p-6 bg-zinc-950 border border-emerald-500/30 text-center"
                        >
                            <p className="text-sm font-bold text-white">{deploymentStatus}</p>
                        </motion.div>
                    )}

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {hostingTemplates.map(template => (
                            <TemplateCard
                                key={template.id}
                                template={template}
                                onDeploy={handleDeploy}
                            />
                        ))}
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="py-32 text-center border-t border-zinc-900">
                    <p className="text-zinc-600 text-sm font-medium mb-6">
                        Need a custom solution? Our agents can build anything.
                    </p>
                    <button
                        onClick={() => navigate('/void/new/sub0')}
                        className="h-12 px-10 rounded-none bg-white text-black text-sm font-bold hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95 inline-flex items-center justify-center gap-2"
                    >
                        Talk to sub0
                    </button>
                </div>
            </div>
        </div>
    );
};
