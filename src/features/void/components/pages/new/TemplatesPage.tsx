import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Template } from '../../../types';
import { DeploymentPlatform } from '../DeploymentConfigForm';
import { TemplateCard } from '../TemplateCard';
import { RazorpayButton } from '../../common/RazorpayButton';
import { motion } from 'framer-motion';

// Example templates  for demonstration
const mockTemplates: Template[] = [
    // Add your templates here
];

export const TemplatesPage: React.FC<{ onDeployTemplate: (template: Template, projectName: string, platform: DeploymentPlatform, isPrivate?: boolean) => void }> = ({ onDeployTemplate }) => {
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

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="max-w-2xl">
                        <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 uppercase">
                            Select <span className="text-zinc-500 italic font-serif">Fabric.</span>
                        </h2>
                        <p className="text-zinc-500 text-lg font-medium leading-relaxed">
                            Deploy high-fidelity boilerplates instantly. Each template is pre-configured with the opendev-labs neural mesh for autonomous scaling and edge sovereignty.
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 mb-32">
                {mockTemplates.map((template, index) => (
                    <motion.div
                        key={template.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                        <TemplateCard
                            template={template}
                            onDeploy={onDeployTemplate}
                        />
                    </motion.div>
                ))}
            </div>

            {/* Support / Razorpay Section */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="relative p-12 md:p-20 border border-zinc-900 bg-zinc-950/30 backdrop-blur-3xl overflow-hidden group"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[100px] rounded-full -mr-32 -mt-32" />

                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                    <div className="text-center lg:text-left max-w-xl">
                        <h3 className="text-3xl font-black text-white tracking-tight mb-4 uppercase">Accelerate the Mission</h3>
                        <p className="text-zinc-500 font-medium leading-relaxed">
                            opendev-labs is a $1M logic engine in the making. Your support helps us expand the neural fabric and integrate advanced protocols like Razorpay enterprise gateways.
                        </p>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                        <RazorpayButton />
                        <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Secure Nexus Transaction via Razorpay</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
