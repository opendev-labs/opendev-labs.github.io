import React, { useState, useEffect } from 'react';
import { Terminal, Database, Cpu, Zap, Box, Code, Activity, Users, ShieldCheck, MessageSquare, Heart, Share2, MoreHorizontal, User as UserIcon, Briefcase, Globe, TrendingUp, Sparkles, Plus, Award, Image as ImageIcon, MapPin, Calendar } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/shadcn/button';
import { useAuth } from '../features/void/hooks/useAuth';
import { LamaDB } from '../lib/lamaDB';
import { Textarea } from '../components/ui/shadcn/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/shadcn/dialog';

export default function NexusHub() {
    const { user, profile, isLoading } = useAuth();
    const navigate = useNavigate();
    const [activeFeed, setActiveFeed] = useState('all');
    const [posts, setPosts] = useState<any[]>([]);
    const [newPostContent, setNewPostContent] = useState('');
    const [isPosting, setIsPosting] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        if (!isLoading && user && !profile?.username) {
            navigate('/onboarding');
        }
    }, [user, profile, isLoading, navigate]);

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

    const handleCreatePost = async () => {
        if (!newPostContent.trim() || !user) return;
        setIsPosting(true);
        try {
            const userContext = { uid: 'global', email: 'global' };
            const postObj = {
                id: Math.random().toString(36).substr(2, 9),
                author: {
                    name: user.name,
                    handle: profile?.username || 'anonymous',
                    headline: profile?.headline || 'Professional',
                    avatarUrl: profile?.avatarUrl || null
                },
                content: newPostContent,
                likes: 0,
                comments: 0,
                shares: 0,
                timestamp: new Date().toISOString(),
                tags: []
            };
            await LamaDB.store.collection('nexus_posts', userContext).add(postObj);
            setPosts(prev => [postObj, ...prev]);
            setNewPostContent('');
            setIsDialogOpen(false);
        } catch (e) {
            console.error("Failed to create post:", e);
        } finally {
            setIsPosting(false);
        }
    };

    const suggestedPosts = [
        {
            id: 's1',
            author: { name: "Hardy Smith", handle: "hardy_dev", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hardy", headline: "Full Stack Developer" },
            content: "Just finished a major update on the OpenStudio toolkit. The new AI integration is working flawlessly! Check it out in the systems registry.",
            likes: 124,
            comments: 18,
            time: "2h ago",
            tags: ["Development", "AI"]
        },
        {
            id: 's2',
            author: { name: "Sarah Miller", handle: "sarah_m", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah", headline: "Product Designer" },
            content: "Looking for feedback on the new profile banner layouts. Which one do you prefer? 🎨",
            likes: 89,
            comments: 42,
            time: "5h ago",
            tags: ["Design", "UX"]
        }
    ];

    const trendingTopics = [
        { name: "Web3 Evolution", count: "2.4k posts" },
        { name: "AI Architecture", count: "1.8k posts" },
        { name: "Remote Work 2026", count: "1.2k posts" },
        { name: "Open Source", count: "950 posts" }
    ];

    const allPosts = [...posts, ...suggestedPosts];

    if (isLoading) return null;

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-orange-500 selection:text-black font-sans">
            <main className="max-w-[1200px] mx-auto p-4 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Sidebar: Profile Summary & Navigation */}
                    <div className="lg:col-span-3 space-y-6">
                        <Card className="bg-zinc-950 border-zinc-900 overflow-hidden rounded-2xl shadow-2xl">
                            <div className="h-16 w-full bg-gradient-to-r from-orange-600 to-orange-400">
                                {profile?.bannerUrl && <img src={profile.bannerUrl} alt="Banner" className="w-full h-full object-cover opacity-50" />}
                            </div>
                            <div className="px-6 pb-6 text-center">
                                <div className="relative -mt-8 mb-4 flex justify-center">
                                    <div className="w-20 h-20 rounded-full border-4 border-zinc-950 bg-zinc-900 overflow-hidden shadow-xl">
                                        <img src={profile?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} alt="Avatar" className="w-full h-full object-cover" />
                                    </div>
                                </div>
                                <h3 className="font-bold text-lg leading-tight truncate">{user?.name}</h3>
                                <p className="text-zinc-500 text-xs font-mono mb-4">@{profile?.username || 'user'}</p>
                                <div className="h-[1px] bg-zinc-900 w-full mb-4" />
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                                        <span className="text-zinc-500">Profile Views</span>
                                        <span className="text-orange-500">1.2k</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                                        <span className="text-zinc-500">Post Impressions</span>
                                        <span className="text-orange-500">5.8k</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-zinc-900/50 p-4 border-t border-zinc-900">
                                <Link to={`/user/${profile?.username}`} className="text-[10px] font-bold text-white uppercase tracking-widest hover:text-orange-500 transition-colors flex items-center justify-center gap-2">
                                    <UserIcon size={12} />
                                    View Full Profile
                                </Link>
                            </div>
                        </Card>

                        <nav className="space-y-1">
                            {[
                                { label: 'Social Feed', icon: Activity, id: 'all' },
                                { label: 'My Network', icon: Users, id: 'network' },
                                { label: 'Trending', icon: TrendingUp, id: 'trending' },
                                { label: 'Messages', icon: MessageSquare, id: 'messages' }
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveFeed(item.id)}
                                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeFeed === item.id
                                        ? 'bg-zinc-900 text-white shadow-lg'
                                        : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/30'
                                        }`}
                                >
                                    <item.icon size={18} className={activeFeed === item.id ? 'text-orange-500' : ''} />
                                    <span>{item.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Middle: Professional Social Feed */}
                    <div className="lg:col-span-6 space-y-6">
                        {/* Create Post Card */}
                        <Card className="bg-zinc-950 border-zinc-900 p-6 rounded-2xl shadow-xl">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-zinc-900">
                                    <img src={profile?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} alt="Avatar" className="w-full h-full object-cover" />
                                </div>
                                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                    <DialogTrigger asChild>
                                        <button className="grow bg-zinc-900 hover:bg-zinc-800 text-zinc-500 text-left px-6 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500/20">
                                            What's on your mind, {user?.name?.split(' ')[0]}?
                                        </button>
                                    </DialogTrigger>
                                    <DialogContent className="bg-zinc-950 border-zinc-900 rounded-3xl max-w-xl p-0 overflow-hidden shadow-2xl">
                                        <DialogHeader className="p-6 border-b border-zinc-900">
                                            <DialogTitle className="text-sm font-bold uppercase tracking-widest text-white">Create New Post</DialogTitle>
                                        </DialogHeader>
                                        <div className="p-6 space-y-6">
                                            <div className="flex gap-3">
                                                <div className="w-10 h-10 rounded-full overflow-hidden border border-zinc-900">
                                                    <img src={profile?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} alt="Avatar" className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <div className="text-[12px] font-bold text-white uppercase tracking-tight">{user?.name}</div>
                                                    <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Posting to Public Feed</div>
                                                </div>
                                            </div>
                                            <Textarea
                                                className="min-h-[150px] bg-transparent border-none focus-visible:ring-0 text-lg leading-relaxed placeholder:text-zinc-700 resize-none p-0"
                                                placeholder="Share your thoughts, progress or questions..."
                                                value={newPostContent}
                                                onChange={(e) => setNewPostContent(e.target.value)}
                                            />
                                            <div className="flex items-center gap-4 py-4 border-t border-zinc-900">
                                                <button className="text-zinc-500 hover:text-orange-500 transition-colors"><ImageIcon size={20} /></button>
                                                <button className="text-zinc-500 hover:text-orange-500 transition-colors"><Zap size={20} /></button>
                                                <div className="grow" />
                                                <Button
                                                    className="bg-white text-black font-bold uppercase tracking-widest text-[10px] rounded-full px-8 hover:bg-orange-500 hover:text-white transition-all h-10 shadow-lg disabled:opacity-50"
                                                    onClick={handleCreatePost}
                                                    disabled={isPosting || !newPostContent}
                                                >
                                                    {isPosting ? 'Posting...' : 'Share Post'}
                                                </Button>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </Card>

                        {/* Feed Filter */}
                        <div className="flex items-center gap-2 py-2">
                            <div className="h-[1px] grow bg-zinc-900" />
                            <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.3em] px-4">Latest Updates</span>
                            <div className="h-[1px] grow bg-zinc-900" />
                        </div>

                        {/* Post List */}
                        <div className="space-y-6">
                            {allPosts.map((post, i) => (
                                <motion.div
                                    key={post.id || i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 shadow-xl group hover:border-zinc-700 transition-all"
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 rounded-full overflow-hidden border border-zinc-900 shrink-0">
                                                <img src={post.author.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author.name}`} alt="Avatar" className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="text-[13px] font-bold text-white uppercase tracking-tight">{post.author.name}</h4>
                                                    <span className="text-[10px] text-zinc-600 font-mono">@{post.author.handle}</span>
                                                </div>
                                                <p className="text-[9px] font-bold text-orange-500 uppercase tracking-widest mt-0.5">{post.author.headline}</p>
                                            </div>
                                        </div>
                                        <button className="text-zinc-700 hover:text-white transition-colors"><MoreHorizontal size={18} /></button>
                                    </div>

                                    <div className="space-y-4 mb-6">
                                        <p className="text-zinc-300 text-[14px] leading-relaxed font-medium">
                                            {post.content}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {post.tags.map((tag: string) => (
                                                <span key={tag} className="text-[8px] font-bold text-zinc-600 hover:text-orange-500 transition-colors cursor-pointer uppercase tracking-widest">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-zinc-900/50 flex items-center justify-between">
                                        <div className="flex items-center gap-6">
                                            <button className="flex items-center gap-2 text-[10px] font-bold text-zinc-600 hover:text-orange-500 transition-all uppercase tracking-widest focus:outline-none">
                                                <Heart size={16} />
                                                <span>{post.likes}</span>
                                            </button>
                                            <button className="flex items-center gap-2 text-[10px] font-bold text-zinc-600 hover:text-white transition-all uppercase tracking-widest focus:outline-none">
                                                <MessageSquare size={16} />
                                                <span>{post.comments || 0}</span>
                                            </button>
                                        </div>
                                        <button className="flex items-center gap-2 text-[10px] font-bold text-zinc-600 hover:text-white transition-all uppercase tracking-widest focus:outline-none">
                                            <Share2 size={16} />
                                            <span>Share</span>
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="py-12 flex flex-col items-center justify-center space-y-4">
                            <div className="w-8 h-[2px] bg-zinc-900" />
                            <span className="text-[9px] font-bold text-zinc-700 uppercase tracking-[0.4em]">Stay tuned for more updates</span>
                        </div>
                    </div>

                    {/* Right Sidebar: Trending Topics & Suggestions */}
                    <div className="lg:col-span-3 space-y-6">
                        <Card className="bg-zinc-950 border-zinc-900 p-6 rounded-2xl shadow-xl">
                            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <TrendingUp size={14} className="text-orange-500" />
                                Trending Topics
                            </h3>
                            <div className="space-y-6">
                                {trendingTopics.map((topic) => (
                                    <div key={topic.name} className="group cursor-pointer">
                                        <div className="text-[11px] font-bold text-white group-hover:text-orange-500 transition-colors uppercase tracking-tight">{topic.name}</div>
                                        <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-1">{topic.count}</div>
                                    </div>
                                ))}
                            </div>
                            <Button variant="ghost" className="w-full mt-6 text-[9px] font-bold text-zinc-600 uppercase tracking-widest hover:text-white h-8">View All Topics</Button>
                        </Card>

                        <Card className="bg-zinc-950 border-zinc-900 p-6 rounded-2xl shadow-xl">
                            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em] mb-6">Who to follow</h3>
                            <div className="space-y-4">
                                {[
                                    { name: "Morpheus", handle: "morpheus_ai", head: "Matrix Designer" },
                                    { name: "Trinity", handle: "trinity_dev", head: "Neural Link Architect" }
                                ].map((person) => (
                                    <div key={person.handle} className="flex items-center gap-3 group">
                                        <div className="w-10 h-10 rounded-full bg-zinc-900 overflow-hidden border border-zinc-800">
                                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${person.name}`} alt="user" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="grow">
                                            <div className="text-[11px] font-bold text-white group-hover:text-orange-500 transition-colors uppercase tracking-tight leading-none mb-1">{person.name}</div>
                                            <div className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest truncate">{person.head}</div>
                                        </div>
                                        <Button size="icon" variant="ghost" className="w-8 h-8 rounded-full border border-zinc-900 text-zinc-600 hover:text-white hover:border-orange-500 transition-all">
                                            <Plus size={14} />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <footer className="px-4 text-[9px] font-bold text-zinc-700 uppercase tracking-widest space-y-4">
                            <div className="flex flex-wrap gap-4 justify-center">
                                <span>About</span>
                                <span>Privacy</span>
                                <span>Terms</span>
                                <span>Security</span>
                            </div>
                            <p className="text-center opacity-50">© 2026 OpenDev Labs // Nexus</p>
                        </footer>
                    </div>
                </div>
            </main>
        </div>
    );
}
