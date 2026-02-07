import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User as UserIcon, Shield, Loader2, Save, ArrowLeft, Globe, Github, Linkedin, Twitter, Briefcase, Award } from "lucide-react";
import { useAuth } from "../features/void/hooks/useAuth";
import { Button } from "../components/ui/shadcn/button";
import { Input } from "../components/ui/shadcn/input";
import { Label } from "../components/ui/shadcn/label";
import { Textarea } from "../components/ui/shadcn/textarea";
import { Card } from "../components/ui/Card";

export default function ProfileSettings() {
    const { user, profile, updateProfile, isLoading } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        headline: "",
        bio: "",
        location: "",
        website: "",
        github: "",
        linkedin: "",
        twitter: ""
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!isLoading && !user) {
            navigate('/auth');
        } else if (profile) {
            setFormData({
                username: profile.username || "",
                headline: profile.headline || "",
                bio: profile.bio || "",
                location: profile.location || "",
                website: profile.website || "",
                github: profile.github || "",
                linkedin: profile.linkedin || "",
                twitter: profile.twitter || ""
            });
        }
    }, [user, profile, isLoading, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await updateProfile(formData);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return null;

    return (
        <div className="min-h-screen bg-black text-white selection:bg-orange-500 selection:text-black font-sans">
            <main className="max-w-[1000px] mx-auto p-6 md:p-12 space-y-12">
                <header className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 border-b border-zinc-900 pb-12 pt-10">
                    <div className="space-y-6">
                        <Link to={`/user/${profile?.username}`} className="text-[10px] font-bold text-zinc-600 hover:text-orange-500 transition-colors uppercase tracking-[0.4em] flex items-center gap-2">
                            <ArrowLeft size={12} />
                            Return to Profile
                        </Link>
                        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-none bg-zinc-900 border border-zinc-800 text-[10px] font-bold text-orange-500 uppercase tracking-[0.4em]">
                            <Shield size={14} />
                            <span>Node Configuration // Security Layer</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase leading-none">
                            Profile<br /><span className="text-zinc-600">Settings.</span>
                        </h1>
                    </div>
                </header>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-12">
                    <div className="md:col-span-8 space-y-12">
                        <section className="space-y-8">
                            <h3 className="text-[10px] font-bold text-zinc-700 uppercase tracking-[0.4em] ml-2">Identify Substrate</h3>
                            <div className="bg-zinc-950/20 border border-zinc-900 p-8 space-y-8">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Username handle</Label>
                                    <Input
                                        className="bg-black border-zinc-900 rounded-none h-12 font-mono text-sm opacity-50 cursor-not-allowed"
                                        value={formData.username}
                                        disabled
                                    />
                                    <p className="text-[9px] text-zinc-700 font-bold uppercase tracking-widest italic pt-2">// Protocol constraint: Usernames are immutable after materialization.</p>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Professional Headline</Label>
                                    <Input
                                        className="bg-black border-zinc-900 focus:border-orange-500 rounded-none h-12 text-sm"
                                        placeholder="Full Stack Architect @ Startup"
                                        value={formData.headline}
                                        onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Node Bio / Mission Statement</Label>
                                    <Textarea
                                        className="bg-black border-zinc-900 focus:border-orange-500 rounded-none min-h-[150px] text-sm leading-relaxed"
                                        placeholder="Tell the mesh about your work..."
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    />
                                </div>
                            </div>
                        </section>

                        <section className="space-y-8">
                            <h3 className="text-[10px] font-bold text-zinc-700 uppercase tracking-[0.4em] ml-2">Connectivity Protocols</h3>
                            <div className="bg-zinc-950/20 border border-zinc-900 p-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                                            <Globe size={12} /> Website
                                        </Label>
                                        <Input
                                            className="bg-black border-zinc-900 focus:border-orange-500 rounded-none h-12 text-sm"
                                            value={formData.website}
                                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                                            <Github size={12} /> GitHub
                                        </Label>
                                        <Input
                                            className="bg-black border-zinc-900 focus:border-orange-500 rounded-none h-12 text-sm"
                                            value={formData.github}
                                            onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                                            <Linkedin size={12} /> LinkedIn
                                        </Label>
                                        <Input
                                            className="bg-black border-zinc-900 focus:border-orange-500 rounded-none h-12 text-sm"
                                            value={formData.linkedin}
                                            onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                                            <Twitter size={12} /> Twitter / X
                                        </Label>
                                        <Input
                                            className="bg-black border-zinc-900 focus:border-orange-500 rounded-none h-12 text-sm"
                                            value={formData.twitter}
                                            onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="md:col-span-4 space-y-8">
                        <section className="bg-zinc-950 border border-zinc-900 p-8 space-y-8 relative overflow-hidden">
                            <div className="space-y-6">
                                <h3 className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.4em]">Operations</h3>
                                <Button
                                    type="submit"
                                    disabled={isSaving}
                                    className="w-full h-14 bg-white text-black font-bold uppercase tracking-[0.2em] text-[10px] rounded-none hover:bg-orange-500 hover:text-white transition-all group"
                                >
                                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : (
                                        <>
                                            Save Node Parameters
                                            <Save size={16} className="ml-2 group-hover:scale-110 transition-transform" />
                                        </>
                                    )}
                                </Button>
                            </div>

                            <div className="pt-8 border-t border-zinc-900 space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                                        <Award size={18} className="text-yellow-600" />
                                    </div>
                                    <div>
                                        <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest block">Mesh Status</span>
                                        <span className="text-xs font-bold text-white uppercase tracking-tight">Level 1 Practitioner</span>
                                    </div>
                                </div>
                                <p className="text-[9px] text-zinc-700 font-bold uppercase tracking-[0.3em] leading-loose italic">
                                    // Professional identity is synchronized across all OpenDev Sub-modules.
                                </p>
                            </div>
                        </section>
                    </div>
                </form>

                <footer className="mt-32 pt-12 border-t border-zinc-900 flex justify-between items-center text-[9px] font-bold text-zinc-700 uppercase tracking-widest italic opacity-50">
                    <p>© 2026 OpenDev-Labs // Identity Protocol</p>
                    <div className="flex gap-8">
                        <span>Terminal: v11.12-AUTH</span>
                        <span>Sovereign Link: ACTIVE</span>
                    </div>
                </footer>
            </main>
        </div>
    );
}
