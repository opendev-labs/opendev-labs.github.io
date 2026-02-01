

import type { Project, Deployment, Domain, Template, GitProvider, Repository, AnalyticsData, ServerlessFunction, TeamMember, ActivityEvent, UsageMetrics, Database, Integration, FileSystemNode, Workflow, ModelConfig } from './types';
import { DeploymentStatus, LogLevel, FunctionStatus, TeamMemberRole, DatabaseType, DatabaseStatus } from './types';

export const mockDeployments: Deployment[] = [
  {
    id: 'dpl_1',
    commit: 'a1b2c3d - protocol: Synchronize node authentication',
    branch: 'main',
    timestamp: '2024-07-21T10:30:00Z',
    status: DeploymentStatus.DEPLOYED,
    url: '/void/deploy/pulse-v2-api',
  },
  {
    id: 'dpl_2',
    commit: 'e4f5g6h - patch: Neural mesh connection stability',
    branch: 'hotfix/nexus-mesh',
    timestamp: '2024-07-20T15:00:00Z',
    status: DeploymentStatus.ERROR,
    url: 'https://pulse-v2-api-e4f5g6h.void.app',
  },
  {
    id: 'dpl_3',
    commit: 'i7j8k9l - update: Fleet dependency manifests',
    branch: 'ops/node-update',
    timestamp: '2024-07-19T09:00:00Z',
    status: DeploymentStatus.CANCELED,
    url: 'https://pulse-v2-api-i7j8k9l.void.app',
  },
];

// --- Mock data for new features ---

export const mockAnalyticsData: AnalyticsData = {
  dailyVisitors: [
    { day: '7d ago', visitors: 120 },
    { day: '6d ago', visitors: 150 },
    { day: '5d ago', visitors: 180 },
    { day: '4d ago', visitors: 210 },
    { day: '3d ago', visitors: 250 },
    { day: '2d ago', visitors: 230 },
    { day: 'Yesterday', visitors: 280 },
  ],
  totalPageViews: 25670,
  avgLoadTime: 450,
  webVitals: { lcp: 1.8, fid: 25, cls: 0.05 },
};

export const mockServerlessFunctions: ServerlessFunction[] = [
  { id: 'fn_1', name: 'getUser', path: '/api/user', status: FunctionStatus.ACTIVE, region: 'us-east-1 (CLE)', invocations: 12500 },
  { id: 'fn_2', name: 'postMessage', path: '/api/message', status: FunctionStatus.ACTIVE, region: 'us-east-1 (CLE)', invocations: 8750 },
  { id: 'fn_3', name: 'cronJob', path: '/api/cron', status: FunctionStatus.IDLE, region: 'us-west-1 (SFO)', invocations: 120 },
  { id: 'fn_4', name: 'legacyApi', path: '/api/legacy', status: FunctionStatus.ERROR, region: 'eu-central-1 (FRA)', invocations: 50 },
];

export const mockTeamMembers: TeamMember[] = [
  { id: 'user_1', name: 'You', email: 'you@void.app', role: TeamMemberRole.OWNER, avatarUrl: 'https://placehold.co/40x40/000000/FFFFFF/png?text=OP' },
  { id: 'user_2', name: 'Jane Doe', email: 'jane.doe@void.app', role: TeamMemberRole.MEMBER, avatarUrl: 'https://placehold.co/40x40/000000/FFFFFF/png?text=JD' },
];

