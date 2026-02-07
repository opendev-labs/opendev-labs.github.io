import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Check,
    ArrowRight,
    User,
    Cloud,
    Shield,
    Sparkles,
    Camera,
    Image as ImageIcon,
    Layout as LayoutIcon,
    Loader2,
    AlertCircle,
    Info
} from 'lucide-react';
import { useAuth } from '../features/void/hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/shadcn/input';
import { Label } from '../components/ui/shadcn/label';
import { Textarea } from '../components/ui/shadcn/textarea';
import { Card } from '../components/ui/Card';
import { LamaDB } from '../lib/lamaDB';

const BANNER_OPTIONS = [
    'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1935&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2070&auto=format&fit=crop'
];

const AVATAR_OPTIONS = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Casper',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Jasper'
];

export default function OnboardingPage() {
    const { user, updateProfile, profile } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [username, setUsername] = useState('');
    const [headline, setHeadline] = useState('');
    const [bio, setBio] = useState('');
    const [avatarUrl, setAvatarUrl] = useState(AVATAR_OPTIONS[0]);
    const [bannerUrl, setBannerUrl] = useState(BANNER_OPTIONS[0]);
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
    const [isChecking, setIsChecking] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [customAvatar, setCustomAvatar] = useState('');
    const [customBanner, setCustomBanner] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/auth');
            return;
        }
        // If profile already exists with a username, user might have skipped onboarding or is re-entering
        if (profile?.username && step === 1) {
            setUsername(profile.username);
            setHeadline(profile.headline || '');
            setBio(profile.bio || '');
            if (profile.avatarUrl) setAvatarUrl(profile.avatarUrl);
            if (profile.bannerUrl) setBannerUrl(profile.bannerUrl);
        }
    }, [user, navigate, profile]);

    // Check availability
    useEffect(() => {
        if (username.length < 3) {
            setIsAvailable(null);
            return;
        }

        const timer = setTimeout(async () => {
            setIsChecking(true);
            try {
                const userContext = { uid: 'global', email: 'global' };
                const existing = await LamaDB.store.collection('profiles', userContext).get() as any[];
                const taken = existing.some(p => p.username === username && p.id !== profile?.id);
                setIsAvailable(!taken);
            } catch (e) {
                console.error(e);
                setIsAvailable(true);
            } finally {
                setIsChecking(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [username, profile]);

    const handleNextStep = () => {
        if (step === 1 && (!isAvailable || username.length < 3)) return;
        setStep(prev => prev + 1);
        window.scrollTo(0, 0);
    };

    const handlePrevStep = () => {
        setStep(prev => prev - 1);
        window.scrollTo(0, 0);
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;

        setIsSubmitting(true);
        try {
            const finalAvatar = customAvatar || avatarUrl;
            const finalBanner = customBanner || bannerUrl;

            await updateProfile({
                username,
                headline,
                bio,
                avatarUrl: finalAvatar,
                bannerUrl: finalBanner,
                projects: [],
                skills: [],
                joinedAt: new Date().toISOString(),
                onboarded: true
            });

            setTimeout(() => {
                navigate('/open-hub', { replace: true });
            }, 500);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const steps = [
        { id: 1, name: 'Identity', icon: User },
        { id: 2, name: 'Visuals', icon: ImageIcon },
        { id: 3, name: 'Profile', icon: LayoutIcon }
    ];

    return (
        <div className="min-h-screen bg-[#020202] text-white selection:bg-orange-500 selection:text-black font-sans relative overflow-hidden">
            {/* Background cinematic effects */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-500/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 min-h-screen flex flex-col items-center">
                {/* Header */}
                <header className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-zinc-900/50 border border-zinc-800 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.4em] mb-8"
                    >
                        <Sparkles size={12} className="text-orange-500" />
                        <span>System Initialization Protocol</span>
                    </motion.div>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 lowercase">Initialize Identity.</h1>
                    <p className="text-zinc-500 text-sm md:text-base font-medium uppercase tracking-[0.2em] max-w-xl mx-auto leading-relaxed">Establish your node presence within the OpenDev Mesh.</p>
                </header>

                {/* Step Indicator */}
                <div className="flex items-center justify-center gap-4 mb-20 w-full max-w-md">
                    {steps.map((s, i) => (
                        <React.Fragment key={s.id}>
                            <div className="flex flex-col items-center gap-3 relative">
                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 ${step >= s.id ? 'bg-orange-500 border-orange-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.3)]' : 'bg-zinc-900 border-zinc-800 text-zinc-700'}`}>
                                    <s.icon size={18} />
                                </div>
                                <span className={`text-[9px] font-bold uppercase tracking-widest absolute -bottom-8 ${step >= s.id ? 'text-white' : 'text-zinc-700'}`}>{s.name}</span>
                            </div>
                            {i < steps.length - 1 && (
                                <div className={`h-[2px] grow transition-all duration-500 ${step > s.id ? 'bg-orange-500' : 'bg-zinc-900'}`} />
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* Content Area */}
                <div className="w-full max-w-2xl">
                    <Card glass className="p-0 border-zinc-900 overflow-hidden shadow-2xl rounded-[40px] bg-zinc-950/40 backdrop-blur-2xl">
                        <div className="p-10 md:p-16">
                            <AnimatePresence mode="wait">
                                {step === 1 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-12"
                                    >
                                        <div className="space-y-4">
                                            <h2 className="text-2xl font-bold tracking-tight uppercase">Base Credentials</h2>
                                            <p className="text-zinc-500 text-xs font-medium uppercase tracking-widest leading-relaxed">Choose a unique social handle and headline for your profile.</p>
                                        </div>

                                        <div className="space-y-8">
                                            <div className="space-y-3">
                                                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Universal Handle</Label>
                                                <div className="relative">
                                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600 font-mono text-lg">@</span>
                                                    <Input
                                                        className="bg-black/50 border-zinc-900 focus:border-orange-500 rounded-3xl h-16 pl-12 font-mono text-lg transition-all focus:ring-4 focus:ring-orange-500/5 placeholder:opacity-20"
                                                        placeholder="handle"
                                                        value={username}
                                                        onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                                                    />
                                                    <div className="absolute right-6 top-1/2 -translate-y-1/2">
                                                        {isChecking && <Loader2 size={20} className="text-zinc-600 animate-spin" />}
                                                        {!isChecking && isAvailable === true && <div className="bg-emerald-500/10 p-1.5 rounded-full"><Check size={16} className="text-emerald-500" /></div>}
                                                        {!isChecking && isAvailable === false && <div className="bg-red-500/10 p-1.5 rounded-full"><AlertCircle size={16} className="text-red-500" /></div>}
                                                    </div>
                                                </div>
                                                {isAvailable === false && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest mt-3 ml-1 flex items-center gap-2"><AlertCircle size={12} /> Handle Unavailable</p>}
                                                {username.length > 0 && username.length < 3 && <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-3 ml-1">Minimum 3 characters</p>}
                                            </div>

                                            <div className="space-y-3">
                                                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Professional Headline</Label>
                                                <Input
                                                    className="bg-black/50 border-zinc-900 focus:border-orange-500 rounded-3xl h-16 text-sm px-8 font-medium transition-all focus:ring-4 focus:ring-orange-500/5"
                                                    placeholder="e.g. Sovereign Architect / Digital Artist"
                                                    value={headline}
                                                    onChange={(e) => setHeadline(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <Button
                                            onClick={handleNextStep}
                                            disabled={!isAvailable || username.length < 3}
                                            className="w-full h-16 bg-white text-black font-bold uppercase tracking-[0.3em] text-[11px] rounded-3xl hover:bg-orange-500 hover:text-white transition-all group mt-8 shadow-[0_20px_40px_rgba(0,0,0,0.4)] disabled:opacity-20 flex items-center justify-center gap-4"
                                        >
                                            Continue Protocol
                                            <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                                        </Button>
                                    </motion.div>
                                )}

                                {step === 2 && (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-12"
                                    >
                                        <div className="space-y-4">
                                            <h2 className="text-2xl font-bold tracking-tight uppercase">Visual Presence</h2>
                                            <p className="text-zinc-500 text-xs font-medium uppercase tracking-widest leading-relaxed">Define your aesthetic in the mesh.</p>
                                        </div>

                                        <div className="space-y-10">
                                            <div className="space-y-6">
                                                <div className="flex items-center justify-between">
                                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Profile Banner</Label>
                                                    <span className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest">Select or Specify URL</span>
                                                </div>
                                                <div className="grid grid-cols-4 gap-3">
                                                    {BANNER_OPTIONS.map((url, i) => (
                                                        <button
                                                            key={i}
                                                            type="button"
                                                            onClick={() => { setBannerUrl(url); setCustomBanner(''); }}
                                                            className={`h-16 rounded-2xl overflow-hidden border-2 transition-all ${bannerUrl === url && !customBanner ? 'border-orange-500 scale-[0.95] ring-4 ring-orange-500/20' : 'border-zinc-900 opacity-40 hover:opacity-100'}`}
                                                        >
                                                            <img src={url} alt={`Banner ${i}`} className="w-full h-full object-cover" />
                                                        </button>
                                                    ))}
                                                </div>
                                                <div className="relative">
                                                    <ImageIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-700" size={16} />
                                                    <Input
                                                        className="bg-black/50 border-zinc-900 focus:border-orange-500 rounded-3xl h-14 pl-14 text-xs font-mono transition-all"
                                                        placeholder="External Banner URL (HTTPS)"
                                                        value={customBanner}
                                                        onChange={(e) => setCustomBanner(e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                <div className="flex items-center justify-between">
                                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Avatar Sequence</Label>
                                                    <span className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest">DiceBear Presets</span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    {AVATAR_OPTIONS.map((url, i) => (
                                                        <button
                                                            key={i}
                                                            type="button"
                                                            onClick={() => { setAvatarUrl(url); setCustomAvatar(''); }}
                                                            className={`w-14 h-14 rounded-full overflow-hidden border-2 transition-all shrink-0 ${avatarUrl === url && !customAvatar ? 'border-orange-500 scale-[1.1] z-10 p-0.5 bg-black ring-4 ring-orange-500/20' : 'border-zinc-900 opacity-40 hover:opacity-100 p-0'}`}
                                                        >
                                                            <img src={url} alt={`Avatar ${i}`} className="w-full h-full object-cover rounded-full" />
                                                        </button>
                                                    ))}
                                                </div>
                                                <div className="relative">
                                                    <User className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-700" size={16} />
                                                    <Input
                                                        className="bg-black/50 border-zinc-900 focus:border-orange-500 rounded-3xl h-14 pl-14 text-xs font-mono transition-all"
                                                        placeholder="External Avatar URL (HTTPS)"
                                                        value={customAvatar}
                                                        onChange={(e) => setCustomAvatar(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-4">
                                            <Button variant="ghost" onClick={handlePrevStep} className="h-16 font-bold uppercase tracking-widest text-[10px] border border-zinc-900 rounded-3xl px-10 hover:bg-zinc-900 focus:outline-none transition-all">Back</Button>
                                            <Button
                                                onClick={handleNextStep}
                                                className="grow h-16 bg-white text-black font-bold uppercase tracking-[0.3em] text-[11px] rounded-3xl hover:bg-orange-500 hover:text-white transition-all group shadow-[0_20px_40px_rgba(0,0,0,0.4)] flex items-center justify-center gap-4"
                                            >
                                                Finalize
                                                <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
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
                                        className="space-y-12"
                                    >
                                        <div className="space-y-4">
                                            <h2 className="text-2xl font-bold tracking-tight uppercase">Final Transmission</h2>
                                            <p className="text-zinc-500 text-xs font-medium uppercase tracking-widest leading-relaxed">Review your presence and add a biography.</p>
                                        </div>

                                        <div className="space-y-10">
                                            {/* Profile Preview Card */}
                                            <div className="bg-black border border-zinc-900 rounded-[32px] overflow-hidden relative shadow-2xl">
                                                <div className="h-24 w-full overflow-hidden">
                                                    <img src={customBanner || bannerUrl} alt="Banner Preview" className="w-full h-full object-cover opacity-60" />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                                                </div>
                                                <div className="p-8 pt-0 -mt-12 flex flex-col items-center md:items-start md:flex-row gap-6">
                                                    <div className="w-24 h-24 rounded-full border-4 border-black bg-zinc-950 overflow-hidden shrink-0 relative z-10 shadow-2xl">
                                                        <img src={customAvatar || avatarUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="text-center md:text-left pt-14 md:pt-14">
                                                        <h3 className="text-2xl font-bold tracking-tight uppercase leading-none">@{username}</h3>
                                                        <p className="text-orange-500 text-[10px] font-bold uppercase tracking-widest mt-3">{headline || 'Headline'}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Node Biography</Label>
                                                <Textarea
                                                    className="bg-black/50 border-zinc-900 focus:border-orange-500 rounded-[32px] min-h-[160px] p-8 text-sm leading-relaxed transition-all resize-none focus:ring-4 focus:ring-orange-500/5 placeholder:opacity-20"
                                                    placeholder="Synthesize your purpose... What are you building?"
                                                    value={bio}
                                                    onChange={(e) => setBio(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex gap-4">
                                            <Button variant="ghost" onClick={handlePrevStep} className="h-16 font-bold uppercase tracking-widest text-[10px] border border-zinc-900 rounded-3xl px-10 hover:bg-zinc-900 focus:outline-none transition-all">Back</Button>
                                            <Button
                                                onClick={handleSubmit}
                                                disabled={isSubmitting}
                                                className="grow h-16 bg-white text-black font-bold uppercase tracking-[0.3em] text-[11px] rounded-3xl hover:bg-orange-500 hover:text-white transition-all group shadow-[0_20px_60px_rgba(249,115,22,0.2)] flex items-center justify-center gap-4"
                                            >
                                                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : (
                                                    <>
                                                        Initialize Node
                                                        <Sparkles size={18} className="group-hover:scale-125 transition-transform" />
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </Card>

                    <div className="mt-12 text-center text-[9px] font-bold text-zinc-800 uppercase tracking-[0.4em] flex items-center justify-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]" />
                            <span>Identity Mesh Synchronized</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-zinc-900" />
                        <span>Protocol v11.12</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
