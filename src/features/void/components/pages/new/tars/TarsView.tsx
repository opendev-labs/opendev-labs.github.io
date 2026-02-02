import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ChatSessionView } from './components/ChatSessionView';
import { SettingsView } from './components/SettingsView';
import { AllChatsView } from './components/AllChatsView';
import type { Message, FileNode, TarsView as View, ChatSession, GenerationInfo, GenerationFile } from '../../../../types';
import { streamChatResponse, generateSuggestions } from '../../../../services/llmService';
import { SidebarIcon } from './components/icons/Icons';
import { SUPPORTED_MODELS } from '../../../../constants';

const generateId = () => Date.now().toString() + Math.random().toString(36).substring(2);

type GeneratedFileObject = { path: string; content?: string; action: 'created' | 'modified' | 'deleted' };

export default function TarsView() {
    const [view, setView] = useState<View>('new-chat');
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
    const [isThinking, setIsThinking] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Model and API Key State
    const [selectedModelId, setSelectedModelId] = useState<string>(SUPPORTED_MODELS[0].id);
    const [apiKeys, setApiKeys] = useState<Record<string, string>>({});

    // 1. Load Initial State
    useEffect(() => {
        try {
            const savedKeys = localStorage.getItem('opendev-apiKeys');
            if (savedKeys) setApiKeys(JSON.parse(savedKeys));

            const savedModel = localStorage.getItem('opendev-selectedModelId');
            if (savedModel) setSelectedModelId(savedModel);

            const savedSessions = localStorage.getItem('opendev-tars-sessions');
            if (savedSessions) {
                const parsed = JSON.parse(savedSessions);
                // Simple validation: must be array
                if (Array.isArray(parsed)) setSessions(parsed);
            }
        } catch (error) {
            console.error("Neural handshake: state recovery failed", error);
        }
    }, []);

    // 2. Persist State Changes
    useEffect(() => {
        localStorage.setItem('opendev-tars-sessions', JSON.stringify(sessions));
    }, [sessions]);

    const handleModelChange = useCallback((modelId: string) => {
        setSelectedModelId(modelId);
        localStorage.setItem('opendev-selectedModelId', modelId);
    }, []);

    const handleApiKeySave = useCallback((provider: string, key: string) => {
        const newKeys = { ...apiKeys, [provider]: key };
        setApiKeys(newKeys);
        localStorage.setItem('opendev-apiKeys', JSON.stringify(newKeys));
    }, [apiKeys]);

    const activeSession = useMemo(() => sessions.find(s => s.id === activeSessionId), [sessions, activeSessionId]);

    const handleNavigate = (targetView: View) => {
        setView(targetView);
        if (targetView !== 'chat-session') {
            setActiveSessionId(null);
        }
    };

    const handleSelectChat = (chatId: string) => {
        setActiveSessionId(chatId);
        setView('chat-session');
    };

    const setActiveFileForSession = (file: FileNode | null) => {
        if (!activeSessionId) return;
        setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, activeFile: file } : s));
    };

    const handleFileContentChange = (filePath: string, newContent: string) => {
        if (!activeSessionId) return;
        setSessions(prev =>
            prev.map(s => {
                if (s.id === activeSessionId) {
                    const updatedFileTree = s.fileTree.map(f => f.path === filePath ? { ...f, content: newContent } : f);
                    const newActiveFile = s.activeFile?.path === filePath ? { ...s.activeFile, content: newContent } : s.activeFile;
                    return { ...s, fileTree: updatedFileTree, activeFile: newActiveFile };
                }
                return s;
            })
        );
    };

    const handleDeleteSession = (sessionId: string) => {
        setSessions(prev => prev.filter(s => s.id !== sessionId));
        if (activeSessionId === sessionId) {
            handleNavigate('new-chat');
        }
    };

    const handleAddFileOrFolder = (path: string, type: 'file' | 'folder') => {
        if (!activeSessionId) return;
        setSessions(prev => prev.map(s => {
            if (s.id === activeSessionId) {
                if (type === 'file') {
                    if (s.fileTree.some(f => f.path === path)) return s;
                    const newFile: FileNode = { path, content: '' };
                    return { ...s, fileTree: [...s.fileTree, newFile], activeFile: newFile };
                } else {
                    const folderPath = path.endsWith('/') ? path : path + '/';
                    if (s.fileTree.some(f => f.path.startsWith(folderPath))) return s;
                    const placeholderFile: FileNode = { path: `${folderPath}.keep`, content: '' };
                    return { ...s, fileTree: [...s.fileTree, placeholderFile] };
                }
            }
            return s;
        }));
    };

    const handleDeleteFileOrFolder = (path: string, isFile: boolean) => {
        if (!activeSessionId) return;
        setSessions(prev => prev.map(s => {
            if (s.id === activeSessionId) {
                const folderPrefix = path.endsWith('/') ? path : path + '/';
                const newFileTree = s.fileTree.filter(f => isFile ? f.path !== path : !f.path.startsWith(folderPrefix));
                let newActiveFile = s.activeFile;
                if (newActiveFile && (isFile ? newActiveFile.path === path : newActiveFile.path.startsWith(folderPrefix))) {
                    newActiveFile = null;
                }
                return { ...s, fileTree: newFileTree, activeFile: newActiveFile };
            }
            return s;
        }));
    };

    const handleRenameFileOrFolder = (oldPath: string, newPath: string, isFile: boolean) => {
        if (!activeSessionId || oldPath === newPath) return;
        setSessions(prev => prev.map(s => {
            if (s.id === activeSessionId) {
                const newFileTree = s.fileTree.map(f => {
                    if (isFile) return f.path === oldPath ? { ...f, path: newPath } : f;
                    const folderPrefix = oldPath.endsWith('/') ? oldPath : oldPath + '/';
                    if (f.path.startsWith(folderPrefix)) {
                        return { ...f, path: f.path.replace(folderPrefix, newPath + '/') };
                    }
                    return f;
                });
                let newActiveFile = s.activeFile;
                if (newActiveFile) {
                    if (isFile && newActiveFile.path === oldPath) {
                        newActiveFile = { ...newActiveFile, path: newPath };
                    } else if (!isFile && newActiveFile.path.startsWith(oldPath + '/')) {
                        const folderPrefix = oldPath.endsWith('/') ? oldPath : oldPath + '/';
                        newActiveFile = { ...newActiveFile, path: newActiveFile.path.replace(folderPrefix, newPath + '/') };
                    }
                }
                return { ...s, fileTree: newFileTree, activeFile: newActiveFile };
            }
            return s;
        }));
    };

    const handleSendMessage = async (prompt: string) => {
        setIsThinking(true);
        let currentSessionId = activeSessionId;
        let newSessionCreated = false;

        if (currentSessionId) {
            setSessions(prev => prev.map(s => s.id === currentSessionId ? { ...s, suggestions: [] } : s));
        }

        let history: Message[] = [];
        let currentFileTree: FileNode[] = [];
        const userMessage: Message = { id: Date.now(), role: 'user', content: prompt };
        const tarsMessageId = Date.now() + 1;
        const tarsPlaceholder: Message = {
            id: tarsMessageId,
            role: 'tars',
            content: '',
            generationInfo: { status: 'generating', files: [] },
        };

        if (!currentSessionId) {
            newSessionCreated = true;
            const newId = generateId();
            const newSession: ChatSession = {
                id: newId,
                title: prompt.length > 30 ? prompt.substring(0, 27) + '...' : prompt,
                messages: [userMessage, tarsPlaceholder],
                fileTree: [],
                activeFile: null,
                lastUpdated: Date.now(),
            };
            setSessions(prev => [newSession, ...prev]);
            setActiveSessionId(newId);
            currentSessionId = newId;
        } else {
            const session = sessions.find(s => s.id === currentSessionId);
            if (session) {
                history = session.messages;
                currentFileTree = session.fileTree;
            }
            setSessions(prev => prev.map(s => {
                if (s.id === currentSessionId) {
                    return { ...s, messages: [...s.messages, userMessage, tarsPlaceholder], lastUpdated: Date.now() };
                }
                return s;
            }));
        }

        if (newSessionCreated) setView('chat-session');

        try {
            const currentModel = SUPPORTED_MODELS.find(m => m.id === selectedModelId);
            const apiKey = currentModel ? apiKeys[currentModel.provider] : undefined;
            let fullResponse = '';
            let conversationText = '';

            const stream = streamChatResponse(prompt, history, currentFileTree, selectedModelId, apiKey);

            for await (const chunk of stream) {
                fullResponse += chunk.text;
                const conversationMatch = fullResponse.match(/"conversation"\s*:\s*"((?:\\.|[^"\\])*)/);
                if (conversationMatch && conversationMatch[1]) {
                    const newConversationText = conversationMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
                    if (newConversationText !== conversationText) {
                        conversationText = newConversationText;
                        setSessions(prev => prev.map(s => s.id === currentSessionId ? { ...s, messages: s.messages.map(m => m.id === tarsMessageId ? { ...m, content: conversationText } : m) } : s));
                    }
                } else if (!conversationText && !fullResponse.includes('"conversation"')) {
                    setSessions(prev => prev.map(s => s.id === currentSessionId ? { ...s, messages: s.messages.map(m => m.id === tarsMessageId ? { ...m, content: fullResponse } : m) } : s));
                }
            }

            let generatedFileObjects: GeneratedFileObject[] = [];
            let finalConversationalPart = "Neural node timeout: Response incomplete.";
            let finalIntentAnalysis = "";
            let finalCommands: string[] = [];

            if (fullResponse) {
                let jsonString = '';
                const jsonMatch = fullResponse.match(/```json\n([\s\S]*?)\n```/);
                if (jsonMatch && jsonMatch[1]) jsonString = jsonMatch[1];
                else {
                    const firstBrace = fullResponse.indexOf('{');
                    const lastBrace = fullResponse.lastIndexOf('}');
                    if (firstBrace !== -1 && lastBrace > firstBrace) jsonString = fullResponse.substring(firstBrace, lastBrace + 1);
                }

                if (jsonString) {
                    try {
                        const parsed = JSON.parse(jsonString);
                        finalConversationalPart = parsed.conversation || "(Tactical dialogue suppressed.)";
                        finalIntentAnalysis = parsed.intent_analysis || "";
                        finalCommands = parsed.commands || [];
                        if (parsed.files && Array.isArray(parsed.files)) {
                            generatedFileObjects = parsed.files.filter((f: any) => f.path && f.action);
                        }
                    } catch (e) {
                        console.error("JSON parse failure in neural stream", e);
                        finalConversationalPart = fullResponse;
                    }
                } else {
                    finalConversationalPart = fullResponse;
                }
            }

            setSessions(prev => prev.map(s => {
                if (s.id !== currentSessionId) return s;
                const finalGenerationFiles: GenerationFile[] = generatedFileObjects.map(f => ({ path: f.path, action: f.action, status: 'generating' }));
                const messages = s.messages.map(msg => {
                    if (msg.id === tarsMessageId) {
                        return { ...msg, content: finalConversationalPart, intentAnalysis: finalIntentAnalysis, commands: finalCommands, generationInfo: { status: 'generating' as const, files: finalGenerationFiles } };
                    }
                    return msg;
                });
                return { ...s, messages };
            }));

            for (const file of generatedFileObjects) {
                if (file.action === 'created' || file.action === 'modified') {
                    setSessions(prev => prev.map(s => {
                        if (s.id !== currentSessionId) return s;
                        const fileExists = s.fileTree.some(f => f.path === file.path);
                        const updatedFile: FileNode = { path: file.path, content: file.content || '' };
                        const newFileTree = fileExists ? s.fileTree.map(f => f.path === file.path ? updatedFile : f) : [...s.fileTree, updatedFile];
                        return { ...s, fileTree: newFileTree, activeFile: updatedFile };
                    }));
                } else if (file.action === 'deleted') {
                    setSessions(prev => prev.map(s => {
                        if (s.id !== currentSessionId) return s;
                        const newFileTree = s.fileTree.filter(f => f.path !== file.path);
                        return { ...s, fileTree: newFileTree, activeFile: s.activeFile?.path === file.path ? null : s.activeFile };
                    }));
                }

                await new Promise(r => setTimeout(r, 150));

                setSessions(prev => prev.map(s => {
                    if (s.id !== currentSessionId) return s;
                    const messages = s.messages.map(msg => {
                        if (msg.id === tarsMessageId && msg.generationInfo) {
                            const files = msg.generationInfo.files.map(f => f.path === file.path ? { ...f, status: 'complete' as const } : f);
                            return { ...msg, generationInfo: { ...msg.generationInfo, files } };
                        }
                        return msg;
                    });
                    return { ...s, messages };
                }));
            }

            setSessions(prev => prev.map(s => {
                if (s.id === currentSessionId && !s.activeFile && s.fileTree.length > 0) {
                    return { ...s, activeFile: s.fileTree.find(f => /\.(tsx|jsx|html)$/.test(f.path)) || s.fileTree[0] };
                }
                if (s.id === currentSessionId) {
                    const messages = s.messages.map(msg => {
                        if (msg.id === tarsMessageId && msg.generationInfo) {
                            return { ...msg, generationInfo: { ...msg.generationInfo, status: 'complete' as const } };
                        }
                        return msg;
                    });
                    return { ...s, messages };
                }
                return s;
            }));

            if (generatedFileObjects.length > 0) {
                const newSuggestions = await generateSuggestions(`Request: "${prompt}" - Operations: ${generatedFileObjects.map(f => f.path).join(', ')}`);
                setSessions(prev => prev.map(s => s.id === currentSessionId ? { ...s, suggestions: newSuggestions } : s));
            }

        } catch (error) {
            console.error("Neural stream failure:", error);
            setSessions(prev => prev.map(s => s.id === currentSessionId ? { ...s, messages: s.messages.map(m => m.id === tarsMessageId ? { ...m, content: `Protocol Error: ${error instanceof Error ? error.message : 'Unknown'}` } : m) } : s));
        } finally {
            setIsThinking(false);
        }
    };

    const commonProps = {
        isThinking,
        onSendMessage: handleSendMessage,
        selectedModelId,
        apiKeys,
        onModelChange: handleModelChange,
        onApiKeySave: handleApiKeySave,
    };

    return (
        <div className="flex h-screen bg-black text-white font-sans overflow-hidden">
            {isSidebarOpen && (
                <Sidebar
                    onNavigate={handleNavigate}
                    recentChats={sessions}
                    onSelectChat={handleSelectChat}
                    onDeleteSession={handleDeleteSession}
                    activeView={view}
                    activeChatId={activeSessionId}
                    onToggle={() => setIsSidebarOpen(false)}
                />
            )}
            <main className="flex-1 flex flex-col overflow-hidden relative">
                {!isSidebarOpen && (
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="absolute top-4 left-4 z-20 p-2 rounded-lg bg-[#121212]/80 border border-white/5 hover:bg-neutral-800 backdrop-blur-md transition-all active:scale-95"
                    >
                        <SidebarIcon className="h-5 w-5 text-gray-300" />
                    </button>
                )}
                <div className="flex-1 h-full">
                    {view === 'new-chat' && <WelcomeScreen {...commonProps} />}
                    {view === 'chat-session' && activeSession && (
                        <ChatSessionView
                            session={activeSession}
                            {...commonProps}
                            setActiveFile={setActiveFileForSession}
                            onFileContentChange={handleFileContentChange}
                            onAddFileOrFolder={handleAddFileOrFolder}
                            onDeleteFileOrFolder={handleDeleteFileOrFolder}
                            onRenameFileOrFolder={handleRenameFileOrFolder}
                        />
                    )}
                    {view === 'all-chats' && <AllChatsView sessions={sessions} onSelectChat={handleSelectChat} onDeleteSession={handleDeleteSession} onNavigate={handleNavigate} />}
                    {view === 'settings' && <SettingsView />}

                    {view === 'chat-session' && !activeSession && (
                        <div className="flex flex-col items-center justify-center h-full text-center p-8">
                            <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-6">
                                <SidebarIcon className="w-8 h-8 text-neutral-700" />
                            </div>
                            <h2 className="text-xl font-bold text-white mb-2">Neural Session Missing</h2>
                            <p className="text-neutral-500 mb-8 max-w-sm">The requested session has been purged or is unreachable in the current context.</p>
                            <button onClick={() => handleNavigate('new-chat')} className="px-6 py-2 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-all">
                                INITIALIZE NEW PROTOCOL
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