export const mockActivityLog: ActivityEvent[] = [
  { id: 'act_1', type: 'Deployment', description: 'Launched node a1b2c3d to production fleet', actor: 'You', timestamp: '2024-07-21T10:30:00Z' },
  { id: 'act_6', type: 'Integration', description: 'Initialized Sentry protocol bridge', actor: 'You', timestamp: '2024-07-21T09:48:00Z' },
  { id: 'act_5', type: 'Storage', description: 'Created PostgreSQL compute node "pulse-db"', actor: 'You', timestamp: '2024-07-21T09:45:00Z' },
  { id: 'act_2', type: 'Domain', description: 'Bound domain pulse-api.void.app', actor: 'You', timestamp: '2024-07-21T09:15:00Z' },
  { id: 'act_3', type: 'Settings', description: 'Updated SECURE_SECRET_KEY protocol variable', actor: 'Jane Doe', timestamp: '2024-07-20T18:00:00Z' },
  { id: 'act_4', type: 'Deployment', description: 'Node launch e4f5g6h aborted', actor: 'You', timestamp: '2024-07-20T15:00:00Z' },
];


export const mockDatabases: Database[] = [
  { id: 'db_1', name: 'pulse-db', type: DatabaseType.POSTGRES, region: 'us-east-1 (CLE)', status: DatabaseStatus.ACTIVE, version: '14.8' },
  { id: 'db_2', name: 'cache-instance', type: DatabaseType.REDIS, region: 'us-east-1 (CLE)', status: DatabaseStatus.ACTIVE, version: '7.2' },
];

export const availableIntegrations: Omit<Integration, 'isConnected'>[] = [
  { id: 'int_lamadb', name: 'LamaDB', description: 'Enterprise-grade, real-time database protocol with offline-first synchronization.', category: 'Database', logoUrl: '/syncstack-logo.svg' },
  { id: 'int_supabase', name: 'Supabase', description: 'The open source Firebase alternative. Build in a weekend, scale to millions.', category: 'Database', logoUrl: 'https://skillicons.dev/icons?i=supabase' },
  { id: 'int_neon', name: 'Neon', description: 'Serverless PostgreSQL with a free tier. High performance, zero management.', category: 'Database', logoUrl: 'https://neon.tech/favicon/favicon-32x32.png' },
  { id: 'int_mongodb', name: 'MongoDB Atlas', description: 'Multi-cloud developer data platform with flexible document schema.', category: 'Database', logoUrl: 'https://skillicons.dev/icons?i=mongodb' },
  { id: 'int_upstash', name: 'Upstash', description: 'Serverless Redis, Kafka and QStash for developers.', category: 'Database', logoUrl: 'https://upstash.com/favicon.png' },
  { id: 'int_sentry', name: 'Sentry', description: 'Real-time error tracking and performance monitoring.', category: 'Monitoring', logoUrl: 'https://raw.githubusercontent.com/getsentry/sentry-art/master/sentry-glyph-black.svg' },
  { id: 'int_logdna', name: 'LogDNA', description: 'Centralized log management and analysis.', category: 'Logging', logoUrl: 'https://www.mezmo.com/wp-content/uploads/2022/01/mezmo-logo-1.svg' },
  { id: 'int_clerk', name: 'Clerk', description: 'Complete user management for your apps.', category: 'Auth', logoUrl: 'https://clerk.com/favicon/favicon-32x32.png' },
  { id: 'int_shopify', name: 'Shopify', description: 'Power your storefront with Shopify\'s backend.', category: 'Commerce', logoUrl: 'https://cdn.worldvectorlogo.com/logos/shopify.svg' },
];

export const mockConnectedIntegrations: Integration[] = [
  { ...availableIntegrations[0], isConnected: true }, // Sentry
];


export const mockUsageData: UsageMetrics = {
  bandwidth: { used: 68.5, total: 100, unit: 'GB' },
  buildMinutes: { used: 275, total: 500, unit: 'minutes' },
  functionInvocations: { used: 850000, total: 1000000, unit: '' },
  storage: { used: 12.3, total: 20, unit: 'GB' },
};


export const mockProjects: Project[] = [];


