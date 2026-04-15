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
  const [showConsole, setShowConsole] = React.useState(false);
  const template = useMemo(() => detectTemplate(files), [files]);
  const deps = useMemo(() => detectDependencies(files), [files]);
  const sandpackFiles = useMemo(() => convertFiles(files, template), [files, template]);
  const entryFile = useMemo(() => findEntryFile(sandpackFiles), [sandpackFiles]);

  const fileCount = Object.keys(sandpackFiles).length;

  if (fileCount === 0) {
    return (
      <div className="flex flex-col h-full bg-[#080808]">
        <BrowserBar url="nexus://waiting-for-materialization" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto animate-pulse">
                <SpinnerIcon className="w-5 h-5 text-zinc-700" />
            </div>
            <p className="text-zinc-600 text-[10px] uppercase font-bold tracking-[0.4em]">Awaiting Genesis Protocol</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden rounded-r-3xl border-l border-zinc-900 shadow-2xl">
      <BrowserBar 
        url="localhost:5173" 
        showConsole={showConsole} 
        onToggleConsole={() => setShowConsole(!showConsole)} 
      />
      <div className="flex-1 min-h-0 relative">
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
          theme="dark"
        >
          <SandpackLayout style={{ height: '100%', border: 'none', borderRadius: 0, background: 'transparent' }}>
            <div className={cn("flex flex-col h-full w-full transition-all duration-500", showConsole ? "pb-40" : "")}>
                <SandpackPreviewComponent
                style={{ height: '100%', flex: 1 }}
                showNavigator={false}
                showRefreshButton={false}
                showOpenInCodeSandbox={false}
                />
            </div>
            {showConsole && (
                <div className="absolute bottom-0 left-0 right-0 h-40 bg-[#0A0A0A] border-t border-zinc-800 p-4 font-mono text-[10px] overflow-auto border-b border-zinc-900">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-zinc-600 font-bold uppercase tracking-widest text-[8px]">Console Output</span>
                        <div className="flex gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
                            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/50" />
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
                        </div>
                    </div>
                   <div className="text-emerald-500/80 leading-relaxed">
                        &gt; Nexus Runtime v2026.4.15 Initialized<br />
                        &gt; Materializing dependencies...<br />
                        &gt; Application mounted successfully.
                   </div>
                </div>
            )}
          </SandpackLayout>
        </SandpackProvider>
      </div>
    </div>
  );
};

/**
 * Browser chrome bar that sits above the preview.
 */
const BrowserBar: React.FC<{ url: string; showConsole?: boolean; onToggleConsole?: () => void }> = ({ url, showConsole, onToggleConsole }) => (
  <div className="h-14 bg-[#0A0A0A] border-b border-zinc-900 flex items-center px-6 gap-6 flex-shrink-0">
    <div className="flex items-center gap-3">
      <div className="flex gap-1.5 mr-2">
        <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
        <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
        <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
      </div>
      <button className="text-zinc-600 hover:text-white transition-colors">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
      </button>
      <button className="text-zinc-600 hover:text-white transition-colors">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
      </button>
    </div>

    <div className="flex-1 bg-[#050505] border border-zinc-900 rounded-xl h-9 flex items-center px-4 gap-3 group focus-within:border-zinc-700 transition-all">
      <svg className="w-3 h-3 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-3.44A20.01 20.01 0 0110 11.218m8.239-4.239A9.954 9.954 0 0121 12c0 1.221-.219 2.39-.621 3.475m-3.475 3.475A9.954 9.954 0 0112 21c-1.221 0-2.39-.219-3.475-.621m-3.475-3.475A9.954 9.954 0 013 12c0-1.221.219-2.39.621-3.475m3.475-3.475A9.954 9.954 0 0112 3c1.221 0 2.39.219 3.475.621m3.475 3.475A20.01 20.01 0 0114 11.218" /></svg>
      <span className="text-[11px] text-zinc-500 font-mono truncate">{url}</span>
    </div>

    <div className="flex items-center gap-4">
      <button 
        onClick={onToggleConsole}
        className={cn(
            "px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all border",
            showConsole 
                ? "bg-zinc-800 text-white border-zinc-700" 
                : "bg-transparent text-zinc-500 border-zinc-900 hover:border-zinc-800 hover:text-zinc-400"
        )}
      >
        Console
      </button>
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
        <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
            Handshake Active
        </span>
      </div>
    </div>
  </div>
);
