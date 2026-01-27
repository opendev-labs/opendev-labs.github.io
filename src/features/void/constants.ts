

import type { Project, Deployment, Domain, Template, GitProvider, Repository, AnalyticsData, ServerlessFunction, TeamMember, ActivityEvent, UsageMetrics, Database, Integration, FileSystemNode, Workflow } from './types';
import { DeploymentStatus, LogLevel, FunctionStatus, TeamMemberRole, DatabaseType, DatabaseStatus } from './types';

export const mockDeployments: Deployment[] = [
  {
    id: 'dpl_1',
    commit: 'a1b2c3d - Feat: Add user authentication',
    branch: 'main',
    timestamp: '2024-07-21T10:30:00Z',
    status: DeploymentStatus.DEPLOYED,
    url: '#/deploy/pulse-v2-api',
  },
  {
    id: 'dpl_2',
    commit: 'e4f5g6h - Fix: Database connection issue',
    branch: 'hotfix/db-connect',
    timestamp: '2024-07-20T15:00:00Z',
    status: DeploymentStatus.ERROR,
    url: 'https://pulse-v2-api-e4f5g6h.void.app',
  },
  {
    id: 'dpl_3',
    commit: 'i7j8k9l - Chore: Update dependencies',
    branch: 'dependabot/npm',
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
  { id: 'user_1', name: 'You', email: 'you@void.app', role: TeamMemberRole.OWNER, avatarUrl: 'https://placehold.co/40x40/9b5cff/FFFFFF/png?text=Y' },
  { id: 'user_2', name: 'Jane Doe', email: 'jane.doe@void.app', role: TeamMemberRole.MEMBER, avatarUrl: 'https://placehold.co/40x40/7DF9FF/000000/png?text=JD' },
];

export const mockActivityLog: ActivityEvent[] = [
  { id: 'act_1', type: 'Deployment', description: 'Deployed a1b2c3d to production', actor: 'You', timestamp: '2024-07-21T10:30:00Z' },
  { id: 'act_6', type: 'Integration', description: 'Connected Sentry integration', actor: 'You', timestamp: '2024-07-21T09:48:00Z' },
  { id: 'act_5', type: 'Storage', description: 'Created PostgreSQL database "pulse-db"', actor: 'You', timestamp: '2024-07-21T09:45:00Z' },
  { id: 'act_2', type: 'Domain', description: 'Added domain pulse-api.void.app', actor: 'You', timestamp: '2024-07-21T09:15:00Z' },
  { id: 'act_3', type: 'Settings', description: 'Updated SECRET_KEY environment variable', actor: 'Jane Doe', timestamp: '2024-07-20T18:00:00Z' },
  { id: 'act_4', type: 'Deployment', description: 'Deployment e4f5g6h failed', actor: 'You', timestamp: '2024-07-20T15:00:00Z' },
];

export const mockDatabases: Database[] = [
  { id: 'db_1', name: 'pulse-db', type: DatabaseType.POSTGRES, region: 'us-east-1 (CLE)', status: DatabaseStatus.ACTIVE, version: '14.8' },
  { id: 'db_2', name: 'cache-instance', type: DatabaseType.REDIS, region: 'us-east-1 (CLE)', status: DatabaseStatus.ACTIVE, version: '7.2' },
];

export const availableIntegrations: Omit<Integration, 'isConnected'>[] = [
  { id: 'int_sentry', name: 'Sentry', description: 'Real-time error tracking and performance monitoring.', category: 'Monitoring', logoUrl: 'https://raw.githubusercontent.com/getsentry/sentry-art/master/sentry-glyph-black.svg' },
  { id: 'int_neon', name: 'Neon', description: 'Serverless PostgreSQL with a free tier.', category: 'Database', logoUrl: 'https://neon.tech/favicon/favicon-32x32.png' },
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


export const mockProjects: Project[] = [
  {
    id: 'proj_1',
    name: 'landing-page',
    framework: 'React',
    lastUpdated: 'Just now',
    gitProvider: 'GitHub',
    deployments: [
      {
        id: 'dpl_lp_1',
        commit: 'a1b2c3d - Feat: Initial commit for landing page',
        branch: 'main',
        timestamp: new Date().toISOString(),
        status: DeploymentStatus.DEPLOYED,
        url: 'https://landing-page.void.app',
      },
      {
        id: 'dpl_lp_2',
        commit: 'e4f5g6h - Fix: Mobile layout bug',
        branch: 'main',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        status: DeploymentStatus.DEPLOYED,
        url: 'https://landing-page.void.app',
      },
      {
        id: 'dpl_lp_3',
        commit: 'i7j8k9l - Chore: Update dependencies',
        branch: 'dependabot',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: DeploymentStatus.DEPLOYED,
        url: 'https://landing-page-i7j8k9l.void.app',
      },
    ],
    domains: [
      { name: 'landing-page.void.app', isPrimary: true },
      { name: 'landing-page-a1b2c3d.void.app', isPrimary: false, gitBranch: 'main' },
    ],
    envVars: {
      'DATABASE_URL': 'postgres://user:pass@host:port/db',
      'SECRET_KEY': '**********',
      'REDIS_URL': 'redis://localhost:6379'
    },
    analytics: mockAnalyticsData,
    functions: mockServerlessFunctions,
    teamMembers: mockTeamMembers,
    activityLog: mockActivityLog,
    storage: mockDatabases,
    integrations: mockConnectedIntegrations,
  },
  {
    id: 'proj_2',
    name: 'nova-landing-page',
    framework: 'SvelteKit',
    lastUpdated: '1 day ago',
    gitProvider: 'GitLab',
    deployments: [
      {
        id: 'dpl_4',
        commit: 'm1n2o3p - Style: Update hero section',
        branch: 'main',
        timestamp: '2024-07-20T18:45:00Z',
        status: DeploymentStatus.DEPLOYED,
        url: 'https://nova-landing-page.void.app',
      },
      {
        id: 'dpl_5',
        commit: 'x4y5z6a - Refactor: Component logic',
        branch: 'main',
        timestamp: '2024-07-19T12:00:00Z',
        status: DeploymentStatus.DEPLOYED,
        url: 'https://nova-landing-page.void.app',
      },
    ],
    domains: [
      { name: 'nova-landing-page.void.app', isPrimary: true }
    ],
    envVars: {
      'PUBLIC_API_ENDPOINT': 'https://api.nova.void.app/graphql'
    }
  },
  {
    id: 'proj_3',
    name: 'quantum-analytics-db',
    framework: 'PostgreSQL',
    lastUpdated: '3 days ago',
    gitProvider: 'Bitbucket',
    deployments: [
      {
        id: 'dpl_6',
        commit: 'q4r5s6t - Feat: Add new analytics table',
        branch: 'schema-updates',
        timestamp: '2024-07-18T11:20:00Z',
        status: DeploymentStatus.ERROR,
        url: 'https://quantum-analytics-db.void.app',
      },
      {
        id: 'dpl_7',
        commit: 'b7c8d9e - Fix: Indexing on user table',
        branch: 'schema-updates',
        timestamp: '2024-07-17T16:40:00Z',
        status: DeploymentStatus.DEPLOYED,
        url: 'https://quantum-analytics-db.void.app',
      }
    ],
    domains: [],
    envVars: {
      'POSTGRES_USER': 'quantum_user',
      'POSTGRES_PASSWORD': '**********'
    }
  },
];


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
  { id: 'tmpl_1', name: 'Next.js Boilerplate', framework: 'Next.js', description: 'A feature-rich Next.js starter with TypeScript, Tailwind, and more.', author: 'Vercel', imageUrl: 'https://assets.vercel.com/image/upload/v1662572219/front/nextjs-og-template.png', logoUrl: 'https://www.vectorlogo.zone/logos/nextjs/nextjs-icon.svg' },
  { id: 'tmpl_3', name: 'Vite + React', framework: 'React', description: 'A minimal React starter with Vite for a fast development experience.', author: 'Vite', imageUrl: 'https://vitejs.dev/og.png', logoUrl: 'https://vitejs.dev/logo.svg' },
  { id: 'tmpl_2', name: 'SvelteKit Starter', framework: 'SvelteKit', description: 'A barebones SvelteKit app, ready to deploy.', author: 'Svelte', imageUrl: 'https://sveltesummit.com/images/og/svelte-summit-spring-2023.jpg', logoUrl: 'https://svelte.dev/favicon.png' },
  { id: 'tmpl_4', name: 'Nuxt Minimal Starter', framework: 'Nuxt', description: 'Get started with Nuxt 3 and experience the power of Vue.', author: 'NuxtLabs', imageUrl: 'https://nuxt.com/assets/design-kit/logo/browser-dark.png', logoUrl: 'https://nuxt.com/icon.png' },
  { id: 'tmpl_5', name: 'Vue + Vite', framework: 'Vue.js', description: 'A lightweight and fast Vue 3 starter kit powered by Vite.', author: 'Vue', imageUrl: 'https://v2.vuejs.org/images/logo.png', logoUrl: 'https://vuejs.org/logo.svg' },
  { id: 'tmpl_6', name: 'Astro Blog', framework: 'Astro', description: 'Build a fast, content-focused blog with the Astro starter kit.', author: 'Astro', imageUrl: 'https://astro.build/assets/press/astro-logo-dark-gradient.png', logoUrl: 'https://astro.build/favicon.svg' },
  { id: 'tmpl_7', name: 'Node.js Express API', framework: 'Node.js', description: 'A simple boilerplate for a REST API with Node.js and Express.', author: 'Community', imageUrl: 'https://raw.githubusercontent.com/github/explore/ce5e75141999579c683076046e9112a9528b5120/topics/express/express.png', logoUrl: 'https://cdn.worldvectorlogo.com/logos/nodejs-icon.svg' },
  { id: 'tmpl_8', name: 'Static Site', framework: 'HTML', description: 'A basic HTML, CSS, and JS template for simple static websites.', author: 'Community', imageUrl: 'https://www.w3.org/html/logo/og-image.png', logoUrl: 'https://www.w3.org/html/logo/downloads/HTML5_Badge_32.png' },
  { id: 'tmpl_9', name: 'Remix Starter', framework: 'Remix', description: 'Create modern, resilient web apps with the Remix framework.', author: 'Remix Team', imageUrl: 'https://remix.run/img/og.1.jpg', logoUrl: 'https://remix.run/favicon.ico' },
  { id: 'tmpl_10', name: 'Gatsby Portfolio', framework: 'Gatsby', description: 'A starter portfolio site built with Gatsby and GraphQL.', author: 'Gatsby', imageUrl: 'https://www.gatsbyjs.com/images/gatsby-og.png', logoUrl: 'https://www.gatsbyjs.com/favicon-32x32.png' },
  { id: 'tmpl_11', name: 'Eleventy Starter', framework: 'Eleventy', description: 'A simple, flexible static site generator.', author: '11ty', imageUrl: 'https://www.11ty.dev/images/11ty-og.png', logoUrl: 'https://www.11ty.dev/favicon.ico' },
  { id: 'tmpl_12', name: 'Python Flask API', framework: 'Python', description: 'A minimal REST API built with Python and the Flask micro-framework.', author: 'Community', imageUrl: 'https://raw.githubusercontent.com/github/explore/80688e429a7d40f8dd3e8aF7415291ea77f07753/topics/flask/flask.png', logoUrl: 'https://cdn.worldvectorlogo.com/logos/flask.svg' },
  { id: 'tmpl_13', name: 'Go Gin API', framework: 'Go', description: 'A high-performance API server using Go and the Gin framework.', author: 'Community', imageUrl: 'https://raw.githubusercontent.com/gin-gonic/logo/master/color.png', logoUrl: 'https://go.dev/favicon.ico' },
  { id: 'tmpl_14', name: 'Docusaurus Site', framework: 'Docusaurus', description: 'Easily build optimized documentation websites with React.', author: 'Facebook', imageUrl: 'https://docusaurus.io/img/docusaurus-social-card.png', logoUrl: 'https://docusaurus.io/img/favicon.ico' },
  { id: 'tmpl_15', name: 'SolidStart App', framework: 'SolidJS', description: 'A starter for building reactive web applications with SolidStart.', author: 'Solid Team', imageUrl: 'https://www.solidjs.com/assets/og-home.png', logoUrl: 'https://www.solidjs.com/favicon.ico' },
  { id: 'tmpl_16', name: 'Qwik City Starter', framework: 'Qwik', description: 'Build resumable, instantly-interactive applications with Qwik.', author: 'Builder.io', imageUrl: 'https://qwik.builder.io/logos/social-card.png', logoUrl: 'https://qwik.builder.io/favicon.ico' },
  { id: 'tmpl_17', name: 'Angular Universal', framework: 'Angular', description: 'A starter for server-side rendered (SSR) Angular applications.', author: 'Google', imageUrl: 'https://angular.io/assets/images/logos/angular/angular-social.png', logoUrl: 'https://angular.io/assets/images/favicons/favicon.ico' },
  { id: 'tmpl_18', name: 'Rust Axum Server', framework: 'Rust', description: 'A boilerplate for a web server using Rust and the Axum framework.', author: 'Community', imageUrl: 'https://raw.githubusercontent.com/github/explore/80688e429a7d40f8dd3e8aF7415291ea77f07753/topics/rust/rust.png', logoUrl: 'https://www.rust-lang.org/static/images/favicon-32x32.png' },
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
        content: `import React from 'react';\n\nconst App = () => <h1>Hello Void!</h1>;\n\nexport default App;`
      },
      {
        name: 'index.css',
        type: 'file',
        content: 'body { margin: 0; }'
      }
    ]
  },
  {
    name: 'public',
    type: 'directory',
    children: [
      { name: 'index.html', type: 'file', content: '<!DOCTYPE html>...' },
    ]
  },
  {
    name: 'package.json',
    type: 'file',
    content: `{
    "name": "my-void-app",
    "version": "1.0.0",
    "dependencies": {
        "react": "latest"
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