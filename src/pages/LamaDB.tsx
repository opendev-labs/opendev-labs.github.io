import { Database, Shield, Zap, Globe, ArrowRight, Layers, Cpu, Code } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LamaDB() {
    return (
        <div className="flex flex-col w-full bg-black text-white selection:bg-white selection:text-black">
            {/* Hero Section */}
            <section className="relative min-h-[70vh] flex flex-col items-center justify-center pt-20 overflow-hidden border-b border-zinc-900">
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-20">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-zinc-800/10 blur-[120px] rounded-full" />
                </div>

                <div className="relative z-10 text-center max-w-4xl px-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-400 mb-8 uppercase tracking-widest">
                        <Database size={14} />
                        <span>The Browser Native Database</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 leading-[0.9]">
                        LamaDB
                    </h1>
                    <p className="text-lg md:text-xl text-zinc-500 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
                        A high-performance, edge-first database designed to run everywhere.
                        Store, sync, and secure data directly in the browser with zero infrastructure setup.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/ide" className="w-full sm:w-auto h-12 px-10 rounded-full bg-white text-black text-[11px] font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg">
                            Deploy Now <ArrowRight size={16} />
                        </Link>
                        <Link to="/docs" className="w-full sm:w-auto h-12 px-10 rounded-full bg-black border border-zinc-800 text-white text-[11px] font-bold uppercase tracking-widest hover:bg-zinc-900 transition-all hover:scale-105 active:scale-95 flex items-center justify-center shadow-lg">
                            Documentation
                        </Link>
                    </div>
                </div>
            </section>

            {/* Value Props Grid */}
            <section className="py-32 relative overflow-hidden bg-black">
                <div className="max-w-[1200px] mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
                        <div className="group p-10 border border-zinc-900 transition-all hover:bg-zinc-950 duration-500">
                            <Zap className="mb-8 text-white" size={20} />
                            <h3 className="text-lg font-semibold mb-3 tracking-tight">Sub-Zero Latency</h3>
                            <p className="text-zinc-500 text-sm leading-relaxed font-medium">
                                Data is stored locally in IndexedDB, providing instant reads and writes even when offline.
                            </p>
                        </div>
                        <div className="group p-10 border border-zinc-900 transition-all hover:bg-zinc-950 duration-500">
                            <Shield className="mb-8 text-white" size={20} />
                            <h3 className="text-lg font-semibold mb-3 tracking-tight">End-to-End Security</h3>
                            <p className="text-zinc-500 text-sm leading-relaxed font-medium">
                                Military-grade encryption at rest and in transit. Your data never leaves the client without permission.
                            </p>
                        </div>
                        <div className="group p-10 border border-zinc-900 transition-all hover:bg-zinc-950 duration-500">
                            <Globe className="mb-8 text-white" size={20} />
                            <h3 className="text-lg font-semibold mb-3 tracking-tight">Global Edge Sync</h3>
                            <p className="text-zinc-500 text-sm leading-relaxed font-medium">
                                Automatically synchronize data across devices and edge locations using our proprietary mesh network.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section: Performance */}
            <section className="py-32 border-t border-zinc-900">
                <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-8 tracking-tighter leading-[1.1]">
                            Engineered for <br /><span className="text-zinc-500">performance.</span>
                        </h2>
                        <div className="space-y-8">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded flex items-center justify-center shrink-0">
                                    <Layers size={18} className="text-white" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white mb-2">Multi-Model Engine</h4>
                                    <p className="text-zinc-500 text-sm font-medium leading-relaxed">
                                        Supports Document, Key-Value, and Graph patterns in a single unified API.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded flex items-center justify-center shrink-0">
                                    <Cpu size={18} className="text-white" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white mb-2">WASM Runtime</h4>
                                    <p className="text-zinc-500 text-sm font-medium leading-relaxed">
                                        Core engine written in Rust and compiled to WASM for near-native local processing speeds.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded flex items-center justify-center shrink-0">
                                    <Code size={18} className="text-white" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white mb-2">Type-Safe Queries</h4>
                                    <p className="text-zinc-500 text-sm font-medium leading-relaxed">
                                        First-class TypeScript support with generated schemas and compile-time validation.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative group p-1 bg-gradient-to-br from-zinc-800 to-black rounded-2xl">
                        <div className="bg-black rounded-xl p-8 border border-zinc-900 shadow-2xl overflow-hidden">
                            <div className="font-mono text-[13px] leading-relaxed">
                                <div className="text-zinc-600 mb-4">// Initialize LamaDB</div>
                                <div className="text-zinc-300">import <span className="text-zinc-500">{'{'}</span> lama <span className="text-zinc-500">{'}'}</span> from <span className="text-zinc-400">'@opendev-labs/lamadb'</span>;</div>
                                <div className="text-zinc-500 mt-6">const <span className="text-white">db</span> = await lama.<span className="text-white">connect</span>();</div>
                                <div className="text-zinc-500 mt-4">await <span className="text-white">db</span>.<span className="text-white">users</span>.<span className="text-white">insert</span>({'{'}</div>
                                <div className="pl-6 text-zinc-500">
                                    name: <span className="text-zinc-300">'Demo'</span>,
                                    role: <span className="text-zinc-300">'Admin'</span>
                                </div>
                                <div className="text-zinc-500">{'}'});</div>
                                <div className="text-zinc-600 mt-8">// Instant local access</div>
                                <div className="text-zinc-500">const <span className="text-white">user</span> = await <span className="text-white">db</span>.<span className="text-white">users</span>.<span className="text-white">find</span>({'{'} name: <span className="text-zinc-300">'Demo'</span> {'}'});</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