export const buildLogs = [
  { level: LogLevel.SYSTEM, message: 'Build environment initiated.' },
  { level: LogLevel.SYSTEM, message: 'Cloning repository from GitHub...' },
  { level: LogLevel.INFO, message: 'Repository cloned successfully.' },
  { level: LogLevel.INFO, message: 'Installing dependencies with npm...' },
  { level: LogLevel.DEBUG, message: 'npm WARN deprecated babel-eslint@10.1.0' },
  { level: LogLevel.INFO, message: 'Found 287 vulnerabilities (1 low, 286 moderate)' },
  { level: LogLevel.SYSTEM, message: 'Running build command: `npm run build`' },
  { level: LogLevel.INFO, message: '> building...' },
  { level: LogLevel.INFO, message: '> vite v5.3.1 building for production...' },
  { level: LogLevel.INFO, message: '✓ 52 modules transformed.' },
  { level: LogLevel.ERROR, message: 'Error: Module not found: Can\'t resolve \'./utils/helpers\'' },
  { level: LogLevel.SYSTEM, message: 'Build failed. See logs for details.' },
];

export const successBuildLogs = [
  { level: LogLevel.SYSTEM, message: 'Build environment initiated.' },
  { level: LogLevel.SYSTEM, message: 'Cloning repository from GitHub...' },
  { level: LogLevel.INFO, message: 'Repository cloned successfully.' },
  { level: LogLevel.INFO, message: 'Installing dependencies...' },
  { level: LogLevel.DEBUG, message: 'All dependencies installed.' },
  { level: LogLevel.SYSTEM, message: 'Running build command...' },
  { level: LogLevel.INFO, message: 'Build successful.' },
  { level: LogLevel.SYSTEM, message: 'Deploying to edge network...' },
  { level: LogLevel.INFO, message: 'Propagation complete.' },
  { level: LogLevel.SYSTEM, message: 'Deployment live at https://landing-page.void.app' },
];

