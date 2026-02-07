import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Check,
    ArrowRight,
    User,
    Sparkles,
    Camera,
    Image as ImageIcon,
    Layout as LayoutIcon,
    Loader2,
    AlertCircle,
    Upload,
    ChevronLeft
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

    const avatarInputRef = useRef<HTMLInputElement>(null);
    const bannerInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!user) {
            navigate('/auth');
            return;
        }
        if (profile?.username && step === 1) {
            setUsername(profile.username);
            setHeadline(profile.headline || '');
            setBio(profile.bio || '');
            if (profile.avatarUrl) setAvatarUrl(profile.avatarUrl);
            if (profile.bannerUrl) setBannerUrl(profile.bannerUrl);
        }
    }, [user, navigate, profile]);

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
    };

    const handlePrevStep = () => {
        setStep(prev => prev - 1);
    };

    const handleFileRead = (file: File, callback: (base64: string) => void) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            callback(reader.result as string);
        };
        reader.readAsDataURL(file);
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
        { id: 1, name: 'ID', icon: User },
        { id: 2, name: 'LOK', icon: ImageIcon },
        { id: 3, name: 'FIN', icon: LayoutIcon }
    ];

    return (
        <div className="fixed inset-0 bg-[#020202] text-white selection:bg-orange-500 selection:text-black font-sans overflow-hidden flex flex-col items-center justify-center p-4">
            {/* Background effects restricted to fixed container */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-500/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
            </div>

            <div className="relative z-10 w-full max-w-4xl h-full flex flex-col items-center justify-center py-4 md:py-8 max-h-[800px]">
                {/* Header Minimalized for 100dvh */}
                <header className="text-center mb-6 md:mb-10 scale-90 md:scale-100 flex flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/50 border border-zinc-800 text-[9px] font-bold text-zinc-500 uppercase tracking-[0.4em] mb-4"
                    >
                        <Sparkles size={10} className="text-orange-500" />
                        <span>Identity Initialization Protocol</span>
                    </motion.div>
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tighter lowercase leading-none">Initialize.</h1>
                    <p className="text-zinc-600 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] mt-3">Node MATERIALIZATION Protocol // v11.12</p>
                </header>

                {/* Progress bar instead of big icons for screen-fit */}
                <div className="flex items-center justify-center gap-2 mb-8 md:mb-12 w-full max-w-[200px]">
                    {steps.map((s) => (
                        <div
                            key={s.id}
                            className={`h-1 cursor-pointer transition-all duration-500 ${step === s.id ? 'w-8 bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.4)]' : 'w-4 bg-zinc-900'}`}
                            onClick={() => step > s.id && setStep(s.id)}
                        />
                    ))}
                </div>

                {/* Content Area flex-1 to occupy available space */}
                <div className="w-full max-w-xl flex-1 flex flex-col justify-center min-h-0">
                    <Card glass className="p-0 border-zinc-900 overflow-hidden shadow-2xl rounded-[32px] md:rounded-[40px] bg-zinc-950/40 backdrop-blur-3xl flex flex-col min-h-0">
                        <div className="p-8 md:p-12 overflow-y-auto custom-scrollbar flex-1 min-h-0">
                            <AnimatePresence mode="wait">
                                {step === 1 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-8 md:space-y-10"
                                    >
                                        <div className="space-y-2">
                                            <h2 className="text-xl md:text-2xl font-bold tracking-tight uppercase">Credentials</h2>
                                            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed">Establish your base network handle.</p>
                                        </div>

                                        <div className="space-y-6 md:space-y-8">
                                            <div className="space-y-3">
                                                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 ml-1">Handle</Label>
                                                <div className="relative">
                                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-700 font-mono text-lg">@</span>
                                                    <Input
                                                        className="bg-black/50 border-zinc-900 focus:border-orange-500 rounded-2xl h-14 pl-12 font-mono text-base transition-all focus:ring-4 focus:ring-orange-500/5 placeholder:opacity-20"
                                                        placeholder="handle"
                                                        value={username}
                                                        onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                                                    />
                                                    <div className="absolute right-6 top-1/2 -translate-y-1/2">
                                                        {isChecking && <Loader2 size={18} className="text-zinc-700 animate-spin" />}
                                                        {!isChecking && isAvailable === true && <div className="bg-emerald-500/10 p-1 rounded-full"><Check size={14} className="text-emerald-500" /></div>}
                                                        {!isChecking && isAvailable === false && <div className="bg-red-500/10 p-1 rounded-full"><AlertCircle size={14} className="text-red-500" /></div>}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 ml-1">Headline</Label>
                                                <Input
                                                    className="bg-black/50 border-zinc-900 focus:border-orange-500 rounded-2xl h-14 text-xs px-8 font-bold transition-all uppercase tracking-widest"
                                                    placeholder="Role or Profession"
                                                    value={headline}
                                                    onChange={(e) => setHeadline(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <Button
                                            onClick={handleNextStep}
                                            disabled={!isAvailable || username.length < 3}
                                            className="w-full h-14 bg-white text-black font-bold uppercase tracking-[0.3em] text-[10px] rounded-2xl hover:bg-orange-500 hover:text-white transition-all group mt-4 shadow-xl disabled:opacity-20 flex items-center justify-center gap-3"
                                        >
                                            Continue
                                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </motion.div>
                                )}

                                {step === 2 && (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-8 md:space-y-10"
                                    >
                                        <div className="space-y-2">
                                            <h2 className="text-xl md:text-2xl font-bold tracking-tight uppercase">Visual identity</h2>
                                            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed">Upload or select your network look.</p>
                                        </div>

                                        <div className="space-y-8">
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 ml-1">Avatar</Label>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-7 text-[9px] font-bold text-orange-500 uppercase tracking-widest hover:bg-orange-500/5"
                                                        onClick={() => avatarInputRef.current?.click()}
                                                    >
                                                        <Upload size={10} className="mr-2" /> Upload File
                                                    </Button>
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        ref={avatarInputRef}
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) handleFileRead(file, setCustomAvatar);
                                                        }}
                                                    />
                                                </div>
                                                <div className="flex items-center gap-3 md:gap-4 overflow-x-auto pb-2 custom-scrollbar no-scrollbar">
                                                    {AVATAR_OPTIONS.map((url, i) => (
                                                        <button
                                                            key={i}
                                                            type="button"
                                                            onClick={() => { setAvatarUrl(url); setCustomAvatar(''); }}
                                                            className={`w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 transition-all shrink-0 ${avatarUrl === url && !customAvatar ? 'border-orange-500 scale-105 z-10 p-0.5 bg-black ring-4 ring-orange-500/10' : 'border-zinc-900 opacity-40 hover:opacity-100 p-0'}`}
                                                        >
                                                            <img src={url} alt={`Avatar ${i}`} className="w-full h-full object-cover rounded-full" />
                                                        </button>
                                                    ))}
                                                    {customAvatar && (
                                                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-orange-500 scale-105 p-0.5 bg-black ring-4 ring-orange-500/10">
                                                            <img src={customAvatar} alt="Custom Avatar" className="w-full h-full object-cover rounded-full" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 ml-1">Banner</Label>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-7 text-[9px] font-bold text-blue-500 uppercase tracking-widest hover:bg-blue-500/5"
                                                        onClick={() => bannerInputRef.current?.click()}
                                                    >
                                                        <Upload size={10} className="mr-2" /> Upload File
                                                    </Button>
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        ref={bannerInputRef}
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) handleFileRead(file, setCustomBanner);
                                                        }}
                                                    />
                                                </div>
                                                <div className="grid grid-cols-4 gap-2 md:gap-3">
                                                    {BANNER_OPTIONS.map((url, i) => (
                                                        <button
                                                            key={i}
                                                            type="button"
                                                            onClick={() => { setBannerUrl(url); setCustomBanner(''); }}
                                                            className={`h-12 md:h-14 rounded-xl overflow-hidden border-2 transition-all ${bannerUrl === url && !customBanner ? 'border-orange-500 scale-95 ring-4 ring-orange-500/10' : 'border-zinc-900 opacity-40 hover:opacity-100'}`}
                                                        >
                                                            <img src={url} alt={`Banner ${i}`} className="w-full h-full object-cover" />
                                                        </button>
                                                    ))}
                                                </div>
                                                {customBanner && (
                                                    <div className="h-12 md:h-14 rounded-xl overflow-hidden border-2 border-orange-500 relative ring-4 ring-orange-500/10">
                                                        <img src={customBanner} alt="Custom Banner" className="w-full h-full object-cover" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex gap-3 pt-4">
                                            <Button variant="ghost" onClick={handlePrevStep} className="h-14 font-bold uppercase tracking-widest text-[9px] border border-zinc-900 rounded-2xl px-6 md:px-10 hover:bg-zinc-900 focus:outline-none transition-all">
                                                <ChevronLeft size={14} className="mr-1" /> Back
                                            </Button>
                                            <Button
                                                onClick={handleNextStep}
                                                className="grow h-14 bg-white text-black font-bold uppercase tracking-[0.3em] text-[10px] rounded-2xl hover:bg-orange-500 hover:text-white transition-all group shadow-xl flex items-center justify-center gap-3"
                                            >
                                                Finalize
                                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
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
                                        className="space-y-6 md:space-y-10"
                                    >
                                        <div className="space-y-2">
                                            <h2 className="text-xl md:text-2xl font-bold tracking-tight uppercase">Ready for uplink</h2>
                                            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed">Final profile audit complete.</p>
                                        </div>

                                        <div className="space-y-6">
                                            {/* Profile Preview Minimalist */}
                                            <div className="bg-black border border-zinc-900 rounded-3xl overflow-hidden relative shadow-2xl">
                                                <div className="h-20 w-full overflow-hidden">
                                                    <img src={customBanner || bannerUrl} alt="Banner" className="w-full h-full object-cover opacity-50" />
                                                </div>
                                                <div className="p-6 pt-0 -mt-10 flex flex-col items-center md:items-start md:flex-row gap-4">
                                                    <div className="w-16 h-16 rounded-full border-4 border-black bg-zinc-950 overflow-hidden shrink-0 relative z-10 shadow-2xl">
                                                        <img src={customAvatar || avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="text-center md:text-left pt-11 md:pt-11">
                                                        <h3 className="text-lg font-bold tracking-tight uppercase leading-none">@{username}</h3>
                                                        <p className="text-orange-500 text-[9px] font-bold uppercase tracking-widest mt-2">{headline || 'PROTOCOL_NODE'}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 ml-1">Biography</Label>
                                                <Textarea
                                                    className="bg-black/50 border-zinc-900 focus:border-orange-500 rounded-2xl min-h-[100px] md:min-h-[120px] p-6 text-xs font-medium leading-relaxed transition-all resize-none focus:ring-4 focus:ring-orange-500/5 placeholder:opacity-20 scrollbar-hide"
                                                    placeholder="Synthesize your mission..."
                                                    value={bio}
                                                    onChange={(e) => setBio(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <Button variant="ghost" onClick={handlePrevStep} className="h-14 font-bold uppercase tracking-widest text-[9px] border border-zinc-900 rounded-2xl px-6 md:px-10 hover:bg-zinc-900 focus:outline-none transition-all">
                                                <ChevronLeft size={14} className="mr-1" /> Back
                                            </Button>
                                            <Button
                                                onClick={handleSubmit}
                                                disabled={isSubmitting}
                                                className="grow h-14 bg-white text-black font-bold uppercase tracking-[0.3em] text-[10px] rounded-2xl hover:bg-orange-500 hover:text-white transition-all group shadow-2xl flex items-center justify-center gap-3"
                                            >
                                                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : (
                                                    <>
                                                        Initialize Node
                                                        <Sparkles size={16} className="group-hover:scale-125 transition-all" />
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </Card>
                </div>

                {/* Footer Minimalized */}
                <div className="mt-8 text-center text-[8px] md:text-[9px] font-bold text-zinc-800 uppercase tracking-[0.4em] flex items-center justify-center gap-4 md:gap-8">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500/50 shadow-[0_0_10px_rgba(34,197,94,0.2)] rounded-full" />
                        <span>Mesh Synced</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
