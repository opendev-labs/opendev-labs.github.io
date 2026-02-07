import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Check, AlertCircle, Loader2, ArrowRight, Shield, Globe, Briefcase } from "lucide-react";
import { useAuth } from "../features/void/hooks/useAuth";
import { Button } from "../components/ui/shadcn/button";
import { Input } from "../components/ui/shadcn/input";
import { Label } from "../components/ui/shadcn/label";
import { Textarea } from "../components/ui/shadcn/textarea";
import { LamaDB } from "../lib/lamaDB";

export default function OnboardingPage() {
    const { user, profile, updateProfile, isLoading: authLoading } = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [headline, setHeadline] = useState("");
    const [isChecking, setIsChecking] = useState(false);
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/auth');
        } else if (!authLoading && profile?.username) {
            navigate('/nexus');
        } else if (user && !username) {
            // Default username to google/github name (sanitized)
            const defaultName = user.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
            setUsername(defaultName);
        }
    }, [user, profile, authLoading, navigate]);

    const checkUsername = async (name: string) => {
        if (name.length < 3) {
            setIsAvailable(null);
            return;
        }
        setIsChecking(true);
        try {
            // Check in LamaDB globally if username exists
            // Since LamaDB is client-side, we might need a global collection or just query all users
            // For now, we'll simulate availability or check a dedicated global 'usernames' collection
            const userContext = { uid: 'global', email: 'global' };
            const existing = await LamaDB.store.collection('profiles', userContext).get() as any[];
            const taken = existing.some(p => p.username === name && p.email !== user?.email);
            setIsAvailable(!taken);
        } catch (e) {
            console.error(e);
            setIsAvailable(true); // Fallback
        } finally {
            setIsChecking(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (username) checkUsername(username);
        }, 500);
        return () => clearTimeout(timer);
    }, [username]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAvailable || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await updateProfile({
                username,
                headline,
                bio: "",
                projects: [],
                skills: [],
                joinedAt: new Date().toISOString()
            });
            navigate('/nexus');
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (authLoading) return null;

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 selection:bg-orange-500 selection:text-black">
            <div className="max-w-[550px] w-full space-y-12">
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-zinc-950 border border-zinc-900 flex items-center justify-center mb-4">
                        <Shield size={32} className="text-orange-500" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold tracking-tighter uppercase leading-none">
                            Nexus<br /><span className="text-zinc-600">Onboarding.</span>
                        </h1>
                        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.4em]">
                            Initialize your professional node
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="bg-zinc-950 border border-zinc-900 p-10 space-y-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-orange-600 to-transparent opacity-50" />

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Pick your professional handle</Label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 font-mono text-sm">@</span>
                                <Input
                                    className="bg-black border-zinc-900 focus:border-orange-500 rounded-none h-12 pl-8 font-mono text-sm"
                                    placeholder="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value.toLowerCase())}
                                    required
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                    {isChecking && <Loader2 size={16} className="text-zinc-600 animate-spin" />}
                                    {!isChecking && isAvailable === true && <Check size={16} className="text-emerald-500" />}
                                    {!isChecking && isAvailable === false && <AlertCircle size={16} className="text-red-500" />}
                                </div>
                            </div>
                            {isAvailable === false && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest mt-2">Protocol Error: Handle already claimed.</p>}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Professional Headline</Label>
                            <Input
                                className="bg-black border-zinc-900 focus:border-orange-500 rounded-none h-12 text-sm"
                                placeholder="e.g. Full Stack Architect @ StartupName / AI Researcher"
                                value={headline}
                                onChange={(e) => setHeadline(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="p-4 bg-zinc-900 border border-zinc-800 space-y-2">
                        <div className="flex items-center gap-2 text-zinc-400">
                            <Briefcase size={12} className="text-orange-500" />
                            <span className="text-[9px] font-bold uppercase tracking-widest">Public Link Established</span>
                        </div>
                        <p className="text-[10px] text-zinc-600 font-mono truncate">
                            opendev-labs.github.io/user/{username || '...'}
                        </p>
                    </div>

                    <Button
                        type="submit"
                        disabled={!isAvailable || isSubmitting}
                        className="w-full h-14 bg-white text-black font-bold uppercase tracking-[0.2em] text-[10px] rounded-none hover:bg-orange-500 hover:text-white transition-all group"
                    >
                        {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : (
                            <>
                                Establish Identity
                                <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </Button>
                </form>

                <div className="flex justify-between items-center text-[9px] font-bold text-zinc-700 uppercase tracking-widest">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-green-500" />
                            <span>Mesh Verified</span>
                        </div>
                        <div className="w-1 h-1 bg-zinc-900 rounded-full" />
                        <span>Hardline v.12</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
