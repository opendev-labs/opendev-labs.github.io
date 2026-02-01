import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { motion } from 'framer-motion';

interface Feature {
    title: string;
    desc: string;
    icon: React.FC<{ size?: number; className?: string }>;
}

interface PerformanceMetric {
    title: string;
    desc: string;
    icon: React.FC<{ size?: number; className?: string }>;
}

interface ProductPageProps {
    badge: string;
    badgeIcon: React.FC<{ size?: number; className?: string }>;
    title: string;
    description: string;
    performanceTitle: string;
    performanceMetrics: PerformanceMetric[];
    features: Feature[];
    codeSnippet?: React.ReactNode;
    primaryActionLabel?: string;
    onPrimaryAction?: () => void;
}

export const ProductPageTemplate: React.FC<ProductPageProps> = ({
    badge,
    badgeIcon: BadgeIcon,
    title,
    description,
    features,
    performanceTitle,
    performanceMetrics,
    codeSnippet,
    primaryActionLabel = "Deploy Now",
    onPrimaryAction = () => window.location.href = '/void/new'
}) => {
    return (
        <div className="flex flex-col w-full bg-black text-white selection:bg-white selection:text-black">
            {/* Hero Section */}
            <section className="relative min-h-[70vh] flex flex-col items-center justify-center pt-20 overflow-hidden border-b border-zinc-900">
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-20">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-zinc-800/10 blur-[120px]" />
                </div>

                <div className="relative z-10 text-center max-w-4xl px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-zinc-900 border border-zinc-800 text-[10px] font-bold text-zinc-400 mb-8 uppercase tracking-widest"
                    >
                        <BadgeIcon size={14} className="text-zinc-500" />
                        <span>{badge}</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 leading-[0.9] lowercase"
                    >
                        {title}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg md:text-xl text-zinc-500 max-w-2xl mx-auto mb-12 font-medium leading-relaxed"
                    >
                        {description}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Button size="lg" onClick={onPrimaryAction} icon={<ArrowRight size={16} />}>
                            {primaryActionLabel}
                        </Button>
                        <Button variant="outline" size="lg" onClick={() => window.location.href = '/docs'}>
                            Documentation
                        </Button>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-32 relative overflow-hidden bg-black border-b border-zinc-900">
                <div className="max-w-[1200px] mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-1 ring-1 ring-zinc-900 rounded-none overflow-hidden">
                        {features.map((feature, i) => (
                            <div key={i} className="group p-12 border border-zinc-900/50 transition-all hover:bg-zinc-950 duration-500">
                                <feature.icon className="mb-8 text-white transition-transform group-hover:scale-110" size={20} />
                                <h3 className="text-lg font-bold mb-4 tracking-tight uppercase text-zinc-100">{feature.title}</h3>
                                <p className="text-zinc-500 text-sm leading-relaxed font-medium">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Performance Section */}
            <section className="py-32">
                <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-12 tracking-tighter leading-[1.1]">
                            {performanceTitle.split(' ').map((word, i) => (
                                <React.Fragment key={i}>
                                    {i === performanceTitle.split(' ').length - 1 ? <span className="text-zinc-600 block">{word}</span> : word + ' '}
                                </React.Fragment>
                            ))}
                        </h2>
                        <div className="space-y-10">
                            {performanceMetrics.map((metric, i) => (
                                <div key={i} className="flex gap-6 group">
                                    <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-none flex items-center justify-center shrink-0 group-hover:border-zinc-700 transition-colors">
                                        <metric.icon size={20} className="text-white" />
                                    </div>
                                    <div>
                                        <h4 className="text-[11px] font-bold text-white mb-2 uppercase tracking-widest">{metric.title}</h4>
                                        <p className="text-zinc-500 text-sm font-medium leading-relaxed max-w-sm">
                                            {metric.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {codeSnippet && (
                        <Card glass className="p-1">
                            <div className="bg-black rounded-none p-10 border border-zinc-900/50 shadow-2xl overflow-hidden min-h-[400px] flex flex-col justify-center">
                                <div className="font-mono text-[13px] leading-relaxed select-all">
                                    {codeSnippet}
                                </div>
                            </div>
                        </Card>
                    )}
                </div>
            </section>
        </div>
    );
};
