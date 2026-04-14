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
    <div className="flex flex-col h-full bg-[#050505] selection:bg-white selection:text-black transform-gpu">
      {/* Refined Sub-Header for Workspace Actions */}
      <div className="flex-shrink-0 flex items-center justify-between px-6 py-3 border-b border-zinc-900 bg-black/40 backdrop-blur-md h-12">
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-zinc-950 border border-zinc-900 p-0.5 rounded-none">
            <button
              onClick={() => setActiveTab('code')}
              className={`px-4 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] transition-all ${activeTab === 'code' ? 'bg-zinc-800 text-white shadow-[0_0_10px_rgba(255,255,255,0.05)]' : 'text-zinc-600 hover:text-zinc-400'}`}
            >
              Architect
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] transition-all ${activeTab === 'preview' ? 'bg-zinc-800 text-white shadow-[0_0_10px_rgba(255,255,255,0.05)]' : 'text-zinc-600 hover:text-zinc-400'}`}
            >
              Live Render
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 pr-2 border-r border-zinc-900">
             <span className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest">Workspace</span>
             <code className="text-[9px] font-mono text-zinc-500 bg-zinc-950 px-2 py-0.5 border border-zinc-900">nexus-v11</code>
          </div>

          <button
            onClick={() => setIsCodeViewVisible(!isCodeViewVisible)}
            className="p-1.5 border border-zinc-900 hover:border-zinc-700 transition-all rounded-none group bg-zinc-950"
            title={isCodeViewVisible ? "Collapse Node" : "Expand Node"}
          >
            {isCodeViewVisible ? <PanelLeftCloseIcon className="h-3.5 w-3.5 text-zinc-600 group-hover:text-white" /> : <PanelRightCloseIcon className="h-3.5 w-3.5 text-zinc-600 group-hover:text-white" />}
          </button>
        </div>
      </div>

      <div className="flex-1 flex h-full overflow-hidden">
        <motion.div
          ref={chatViewRef}
          className="h-full border-r border-neutral-900"
          initial={false}
          animate={{ width: isCodeViewVisible ? `${chatPanelWidth}px` : '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <ChatView
            messages={session.messages}
            isThinking={isThinking}
            onSendMessage={onSendMessage}
            suggestions={session.suggestions}
            selectedModelId={selectedModelId}
            onModelChange={onModelChange}
          />
        </motion.div>
        <AnimatePresence>
          {isCodeViewVisible && (
            <>
              <div
                onMouseDown={startResizing}
                className="w-1 h-full cursor-col-resize bg-black hover:bg-orange-500/50 transition-colors flex-shrink-0 hidden lg:block z-10"
              />
              <motion.div
                className="flex-1 h-full overflow-hidden"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              >
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
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}