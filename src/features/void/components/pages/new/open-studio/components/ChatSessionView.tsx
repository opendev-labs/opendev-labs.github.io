import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ChatSession, FileNode, GenerationInfo } from '../types';
import { ChatView } from './ChatView';
import { CodeView } from './CodeView';
import { DeployDialog } from './DeployDialog';
import { DeployIcon, PanelLeftCloseIcon, PanelRightCloseIcon, CodeIcon, PlayIcon, ShareIcon, ChevronsRightIcon } from './icons/Icons';
import { hubService } from '../../../../../../../services/hubService';
import { useAuth } from '../../../../../hooks/useAuth';
import { toast } from 'sonner';

interface ChatSessionViewProps {
  session: ChatSession;
  isThinking: boolean;
  onSendMessage: (prompt: string) => void;
  setActiveFile: (file: FileNode | null) => void;
  onFileContentChange: (path: string, content: string) => void;
  onAddFileOrFolder: (path: string, type: 'file' | 'folder') => void;
  onDeleteFileOrFolder: (path: string, isFile: boolean) => void;
  onRenameFileOrFolder: (oldPath: string, newPath: string, isFile: boolean) => void;
  // Model props
  selectedModelId: string;
  onModelChange: (modelId: string) => void;
}

export function ChatSessionView({
  session,
  isThinking,
  onSendMessage,
  setActiveFile,
  onFileContentChange,
  onAddFileOrFolder,
  onDeleteFileOrFolder,
  onRenameFileOrFolder,
  selectedModelId,
  onModelChange,
}: ChatSessionViewProps) {
  const { user, profile } = useAuth();
  const lastMessage = session.messages[session.messages.length - 1];
  const generationInfo: GenerationInfo | null = (lastMessage?.role === 'open-studio' && lastMessage.generationInfo)
    ? lastMessage.generationInfo
    : null;

  const [showDeployDialog, setShowDeployDialog] = useState(false);

  const [isCodeViewVisible, setIsCodeViewVisible] = useState(true);
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  const [chatPanelWidth, setChatPanelWidth] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth / 2;
    }
    return 600;
  });
  const chatViewRef = useRef<HTMLDivElement>(null);
  const isResizingRef = useRef(false);
  const prevIsThinking = useRef(isThinking);

  useEffect(() => {
    // When generation starts, force the 'code' tab to be active.
    if (isThinking) {
      setActiveTab('code');
    }
    // When generation finishes (isThinking was true, now false), switch to 'preview'.
    else if (prevIsThinking.current && !isThinking) {
      // Only switch if files were actually generated or modified.
      if (generationInfo?.files && generationInfo.files.length > 0) {
        setActiveTab('preview');
      }
    }

    // Update the ref to store the current thinking state for the next render cycle.
    prevIsThinking.current = isThinking;
  }, [isThinking, generationInfo]);

  // Restore cursor if the component unmounts mid-drag
  useEffect(() => {
    return () => {
      if (isResizingRef.current) {
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        isResizingRef.current = false;
      }
    };
  }, []);

  const startResizing = useCallback((mouseDownEvent: React.MouseEvent) => {
    mouseDownEvent.preventDefault();
    const startWidth = chatViewRef.current?.offsetWidth ?? chatPanelWidth;
    const startPosition = mouseDownEvent.clientX;

    // Lock cursor globally so it doesn't flicker during fast drags
    isResizingRef.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    function onMouseMove(mouseMoveEvent: MouseEvent) {
      if (!isResizingRef.current) return;
      const newWidth = startWidth + mouseMoveEvent.clientX - startPosition;
      const minWidth = 400;
      const maxWidth = window.innerWidth - 400;
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setChatPanelWidth(newWidth);
      }
    }
    function onMouseUp() {
      // Always restore cursor & state on release
      isResizingRef.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }, [chatPanelWidth]);

  return (
    <div className="flex flex-col h-full bg-[#0C0C0C] text-zinc-400 selection:bg-white/10 selection:text-white overflow-hidden">
      {/* 🏗️ UNIFIED WORKSPACE HEADER */}
      <header className="h-[52px] border-b border-zinc-900 bg-[#0C0C0C] flex items-center justify-between px-4 z-40">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-medium text-white transition-all cursor-default">{session.title || 'Untitled Session'}</h1>
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded-md">
               <span className="text-[11px] font-medium text-zinc-400">Public</span>
            </div>
            <button className="text-zinc-500 hover:text-white transition-colors">
              <ChevronsRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* VIEW TOGGLES */}
          <div className="flex items-center bg-black border border-zinc-900 rounded-lg p-1">
            <button
               onClick={() => setActiveTab('preview')}
               className={`px-3 py-1 text-[12px] font-medium rounded-md transition-all ${activeTab === 'preview' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
               Preview
            </button>
            <button
               onClick={() => setActiveTab('code')}
               className={`px-2 py-1 text-[12px] font-medium rounded-md transition-all ${activeTab === 'code' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
               <CodeIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={async () => {
                if (!user || !profile) { toast.error('Login required to share.'); return; }
                try {
                  const content = `🚀 Built "${session.title}" with OpenStudio!\n\n${session.fileTree.length} files generated. Check it out!\n\n#OpenStudio #WebDev`;
                  await hubService.shareToHub(user, profile, content, session.title);
                  toast.success('Shared to OpenHub!');
                } catch (e) {
                  toast.error('Failed to share.');
                }
              }}
              className="text-zinc-500 hover:text-white p-2 transition-colors"
              title="Share to OpenHub"
            >
              <ShareIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowDeployDialog(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-zinc-100 transition-colors text-black rounded-lg text-[12px] font-bold ml-1 shadow-2xl"
            >
              <DeployIcon className="w-3.5 h-3.5" />
              Deploy
            </button>
          </div>
        </div>
      </header>

      {/* 🏗️ MAIN WORKSPACE AREA */}
      <div className="flex-1 flex min-h-0 relative">
        {/* CHAT PANEL */}
        <motion.div
          ref={chatViewRef}
          className="h-full bg-[#0C0C0C] overflow-hidden relative"
          initial={false}
          animate={{ width: isCodeViewVisible ? `${chatPanelWidth}px` : '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="h-full">
            <ChatView
              messages={session.messages}
              isThinking={isThinking}
              onSendMessage={onSendMessage}
              suggestions={session.suggestions}
              selectedModelId={selectedModelId}
              onModelChange={onModelChange}
            />
          </div>
        </motion.div>

        {/* CODE / PREVIEW PANEL */}
        <AnimatePresence>
          {isCodeViewVisible && (
            <>
              {/* SUBTLE RESIZER — `relative` so the hit-area child stays scoped */}
              <div
                onMouseDown={startResizing}
                className="relative w-[5px] h-full cursor-col-resize bg-zinc-900 hover:bg-zinc-600 transition-colors flex-shrink-0 z-30"
              >
                {/* Expanded invisible hit-area — cursor-col-resize keeps cursor consistent */}
                <div className="absolute inset-y-0 -left-1 -right-1 cursor-col-resize z-10" />
              </div>

              <motion.div
                className="flex-1 h-full bg-[#000000] relative overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="h-full">
                  <CodeView
                    session={session}
                    setActiveFile={setActiveFile}
                    onFileContentChange={onFileContentChange}
                    generationInfo={generationInfo}
                    onAddFileOrFolder={onAddFileOrFolder}
                    onDeleteFileOrFolder={onDeleteFileOrFolder}
                    onRenameFileOrFolder={onRenameFileOrFolder}
                    activeTab={activeTab}
                  />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Deploy Dialog */}
      <DeployDialog
        open={showDeployDialog}
        onClose={() => setShowDeployDialog(false)}
        files={session.fileTree}
        sessionTitle={session.title}
      />
    </div>
  );
}