export const mockTemplates: Template[] = [
  // Frontend Meta Frameworks
  {
    id: 'tmpl_nextjs',
    name: 'Next.js App Router',
    framework: 'Next.js',
    description: 'The React framework for production with App Router, Server Components, and TypeScript.',
    author: 'Vercel',
    imageUrl: 'https://skillicons.dev/icons?i=nextjs&theme=dark',
    logoUrl: 'https://www.vectorlogo.zone/logos/nextjs/nextjs-icon.svg'
  },
  {
    id: 'tmpl_nuxt',
    name: 'Nuxt 3 Starter',
    framework: 'Nuxt',
    description: 'The intuitive Vue framework with hybrid rendering and zero-config TypeScript support.',
    author: 'NuxtLabs',
    imageUrl: 'https://skillicons.dev/icons?i=nuxtjs&theme=dark',
    logoUrl: 'https://nuxt.com/icon.png'
  },
  {
    id: 'tmpl_remix',
    name: 'Remix Full Stack',
    framework: 'Remix',
    description: 'Build better websites with modern web standards, server-side rendering, and React.',
    author: 'Remix Team',
    imageUrl: 'https://skillicons.dev/icons?i=remix&theme=dark',
    logoUrl: 'https://remix.run/favicon.ico'
  },
  {
    id: 'tmpl_astro',
    name: 'Astro Static Site',
    framework: 'Astro',
    description: 'Build faster websites with less client-side JavaScript. The all-in-one web framework.',
    author: 'Astro',
    imageUrl: 'https://skillicons.dev/icons?i=astro&theme=dark',
    logoUrl: 'https://astro.build/favicon.svg'
  },

  // Frontend Frameworks
  {
    id: 'tmpl_react_vite',
    name: 'React + Vite',
    framework: 'React',
    description: 'Lightning-fast React development with Vite, TypeScript, and modern build tooling.',
    author: 'opendev-labs',
    imageUrl: 'https://skillicons.dev/icons?i=react,vite&theme=dark',
    logoUrl: 'https://vitejs.dev/logo.svg'
  },
  {
    id: 'tmpl_vue',
    name: 'Vue 3 + Vite',
    framework: 'Vue',
    description: 'The progressive JavaScript framework with Composition API and TypeScript support.',
    author: 'Vue Team',
    imageUrl: 'https://skillicons.dev/icons?i=vue,vite&theme=dark',
    logoUrl: 'https://vuejs.org/logo.svg'
  },
  {
    id: 'tmpl_svelte',
    name: 'SvelteKit App',
    framework: 'Svelte',
    description: 'Cybernetically enhanced web apps with the fastest framework and minimal bundle size.',
    author: 'Svelte Team',
    imageUrl: 'https://skillicons.dev/icons?i=svelte&theme=dark',
    logoUrl: 'https://svelte.dev/favicon.png'
  },
  {
    id: 'tmpl_angular',
    name: 'Angular Standalone',
    framework: 'Angular',
    description: 'Enterprise-grade framework with TypeScript, RxJS, and powerful CLI tooling.',
    author: 'Google',
    imageUrl: 'https://skillicons.dev/icons?i=angular&theme=dark',
    logoUrl: 'https://angular.io/assets/images/favicons/favicon.ico'
  },

  // Backend & APIs
  {
    id: 'tmpl_nodejs',
    name: 'Node.js + Express',
    framework: 'Node.js',
    description: 'Fast, scalable REST API with Express, TypeScript, and modern async patterns.',
    author: 'opendev-labs',
    imageUrl: 'https://skillicons.dev/icons?i=nodejs,express&theme=dark',
    logoUrl: 'https://cdn.worldvectorlogo.com/logos/nodejs-icon.svg'
  },
  {
    id: 'tmpl_python',
    name: 'Python + Flask',
    framework: 'Python',
    description: 'Lightweight Python API with Flask, perfect for AI/ML integrations and data processing.',
    author: 'opendev-labs',
    imageUrl: 'https://skillicons.dev/icons?i=python,flask&theme=dark',
    logoUrl: 'https://cdn.worldvectorlogo.com/logos/flask.svg'
  },
  {
    id: 'tmpl_go',
    name: 'Go + Gin',
    framework: 'Go',
    description: 'High-performance HTTP server with Go and Gin for blazing-fast APIs.',
    author: 'opendev-labs',
    imageUrl: 'https://skillicons.dev/icons?i=go&theme=dark',
    logoUrl: 'https://go.dev/favicon.ico'
  },
  {
    id: 'tmpl_rust',
    name: 'Rust + Axum',
    framework: 'Rust',
    description: 'Memory-safe, ultra-fast web services with Rust and the Axum framework.',
    author: 'opendev-labs',
    imageUrl: 'https://skillicons.dev/icons?i=rust&theme=dark',
    logoUrl: 'https://www.rust-lang.org/static/images/favicon-32x32.png'
  },

  // Full Stack with Database
  {
    id: 'tmpl_nextjs_postgres',
    name: 'Next.js + PostgreSQL',
    framework: 'Next.js',
    description: 'Full-stack application with Next.js, Prisma ORM, and PostgreSQL database.',
    author: 'opendev-labs',
    imageUrl: 'https://skillicons.dev/icons?i=nextjs,postgres&theme=dark',
    logoUrl: 'https://www.vectorlogo.zone/logos/postgresql/postgresql-icon.svg'
  },
  {
    id: 'tmpl_nodejs_redis',
    name: 'Node.js + Redis',
    framework: 'Node.js',
    description: 'Real-time API with Redis caching, pub/sub, and session management.',
    author: 'opendev-labs',
    imageUrl: 'https://skillicons.dev/icons?i=nodejs,redis&theme=dark',
    logoUrl: 'https://www.vectorlogo.zone/logos/redis/redis-icon.svg'
  },

  // Styled Templates
  {
    id: 'tmpl_nextjs_tailwind',
    name: 'Next.js + Tailwind',
    framework: 'Next.js',
    description: 'Beautiful UI-first starter with Tailwind CSS, shadcn/ui, and dark mode.',
    author: 'opendev-labs',
    imageUrl: 'https://skillicons.dev/icons?i=nextjs,tailwind&theme=dark',
    logoUrl: 'https://tailwindcss.com/favicons/favicon-32x32.png'
  },

  // Infrastructure & DevOps
  {
    id: 'tmpl_docker',
    name: 'Dockerized App',
    framework: 'Docker',
    description: 'Production-ready Docker setup with multi-stage builds and compose configuration.',
    author: 'opendev-labs',
    imageUrl: 'https://skillicons.dev/icons?i=docker&theme=dark',
    logoUrl: 'https://www.docker.com/wp-content/uploads/2022/03/Moby-logo.png'
  },
  {
    id: 'tmpl_firebase',
    name: 'Firebase + React',
    framework: 'Firebase',
    description: 'Serverless React app with Firebase Auth, Firestore, and Cloud Functions.',
    author: 'opendev-labs',
    imageUrl: 'https://skillicons.dev/icons?i=firebase,react&theme=dark',
    logoUrl: 'https://firebase.google.com/favicon.ico'
  },

  // TypeScript Focused
  {
    id: 'tmpl_typescript',
    name: 'TypeScript Library',
    framework: 'TypeScript',
    description: 'TypeScript library starter with modern build tools, testing, and CI/CD.',
    author: 'opendev-labs',
    imageUrl: 'https://skillicons.dev/icons?i=ts&theme=dark',
    logoUrl: 'https://www.typescriptlang.org/favicon-32x32.png'
  },
];

