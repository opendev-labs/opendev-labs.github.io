import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../../../../../components/ui/shadcn/dialog';
import type { FileNode } from '../types';
import { useAuth } from '../../../../../hooks/useAuth';
import { deployToGitHub, slugifyRepoName } from '../../../../../../../services/deploymentService';
import { hubService } from '../../../../../../../services/hubService';
import { DeployIcon, SpinnerIcon } from './icons/Icons';
import { toast } from 'sonner';

interface DeployDialogProps {
  open: boolean;
  onClose: () => void;
  files: FileNode[];
  sessionTitle: string;
}

type DeployState = 'idle' | 'deploying' | 'success' | 'error';

interface DeployStep {
  step: string;
  detail: string;
}

export function DeployDialog({ open, onClose, files, sessionTitle }: DeployDialogProps) {
  const { user, profile, isGithubConnected, linkWithGitHub } = useAuth();
  const [repoName, setRepoName] = useState('');
  const [state, setState] = useState<DeployState>('idle');
  const [progress, setProgress] = useState<DeployStep | null>(null);
  const [deployedUrl, setDeployedUrl] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [error, setError] = useState('');
  const [isSharing, setIsSharing] = useState(false);

  // Pre-fill repo name from session title
  useEffect(() => {
    if (open && sessionTitle) {
      setRepoName(slugifyRepoName(sessionTitle));
    }
  }, [open, sessionTitle]);

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setState('idle');
      setProgress(null);
      setDeployedUrl('');
      setRepoUrl('');
      setError('');
    }
  }, [open]);

  const token = localStorage.getItem('opendev_gh_token');

  const handleDeploy = async () => {
    if (!token) {
      setError('GitHub not connected. Please connect your GitHub account first.');
      return;
    }
    if (!repoName.trim()) {
      setError('Please enter a repository name.');
      return;
    }

    setState('deploying');
    setError('');

    const result = await deployToGitHub(
      files,
      repoName.trim(),
      token,
      (p) => setProgress(p)
    );

    if (result.success && result.url) {
      setState('success');
      setDeployedUrl(result.url);
      setRepoUrl(result.repoUrl || '');
    } else {
      setState('error');
      setError(result.error || 'Deployment failed.');
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(deployedUrl);
    toast.success('URL copied to clipboard!');
  };

  const handleShareToHub = async () => {
    if (!user || !profile) return;
    setIsSharing(true);
    try {
      const content = `🚀 Just deployed "${sessionTitle}" with OpenStudio!\n\n🔗 ${deployedUrl}\n\nBuilt with ${files.length} files. Check it out!\n\n#OpenStudio #WebDev #Shipped`;
      await hubService.shareToHub(user, profile, content, sessionTitle);
      toast.success('Shared to OpenHub!');
    } catch (e) {
      toast.error('Failed to share to Hub.');
    } finally {
      setIsSharing(false);
    }
  };

  const handleConnectGitHub = async () => {
    try {
      await linkWithGitHub();
      toast.success('GitHub connected!');
    } catch (e) {
      toast.error('Failed to connect GitHub.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent className="bg-[#0A0A0A] border-zinc-800 rounded-2xl max-w-md p-0 overflow-hidden shadow-2xl">
        <DialogHeader className="p-6 border-b border-zinc-900">
          <DialogTitle className="text-[13px] font-bold uppercase tracking-[0.2em] text-white flex items-center gap-3">
            <div className="p-2 bg-white/5 border border-zinc-800 rounded-lg">
              <DeployIcon className="w-4 h-4 text-white" />
            </div>
            Deploy to GitHub Pages
          </DialogTitle>
        </DialogHeader>

        <div className="p-6">
          {/* Not connected state */}
          {!token && state === 'idle' && (
            <div className="space-y-4">
              <div className="p-4 bg-orange-500/5 border border-orange-500/20 rounded-xl">
                <p className="text-[11px] text-orange-400 font-bold uppercase tracking-widest mb-3">GitHub Not Connected</p>
                <p className="text-[11px] text-zinc-400 leading-relaxed mb-4">Connect your GitHub account to deploy projects to GitHub Pages.</p>
                <button
                  onClick={handleConnectGitHub}
                  className="w-full px-4 py-3 text-[11px] font-bold uppercase tracking-widest bg-white text-black hover:bg-zinc-200 transition-all rounded-xl"
                >
                  Connect GitHub
                </button>
              </div>
            </div>
          )}

          {/* Idle state — ready to deploy */}
          {token && state === 'idle' && (
            <div className="space-y-5">
              <div>
                <label className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.3em] mb-2 block">Repository Name</label>
                <input
                  type="text"
                  value={repoName}
                  onChange={(e) => setRepoName(e.target.value.replace(/[^a-z0-9-]/gi, '-').toLowerCase())}
                  placeholder="my-awesome-project"
                  className="w-full bg-[#050505] border border-zinc-800 focus:border-zinc-600 rounded-xl px-4 py-3 text-[12px] font-mono text-white transition-all focus:outline-none"
                />
                <p className="text-[9px] text-zinc-600 mt-2 font-mono">
                  github.com/{user?.name?.toLowerCase().replace(/\s/g, '') || 'user'}/{repoName || '...'}
                </p>
              </div>

              <div className="p-3 bg-zinc-900/50 border border-zinc-800/50 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Files to deploy</span>
                  <span className="text-[11px] text-white font-bold">{files.filter(f => !f.path.endsWith('.keep')).length}</span>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <p className="text-[11px] text-red-400">{error}</p>
                </div>
              )}

              <button
                onClick={handleDeploy}
                disabled={!repoName.trim()}
                className="w-full px-4 py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] bg-white text-black hover:bg-emerald-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all rounded-xl shadow-lg"
              >
                Deploy Now
              </button>
            </div>
          )}

          {/* Deploying state */}
          {state === 'deploying' && (
            <div className="space-y-6 py-4">
              <div className="flex items-center justify-center gap-3">
                <SpinnerIcon className="w-5 h-5 animate-spin text-white" />
                <span className="text-[12px] font-bold text-white uppercase tracking-widest">{progress?.step || 'Deploying'}...</span>
              </div>
              <div className="w-full bg-zinc-900 rounded-full h-1 overflow-hidden">
                <div className="bg-white h-full rounded-full animate-pulse" style={{ width: '60%' }} />
              </div>
              <p className="text-center text-[10px] text-zinc-500 font-mono">{progress?.detail || 'Please wait...'}</p>
            </div>
          )}

          {/* Success state */}
          {state === 'success' && (
            <div className="space-y-5">
              <div className="text-center space-y-3 py-2">
                <div className="w-12 h-12 mx-auto bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center">
                  <span className="text-emerald-500 text-xl">✓</span>
                </div>
                <p className="text-[12px] font-bold text-white uppercase tracking-widest">Deployed Successfully</p>
                <p className="text-[10px] text-zinc-500">Your app will be live in ~30 seconds.</p>
              </div>

              <div className="p-4 bg-zinc-900/50 border border-zinc-800/50 rounded-xl space-y-3">
                <div>
                  <label className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest block mb-1">Live URL</label>
                  <div className="flex items-center gap-2">
                    <input
                      readOnly
                      value={deployedUrl}
                      className="flex-1 bg-[#050505] border border-zinc-800 rounded-lg px-3 py-2 text-[11px] font-mono text-emerald-400 focus:outline-none"
                    />
                    <button
                      onClick={handleCopyUrl}
                      className="px-3 py-2 text-[9px] font-bold uppercase tracking-widest bg-zinc-800 text-white hover:bg-zinc-700 transition-all rounded-lg"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                {repoUrl && (
                  <div>
                    <label className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest block mb-1">Repository</label>
                    <a
                      href={repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-mono text-blue-400 hover:text-blue-300 truncate block"
                    >
                      {repoUrl}
                    </a>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <a
                  href={deployedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-4 py-3 text-[10px] font-bold uppercase tracking-widest bg-white text-black hover:bg-zinc-200 transition-all rounded-xl text-center"
                >
                  Open Site
                </a>
                <button
                  onClick={handleShareToHub}
                  disabled={isSharing}
                  className="flex-1 px-4 py-3 text-[10px] font-bold uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 disabled:opacity-50 transition-all rounded-xl"
                >
                  {isSharing ? 'Sharing...' : 'Share to Hub'}
                </button>
              </div>
            </div>
          )}

          {/* Error state */}
          {state === 'error' && (
            <div className="space-y-4">
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-[11px] font-bold text-red-400 uppercase tracking-widest mb-2">Deployment Failed</p>
                <p className="text-[11px] text-red-300/80 leading-relaxed">{error}</p>
              </div>
              <button
                onClick={() => setState('idle')}
                className="w-full px-4 py-3 text-[10px] font-bold uppercase tracking-widest bg-zinc-900 text-white border border-zinc-800 hover:bg-zinc-800 transition-all rounded-xl"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
