import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User as UserIcon, Shield, Loader2, Save, ArrowLeft, Globe, Github, Linkedin, Twitter, Briefcase, Award, Image as ImageIcon, Sparkles, MapPin, Link as LinkIcon } from "lucide-react";
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
        twitter: "",
        avatarUrl: "",
        bannerUrl: ""
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
                twitter: profile.twitter || "",
                avatarUrl: profile.avatarUrl || "",
                bannerUrl: profile.bannerUrl || ""
            });
        }
    }, [user, profile, isLoading, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await updateProfile(formData);
            navigate(`/user/${profile?.username}`);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return null;

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-orange-500 selection:text-black font-sans pb-20">
            <main className="max-w-[1000px] mx-auto p-4 md:p-8 space-y-8">
                <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 py-10 border-b border-zinc-900">
                    <div className="space-y-4">
                        <Link to={`/user/${profile?.username}`} className="text-[10px] font-bold text-zinc-600 hover:text-orange-500 transition-colors uppercase tracking-[0.4em] flex items-center gap-2">
                            <ArrowLeft size={12} />
                            Back to Profile
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase">Edit <span className="text-zinc-600">Profile.</span></h1>
                    </div>
                    <div className="flex gap-4">
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-[10px] font-bold text-orange-500 uppercase tracking-widest">
                            <Shield size={14} />
                            <span>Verified Security</span>
                        </div>
                    </div>
                </header>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8 space-y-8">
                        {/* Visual Identity Section */}
                        <section className="bg-zinc-950 border border-zinc-900 rounded-3xl p-8 shadow-xl space-y-8">
                            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-2">
                                <ImageIcon size={14} className="text-orange-500" /> Visual Identity
                            </h3>

                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Profile Image URL</Label>
                                    <div className="flex gap-4">
                                        <div className="w-16 h-16 rounded-2xl bg-zinc-900 overflow-hidden shrink-0 border border-zinc-800">
                                            <img src={formData.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} alt="Preview" className="w-full h-full object-cover" />
                                        </div>
                                        <Input
                                            className="bg-black border-zinc-900 focus:border-orange-500 rounded-xl h-12 text-sm grow"
                                            placeholder="https://..."
                                            value={formData.avatarUrl}
                                            onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Banner Image URL</Label>
                                    <div className="h-24 w-full rounded-2xl bg-zinc-900 overflow-hidden border border-zinc-800 mb-2 relative">
                                        {formData.bannerUrl ? (
                                            <img src={formData.bannerUrl} alt="Banner Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center opacity-20"><ImageIcon size={24} /></div>
                                        )}
                                    </div>
                                    <Input
                                        className="bg-black border-zinc-900 focus:border-orange-500 rounded-xl h-12 text-sm"
                                        placeholder="https://..."
                                        value={formData.bannerUrl}
                                        onChange={(e) => setFormData({ ...formData, bannerUrl: e.target.value })}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Basic Info Section */}
                        <section className="bg-zinc-950 border border-zinc-900 rounded-3xl p-8 shadow-xl space-y-8">
                            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-2">
                                <Sparkles size={14} className="text-orange-500" /> Professional Details
                            </h3>

                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Social Handle</Label>
                                    <Input
                                        className="bg-zinc-900 border-zinc-800 rounded-xl h-12 text-sm opacity-50 cursor-not-allowed font-mono"
                                        value={formData.username}
                                        disabled
                                    />
                                    <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest italic pt-1">// Handles are immutable once materialized.</p>
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Professional Headline</Label>
                                    <Input
                                        className="bg-black border-zinc-900 focus:border-orange-500 rounded-xl h-12 text-sm"
                                        placeholder="Full Stack Engineer @ Meta"
                                        value={formData.headline}
                                        onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">About / Biography</Label>
                                    <Textarea
                                        className="bg-black border-zinc-900 focus:border-orange-500 rounded-2xl min-h-[150px] text-sm leading-relaxed p-4"
                                        placeholder="Tell your professional story..."
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                                        <MapPin size={12} /> Location
                                    </Label>
                                    <Input
                                        className="bg-black border-zinc-900 focus:border-orange-500 rounded-xl h-12 text-sm"
                                        placeholder="New York, NY"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* External Links Section */}
                        <section className="bg-zinc-950 border border-zinc-900 rounded-3xl p-8 shadow-xl space-y-8">
                            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-2">
                                <LinkIcon size={14} className="text-orange-500" /> Digital Presence
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2"><Globe size={12} /> Personal Website</Label>
                                    <Input className="bg-black border-zinc-900 focus:border-orange-500 rounded-xl h-12 text-sm" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2"><Github size={12} /> GitHub Profile</Label>
                                    <Input className="bg-black border-zinc-900 focus:border-orange-500 rounded-xl h-12 text-sm" value={formData.github} onChange={(e) => setFormData({ ...formData, github: e.target.value })} />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2"><Linkedin size={12} /> LinkedIn Profile</Label>
                                    <Input className="bg-black border-zinc-900 focus:border-orange-500 rounded-xl h-12 text-sm" value={formData.linkedin} onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })} />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2"><Twitter size={12} /> Twitter / X</Label>
                                    <Input className="bg-black border-zinc-900 focus:border-orange-500 rounded-xl h-12 text-sm" value={formData.twitter} onChange={(e) => setFormData({ ...formData, twitter: e.target.value })} />
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="lg:col-span-4">
                        <div className="sticky top-24 space-y-6">
                            <Card className="bg-zinc-950 border-zinc-900 p-8 rounded-3xl shadow-xl space-y-8">
                                <div>
                                    <h3 className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest mb-6">Management</h3>
                                    <Button
                                        type="submit"
                                        disabled={isSaving}
                                        className="w-full h-14 bg-white text-black font-bold uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-orange-500 hover:text-white transition-all shadow-lg active:scale-95"
                                    >
                                        {isSaving ? <Loader2 size={16} className="animate-spin" /> : (
                                            <div className="flex items-center gap-2">
                                                Update Profile <Save size={16} />
                                            </div>
                                        )}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => navigate(`/user/${profile?.username}`)}
                                        className="w-full mt-4 text-[10px] font-bold text-zinc-600 uppercase tracking-widest hover:text-zinc-400"
                                    >
                                        Discard Changes
                                    </Button>
                                </div>

                                <div className="pt-8 border-t border-zinc-900 space-y-4">
                                    <p className="text-[9px] text-zinc-700 font-bold uppercase tracking-widest leading-loose italic">
                                        // Updates will be visible across the entire Nexus network immediately.
                                    </p>
                                </div>
                            </Card>
                        </div>
                    </div>
                </form>

                <footer className="mt-20 pt-10 border-t border-zinc-900 flex justify-between items-center text-[9px] font-bold text-zinc-700 uppercase tracking-[0.4em] opacity-50">
                    <p>© 2026 OpenDev Labs // Nexus</p>
                </footer>
            </main>
        </div>
    );
}