export const mockWorkflows: Workflow[] = [
  {
    id: 'wf_1',
    name: 'Headless Commerce',
    description: 'A Next.js storefront pre-configured to work with a Shopify backend.',
    components: [
      { name: 'Next.js', type: 'framework', logoUrl: 'https://www.vectorlogo.zone/logos/nextjs/nextjs-icon.svg' },
      { name: 'Shopify', type: 'service', logoUrl: 'https://cdn.worldvectorlogo.com/logos/shopify.svg' },
    ],
  },
  {
    id: 'wf_2',
    name: 'Serverless API',
    description: 'A Node.js Express API connected to a managed PostgreSQL database.',
    components: [
      { name: 'Node.js', type: 'framework', logoUrl: 'https://cdn.worldvectorlogo.com/logos/nodejs-icon.svg' },
      { name: 'PostgreSQL', type: 'database', logoUrl: 'https://www.vectorlogo.zone/logos/postgresql/postgresql-icon.svg' },
    ],
  },
  {
    id: 'wf_3',
    name: 'AI-Powered Blog',
    description: 'An Astro blog with Sentry for error monitoring, ready for AI integrations.',
    components: [
      { name: 'Astro', type: 'framework', logoUrl: 'https://astro.build/favicon.svg' },
      { name: 'Sentry', type: 'service', logoUrl: 'https://raw.githubusercontent.com/getsentry/sentry-art/master/sentry-glyph-black.svg' },
    ],
  },
  {
    id: 'wf_4',
    name: 'Realtime Dashboard',
    description: 'A Vue.js frontend with a Redis instance for caching and real-time data.',
    components: [
      { name: 'Vue.js', type: 'framework', logoUrl: 'https://vuejs.org/logo.svg' },
      { name: 'Redis', type: 'database', logoUrl: 'https://www.vectorlogo.zone/logos/redis/redis-icon.svg' },
    ],
  },
  {
    id: 'wf_5',
    name: 'Full-Stack Remix App',
    description: 'A modern web application using Remix, connected to a serverless Neon PostgreSQL database.',
    components: [
      { name: 'Remix', type: 'framework', logoUrl: 'https://remix.run/favicon.ico' },
      { name: 'Neon', type: 'database', logoUrl: 'https://neon.tech/favicon/favicon-32x32.png' },
    ],
  },
  {
    id: 'wf_6',
    name: 'Python Data API',
    description: 'A lightweight Python Flask API for data processing, paired with a Redis cache for speed.',
    components: [
      { name: 'Python', type: 'framework', logoUrl: 'https://cdn.worldvectorlogo.com/logos/flask.svg' },
      { name: 'Redis', type: 'database', logoUrl: 'https://www.vectorlogo.zone/logos/redis/redis-icon.svg' },
    ],
  },
  {
    id: 'wf_7',
    name: 'Go High-Performance API',
    description: 'A blazing-fast API built with Go and Gin, backed by a robust PostgreSQL database.',
    components: [
      { name: 'Go', type: 'framework', logoUrl: 'https://go.dev/favicon.ico' },
      { name: 'PostgreSQL', type: 'database', logoUrl: 'https://www.vectorlogo.zone/logos/postgresql/postgresql-icon.svg' },
    ],
  },
  {
    id: 'wf_8',
    name: 'Static Docs with Auth',
    description: 'A documentation site built with Docusaurus and protected by Clerk user authentication.',
    components: [
      { name: 'Docusaurus', type: 'framework', logoUrl: 'https://docusaurus.io/img/favicon.ico' },
      { name: 'Clerk', type: 'service', logoUrl: 'https://clerk.com/favicon/favicon-32x32.png' },
    ],
  },
  {
    id: 'wf_9',
    name: 'SvelteKit & Neon',
    description: 'A full-stack SvelteKit application connected to a modern serverless Neon PostgreSQL database.',
    components: [
      { name: 'SvelteKit', type: 'framework', logoUrl: 'https://svelte.dev/favicon.png' },
      { name: 'Neon', type: 'database', logoUrl: 'https://neon.tech/favicon/favicon-32x32.png' },
    ],
  },
  {
    id: 'wf_10',
    name: 'Angular SSR & Monitoring',
    description: 'A server-side rendered Angular app with Sentry pre-configured for error and performance monitoring.',
    components: [
      { name: 'Angular', type: 'framework', logoUrl: 'https://angular.io/assets/images/favicons/favicon.ico' },
      { name: 'Sentry', type: 'service', logoUrl: 'https://raw.githubusercontent.com/getsentry/sentry-art/master/sentry-glyph-black.svg' },
    ],
  },
  {
    id: 'wf_11',
    name: 'SolidJS Realtime App',
    description: 'A reactive web app built with SolidStart and a Redis database for real-time features like leaderboards.',
    components: [
      { name: 'SolidJS', type: 'framework', logoUrl: 'https://www.solidjs.com/favicon.ico' },
      { name: 'Redis', type: 'database', logoUrl: 'https://www.vectorlogo.zone/logos/redis/redis-icon.svg' },
    ],
  },
  {
    id: 'wf_12',
    name: 'Qwik Resumable E-commerce',
    description: 'An instantly-interactive storefront built with Qwik and powered by the Shopify backend.',
    components: [
      { name: 'Qwik', type: 'framework', logoUrl: 'https://qwik.builder.io/favicon.ico' },
      { name: 'Shopify', type: 'service', logoUrl: 'https://cdn.worldvectorlogo.com/logos/shopify.svg' },
    ],
  },
  {
    id: 'wf_13',
    name: 'Rust API & Postgres',
    description: 'A secure and high-performance web API using Rust and Axum, connected to PostgreSQL.',
    components: [
      { name: 'Rust', type: 'framework', logoUrl: 'https://www.rust-lang.org/static/images/favicon-32x32.png' },
      { name: 'PostgreSQL', type: 'database', logoUrl: 'https://www.vectorlogo.zone/logos/postgresql/postgresql-icon.svg' },
    ],
  },
  {
    id: 'wf_14',
    name: 'Gatsby Blog with Monitoring',
    description: 'A fast, static blog generated by Gatsby and integrated with Sentry for monitoring.',
    components: [
      { name: 'Gatsby', type: 'framework', logoUrl: 'https://www.gatsbyjs.com/favicon-32x32.png' },
      { name: 'Sentry', type: 'service', logoUrl: 'https://raw.githubusercontent.com/getsentry/sentry-art/master/sentry-glyph-black.svg' },
    ],
  },
];

