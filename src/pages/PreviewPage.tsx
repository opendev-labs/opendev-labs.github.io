import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code2, Globe, Layout, Sparkles, ExternalLink, ChevronRight } from 'lucide-react';

const TEMPLATES = [
    {
        id: 'react-vite',
        name: 'React + Vite',
        category: 'Web App',
        icon: Code2,
        sandboxUrl: 'https://codesandbox.io/p/devbox/react-vite-template-forked-xyz123',
        previewUrl: 'https://codesandbox.io/embed/new?template=react-ts',
        description: 'Start a React project with TypeScript and Vite.',
        color: '#61DAFB',
    },
    {
        id: 'vue-vite',
        name: 'Vue + Vite',
        category: 'Web App',
        icon: Layout,
        sandboxUrl: 'https://codesandbox.io/p/devbox/vue-vite-template',
        previewUrl: 'https://codesandbox.io/embed/new?template=vue-ts',
        description: 'Build with Vue 3 and TypeScript.',
        color: '#42B883',
    },
    {
        id: 'vanilla-js',
        name: 'Vanilla JS',
        category: 'Website',
        icon: Globe,
        sandboxUrl: 'https://codesandbox.io/p/devbox/vanilla-js-template',
        previewUrl: 'https://codesandbox.io/embed/new?template=vanilla-ts',
        description: 'Simple HTML, CSS, and JavaScript project.',
        color: '#F7DF1E',
    },
    {
        id: 'nextjs',
        name: 'Next.js',
        category: 'Full Stack',
        icon: Sparkles,
        sandboxUrl: 'https://codesandbox.io/p/devbox/nextjs-template',
        previewUrl: 'https://codesandbox.io/embed/new?template=nextjs',
        description: 'Full-stack React with server-side rendering.',
        color: '#FFFFFF',
    },
];

export default function PreviewPage() {
    const [activeTemplate, setActiveTemplate] = useState(TEMPLATES[0]);

    return (
        <div className="min-h-screen bg-black text-white pt-20 pb-16">
            {/* Header */}
            <div className="max-w-[1400px] mx-auto px-6 mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                >
                    <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-none bg-blue-500/5 border border-blue-500/20 text-[10px] font-bold text-blue-400 mb-6 uppercase tracking-[0.4em]">
                        <Sparkles size={12} />
                        <span>Live Preview</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tighter lowercase mb-4">
                        Try it <span className="text-zinc-600 italic">live.</span>
                    </h1>
                    <p className="text-zinc-500 text-sm font-bold uppercase tracking-[0.2em] max-w-lg">
                        Pick a template below and start coding right in your browser. No setup needed.
                    </p>
                </motion.div>

                {/* Template Selector */}
                <div className="flex flex-wrap gap-3 mt-10">
                    {TEMPLATES.map((tmpl) => (
                        <motion.button
                            key={tmpl.id}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setActiveTemplate(tmpl)}
                            className={`group flex items-center gap-3 px-5 py-3 border rounded-none text-left transition-all duration-300 ${
                                activeTemplate.id === tmpl.id
                                    ? 'bg-zinc-900 border-zinc-600 text-white'
                                    : 'bg-black border-zinc-900 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
                            }`}
                        >
                            <div
                                className="w-8 h-8 rounded-none border border-zinc-800 flex items-center justify-center"
                                style={{
                                    borderColor: activeTemplate.id === tmpl.id ? tmpl.color + '40' : undefined,
                                }}
                            >
                                <tmpl.icon size={16} style={{ color: activeTemplate.id === tmpl.id ? tmpl.color : undefined }} />
                            </div>
                            <div>
                                <div className="text-xs font-bold uppercase tracking-widest">{tmpl.name}</div>
                                <div className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">{tmpl.category}</div>
                            </div>
                            {activeTemplate.id === tmpl.id && (
                                <ChevronRight size={14} className="ml-2 text-zinc-500" />
                            )}
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Live Preview Embed */}
            <div className="max-w-[1400px] mx-auto px-6">
                <motion.div
                    key={activeTemplate.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full border border-zinc-900 rounded-none overflow-hidden bg-zinc-950"
                >
                    {/* Preview Bar */}
                    <div className="flex items-center justify-between px-6 py-3 bg-zinc-950 border-b border-zinc-900">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-none bg-zinc-800" />
                                <div className="w-2.5 h-2.5 rounded-none bg-zinc-800" />
                                <div className="w-2.5 h-2.5 rounded-none bg-zinc-800" />
                            </div>
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                {activeTemplate.name} — {activeTemplate.description}
                            </span>
                        </div>
                        <a
                            href={activeTemplate.previewUrl.replace('/embed/', '/s/')}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest transition-colors"
                        >
                            Open Full Editor <ExternalLink size={12} />
                        </a>
                    </div>

                    {/* Iframe */}
                    <iframe
                        src={activeTemplate.previewUrl}
                        className="w-full border-0"
                        style={{ height: '70vh' }}
                        title={`${activeTemplate.name} Preview`}
                        allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
                        sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
                    />
                </motion.div>
            </div>
        </div>
    );
}
