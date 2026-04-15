import React, { useMemo } from 'react';
import {
  SandpackProvider,
  SandpackPreview as SandpackPreviewComponent,
  SandpackLayout,
} from '@codesandbox/sandpack-react';
import type { FileNode } from '../types';
import { SpinnerIcon, FilePlusIcon } from './icons/Icons';

// Known built-in / browser modules to exclude from dependency detection
const BUILT_IN_MODULES = new Set([
  'react', 'react-dom', 'react-dom/client', 'react/jsx-runtime',
  'fs', 'path', 'os', 'url', 'util', 'events', 'stream', 'http', 'https',
  'crypto', 'child_process', 'buffer', 'querystring', 'assert', 'zlib',
]);

// Packages that should NOT be installed (too large / incompatible with Sandpack)
const EXCLUDED_PACKAGES = new Set([
  'next', 'webpack', 'vite', 'esbuild', 'rollup', 'parcel',
  'typescript', 'ts-node', 'nodemon', 'pm2',
]);

/**
 * Scan all file contents for import statements and extract npm package names.
 */
function detectDependencies(files: FileNode[]): Record<string, string> {
  const deps: Record<string, string> = {};

  // Match both: import x from 'pkg' and import 'pkg' and require('pkg')
  const importRegex = /(?:import\s+(?:[\w\s{},*]+\s+from\s+)?['"]([^'"./][^'"]*?)(?:\/[^'"]*)?['"]|require\s*\(\s*['"]([^'"./][^'"]*?)(?:\/[^'"]*)?['"]\s*\))/g;

  for (const file of files) {
    if (!file.content) continue;
    // Only scan code files
    if (!/\.(tsx?|jsx?|vue|svelte|mjs|cjs)$/.test(file.path)) continue;

    let match: RegExpExecArray | null;
    while ((match = importRegex.exec(file.content)) !== null) {
      const pkg = match[1] || match[2];
      if (!pkg) continue;

      // Extract the root package name (handle scoped packages like @org/pkg)
      const rootPkg = pkg.startsWith('@')
        ? pkg.split('/').slice(0, 2).join('/')
        : pkg.split('/')[0];

      if (!BUILT_IN_MODULES.has(rootPkg) && !EXCLUDED_PACKAGES.has(rootPkg)) {
        deps[rootPkg] = 'latest';
      }
    }
  }

  return deps;
}

/**
 * Detect project framework from file extensions.
 */
function detectTemplate(files: FileNode[]): 'react-ts' | 'vue' | 'svelte' | 'vanilla' | 'static' {
  const hasVue = files.some(f => f.path.endsWith('.vue'));
  const hasSvelte = files.some(f => f.path.endsWith('.svelte'));
  const hasTsx = files.some(f => /\.(tsx|jsx)$/.test(f.path));
  const hasHtmlOnly = files.some(f => f.path === 'index.html') && !hasTsx && !hasVue && !hasSvelte;

  if (hasVue) return 'vue';
  if (hasSvelte) return 'svelte';
  if (hasHtmlOnly) return 'static';
  return 'react-ts';
}

/**
 * Convert our FileNode[] to Sandpack's file format.
 */
function convertFiles(files: FileNode[], template: string): Record<string, string> {
  const sandpackFiles: Record<string, string> = {};

  for (const file of files) {
    // Ensure paths start with /
    const path = file.path.startsWith('/') ? file.path : `/${file.path}`;
    // Skip placeholder files
    if (path.endsWith('.keep')) continue;
    sandpackFiles[path] = file.content || '';
  }

  // For React projects, ensure we have proper entry points
  if (template === 'react-ts') {
    // If they have App.tsx but no index.tsx, create the entry point
    const hasIndex = Object.keys(sandpackFiles).some(p =>
      /^\/?(src\/)?index\.(tsx|jsx|ts|js)$/.test(p)
    );
    const hasApp = Object.keys(sandpackFiles).some(p =>
      /^\/?(src\/)?App\.(tsx|jsx)$/.test(p)
    );

    if (hasApp && !hasIndex) {
      // Find the actual App path
      const appPath = Object.keys(sandpackFiles).find(p =>
        /^\/?(src\/)?App\.(tsx|jsx)$/.test(p)
      );
      const appImport = appPath?.replace(/^\//, '').replace(/\.(tsx|jsx)$/, '');

      sandpackFiles['/index.tsx'] = `import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './${appImport}';

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
`;
    }
  }

  return sandpackFiles;
}

/**
 * Find the best entry / active file for Sandpack.
 */
function findEntryFile(files: Record<string, string>): string {
  const priorities = [
    '/src/main.tsx', '/src/index.tsx', '/src/App.tsx',
    '/src/main.jsx', '/src/index.jsx', '/src/App.jsx',
    '/main.tsx', '/index.tsx', '/App.tsx',
    '/main.jsx', '/index.jsx', '/App.jsx',
    '/index.html',
    '/src/main.ts', '/src/index.ts',
  ];

  for (const p of priorities) {
    if (files[p]) return p;
  }

  // Fall back to first file
  return Object.keys(files)[0] || '/index.tsx';
}

interface SandpackPreviewProps {
  files: FileNode[];
}

export const SandpackPreview: React.FC<SandpackPreviewProps> = ({ files }) => {
  const template = useMemo(() => detectTemplate(files), [files]);
  const deps = useMemo(() => detectDependencies(files), [files]);
  const sandpackFiles = useMemo(() => convertFiles(files, template), [files, template]);
  const entryFile = useMemo(() => findEntryFile(sandpackFiles), [sandpackFiles]);

  const fileCount = Object.keys(sandpackFiles).length;

  if (fileCount === 0) {
    return (
      <div className="flex flex-col h-full bg-white">
        <BrowserBar url="about:blank" />
        <div className="flex-1 flex items-center justify-center bg-[#F9F9F9]">
          <div className="text-center space-y-2">
            <p className="text-zinc-400 text-sm font-medium">No files to preview</p>
            <p className="text-zinc-300 text-xs">Generate code to see a live preview here.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <BrowserBar url="localhost:5173" />
      <div className="flex-1 min-h-0">
        <SandpackProvider
          template={template as any}
          files={sandpackFiles}
          customSetup={{
            dependencies: deps,
            entry: entryFile,
          }}
          options={{
            autorun: true,
            recompileMode: 'delayed',
            recompileDelay: 600,
            externalResources: [
              'https://cdn.tailwindcss.com',
              'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
            ],
          }}
          theme={{
            colors: {
              surface1: '#ffffff',
              surface2: '#F3F4F6',
              surface3: '#E5E7EB',
              clickable: '#6B7280',
              base: '#1F2937',
              disabled: '#D1D5DB',
              hover: '#374151',
              accent: '#3B82F6',
              error: '#EF4444',
              errorSurface: '#FEE2E2',
            },
            syntax: {
              plain: '#1F2937',
              comment: { color: '#9CA3AF', fontStyle: 'italic' },
              keyword: '#8B5CF6',
              tag: '#059669',
              punctuation: '#6B7280',
              definition: '#2563EB',
              property: '#D97706',
              static: '#DC2626',
              string: '#059669',
            },
            font: {
              body: '"Inter", -apple-system, sans-serif',
              mono: '"JetBrains Mono", "Fira Code", monospace',
              size: '13px',
              lineHeight: '20px',
            },
          }}
        >
          <SandpackLayout style={{ height: '100%', border: 'none', borderRadius: 0 }}>
            <SandpackPreviewComponent
              style={{ height: '100%', flex: 1 }}
              showNavigator={false}
              showRefreshButton={false}
              showOpenInCodeSandbox={false}
            />
          </SandpackLayout>
        </SandpackProvider>
      </div>
    </div>
  );
};

/**
 * Browser chrome bar that sits above the preview.
 */
const BrowserBar: React.FC<{ url: string }> = ({ url }) => (
  <div className="h-10 bg-[#F3F3F3] border-b border-[#E5E5E5] flex items-center px-4 gap-4 flex-shrink-0">
    <div className="flex items-center gap-2">
      <button className="text-zinc-400 hover:text-zinc-600">
        <FilePlusIcon className="w-3.5 h-3.5 -scale-x-100" />
      </button>
      <button className="text-zinc-400 hover:text-zinc-600">
        <FilePlusIcon className="w-3.5 h-3.5" />
      </button>
      <button className="text-zinc-400 hover:text-zinc-600 ml-1">
        <SpinnerIcon className="w-3.5 h-3.5" />
      </button>
    </div>

    <div className="flex-1 bg-white border border-[#E5E5E5] rounded-lg h-7 flex items-center px-3 gap-2">
      <div className="w-3 h-3 rounded-full bg-zinc-100 border border-zinc-200" />
      <span className="text-[12px] text-zinc-500 font-medium truncate">{url}</span>
    </div>

    <div className="flex items-center gap-2">
      <div className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-[10px] font-bold text-emerald-600 uppercase tracking-tighter">
        Live
      </div>
    </div>
  </div>
);