export const mockRepositories: Record<GitProvider, Repository[]> = {
  'GitHub': [
    { id: 'gh_1', name: 'pulse-v2-api', owner: 'opendev-labs', description: 'The main API for the Pulse analytics platform.', updatedAt: '2 hours ago', provider: 'GitHub' },
    { id: 'gh_2', name: 'nova-landing-page', owner: 'opendev-labs', description: 'Marketing and landing page for the Nova project.', updatedAt: '1 day ago', provider: 'GitHub' },
    { id: 'gh_3', name: 'personal-portfolio-v3', owner: 'opendev-labs', description: 'My personal portfolio website built with Astro.', updatedAt: '5 days ago', provider: 'GitHub' },
    { id: 'gh_4', name: 'dotfiles', owner: 'opendev-labs', description: 'My personal development environment configuration.', updatedAt: '1 week ago', provider: 'GitHub' },
  ],
  'GitLab': [
    { id: 'gl_1', name: 'internal-dashboard', owner: 'acme-corp', description: 'Dashboard for internal company metrics.', updatedAt: '3 hours ago', provider: 'GitLab' },
    { id: 'gl_2', name: 'design-system', owner: 'acme-corp', description: 'Shared component library for all frontend projects.', updatedAt: '2 days ago', provider: 'GitLab' },
    { id: 'gl_3', name: 'data-pipeline-etl', owner: 'acme-corp', description: 'ETL scripts for our data warehouse.', updatedAt: '6 days ago', provider: 'GitLab' },
  ],
  'Bitbucket': [
    { id: 'bb_1', name: 'legacy-app-maintenance', owner: 'enterprise-inc', description: 'Maintenance repository for the old monolith.', updatedAt: '4 hours ago', provider: 'Bitbucket' },
    { id: 'bb_2', name: 'mobile-app-q1-feature', owner: 'enterprise-inc', description: 'Feature branch for the Q1 mobile app release.', updatedAt: '1 day ago', provider: 'Bitbucket' },
  ],
}

