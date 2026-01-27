import { Server, Zap, Shield, Cpu, Cloud, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import HeroBg from '../assets/bg.png';

export default function QCloud() {
    return (
        <div className="flex flex-col w-full min-h-screen bg-black text-white selection:bg-purple-500/30">
            {/* Hero Section */}
            <section className="relative min-h-[80vh] flex flex-col items-center justify-center pt-20 overflow-hidden border-b border-[#333]">
                <div className="absolute inset-0 z-0">
                    <img src={HeroBg} alt="Background" className="w-full h-full object-cover opacity-20 contrast-125" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-transparent" />
                </div>

                <div className="relative z-10 text-center max-w-4xl px-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-sm text-purple-400 mb-8">
                        <Cloud size={14} />
                        <span>Quantum Infrastructure</span>
                    </div>

                    <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-8 text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500">
                        Q-Cloud
                    </h1>
                    <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed text-balance">
                        The sovereign compute layer for a faster reality.
                        Global, serverless, and optimized for high-velocity and AI-driven applications.
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                        <Link to="/ide" className="h-12 px-8 rounded-full bg-purple-600 text-white font-bold hover:bg-purple-500 transition-colors flex items-center gap-2 shadow-lg shadow-purple-500/20">
                            Deploy to Q-Cloud <ArrowRight size={16} />
                        </Link>
                        <Link to="/enterprise" className="h-12 px-8 rounded-full bg-black border border-[#333] text-white hover:bg-[#111] transition-colors flex items-center justify-center">
                            Talk to Sales
                        </Link>
                    </div>
                </div>
            </section>

            {/* What is Q-Cloud Section */}
            <section className="py-24 bg-[#020202]">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-bold mb-8">What is Q-Cloud?</h2>
                            <p className="text-zinc-400 text-lg leading-relaxed mb-6">
                                Q-Cloud is OpenDev Labs' specialized cloud infrastructure designed to bridge the gap between traditional compute and quantum-ready architectures. It provides a global edge network that prioritizes speed, security, and developer sovereignty.
                            </p>
                            <p className="text-zinc-500 text-base leading-relaxed mb-8">
                                Unlike traditional clouds that treat compute as a commodity, Q-Cloud treats it as a precision instrument. Every function invocation, every byte stored, and every packet sent is optimized for the lowest possible latency and maximum reliability.
                            </p>

                            <ul className="space-y-4">
                                <li className="flex gap-3 items-start">
                                    <div className="mt-1 p-1 bg-purple-500/10 rounded flex-shrink-0"><Zap size={16} className="text-purple-400" /></div>
                                    <div>
                                        <h4 className="font-bold text-white">Sub-atomic Latency</h4>
                                        <p className="text-sm text-zinc-500">Deploy your logic milliseconds away from your users with our ultra-edge clusters.</p>
                                    </div>
                                </li>
                                <li className="flex gap-3 items-start">
                                    <div className="mt-1 p-1 bg-purple-500/10 rounded flex-shrink-0"><Shield size={16} className="text-purple-400" /></div>
                                    <div>
                                        <h4 className="font-bold text-white">Quantum Encryption</h4>
                                        <p className="text-sm text-zinc-500">Protect your intellectual property with future-proof cryptographic standards.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                            <div className="relative bg-black border border-[#222] rounded-2xl p-8 h-full">
                                <div className="flex gap-2 mb-6">
                                    <div className="w-3 h-3 rounded-full bg-red-500/20" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/20" />
                                </div>
                                <div className="space-y-4 font-mono text-sm">
                                    <p className="text-purple-400"># Q-Cloud Node Stats</p>
                                    <p className="text-zinc-500">Region: us-east-quantum-1</p>
                                    <p className="text-zinc-500">Available Compute: <span className="text-green-400">99.98%</span></p>
                                    <p className="text-zinc-500">Active Workloads: <span className="text-blue-400">142,402</span></p>
                                    <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                                        <div className="h-full bg-purple-500 w-3/4 animate-pulse" />
                                    </div>
                                    <p className="text-xs text-zinc-600 mt-8">// Sovereignty protocol enabled</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Capabilities */}
            <section className="py-24 bg-black">
                <div className="max-w-6xl mx-auto px-6">
                    <h2 className="text-3xl font-bold mb-16 text-center">Core Infrastructure</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-8 border border-[#222] rounded-2xl bg-[#050505] hover:border-purple-500/30 transition-all group">
                            <Server className="mb-6 text-purple-500 group-hover:scale-110 transition-transform" size={32} />
                            <h3 className="text-xl font-bold mb-3">Edge Functions</h3>
                            <p className="text-zinc-500">
                                Run your backend logic closer to the user. No cold starts, just instantaneous execution.
                            </p>
                        </div>
                        <div className="p-8 border border-[#222] rounded-2xl bg-[#050505] hover:border-purple-500/30 transition-all group">
                            <Cpu className="mb-6 text-purple-500 group-hover:scale-110 transition-transform" size={32} />
                            <h3 className="text-xl font-bold mb-3">Sovereign VMs</h3>
                            <p className="text-zinc-500">
                                Dedicated hardware resources that you truly own. No noisy neighbors, no shared kernels.
                            </p>
                        </div>
                        <div className="p-8 border border-[#222] rounded-2xl bg-[#050505] hover:border-purple-500/30 transition-all group">
                            <Shield className="mb-6 text-purple-500 group-hover:scale-110 transition-transform" size={32} />
                            <h3 className="text-xl font-bold mb-3">Quantum Gateways</h3>
                            <p className="text-zinc-500">
                                Zero-trust networking with automated certificate rotation and DDoS protection built-in.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
