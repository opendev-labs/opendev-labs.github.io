/**
 * GitHub Pages Deployment Service
 *
 * Deploys generated files to a GitHub repository and enables GitHub Pages.
 * Uses the GitHub REST API directly from the browser (no backend needed).
 */

import type { FileNode } from '../features/studio/types';

const GITHUB_API = 'https://api.github.com';

interface DeployResult {
  success: boolean;
  url?: string;
  repoUrl?: string;
  error?: string;
}

interface DeployProgress {
  step: string;
  detail: string;
}

/**
 * Slugify a string for use as a repo name.
 */
export function slugifyRepoName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 60) || 'openstudio-project';
}

/**
 * Deploy files to GitHub Pages.
 */
export async function deployToGitHub(
  files: FileNode[],
  repoName: string,
  token: string,
  onProgress?: (progress: DeployProgress) => void
): Promise<DeployResult> {
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
  };

  try {
    // Step 1: Get the authenticated user
    onProgress?.({ step: 'Connecting', detail: 'Fetching GitHub identity...' });
    const userRes = await fetch(`${GITHUB_API}/user`, { headers });
    if (!userRes.ok) {
      const err = await userRes.json().catch(() => ({}));
      throw new Error(err.message || 'GitHub authentication failed. Please reconnect your GitHub account.');
    }
    const userData = await userRes.json();
    const owner = userData.login;

    // Step 2: Check if repo exists, create if needed
    onProgress?.({ step: 'Repository', detail: `Checking ${owner}/${repoName}...` });
    let repoExists = false;
    const repoCheckRes = await fetch(`${GITHUB_API}/repos/${owner}/${repoName}`, { headers });
    if (repoCheckRes.ok) {
      repoExists = true;
    }

    if (!repoExists) {
      onProgress?.({ step: 'Repository', detail: `Creating ${repoName}...` });
      const createRes = await fetch(`${GITHUB_API}/user/repos`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: repoName,
          description: 'Built with OpenStudio — https://opendev-labs.github.io/open-studio',
          homepage: `https://${owner}.github.io/${repoName}/`,
          private: false,
          auto_init: true, // Creates initial commit with README so we have a ref
          has_pages: true,
        }),
      });

      if (!createRes.ok) {
        const err = await createRes.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to create repository.');
      }
      // Wait a moment for the initial commit to propagate
      await new Promise(r => setTimeout(r, 2000));
    }

    // Step 3: Get the latest commit SHA on main branch
    onProgress?.({ step: 'Syncing', detail: 'Reading current branch state...' });
    const refRes = await fetch(`${GITHUB_API}/repos/${owner}/${repoName}/git/ref/heads/main`, { headers });

    let latestCommitSha: string;
    let baseTreeSha: string;

    if (refRes.ok) {
      const refData = await refRes.json();
      latestCommitSha = refData.object.sha;
      // Get the tree SHA for the commit
      const commitRes = await fetch(`${GITHUB_API}/repos/${owner}/${repoName}/git/commits/${latestCommitSha}`, { headers });
      const commitData = await commitRes.json();
      baseTreeSha = commitData.tree.sha;
    } else {
      // Repo might be empty or use a different default branch
      throw new Error('Could not read the main branch. Please ensure the repository has at least one commit.');
    }

    // Step 4: Create blobs for each file
    onProgress?.({ step: 'Uploading', detail: `Uploading ${files.length} files...` });
    const treeItems: { path: string; mode: string; type: string; sha: string }[] = [];

    // Add an index.html wrapper for GitHub Pages if not present
    const projectFiles = ensureIndexHtml(files);

    for (const file of projectFiles) {
      if (file.path.endsWith('.keep') || !file.content) continue;

      const blobRes = await fetch(`${GITHUB_API}/repos/${owner}/${repoName}/git/blobs`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          content: file.content,
          encoding: 'utf-8',
        }),
      });

      if (!blobRes.ok) {
        console.error(`Failed to create blob for ${file.path}`);
        continue;
      }

      const blobData = await blobRes.json();
      treeItems.push({
        path: file.path.startsWith('/') ? file.path.substring(1) : file.path,
        mode: '100644',
        type: 'blob',
        sha: blobData.sha,
      });
    }

    if (treeItems.length === 0) {
      throw new Error('No files to deploy.');
    }

    // Step 5: Create tree
    onProgress?.({ step: 'Building', detail: 'Creating file tree...' });
    const treeRes = await fetch(`${GITHUB_API}/repos/${owner}/${repoName}/git/trees`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        base_tree: baseTreeSha,
        tree: treeItems,
      }),
    });

    if (!treeRes.ok) {
      const err = await treeRes.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to create commit tree.');
    }
    const treeData = await treeRes.json();

    // Step 6: Create commit
    onProgress?.({ step: 'Committing', detail: 'Creating deployment commit...' });
    const commitRes = await fetch(`${GITHUB_API}/repos/${owner}/${repoName}/git/commits`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        message: `Deploy from OpenStudio — ${new Date().toLocaleString()}`,
        tree: treeData.sha,
        parents: [latestCommitSha],
      }),
    });

    if (!commitRes.ok) {
      const err = await commitRes.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to create commit.');
    }
    const newCommit = await commitRes.json();

    // Step 7: Update the main branch reference
    onProgress?.({ step: 'Publishing', detail: 'Pushing to main branch...' });
    const updateRefRes = await fetch(`${GITHUB_API}/repos/${owner}/${repoName}/git/refs/heads/main`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({
        sha: newCommit.sha,
        force: true,
      }),
    });

    if (!updateRefRes.ok) {
      const err = await updateRefRes.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to push commit.');
    }

    // Step 8: Enable GitHub Pages
    onProgress?.({ step: 'Enabling Pages', detail: 'Activating GitHub Pages...' });
    try {
      await fetch(`${GITHUB_API}/repos/${owner}/${repoName}/pages`, {
        method: 'POST',
        headers: {
          ...headers,
          Accept: 'application/vnd.github.switcheroo-preview+json',
        },
        body: JSON.stringify({
          source: {
            branch: 'main',
            path: '/',
          },
        }),
      });
    } catch (e) {
      // Pages might already be enabled, which is fine
      console.log('GitHub Pages may already be enabled:', e);
    }

    const liveUrl = `https://${owner}.github.io/${repoName}/`;
    const repoUrl = `https://github.com/${owner}/${repoName}`;

    onProgress?.({ step: 'Done', detail: `Live at ${liveUrl}` });

    return {
      success: true,
      url: liveUrl,
      repoUrl,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred during deployment.';
    console.error('Deployment failed:', error);
    return {
      success: false,
      error: message,
    };
  }
}

