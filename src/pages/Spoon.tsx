import { Terminal, Shield, Zap, Cpu, ArrowRight, Code, Command, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Spoon() {
    return (
        <div className="flex flex-col w-full bg-black text-white selection:bg-green-500 selection:text-black">
            {/* Hero Section */}
            <section className="relative min-h-[85vh] flex flex-col items-center justify-center pt-20 overflow-hidden border-b border-zinc-900">
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[700px] bg-green-500/5 blur-[150px] rounded-full" />
                    {/* Matrix-like vertical line effect */}
                    <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(0,255,65,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
                </div>

                <div className="relative z-10 text-center max-w-5xl px-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-bold text-green-500 mb-8 uppercase tracking-[0.3em] animate-pulse">
                        <Terminal size={12} />
                        <span>Universal AI Command Center</span>
                    </div>

                    <h1 className="text-7xl md:text-9xl font-bold tracking-tighter mb-8 leading-[0.85] uppercase">
                        SPOON<span className="text-green-500">_</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-zinc-500 max-w-3xl mx-auto mb-12 font-medium leading-relaxed tracking-tight">
                        The agentic bridge between the Matrix and your local terminal.
                        A high-fidelity CLI ecosystem designed for the next generation of autonomous development.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <a href="https://github.com/opendev-labs/spoon" className="w-full sm:w-auto h-14 px-12 rounded-full bg-white text-black text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-green-500 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-xl shadow-green-500/20">
                            Install Spoon <ArrowRight size={16} />
                        </a>
                        <Link to="/auth" className="w-full sm:w-auto h-14 px-12 rounded-full bg-black border border-zinc-800 text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:border-green-500 transition-all hover:scale-105 active:scale-95 flex items-center justify-center shadow-lg">
                            Login to Nexus
                        </Link>
                    </div>
                </div>

                {/* Sub-hero stats */}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-12 text-[10px] uppercase tracking-[0.4em] font-bold text-zinc-600">
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-white text-lg tracking-normal">11.11.0</span>
                        <span>Latest Release</span>
                    </div>
                    <div className="w-px h-8 bg-zinc-800" />
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-green-500 text-lg tracking-normal">∞</span>
                        <span>Evolution Points</span>
                    </div>
                </div>
            </section>

            {/* Feature Grid: Agents */}
            <section className="py-40 bg-zinc-950/50">
                <div className="max-w-[1200px] mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-zinc-900 border border-zinc-900 overflow-hidden">
                        {/* Trinity */}
                        <div className="group p-12 bg-black hover:bg-zinc-950 transition-all duration-700">
                            <Shield className="mb-10 text-green-500 group-hover:scale-110 transition-transform" size={24} />
                            <h3 className="text-xs font-bold uppercase tracking-[0.3em] mb-6 text-white flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                Trinity Companion
                            </h3>
                            <p className="text-[13px] font-medium text-zinc-500 leading-relaxed uppercase tracking-wide">
                                Your autonomous guide within the system. Predicts intent, automates complex workflows, and handles state synchronization.
                            </p>
                        </div>
                        {/* Tank */}
                        <div className="group p-12 bg-black hover:bg-zinc-950 transition-all duration-700">
                            <Zap className="mb-10 text-yellow-500 group-hover:scale-110 transition-transform" size={24} />
                            <h3 className="text-xs font-bold uppercase tracking-[0.3em] mb-6 text-white flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                                Tank Operator
                            </h3>
                            <p className="text-[13px] font-medium text-zinc-500 leading-relaxed uppercase tracking-wide">
                                The execution engine. Directly interfaces with the shell to build, deploy, and fix local infrastructure in real-time.
                            </p>
                        </div>
                        {/* Mouse */}
                        <div className="group p-12 bg-black hover:bg-zinc-950 transition-all duration-700">
                            <Search className="mb-10 text-blue-500 group-hover:scale-110 transition-transform" size={24} />
                            <h3 className="text-xs font-bold uppercase tracking-[0.3em] mb-6 text-white flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                Mouse Programmer
                            </h3>
                            <p className="text-[13px] font-medium text-zinc-500 leading-relaxed uppercase tracking-wide">
                                Deep analysis agent. Identifies security vulnerabilities, logic flaws, and architectural optimizations across your repos.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Code Block Section */}
            <section className="py-40 border-t border-zinc-900">
                <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                    <div>
                        <h2 className="text-5xl font-bold tracking-tighter mb-8 leading-[1] uppercase">
                            Reality is <br /><span className="text-zinc-600">Programmable.</span>
                        </h2>
                        <div className="space-y-12">
                            <div className="flex gap-6">
                                <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 flex items-center justify-center font-mono text-[10px] text-green-500 shrink-0">01</div>
                                <div className="space-y-3">
                                    <h4 className="text-sm font-bold uppercase tracking-widest text-white">Unified Identity</h4>
                                    <p className="text-[12px] font-medium text-zinc-500 leading-relaxed uppercase tracking-wider">
                                        Sync your local progress and tokens across all systems via the OpenDev-Labs Nexus.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-6">
                                <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 flex items-center justify-center font-mono text-[10px] text-green-500 shrink-0">02</div>
                                <div className="space-y-3">
                                    <h4 className="text-sm font-bold uppercase tracking-widest text-white">Hardline Protocol</h4>
                                    <p className="text-[12px] font-medium text-zinc-500 leading-relaxed uppercase tracking-wider">
                                        Enterprise-grade API gateway for secure communication between agents and external LLM providers.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative group">
                        <div className="absolute inset-0 bg-green-500/10 blur-[80px] rounded-full group-hover:bg-green-500/20 transition-all duration-1000" />
                        <div className="relative bg-zinc-950 border border-zinc-900 p-8 rounded-2xl shadow-3xl font-mono text-[12px] overflow-hidden">
                            <div className="flex items-center gap-2 mb-8 border-b border-zinc-900 pb-4">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-900" />
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-900" />
                                <div className="w-2.5 h-2.5 rounded-full bg-green-900" />
                                <span className="ml-4 text-zinc-700 uppercase tracking-widest">spoon-terminal</span>
                            </div>
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <span className="text-zinc-700">$</span>
                                    <span className="text-white font-bold tracking-tight">spoon opendev-labs login</span>
                                </div>
                                <div className="text-green-500 ml-8 leading-tight">
                                    VERIFYING CREDENTIALS...<br />
                                    SYNCING CLOUD DATA...<br />
                                </div>
                                <div className="text-white font-bold ml-8 animate-in fade-in duration-1000 delay-500">
                                    MATRIX: "Welcome back, The One."<br />
                                    IDENTITY: OPENDEV-LABS<br />
                                    STATUS: UNLIMITED ACCESS GRANTED
                                </div>
                                <div className="flex gap-4 mt-8">
                                    <span className="text-zinc-700">$</span>
                                    <span className="text-white font-bold tracking-tight pulsate-cursor">spoon _</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-60 text-center border-t border-zinc-900 relative h-full flex flex-col items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,65,0.05)_0%,transparent_70%)]" />
                <h2 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase mb-12 relative z-10 leading-[0.9]">
                    Free your mind.<br /><span className="text-zinc-600">Connect the Nexus.</span>
                </h2>
                <Link to="/auth" className="group h-16 px-16 rounded-full bg-white text-black text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-green-500 transition-all relative z-10 flex items-center justify-center gap-4 hover:scale-105">
                    Ascend Now <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                </Link>
            </section>
        </div>
    );
}
