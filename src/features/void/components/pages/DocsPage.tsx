

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { SearchIcon, BookOpenIcon, CubeIcon, CommandLineIcon, PuzzlePieceIcon, ClipboardIcon, CheckIcon, CpuChipIcon } from '../common/Icons';

// --- Reusable Components ---

const CodeBlock: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [copied, setCopied] = useState(false);
    const textToCopy = String(children);

    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy.trim()).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="relative group my-8">
            <pre className="bg-zinc-950 border border-zinc-900 rounded-lg p-6 overflow-x-auto text-[13px] leading-relaxed shadow-xl">
                <code className="font-mono text-zinc-300">{children}</code>
            </pre>
            <button
                onClick={handleCopy}
                className="absolute top-4 right-4 p-2 bg-white text-black rounded hover:bg-zinc-200 transition-all opacity-0 group-hover:opacity-100"
                aria-label="Copy code"
            >
                {copied ? <CheckIcon className="h-4 w-4" /> : <ClipboardIcon className="h-4 w-4" />}
            </button>
        </div>
    );
};

const H2: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => (
    <h2 id={id} className="text-3xl font-bold text-white mt-20 mb-6 pb-4 border-b border-zinc-900 tracking-tighter scroll-mt-24">
        <a href={`#${id}`} className="hover:text-zinc-400 transition-colors uppercase text-sm tracking-widest">{children}</a>
    </h2>
);

const H3: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => (
    <h3 id={id} className="text-xl font-bold text-white mt-12 mb-4 tracking-tight scroll-mt-24">
        <a href={`#${id}`} className="hover:text-zinc-400 transition-colors">{children}</a>
    </h3>
);

// --- Documentation Structure & Content ---

const docStructure = [
    {
        title: 'Core Architecture',
        icon: <BookOpenIcon className="h-4 w-4" />,
        links: [
            { id: 'introduction', title: 'Philosophy' },
            { id: 'first-deployment', title: 'Deployment Loop' },
        ],
    },
    {
        title: 'Primitives',
        icon: <CubeIcon className="h-4 w-4" />,
        links: [
            { id: 'git-integration', title: 'Git Engine' },
            { id: 'edge-network', title: 'The Hyper-Edge' },
            { id: 'serverless-functions', title: 'Logic Primitives' },
            { id: 'storage', title: 'Data Layers' },
        ],
    },
    {
        title: 'Ecosystem',
        icon: <PuzzlePieceIcon className="h-4 w-4" />,
        links: [
            { id: 'nextjs', title: 'Next.js' },
            { id: 'react-vite', title: 'React (Vite)' },
            { id: 'nodejs', title: 'Core Node' },
        ],
    },
    {
        title: 'Infrastructure',
        icon: <CpuChipIcon className="h-4 w-4" />,
        links: [
            { id: 'live-urls', title: 'Dynamic Routing' },
            { id: 'tech-stack', title: 'The Stack' },
        ],
    },
    {
        title: 'Tools',
        icon: <CommandLineIcon className="h-4 w-4" />,
        links: [
            { id: 'cli', title: 'Terminal Interface' },
            { id: 'api', title: 'REST Protocol' },
        ],
    },
];

