import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { LamaDB } from '../lib/lamaDB';
import { GithubAuthProvider } from 'firebase/auth';

interface User {
    name: string;
    email: string;
    avatar?: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    loginWithGitHub: () => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
    fetchRepositories: () => Promise<any[]>;
    createRepository: (name: string, description: string, isPrivate: boolean) => Promise<any>;
    uploadFile: (repoName: string, path: string, content: string, message: string) => Promise<any>;
    login: (user: User) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem('void_gh_token');
        if (storedToken) setToken(storedToken);

        const unsubscribe = LamaDB.auth.onAuthStateChanged((firebaseUser) => {
            if (firebaseUser) {
                setUser({
                    name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
                    email: firebaseUser.email || '',
                    avatar: firebaseUser.photoURL || undefined
                });
            } else {
                setUser(null);
                setToken(null);
                localStorage.removeItem('void_gh_token');
            }
            setIsLoading(false);
        });
        return unsubscribe;
    }, []);

    const loginWithGitHub = useCallback(async () => {
        const result = await LamaDB.auth.loginWithGithub();
        const credential = GithubAuthProvider.credentialFromResult(result);
        if (credential?.accessToken) {
            setToken(credential.accessToken);
            localStorage.setItem('void_gh_token', credential.accessToken);
        }
    }, []);

    const loginWithGoogle = useCallback(async () => {
        await LamaDB.auth.loginWithGoogle();
    }, []);

    const logout = useCallback(async () => {
        await LamaDB.auth.logout();
        setUser(null);
        setToken(null);
        localStorage.removeItem('void_gh_token');
    }, []);

    const login = useCallback((user: User) => {
        setUser(user);
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
            console.error(error);
            return [];
        }
    }, [token]);

    const createRepository = useCallback(async (name: string, description: string, isPrivate: boolean) => {
        if (!token) throw new Error("No access token");
        const response = await fetch('https://api.github.com/user/repos', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, description, private: isPrivate, auto_init: true })
        });
        if (!response.ok) throw new Error('Failed to create repository');
        return await response.json();
    }, [token]);

    const uploadFile = useCallback(async (repoName: string, path: string, content: string, message: string) => {
        if (!token) throw new Error("No access token");
        const userRes = await fetch('https://api.github.com/user', { headers: { Authorization: `Bearer ${token}` } });
        const userData = await userRes.json();
        const owner = userData.login;
        const url = `https://api.github.com/repos/${owner}/${repoName}/contents/${path}`;

        let sha: string | undefined;
        try {
            const getRes = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
            if (getRes.ok) {
                const getData = await getRes.json();
                sha = getData.sha;
            }
        } catch (e) { }

        const body: any = { message, content: btoa(content) };
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
        if (!response.ok) throw new Error('Failed to upload file');
        return await response.json();
    }, [token]);

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            isLoading,
            loginWithGitHub,
            loginWithGoogle,
            logout,
            fetchRepositories,
            createRepository,
            uploadFile,
            login
        }}>
            {children}
        </AuthContext.Provider>
    );
}