/**
 * Ensure there is an index.html at root for GitHub Pages to serve.
 * If the project is React/TSX based, create a simple HTML shell.
 */
function ensureIndexHtml(files: FileNode[]): FileNode[] {
  const hasIndexHtml = files.some(f => f.path === 'index.html' || f.path === '/index.html');
  if (hasIndexHtml) return files;

  // Get all CSS files to include
  const cssFiles = files.filter(f => f.path.endsWith('.css'));
  const cssInline = cssFiles.map(f => f.content).join('\n');

  // Find the main app component
  const appFile = files.find(f => /App\.(tsx|jsx)$/.test(f.path));

  // For React projects, create a self-contained HTML file
  const allCode = files
    .filter(f => /\.(tsx|jsx|ts|js)$/.test(f.path))
    .map(f => `<!-- ${f.path} -->\n${f.content}`)
    .join('\n\n');

  const indexHtml: FileNode = {
    path: 'index.html',
    content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>OpenStudio App</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; margin: 0; }
    ${cssInline}
  </style>
</head>
<body>
  <div id="root"></div>
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script type="text/babel" data-presets="env,react,typescript">
${appFile?.content || '// No App component found'}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(typeof App !== "undefined" ? App : () => React.createElement("div", null, "Hello from OpenStudio!")));
  </script>
</body>
</html>`,
  };

  return [...files, indexHtml];
}
