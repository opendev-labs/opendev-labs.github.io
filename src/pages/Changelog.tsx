import React from 'react';

const ChangelogEvent: React.FC<{ version: string; date: string; title: string; children: React.ReactNode }> = ({ version, date, title, children }) => (
    <div className="relative pl-8 pb-12 last:pb-0 border-l border-zinc-900 ml-4">
        <div className="absolute left-[-5px] top-0 w-[10px] h-[10px] bg-white rounded-full ring-4 ring-black" />
        <div className="flex flex-col gap-1 mb-4">
            <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-white bg-zinc-900 px-2 py-0.5 rounded uppercase tracking-widest">{version}</span>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{date}</span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
        </div>
        <div className="text-sm text-zinc-400 font-medium leading-relaxed space-y-4">
            {children}
        </div>
    </div>
);

export default function Changelog() {
    return (
        <div className="bg-black min-h-screen pt-32 pb-20 px-6 selection:bg-white selection:text-black">
            <div className="max-w-3xl mx-auto">
                <div className="mb-20">
                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tighter mb-4 italic font-serif">Changelog</h1>
                    <p className="text-lg text-zinc-500 font-medium tracking-tight">Tracking the evolution of the opendev-labs ecosystem.</p>
                </div>

                <div className="space-y-0">
                    <ChangelogEvent version="v2.1.0" date="January 27, 2026" title="Ecosystem Synchronization & SyncStack Integration">
                        <p>Unified all product nodes under the opendev-labs flagship identity. This release brings our distributed synchronization protocol online.</p>
                        <ul className="list-disc pl-5 space-y-2 text-zinc-500">
                            <li>Integrated <strong>SyncStack</strong> as a core product in the main navigation.</li>
                            <li>Launched the high-fidelity SyncStack product showcase page.</li>
                            <li>Synchronized all product repositories (LamaDB, QCloud, SyncStack, Void) to GitHub.</li>
                            <li>Purged legacy branding and "Void" identity from all system manifests.</li>
                        </ul>
                    </ChangelogEvent>

                    <ChangelogEvent version="v2.0.0" date="January 26, 2026" title="The Nexus Transformation">
                        <p>A complete structural overhaul of the platform's visual and routing architecture.</p>
                        <ul className="list-disc pl-5 space-y-2 text-zinc-500">
                            <li>Full design migration to Vercel-inspired high-contrast aesthetics.</li>
                            <li>Eliminated hash-based navigation in favor of standard URL protocols.</li>
                            <li>Redesigned IDE dashboard with high-fidelity telemetry and observability views.</li>
                            <li>Enabled universal dark mode with zinc-zinc-800 accents.</li>
                        </ul>
                    </ChangelogEvent>

                    <ChangelogEvent version="v1.5.0" date="January 25, 2026" title="Distributed Primitives">
                        <p>Initial release of LamaDB and QCloud infrastructure modules.</p>
                        <ul className="list-disc pl-5 space-y-2 text-zinc-500">
                            <li>Deployed <strong>LamaDB</strong>: Native browser storage registry.</li>
                            <li>Deployed <strong>QCloud</strong>: Quantum-ready logic fabric.</li>
                            <li>Implemented GitHub OAuth authentication flow.</li>
                        </ul>
                    </ChangelogEvent>
                </div>
            </div>
        </div>
    );
}
