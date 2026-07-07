#!/usr/bin/env python3
import sys
import os
import subprocess
import json
import requests
from datetime import datetime

class GHEngine:
    def __init__(self, workspace_root=None):
        if workspace_root:
            self.workspace_root = workspace_root
        else:
            # Default to a subfolder in user data if not provided
            self.workspace_root = os.path.expanduser("~/.syncstack-data")
        
        self.snapshots_dir = os.path.join(self.workspace_root, "snapshots")
        if not os.path.exists(self.snapshots_dir):
            os.makedirs(self.snapshots_dir, exist_ok=True)

    def run_git(self, repo_path, args):
        try:
            result = subprocess.run(
                ["git", "-C", repo_path] + args,
                capture_output=True,
                text=True,
                check=False
            )
            return result
        except Exception as e:
            return None

    def get_repo_status(self, repo_path):
        if not os.path.exists(os.path.join(repo_path, ".git")):
            return {"exists": False}

        # 1. Current Branch
        res = self.run_git(repo_path, ["rev-parse", "--abbrev-ref", "HEAD"])
        branch = res.stdout.strip() if res and res.returncode == 0 else "main"

        # 2. Local Changes (Dirty Status)
        res = self.run_git(repo_path, ["status", "--porcelain"])
        changes = res.stdout.strip().split("\n") if res and res.stdout.strip() else []
        is_dirty = len(changes) > 0

        # 3. Ahead / Behind Status
        # Fetch first to get latest remote info
        self.run_git(repo_path, ["fetch", "--quiet"])
        res = self.run_git(repo_path, ["rev-list", "--left-right", "--count", f"HEAD...origin/{branch}"])
        ahead, behind = 0, 0
        if res and res.returncode == 0:
            parts = res.stdout.strip().split()
            if len(parts) == 2:
                ahead, behind = int(parts[0]), int(parts[1])

        # 4. Conflict Prediction
        risk = "low"
        if is_dirty and behind > 0:
            risk = "high"
            reason = "Local changes will clash with incoming remote commits."
        elif is_dirty and ahead > 0:
            risk = "medium"
            reason = "Local commits need to be pushed; potential for remote divergence."
        elif behind > 0:
            risk = "medium"
            reason = "You are behind the remote; pull recommended before work."
        else:
            reason = "Everything is synchronized."

        return {
            "exists": True,
            "branch": branch,
            "is_dirty": is_dirty,
            "changes_count": len(changes),
            "ahead": ahead,
            "behind": behind,
            "risk": risk,
            "risk_reason": reason,
            "human_status": self._humanize_status(is_dirty, ahead, behind)
        }

    def _humanize_status(self, is_dirty, ahead, behind):
        if is_dirty: return "Uncommitted changes"
        if ahead > 0 and behind > 0: return f"Diverged ({ahead}↑ / {behind}↓)"
        if ahead > 0: return f"{ahead} commits ahead (Push needed)"
        if behind > 0: return f"{behind} commits behind (Pull needed)"
        return "Up to date"

    def get_detailed_status(self, repo_path):
        """Get detailed status with file-by-file changes"""
        if not os.path.exists(os.path.join(repo_path, ".git")):
            return {"success": False, "message": "Not a git repository"}

        try:
            # Get basic status
            res = self.run_git(repo_path, ["rev-parse", "--abbrev-ref", "HEAD"])
            branch = res.stdout.strip() if res and res.returncode == 0 else "main"

            # Get file changes with status
            res = self.run_git(repo_path, ["status", "--porcelain"])
            changes = []
            if res and res.stdout.strip():
                for line in res.stdout.strip().split("\n"):
                    if len(line) < 4:
                        continue
                    status_code = line[0:2].strip()
                    file_path = line[3:]
                    
                    # Get additions/deletions for modified files
                    additions, deletions = 0, 0
                    if status_code in ['M', 'MM']:
                        stat_res = self.run_git(repo_path, ["diff", "--numstat", file_path])
                        if stat_res and stat_res.stdout.strip():
                            parts = stat_res.stdout.strip().split()
                            if len(parts) >= 2:
                                try:
                                    additions = int(parts[0]) if parts[0] != '-' else 0
                                    deletions = int(parts[1]) if parts[1] != '-' else 0
                                except ValueError:
                                    pass
                    
                    # Map git status codes
                    status = 'M'  # default
                    if status_code in ['A', 'AM']:
                        status = 'A'  # Added
                    elif status_code in ['D']:
                        status = 'D'  # Deleted
                    elif status_code in ['??']:
                        status = '?'  # Untracked
                    elif status_code in ['M', 'MM']:
                        status = 'M'  # Modified
                    
                    changes.append({
                        "file": file_path,
                        "status": status,
                        "additions": additions,
                        "deletions": deletions
                    })

            is_dirty = len(changes) > 0

            # Ahead/Behind
            self.run_git(repo_path, ["fetch", "--quiet"])
            res = self.run_git(repo_path, ["rev-list", "--left-right", "--count", f"HEAD...origin/{branch}"])
            ahead, behind = 0, 0
            if res and res.returncode == 0:
                parts = res.stdout.strip().split()
                if len(parts) == 2:
                    ahead, behind = int(parts[0]), int(parts[1])

            # Get commit history
            commits = self._get_commit_history(repo_path, limit=10)

            # Risk assessment
            risk = "low"
            if is_dirty and behind > 0:
                risk = "high"
            elif behind > 0:
                risk = "medium"

            return {
                "success": True,
                "exists": True,
                "branch": branch,
                "is_dirty": is_dirty,
                "changes": changes,
                "ahead": ahead,
                "behind": behind,
                "risk": risk,
                "commits": commits,
                "human_status": self._humanize_status(is_dirty, ahead, behind)
            }
        except Exception as e:
            return {"success": False, "message": str(e)}

    def _get_commit_history(self, repo_path, limit=10):
        """Get commit history for visualization"""
        res = self.run_git(repo_path, [
            "log",
            f"-{limit}",
            "--pretty=format:%H|%an|%ae|%at|%s"
        ])
        
        commits = []
        if res and res.stdout.strip():
            for line in res.stdout.strip().split("\n"):
                parts = line.split('|')
                if len(parts) >= 5:
                    commits.append({
                        "hash": parts[0][:7],
                        "author": parts[1],
                        "email": parts[2],
                        "timestamp": parts[3],
                        "message": parts[4]
                    })
        return commits

    def get_git_graph(self, repo_path, limit=20):
        """Get git graph data for visualization"""
        res = self.run_git(repo_path, [
            "log",
            f"-{limit}",
            "--graph",
            "--pretty=format:%H|%p|%an|%s|%at"
        ])
        
        graph_data = []
        if res and res.stdout.strip():
            for line in res.stdout.strip().split("\n"):
                # Handle graph characters
                parts = line.split('|')
                if len(parts) >= 5:
                    graph_data.append({
                        "id": parts[0].strip().split()[-1], # Hash might have graph prefix
                        "parents": parts[1].split(),
                        "author": parts[2],
                        "message": parts[3],
                        "timestamp": parts[4],
                        "raw_line": line
                    })
                else:
                    graph_data.append({"raw_line": line})
        return graph_data

    def get_file_diff(self, repo_path, file_path):
        """Get diff for a specific file"""
        if not os.path.exists(os.path.join(repo_path, ".git")):
            return {"success": False, "message": "Not a git repository"}

        try:
            res = self.run_git(repo_path, ["diff", "HEAD", file_path])
            if res and res.returncode == 0:
                return {"success": True, "diff": res.stdout}
            else:
                # Try untracked file
                res = self.run_git(repo_path, ["diff", "/dev/null", file_path])
                if res:
                    return {"success": True, "diff": res.stdout}
                return {"success": False, "message": "No diff available"}
        except Exception as e:
            return {"success": False, "message": str(e)}

    def create_snapshot(self, repo_path, repo_name):
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        snapshot_branch = f"syncstack-backup-{timestamp}"
        
        # We create a new branch from current HEAD as a safety backup
        res = self.run_git(repo_path, ["branch", snapshot_branch])
        if res and res.returncode == 0:
            return snapshot_branch
        return None

    def sync_repo(self, repo_path, repo_name, remote_url, token, strategy="pull"):
        status = self.get_repo_status(repo_path)
        
        # 1. Handle non-existent repo (Clone)
        if not status["exists"]:
            # Handle auth URL
            if "huggingface.co" in remote_url:
                # HF usually needs user:token
                user = repo_name.split('/')[0]
                auth_url = remote_url.replace("https://", f"https://{user}:{token}@")
            else:
                # GitHub works with just token
                auth_url = remote_url.replace("https://", f"https://{token}@")
                
            os.makedirs(os.path.dirname(repo_path), exist_ok=True)
            res = subprocess.run(["git", "clone", auth_url, repo_path], capture_output=True, text=True)
            if res.returncode == 0:
                return {"success": True, "operation": "clone", "message": "Repository cloned successfully"}
            else:
                return {"success": False, "message": f"Clone failed: {res.stderr}"}

        # 2. Safety Snapshot
        snapshot_id = self.create_snapshot(repo_path, repo_name)

        # 3. Execute Sync Strategy
        try:
            if strategy == "reset":
                # Hard reset to remote
                self.run_git(repo_path, ["fetch", "origin"])
                res = self.run_git(repo_path, ["reset", "--hard", f"origin/{status['branch']}"])
                if res.returncode != 0: raise Exception(res.stderr)
            
            elif strategy == "rebase":
                # Rebase local on top of remote
                res = self.run_git(repo_path, ["pull", "--rebase", "origin", status["branch"]])
                if res.returncode != 0: raise Exception(res.stderr)
            
            else: # default pull
                # Standard merge pull
                res = self.run_git(repo_path, ["pull", "origin", status["branch"]])
                if res.returncode != 0: raise Exception(res.stderr)

            return {
                "success": True, 
                "operation": strategy, 
                "message": "Sync completed successfully",
                "snapshot": snapshot_id
            }

        except Exception as e:
            return {
                "success": False,
                "message": f"Sync failed: {str(e)}",
                "snapshot": snapshot_id,
                "suggestion": "A backup branch was created. You can restore your work if needed."
            }

    # API Wrappers (Moved from gh_api.py)
    def validate_token(self, username, token):
        try:
            response = requests.get(
                'https://api.github.com/user',
                headers={'Authorization': f'token {token}', 'Accept': 'application/vnd.github.v3+json'},
                timeout=10
            )
            if response.status_code == 200:
                user_data = response.json()
                if user_data['login'].lower() == username.lower():
                    return {"success": True, "user": user_data}
            return {"success": False, "message": "Invalid token or username mismatch"}
        except Exception as e:
            return {"success": False, "message": str(e)}

    def get_user_repos(self, token):
        try:
            response = requests.get(
                'https://api.github.com/user/repos?per_page=100&sort=updated',
                headers={'Authorization': f'token {token}', 'Accept': 'application/vnd.github.v3+json'},
                timeout=10
            )
            if response.status_code == 200:
                return {"success": True, "repos": response.json()}
            return {"success": False, "message": f"GitHub API Error {response.status_code}: {response.text}"}
        except Exception as e:
            return {"success": False, "message": f"Connection Error: {str(e)}"}

    def search_repos(self, token, query):
        try:
            response = requests.get(
                f'https://api.github.com/search/repositories?q={query}',
                headers={'Authorization': f'token {token}', 'Accept': 'application/vnd.github.v3+json'},
                timeout=10
            )
            if response.status_code == 200:
                return {"success": True, "repos": response.json().get('items', [])}
            return {"success": False, "message": f"Search Error {response.status_code}"}
        except Exception as e:
            return {"success": False, "message": str(e)}

    def get_workflows(self, token, repo_full_name):
        try:
            response = requests.get(
                f'https://api.github.com/repos/{repo_full_name}/actions/workflows',
                headers={'Authorization': f'token {token}', 'Accept': 'application/vnd.github.v3+json'},
                timeout=10
            )
            if response.status_code == 200:
                return {"success": True, "workflows": response.json().get('workflows', [])}
            return {"success": False, "message": f"Actions Error {response.status_code}"}
        except Exception as e:
            return {"success": False, "message": str(e)}

    def get_workflow_runs(self, token, repo_full_name):
        try:
            response = requests.get(
                f'https://api.github.com/repos/{repo_full_name}/actions/runs?per_page=10',
                headers={'Authorization': f'token {token}', 'Accept': 'application/vnd.github.v3+json'},
                timeout=10
            )
            if response.status_code == 200:
                return {"success": True, "runs": response.json().get('workflow_runs', [])}
            return {"success": False, "message": f"Actions Error {response.status_code}"}
        except Exception as e:
            return {"success": False, "message": str(e)}

    def trigger_workflow(self, token, repo_full_name, workflow_id, ref='main'):
        try:
            response = requests.post(
                f'https://api.github.com/repos/{repo_full_name}/actions/workflows/{workflow_id}/dispatches',
                headers={
                    'Authorization': f'token {token}',
                    'Accept': 'application/vnd.github.v3+json'
                },
                json={'ref': ref},
                timeout=10
            )
            if response.status_code == 204:
                return {"success": True, "message": "Workflow triggered"}
            return {"success": False, "message": f"Trigger Error {response.status_code}: {response.text}"}
        except Exception as e:
            return {"success": False, "message": str(e)}

    def get_run_jobs(self, token, repo_full_name, run_id):
        try:
            response = requests.get(
                f'https://api.github.com/repos/{repo_full_name}/actions/runs/{run_id}/jobs',
                headers={'Authorization': f'token {token}', 'Accept': 'application/vnd.github.v3+json'},
                timeout=10
            )
            if response.status_code == 200:
                return {"success": True, "jobs": response.json().get('jobs', [])}
            return {"success": False, "message": f"Jobs Error {response.status_code}"}
        except Exception as e:
            return {"success": False, "message": str(e)}

    def scaffold_repo(self, repo_path, template_name):
        """Generate boilerplate files for various templates"""
        try:
            os.makedirs(repo_path, exist_ok=True)
            
            if template_name == "Pure HTML":
                with open(os.path.join(repo_path, "index.html"), "w") as f:
                    f.write("<!DOCTYPE html>\n<html lang='en'>\n<head>\n    <meta charset='UTF-8'>\n    <title>HTML Project</title>\n</head>\n<body>\n    <h1>New HTML Project</h1>\n</body>\n</html>")
            
            elif template_name == "Pure CSS":
                with open(os.path.join(repo_path, "index.html"), "w") as f:
                    f.write("<!DOCTYPE html>\n<html>\n<head>\n    <link rel='stylesheet' href='style.css'>\n</head>\n<body>\n    <h1>CSS Focused Project</h1>\n</body>\n</html>")
                with open(os.path.join(repo_path, "style.css"), "w") as f:
                    f.write("body { \n    background: #0d1117; \n    color: #58a6ff; \n    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; \n    display: flex; \n    justify-content: center; \n    align-items: center; \n    height: 100vh; \n    margin: 0; \n}")
            
            elif template_name == "Pure JS":
                with open(os.path.join(repo_path, "index.html"), "w") as f:
                    f.write("<!DOCTYPE html>\n<html>\n<body>\n    <h1>JS Logic Project</h1>\n    <p>Check the console.</p>\n    <script src='app.js'></script>\n</body>\n</html>")
                with open(os.path.join(repo_path, "app.js"), "w") as f:
                    f.write("console.log('Quantum JS Initialized');\n// Logic here")
            
            elif template_name == "Quantum Combined (Recommended)":
                with open(os.path.join(repo_path, "index.html"), "w") as f:
                    f.write("<!DOCTYPE html>\n<html>\n<head>\n    <link rel='stylesheet' href='style.css'>\n</head>\n<body>\n    <div id='app'>\n        <h1>Quantum Workspace</h1>\n        <p>HTML+CSS+JS Stack ready.</p>\n    </div>\n    <script src='app.js'></script>\n</body>\n</html>")
                with open(os.path.join(repo_path, "style.css"), "w") as f:
                    f.write("body { background: #000; color: #00ff41; font-family: monospace; padding: 20px; }")
                with open(os.path.join(repo_path, "app.js"), "w") as f:
                    f.write("console.log('Quantum Combined Stack Active');")

            # Finalize git
            if os.path.exists(os.path.join(repo_path, ".git")):
                self.run_git(repo_path, ["add", "."])
                self.run_git(repo_path, ["commit", "-m", f"Initialize with {template_name} template"])
            
            return {"success": True, "message": f"Scaffolded {template_name} successfully"}
        except Exception as e:
            return {"success": False, "message": str(e)}

    def export_sandbox(self, html, css, js):
        """Save sandbox code to a temporary file for browser preview"""
        try:
            temp_dir = os.path.join(self.workspace_root, "temp_sandbox")
            os.makedirs(temp_dir, exist_ok=True)
            
            file_path = os.path.join(temp_dir, "preview.html")
            with open(file_path, "w") as f:
                f.write(f"<!DOCTYPE html><html><head><style>{css}</style></head><body>{html}<script>{js}</script></body></html>")
            
            return {"success": True, "path": f"file://{file_path}"}
        except Exception as e:
            return {"success": False, "message": str(e)}

    def deploy_sandbox(self, repo_path, html, css, js, commit_msg):
        """Write sandbox code to a repo and commit"""
        try:
            if not os.path.exists(os.path.join(repo_path, ".git")):
                return {"success": False, "message": "Target path is not a git repository"}
            
            with open(os.path.join(repo_path, "index.html"), "w") as f: f.write(html)
            with open(os.path.join(repo_path, "style.css"), "w") as f: f.write(css)
            with open(os.path.join(repo_path, "app.js"), "w") as f: f.write(js)
            
            self.run_git(repo_path, ["add", "."])
            self.run_git(repo_path, ["commit", "-m", commit_msg])
            
            return {"success": True, "message": "Changes committed successfully"}
        except Exception as e:
            return {"success": False, "message": str(e)}

    def scan_local_repos(self, search_path, depth=3):
        """Recursively scan for git repositories"""
        repos = []
        search_path = os.path.expanduser(search_path)
        
        for root, dirs, files in os.walk(search_path):
            # Control depth
            if root.count(os.sep) - search_path.count(os.sep) >= depth:
                del dirs[:]
                continue
                
            if ".git" in dirs:
                repo_path = root
                res = self.get_repo_status(repo_path)
                if res.get('exists'):
                    repos.append({
                        "name": os.path.basename(repo_path),
                        "path": repo_path,
                        "status": res
                    })
                # Don't recurse into subdirectories of a repo
                dirs.remove(".git")
        
        return {"success": True, "repos": repos}

    def batch_sync(self, token, repos_list, strategy="pull"):
        results = []
        for repo in repos_list:
            # repo is dict with fullName, cloneUrl
            name = repo['fullName']
            url = repo['cloneUrl']
            path = os.path.join(self.workspace_root, name)
            res = self.sync_repo(path, name, url, token, strategy)
            results.append({"repo": name, "result": res})
        return {"success": True, "results": results}

    def create_repo(self, token, name, description, private=False):
        try:
            response = requests.post(
                'https://api.github.com/user/repos',
                headers={'Authorization': f'token {token}', 'Accept': 'application/vnd.github.v3+json'},
                json={
                    'name': name,
                    'description': description,
                    'private': private,
                    'auto_init': True
                },
                timeout=10
            )
            if response.status_code == 201:
                return {"success": True, "repo": response.json()}
            return {"success": False, "message": f"Create Error {response.status_code}: {response.text}"}
        except Exception as e:
            return {"success": False, "message": str(e)}

    def get_bulk_status(self, repos_list):
        """Get status for multiple local repositories"""
        results = []
        for repo in repos_list:
            path = repo.get('path')
            if path and os.path.exists(path):
                results.append({
                    "name": repo.get('name'),
                    "path": path,
                    "status": self.get_repo_status(path)
                })
        return {"success": True, "results": results}

