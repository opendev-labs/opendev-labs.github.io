import React, { useState, useEffect } from 'react';
import { Terminal, Database, Cpu, Zap, Box, Code, Activity, Users, ShieldCheck, MessageSquare, Heart, Share2, MoreHorizontal, User as UserIcon, Briefcase, Globe, TrendingUp, Sparkles, Plus, Award } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/shadcn/button';
import { useAuth } from '../features/void/hooks/useAuth';
import { LamaDB } from '../lib/lamaDB';
import { Textarea } from '../components/ui/shadcn/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/shadcn/dialog';

export default function NexusDashboard() {
    const { user, profile, isLoading } = useAuth();
    const navigate = useNavigate();
    const [activeFeed, setActiveFeed] = useState('trending');
    const [posts, setPosts] = useState<any[]>([]);
    const [newPostContent, setNewPostContent] = useState('');
    const [isPosting, setIsPosting] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        if (!isLoading && user && !profile?.username) {
            navigate('/onboarding');
        }
    }, [user, profile, isLoading, navigate]);

    // Handle logout or auth loss
    useEffect(() => {
        if (!isLoading && !user) {
            navigate('/auth');
        }
    }, [user, isLoading, navigate]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const userContext = { uid: 'global', email: 'global' };
                const fetched = await LamaDB.store.collection('nexus_posts', userContext).get() as any[];
                if (Array.isArray(fetched)) {
                    setPosts(fetched.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
                }
            } catch (e) {
                console.error("Failed to fetch posts:", e);
            }
        };
        fetchPosts();
    }, []);

    const handleMaterializePost = async () => {
        if (!newPostContent.trim() || !user) return;
        setIsPosting(true);
        try {
            const userContext = { uid: 'global', email: 'global' };
            const postObj = {
                id: Math.random().toString(36).substr(2, 9),
                author: {
                    name: profile?.username || user.name,
                    handle: profile?.username || 'anonymous',
                    headline: profile?.headline || 'Intelligence Architect'
                },
                content: newPostContent,
                likes: 0,
                shares: 0,
                timestamp: new Date().toISOString(),
                tags: []
            };
            await LamaDB.store.collection('nexus_posts', userContext).add(postObj);
            setPosts(prev => [postObj, ...prev]);
            setNewPostContent('');
            setIsDialogOpen(false);
        } catch (e) {
            console.error("Failed to materialize post:", e);
        } finally {
            setIsPosting(false);
        }
    };

    const feedItems = [
        {
            id: 1,
            author: { name: "Hardy Smith", handle: "hardy_ai", avatar: null, headline: "AI Architect @ OpenDev" },
            content: "Just materialized a new neural bridge for Spoon CLI. The latency is down by 40%. Full documentation live on my node profile.",
            likes: 42,
            shares: 12,
            time: "2h ago",
            tags: ["AI", "Spoon", "CLI"]
        },
        {
            id: 2,
            author: { name: "Sarah Chen", handle: "schen_dev", avatar: null, headline: "Systems Engineer" },
            content: "Excited to join the OpenDev Mesh! Looking for collaborators for a decentralized compute project. Handshake in bio.",
            likes: 24,
            shares: 5,
            time: "4h ago",
            tags: ["OpenDev", "Startup", "Collaborate"]
        },
        {
            id: 3,
            author: { name: "Titan Operator", handle: "titan_prime", avatar: null, headline: "Security Protocol Sentinel" },
            content: "Nexus Registry v12.01 is now active. All nodes please synchronize. Enhanced encryption layer deployed globally.",
            likes: 156,
            shares: 89,
            time: "6h ago",
            tags: ["Security", "Protocol", "Update"]
        }
    ];

    const trendingNodes = [
        { name: "Spoon CLI", growth: "+12.4%", status: "trending" },
        { name: "Void-IDE", growth: "+8.1%", status: "active" },
        { name: "LamaDB", growth: "+15.6%", status: "exploding" },
        { name: "Quantum-APIs", growth: "+5.2%", status: "stable" }
    ];

    const combinedPosts = [...posts, ...feedItems]; // Show user posts first

    if (isLoading) return null;

    return (
        <div className="min-h-screen bg-black text-white selection:bg-orange-500 selection:text-black font-sans">
            {/* Background Atmosphere */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full opacity-[0.03]"
                    style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '50px 50px' }}
                />
                <div className="absolute top-1/4 right-1/4 w-[800px] h-[800px] bg-orange-600/5 blur-[150px] rounded-none animate-pulse" />
            </div>

            <main className="relative z-10 max-w-[1400px] mx-auto p-6 md:p-12">
                {/* Header Context */}
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-16 border-b border-zinc-900 pb-12">
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-none bg-zinc-900 border border-zinc-800 text-[10px] font-bold text-orange-500 uppercase tracking-[0.4em]">
                                <Globe size={14} />
                                <span>Nexus Network // Global Mesh Hub</span>
                            </div>
                            <Link to="/systems" className="text-[10px] font-bold text-zinc-600 hover:text-white transition-colors uppercase tracking-[0.4em] flex items-center gap-2 group">
                                <Box size={12} className="group-hover:text-orange-500 transition-colors" />
                                Systems Registry
                            </Link>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter uppercase leading-[0.8]">
                            nexus<br /><span className="text-zinc-600 text-5xl md:text-7xl">network.</span>
                        </h1>
                        <p className="text-zinc-500 text-sm font-medium tracking-tight uppercase tracking-[0.3em] opacity-80">
                            Professional Intelligence Layer // NODE: <span className="text-white">@{profile?.username || user?.name || 'anonymous'}</span>
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <Link to={`/user/${profile?.username}`}>
                            <Button className="h-12 bg-white text-black font-bold uppercase tracking-widest text-[10px] rounded-none px-8 hover:bg-orange-500 hover:text-white transition-all">
                                <UserIcon size={14} className="mr-2" />
                                My Node Profile
                            </Button>
                        </Link>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="h-12 border-zinc-800 text-zinc-400 font-bold uppercase tracking-widest text-[10px] rounded-none px-8 hover:text-white hover:border-zinc-600 transition-all">
                                    <Plus size={14} className="mr-2" />
                                    Materialize Post
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-zinc-950 border-zinc-900 rounded-none max-w-2xl p-0 overflow-hidden">
                                <DialogHeader className="p-8 border-b border-zinc-900 bg-black">
                                    <DialogTitle className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.4em] mb-4 flex items-center gap-2">
                                        <ShieldCheck size={14} /> Materialize Node Content
                                    </DialogTitle>
                                    <div className="flex gap-4 items-center">
                                        <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                                            <UserIcon size={18} className="text-zinc-600" />
                                        </div>
                                        <div>
                                            <div className="text-[11px] font-bold text-white uppercase tracking-tight">{profile?.username || user?.name}</div>
                                            <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Protocol Identified</div>
                                        </div>
                                    </div>
                                </DialogHeader>
                                <div className="p-8 space-y-8 bg-zinc-950/50">
                                    <Textarea
                                        className="min-h-[200px] bg-black border-zinc-900 rounded-none focus:border-orange-500 text-sm leading-relaxed"
                                        placeholder="Broadcast to the Mesh..."
                                        value={newPostContent}
                                        onChange={(e) => setNewPostContent(e.target.value)}
                                    />
                                    <div className="flex justify-end gap-4">
                                        <Button
                                            variant="ghost"
                                            className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest hover:text-white"
                                            onClick={() => setIsDialogOpen(false)}
                                        >
                                            Abort
                                        </Button>
                                        <Button
                                            className="h-12 bg-white text-black font-bold uppercase tracking-widest text-[10px] rounded-none px-10 hover:bg-orange-500 hover:text-white transition-all disabled:opacity-50"
                                            onClick={handleMaterializePost}
                                            disabled={isPosting || !newPostContent}
                                        >
                                            {isPosting ? 'Broadcasting...' : 'Uplink Stream'}
                                        </Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Sidebar: Nav & Identity */}
                    <div className="lg:col-span-3 space-y-12">
                        <div className="space-y-6">
                            <h3 className="text-[10px] font-bold text-zinc-700 uppercase tracking-[0.4em] ml-2">Channel Substrates</h3>
                            <nav className="flex flex-col gap-1">
                                {[
                                    { label: 'Trending', icon: TrendingUp, id: 'trending' },
                                    { label: 'Global Feed', icon: Globe, id: 'global' },
                                    { label: 'Mesh Contacts', icon: Users, id: 'contacts' },
                                    { label: 'Handshakes', icon: Sparkles, id: 'handshakes' }
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveFeed(item.id)}
                                        className={`flex items-center gap-4 px-4 py-4 text-[11px] font-bold uppercase tracking-widest transition-all ${activeFeed === item.id
                                            ? 'bg-zinc-900 text-white border-r-2 border-orange-500'
                                            : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'
                                            }`}
                                    >
                                        <item.icon size={16} />
                                        <span>{item.label}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>

                        <div className="space-y-6 pt-12 border-t border-zinc-900">
                            <h3 className="text-[10px] font-bold text-zinc-700 uppercase tracking-[0.4em] ml-2">Trending Nodes</h3>
                            <div className="space-y-4">
                                {trendingNodes.map((node) => (
                                    <div key={node.name} className="flex flex-col gap-1 px-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[11px] font-bold text-zinc-300 hover:text-orange-500 transition-colors cursor-pointer">{node.name}</span>
                                            <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">{node.growth}</span>
                                        </div>
                                        <div className="w-full h-[1px] bg-zinc-900 flex">
                                            <div className={`h-full bg-orange-500/50 animate-pulse`} style={{ width: node.growth.replace('+', '') }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Middle: Professional Feed */}
                    <div className="lg:col-span-6 space-y-8">
                        <div className="space-y-6">
                            {combinedPosts.map((post, i) => (
                                <motion.div
                                    key={post.id || i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-zinc-950/20 border border-zinc-900/50 p-8 group hover:border-zinc-700 transition-all"
                                >
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                                                <UserIcon size={20} className="text-zinc-600" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="text-sm font-bold uppercase tracking-tight text-white">{post.author.name}</h4>
                                                    <span className="text-[10px] text-zinc-600 font-mono">@{post.author.handle}</span>
                                                </div>
                                                <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mt-1 opacity-80">{post.author.headline}</p>
                                            </div>
                                        </div>
                                        <span className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest">{post.time || new Date(post.timestamp).toLocaleDateString()}</span>
                                    </div>

                                    <div className="space-y-6">
                                        <p className="text-zinc-400 text-sm leading-relaxed font-medium">
                                            {post.content}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {post.tags.map((tag: string) => (
                                                <span key={tag} className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest px-2 py-1 bg-zinc-900 border border-zinc-800">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-8 border-t border-zinc-900/50 flex items-center gap-8">
                                        <button className="flex items-center gap-2 text-[10px] font-bold text-zinc-600 hover:text-orange-500 transition-colors uppercase tracking-widest ring-0 outline-none">
                                            <Heart size={14} />
                                            <span>{post.likes}</span>
                                        </button>
                                        <button className="flex items-center gap-2 text-[10px] font-bold text-zinc-600 hover:text-blue-500 transition-colors uppercase tracking-widest ring-0 outline-none">
                                            <MessageSquare size={14} />
                                            <span>Reply</span>
                                        </button>
                                        <button className="flex items-center gap-2 text-[10px] font-bold text-zinc-600 hover:text-white transition-colors uppercase tracking-widest ml-auto ring-0 outline-none">
                                            <Share2 size={14} />
                                            <span>{post.shares}</span>
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="py-12 flex flex-col items-center justify-center space-y-4 border-t border-zinc-900">
                            <div className="w-1.5 h-1.5 bg-orange-500 animate-bounce" />
                            <span className="text-[10px] font-bold text-zinc-700 uppercase tracking-[0.6em]">End of Transmission</span>
                        </div>
                    </div>

                    {/* Right Sidebar: Personal Stats & Actions */}
                    <div className="lg:col-span-3 space-y-12">
                        <section className="bg-zinc-950 border border-zinc-900 p-8 space-y-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <Award size={80} className="text-orange-500" />
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.4em]">Node Vitality</h3>
                                <div className="space-y-6">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between items-end">
                                            <span className="text-2xl font-bold tracking-tighter text-white">1,240</span>
                                            <span className="text-[9px] font-bold text-orange-500 uppercase tracking-widest mb-1">Intelligence Score</span>
                                        </div>
                                        <div className="w-full h-1 bg-zinc-900">
                                            <div className="h-full bg-orange-600 w-3/4" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-zinc-900 p-4 border border-zinc-800">
                                            <span className="text-[8px] text-zinc-600 block uppercase font-bold mb-1">Handshakes</span>
                                            <span className="text-sm font-bold text-white tracking-tight">42</span>
                                        </div>
                                        <div className="bg-zinc-900 p-4 border border-zinc-800">
                                            <span className="text-[8px] text-zinc-600 block uppercase font-bold mb-1">Nodes Linked</span>
                                            <span className="text-sm font-bold text-white tracking-tight">128</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-6">
                            <h3 className="text-[10px] font-bold text-zinc-700 uppercase tracking-[0.4em] ml-2">Suggested Connections</h3>
                            <div className="space-y-2">
                                {[
                                    { name: "Morpheus", handle: "architect_zero", headline: "Matrix Designer" },
                                    { name: "Trinity", handle: "neural_link", headline: "Core Dev" }
                                ].map((suggested) => (
                                    <div key={suggested.handle} className="bg-zinc-950/40 border border-zinc-900 p-4 hover:border-zinc-700 transition-all flex items-center justify-between group">
                                        <div>
                                            <h5 className="text-[11px] font-bold uppercase tracking-tight text-zinc-300">{suggested.name}</h5>
                                            <p className="text-[9px] text-zinc-600 font-mono">@{suggested.handle}</p>
                                        </div>
                                        <button className="w-8 h-8 bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-orange-500 transition-all">
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>

                <footer className="mt-32 pt-12 border-t border-zinc-900 flex justify-between items-center text-[9px] font-bold text-zinc-700 uppercase tracking-widest italic">
                    <p>© 2026 OpenDev-Labs // Nexus Network Core</p>
                    <div className="flex gap-8">
                        <span>Terminal: v11.12-HUB</span>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-green-500 animate-pulse" />
                            <span>Sovereign Encryption Active</span>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
}
