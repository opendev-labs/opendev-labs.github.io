import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { ChatSession, FileNode, GenerationInfo, Sub0View as View } from '../../../../../types';
import { ChatView } from './ChatView';
import { CodeView } from './CodeView';
import { PanelLeftCloseIcon, PanelRightCloseIcon, CodeIcon, PlayIcon, SearchIcon as DeployIcon } from './icons/Icons';

interface ChatSessionViewProps {
    session: ChatSession;
    isThinking: boolean;
    onSendMessage: (prompt: string) => void;
    setActiveFile: (file: FileNode | null) => void;
    onFileContentChange: (path: string, content: string) => void;
    onAddFileOrFolder: (path: string, type: 'file' | 'folder') => void;
    onDeleteFileOrFolder: (path: string, isFile: boolean) => void;
    onRenameFileOrFolder: (oldPath: string, newPath: string, isFile: boolean) => void;
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
            return window.innerWidth * 0.45;
        }
        return 600;
    });
    const chatViewRef = useRef<HTMLDivElement>(null);
    const prevIsThinking = useRef(isThinking);

    useEffect(() => {
        if (isThinking) {
            setActiveTab('code');
        }
        else if (prevIsThinking.current && !isThinking) {
            if (generationInfo?.files && generationInfo.files.length > 0) {
                setActiveTab('preview');
            }
        }
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
        <div className="flex flex-col h-full bg-[#0A0A0A]">
            <header className="flex-shrink-0 flex items-center justify-between p-3 border-b border-neutral-800 bg-black/50 backdrop-blur-md">
                <div className="flex items-center gap-3 px-3">
                    <h2 className="text-sm font-semibold text-neutral-200 truncate tracking-tight">{session.title}</h2>
                </div>
                <div className="flex items-center gap-4">
                    {isCodeViewVisible && (
                        <div className="relative flex items-center bg-neutral-900 border border-white/5 p-1 rounded-lg">
                            <div
                                className="absolute top-1 bottom-1 w-8 bg-neutral-800 rounded-md transition-transform duration-300 ease-in-out"
                                style={{ transform: activeTab === 'preview' ? 'translateX(36px)' : 'translateX(0px)' }}
                            />
                            <button
                                onClick={() => setActiveTab('code')}
                                className="relative z-10 p-1.5 h-8 w-8 rounded-md"
                                title="Neural Code"
                            >
                                <CodeIcon className={`h-4 w-4 mx-auto transition-colors ${activeTab === 'code' ? 'text-white' : 'text-neutral-500 hover:text-white'}`} />
                            </button>
                            <button
                                onClick={() => setActiveTab('preview')}
                                className="relative z-10 p-1.5 h-8 w-8 rounded-md ml-1"
                                title="Live Execution"
                            >
                                <PlayIcon className={`h-4 w-4 mx-auto transition-colors ${activeTab === 'preview' ? 'text-white' : 'text-neutral-500 hover:text-white'}`} />
                            </button>
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        <button onClick={() => setIsCodeViewVisible(!isCodeViewVisible)} className="p-1.5 rounded-md hover:bg-neutral-800 transition-colors hidden lg:block" title={isCodeViewVisible ? "Collapse Fragments" : "Expand Fragments"}>
                            {isCodeViewVisible ? <PanelLeftCloseIcon className="h-4 w-4 text-neutral-400" /> : <PanelRightCloseIcon className="h-4 w-4 text-neutral-400" />}
                        </button>
                        <div className="h-6 border-r border-neutral-800 mx-1 hidden lg:block"></div>
                        <button className="px-4 py-1.5 text-[12px] font-bold rounded-lg bg-white text-black flex items-center gap-2 hover:bg-neutral-200 transition-all active:scale-95">
                            <DeployIcon className="h-3.5 w-3.5" />
                            DEPLOY
                        </button>
                    </div>
                </div>
            </header>
            <div className="flex-1 flex h-full overflow-hidden">
                <div
                    ref={chatViewRef}
                    className="h-full border-r border-neutral-800/50"
                    style={{ width: isCodeViewVisible ? `${chatPanelWidth}px` : '100%' }}
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
                </div>
                {isCodeViewVisible && (
                    <>
                        <div
                            onMouseDown={startResizing}
                            className="w-px h-full cursor-col-resize bg-neutral-800 hover:bg-white/20 transition-colors flex-shrink-0 hidden lg:block"
                        />
                        <div className="flex-1 h-full overflow-hidden">
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
                    </>
                )}
            </div>
        </div>
    );
}
