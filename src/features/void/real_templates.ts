export const REAL_TEMPLATES: Record<string, Record<string, string>> = {
    'landing-page': {
        'src/App.tsx': 'export default function App() { return <div className="min-h-screen bg-black text-white flex items-center justify-center font-sans"><h1 className="text-6xl font-bold tracking-tighter">opendev-labs.</h1></div>; }',
        'src/index.css': 'body { margin: 0; background: black; color: white; }',
        'package.json': '{"name": "opendev-landing-page", "version": "1.0.0", "dependencies": {"react": "latest", "react-dom": "latest", "framer-motion": "latest"}}',
        'public/index.html': '<!DOCTYPE html><html><head><title>opendev-labs Landing Page</title></head><body><div id="root"></div></body></html>'
    },
    'nextjs-starter': {
        'pages/index.tsx': 'export default function Home() { return <div className="p-20"><h1 className="text-4xl font-bold">opendev-labs Next.js Node</h1></div>; }',
        'package.json': '{"name": "opendev-next-app", "version": "1.0.0", "dependencies": {"next": "latest", "react": "latest", "react-dom": "latest"}}',
        'styles/globals.css': 'body { background: black; color: white; }'
    },
    'default': {
        'src/App.tsx': 'export default function App() { return <div className="min-h-screen bg-black text-white flex items-center justify-center"><h1>opendev-labs Initial Node</h1></div>; }',
        'package.json': '{"name": "opendev-app", "version": "1.0.0", "dependencies": {"react": "latest", "react-dom": "latest"}}'
    }
};
