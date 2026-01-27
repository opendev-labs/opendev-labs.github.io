import React, { createContext, useCallback, useEffect, useState } from 'react';
import type { User } from '../types';
import { safeNavigate } from '../services/navigation';
import { LamaDB } from '../../../lib/lamaDB';
import { GithubAuthProvider } from 'firebase/auth'; // We still need the provider class or we can abstract it further. LamaDB abstraction is leaky here if we need credential.

// For the purpose of "LamaDB", we will use the exposed auth methods.
// To get the TOKEN (which is needed for GitHub API calls), we need the result from signInWithPopup.
// LamaDB.auth.loginWithGithub() returns the UserCredential.

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  loginWithGitHub: () => Promise<void>;
  logout: () => Promise<void>;
  fetchRepositories: () => Promise<any[]>;
  createRepository: (name: string, description: string, isPrivate: boolean) => Promise<any>;
  uploadFile: (repoName: string, path: string, content: string, message: string) => Promise<any>;
  login: (user: User) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sync with Auth State & Restore Token
  useEffect(() => {
    // Restore token from localStorage if available (simple persistence)
    const storedToken = localStorage.getItem('opendev_gh_token');
    if (storedToken) setToken(storedToken);

    const unsubscribe = LamaDB.auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setUser({
          name: firebaseUser.displayName || 'User',
          email: firebaseUser.email || '',
          avatar: firebaseUser.photoURL || undefined
        });
      } else {
        setUser(null);
        setToken(null);
        localStorage.removeItem('opendev_gh_token');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGitHub = useCallback(async () => {
    try {
      // LamaDB wrapper usage
      const result = await LamaDB.auth.loginWithGithub();

      // We need to get the credential to acccess the token
      // Since LamaAuth.loginWithGithub returns the firebase UserCredential (UserCredentialImpl)
      // We can use GithubAuthProvider.credentialFromResult logic if imported,
      // OR just access result.providerId? result.user.accessToken is not the GH token.
      // We need the OAuthCredential.

      const credential = GithubAuthProvider.credentialFromResult(result);

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

  const logout = useCallback(async () => {
    await LamaDB.auth.logout();
    setUser(null);
    setToken(null);
    localStorage.removeItem('void_gh_token');
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
      loginWithGitHub,
      logout,
      fetchRepositories,
      createRepository,
      uploadFile,
      login
    }}>
      {children}
    </AuthContext.Provider>
  );
};
