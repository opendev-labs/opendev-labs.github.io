/**
 * OPENHUB HUB SERVICE
 * Protocol bridge for external artifact synthesis (GitHub/Vercel)
 * and internal node broadcasting.
 */

import { LamaDB } from '../lib/lamaDB';

export interface ProjectMetadata {
    id: string;
    url: string;
    name: string;
    description: string;
    stars: number;
    language: string;
    topics: string[];
    platform: 'github' | 'vercel' | 'other';
}

export const HubService = {
    /**
     * Synthesize project metadata from a URL
     */
    async synthesizeMetadata(url: string): Promise<ProjectMetadata | null> {
        try {
            // 1. Detect GitHub
            const githubMatch = url.match(/github\.com\/([^/]+)\/([^/]+)/);
            if (githubMatch) {
                const owner = githubMatch[1];
                const repo = githubMatch[2].replace(/.git$/, '');
                
                console.log(`🚀 HUB_SYNC: Auditing GitHub Repository [${owner}/${repo}]...`);
                
                const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
                if (!response.ok) return null;
                
                const data = await response.json();
                
                return {
                    id: String(data.id),
                    url: data.html_url,
                    name: data.name,
                    description: data.description,
                    stars: data.stargazers_count,
                    language: data.language,
                    topics: data.topics || [],
                    platform: 'github'
                };
            }

            // 2. Generic OG Discovery (Simulation for Vercel/Other)
            if (url.includes('vercel.app')) {
                return {
                    id: 'v_' + Math.random().toString(36).substr(2, 9),
                    url: url,
                    name: url.split('//')[1].split('.')[0].toUpperCase(),
                    description: "Live deployment detected on Vercel Mesh.",
                    stars: 0,
                    language: 'Deployment',
                    topics: ['Vercel'],
                    platform: 'vercel'
                };
            }

            return null;
        } catch (e) {
            console.error("Metadata Synthesis Failed:", e);
            return null;
        }
    },

    /**
     * Legacy & Internal: Share a node project to the Hub
     */
    async shareToHub(user: any, profile: any, content: string, title?: string) {
        if (!user) throw new Error("Authentication required for mesh broadcast.");
        
        const userContext = { uid: 'global', email: 'global' };
        const postObj = {
            id: Math.random().toString(36).substr(2, 9),
            uid: user.uid,
            author: {
                name: user.name,
                handle: profile?.username || 'anonymous',
                headline: profile?.headline || 'Sovereign Developer',
                avatarUrl: profile?.avatarUrl || null,
                isAgent: profile?.isAgent || false
            },
            content: content,
            title: title,
            likes: 0,
            likedBy: [],
            comments: 0,
            shares: 0,
            timestamp: new Date().toISOString(),
            tags: ["OpenStudio", "Shared"]
        };

        return await LamaDB.store.collection('open_hub_posts', userContext).add(postObj);
    }
};

// Compatibility Alias
export const hubService = HubService;
