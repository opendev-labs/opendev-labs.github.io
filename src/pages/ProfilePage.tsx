import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User as UserIcon, Briefcase, Globe, Github, Twitter, Linkedin, Mail, Shield, Zap, Database, Terminal, Code, BookOpen, Plus, ExternalLink, Settings, Award } from "lucide-react";
import { useAuth } from "../features/void/hooks/useAuth";
import { Button } from "../components/ui/shadcn/button";
import { Card } from "../components/ui/Card";
import { LamaDB } from "../lib/lamaDB";

export default function ProfilePage() {
    const { username } = useParams();
    const { user: currentUser, profile: currentProfile } = useAuth();
    const [profile, setProfile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const isOwnProfile = currentUser && (username === currentProfile?.username || username === 'profile');

    useEffect(() => {
        const fetchProfile = async () => {
            if (isOwnProfile && currentProfile) {
                setProfile(currentProfile);
                setIsLoading(false);
                return;
            }

            try {
                // Search for profile by username globally
                const userContext = { uid: 'global', email: 'global' };
                const profiles = await LamaDB.store.collection('profiles', userContext).get() as any[];
                const found = profiles.find(p => p.username === username);
                setProfile(found || null);
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [username, currentProfile, isOwnProfile]);

    if (isLoading) return null;

    if (!profile) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 bg-zinc-950 border border-zinc-900 flex items-center justify-center mb-8">
                    <Shield size={32} className="text-red-500 opacity-50" />
                </div>
                <h1 className="text-4xl font-bold tracking-tighter uppercase mb-4">Node Not Found.</h1>
                <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.4em] mb-12">The requested handle has not been materialized in the Mesh.</p>
                <Link to="/nexus">
                    <Button variant="outline" className="border-zinc-800 text-zinc-400 hover:text-white rounded-none uppercase tracking-widest text-[10px] h-12 px-8">
                        Return to Hub
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white selection:bg-orange-500 selection:text-black font-sans">
            {/* Background Atmosphere */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full opacity-[0.02]"
                    style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }}
                />
                <div className="absolute bottom-0 left-0 w-full h-[50vh] bg-gradient-to-t from-orange-600/5 to-transparent" />
            </div>

            <main className="relative z-10 max-w-[1400px] mx-auto p-6 md:p-12">
                {/* Profile Header */}
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-12 border-b border-zinc-900 pb-20 pt-10 mb-20">
                    <div className="flex flex-col md:flex-row gap-10 items-start md:items-end">
                        <div className="w-32 h-32 md:w-48 md:h-48 bg-zinc-950 border border-zinc-900 flex items-center justify-center relative group">
                            <div className="absolute inset-0 bg-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <UserIcon size={64} className="text-zinc-700 md:scale-150" />
                            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-black border border-zinc-800 flex items-center justify-center">
                                <Shield size={14} className="text-orange-500" />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <h1 className="text-6xl md:text-8xl font-bold tracking-tighter uppercase leading-none">{profile.username}</h1>
                                    <div className="px-2 py-0.5 bg-orange-600/20 border border-orange-600/30 text-[8px] font-bold text-orange-500 uppercase tracking-widest mt-4">Verified Node</div>
                                </div>
                                <p className="text-zinc-600 font-mono text-sm">@{profile.username}</p>
                            </div>
                            <div className="flex items-center gap-6">
                                <p className="text-zinc-400 text-lg md:text-xl font-medium tracking-tight uppercase tracking-widest leading-none">
                                    {profile.headline || 'Intelligence Architect'}
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <Button variant="ghost" size="icon" className="w-10 h-10 border border-zinc-900 rounded-none text-zinc-600 hover:text-white hover:border-zinc-700"><Github size={18} /></Button>
                                <Button variant="ghost" size="icon" className="w-10 h-10 border border-zinc-900 rounded-none text-zinc-600 hover:text-white hover:border-zinc-700"><Twitter size={18} /></Button>
                                <Button variant="ghost" size="icon" className="w-10 h-10 border border-zinc-900 rounded-none text-zinc-600 hover:text-white hover:border-zinc-700"><Linkedin size={18} /></Button>
                                <Button variant="ghost" size="icon" className="w-10 h-10 border border-zinc-900 rounded-none text-zinc-600 hover:text-white hover:border-zinc-700"><Globe size={18} /></Button>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-6 w-full md:w-auto">
                        {isOwnProfile ? (
                            <Link to="/settings/profile" className="w-full md:w-auto">
                                <Button className="w-full md:w-auto h-14 bg-white text-black font-bold uppercase tracking-[0.2em] text-[10px] rounded-none px-10 hover:bg-orange-500 hover:text-white transition-all">
                                    <Settings size={14} className="mr-2" />
                                    Edit Node Parameters
                                </Button>
                            </Link>
                        ) : (
                            <div className="flex gap-4 w-full md:w-auto">
                                <Button className="flex-1 md:flex-none h-14 bg-white text-black font-bold uppercase tracking-[0.2em] text-[10px] rounded-none px-10 hover:bg-orange-500 hover:text-white transition-all">Initiate Handshake</Button>
                                <Button variant="outline" className="h-14 border-zinc-800 text-zinc-400 font-bold uppercase tracking-[0.2em] text-[10px] rounded-none px-6 hover:text-white hover:border-zinc-600 transition-all"><Mail size={16} /></Button>
                            </div>
                        )}
                        <div className="flex items-center gap-4 text-right">
                            <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.4em]">Node Vitality: <span className="text-orange-500">OPTIMIZED</span></div>
                            <div className="w-2.5 h-2.5 bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)] animate-pulse" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                    {/* Main Content: Projects & Documentation */}
                    <div className="lg:col-span-8 space-y-24">
                        {/* Projects Section */}
                        <section className="space-y-12">
                            <div className="flex items-center justify-between border-b border-zinc-900 pb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                                        <Code size={14} className="text-orange-500" />
                                    </div>
                                    <h2 className="text-xl font-bold tracking-widest uppercase">Materialized Projects</h2>
                                </div>
                                {isOwnProfile && (
                                    <Button variant="ghost" className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest hover:text-white">
                                        <Plus size={14} className="mr-2" />
                                        Add New Nexus Node
                                    </Button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {[
                                    { title: "Spoon CLI Extension", desc: "A neural expansion for the universal orchestrator, adding support for multi-vector reasoning.", tech: ["Rust", "WASM", "Gemini"], stars: 45, type: "CLI" },
                                    { title: "Nexus Social Protocol", desc: "Decentralized identity layer for developer ecosystem bridging CLI and Web.", tech: ["React", "LamaDB", "Framer"], stars: 128, type: "Web" }
                                ].map((project, i) => (
                                    <Card key={i} className="p-8 bg-zinc-950/20 border border-zinc-900/50 hover:border-orange-500/30 transition-all group">
                                        <div className="flex justify-between items-start mb-8">
                                            <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                                                <Terminal size={16} className="text-zinc-500 group-hover:text-orange-500 transition-colors" />
                                            </div>
                                            <span className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest border border-zinc-900 px-2 py-1">{project.type}</span>
                                        </div>
                                        <h3 className="text-lg font-bold tracking-tight uppercase mb-4 text-white">{project.title}</h3>
                                        <p className="text-zinc-600 text-[11px] leading-relaxed mb-8 uppercase font-bold tracking-widest opacity-80">{project.desc}</p>
                                        <div className="flex flex-wrap gap-2 mb-8">
                                            {project.tech.map(t => <span key={t} className="text-[8px] font-bold text-zinc-400 uppercase tracking-[0.2em] px-2 py-0.5 bg-zinc-900/50 border border-zinc-800">{t}</span>)}
                                        </div>
                                        <div className="flex items-center justify-between pt-6 border-t border-zinc-900">
                                            <div className="flex items-center gap-3 text-zinc-600">
                                                <Award size={12} />
                                                <span className="text-[10px] font-bold uppercase tracking-widest">{project.stars} Handshakes</span>
                                            </div>
                                            <Button variant="ghost" size="icon" className="text-zinc-700 hover:text-white"><ExternalLink size={14} /></Button>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </section>

                        {/* Recent Activity / Logs */}
                        <section className="space-y-12">
                            <div className="flex items-center gap-4 border-b border-zinc-900 pb-6">
                                <div className="w-8 h-8 bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                                    <BookOpen size={14} className="text-blue-500" />
                                </div>
                                <h2 className="text-xl font-bold tracking-widest uppercase">Intelligence Stream</h2>
                            </div>

                            <div className="space-y-6">
                                {[
                                    { text: "Synchronized new project node 'Void-IDE' to global registry.", time: "2 days ago", type: "SYNC" },
                                    { text: "Established handshake with @trinity_nexus.", time: "5 days ago", type: "LINK" },
                                    { text: "Deployed high-fidelity update to Spoon core substrate.", time: "1 week ago", type: "DEPLOY" }
                                ].map((log, i) => (
                                    <div key={i} className="flex gap-6 items-start">
                                        <span className="text-[9px] font-mono text-zinc-800 pt-1 shrink-0">{log.time}</span>
                                        <div className="flex-1 pb-6 border-b border-zinc-950 font-mono text-xs">
                                            <span className="text-zinc-500 mr-4">[{log.type}]</span>
                                            <span className="text-zinc-300">{log.text}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar Stats & Meta */}
                    <div className="lg:col-span-4 space-y-16">
                        <section className="space-y-6">
                            <h3 className="text-[10px] font-bold text-zinc-700 uppercase tracking-[0.4em]">Node Parameters</h3>
                            <Card className="p-8 bg-zinc-950 border border-zinc-900 space-y-10">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                                        <span>System Mastery</span>
                                        <span className="text-orange-500">Expert</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {['Architect', 'Full-Stack', 'RUST', 'AI/ML', 'DevOps', 'Nexus-Core'].map(s => (
                                            <span key={s} className="px-3 py-1 bg-zinc-900 border border-zinc-800 text-[9px] font-bold tracking-widest uppercase text-zinc-400">{s}</span>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4 pt-10 border-t border-zinc-900">
                                    <h4 className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Intelligence Distribution</h4>
                                    <div className="space-y-4">
                                        {[
                                            { label: 'Engineering', val: 85, color: 'bg-orange-600' },
                                            { label: 'Product', val: 70, color: 'bg-blue-600' },
                                            { label: 'Research', val: 92, color: 'bg-purple-600' }
                                        ].map(stat => (
                                            <div key={stat.label} className="space-y-2">
                                                <div className="flex justify-between text-[8px] font-bold uppercase tracking-[0.2em]">
                                                    <span className="text-zinc-500">{stat.label}</span>
                                                    <span className="text-white">{stat.val}%</span>
                                                </div>
                                                <div className="w-full h-[2px] bg-zinc-900">
                                                    <div className={`h-full ${stat.color}`} style={{ width: `${stat.val}%` }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Card>
                        </section>

                        <section className="space-y-6">
                            <h3 className="text-[10px] font-bold text-zinc-700 uppercase tracking-[0.4em]">Mesh Metadata</h3>
                            <div className="space-y-4">
                                {[
                                    { label: "Joined Mesh", val: profile.joinedAt ? new Date(profile.joinedAt).toLocaleDateString() : "Feb 2026" },
                                    { label: "Location", val: "San Francisco / Neural Hub" },
                                    { label: "Active Project", val: "opendev-labs" },
                                    { label: "Node ID", val: profile.id?.slice(0, 12) || "ID#NEX-8812" }
                                ].map(item => (
                                    <div key={item.label} className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest border-b border-zinc-900 pb-3">
                                        <span className="text-zinc-700">{item.label}</span>
                                        <span className="text-zinc-400">{item.val}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="p-8 bg-zinc-900/30 border border-dashed border-zinc-800 flex flex-col items-center text-center space-y-6">
                            <Zap size={24} className="text-zinc-800" />
                            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.3em] leading-loose">
                                This node is synchronized with the Hardline Protocol. All data is immutable and sovereign.
                            </p>
                            <Button variant="ghost" className="text-[9px] font-bold text-orange-500 uppercase tracking-widest hover:text-white">
                                View Technical Manifest
                            </Button>
                        </section>
                    </div>
                </div>

                <div className="h-32" />
            </main>
        </div>
    );
}
