import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ChatSession, FileNode, GenerationInfo } from '../types';
import { ChatView } from './ChatView';
import { CodeView } from './CodeView';
import { DeployIcon, PanelLeftCloseIcon, PanelRightCloseIcon, CodeIcon, PlayIcon } from './icons/Icons';

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
  const lastMessage = session.messages[session.messages.length - 1];
  const generationInfo: GenerationInfo | null = (lastMessage?.role === 'open-studio' && lastMessage.generationInfo)
    ? lastMessage.generationInfo
    : null;

  const [isCodeViewVisible, setIsCodeViewVisible] = useState(true);
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  const [chatPanelWidth, setChatPanelWidth] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth / 2;
    }
    return 600;
  });
  const chatViewRef = useRef<HTMLDivElement>(null);
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

  const startResizing = useCallback((mouseDownEvent: React.MouseEvent) => {
    mouseDownEvent.preventDefault();
    const startWidth = chatViewRef.current?.offsetWidth ?? chatPanelWidth;
    const startPosition = mouseDownEvent.clientX;

    function onMouseMove(mouseMoveEvent: MouseEvent) {
      const newWidth = startWidth + mouseMoveEvent.clientX - startPosition;
      const minWidth = 400;
      const maxWidth = window.innerWidth - 400;
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setChatPanelWidth(newWidth);
      }
    }
    function onMouseUp() {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }, [chatPanelWidth]);

  return (
    <div className="flex flex-col h-full bg-[#080808] selection:bg-white/10 selection:text-white overflow-hidden">
      {/* 🏗️ WORKSPACE FRAME */}
      <div className="flex-1 flex min-h-0 relative">
        {/* CHAT PANEL */}
        <motion.div
          ref={chatViewRef}
          className="h-full bg-transparent overflow-hidden relative"
          initial={false}
          animate={{ width: isCodeViewVisible ? `${chatPanelWidth}px` : '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {/* Internal Panel Header */}
          <div className="absolute top-0 left-0 right-0 h-16 border-b border-zinc-900/50 bg-[#080808]/80 backdrop-blur-md flex items-center justify-between px-8 z-20">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] font-mono">Architect // Neural Stream</span>
            </div>
            <button
              onClick={() => setIsCodeViewVisible(!isCodeViewVisible)}
              className="p-2 text-zinc-600 hover:text-white transition-colors bg-zinc-900/30 rounded-lg border border-zinc-800/50"
              title={isCodeViewVisible ? "Maximize View" : "Restore View"}
            >
              {isCodeViewVisible ? <PanelLeftCloseIcon className="h-4 w-4" /> : <PanelRightCloseIcon className="h-4 w-4" />}
            </button>
          </div>

          <div className="h-full pt-16">
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
              {/* SLICK RESIZER */}
              <div
                onMouseDown={startResizing}
                className="w-[1px] h-full cursor-col-resize bg-zinc-900 hover:bg-zinc-700 transition-colors flex-shrink-0 z-30 group relative"
              >
                <div className="absolute inset-y-0 -left-1 -right-1 z-10" />
              </div>

              <motion.div
                className="flex-1 h-full bg-[#050505] relative overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {/* Internal Workspace Header */}
                <div className="absolute top-0 left-0 right-0 h-16 border-b border-zinc-900/50 bg-[#050505]/80 backdrop-blur-md flex items-center justify-between px-8 z-20">
                  <div className="flex bg-zinc-950/50 border border-zinc-900/80 rounded-xl p-1">
                    <button
                      onClick={() => setActiveTab('code')}
                      className={`px-5 py-1.5 text-[9px] font-bold uppercase tracking-widest rounded-lg transition-all ${activeTab === 'code' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-600 hover:text-zinc-400'}`}
                    >
                      <div className="flex items-center gap-2">
                         <CodeIcon className="w-3 h-3" />
                         Code
                      </div>
                    </button>
                    <button
                      onClick={() => setActiveTab('preview')}
                      className={`px-5 py-1.5 text-[9px] font-bold uppercase tracking-widest rounded-lg transition-all ${activeTab === 'preview' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-600 hover:text-zinc-400'}`}
                    >
                      <div className="flex items-center gap-2">
                         <PlayIcon className="w-3 h-3" />
                         Preview
                      </div>
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900/50 border border-zinc-800/50 rounded-lg">
                      <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Synced</span>
                    </div>
                  </div>
                </div>

                <div className="h-full pt-16">
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
    </div>
  );
}