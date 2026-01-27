import { Link } from 'react-router-dom';
import { Terminal, Database, Cpu, Globe, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import HeroBg from '../assets/bg.png';

export default function Home() {
    return (
        <div className="flex flex-col w-full">
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex flex-col items-center justify-start pt-32 pb-20 overflow-hidden border-b border-[#333]">
                {/* Background Image with Cinematic Blur */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <img
                        src={HeroBg}
                        alt="Background"
                        className="w-full h-full object-cover opacity-80 scale-105"
                    />

                    {/* Dark Vignette Overlay - Darker at edges */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background: 'radial-gradient(circle at center, transparent 5%, rgba(0,0,0,0.95) 45%, #000 75%)'
                        }}
                    />
                </div>

                <div className="relative z-10 text-center max-w-5xl px-6">
                    {/* Transparent Text Container */}
                    <div className="p-8 md:p-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 border border-white/10 text-sm text-zinc-200 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 backdrop-blur-sm">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span>LamaDB 2.0 is now available in Beta</span>
                        </div>

                        <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-8 text-white drop-shadow-xl leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
                            Build and deploy <br /> on the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 drop-shadow-none">Q-Cloud</span>.
                        </h1>
                        <p className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow-lg font-medium animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                            opendev-labs provides the sovereign tools and quantum infrastructure to build, scale, and secure a faster, more programmable reality.
                        </p>

                        <div className="flex flex-col md:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                            <Link to="/ide" className="h-12 px-8 rounded-full bg-white text-black font-medium hover:bg-gray-200 transition-colors flex items-center gap-2 justify-center shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 duration-200">
                                <svg className="w-4 h-4" viewBox="0 0 116 100" fill="currentColor"><path fillRule="evenodd" clipRule="evenodd" d="M57.5 100L0 0H116L57.5 100Z" /></svg>
                                Enter Void
                            </Link>
                            <Link to="/contact" className="h-12 px-8 rounded-full bg-black/80 text-white border border-white/20 font-medium hover:bg-black transition-all flex items-center justify-center hover:border-white/40 shadow-lg">
                                Contact Sales
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 border-b border-[#333] relative">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">The OpenDev Stack</h2>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/40">
                            BUILD THE FUTURE AT <br />
                            <span className="text-orange-500">OPENDEV-LABS.</span>
                        </h1>        <div className="group border border-[#333] bg-[#050505] p-8 rounded-2xl hover:border-white/20 transition-colors">
                            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-6 text-blue-400">
                                <Terminal size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Void Environment</h3>
                            <p className="text-[#666] leading-relaxed mb-6">An AI-powered development environment that writes code, manages deployments, and scales your applications automatically.</p>
                            <Link to="/void" className="text-sm font-medium flex items-center gap-1 hover:text-blue-400 transition-colors">Explore Void <ArrowRight size={14} /></Link>
                        </div>

                        <div className="group border border-[#333] bg-[#050505] p-8 rounded-2xl hover:border-white/20 transition-colors">
                            <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mb-6 text-orange-400">
                                <Database size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">LamaDB</h3>
                            <p className="text-[#666] leading-relaxed mb-6">The native database for the frontend web. Store, sync, and visualize your data directly from your browser or personal device.</p>
                            <Link to="/lamadb" className="text-sm font-medium flex items-center gap-1 hover:text-orange-400 transition-colors">Learn about LamaDB <ArrowRight size={14} /></Link>
                        </div>

                        <div className="group border border-[#333] bg-[#050505] p-8 rounded-2xl hover:border-white/20 transition-colors">
                            <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-6 text-purple-400">
                                <Cpu size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Q-Cloud Compute</h3>
                            <p className="text-[#666] leading-relaxed mb-6">Serverless infrastructure that scales to zero and up to infinity. Run your functions closer to your users.</p>
                            <Link to="/q-cloud" className="text-sm font-medium flex items-center gap-1 hover:text-purple-400 transition-colors">View Infrastructure <ArrowRight size={14} /></Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Code / Terminal Section */}
            <section className="py-24 border-b border-[#333] bg-[#050505]">
                <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
                    <div className="flex-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-sm text-blue-400 mb-6 font-mono">
                            $ poly init
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Develop at the speed of thought.</h2>
                        <p className="text-[#888] text-lg leading-relaxed mb-8">
                            With the Poly CLI and Void integration, you can bootstrap, deploy, and monitor your applications without leaving your terminal.
                        </p>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center gap-3 text-[#ccc]">
                                <ShieldCheck className="text-green-500" size={20} />
                                <span>Enterprise-grade security by default</span>
                            </li>
                            <li className="flex items-center gap-3 text-[#ccc]">
                                <Globe className="text-blue-500" size={20} />
                                <span>Global edge network deployment</span>
                            </li>
                            <li className="flex items-center gap-3 text-[#ccc]">
                                <Zap className="text-yellow-500" size={20} />
                                <span>Instant rollbacks and immutable logs</span>
                            </li>
                        </ul>
                    </div>
                    <div className="flex-1 w-full relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg opacity-20 blur transition duration-1000 group-hover:opacity-40"></div>
                        <div className="relative bg-[#0a0a0a] rounded-lg border border-[#333] p-4 font-mono text-sm leading-relaxed overflow-hidden shadow-2xl">
                            <div className="flex items-center gap-2 mb-4 border-b border-[#333] pb-4">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                <span className="ml-2 text-[#666]">cube@opendev-labs:~/project</span>
                            </div>
                            <div className="space-y-2">
                                <p className="text-[#888]"><span className="text-green-400">$</span> poly create lama-db-instance</p>
                                <p className="text-[#ccc]">Creating LamaDB instance 'production-db'...</p>
                                <p className="text-[#ccc]">Provisioning storage... <span className="text-green-400">Done (0.4s)</span></p>
                                <p className="text-[#ccc]">Generating API keys... <span className="text-green-400">Done (0.1s)</span></p>
                                <p className="text-[#888] mt-4"><span className="text-green-400">$</span> poly deploy --env production</p>
                                <p className="text-[#ccc]">Building project...</p>
                                <p className="text-[#ccc]">Uploading assets [====================] 100%</p>
                                <p className="text-white font-bold mt-2">Deployment Complete: <span className="text-blue-400 underline">https://project.opendev-labs.io</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
