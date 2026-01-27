

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
        <div className="relative group my-4">
            <pre className="bg-void-line border border-zinc-700 rounded-md p-4 overflow-x-auto text-sm">
                <code className="font-mono text-zinc-300">{children}</code>
            </pre>
            <button
                onClick={handleCopy}
                className="absolute top-2 right-2 p-1.5 bg-zinc-700/50 text-zinc-400 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Copy code"
            >
                {copied ? <CheckIcon className="h-4 w-4 text-green-400" /> : <ClipboardIcon className="h-4 w-4" />}
            </button>
        </div>
    );
};

const H2: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => (
    <h2 id={id} className="text-2xl font-bold text-void-neon neon-text mt-12 mb-4 pb-2 border-b border-void-line scroll-mt-24">
        <a href={`#${id}`} className="hover:underline">{children}</a>
    </h2>
);

const H3: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => (
    <h3 id={id} className="text-xl font-semibold text-white mt-8 mb-3 scroll-mt-24">
         <a href={`#${id}`} className="hover:underline">{children}</a>
    </h3>
);

// --- Documentation Structure & Content ---

const docStructure = [
    {
        title: 'Getting Started',
        icon: <BookOpenIcon className="h-4 w-4" />,
        links: [
            { id: 'introduction', title: 'Introduction' },
            { id: 'first-deployment', title: 'Your First Deployment' },
        ],
    },
    {
        title: 'Core Concepts',
        icon: <CubeIcon className="h-4 w-4" />,
        links: [
            { id: 'git-integration', title: 'Git Integration' },
            { id: 'edge-network', title: 'The Edge Network' },
            { id: 'serverless-functions', title: 'Serverless Functions' },
            { id: 'storage', title: 'Storage' },
        ],
    },
    {
        title: 'Frameworks',
        icon: <PuzzlePieceIcon className="h-4 w-4" />,
        links: [
            { id: 'nextjs', title: 'Next.js' },
            { id: 'react-vite', title: 'React (Vite)' },
            { id: 'nodejs', title: 'Node.js' },
        ],
    },
    {
        title: 'Platform Architecture',
        icon: <CpuChipIcon className="h-4 w-4" />,
        links: [
            { id: 'live-urls', title: 'How Live URLs Work' },
            { id: 'tech-stack', title: 'Core Tech Stack' },
        ],
    },
    {
        title: 'Reference',
        icon: <CommandLineIcon className="h-4 w-4" />,
        links: [
            { id: 'cli', title: 'CLI Reference' },
            { id: 'api', title: 'API Reference' },
        ],
    },
];

