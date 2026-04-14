import React from 'react';
import { motion } from 'framer-motion';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { WormholeHero } from './WormholeHero';
import { ExternalLink, Code2, Layout, Sparkles } from 'lucide-react';
import TemplateWebsite from '../assets/template-website.png';
import TemplateLanding from '../assets/template-landing.png';

const ShowcaseItem = ({ title, category, description, children, icon: Icon }: any) => (
    <Card hover glass className="group flex flex-col h-full bg-zinc-950/20 border-zinc-900/50">
        <div className="relative aspect-video overflow-hidden border-b border-zinc-900/50">
            {children}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-[2px]">
                <Button variant="secondary" size="sm" className="gap-2">
                    <ExternalLink size={14} /> View Project
                </Button>
            </div>
        </div>
        <div className="p-8 flex-1 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-zinc-900 border border-zinc-800 rounded-none">
                    <Icon size={16} className="text-zinc-400 group-hover:text-white transition-colors" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500 group-hover:text-zinc-300 transition-colors">
                    {category}
                </span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3 tracking-tight group-hover:text-blue-400 transition-colors uppercase italic">{title}</h3>
            <p className="text-zinc-500 text-xs font-medium leading-relaxed uppercase tracking-wider mb-8">
                {description}
            </p>
            <div className="mt-auto flex items-center gap-4 pt-6 border-t border-zinc-900/50">
                <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="w-6 h-6 rounded-none border border-black bg-zinc-800 flex items-center justify-center text-[8px] font-bold text-zinc-500">
                            A{i}
                        </div>
                    ))}
                </div>
                <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Built with OpenStudio v11</span>
            </div>
        </div>
    </Card>
);

export const ShowcaseSection = () => {
    return (
        <section className="py-32 relative bg-black overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-[0.03] pointer-events-none">
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at center, #3b82f6 0%, transparent 70%)' }} />
            </div>

            <div className="max-w-[1400px] mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
                    <div className="max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-3 px-4 py-1.5 rounded-none bg-blue-500/5 border border-blue-500/20 text-[10px] font-bold text-blue-400 mb-8 uppercase tracking-[0.4em]"
                        >
                            <Sparkles size={12} />
                            <span>What you can build</span>
                        </motion.div>
                        <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter leading-[0.9] lowercase mb-8">
                            Made with <br /><span className="text-zinc-700 italic">open-studio.</span>
                        </h2>
                        <p className="text-zinc-500 text-sm font-bold uppercase tracking-[0.2em] max-w-lg leading-relaxed opacity-60">
                            Here are some examples of high-quality projects made using our tools.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <ShowcaseItem
                        title="3D Wormhole"
                        category="3D Design"
                        description="A beautiful 3D wormhole that you can move with your mouse."
                        icon={Code2}
                    >
                        <div className="absolute inset-0 bg-zinc-950">
                           <WormholeHero className="absolute inset-0" />
                        </div>
                    </ShowcaseItem>

                    <ShowcaseItem
                        title="Business Dashboard"
                        category="Web App"
                        description="A professional and clean dashboard for your business data."
                        icon={Layout}
                    >
                        <img src={TemplateWebsite} alt="Website Template" className="w-full h-full object-cover" />
                    </ShowcaseItem>

                    <ShowcaseItem
                        title="AI Landing Page"
                        category="Website"
                        description="A high-quality website to show your AI products to the world."
                        icon={Sparkles}
                    >
                        <img src={TemplateLanding} alt="Landing Page Template" className="w-full h-full object-cover" />
                    </ShowcaseItem>
                </div>

                <div className="mt-20 pt-20 border-t border-zinc-900/50 flex flex-col items-center">
                    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.6em] mb-10">
                        Ready to start building?
                    </p>
                    <Button variant="primary" size="xl" className="group">
                        Start Building
                        <ExternalLink size={16} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </Button>
                </div>
            </div>
        </section>
    );
};
