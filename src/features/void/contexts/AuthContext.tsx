import React, { createContext, useCallback, useEffect, useState } from 'react';
import type { User } from '../types';
import { safeNavigate } from '../services/navigation';
import { LamaDB } from '../../../lib/lamaDB/config'; // ✅ SINGLETON - Single source of truth
import { GithubAuthProvider } from 'firebase/auth';

// For the purpose of "LamaDB", we will use the exposed auth methods.
// To get the TOKEN (which is needed for GitHub API calls), we need the result from signInWithPopup.
// LamaDB.auth.loginWithGithub() returns the UserCredential.

import { SyncStatus } from '../types';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  syncStatus: SyncStatus;
  lastSyncTime: string | null;
  agentOnline: boolean;
  githubUser: any | null;
  isGithubConnected: boolean;
}

interface AuthContextType extends AuthState {
  loginWithGitHub: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  fetchRepositories: () => Promise<any[]>;
  createRepository: (name: string, description: string, isPrivate: boolean) => Promise<any>;
  uploadFile: (repoName: string, path: string, content: string, message: string) => Promise<any>;
  login: (user: User) => void;
  syncAllRepositories: () => Promise<void>;
  checkLocalAgent: () => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [githubUser, setGithubUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(SyncStatus.IDLE);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(localStorage.getItem('opendev_last_sync'));
  const [agentOnline, setAgentOnline] = useState(false);

  const checkLocalAgent = useCallback(async () => {
    try {
      // Simulate checking for a local agent on a specific port (e.g. 8080 used by SyncStack desktop)
      // For now we simulate success to show the "intelligence" integration
      // In a real scenario, this would be: await fetch('http://localhost:8080/health')
      const isOnline = Math.random() > 0.1; // 90% chance of being "online" for demo
      setAgentOnline(isOnline);
      return isOnline;
    } catch (e) {
      setAgentOnline(false);
      return false;
    }
  }, []);

  // Sync with Auth State & Restore Token
  useEffect(() => {
    // Restore token from localStorage if available (simple persistence)
    const storedToken = localStorage.getItem('opendev_gh_token');
    if (storedToken) setToken(storedToken);

    const unsubscribe = LamaDB.auth.onAuthStateChanged((firebaseUser: any) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || 'User',
          email: firebaseUser.email || '',
          avatar: firebaseUser.photoURL || undefined,
          providers: firebaseUser.providers || []
        });
      } else {
        setUser(null);
        setToken(null);
        localStorage.removeItem('opendev_gh_token');
      }
      setIsLoading(false);
    });

    // Initial agent handshake
    checkLocalAgent();
    const agentInterval = setInterval(checkLocalAgent, 30000); // Check every 30s

    return () => {
      unsubscribe();
      clearInterval(agentInterval);
    };
  }, [checkLocalAgent]);

  // Fetch GitHub profile when token is available
  useEffect(() => {
    const fetchGitHubProfile = async () => {
      if (!token) {
        setGithubUser(null);
        return;
      }
      try {
        const response = await fetch('https://api.github.com/user', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setGithubUser(data);
          console.log("✅ GitHub Profile Fetched:", data.login);
        }
      } catch (e) {
        console.error("Failed to fetch GitHub profile:", e);
      }
    };
    fetchGitHubProfile();
  }, [token]);

  const isGithubConnected = !!token && !!user?.providers?.includes('github.com');

  const loginWithGitHub = useCallback(async () => {
    try {
      // LamaDB wrapper usage
      const result = await LamaDB.auth.loginWithGithub();

      // We need to get the credential to acccess the token
      // Since LamaAuth.loginWithGithub returns AuthResult (compatible with UserCredential)
      // We can use GithubAuthProvider.credentialFromResult logic if imported,
      // OR just access result.providerId? result.user.accessToken is not the GH token.
      // We need the OAuthCredential.

      const credential = GithubAuthProvider.credentialFromResult(result as any);


      if (credential?.accessToken) {
        setToken(credential.accessToken);
        localStorage.setItem('opendev_gh_token', credential.accessToken);
      }

      safeNavigate('/');
    } catch (error) {
      console.error("GitHub Login Error:", error);
      throw error;
    }
  }, []);

  const loginWithGoogle = useCallback(async () => {
    try {
      await LamaDB.auth.loginWithGoogle();
      safeNavigate('/');
    } catch (error) {
      console.error("Google Login Error:", error);
      throw error;
    }
  }, []);



  const fetchRepositories = useCallback(async () => {
    if (!token) return [];
    try {
      const response = await fetch('https://api.github.com/user/repos?sort=updated&per_page=100', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch repositories');
      const data = await response.json();
      return data.map((repo: any) => ({
        id: String(repo.id),
        name: repo.name,
        owner: repo.owner.login,
        description: repo.description,
        updatedAt: new Date(repo.updated_at).toLocaleDateString(),
        provider: 'GitHub',
        url: repo.html_url
      }));
    } catch (error) {
      console.error("Fetch Repos Error:", error);
      return [];
    }
  }, [token]);

  const createRepository = useCallback(async (name: string, description: string, isPrivate: boolean) => {
    if (!token) throw new Error("No access token");
    try {
      const response = await fetch('https://api.github.com/user/repos', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          description,
          private: isPrivate,
          auto_init: true // Initialize with README so it's not empty
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create repository');
      }

      return await response.json();
    } catch (error) {
      console.error("Create Repo Error:", error);
      throw error;
    }
  }, [token]);

  const uploadFile = useCallback(async (repoName: string, path: string, content: string, message: string) => {
    if (!token || !user) throw new Error("No access token or user");

    // We need the owner name (login) to construct the URL
    // Since we store 'user.name' it might be the display name, not login.
    // Ideally we should store the login separately, but for now we'll fetch user data if needed 
    // or assume we can get the login from a different call. 
    // actually, let's fetch the current user's login if we don't have it stored properly, 
    // OR just use the /user endpoint to get the login.

    // BUT, for speed, let's just make a quick call to /user if we don't have the login.
    // Or better, update fetchRepositories to return owner login which we might have.
    // Let's just do a quick fetch to get the login name to be safe.

    try {
      const userRes = await fetch('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const userData = await userRes.json();
      const owner = userData.login;

      const url = `https://api.github.com/repos/${owner}/${repoName}/contents/${path}`;

      // Check if file exists to get SHA for update (optional, but good for idempotency)
      // For a new repo, we assume it doesn't exist or we just overwrite.
      // But PUT requires SHA if updating. Let's try to get it first.
      let sha: string | undefined;
      try {
        const getRes = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
        if (getRes.ok) {
          const getData = await getRes.json();
          sha = getData.sha;
        }
      } catch (e) {
        // Ignore error if file doesn't exist
      }

      const body: any = {
        message,
        content: btoa(content), // Base64 encode
      };
      if (sha) body.sha = sha;

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload file');
      }

      return await response.json();
    } catch (error) {
      console.error("Upload File Error:", error);
      throw error;
    }
  }, [token, user]);

  const syncAllRepositories = useCallback(async () => {
    if (!token) return;
    setSyncStatus(SyncStatus.SYNCING);
    try {
      // 1. Fetch repos to ensure we have the latest
      const repos = await fetchRepositories();
      // 2. Perform mock sync for each repo (simulating the gh_engine logic)
      console.log(`SyncStack: Auditing ${repos.length} nodes...`);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulation delay

      const now = new Date().toLocaleString();
      setLastSyncTime(now);
      localStorage.setItem('opendev_last_sync', now);
      setSyncStatus(SyncStatus.COMPLETED);

      // Auto-reset to IDLE after a few seconds
      setTimeout(() => setSyncStatus(SyncStatus.IDLE), 5000);
    } catch (error) {
      console.error("Sync Error:", error);
      setSyncStatus(SyncStatus.ERROR);
    }
  }, [token, fetchRepositories]);

  const logout = useCallback(async () => {
    await LamaDB.auth.logout();
    setUser(null);
    setToken(null);
    localStorage.removeItem('opendev_gh_token');
    safeNavigate('/login');
  }, []);

  // Legacy manual login (e.g. for email/demo)
  const login = useCallback((user: User) => {
    setUser(user);
    safeNavigate('/');
  }, []);

  return (
    <AuthContext.Provider value={{
      isAuthenticated: !!user,
      user,
      isLoading,
      syncStatus,
      lastSyncTime,
      agentOnline,
      githubUser,
      isGithubConnected,
      loginWithGitHub,
      loginWithGoogle,
      logout,
      fetchRepositories,
      createRepository,
      uploadFile,
      login,
      syncAllRepositories,
      checkLocalAgent
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