export const mockFileSystem: FileSystemNode[] = [
  {
    name: 'src',
    type: 'directory',
    children: [
      {
        name: 'components',
        type: 'directory',
        children: [
          { name: 'Button.tsx', type: 'file', content: 'export const Button = () => <button>Click me</button>;' },
          { name: 'Header.tsx', type: 'file', content: 'export const Header = () => <header>My App</header>;' },
        ],
      },
      {
        name: 'App.tsx',
        type: 'file',
        content: `import React from 'react';\n\nconst App = () => <h1 className="text-4xl font-bold tracking-tighter">Hello opendev-labs!</h1>;\n\nexport default App;`
      },
      {
        name: 'index.css',
        type: 'file',
        content: 'body { margin: 0; background: black; color: white; font-family: sans-serif; }'
      }
    ]
  },
  {
    name: 'public',
    type: 'directory',
    children: [
      { name: 'index.html', type: 'file', content: '<!DOCTYPE html><html><head><title>opendev-labs App</title></head><body><div id="root"></div></body></html>' },
    ]
  },
  {
    name: 'package.json',
    type: 'file',
    content: `{
    "name": "my-opendev-app",
    "version": "1.0.0",
    "dependencies": {
        "react": "latest",
        "react-dom": "latest"
    }
}`
  }
];


/**
 * Generates a full set of mock data for a new project.
 * This ensures that newly created projects have populated tabs instead of "No data" messages.
 */