const DocsContent = () => (
    <article className="prose prose-invert prose-p:text-zinc-300 prose-headings:text-white max-w-none">
        <section id="introduction">
            <p>Welcome to the Void documentation. Void is a next-generation serverless platform designed to provide developers with the fastest, most efficient workflow for building and deploying web applications. Our goal is to eliminate infrastructure management so you can focus entirely on your code.</p>
            <p className="mt-4">This documentation will guide you through the core concepts of the Void platform, from your first deployment to advanced features like serverless functions, managed storage, and our global edge network.</p>
        </section>

        <H2 id="first-deployment">Your First Deployment</H2>
        <p>Deploying your first project on Void is a simple, three-step process that takes only a few minutes.</p>
        <H3 id="step-1-connect">Step 1: Connect Your Git Provider</H3>
        <p>Navigate to the "New Project" page. You'll be prompted to connect your GitHub, GitLab, or Bitbucket account. This grants Void permission to access your repositories.</p>
        <H3 id="step-2-import">Step 2: Import a Repository</H3>
        <p>Once connected, you can select the repository you wish to deploy. Void automatically detects your framework and configures the build settings. For most projects, no extra configuration is needed.</p>
        <H3 id="step-3-deploy">Step 3: Deploy</H3>
        <p>After importing, simply click "Deploy". Void will clone your repository, install dependencies, run your build command, and deploy the output to our global edge network. Your site will be live in seconds.</p>

        <H2 id="core-concepts">Core Concepts</H2>
        
        <H3 id="git-integration">Git Integration</H3>
        <p>Void is built around a Git-based workflow. Every push to your production branch (e.g., `main`) triggers a new deployment automatically. Pushes to other branches and pull requests generate unique Preview Deployments, allowing you to test changes in a production-like environment before merging.</p>

        <H3 id="edge-network">The Edge Network</H3>
        <p>Your deployments are distributed across our global edge network. This means your site's static assets are cached in dozens of locations worldwide, ensuring the fastest possible load times for your users, no matter where they are.</p>

        <H3 id="serverless-functions">Serverless Functions</H3>
        <p>Add dynamic functionality to your static sites with serverless functions. Simply create a file in your project's `/api` directory, and Void will automatically deploy it as a serverless function. We support Node.js, Python, and Go runtimes.</p>
        <CodeBlock>{`// /api/hello.js
export default function handler(req, res) {
  res.status(200).json({ message: 'Hello from the Void!' });
}`}</CodeBlock>

        <H3 id="storage">Storage</H3>
        <p>Easily provision managed PostgreSQL or Redis databases for your projects directly from the Void dashboard. We handle the maintenance, backups, and scaling, so you can focus on building your application.</p>
        
        <H2 id="frameworks">Framework Guides</H2>
        <H3 id="nextjs">Next.js</H3>
        <p>Void has first-class support for Next.js, including Hybrid rendering, Server-Side Rendering (SSR), Incremental Static Regeneration (ISR), and API Routes. No configuration is necessary; just import your Next.js project and deploy.</p>
        
        <H3 id="react-vite">React (Vite)</H3>
        <p>Vite projects are automatically detected. Void will use your `build` script to generate static assets and deploy them to the edge network. For dynamic functionality, add Serverless Functions to your project's `/api` directory.</p>
        
        <H3 id="nodejs">Node.js</H3>
        <p>Deploy Node.js APIs by ensuring your `package.json` has a `start` script. Void will install dependencies and run your server in a managed serverless environment.</p>

        <H2 id="live-urls">How Live URLs Work</H2>
        <p>You want <strong>Void</strong> to behave like <strong>Vercel</strong>, where users deploy a project and instantly get a real, shareable URL. Right now, the platform simulates this, but to make it a reality, Void needs a real hosting infrastructure.</p>
        <H3 id="real-hosting">1. A Real Hosting Infrastructure</H3>
        <p>Vercel works because it owns the <code>vercel.app</code> domain, dynamically generates subdomains (e.g., <code>project.vercel.app</code>) via its backend, and integrates CI/CD pipelines. For Void, the requirements are similar:</p>
        <ul className="list-disc pl-6 space-y-2">
            <li><strong>Domain:</strong> A registered domain (e.g., <code>void.app</code>).</li>
            <li><strong>Wildcard DNS:</strong> A DNS record like <code>*.void.app</code> pointing to the hosting server.</li>
            <li><strong>Backend Service:</strong> A service (e.g., Node.js, FastAPI) to manage projects and map them to subdomains.</li>
        </ul>
        <H3 id="url-generation">2. How URLs are Generated</H3>
        <p>When you deploy a project on a modern platform like Vercel, the following happens:</p>
        <ol className="list-decimal pl-6 space-y-2">
            <li>Files are uploaded to object storage (like AWS S3) or a proprietary edge network.</li>
            <li>The deployment is mapped to its subdomain (e.g., <code>project.vercel.app</code>) using DNS and a reverse proxy (like Nginx or Cloudflare Workers).</li>
            <li>The site is served instantly from a CDN edge location close to the user.</li>
        </ol>
        <H3 id="building-void">3. A Minimal Approach for Void</H3>
        <p>We can achieve this using a free service like Cloudflare Pages or Netlify. The process would be:</p>
        <ul className="list-disc pl-6 space-y-2">
            <li>Point the wildcard DNS record (<code>*.void.app</code>) to Cloudflare Pages.</li>
            <li>Each new deployment would automatically be served on a new subdomain. For example, deploying a project named <code>landing-page</code> would make it available at:</li>
        </ul>
        <CodeBlock>{`https://landing-page.void.app`}</CodeBlock>

        <H3 id="architecture-diagram">4. High-Level Architecture</H3>
        <p>The flow would look like this:</p>
        <CodeBlock>{`User Uploads Project → Void Backend → Store Files → Deploy to CDN
                             ↓
          DNS / Wildcard Subdomain Config for void.app
                             ↓
     Project Available at https://project.void.app`}</CodeBlock>
        
        <H2 id="tech-stack">Core Tech Stack</H2>
        <p>Void is built on a minimal but powerful set of technologies to ensure speed, reliability, and an excellent developer experience. Our philosophy is to use best-in-class, open-source tools that are both modern and battle-tested. The core principles of our stack include:</p>
        <ul className="list-disc pl-6 space-y-2">
            <li><strong>Lightweight Backend:</strong> Utilizing FastAPI or Node.js for backend APIs, but only when necessary. We emphasize a static-first approach.</li>
            <li><strong>Instant Deployments:</strong> A lightweight CI/CD pipeline powered by GitHub Actions enables near-instantaneous deployments on every push.</li>
            <li><strong>Serverless Compute:</strong> Optional serverless functions are available for running backend tasks without managing servers.</li>
            <li><strong>Optimized Delivery:</strong> Static content is served via a CDN-like architecture to guarantee the fastest possible delivery to users worldwide.</li>
            <li><strong>Simplified Databases:</strong> Future plans include simple, direct integrations with modern database providers like Supabase and SQLite.</li>
        </ul>

        <H2 id="reference">Reference</H2>
        <H3 id="cli">CLI Reference</H3>
        <p>The Void CLI allows you to manage your projects from the terminal.</p>
        <p><strong>Installation:</strong></p>
        <CodeBlock>npm install -g void-cli</CodeBlock>
        <p><strong>Common Commands:</strong></p>
        <ul className="list-disc pl-6 space-y-2">
            <li><code className="bg-void-line p-1">void login</code> - Authenticate with your Void account.</li>
            <li><code className="bg-void-line p-1">void deploy</code> - Deploy the current directory.</li>
            <li><code className="bg-void-line p-1">void logs [project-name] --follow</code> - View real-time logs for a project.</li>
            <li><code className="bg-void-line p-1">void env add SECRET_KEY my-secret-value</code> - Add an environment variable.</li>
        </ul>

        <H3 id="api">API Reference</H3>
        <p>Our REST API provides programmatic access to your projects, deployments, and domains. Generate an API token from your account settings to get started.</p>
        <p><strong>Example: List Projects</strong></p>
        <CodeBlock>{`curl "https://api.void.app/v1/projects" \\
  -H "Authorization: Bearer YOUR_API_TOKEN"`}</CodeBlock>

    </article>
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
        <div className="max-w-7xl mx-auto" onClick={handleAnchorClick}>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                <aside className="lg:col-span-1 lg:sticky lg:top-20 self-start">
                    <div className="relative mb-4">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <SearchIcon />
                        </div>
                        <input
                            type="text"
                            placeholder="Search docs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-void-card border border-void-line py-2 pl-9 pr-3 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-void-neon"
                        />
                    </div>
                    <nav className="space-y-4">
                        {filteredDocStructure.map((section, index) => (
                            <div key={index}>
                                <h4 className="flex items-center gap-2 text-sm font-semibold text-zinc-400 mb-2">
                                    {section.icon}
                                    {section.title}
                                </h4>
                                <ul className="space-y-1 border-l border-void-line">
                                    {section.links.map(link => (
                                         <li key={link.id}>
                                            <a 
                                                href={`#${link.id}`}
                                                className={`block border-l-2 pl-3 py-1 text-sm transition-colors ${
                                                    activeSection === link.id
                                                    ? 'border-void-neon text-void-neon'
                                                    : 'border-transparent text-zinc-300 hover:text-white'
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

                <main ref={contentRef} className="lg:col-span-3">
                    <DocsContent />
                </main>
            </div>
        </div>
    );
};
