import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ChatSessionView } from './components/ChatSessionView';
import { SettingsView } from './components/SettingsView';
import { AllChatsView } from './components/AllChatsView';
import type { Message, FileNode, View, ChatSession, GenerationInfo, GenerationFile } from './types';
import { streamChatResponse, generateSuggestions } from './services/llmService';
import { SidebarIcon } from './components/icons/Icons';
import { SUPPORTED_MODELS } from './constants';

// A simple ID generator
const generateId = () => Date.now().toString() + Math.random().toString(36).substring(2);

type GeneratedFileObject = { path: string; content?: string; action: 'created' | 'modified' | 'deleted' };

function App() {
  const [view, setView] = useState<View>('new-chat');
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Model and API Key State
  const [selectedModelId, setSelectedModelId] = useState<string>(SUPPORTED_MODELS[0].id);
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      const savedKeys = localStorage.getItem('opendev-apiKeys');
      if (savedKeys) {
        setApiKeys(JSON.parse(savedKeys));
      }
      const savedModel = localStorage.getItem('opendev-selectedModelId');
      if (savedModel) {
        setSelectedModelId(savedModel);
      }
    } catch (error) {
      console.error("Failed to load settings from localStorage", error);
    }
  }, []);

  const handleModelChange = useCallback((modelId: string) => {
    setSelectedModelId(modelId);
    localStorage.setItem('opendev-selectedModelId', modelId);
  }, []);

  const handleApiKeySave = useCallback((provider: string, key: string) => {
    const newKeys = { ...apiKeys, [provider]: key };
    setApiKeys(newKeys);
    localStorage.setItem('opendev-apiKeys', JSON.stringify(newKeys));
  }, [apiKeys]);


  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, ''); // Normalize hash
      const [path, id] = hash.split('/');

      if (path === 'chat' && id) {
        setActiveSessionId(id);
        setView('chat-session');
      } else if (path === 'chats') {
        setActiveSessionId(null);
        setView('all-chats');
      } else if (path === 'settings') {
        setActiveSessionId(null);
        setView('settings');
      } else {
        setActiveSessionId(null);
        setView('new-chat');
      }
      
      setIsInitialLoad(false);
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const activeSession = sessions.find(s => s.id === activeSessionId);

  const handleNavigate = (targetView: View) => {
    switch (targetView) {
      case 'new-chat':
        window.location.hash = '/';
        break;
      case 'all-chats':
        window.location.hash = '/chats';
        break;
      case 'settings':
        window.location.hash = '/settings';
        break;
    }
  };

  const handleSelectChat = (chatId: string) => {
    window.location.hash = `/chat/${chatId}`;
  };
  
  const setActiveFileForSession = (file: FileNode | null) => {
    if (!activeSessionId) return;
    setSessions(currentSessions =>
      currentSessions.map(s => 
        s.id === activeSessionId ? { ...s, activeFile: file } : s
      )
    );
  };

  const handleFileContentChange = (filePath: string, newContent: string) => {
    if (!activeSessionId) return;
    setSessions(currentSessions =>
      currentSessions.map(s => {
        if (s.id === activeSessionId) {
          const updatedFileTree = s.fileTree.map(f => 
            f.path === filePath ? { ...f, content: newContent } : f
          );
          
          const newActiveFile = s.activeFile?.path === filePath 
            ? { ...s.activeFile, content: newContent } 
            : s.activeFile;

          return { ...s, fileTree: updatedFileTree, activeFile: newActiveFile };
        }
        return s;
      })
    );
  };

    const handleDeleteSession = (sessionId: string) => {
        setSessions(currentSessions => currentSessions.filter(s => s.id !== sessionId));
        if (activeSessionId === sessionId) {
            handleNavigate('new-chat');
        }
    };

    const handleAddFileOrFolder = (path: string, type: 'file' | 'folder') => {
        if (!activeSessionId) return;

        if (!path.trim() || /[\\?%*:|"<>]/g.test(path)) {
            alert("Invalid file or folder name.");
            return;
        }

        setSessions(currentSessions => currentSessions.map(s => {
            if (s.id === activeSessionId) {
                if (type === 'file') {
                    if (s.fileTree.some(f => f.path === path)) {
                        alert(`File "${path}" already exists.`);
                        return s;
                    }
                    const newFile: FileNode = { path, content: '' };
                    const newFileTree = [...s.fileTree, newFile];
                    return { ...s, fileTree: newFileTree, activeFile: newFile };
                } else { // folder
                    const folderPath = path.endsWith('/') ? path : path + '/';
                    if (s.fileTree.some(f => f.path.startsWith(folderPath) || f.path === path)) {
                        alert(`A folder or file with the name "${path}" already exists.`);
                        return s;
                    }
                    // Use a placeholder file to represent an empty folder
                    const placeholderFile: FileNode = { path: `${folderPath}.keep`, content: '' };
                    const newFileTree = [...s.fileTree, placeholderFile];
                    return { ...s, fileTree: newFileTree };
                }
            }
            return s;
        }));
    };

    const handleDeleteFileOrFolder = (path: string, isFile: boolean) => {
        if (!activeSessionId) return;
        if (!window.confirm(`Are you sure you want to delete "${path}"? This cannot be undone.`)) return;

        setSessions(currentSessions => currentSessions.map(s => {
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

        if (!newPath.trim() || /[\\?%*:|"<>]/g.test(newPath)) {
            alert("Invalid new name.");
            return;
        }

        setSessions(currentSessions => currentSessions.map(s => {
            if (s.id === activeSessionId) {
                const newFileTree = s.fileTree.map(f => {
                    if (isFile) {
                        return f.path === oldPath ? { ...f, path: newPath } : f;
                    } else {
                        const folderPrefix = oldPath.endsWith('/') ? oldPath : oldPath + '/';
                        if (f.path.startsWith(folderPrefix)) {
                            return { ...f, path: f.path.replace(folderPrefix, newPath + '/') };
                        }
                        return f;
                    }
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
        setSessions(prevSessions => prevSessions.map(s => 
            s.id === currentSessionId ? { ...s, suggestions: [] } : s
        ));
    }

    let history: Message[] = [];
    let currentFileTree: FileNode[] = [];
    const userMessage: Message = { id: Date.now(), role: 'user', content: prompt };
    const tarsMessageId = Date.now() + 1;
    const tarsPlaceholder: Message = { 
        id: tarsMessageId, 
        role: 'tars', 
        content: '', // Initially empty, will show "Thinking..." via component logic
        generationInfo: {
            status: 'generating',
            files: [],
        },
    };

    if (!currentSessionId) {
        newSessionCreated = true;
        const newId = generateId();
        const newSession: ChatSession = {
            id: newId,
            title: prompt.length > 25 ? prompt.substring(0, 22) + '...' : prompt,
            messages: [userMessage, tarsPlaceholder],
            fileTree: [],
            activeFile: null,
            lastUpdated: Date.now(),
        };
        setSessions(currentSessions => [newSession, ...currentSessions]);
        setActiveSessionId(newId);
        currentSessionId = newId; // Important: set currentSessionId for this scope
        history = [];
        currentFileTree = [];
    } else {
        const session = sessions.find(s => s.id === currentSessionId);
        if (session) {
            history = session.messages;
            currentFileTree = session.fileTree;
        }
         setSessions(prevSessions => prevSessions.map(s => {
            if (s.id === currentSessionId) {
                return { ...s, messages: [...s.messages, userMessage, tarsPlaceholder], lastUpdated: Date.now() };
            }
            return s;
        }));
    }

     // Must navigate after state has been updated to ensure the view can find the session
    if (newSessionCreated) {
        setView('chat-session');
        window.location.hash = `#/chat/${currentSessionId}`;
    }
    
    try {
        const currentModel = SUPPORTED_MODELS.find(m => m.id === selectedModelId);
        const apiKey = currentModel ? apiKeys[currentModel.provider] : undefined;
        let fullResponse = '';
        let conversationText = '';

        const stream = streamChatResponse(prompt, history, currentFileTree, selectedModelId, apiKey);

        for await (const chunk of stream) {
            fullResponse += chunk.text;

            // Heuristic to stream conversational part before full JSON is valid
            const conversationMatch = fullResponse.match(/"conversation"\s*:\s*"((?:\\.|[^"\\])*)/);
            if (conversationMatch && conversationMatch[1]) {
                const newConversationText = conversationMatch[1]
                    .replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\t/g, '\t').replace(/\\\\/g, '\\');

                if (newConversationText !== conversationText) {
                    conversationText = newConversationText;
                    setSessions(prev => prev.map(s => s.id === currentSessionId ? { ...s, messages: s.messages.map(m => m.id === tarsMessageId ? { ...m, content: conversationText } : m) } : s));
                }
            } else if (!conversationText && !fullResponse.includes('"conversation"')) {
                // If it's not looking like JSON, it could be an error message. Show it directly.
                setSessions(prev => prev.map(s => s.id === currentSessionId ? { ...s, messages: s.messages.map(m => m.id === tarsMessageId ? { ...m, content: fullResponse } : m) } : s));
            }
        }
        
        // Process the complete response
        let generatedFileObjects: GeneratedFileObject[] = [];
        let finalConversationalPart = "Sorry, I encountered an issue generating a response.";

        if (fullResponse) {
             let jsonString = '';
            const jsonMatch = fullResponse.match(/```json\n([\s\S]*?)\n```/);

            if (jsonMatch && jsonMatch[1]) {
                jsonString = jsonMatch[1];
            } else {
                 const firstBrace = fullResponse.indexOf('{');
                 const lastBrace = fullResponse.lastIndexOf('}');
                 if (firstBrace !== -1 && lastBrace > firstBrace) {
                     jsonString = fullResponse.substring(firstBrace, lastBrace + 1);
                 }
            }

            if (jsonString) {
                try {
                    const parsed = JSON.parse(jsonString);
                    finalConversationalPart = parsed.conversation || "(TARS did not provide a conversational response.)";
                    if (parsed.files && Array.isArray(parsed.files)) {
                        generatedFileObjects = parsed.files.filter(f => f.path && f.action);
                    }
                } catch (e) {
                    console.error("Failed to parse final JSON from response", e);
                    finalConversationalPart = "I tried to generate a response, but it wasn't in the correct format. The raw response is shown below.";
                    setSessions(prev => prev.map(s => s.id === currentSessionId ? { ...s, messages: s.messages.map(m => m.id === tarsMessageId ? { ...m, content: fullResponse } : m) } : s));
                }
            } else {
                console.warn("No valid JSON found in the final response. Treating as pure conversation.");
                finalConversationalPart = fullResponse;
            }
        }
        
        // Update the TARS message with the FINAL conversational part and file changes list
        setSessions(prev => prev.map(s => {
            if (s.id === currentSessionId) {
                 const finalGenerationFiles: GenerationFile[] = generatedFileObjects.map(f => ({
                    path: f.path,
                    action: f.action,
                    status: 'generating',
                }));
                const messages = s.messages.map(msg => {
                     if (msg.id === tarsMessageId) {
                        return { 
                            ...msg, 
                            content: finalConversationalPart,
                            generationInfo: {
                                status: 'generating' as const,
                                files: finalGenerationFiles,
                            },
                        };
                    }
                    return msg;
                });
                return { ...s, messages };
            }
            return s;
        }));
        
        // Apply file changes and animate status sequentially
        for (const file of generatedFileObjects) {
            if (file.action === 'created' || file.action === 'modified') {
                setSessions(prev => prev.map(s => {
                    if (s.id !== currentSessionId) return s;

                    const fileExists = s.fileTree.some(f => f.path === file.path);
                    const updatedFile: FileNode = { path: file.path, content: file.content || '' };
                    
                    const newFileTree = fileExists 
                        ? s.fileTree.map(f => f.path === file.path ? updatedFile : f)
                        : [...s.fileTree, updatedFile];

                    // Set the last processed file as the active one for immediate feedback.
                    const newActiveFile = updatedFile;

                    return { ...s, fileTree: newFileTree, activeFile: newActiveFile };
                }));
            
            } else if (file.action === 'deleted') {
                setSessions(prev => prev.map(s => {
                    if (s.id !== currentSessionId) return s;
                    const newFileTree = s.fileTree.filter(f => f.path !== file.path);
                    const newActiveFile = (s.activeFile?.path === file.path) ? null : s.activeFile;
                    return { ...s, fileTree: newFileTree, activeFile: newActiveFile };
                }));
            }
            
            // A short delay for visual pacing of the status checkmarks
            await new Promise(r => setTimeout(r, 200));

            setSessions(prev => prev.map(s => {
                if (s.id !== currentSessionId) return s;
                const messages = s.messages.map(msg => {
                    if (msg.id === tarsMessageId && msg.generationInfo) {
                        const files = msg.generationInfo.files.map(f => 
                            f.path === file.path ? { ...f, status: 'complete' as const } : f
                        );
                        return { ...msg, generationInfo: { ...msg.generationInfo, files } };
                    }
                    return msg;
                });
                return { ...s, messages };
            }));
        }

        // After all files are processed, if the active file was deleted, select a new one.
        setSessions(prev => prev.map(s => {
            if (s.id === currentSessionId && !s.activeFile && s.fileTree.length > 0) {
                const preferredFile = s.fileTree.find(f => /index\.(tsx|jsx)$/.test(f.path)) || s.fileTree[0];
                return { ...s, activeFile: preferredFile };
            }
            return s;
        }));

        setSessions(prevSessions => prevSessions.map(s => {
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
            const lastUserPrompt = prompt;
            const generatedFilePaths = generatedFileObjects.map(f => f.path);
            const suggestionContext = `Based on the user's request to "${lastUserPrompt}", I have generated or modified the following files: ${generatedFilePaths.join(', ')}.`;
            const newSuggestions = await generateSuggestions(suggestionContext);
            
            setSessions(prevSessions => prevSessions.map(s => {
                if (s.id === currentSessionId) {
                    return { ...s, suggestions: newSuggestions };
                }
                return s;
            }));
        }

    } catch (error) {
        console.error("Error streaming chat response:", error);
        setSessions(prevSessions => prevSessions.map(s => {
            if (s.id === currentSessionId) {
                const messages = s.messages.map(m => m.id === tarsMessageId ? {...m, content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}`} : m);
                return {...s, messages};
            }
            return s;
        }));
    } finally {
        setIsThinking(false);
    }
  };
  
  if (isInitialLoad) {
      return null; 
  }

  const commonProps = {
    isThinking,
    onSendMessage: handleSendMessage,
    selectedModelId,
    apiKeys,
    onModelChange: handleModelChange,
    onApiKeySave: handleApiKeySave,
  };

  if (view === 'new-chat' && !activeSessionId) {
    return <WelcomeScreen {...commonProps} />;
  }

  return (
    <div className="flex h-screen text-gray-200">
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
        {!isSidebarOpen && view !== 'new-chat' && (
           <button 
            onClick={() => setIsSidebarOpen(true)} 
            className="absolute top-3 left-3 z-20 p-2 rounded-md bg-neutral-800/50 hover:bg-neutral-700/80 backdrop-blur-sm transition-colors"
            aria-label="Open sidebar"
          >
            <SidebarIcon className="h-5 w-5 text-white" />
          </button>
        )}
        <div key={view + activeSessionId} className="view-container h-full">
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
             {view === 'new-chat' && !activeSessionId && (
              <WelcomeScreen {...commonProps} />
            )}
            {view === 'chat-session' && !activeSession && !isInitialLoad && (
                 <div className="p-8 text-white flex flex-col items-center justify-center h-full text-center">
                    <h1 className="text-2xl font-bold mb-2">Chat session not found</h1>
                    <p className="text-gray-400 mb-6">The chat you are looking for does not exist or has not been loaded.</p>
                     <button onClick={() => handleNavigate('new-chat')} className="px-4 py-2 text-sm font-medium bg-white text-black rounded-lg hover:bg-gray-200 transition-colors">
                        Start New Chat
                    </button>
                </div>
            )}
            {view === 'all-chats' && <AllChatsView sessions={sessions} onSelectChat={handleSelectChat} onDeleteSession={handleDeleteSession} onNavigate={handleNavigate} />}
            {view === 'settings' && <SettingsView />}
        </div>
      </main>
    </div>
  );
}

export default App;