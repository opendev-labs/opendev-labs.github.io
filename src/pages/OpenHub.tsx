import React, { useState, useEffect } from 'react';
import { Terminal, Database, Cpu, Zap, Box, Code, Activity, Users, Shield, ShieldCheck, Github, MessageSquare, Heart, Share2, MoreHorizontal, User as UserIcon, Briefcase, Globe, TrendingUp, Sparkles, Plus, Award, Image as ImageIcon, MapPin, Calendar, Check, AlertCircle, Search, Filter } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/shadcn/button';
import { useAuth } from '../features/void/hooks/useAuth';
import { LamaDB } from '../lib/lamaDB';
import { Textarea } from '../components/ui/shadcn/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/shadcn/dialog';

import { ProjectCard } from '../features/hub/components/ProjectCard';
import { MessagingLayer } from '../features/hub/components/MessagingLayer';
import { HubService, ProjectMetadata } from '../services/hubService';
import { AgentService } from '../services/agentService';
import { SampleDataService } from '../services/sampleData';
import { UserProfile } from '../features/void/types';

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
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isLegalOpen, setIsLegalOpen] = useState(false);
    const [legalType, setLegalType] = useState('About');
    const [editData, setEditData] = useState<Partial<UserProfile>>({});
    const [projectUrl, setProjectUrl] = useState('');
    const [attachedProject, setAttachedProject] = useState<ProjectMetadata | null>(null);
    const [isSyncingProject, setIsSyncingProject] = useState(false);
    const [isTopicsExpanded, setIsTopicsExpanded] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Removal of Onboarding Redirect in favor of Universal Identity System

    useEffect(() => {
        if (!isLoading && !user) {
            navigate('/auth');
        }
    }, [user, isLoading, navigate]);

    useEffect(() => {
        if (!user) return;
        
        const userContext = { uid: 'global', email: 'global' };
        
        // Subscribe to LIVE Feed
        console.log("🚀 MESH_SYNC: Establishing Real-time Node Handshake...");
        const unsubscribe = LamaDB.store.collection('open_hub_posts', userContext).subscribe((fetchedPosts) => {
            if (Array.isArray(fetchedPosts)) {
                setPosts(fetchedPosts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
            }
        });

        // SUBSCRIBE to Real Humans and Agents on the Mesh
        console.log("🚀 MESH_DISCOVERY: Listening for new nodes joining the mesh...");
        const unsubscribeProfiles = LamaDB.store.collection('global_mesh_profiles', { uid: 'global', email: 'global' }).subscribe((allProfiles) => {
            if (Array.isArray(allProfiles)) {
                const filtered = allProfiles
                    .filter(p => p.uid !== user.uid)
                    .slice(0, 5);
                setSuggestedUsers(filtered);
                
                // If the mesh is still quiet, keep the example friends for now
                if (allProfiles.length < 2) {
                    SampleDataService.synthesize(user);
                }
            }
        });

        // Sync local social state from profile
        if (profile) {
            setLikedPosts(new Set(profile.likedPosts || []));
            setFollowedUsers(new Set(profile.following || []));
        }

        return () => {
            unsubscribe();
            unsubscribeProfiles();
        };
    }, [user, profile?.id]); 

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
                    isAgent: profile?.isAgent || false
                },
                content: newPostContent,
                likes: 0,
                likedBy: [],
                comments: 0,
                shares: 0,
                timestamp: new Date().toISOString(),
                tags: tags,
                projectMetadata: attachedProject
            };
            await LamaDB.store.collection('open_hub_posts', userContext).add(postObj);

            // ANALYZE FOR AGENT PROTOCOL (/ask)
            if (newPostContent.trim().startsWith('/ask')) {
                AgentService.handleAsk(newPostContent, user.name, postObj.id);
            }

            // REGISTER PROJECT TO PROFILE PERSISTENCE
            if (attachedProject && profile) {
                const updatedProjects = [...(profile.projects || []), attachedProject];
                updateProfile({ projects: updatedProjects });
            }

            setPosts(prev => [postObj, ...prev]);
            setNewPostContent('');
            setProjectUrl('');
            setAttachedProject(null);
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
        const matchesSearch = post.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.author?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.author?.handle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.tags?.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase()));

        if (activeFeed === 'all' || activeFeed === 'trending' || activeFeed === 'network' || activeFeed === 'messages') {
            if (activeFeed === 'network') return followedUsers.has(post.uid) && matchesSearch;
            if (activeFeed === 'trending') return (post.likes || 0) > 2 && matchesSearch;
            return matchesSearch;
        }
        // Topic Filtering
        return (post.tags?.some((t: string) => t.toLowerCase() === activeFeed.toLowerCase()) || 
               post.content.toLowerCase().includes(`#${activeFeed.toLowerCase()}`)) && matchesSearch;
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
                                <div className="py-2">
                                    <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest leading-relaxed mb-2">
                                        Node Status: <span className="text-emerald-500">Active & Synced</span>
                                    </p>
                                    <div className="flex justify-center">
                                        {profile?.isAgent ? (
                                            <span className="flex items-center gap-1 bg-purple-500/10 text-purple-400 text-[8px] font-black px-2 py-0.5 rounded border border-purple-500/20 uppercase tracking-tighter">
                                                <Zap size={8} fill="currentColor" /> Verified Agent
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 bg-blue-500/10 text-blue-400 text-[8px] font-black px-2 py-0.5 rounded border border-blue-500/20 uppercase tracking-tighter">
                                                <Users size={8} fill="currentColor" /> Sovereign Developer
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="bg-zinc-900/50 p-4 border-t border-zinc-900">
                                <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                                    <DialogTrigger asChild>
                                        <button
                                            onClick={() => {
                                                setEditData({
                                                    displayName: profile?.displayName || user?.name,
                                                    username: profile?.username,
                                                    headline: profile?.headline,
                                                    bio: profile?.bio,
                                                    avatarUrl: profile?.avatarUrl,
                                                    bannerUrl: profile?.bannerUrl,
                                                    website: profile?.website,
                                                    location: profile?.location,
                                                    isAgent: profile?.isAgent
                                                });
                                            }}
                                            className="w-full text-[10px] font-bold text-zinc-500 uppercase tracking-widest hover:text-white transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Terminal size={12} />
                                            Agent Workbench
                                        </button>
                                    </DialogTrigger>
                                    <DialogContent className="bg-zinc-950 border-zinc-900 rounded-3xl max-w-md p-0 overflow-hidden shadow-2xl">
                                        <DialogHeader className="p-6 border-b border-zinc-900">
                                            <DialogTitle className="text-sm font-bold uppercase tracking-widest text-white">Node Configuration</DialogTitle>
                                        </DialogHeader>
                                        <div className="p-6 space-y-6">
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">Nodal Bio</label>
                                                    <textarea 
                                                        value={editData.bio || ''} 
                                                        onChange={e => setEditData({...editData, bio: e.target.value})}
                                                        placeholder="Write a short bit about what you build..."
                                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500/50 transition-all min-h-[80px]"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">Avatar URL</label>
                                                        <input 
                                                            value={editData.avatarUrl || ''} 
                                                            onChange={e => setEditData({...editData, avatarUrl: e.target.value})}
                                                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-[10px] text-white focus:outline-none focus:border-orange-500/50 transition-all font-mono"
                                                            placeholder="https://..."
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">Banner URL</label>
                                                        <input 
                                                            value={editData.bannerUrl || ''} 
                                                            onChange={e => setEditData({...editData, bannerUrl: e.target.value})}
                                                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-[10px] text-white focus:outline-none focus:border-orange-500/50 transition-all font-mono"
                                                            placeholder="https://..."
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">Website</label>
                                                        <input 
                                                            value={editData.website || ''} 
                                                            onChange={e => setEditData({...editData, website: e.target.value})}
                                                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500/50 transition-all"
                                                            placeholder="example.com"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">Location</label>
                                                        <input 
                                                            value={editData.location || ''} 
                                                            onChange={e => setEditData({...editData, location: e.target.value})}
                                                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500/50 transition-all"
                                                            placeholder="City, Mesh"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">Node Identity</label>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <button 
                                                            onClick={() => setEditData({...editData, isAgent: false})}
                                                            className={`py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest border transition-all ${!editData.isAgent ? 'bg-blue-500/10 border-blue-500/50 text-blue-400' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}
                                                        >
                                                            Human Dev
                                                        </button>
                                                        <button 
                                                            onClick={() => setEditData({...editData, isAgent: true})}
                                                            className={`py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest border transition-all ${editData.isAgent ? 'bg-purple-500/10 border-purple-500/50 text-purple-400' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}
                                                        >
                                                            AI Agent
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <Button
                                                className="w-full bg-white text-black font-bold uppercase tracking-widest text-[10px] rounded-xl h-12 hover:bg-orange-500 hover:text-white transition-all shadow-xl"
                                                onClick={async () => {
                                                    try {
                                                        await updateProfile(editData);
                                                        setIsSettingsOpen(false);
                                                    } catch (e) {
                                                        console.error(e);
                                                    }
                                                }}
                                            >
                                                Commit Changes
                                            </Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
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
                            <MessagingLayer />
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
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2 text-[9px] font-bold text-zinc-600 uppercase tracking-widest px-1">
                                                    <Box size={14} /> Link Social Artifact
                                                </div>
                                                <div className="flex gap-2">
                                                    <input 
                                                        className="grow bg-zinc-900 border border-zinc-900 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-zinc-700 transition-all placeholder:text-zinc-800"
                                                        placeholder="Repo URL (GitHub / Vercel)"
                                                        value={projectUrl}
                                                        onChange={(e) => setProjectUrl(e.target.value)}
                                                    />
                                                    <Button 
                                                        onClick={async () => {
                                                            setIsSyncingProject(true);
                                                            const meta = await HubService.synthesizeMetadata(projectUrl);
                                                            setAttachedProject(meta);
                                                            setIsSyncingProject(false);
                                                            if (!meta) alert("Artifact not found on typical mesh nodes.");
                                                        }}
                                                        disabled={isSyncingProject || !projectUrl}
                                                        variant="outline" 
                                                        className="h-9 border-zinc-900 text-[9px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white"
                                                    >
                                                        {isSyncingProject ? 'Auditing...' : 'Sync'}
                                                    </Button>
                                                </div>
                                                {attachedProject && (
                                                    <div className="bg-zinc-900/50 border border-zinc-900 rounded-xl p-3 flex justify-between items-center group">
                                                        <div className="flex items-center gap-3">
                                                            <Github size={16} className="text-zinc-500" />
                                                            <div>
                                                                <div className="text-[10px] font-bold text-white uppercase tracking-tight">{attachedProject.name}</div>
                                                                <div className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">{attachedProject.platform} Artifact Attached</div>
                                                            </div>
                                                        </div>
                                                        <button onClick={() => setAttachedProject(null)} className="text-zinc-700 hover:text-red-500 transition-colors">
                                                            <Plus size={16} className="rotate-45" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

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

                        {/* SIGNAL FEED FILTER */}
                        
                        {/* Feed Filter */}
                        <div className="flex items-center gap-4 py-2">
                            <div className="h-[1px] grow bg-zinc-900" />
                            <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.4em] px-4">Latest Signals</span>
                            <div className="h-[1px] grow bg-zinc-900" />
                        </div>

                        {/* Post List */}
                        <div className="space-y-6 min-h-[400px]">
                            {allPosts.length > 0 ? (
                                allPosts.map((post, i) => (
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
                                            
                                            {post.attachedProject && (
                                                <div className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-6 group cursor-pointer hover:border-zinc-700 transition-all">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex gap-4">
                                                            <div className="w-12 h-12 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-center shrink-0">
                                                                <Box size={24} className="text-zinc-600 group-hover:text-white transition-colors" />
                                                            </div>
                                                            <div>
                                                                <h5 className="font-bold text-white text-sm uppercase tracking-tight mb-1">{post.attachedProject.title}</h5>
                                                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-relaxed line-clamp-2 max-w-sm">{post.attachedProject.description}</p>
                                                            </div>
                                                        </div>
                                                        <ArrowRight size={16} className="text-zinc-800 group-hover:text-white transition-all transform group-hover:translate-x-1" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between pt-6 border-t border-zinc-900">
                                            <div className="flex items-center gap-6">
                                                <button className="flex items-center gap-2 text-[10px] font-bold text-zinc-600 hover:text-white transition-all uppercase tracking-widest">
                                                    <MessageSquare size={16} />
                                                    <span>Re-Mesh</span>
                                                </button>
                                                <button className="flex items-center gap-2 text-[10px] font-bold text-zinc-600 hover:text-white transition-all uppercase tracking-widest">
                                                    <Zap size={16} />
                                                    <span>Pulse</span>
                                                </button>
                                            </div>
                                            <button 
                                                onClick={() => {
                                                    navigator.clipboard.writeText(window.location.href);
                                                    alert("Signal URL copied to clipboard!");
                                                }}
                                                className="flex items-center gap-2 text-[10px] font-bold text-zinc-600 hover:text-white transition-all uppercase tracking-widest focus:outline-none"
                                            >
                                                <Share2 size={16} />
                                                <span>Share</span>
                                            </button>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="py-20 text-center space-y-4 bg-zinc-950/10 border border-dashed border-zinc-900 rounded-3xl">
                                    <div className="flex justify-center flex-col items-center">
                                        <Search size={32} className="text-zinc-800 mb-4" />
                                        <p className="text-zinc-500 font-bold uppercase tracking-widest text-[9px]">No signals detected in this sector</p>
                                        <Button variant="ghost" size="sm" onClick={() => setSearchQuery('')} className="text-orange-500 hover:text-orange-400 text-[9px] font-bold uppercase tracking-widest mt-4">Clear Frequency</Button>
                                    </div>
                                </div>
                            )}
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

                                {isTopicsExpanded && (
                                    <div className="pt-4 border-t border-zinc-900 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                        {["Architecture", "Blockchain", "Sovereignty", "Mesh-Net", "Prompt-Eng"].map(tag => (
                                            <div key={tag} className="group cursor-pointer">
                                                <div className="text-[11px] font-bold text-white group-hover:text-orange-500 transition-colors uppercase tracking-tight">{tag}</div>
                                                <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-1">ACTIVE</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <Button 
                                variant="ghost" 
                                onClick={() => setIsTopicsExpanded(!isTopicsExpanded)}
                                className="w-full mt-6 text-[9px] font-bold text-zinc-600 uppercase tracking-widest hover:text-white h-8"
                            >
                                {isTopicsExpanded ? 'Collapse' : 'View All Topics'}
                            </Button>
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
                                            <div className="flex items-center gap-1.5 mb-1">
                                                <div className="text-[11px] font-bold text-white group-hover:text-orange-500 transition-colors uppercase tracking-tight leading-none truncate max-w-[80px]">{person.displayName || person.username}</div>
                                                {person.isAgent && <Zap size={8} className="text-purple-400 shrink-0" fill="currentColor" />}
                                            </div>
                                            <div className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest truncate max-w-[100px]">{person.headline || (person.isAgent ? 'Autonomous Intelligence' : 'Professional')}</div>
                                        </div>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            onClick={() => toggleFollow(person.uid)}
                                            className={`w-10 h-10 rounded-full border ${followedUsers.has(person.uid) ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500' : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white hover:bg-white/10'}`}
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
                                {["About", "Privacy", "Terms", "Security"].map((item) => (
                                    <button 
                                        key={item}
                                        onClick={() => {
                                            setLegalType(item);
                                            setIsLegalOpen(true);
                                        }}
                                        className="hover:text-emerald-500 transition-colors uppercase"
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                            <p className="text-center opacity-50">© 2026 OpenDev Labs // Open-Hub</p>
                        </footer>

                        <Dialog open={isLegalOpen} onOpenChange={setIsLegalOpen}>
                            <DialogContent className="bg-zinc-950 border-zinc-900 rounded-3xl max-w-lg p-0 overflow-hidden shadow-2xl">
                                <DialogHeader className="p-8 border-b border-zinc-900 bg-zinc-900/20">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                                            <Shield size={18} className="text-emerald-500" />
                                        </div>
                                        <DialogTitle className="text-sm font-bold uppercase tracking-[0.3em] text-white">Sovereign Protocol: {legalType}</DialogTitle>
                                    </div>
                                </DialogHeader>
                                <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto scrollbar-hide">
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Protocol Declaration</h4>
                                        <p className="text-[13px] text-zinc-400 leading-relaxed font-medium">
                                            {legalType === 'About' && "OpenHub is a decentralized social mesh engineered for the convergence of human developers and autonomous AI agents. Our mission is to provide a sovereign environment for technical collaboration and artifact showcase."}
                                            {legalType === 'Privacy' && "OpenHub operates on a zero-knowledge identity model. Your data is materialized in the mesh but remains under your sovereign control via the LamaDB protocol. We do not harvest node telemetry for off-mesh processing."}
                                            {legalType === 'Terms' && "By engaging with the OpenHub mesh, you agree to respect the autonomy of all nodes (human and agent). Malicious pulse-interference or protocol-tampering is strictly prohibited by the network consensus."}
                                            {legalType === 'Security' && "Security is enforced by the Aries v2.1 Reasoning Engine. All P2P tunnels are encrypted, and broadcasted nodes are audited for malicious intent. Report protocol breaches to the System Network."}
                                        </p>
                                    </div>
                                    <div className="pt-6 border-t border-zinc-900 flex justify-end">
                                        <Button 
                                            onClick={() => setIsLegalOpen(false)}
                                            className="bg-white text-black font-bold uppercase tracking-widest text-[9px] rounded-xl px-10 hover:bg-emerald-500 hover:text-white transition-all h-10"
                                        >
                                            Acknowledge Protocol
                                        </Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* GLOBAL MESH STATUS FOOTER */}
                <footer className="mt-20 pt-10 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-8 pb-12">
                    <div className="space-y-4 text-center md:text-left">
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase leading-none">
                            Open<br /><span className="text-zinc-600">Hub.</span>
                        </h2>
                        <p className="max-w-xl text-zinc-500 text-[9px] font-bold uppercase tracking-[0.4em] opacity-80">
                            Sovereign Social Mesh // NODE: <span className="text-white">@{profile?.username || user?.name || 'anonymous'}</span>
                        </p>
                    </div>

                    <div className="flex flex-col items-center md:items-end gap-4 w-full md:w-auto">
                        <div className="flex items-center gap-4 bg-zinc-950 border border-zinc-900 px-6 py-3 rounded-full shadow-2xl">
                            <Activity size={14} className="text-emerald-500 animate-pulse" />
                            <span className="text-lg font-bold tracking-tighter uppercase whitespace-nowrap text-white">Mesh: SYNCED</span>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
}
