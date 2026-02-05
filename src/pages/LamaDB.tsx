import React from 'react';
import { Database, Shield, Zap, Globe, Layers, Cpu, Code } from 'lucide-react';
import { ProductPageTemplate } from '../components/ProductPageTemplate';
import { useNavigate } from 'react-router-dom';

export default function LamaDB() {
    const navigate = useNavigate();

    const features = [
        {
            title: "Sub-Zero Latency",
            desc: "Data is stored locally in IndexedDB, providing instant reads and writes even when offline. No round-trips for core state.",
            icon: Zap
        },
        {
            title: "End-to-End Security",
            desc: "Military-grade encryption at rest and in transit. Your data remains sovereign on the client until synchronized.",
            icon: Shield
        },
        {
            title: "Global Edge Sync",
            desc: "Automatically synchronize data across devices and edge locations using our proprietary neural mesh network.",
            icon: Globe
        }
    ];

    const performanceMetrics = [
        {
            title: "Multi-Model Engine",
            desc: "Supports Document, Key-Value, and Graph patterns in a single unified API without storage leaks.",
            icon: Layers
        },
        {
            title: "WASM Runtime",
            desc: "Core engine written in Rust and compiled to WASM for near-native local processing speeds in the browser.",
            icon: Cpu
        },
        {
            title: "Type-Safe Queries",
            desc: "First-class TypeScript support with generated schemas and compile-time validation for distributed state.",
            icon: Code
        }
    ];

    const codeSnippet = (
        <>
            <div className="text-zinc-600 mb-6 font-mono text-xs">// Initialize LamaDB Nexus</div>
            <div className="text-zinc-300">import <span className="text-zinc-500">{'{'}</span> lama <span className="text-zinc-500">{'}'}</span> from <span className="text-zinc-400">'@opendev-labs/lamadb'</span>;</div>
            <div className="text-zinc-500 mt-6 font-mono">const <span className="text-white">db</span> = await lama.<span className="text-white">connect</span>();</div>
            <div className="text-zinc-500 mt-6 font-mono">await <span className="text-white">db</span>.<span className="text-white">nodes</span>.<span className="text-white">insert</span>({'{'}</div>
            <div className="pl-6 text-zinc-500 font-mono">
                id: <span className="text-zinc-300">'node_01'</span>,<br />
                protocol: <span className="text-zinc-300">'high-fidelity'</span>
            </div>
            <div className="text-zinc-500 font-mono">{'}'});</div>
            <div className="text-zinc-600 mt-10 font-mono text-xs">// Sub-atomic state recovery</div>
            <div className="text-zinc-500 font-mono">const <span className="text-white">state</span> = await <span className="text-white">db</span>.<span className="text-white">nodes</span>.<span className="text-white">query</span>();</div>
        </>
    );

    return (
        <ProductPageTemplate
            badge="The Browser Native Database"
            badgeIcon={Database}
            title="LamaDB Mesh"
            description="A high-fidelity, edge-first database designed for decentralized intelligence. Store, sync, and secure data directly in the browser with zero-latency recovery."
            features={features}
            performanceTitle="Engineered for Performance."
            performanceMetrics={performanceMetrics}
            codeSnippet={codeSnippet}
            primaryActionLabel="Enter Registry Cabinet"
            onPrimaryAction={() => navigate('/lamadb/console')}
        />
    );
}
