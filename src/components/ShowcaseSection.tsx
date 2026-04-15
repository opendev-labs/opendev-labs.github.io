import React from 'react';
import { WormholeHero } from './WormholeHero';
import { ExternalLink, Code2, Layout, Sparkles } from 'lucide-react';
import TemplateWebsite from '../assets/template-website.png';
import TemplateLanding from '../assets/template-landing.png';

interface ShowcaseItemProps {
    title: string;
    category: string;
    description: string;
    children: React.ReactNode;
    icon: any;
    previewLink?: string;
}

const ShowcaseItem = ({ title, category, description, children, icon: Icon, previewLink }: ShowcaseItemProps) => (
    <div className="group flex flex-col h-full bg-zinc-950/50 border border-zinc-800/60 rounded-lg overflow-hidden hover:border-zinc-700 transition-all duration-300">
        <div className="relative aspect-video overflow-hidden border-b border-zinc-800/60">
            {children}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <button
                    onClick={() => {
                        if (previewLink) {
                            window.open(previewLink, '_blank', 'noopener,noreferrer');
                        }
                    }}
                    className="px-4 py-2 text-[13px] font-medium bg-white text-black rounded-md hover:bg-zinc-200 transition-colors flex items-center gap-2"
                >
                    <ExternalLink size={14} /> View Project
                </button>
            </div>
        </div>
        <div className="p-6 flex-1 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
                <Icon size={14} className="text-zinc-500" />
                <span className="text-[12px] text-zinc-500">{category}</span>
            </div>
            <h3 className="text-[16px] font-semibold text-white mb-2 tracking-tight">{title}</h3>
            <p className="text-[13px] text-zinc-500 leading-relaxed">{description}</p>
        </div>
    </div>
);

export const ShowcaseSection = () => {
    return (
        <section className="py-24 md:py-32 border-t border-zinc-900">
            <div className="max-w-[1100px] mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
                        Built with OpenStudio
                    </h2>
                    <p className="text-[15px] text-zinc-500 max-w-lg mx-auto">
                        Examples of projects generated and deployed using our platform.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <ShowcaseItem
                        title="3D Wormhole"
                        category="3D Design"
                        description="Interactive Three.js wormhole effect with mouse tracking."
                        icon={Code2}
                        previewLink="https://opendev-labs.github.io/preview"
                    >
                        <div className="absolute inset-0 bg-zinc-950">
                            <WormholeHero className="absolute inset-0" />
                        </div>
                    </ShowcaseItem>

                    <ShowcaseItem
                        title="Business Dashboard"
                        category="Web App"
                        description="Clean analytics dashboard with charts and data tables."
                        icon={Layout}
                        previewLink="https://opendev-labs.github.io/preview"
                    >
                        <img src={TemplateWebsite} alt="Dashboard" className="w-full h-full object-cover" />
                    </ShowcaseItem>

                    <ShowcaseItem
                        title="AI Landing Page"
                        category="Website"
                        description="Modern marketing page for AI products with gradient design."
                        icon={Sparkles}
                        previewLink="https://opendev-labs.github.io/preview"
                    >
                        <img src={TemplateLanding} alt="Landing Page" className="w-full h-full object-cover" />
                    </ShowcaseItem>
                </div>
            </div>
        </section>
    );
};
