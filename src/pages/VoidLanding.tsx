import { Terminal, Cpu, Layout, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import HeroBg from '../assets/bg.png';

export default function VoidLanding() {
    return (
        <div className="flex flex-col w-full min-h-screen bg-black text-white selection:bg-orange-500/30">
            {/* Hero Section */}
            <section className="relative min-h-[80vh] flex flex-col items-center justify-center pt-20 overflow-hidden border-b border-[#333]">
                <div className="absolute inset-0 z-0">
                    <img src={HeroBg} alt="Background" className="w-full h-full object-cover opacity-30 invert-[.05]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
                </div>

                <div className="relative z-10 text-center max-w-4xl px-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-orange-500/10 border border-orange-500/20 text-sm text-orange-400 mb-8 uppercase tracking-[0.2em]">
                        <Terminal size={14} />
                        <span>Titan // Sovereign AI Environment</span>
                    </div>

                    <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-8 text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500 lowercase">
                        Void.
                    </h1>
                    <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        The last development environment you'll ever need.
                        AI-native, terminal-centric, and built for the high-velocity developer.
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                        <Link to="/open-studio" className="h-12 px-8 rounded-none bg-orange-600 text-white font-bold hover:bg-orange-500 transition-colors flex items-center gap-2 shadow-lg shadow-orange-500/20 uppercase tracking-widest text-xs">
                            Launch open-studio IDE <ArrowRight size={16} />
                        </Link>
                        <Link to="/void/dashboard" className="h-12 px-8 rounded-none bg-black border border-[#333] text-white hover:bg-zinc-900 transition-colors flex items-center justify-center uppercase tracking-widest text-[10px] font-bold">
                            Manage Platform
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-black">
                <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="p-8 border border-[#222] rounded-none bg-[#050505] hover:border-orange-500/30 transition-colors group">
                        <Terminal className="mb-6 text-orange-500 group-hover:scale-110 transition-transform" size={32} />
                        <h3 className="text-xl font-bold mb-3 uppercase tracking-tight">Intelligent CLI</h3>
                        <p className="text-zinc-500">
                            Spoon CLI understands your intent. "spoon deploy production" is all you need to say.
                        </p>
                    </div>
                    <div className="p-8 border border-[#222] rounded-none bg-[#050505] hover:border-orange-500/30 transition-colors group">
                        <Cpu className="mb-6 text-orange-500 group-hover:scale-110 transition-transform" size={32} />
                        <h3 className="text-xl font-bold mb-3 uppercase tracking-tight">Neural Code Gen</h3>
                        <p className="text-zinc-500">
                            Built-in LLMs predict your next move, generating boilerplate, tests, and documentation in real-time.
                        </p>
                    </div>
                    <div className="p-8 border border-[#222] rounded-none bg-[#050505] hover:border-orange-500/30 transition-colors group">
                        <Layout className="mb-6 text-orange-500 group-hover:scale-110 transition-transform" size={32} />
                        <h3 className="text-xl font-bold mb-3 uppercase tracking-tight">Visual Workbench</h3>
                        <p className="text-zinc-500">
                            Toggle between code and architecture view. Drag-and-drop cloud resources to provision infrastructure.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
