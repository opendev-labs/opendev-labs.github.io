import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { LamaDB } from '../lib/lamaDB';
import { GithubAuthProvider } from 'firebase/auth';

export interface User {
    name: string;
    email: string;
    avatar?: string;
    uid?: string;
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

        const unsubscribe = LamaDB.auth.onAuthStateChanged(async (firebaseUser) => {
            if (firebaseUser) {
                const userData = {
                    name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Member',
                    email: firebaseUser.email || '',
                    avatar: firebaseUser.photoURL || undefined,
                    uid: firebaseUser.uid,
                    lastLogin: new Date().toISOString()
                };
                setUser(userData);

                // Sync with LamaDB Firestore
                try {
                    await LamaDB.store.collection('users').doc(firebaseUser.uid).set(userData);
                    console.log("Nexus Registry: ID synced with LamaDB.");
                } catch (e) {
                    console.error("Nexus Registry: Sync failure.", e);
                }
            } else {
                setUser(null);
                setToken(null);
                localStorage.removeItem('void_gh_token');
                localStorage.removeItem('nexus_sim_user');
            }
            setIsLoading(false);
        });
        return unsubscribe;
    }, []);

    const loginWithGitHub = useCallback(async () => {
        const result = await LamaDB.auth.loginWithGithub();
        // If simulation mode, result might be a mock object
        if (LamaDB.auth.getSimulationMode()) {
            const mockUser = {
                name: 'opendev-labs',
                email: 'admin@opendev-labs.io',
                uid: 'odl_master_1',
                avatar: 'https://github.com/opendev-labs.png'
            };
            setUser(mockUser);
            localStorage.setItem('nexus_sim_user', JSON.stringify(mockUser));
            return;
        }

        const credential = GithubAuthProvider.credentialFromResult(result);
        if (credential?.accessToken) {
            setToken(credential.accessToken);
            localStorage.setItem('void_gh_token', credential.accessToken);
        }
    }, []);

    const loginWithGoogle = useCallback(async () => {
        const result = await LamaDB.auth.loginWithGoogle();
        if (LamaDB.auth.getSimulationMode()) {
            const mockUser = {
                name: 'opendev-labs',
                email: 'admin@opendev-labs.io',
                uid: 'odl_master_1',
                avatar: 'https://github.com/opendev-labs.png'
            };
            setUser(mockUser);
            localStorage.setItem('nexus_sim_user', JSON.stringify(mockUser));
        }
    }, []);

    const logout = useCallback(async () => {
        await LamaDB.auth.logout();
        setUser(null);
        setToken(null);
        localStorage.removeItem('void_gh_token');
        localStorage.removeItem('nexus_sim_user');
    }, []);

    const login = useCallback((user: User) => {
        setUser(user);
    }, []);

    const fetchRepositories = useCallback(async () => {
        // Fallback to mock data if no token (Simulation Mode)
        if (!token) {
            // Dynamic import to avoid circular dependency if possible, or just hardcode for now if keeping simple
            // However, best to copy the mock data here or move it to a shared location.
            // Since we can't easily move files without planning, I will duplicate the relevant mock data here for robustness OR try to fetch public repos.

            // Let's try to fetch public repos of opendev-labs if possible, otherwise mock.
            try {
                const res = await fetch('https://api.github.com/users/opendev-labs/repos');
                if (res.ok) {
                    const data = await res.json();
                    return data.map((repo: any) => ({
                        id: String(repo.id),
                        name: repo.name,
                        owner: repo.owner.login,
                        description: repo.description,
                        updatedAt: new Date(repo.updated_at).toLocaleDateString(),
                        provider: 'GitHub',
                        url: repo.html_url
                    }));
                }
            } catch (e) {
                console.warn("Failed to fetch real opendev-labs repos, using mocks");
            }

            return [
                { id: 'gh_1', name: 'pulse-v2-api', owner: 'opendev-labs', description: 'The main API for the Pulse analytics platform.', updatedAt: '2 hours ago', provider: 'GitHub', url: '#' },
                { id: 'gh_2', name: 'nova-landing-page', owner: 'opendev-labs', description: 'Marketing and landing page for the Nova project.', updatedAt: '1 day ago', provider: 'GitHub', url: '#' },
                { id: 'gh_3', name: 'personal-portfolio-v3', owner: 'opendev-labs', description: 'My personal portfolio website built with Astro.', updatedAt: '5 days ago', provider: 'GitHub', url: '#' },
                { id: 'gh_4', name: 'dotfiles', owner: 'opendev-labs', description: 'My personal development environment configuration.', updatedAt: '1 week ago', provider: 'GitHub', url: '#' },
                { id: 'gh_5', name: 'void-engine', owner: 'opendev-labs', description: 'Core engine for the Void environment.', updatedAt: '3 days ago', provider: 'GitHub', url: '#' },
                { id: 'gh_6', name: 'nexus-protocol', owner: 'opendev-labs', description: 'Distributed state synchronization layer.', updatedAt: '12 hours ago', provider: 'GitHub', url: '#' }
            ];
        }

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
            console.error("Repository fetch failed:", error);
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
