import { useRef } from 'react';
import { Database, Shield, Zap, Globe, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import HeroBg from '../assets/bg.png';

export default function LamaDB() {
    return (
        <div className="flex flex-col w-full min-h-screen bg-black text-white selection:bg-orange-500/30">
            {/* Hero Section */}
            <section className="relative min-h-[80vh] flex flex-col items-center justify-center pt-20 overflow-hidden border-b border-[#333]">
                <div className="absolute inset-0 z-0">
                    <img src={HeroBg} alt="Background" className="w-full h-full object-cover opacity-30" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
                </div>

                <div className="relative z-10 text-center max-w-4xl px-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-sm text-orange-400 mb-8">
                        <Database size={14} />
                        <span>Native Browser Database</span>
                    </div>

                    <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-8 text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500">
                        LamaDB
                    </h1>
                    <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        The world's first high-performance database designed to run entirely within the browser context.
                        Zero latency, offline-first, and cryptographically secure.
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                        <Link to="/ide" className="h-12 px-8 rounded-full bg-orange-500 text-black font-bold hover:bg-orange-400 transition-colors flex items-center gap-2">
                            Start Building <ArrowRight size={16} />
                        </Link>
                        <Link to="/docs" className="h-12 px-8 rounded-full bg-black border border-[#333] text-white hover:bg-[#111] transition-colors flex items-center justify-center">
                            Read Documentation
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-black">
                <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="p-8 border border-[#222] rounded-2xl bg-[#050505] hover:border-orange-500/30 transition-colors">
                        <Zap className="mb-6 text-orange-500" size={32} />
                        <h3 className="text-xl font-bold mb-3">Instant Sync</h3>
                        <p className="text-zinc-500">
                            State changes are synchronized instantly across all connected clients using our quantum-entangled WebSocket mesh.
                        </p>
                    </div>
                    <div className="p-8 border border-[#222] rounded-2xl bg-[#050505] hover:border-orange-500/30 transition-colors">
                        <Shield className="mb-6 text-orange-500" size={32} />
                        <h3 className="text-xl font-bold mb-3">Local Encryption</h3>
                        <p className="text-zinc-500">
                            Data is encrypted-at-rest in IndexedDB and in-transit using military-grade ChaCha20-Poly1305.
                        </p>
                    </div>
                    <div className="p-8 border border-[#222] rounded-2xl bg-[#050505] hover:border-orange-500/30 transition-colors">
                        <Globe className="mb-6 text-orange-500" size={32} />
                        <h3 className="text-xl font-bold mb-3">Edge Replication</h3>
                        <p className="text-zinc-500">
                            Automatically replicate your dataset to 250+ edge locations for sub-10ms read latency worldwide.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
