/**
 * GitHub PAT (Personal Access Token) Service
 * Secure GitHub integration for auto-repository creation and deployment
 */

interface GitHubRepo {
    name: string;
    full_name: string;
    html_url: string;
    clone_url: string;
    default_branch: string;
}

interface CreateRepoOptions {
    name: string;
    description?: string;
    private?: boolean;
    auto_init?: boolean;
}

interface PushCodeOptions {
    owner: string;
    repo: string;
    files: Array<{ path: string; content: string }>;
    message: string;
    branch?: string;
}

class GitHubPATService {
    private pat: string | null = null;
    private username: string | null = null;

    /**
     * Set the GitHub Personal Access Token
     */
    setPAT(token: string) {
        this.pat = token;
        localStorage.setItem('github_pat', token);
    }

    /**
     * Set the GitHub Username
     */
    setUsername(username: string) {
        this.username = username;
        localStorage.setItem('github_username', username);
    }

    /**
     * Get the stored Username
     */
    getUsername(): string | null {
        if (this.username) return this.username;
        const stored = localStorage.getItem('github_username');
        if (stored) {
            this.username = stored;
            return stored;
        }
        return null;
    }

    /**
     * Get the stored PAT
     */
    getPAT(): string | null {
        if (this.pat) return this.pat;

        // Try to retrieve from localStorage
        const stored = localStorage.getItem('github_pat');
        if (stored) {
            this.pat = stored;
            return stored;
        }

        return null;
    }

    /**
     * Clear the stored PAT
     */
    clearPAT() {
        this.pat = null;
        this.username = null;
        localStorage.removeItem('github_pat');
        localStorage.removeItem('github_username');
    }

    /**
     * Validate the PAT token
     */
    async validatePAT(token?: string): Promise<{ valid: boolean; username?: string; error?: string }> {
        const patToken = token || this.getPAT();

        if (!patToken) {
            return { valid: false, error: 'No PAT token provided' };
        }

        try {
            const response = await fetch('https://api.github.com/user', {
                headers: {
                    'Authorization': `token ${patToken}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (response.ok) {
                const user = await response.json();
                return { valid: true, username: user.login };
            } else {
                return { valid: false, error: `Invalid token: ${response.statusText}` };
            }
        } catch (error) {
            return { valid: false, error: error instanceof Error ? error.message : 'Unknown error' };
        }
    }

    /**
     * Create a new GitHub repository
     */
    async createRepository(options: CreateRepoOptions): Promise<GitHubRepo> {
        const pat = this.getPAT();

        if (!pat) {
            throw new Error('GitHub PAT not configured. Please add your token in settings.');
        }

        const response = await fetch('https://api.github.com/user/repos', {
            method: 'POST',
            headers: {
                'Authorization': `token ${pat}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: options.name,
                description: options.description || `Created via OpenDev Labs`,
                private: options.private || false,
                auto_init: options.auto_init !== false // default true
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create repository');
        }

        return await response.json();
    }

    /**
     * Push code to a GitHub repository
     */
    async pushCode(options: PushCodeOptions): Promise<void> {
        const pat = this.getPAT();

        if (!pat) {
            throw new Error('GitHub PAT not configured');
        }

        const branch = options.branch || 'main';

        // Get the current commit SHA of the branch
        const refResponse = await fetch(
            `https://api.github.com/repos/${options.owner}/${options.repo}/git/refs/heads/${branch}`,
            {
                headers: {
                    'Authorization': `token ${pat}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            }
        );

        if (!refResponse.ok) {
            throw new Error('Failed to get branch reference');
        }

        const refData = await refResponse.json();
        const baseCommitSHA = refData.object.sha;

        // Create blobs for each file
        const blobs = await Promise.all(
            options.files.map(async (file) => {
                const blobResponse = await fetch(
                    `https://api.github.com/repos/${options.owner}/${options.repo}/git/blobs`,
                    {
                        method: 'POST',
                        headers: {
                            'Authorization': `token ${pat}`,
                            'Accept': 'application/vnd.github.v3+json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            content: file.content,
                            encoding: 'utf-8'
                        })
                    }
                );

                if (!blobResponse.ok) {
                    throw new Error(`Failed to create blob for ${file.path}`);
                }

                const blob = await blobResponse.json();
                return { path: file.path, sha: blob.sha };
            })
        );

        // Create a tree with all files
        const treeResponse = await fetch(
            `https://api.github.com/repos/${options.owner}/${options.repo}/git/trees`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `token ${pat}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    tree: blobs.map(blob => ({
                        path: blob.path,
                        mode: '100644',
                        type: 'blob',
                        sha: blob.sha
                    }))
                })
            }
        );

        if (!treeResponse.ok) {
            throw new Error('Failed to create tree');
        }

        const tree = await treeResponse.json();

        // Create a commit
        const commitResponse = await fetch(
            `https://api.github.com/repos/${options.owner}/${options.repo}/git/commits`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `token ${pat}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: options.message,
                    tree: tree.sha,
                    parents: [baseCommitSHA]
                })
            }
        );

        if (!commitResponse.ok) {
            throw new Error('Failed to create commit');
        }

        const commit = await commitResponse.json();

        // Update the branch reference
        const updateRefResponse = await fetch(
            `https://api.github.com/repos/${options.owner}/${options.repo}/git/refs/heads/${branch}`,
            {
                method: 'PATCH',
                headers: {
                    'Authorization': `token ${pat}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    sha: commit.sha
                })
            }
        );

        if (!updateRefResponse.ok) {
            throw new Error('Failed to update branch');
        }
    }

    /**
     * Enable GitHub Pages for a repository
     */
    async enableGitHubPages(owner: string, repo: string, branch: string = 'main'): Promise<string> {
        const pat = this.getPAT();

        if (!pat) {
            throw new Error('GitHub PAT not configured');
        }

        const response = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/pages`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `token ${pat}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    source: {
                        branch: branch,
                        path: '/'
                    }
                })
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to enable GitHub Pages');
        }

        const data = await response.json();
        return data.html_url; // Returns the GitHub Pages URL
    }

    /**
     * One-click deploy: Create repo, push code, enable GitHub Pages
     */
    async deployToGitHubPages(
        repoName: string,
        files: Array<{ path: string; content: string }>,
        description?: string,
        isPrivate?: boolean
    ): Promise<{ repoUrl: string; pagesUrl: string }> {
        // Create repository
        const repo = await this.createRepository({
            name: repoName,
            description,
            private: isPrivate,
            auto_init: true
        });

        // Wait a moment for repo initialization
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Push code
        const owner = repo.full_name.split('/')[0];
        await this.pushCode({
            owner,
            repo: repo.name,
            files,
            message: 'Initial commit from OpenDev Labs'
        });

        // Enable GitHub Pages
        const pagesUrl = await this.enableGitHubPages(owner, repo.name);

        return {
            repoUrl: repo.html_url,
            pagesUrl
        };
    }
}

// Singleton instance
export const githubPATService = new GitHubPATService();
