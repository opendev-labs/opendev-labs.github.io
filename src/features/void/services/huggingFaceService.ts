// HuggingFace API Service
const HF_API_BASE = 'https://huggingface.co/api';

export interface HFSpace {
    id: string;
    name: string;
    url: string;
    sdk?: string;
}

export interface HFRepo {
    id: string;
    name: string;
    url: string;
    private: boolean;
}

export interface DeploymentOptions {
    name: string;
    files: { path: string; content: string }[];
    sdk?: 'gradio' | 'streamlit' | 'static';
    private?: boolean;
}

export class HuggingFaceService {
    private token: string;

    constructor(token: string) {
        this.token = token;
    }

    private async fetchHF(endpoint: string, options: RequestInit = {}) {
        const response = await fetch(`${HF_API_BASE}${endpoint}`, {
            ...options,
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`HuggingFace API Error: ${response.status} - ${error}`);
        }

        return response.json();
    }

    async createSpace(options: DeploymentOptions): Promise<HFSpace> {
        const { name, files, sdk = 'static', private: isPrivate = false } = options;

        // Create the space
        const space = await this.fetchHF('/spaces', {
            method: 'POST',
            body: JSON.stringify({
                name,
                sdk,
                private: isPrivate,
            }),
        });

        // Upload files to the space
        for (const file of files) {
            await this.uploadFileToSpace(space.id, file.path, file.content);
        }

        return {
            id: space.id,
            name: space.name,
            url: `https://huggingface.co/spaces/${space.id}`,
            sdk,
        };
    }

    async createRepo(options: DeploymentOptions): Promise<HFRepo> {
        const { name, files, private: isPrivate = false } = options;

        // Create the repository
        const repo = await this.fetchHF('/repos/create', {
            method: 'POST',
            body: JSON.stringify({
                name,
                type: 'model',
                private: isPrivate,
            }),
        });

        // Upload files to the repo
        for (const file of files) {
            await this.uploadFileToRepo(repo.id, file.path, file.content);
        }

        return {
            id: repo.id,
            name: repo.name,
            url: `https://huggingface.co/${repo.id}`,
            private: isPrivate,
        };
    }

    async listSpaces(): Promise<HFSpace[]> {
        const spaces = await this.fetchHF('/spaces');
        return spaces.map((space: any) => ({
            id: space.id,
            name: space.name,
            url: `https://huggingface.co/spaces/${space.id}`,
            sdk: space.sdk,
        }));
    }

    async listRepos(): Promise<HFRepo[]> {
        const repos = await this.fetchHF('/repos');
        return repos.map((repo: any) => ({
            id: repo.id,
            name: repo.name,
            url: `https://huggingface.co/${repo.id}`,
            private: repo.private,
        }));
    }

    private async uploadFileToSpace(spaceId: string, path: string, content: string) {
        // Use HF's file upload API
        const formData = new FormData();
        formData.append('file', new Blob([content]), path);

        await fetch(`${HF_API_BASE}/spaces/${spaceId}/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.token}`,
            },
            body: formData,
        });
    }

    private async uploadFileToRepo(repoId: string, path: string, content: string) {
        await fetch(`${HF_API_BASE}/repos/${repoId}/upload/${path}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'text/plain',
            },
            body: content,
        });
    }

    async deployToExistingSpace(spaceId: string, files: { path: string; content: string }[]) {
        for (const file of files) {
            await this.uploadFileToSpace(spaceId, file.path, file.content);
        }

        return {
            id: spaceId,
            url: `https://huggingface.co/spaces/${spaceId}`,
        };
    }
}

// Get token from environment or allow passing it dynamically
const getHFToken = () => {
    // Try environment variable first
    if (import.meta.env.VITE_HF_TOKEN) {
        return import.meta.env.VITE_HF_TOKEN;
    }
    // Try localStorage for user-provided token
    const storedToken = localStorage.getItem('hf_token');
    if (storedToken) {
        return storedToken;
    }
    // Default token for development (user should replace this)
    console.warn('No HuggingFace token found. Please set VITE_HF_TOKEN or provide token via settings.');
    return '';
};

// Singleton instance - token can be updated via localStorage
export const huggingFaceService = new HuggingFaceService(getHFToken());

// Helper to update token
export const setHFToken = (token: string) => {
    localStorage.setItem('hf_token', token);
    // Recreate service with new token
    return new HuggingFaceService(token);
};
