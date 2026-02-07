import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { User, Check, AlertCircle, Loader2, ArrowRight, Shield, Globe, Briefcase, Camera, Image as ImageIcon, Sparkles } from "lucide-react";
import { useAuth } from "../features/void/hooks/useAuth";
import { Button } from "../components/ui/shadcn/button";
import { Input } from "../components/ui/shadcn/input";
import { Label } from "../components/ui/shadcn/label";
import { Textarea } from "../components/ui/shadcn/textarea";
import { LamaDB } from "../lib/lamaDB";

const AVATAR_OPTIONS = [
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Jasper",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Aiden",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Lilly",
];

const BANNER_OPTIONS = [
    "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1000",
];

export default function OnboardingPage() {
    const { user, profile, updateProfile, isLoading: authLoading } = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [headline, setHeadline] = useState("");
    const [bio, setBio] = useState("");
    const [avatarUrl, setAvatarUrl] = useState(AVATAR_OPTIONS[0]);
    const [bannerUrl, setBannerUrl] = useState(BANNER_OPTIONS[0]);
    const [step, setStep] = useState(1);

    const [isChecking, setIsChecking] = useState(false);
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/auth');
        } else if (!authLoading && profile?.username) {
            navigate('/nexus', { replace: true });
        } else if (user && !username && !profile?.username) {
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
            const userContext = { uid: user?.email || 'global', email: user?.email || 'global' };
            const existing = await LamaDB.store.collection('profiles', userContext).get() as any[];
            const taken = existing.some(p => p.username === name && p.email !== user?.email);
            setIsAvailable(!taken);
        } catch (e) {
            console.error(e);
            setIsAvailable(true);
        } finally {
            setIsChecking(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (username && step === 1) checkUsername(username);
        }, 500);
        return () => clearTimeout(timer);
    }, [username, step]);

    const handleNextStep = () => {
        if (step === 1 && (!isAvailable || username.length < 3)) return;
        setStep(prev => prev + 1);
    };

    const handlePrevStep = () => {
        setStep(prev => prev - 1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        try {
            await updateProfile({
                username,
                headline,
                bio,
                avatarUrl,
                bannerUrl,
                projects: [],
                skills: [],
                joinedAt: new Date().toISOString()
            });

            setTimeout(() => {
                navigate('/nexus', { replace: true });
            }, 100);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (authLoading) return null;

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 py-20 selection:bg-orange-500 selection:text-black font-sans">
            <div className="max-w-[600px] w-full space-y-12">
                <div className="flex flex-col items-center text-center space-y-6">
                    <div className="w-20 h-20 bg-zinc-900 border border-zinc-800 flex items-center justify-center rounded-2xl rotate-3 mb-2 shadow-2xl">
                        <Shield size={36} className="text-orange-500 -rotate-3" />
                    </div>
                    <div className="space-y-3">
                        <h1 className="text-5xl font-bold tracking-tighter uppercase leading-tight">
                            Create Your<br /><span className="text-zinc-500">Professional Identity.</span>
                        </h1>
                        <p className="text-zinc-600 text-xs font-bold uppercase tracking-[0.4em]">
                            Join the World's most powerful social network
                        </p>
                    </div>
                </div>

                <div className="relative">
                    {/* Step Indicator */}
                    <div className="flex justify-center gap-2 mb-8">
                        {[1, 2, 3].map((s) => (
                            <div
                                key={s}
                                className={`h-1 rounded-full transition-all duration-500 ${step >= s ? 'w-8 bg-orange-500' : 'w-4 bg-zinc-900 focus:outline-none'}`}
                            />
                        ))}
                    </div>

                    <div className="bg-zinc-950 border border-zinc-900 p-8 md:p-12 relative overflow-hidden rounded-3xl shadow-3xl">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-30" />

                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8"
                                >
                                    <div className="space-y-2">
                                        <h2 className="text-lg font-bold tracking-tight uppercase">Let's start with your name.</h2>
                                        <p className="text-zinc-500 text-[11px] font-medium uppercase tracking-widest leading-relaxed">Choose a social handle that represents you best.</p>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-3">
                                            <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 ml-1">Social Handle</Label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 font-mono text-base">@</span>
                                                <Input
                                                    className="bg-black border-zinc-900 focus:border-orange-500 rounded-2xl h-14 pl-10 font-mono text-base transition-all"
                                                    placeholder="yourname"
                                                    value={username}
                                                    onChange={(e) => setUsername(e.target.value.toLowerCase())}
                                                />
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                                    {isChecking && <Loader2 size={18} className="text-zinc-600 animate-spin" />}
                                                    {!isChecking && isAvailable === true && <div className="bg-emerald-500/10 p-1.5 rounded-full"><Check size={16} className="text-emerald-500" /></div>}
                                                    {!isChecking && isAvailable === false && <div className="bg-red-500/10 p-1.5 rounded-full"><AlertCircle size={16} className="text-red-500" /></div>}
                                                </div>
                                            </div>
                                            {isAvailable === false && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest mt-3 ml-1">Error: This name is already taken.</p>}
                                        </div>

                                        <div className="space-y-3">
                                            <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 ml-1">Professional Headline</Label>
                                            <Input
                                                className="bg-black border-zinc-900 focus:border-orange-500 rounded-2xl h-14 text-sm px-6 font-medium transition-all"
                                                placeholder="e.g. Lead Developer / Digital Artist / Student"
                                                value={headline}
                                                onChange={(e) => setHeadline(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        onClick={handleNextStep}
                                        disabled={!isAvailable || username.length < 3}
                                        className="w-full h-14 bg-white text-black font-bold uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-orange-500 hover:text-white transition-all group mt-4 shadow-xl"
                                    >
                                        Next Step
                                        <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-10"
                                >
                                    <div className="space-y-2">
                                        <h2 className="text-lg font-bold tracking-tight uppercase">Define Your Look.</h2>
                                        <p className="text-zinc-500 text-[11px] font-medium uppercase tracking-widest leading-relaxed">Choose an avatar and banner that fits your style.</p>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="space-y-4">
                                            <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 ml-1">Profile Banner</Label>
                                            <div className="grid grid-cols-2 gap-3">
                                                {BANNER_OPTIONS.map((url, i) => (
                                                    <button
                                                        key={i}
                                                        type="button"
                                                        onClick={() => setBannerUrl(url)}
                                                        className={`h-24 rounded-2xl overflow-hidden border-2 transition-all ${bannerUrl === url ? 'border-orange-500 scale-[0.98]' : 'border-zinc-900 opacity-60 hover:opacity-100 focus:outline-none'}`}
                                                    >
                                                        <img src={url} alt={`Banner ${i}`} className="w-full h-full object-cover" />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-4 relative">
                                            <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 ml-1">Profile Picture</Label>
                                            <div className="flex justify-center md:justify-start gap-4">
                                                {AVATAR_OPTIONS.map((url, i) => (
                                                    <button
                                                        key={i}
                                                        type="button"
                                                        onClick={() => setAvatarUrl(url)}
                                                        className={`w-16 h-16 rounded-full overflow-hidden border-2 transition-all shrink-0 ${avatarUrl === url ? 'border-orange-500 scale-[1.1] z-10 p-0.5 bg-black' : 'border-zinc-900 opacity-40 hover:opacity-100 p-0'}`}
                                                    >
                                                        <img src={url} alt={`Avatar ${i}`} className="w-full h-full object-cover rounded-full" />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <Button variant="ghost" onClick={handlePrevStep} className="h-14 font-bold uppercase tracking-widest text-[10px] border border-zinc-900 rounded-2xl px-8 hover:bg-zinc-900 focus:outline-none">Back</Button>
                                        <Button
                                            onClick={handleNextStep}
                                            className="grow h-14 bg-white text-black font-bold uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-orange-500 hover:text-white transition-all group shadow-xl"
                                        >
                                            Continue
                                            <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-10"
                                >
                                    <div className="space-y-2 text-center md:text-left">
                                        <h2 className="text-lg font-bold tracking-tight uppercase">Tell us about yourself.</h2>
                                        <p className="text-zinc-500 text-[11px] font-medium uppercase tracking-widest leading-relaxed">A short bio helps people get to know you.</p>
                                    </div>

                                    <div className="space-y-8">
                                        {/* Profile Preview Card */}
                                        <div className="bg-black border border-zinc-900 rounded-3xl overflow-hidden relative shadow-inner">
                                            <div className="h-20 w-full overflow-hidden">
                                                <img src={bannerUrl} alt="Banner Preview" className="w-full h-full object-cover opacity-50" />
                                            </div>
                                            <div className="p-6 pt-0 -mt-8 flex flex-col md:flex-row gap-4 items-center md:items-end">
                                                <div className="w-20 h-20 rounded-full border-4 border-black bg-zinc-950 overflow-hidden shrink-0 relative z-10">
                                                    <img src={avatarUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
                                                </div>
                                                <div className="text-center md:text-left pb-1">
                                                    <h3 className="text-lg font-bold tracking-tight uppercase leading-none">@{username}</h3>
                                                    <p className="text-orange-500 text-[9px] font-bold uppercase tracking-widest mt-1.5">{headline || 'Headline'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 ml-1">Short Biography</Label>
                                            <Textarea
                                                className="bg-black border-zinc-900 focus:border-orange-500 rounded-3xl min-h-[120px] p-6 text-sm leading-relaxed transition-all resize-none"
                                                placeholder="What do you do? What are you passionate about?"
                                                value={bio}
                                                onChange={(e) => setBio(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <Button variant="ghost" onClick={handlePrevStep} className="h-14 font-bold uppercase tracking-widest text-[10px] border border-zinc-900 rounded-2xl px-8 hover:bg-zinc-900 focus:outline-none">Back</Button>
                                        <Button
                                            onClick={handleSubmit}
                                            disabled={isSubmitting}
                                            className="grow h-14 bg-white text-black font-bold uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-orange-500 hover:text-white transition-all group shadow-2xl"
                                        >
                                            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : (
                                                <>
                                                    Create Profile
                                                    <Sparkles size={16} className="ml-2 group-hover:scale-125 transition-transform" />
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="flex justify-center items-center gap-8 text-[9px] font-bold text-zinc-700 uppercase tracking-widest">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                            <span>Public Mesh Protocol Active</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
