import React, { useState, useEffect } from 'react';
import { Terminal, Database, Cpu, Zap, Box, Code, Activity, Users, ShieldCheck, MessageSquare, Heart, Share2, MoreHorizontal, User as UserIcon, Briefcase, Globe, TrendingUp, Sparkles, Plus, Award, Image as ImageIcon, MapPin, Calendar, Check, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/shadcn/button';
import { useAuth } from '../features/void/hooks/useAuth';
import { LamaDB } from '../lib/lamaDB';
import { Textarea } from '../components/ui/shadcn/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/shadcn/dialog';

export default function OpenHub() {
    const { user, profile, isLoading, updateProfile } = useAuth();
    const navigate = useNavigate();
    const [activeFeed, setActiveFeed] = useState('all');
    const [posts, setPosts] = useState<any[]>([]);
    const [newPostContent, setNewPostContent] = useState('');
    const [isPosting, setIsPosting] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [suggestedUsers, setSuggestedUsers] = useState<any[]>([]);
    const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
    const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());

    // Removal of Onboarding Redirect in favor of Universal Identity System

    useEffect(() => {
        if (!isLoading && !user) {
            navigate('/auth');
        }
    }, [user, isLoading, navigate]);

    useEffect(() => {
        const fetchHubData = async () => {
            try {
                const userContext = { uid: 'global', email: 'global' };
                // Fetch Posts
                const fetchedPosts = await LamaDB.store.collection('open_hub_posts', userContext).get() as any[];
                if (Array.isArray(fetchedPosts)) {
                    setPosts(fetchedPosts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
                }

                // Fetch Suggested Users (other profiles)
                const allProfiles = await LamaDB.store.collection('profiles', userContext).get() as any[];
                if (Array.isArray(allProfiles) && user) {
                    const filtered = allProfiles
                        .filter(p => p.uid !== user.uid)
                        .slice(0, 5);
                    setSuggestedUsers(filtered);
                }

                // If logged in, fetch user's social state
                if (user && profile) {
                    setLikedPosts(new Set(profile.likedPosts || []));
                    setFollowedUsers(new Set(profile.following || []));
                }
            } catch (e) {
                console.error("Hub Core Sync Failed:", e);
            }
        };
        fetchHubData();
    }, [user, profile]);

    const handleCreatePost = async () => {
        if (!newPostContent.trim() || !user) return;
        setIsPosting(true);
        try {
            const userContext = { uid: 'global', email: 'global' };
            // Simple hashtag extraction
            const tags = newPostContent.match(/#[a-z0-9]+/gi)?.map(t => t.slice(1)) || [];
            
            const postObj = {
                id: Math.random().toString(36).substr(2, 9),
                uid: user.uid,
                author: {
                    name: user.name,
                    handle: profile?.username || 'anonymous',
                    headline: profile?.headline || 'Professional',
                    avatarUrl: profile?.avatarUrl || null,
                    isAgent: profile?.headline?.toLowerCase().includes('agent') || profile?.username?.toLowerCase().includes('bot')
                },
                content: newPostContent,
                likes: 0,
                likedBy: [],
                comments: 0,
                shares: 0,
                timestamp: new Date().toISOString(),
                tags: tags
            };
            await LamaDB.store.collection('open_hub_posts', userContext).add(postObj);
            setPosts(prev => [postObj, ...prev]);
            setNewPostContent('');
            setIsDialogOpen(false);
        } catch (e) {
            console.error("Failed to create post:", e);
        } finally {
            setIsPosting(false);
        }
    };

    const handleToggleLike = async (postId: string) => {
        if (!user || !profile) return;
        
        const isLiked = likedPosts.has(postId);
        const newLikedPosts = new Set(likedPosts);
        
        if (isLiked) newLikedPosts.delete(postId);
        else newLikedPosts.add(postId);
        
        setLikedPosts(newLikedPosts);
        
        // Update Post in Global Feed
        try {
            const userContext = { uid: 'global', email: 'global' };
            const post = posts.find(p => p.id === postId);
            if (post) {
                const updatedLikes = isLiked ? Math.max(0, (post.likes || 0) - 1) : (post.likes || 0) + 1;
                // Update post locally for speed
                setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: updatedLikes } : p));
                
                // Persist to DB
                // Note: Real implement would use transaction, but here we update post object
                await LamaDB.store.collection('open_hub_posts', userContext).update(post.id_db || post.id, { 
                    likes: updatedLikes 
                });
            }
            
            // Persist to User Profile
            await updateProfile({ likedPosts: Array.from(newLikedPosts) });
        } catch (e) {
            console.error("Like sync failed:", e);
        }
    };

    const handleFollowUser = async (targetUserId: string) => {
        if (!user || !profile) return;
        
        const isFollowing = followedUsers.has(targetUserId);
        const newFollowing = new Set(followedUsers);
        
        if (isFollowing) newFollowing.delete(targetUserId);
        else newFollowing.add(targetUserId);
        
        setFollowedUsers(newFollowing);
        
        try {
            await updateProfile({ following: Array.from(newFollowing) });
        } catch (e) {
            console.error("Follow sync failed:", e);
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

    const trendingTopics = Array.from(new Set(posts.flatMap(p => p.tags || [])))
        .map(tag => ({
            name: tag,
            count: posts.filter(p => p.tags?.includes(tag)).length + " nodes"
        }))
        .sort((a, b) => parseInt(b.count) - parseInt(a.count))
        .slice(0, 4);

    if (trendingTopics.length === 0) {
        trendingTopics.push(
            { name: "Global Community", count: "ACTIVE" },
            { name: "System Network", count: "89% SYNC" },
            { name: "AI Architecture", count: "1.8k posts" },
            { name: "Developer Chat", count: "LOW LATENCY" }
        );
    }

    const filteredPosts = posts.filter(post => {
        if (activeFeed === 'all') return true;
        if (activeFeed === 'network') return followedUsers.has(post.uid);
        if (activeFeed === 'trending') return (post.likes || 0) > 2; // Simple trending logic
        return true;
    });

    const allPostsDisplay = [...filteredPosts, ...suggestedPosts];
    // Fail-safe alias to prevent crashes during browser cache transitions
    const allPosts = allPostsDisplay;

    if (isLoading) return null;

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-orange-500 selection:text-black font-sans">
            <main className="max-w-[1200px] mx-auto p-3 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-8">

                    {/* Left Sidebar: Profile Summary & Navigation */}
                    <div className="lg:col-span-3 space-y-6">
                        <Card className="bg-zinc-950 border-zinc-900 overflow-hidden rounded-2xl shadow-2xl">
                            <div className="h-16 w-full bg-gradient-to-r from-zinc-800 to-zinc-900 relative overflow-hidden">
                                {profile?.bannerUrl && <img src={profile.bannerUrl} alt="Banner" className="w-full h-full object-cover opacity-50" />}
                                {!profile?.username && (
                                    <div className="absolute inset-0 bg-white/5 animate-pulse" />
                                )}
                            </div>
                            <div className="px-6 pb-6 text-center relative">
                                <div className="absolute top-0 left-0 w-full h-px bg-orange-500/50 shadow-[0_0_10px_orange] animate-scan-y pointer-events-none" />
                                <div className="relative -mt-8 mb-4 flex justify-center">
                                    <div className="w-20 h-20 rounded-full border-4 border-zinc-950 bg-zinc-900 overflow-hidden shadow-xl">
                                        <img src={profile?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} alt="Avatar" className="w-full h-full object-cover" />
                                    </div>
                                </div>
                                <h3 className="font-bold text-lg leading-tight truncate">{user?.name}</h3>
                                <p className="text-zinc-500 text-xs font-mono mb-4">{profile?.username ? `@${profile.username}` : 'New Member'}</p>
                                <div className="h-[1px] bg-zinc-900 w-full mb-4" />
                                <div className="py-4">
                                    <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest leading-relaxed">
                                        Node Status: <span className="text-emerald-500">Active & Synced</span>
                                    </p>
                                </div>
                            </div>
                            <div className="bg-zinc-900/50 p-4 border-t border-zinc-900">
                                <button
                                    onClick={() => alert("Profile Editing coming soon in settings.")}
                                    className="w-full text-[10px] font-bold text-zinc-500 uppercase tracking-widest hover:text-white transition-colors flex items-center justify-center gap-2"
                                >
                                    <Plus size={12} />
                                    Edit Node Details
                                </button>
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
                        {activeFeed === 'messages' ? (
                            <div className="min-h-[400px] flex flex-col items-center justify-center space-y-6 bg-zinc-950 border border-zinc-900 rounded-3xl p-12">
                                <MessageSquare size={48} className="text-zinc-800 animate-pulse" />
                                <div className="text-center space-y-2">
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-white">Encrypted Messaging Layer</h3>
                                    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Initialization Pending // Secure P2P Tunnel Required</p>
                                </div>
                                <Button 
                                    onClick={() => setActiveFeed('all')}
                                    variant="ghost" 
                                    className="text-[9px] font-bold text-orange-500 uppercase tracking-widest hover:bg-orange-500/10"
                                >
                                    Return to Feed
                                </Button>
                            </div>
                        ) : (
                            <>
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
                                                    {isPosting ? 'Broadcasting...' : 'Broadcast Node'}
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
                            {allPostsDisplay.map((post, i) => (
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
                                                    {post.author.isAgent ? (
                                                        <span className="flex items-center gap-1 bg-purple-500/10 text-purple-400 text-[8px] font-black px-1.5 py-0.5 rounded border border-purple-500/20 uppercase tracking-tighter">
                                                            <Zap size={8} fill="currentColor" /> Verified Agent
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-1 bg-blue-500/10 text-blue-400 text-[8px] font-black px-1.5 py-0.5 rounded border border-blue-500/20 uppercase tracking-tighter">
                                                            <Users size={8} fill="currentColor" /> Developer
                                                        </span>
                                                    )}
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
                                                <span 
                                                    key={tag} 
                                                    onClick={() => {
                                                        setActiveFeed('all');
                                                        setNewPostContent(prev => prev.includes(`#${tag}`) ? prev : prev + ` #${tag}`);
                                                    }}
                                                    className="text-[8px] font-bold text-zinc-600 hover:text-orange-500 transition-colors cursor-pointer uppercase tracking-widest"
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-zinc-900/50 flex items-center justify-between">
                                        <div className="flex items-center gap-6">
                                            <button 
                                                onClick={() => handleToggleLike(post.id)}
                                                className={`flex items-center gap-2 text-[10px] font-bold transition-all uppercase tracking-widest focus:outline-none ${
                                                    likedPosts.has(post.id) ? 'text-orange-500' : 'text-zinc-600 hover:text-orange-500'
                                                }`}
                                            >
                                                <Heart size={16} fill={likedPosts.has(post.id) ? "currentColor" : "none"} />
                                                <span>{post.likes}</span>
                                            </button>
                                            <button className="flex items-center gap-2 text-[10px] font-bold text-zinc-600 hover:text-white transition-all uppercase tracking-widest focus:outline-none">
                                                <MessageSquare size={16} />
                                                <span>{post.comments || 0}</span>
                                            </button>
                                        </div>
                                         <button 
                                            onClick={() => {
                                                navigator.clipboard.writeText(window.location.href + '?post=' + post.id);
                                                alert("Network Link copied to clipboard!");
                                            }}
                                            className="flex items-center gap-2 text-[10px] font-bold text-zinc-600 hover:text-white transition-all uppercase tracking-widest focus:outline-none"
                                        >
                                            <Share2 size={16} />
                                            <span>Share</span>
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                            </div>
                            </>
                        )}
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
                                    <div 
                                        key={topic.name} 
                                        onClick={() => {
                                            setActiveFeed('all');
                                            setNewPostContent(prev => prev.includes(`#${topic.name}`) ? prev : prev + ` #${topic.name}`);
                                        }}
                                        className="group cursor-pointer"
                                    >
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
                                {suggestedUsers.length > 0 ? suggestedUsers.map((person) => (
                                    <div key={person.uid} className="flex items-center gap-3 group">
                                        <div className="w-10 h-10 rounded-full bg-zinc-900 overflow-hidden border border-zinc-800">
                                            <img src={person.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${person.displayName}`} alt="user" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="grow">
                                            <div className="text-[11px] font-bold text-white group-hover:text-orange-500 transition-colors uppercase tracking-tight leading-none mb-1 truncate max-w-[100px]">{person.displayName || person.username}</div>
                                            <div className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest truncate max-w-[100px]">{person.headline || 'Professional'}</div>
                                        </div>
                                        <Button 
                                            size="icon" 
                                            variant="ghost" 
                                            onClick={() => handleFollowUser(person.uid)}
                                            className={`w-8 h-8 rounded-full border transition-all ${
                                                followedUsers.has(person.uid) 
                                                ? 'border-orange-500 text-orange-500 bg-orange-500/10' 
                                                : 'border-zinc-900 text-zinc-600 hover:text-white hover:border-orange-500'
                                            }`}
                                        >
                                            {followedUsers.has(person.uid) ? <Check size={14} /> : <Plus size={14} />}
                                        </Button>
                                    </div>
                                )) : (
                                    <div className="text-center py-4">
                                        <p className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest animate-pulse">// Waiting for other nodes...</p>
                                    </div>
                                )}
                            </div>
                        </Card>

                        <footer className="px-4 text-[9px] font-bold text-zinc-700 uppercase tracking-widest space-y-4">
                            <div className="flex flex-wrap gap-4 justify-center">
                                <span>About</span>
                                <span>Privacy</span>
                                <span>Terms</span>
                                <span>Security</span>
                            </div>
                            <p className="text-center opacity-50">© 2026 OpenDev Labs // Open-Hub</p>
                        </footer>
                    </div>
                </div>
            </main>

        </div>
    );
}
