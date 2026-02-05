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
  apiKeys: Record<string, string>;
  onModelChange: (modelId: string) => void;
  onApiKeySave: (provider: string, key: string) => void;
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
  apiKeys,
  onModelChange,
  onApiKeySave
}: ChatSessionViewProps) {
  const lastMessage = session.messages[session.messages.length - 1];
  const generationInfo: GenerationInfo | null = (lastMessage?.role === 'sub0' && lastMessage.generationInfo)
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
    <div className="flex flex-col h-full">
      <header className="flex-shrink-0 flex items-center justify-between p-3 border-b border-neutral-800">
        <div className="flex items-center gap-3">
          <h2 className="font-semibold text-white truncate">{session.title}</h2>
        </div>
        <div className="flex items-center gap-2">
          {isCodeViewVisible && (
            <div className="relative flex items-center bg-black/30 p-1 rounded-lg">
              <div
                className="absolute top-1 bottom-1 w-8 bg-neutral-700 rounded-md transition-transform duration-300 ease-in-out"
                style={{ transform: activeTab === 'preview' ? 'translateX(36px)' : 'translateX(0px)' }}
              />
              <button
                onClick={() => setActiveTab('code')}
                aria-pressed={activeTab === 'code'}
                className="relative z-10 p-1.5 h-8 w-8 rounded-md"
                aria-label="Code view"
                title="Code view"
              >
                <CodeIcon className={`h-4 w-4 mx-auto transition-colors ${activeTab === 'code' ? 'text-white' : 'text-gray-400 hover:text-white'}`} />
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                aria-pressed={activeTab === 'preview'}
                className="relative z-10 p-1.5 h-8 w-8 rounded-md ml-1"
                aria-label="Preview"
                title="Preview"
              >
                <PlayIcon className={`h-4 w-4 mx-auto transition-colors ${activeTab === 'preview' ? 'text-white' : 'text-gray-400 hover:text-white'}`} />
              </button>
            </div>
          )}
          <button onClick={() => setIsCodeViewVisible(!isCodeViewVisible)} className="p-1.5 rounded-md hover:bg-white/10 hidden lg:block" aria-label={isCodeViewVisible ? "Collapse Code Panel" : "Expand Code Panel"}>
            {isCodeViewVisible ? <PanelLeftCloseIcon className="h-4 w-4 text-gray-300" /> : <PanelRightCloseIcon className="h-4 w-4 text-gray-300" />}
          </button>
          <button className="px-4 py-1.5 text-sm font-semibold rounded-md bg-white text-black flex items-center gap-2 hover:bg-gray-200 transition-colors">
            <DeployIcon className="h-4 w-4" />
            Deploy
          </button>
        </div>
      </header>
      <div className="flex-1 flex h-full overflow-hidden">
        <motion.div
          ref={chatViewRef}
          className="h-full border-r border-neutral-800"
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
            apiKeys={apiKeys}
            onModelChange={onModelChange}
            onApiKeySave={onApiKeySave}
          />
        </motion.div>
        <AnimatePresence>
          {isCodeViewVisible && (
            <>
              <div
                onMouseDown={startResizing}
                className="w-1.5 h-full cursor-col-resize bg-neutral-900 hover:bg-zinc-800 transition-colors flex-shrink-0 hidden lg:block z-10"
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