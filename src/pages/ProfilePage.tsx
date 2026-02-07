import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User as UserIcon, Briefcase, Globe, Github, Twitter, Linkedin, Mail, Shield, Zap, Database, Terminal, Code, BookOpen, Plus, ExternalLink, Settings, Award, MapPin, Calendar, Link as LinkIcon, Users, Box, Heart, Sparkles } from "lucide-react";
import { useAuth } from "../features/void/hooks/useAuth";
import { Button } from "../components/ui/shadcn/button";
import { Card } from "../components/ui/Card";
import { LamaDB } from "../lib/lamaDB";

export default function ProfilePage() {
    const { username } = useParams();
    const { user: currentUser, profile: currentProfile } = useAuth();
    const [profile, setProfile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const isOwnProfile = currentUser && (
        !username ||
        username === 'profile' ||
        username === currentProfile?.username
    );

    useEffect(() => {
        const fetchProfile = async () => {
            if (isOwnProfile && currentProfile) {
                setProfile(currentProfile);
                setIsLoading(false);
                return;
            }

            if (!username || username === 'profile') {
                if (!currentUser) {
                    setIsLoading(false);
                    return;
                }
                // If we are here, it means currentProfile might be loading or missing
                if (currentProfile) {
                    setProfile(currentProfile);
                    setIsLoading(false);
                    return;
                }
            }

            try {
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
    }, [username, currentProfile, isOwnProfile, currentUser]);

    if (isLoading) return null;

    if (!profile) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center font-sans">
                <div className="w-20 h-20 bg-zinc-950 border border-zinc-900 flex items-center justify-center mb-8 rounded-2xl rotate-3">
                    <Shield size={36} className="text-red-500 opacity-50 -rotate-3" />
                </div>
                <h1 className="text-4xl font-bold tracking-tighter uppercase mb-4">Profile Not Found.</h1>
                <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.4em] mb-12 leading-relaxed">The requested person has not joined the network yet.</p>
                <Link to="/nexus">
                    <Button variant="outline" className="border-zinc-800 text-zinc-400 hover:text-white rounded-xl uppercase tracking-widest text-[10px] h-12 px-8 transition-all">
                        Return to Hub
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-orange-500 selection:text-black font-sans pb-20">
            {/* Header / Banner Section */}
            <div className="relative h-[25vh] md:h-[35vh] w-full bg-zinc-900 overflow-hidden">
                {profile.bannerUrl ? (
                    <img src={profile.bannerUrl} alt="Banner" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-r from-orange-600 to-orange-400 opacity-30" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            </div>

            <main className="max-w-[1200px] mx-auto px-4 md:px-8 relative">
                {/* Profile Header Card */}
                <div className="flex flex-col md:flex-row gap-8 items-end -mt-20 mb-12">
                    <div className="w-32 h-32 md:w-44 md:h-44 rounded-3xl border-8 border-black bg-zinc-900 overflow-hidden shadow-2xl shrink-0 relative z-10">
                        <img src={profile.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`} alt="Profile" className="w-full h-full object-cover" />
                    </div>

                    <div className="grow pb-2 space-y-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 w-full">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <h1 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase leading-none">{profile.username}</h1>
                                    <div className="bg-orange-600/20 border border-orange-600/30 p-1 rounded-full"><Shield size={12} className="text-orange-500" /></div>
                                </div>
                                <p className="text-zinc-500 text-sm font-medium uppercase tracking-[0.2em]">@{profile.username}</p>
                            </div>

                            <div className="flex gap-3">
                                {isOwnProfile ? (
                                    <Link to="/settings/profile">
                                        <Button className="bg-white text-black font-bold uppercase tracking-widest text-[10px] rounded-xl px-10 hover:bg-orange-500 hover:text-white transition-all h-12 shadow-lg">
                                            <Settings size={14} className="mr-2" />
                                            Edit Profile
                                        </Button>
                                    </Link>
                                ) : (
                                    <>
                                        <Button className="bg-white text-black font-bold uppercase tracking-widest text-[10px] rounded-xl px-10 hover:bg-orange-500 hover:text-white transition-all h-12 shadow-lg">Connect</Button>
                                        <Button variant="outline" className="border-zinc-800 text-zinc-400 rounded-xl px-4 hover:text-white hover:border-zinc-600 h-12 transition-all"><Mail size={16} /></Button>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest pt-2">
                            <div className="flex items-center gap-2"><MapPin size={14} className="text-orange-500" /> <span>Remote / Earth</span></div>
                            <div className="flex items-center gap-2"><Calendar size={14} className="text-orange-500" /> <span>Joined {profile.joinedAt ? new Date(profile.joinedAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : "Recently"}</span></div>
                            <div className="flex items-center gap-2"><LinkIcon size={14} className="text-orange-500" /> <span className="text-zinc-300">opendev.io/{profile.username}</span></div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Main Content Area */}
                    <div className="lg:col-span-8 space-y-12">
                        {/* Bio / About */}
                        <section className="bg-zinc-950 border border-zinc-900 rounded-3xl p-8 shadow-xl">
                            <h2 className="text-sm font-bold tracking-widest uppercase text-zinc-400 mb-6 flex items-center gap-2">
                                <UserIcon size={16} className="text-orange-500" /> About
                            </h2>
                            <p className="text-zinc-300 text-lg leading-relaxed font-medium">
                                {profile.bio || "No biography provided yet. This professional is part of the Nexus network."}
                            </p>
                        </section>

                        {/* Professional Stats Row */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: 'Connections', val: '128', icon: Users, color: 'text-blue-500' },
                                { label: 'Projects', val: '12', icon: Code, color: 'text-orange-500' },
                                { label: 'Reputation', val: '4.2k', icon: Award, color: 'text-emerald-500' },
                                { label: 'Pulse', val: '86', icon: Zap, color: 'text-purple-500' }
                            ].map((stat, i) => (
                                <Card key={i} className="bg-zinc-950 border-zinc-900 p-6 rounded-2xl shadow-xl hover:border-zinc-700 transition-all flex flex-col items-center justify-center text-center group">
                                    <div className={`p-3 rounded-2xl bg-zinc-900 mb-4 group-hover:scale-110 transition-transform ${stat.color} opacity-80`}>
                                        <stat.icon size={20} />
                                    </div>
                                    <div className="text-2xl font-bold tracking-tighter mb-1">{stat.val}</div>
                                    <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">{stat.label}</div>
                                </Card>
                            ))}
                        </div>

                        {/* Recent Projects */}
                        <section className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-sm font-bold tracking-widest uppercase text-zinc-400 flex items-center gap-2">
                                    <Box size={16} className="text-orange-500" /> Recent Projects
                                </h2>
                                <Button variant="ghost" className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest hover:text-white">View All</Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    { title: "Nexus Social Hub", desc: "A premium social protocol for professionals and developers.", tags: ["React", "UI/UX"], stars: 124 },
                                    { title: "OpenStudio Toolkit", desc: "High-performance creative tools built for the decentralized era.", tags: ["Rust", "WASM"], stars: 89 }
                                ].map((p, i) => (
                                    <Card key={i} className="bg-zinc-950 border-zinc-900 p-8 rounded-2xl shadow-xl hover:border-orange-500/20 transition-all group">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="p-3 rounded-xl bg-zinc-900 group-hover:bg-orange-500/10 transition-colors">
                                                <Terminal size={18} className="text-zinc-600 group-hover:text-orange-500" />
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-700">
                                                <Heart size={12} /> {p.stars}
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-bold tracking-tight uppercase mb-3 text-white group-hover:text-orange-500 transition-colors">{p.title}</h3>
                                        <p className="text-zinc-500 text-xs leading-relaxed font-medium mb-6">{p.desc}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {p.tags.map(t => <span key={t} className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest px-2 py-1 bg-zinc-900 border border-zinc-800 rounded-md">{t}</span>)}
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar Area */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Skills & Expertise */}
                        <Card className="bg-zinc-950 border-zinc-900 p-8 rounded-3xl shadow-xl">
                            <h3 className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
                                <Sparkles size={14} className="text-orange-500" /> Expertise
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {['Software Architecture', 'Interaction Design', 'Product Management', 'Branding', 'Open Source', 'Community'].map(skill => (
                                    <span key={skill} className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 text-[10px] font-bold tracking-widest uppercase text-zinc-400 rounded-lg hover:text-white transition-colors cursor-default">{skill}</span>
                                ))}
                            </div>
                        </Card>

                        {/* Social Links */}
                        <Card className="bg-zinc-950 border-zinc-900 p-8 rounded-3xl shadow-xl">
                            <h3 className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.3em] mb-8">Social Presence</h3>
                            <div className="space-y-4">
                                {[
                                    { icon: Github, label: 'GitHub', val: `@${profile.username}` },
                                    { icon: Twitter, label: 'Twitter', val: `@${profile.username}_x` },
                                    { icon: Linkedin, label: 'LinkedIn', val: profile.username }
                                ].map((social, i) => (
                                    <div key={i} className="flex items-center justify-between group cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-zinc-900 group-hover:bg-zinc-800 transition-colors"><social.icon size={16} className="text-zinc-500 group-hover:text-white" /></div>
                                            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-tight">{social.label}</span>
                                        </div>
                                        <span className="text-[11px] font-mono text-zinc-700 group-hover:text-orange-500 transition-colors">{social.val}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Suggestions */}
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest px-4">People you may know</h3>
                            {[
                                { name: 'Morpheus', handle: 'morpheus', head: 'Lead Architect' },
                                { name: 'Trinity', handle: 'trinity', head: 'Security Researcher' }
                            ].map((person, i) => (
                                <div key={i} className="bg-zinc-950/50 border border-zinc-900 p-4 rounded-2xl flex items-center gap-3 hover:bg-zinc-950 transition-all cursor-pointer group">
                                    <div className="w-10 h-10 rounded-full bg-zinc-900 overflow-hidden border border-zinc-800 group-hover:border-orange-500/50 transition-colors">
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${person.name}`} alt="user" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="grow">
                                        <div className="text-[11px] font-bold text-white uppercase tracking-tight">{person.name}</div>
                                        <div className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">{person.head}</div>
                                    </div>
                                    <Button size="icon" variant="ghost" className="w-8 h-8 rounded-full border border-zinc-900 text-zinc-600 hover:text-white hover:border-orange-500">
                                        <Plus size={14} />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