export const generateInitialProjectData = () => ({
  analytics: { ...mockAnalyticsData },
  functions: [...mockServerlessFunctions],
  teamMembers: [...mockTeamMembers],
  activityLog: [{
    id: `act_${Date.now()}`,
    type: 'Deployment' as const,
    description: 'Initial deployment created',
    actor: 'You',
    timestamp: new Date().toISOString()
  }],
  storage: [...mockDatabases],
  integrations: [...mockConnectedIntegrations]
});


export const socialProofLogos = [
  { name: 'Vercel', url: 'https://www.svgrepo.com/show/354512/vercel.svg' },
  { name: 'Stripe', url: 'https://www.svgrepo.com/show/354413/stripe.svg' },
  { name: 'Notion', url: 'https://www.svgrepo.com/show/354133/notion.svg' },
  { name: 'GitHub', url: 'https://www.svgrepo.com/show/353796/github.svg' },
  { name: 'Figma', url: 'https://www.svgrepo.com/show/353733/figma.svg' },
];

export const SUPPORTED_MODELS: ModelConfig[] = [
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', provider: 'Google', apiIdentifier: 'gemini-2.5-flash' },

  // Top Free Coding Models
  { id: 'deepseek-coder-v2', name: 'DeepSeek Coder V2', provider: 'DeepSeek', apiIdentifier: 'deepseek-coder' },
  { id: 'openrouter-nous-hermes-2-mixtral', name: 'Nous Hermes 2 (OpenRouter)', provider: 'OpenRouter', apiIdentifier: 'nousresearch/nous-hermes-2-mixtral-8x7b-dpo' },
  { id: 'meta-codellama-70b', name: 'CodeLlama 70B', provider: 'Meta', apiIdentifier: 'codellama/CodeLlama-70b-hf' },
  { id: 'bigcode-starcoder', name: 'StarCoder', provider: 'BigCode', apiIdentifier: 'bigcode/starcoder' },
  { id: 'wizardlm-wizardcoder-python', name: 'WizardCoder', provider: 'WizardLM', apiIdentifier: 'WizardLM/WizardCoder-Python-34B-V1.0' },
  { id: 'anthropic-claude-instant', name: 'Claude Instant', provider: 'Anthropic', apiIdentifier: 'claude-instant-1.2' },
  { id: 'google-gemma-7b', name: 'Gemma 7B', provider: 'Google', apiIdentifier: 'gemma-7b' },
  { id: 'mistral-ai-mistral-7b', name: 'Mistral 7B', provider: 'Mistral AI', apiIdentifier: 'mistralai/Mistral-7B-v0.1' },
  { id: 'openchat-openchat-3.5', name: 'OpenChat 3.5', provider: 'OpenChat', apiIdentifier: 'openchat/openchat-3.5' },
  { id: 'phind-codellama-v2', name: 'Phind CodeLlama V2', provider: 'Phind', apiIdentifier: 'phind/Phind-CodeLlama-34B-v2' },
  { id: 'replit-code-v1.5', name: 'Replit Code V1.5', provider: 'Replit', apiIdentifier: 'replit/replit-code-v1-3b' },

  // Existing Models
  { id: 'openai-gpt-4o', name: 'GPT-4o', provider: 'OpenAI', apiIdentifier: 'gpt-4o' },
  { id: 'openai-gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'OpenAI', apiIdentifier: 'gpt-4-turbo' },
  { id: 'anthropic-claude-3-opus', name: 'Claude 3 Opus', provider: 'Anthropic', apiIdentifier: 'claude-3-opus-20240229' },
  { id: 'anthropic-claude-3-sonnet', name: 'Claude 3 Sonnet', provider: 'Anthropic', apiIdentifier: 'claude-3-sonnet-20240229' },
  { id: 'anthropic-claude-3-haiku', name: 'Claude 3 Haiku', provider: 'Anthropic', apiIdentifier: 'claude-3-haiku-20240307' },
];