const DocsContent = () => (
    <div className="prose prose-invert prose-p:text-zinc-500 prose-p:font-medium prose-p:leading-relaxed prose-headings:text-white max-w-none">
        <section id="introduction">
            <h1 className="text-5xl font-bold tracking-tighter text-white mb-10 leading-[0.9]">Documentation</h1>
            <p>opendev-labs is an advanced serverless platform engineered for high-fidelity web systems and autonomous applications. We prioritize speed, sovereign execution, and modular scaling.</p>
            <p className="mt-6">This technical guide outlines the opendev-labs primitives, from the initial deployment loop to advanced global edge routing and logic execution.</p>
        </section>

        <H2 id="first-deployment">The Deployment Loop</H2>
        <p>Architecting on opendev-labs is optimized for a zero-trust, high-velocity cycle.</p>
        <H3 id="step-1-connect">Identify Provider</H3>
        <p>Initialize your node by connecting your VCS provider (GitHub, GitLab). This establishes a secure authentication bridge for your repository fleet.</p>
        <H3 id="step-2-import">Signal Detection</H3>
        <p>Upon repository selection, the opendev-labs engine automatically identifies your runtime logic and optimizes build parameters. No manual configuration is required for standard frameworks.</p>
        <H3 id="step-3-deploy">Propagation</H3>
        <p>Triggering "Deploy" initiates a cluster node that builds and propagates your application to our global edge mesh. Sub-second latency transitions your code from local to global.</p>

        <H2 id="primitives">Primitives</H2>

        <H3 id="git-integration">The Git Engine</H3>
        <p>opendev-labs deeply integrates with your Git workflow. Every commit on the primary branch executes a production deployment. Concurrent branches generate immutable shadow environments with unique preview paths.</p>

        <H3 id="edge-network">The Hyper-Edge</H3>
        <p>Your logic resides on the edge. opendev-labs leverages an ultra-low latency fabric that caches and executes assets closer to the user than traditional cloud providers.</p>

        <H3 id="serverless-functions">Logic Primitives</H3>
        <p>Execute dynamic logic via our serverless primitives. Files in the <code>/api</code> directory are automatically converted into optimized edge functions.</p>
        <CodeBlock>{`// /api/node.js
export default function handler(req, res) {
  res.status(200).json({ status: 'active', system: 'opendev-labs' });
}`}</CodeBlock>

        <H3 id="storage">Data Layers</H3>
        <p>Provision managed storage primitives directly. opendev-labs supports high-performance PostgreSQL and Redis clusters with integrated backups and sub-millisecond access.</p>

        <H2 id="ecosystem">Ecosystem Support</H2>
        <H3 id="nextjs">Next.js</H3>
        <p>First-class integration for Next.js, supporting SSR, ISR, and optimized API routing. Zero configuration necessary.</p>

        <H3 id="react-vite">React (Vite)</H3>
        <p>Optimized for the Vite build engine. Static assets are automatically routed through the global CDN, with dynamic logic handled via <code>/api</code> functions.</p>

        <H3 id="nodejs">Core Node</H3>
        <p>Deploy persistent Node.js APIs by specifying a start script. Managed runtime environments ensure stability and automatic scaling.</p>

        <H2 id="live-urls">Dynamic Routing</H2>
        <p>opendev-labs provides instant, production-grade URLs for every deployment. This is achieved via a sophisticated global routing mesh.</p>
        <H3 id="real-hosting">Infrastructure Specs</H3>
        <p>Our routing fabric relies on three core specifications:</p>
        <ul className="list-disc pl-6 space-y-4">
            <li><strong>Sovereign Nodes:</strong> High-performance compute clusters optimized for sub-atomic task execution.</li>
            <li><strong>Global Mesh DNS:</strong> Wildcard routing (<code>*.opendev.app</code>) that resolves to the nearest available cluster.</li>
            <li><strong>Intelligent Control Plane:</strong> Backend logic that maps deployment hashes to human-readable subdomains.</li>
        </ul>

        <CodeBlock>{`https://your-node.opendev.app`}</CodeBlock>

        <H2 id="tech-stack">The Technical Stack</H2>
        <p>The opendev-labs engineering philosophy focuses on minimal overhead and maximum performance.</p>
        <ul className="list-disc pl-6 space-y-4">
            <li><strong>Edge Fabric:</strong> Global load balancing and asset delivery via specialized edge nodes.</li>
            <li><strong>Logic Runtimes:</strong> Native support for Node.js, Python, Rust, and Go execution environments.</li>
            <li><strong>Secure Primitives:</strong> Automatic TLS rotation, DDoS protection, and secure environment isolation as a platform default.</li>
        </ul>

        <H2 id="reference">Reference Library</H2>
        <H3 id="cli">Terminal Interface (CLI)</H3>
        <p>Manage your infrastructure fleet directly from your local terminal environment.</p>
        <CodeBlock>npm install -g @opendev-labs/cli</CodeBlock>
        <H3 id="common-commands">Core Protocol Commands</H3>
        <ul className="list-disc pl-6 space-y-4">
            <li><code className="bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded">opendev login</code> - Protocol authentication.</li>
            <li><code className="bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded">opendev deploy</code> - Propagate project to edge.</li>
            <li><code className="bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded">opendev env add</code> - Inject environment variables.</li>
        </ul>

        <H3 id="api">REST Protocol (API)</H3>
        <p>Programmatic access to the opendev-labs control plane via a secured REST API.</p>
        <CodeBlock>{`curl "https://api.opendev.app/v1/nodes" \\
  -H "Authorization: Bearer [TOKEN]"`}</CodeBlock>

    </div>
);


export const DocsPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeSection, setActiveSection] = useState('introduction');
    const contentRef = useRef<HTMLDivElement>(null);

    const filteredDocStructure = useMemo(() => {
        if (!searchTerm.trim()) return docStructure;

        const lowercasedFilter = searchTerm.toLowerCase();

        return docStructure.map(section => ({
            ...section,
            links: section.links.filter(link => link.title.toLowerCase().includes(lowercasedFilter))
        })).filter(section => section.links.length > 0);

    }, [searchTerm]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { rootMargin: '-20% 0px -80% 0px', threshold: 0 }
        );

        const sections = contentRef.current?.querySelectorAll('h2, h3');
        sections?.forEach(section => observer.observe(section));

        return () => sections?.forEach(section => observer.unobserve(section));
    }, []);

    const handleAnchorClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement;
        const anchor = target.closest('a');

        if (anchor && anchor.getAttribute('href')?.startsWith('#')) {
            e.preventDefault();
            const href = anchor.getAttribute('href');
            if (!href) return;

            const id = href.substring(1);
            const element = document.getElementById(id);

            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };

    return (
        <div className="max-w-[1400px] mx-auto pt-10" onClick={handleAnchorClick}>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-16 px-6">
                <aside className="lg:col-span-1 lg:sticky lg:top-32 self-start hidden lg:block">
                    <div className="relative mb-10">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <SearchIcon className="text-zinc-500 w-4 h-4" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search library..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-black border border-zinc-900 h-10 pl-10 pr-4 text-xs font-bold tracking-widest uppercase text-white focus:outline-none focus:ring-1 focus:ring-white transition-all rounded-md placeholder:text-zinc-700"
                        />
                    </div>
                    <nav className="space-y-10">
                        {filteredDocStructure.map((section, index) => (
                            <div key={index}>
                                <h4 className="flex items-center gap-2 text-[10px] font-bold tracking-[0.3em] text-zinc-600 mb-6 uppercase">
                                    {section.title}
                                </h4>
                                <ul className="space-y-3">
                                    {section.links.map(link => (
                                        <li key={link.id}>
                                            <a
                                                href={`#${link.id}`}
                                                className={`block text-xs font-medium transition-all ${activeSection === link.id
                                                        ? 'text-white translate-x-1'
                                                        : 'text-zinc-500 hover:text-white'
                                                    }`}
                                            >
                                                {link.title}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </nav>
                </aside>

                <main ref={contentRef} className="lg:col-span-3 pb-32">
                    <DocsContent />
                </main>
            </div>
        </div>
    );
};