if __name__ == "__main__":
    engine = GHEngine()
    
    if len(sys.argv) < 2:
        print(json.dumps({"success": False, "message": "Missing command"}))
        sys.exit(1)

    cmd = sys.argv[1]
    
    try:
        if cmd == "validate":
            print(json.dumps(engine.validate_token(sys.argv[2], sys.argv[3])))
        elif cmd == "get_repos":
            print(json.dumps(engine.get_user_repos(sys.argv[2])))
        elif cmd == "search_repos":
            print(json.dumps(engine.search_repos(sys.argv[2], sys.argv[3])))
        elif cmd == "get_status":
            print(json.dumps(engine.get_repo_status(sys.argv[2])))
        elif cmd == "sync":
            # sync <path> <name> <url> <token> <strategy>
            if len(sys.argv) < 6:
                print(json.dumps({"success": False, "message": "Missing arguments for sync"}))
            else:
                path, name, url, token = sys.argv[2:6]
                strategy = sys.argv[6] if len(sys.argv) > 6 else "pull"
                print(json.dumps(engine.sync_repo(path, name, url, token, strategy)))
        elif cmd == "batch_sync":
            # batch_sync <token> <repos_json> <strategy>
            token = sys.argv[2]
            repos_list = json.loads(sys.argv[3])
            strategy = sys.argv[4] if len(sys.argv) > 4 else "pull"
            print(json.dumps(engine.batch_sync(token, repos_list, strategy)))
        elif cmd == "get_detailed_status":
            print(json.dumps(engine.get_detailed_status(sys.argv[2])))
        elif cmd == "get_file_diff":
            print(json.dumps(engine.get_file_diff(sys.argv[2], sys.argv[3])))
        elif cmd == "export_sandbox":
            # export_sandbox <html> <css> <js>
            print(json.dumps(engine.export_sandbox(sys.argv[2], sys.argv[3], sys.argv[4])))
        elif cmd == "deploy_sandbox":
            # deploy_sandbox <path> <html> <css> <js> <msg>
            print(json.dumps(engine.deploy_sandbox(sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5], sys.argv[6])))
        elif cmd == "get_workflows":
            print(json.dumps(engine.get_workflows(sys.argv[2], sys.argv[3])))
        elif cmd == "get_workflow_runs":
            print(json.dumps(engine.get_workflow_runs(sys.argv[2], sys.argv[3])))
        elif cmd == "trigger_workflow":
            # trigger_workflow <token> <repo> <id> <ref>
            ref = sys.argv[5] if len(sys.argv) > 5 else "main"
            print(json.dumps(engine.trigger_workflow(sys.argv[2], sys.argv[3], sys.argv[4], ref)))
        elif cmd == "get_run_jobs":
            print(json.dumps(engine.get_run_jobs(sys.argv[2], sys.argv[3], sys.argv[4])))
        elif cmd == "get_remote_diff":
            print(json.dumps(engine.get_remote_diff(sys.argv[2], sys.argv[3])))
        elif cmd == "create_repo":
            # create_repo <token> <name> <desc> <private>
            private = sys.argv[5].lower() == 'true' if len(sys.argv) > 5 else False
            print(json.dumps(engine.create_repo(sys.argv[2], sys.argv[3], sys.argv[4], private)))
        elif cmd == "scan_local":
            # scan_local <path> <depth>
            depth = int(sys.argv[3]) if len(sys.argv) > 3 else 3
            print(json.dumps(engine.scan_local_repos(sys.argv[2], depth)))
        elif cmd == "scaffold_repo":
            # scaffold_repo <path> <template>
            print(json.dumps(engine.scaffold_repo(sys.argv[2], sys.argv[3])))
        else:
            print(json.dumps({"success": False, "message": f"Unknown command: {cmd}"}))
    except Exception as e:
        print(json.dumps({"success": False, "message": f"Engine runtime error: {str(e)}"}))
