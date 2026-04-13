import { LamaDB } from '../lib/lamaDB';
import { User } from '../features/void/types';

export const hubService = {
  /**
   * Shares a build/project snippet to the OpenHub global feed.
   */
  shareToHub: async (user: User, profile: any, content: string, title?: string) => {
    if (!user) throw new Error("Authentication required to share.");

    try {
      const userContext = { uid: 'global', email: 'global' };
      
      const postObj = {
        id: Math.random().toString(36).substr(2, 9),
        author: {
          name: user.name,
          handle: profile?.username || 'anonymous',
          headline: profile?.headline || 'Social Resident',
          avatarUrl: profile?.avatarUrl || null
        },
        content: title ? `### ${title}\n\n${content}` : content,
        likes: 0,
        comments: 0,
        shares: 0,
        timestamp: new Date().toISOString(),
        tags: ["BuildShare", "OpenStudio", "Sovereign"]
      };

      await LamaDB.store.collection('open_hub_posts', userContext).add(postObj);
      return postObj;
    } catch (error) {
      console.error("Failed to share to hub:", error);
      throw error;
    }
  }
};
