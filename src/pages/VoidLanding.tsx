import { Terminal, Cpu, Layout, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import HeroBg from '../assets/bg.png';

export default function VoidLanding() {
    return (
        <div className="flex flex-col w-full min-h-screen bg-black text-white selection:bg-blue-500/30">
            {/* Hero Section */}
            <section className="relative min-h-[80vh] flex flex-col items-center justify-center pt-20 overflow-hidden border-b border-[#333]">
                <div className="absolute inset-0 z-0">
                    <img src={HeroBg} alt="Background" className="w-full h-full object-cover opacity-30 invert-[.05]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
                </div>

                <div className="relative z-10 text-center max-w-4xl px-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-sm text-blue-400 mb-8">
                        <Terminal size={14} />
                        <span>Sovereign AI Environment</span>
                    </div>

                    <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-8 text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500">
                        Void
                    </h1>
                    <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        The last development environment you'll ever need.
                        AI-native, terminal-centric, and built for the high-velocity developer.
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                        <Link to="/ide" className="h-12 px-8 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-500 transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/20">
                            Launch Void <ArrowRight size={16} />
                        </Link>
                        <Link to="/pricing" className="h-12 px-8 rounded-full bg-black border border-[#333] text-white hover:bg-[#111] transition-colors flex items-center justify-center">
                            View Pricing
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-black">
                <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="p-8 border border-[#222] rounded-2xl bg-[#050505] hover:border-blue-500/30 transition-colors">
                        <Terminal className="mb-6 text-blue-500" size={32} />
                        <h3 className="text-xl font-bold mb-3">Intelligent CLI</h3>
                        <p className="text-zinc-500">
                            Poly CLI understands your intent. "poly deploy production" is all you need to say.
                        </p>
                    </div>
                    <div className="p-8 border border-[#222] rounded-2xl bg-[#050505] hover:border-blue-500/30 transition-colors">
                        <Cpu className="mb-6 text-blue-500" size={32} />
                        <h3 className="text-xl font-bold mb-3">Neural Code Gen</h3>
                        <p className="text-zinc-500">
                            Built-in LLMs predict your next move, generating boilerplate, tests, and documentation in real-time.
                        </p>
                    </div>
                    <div className="p-8 border border-[#222] rounded-2xl bg-[#050505] hover:border-blue-500/30 transition-colors">
                        <Layout className="mb-6 text-blue-500" size={32} />
                        <h3 className="text-xl font-bold mb-3">Visual Workbench</h3>
                        <p className="text-zinc-500">
                            Toggle between code and architecture view. Drag-and-drop cloud resources to provision infrastructure.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
