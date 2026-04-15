import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ChatSessionView } from './components/ChatSessionView';
import { SettingsView } from './components/SettingsView';
import { AllChatsView } from './components/AllChatsView';
import type { Message, FileNode, View, ChatSession, GenerationInfo, GenerationFile } from './types';
import { streamChatResponse, generateSuggestions } from './services/llmService';
import { SidebarIcon } from './components/icons/Icons';
import { SUPPORTED_MODELS } from './constants';
import { LamaDBOfficeCockpit, UnifiedOfficeCockpit } from '../../pages/OfficeSubappWrappers';
import { hubService } from '../../services/hubService';
import { useAuth } from '../void/hooks/useAuth';
import { ShareIcon } from './components/icons/Icons';
import { toast } from 'sonner';
import { LamaDB } from '../../lib/lamaDB';

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
  const [isSaving, setIsSaving] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Model State
  const [selectedModelId, setSelectedModelId] = useState<string>(SUPPORTED_MODELS[0].id);

  useEffect(() => {
    try {
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


  const { user, profile } = useAuth();

  // ----- SESSION PERSISTENCE: Load from LamaDB on mount -----
  useEffect(() => {
    if (!user) return;
    const loadSessions = async () => {
      try {
        const userContext = { uid: user.uid, email: user.email };
        const saved = await (LamaDB as any).store.collection('openstudio_sessions', userContext).get();
        if (saved && Array.isArray(saved) && saved.length > 0) {
          const restored: ChatSession[] = saved.map((s: any) => ({
            id: s.sessionId || s.id,
            title: s.title || 'Untitled',
            messages: s.messages ? (typeof s.messages === 'string' ? JSON.parse(s.messages) : s.messages) : [],
            fileTree: s.files ? (typeof s.files === 'string' ? JSON.parse(s.files) : s.files) : [],
            activeFile: null,
            suggestions: [],
            lastUpdated: s.updatedAt ? new Date(s.updatedAt).getTime() : Date.now(),
          }));
          setSessions(prev => {
            // Merge: keep in-memory sessions that aren't in DB yet
            const dbIds = new Set(restored.map(r => r.id));
            const keepExisting = prev.filter(p => !dbIds.has(p.id));
            return [...restored.sort((a, b) => b.lastUpdated - a.lastUpdated), ...keepExisting];
          });
          console.log(`✅ OpenStudio: Restored ${restored.length} sessions from LamaDB.`);
        }
      } catch (e) {
        console.error('Failed to load sessions from LamaDB:', e);
      }
    };
    loadSessions();
  }, [user?.uid]);

  // ----- SESSION PERSISTENCE: Auto-save active session (debounced 3s) -----
  useEffect(() => {
    if (!user || !activeSessionId || isThinking) return;
    const session = sessions.find(s => s.id === activeSessionId);
    if (!session || session.messages.length === 0) return;

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

    saveTimerRef.current = setTimeout(async () => {
      setIsSaving(true);
      try {
        const userContext = { uid: user.uid, email: user.email };
        const payload = {
          sessionId: session.id,
          userId: user.uid,
          title: session.title,
          messages: JSON.stringify(session.messages),
          files: JSON.stringify(session.fileTree),
          createdAt: new Date(session.lastUpdated).toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // Try to update existing, or create new
        const existing = await (LamaDB as any).store.collection('openstudio_sessions', userContext).get();
        const match = existing?.find((s: any) => s.sessionId === session.id);

        if (match) {
          await (LamaDB as any).store.collection('openstudio_sessions', userContext).update(match.id, payload);
        } else {
          await (LamaDB as any).store.collection('openstudio_sessions', userContext).add(payload);
        }
        console.log('💾 OpenStudio: Session saved.');
      } catch (e) {
        console.error('Failed to save session:', e);
      } finally {
        setIsSaving(false);
      }
    }, 3000);

    return () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current); };
  }, [sessions, activeSessionId, user?.uid, isThinking]);

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
      } else if (path === 'storage') {
        setActiveSessionId(null);
        setView('storage');
      } else if (path === 'deploy') {
        setActiveSessionId(null);
        setView('deploy');
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
      case 'storage':
        window.location.hash = '/storage';
        break;
      case 'deploy':
        window.location.hash = '/deploy';
        break;
    }
  };

  const handleShareToHub = async () => {
    if (!activeSession || !user) return;
    
    try {
      const content = `Node Project: ${activeSession.title}\n\nBuilt with OpenStudio. Contains ${activeSession.fileTree.length} materialized assets.`;
      const title = activeSession.title;
      
      await hubService.shareToHub(user, profile, content, title);
      toast.success("Build shared to OpenHub feed!");
    } catch (error) {
      toast.error("Failed to share build.");
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
    const openStudioMessageId = Date.now() + 1;
    const openStudioPlaceholder: Message = {
      id: openStudioMessageId,
      role: 'open-studio',
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
        messages: [userMessage, openStudioPlaceholder],
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
          return { ...s, messages: [...s.messages, userMessage, openStudioPlaceholder], lastUpdated: Date.now() };
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
      let fullResponse = '';
      let conversationText = '';

      const stream = streamChatResponse(prompt, history, currentFileTree, selectedModelId, profile);

      for await (const chunk of stream) {
        fullResponse += chunk.text;

        // Heuristic to stream conversational part before full JSON is valid
        const conversationMatch = fullResponse.match(/"conversation"\s*:\s*"((?:\\.|[^"\\])*)/);
        if (conversationMatch && conversationMatch[1]) {
          const newConversationText = conversationMatch[1]
            .replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\t/g, '\t').replace(/\\\\/g, '\\');

          if (newConversationText !== conversationText) {
            conversationText = newConversationText;
            setSessions(prev => prev.map(s => s.id === currentSessionId ? { ...s, messages: s.messages.map(m => m.id === openStudioMessageId ? { ...m, content: conversationText } : m) } : s));
          }
        } else if (!conversationText && !fullResponse.includes('"conversation"')) {
          // If it's not looking like JSON, it could be an error message. Show it directly.
          setSessions(prev => prev.map(s => s.id === currentSessionId ? { ...s, messages: s.messages.map(m => m.id === openStudioMessageId ? { ...m, content: fullResponse } : m) } : s));
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
            finalConversationalPart = parsed.conversation || "(Nexus did not provide a conversational response.)";
            if (parsed.files && Array.isArray(parsed.files)) {
              generatedFileObjects = parsed.files.filter((f: any) => f.path && f.action);
            }
          } catch (e) {
            console.error("Failed to parse final JSON from response", e);
            finalConversationalPart = "I tried to generate a response, but it wasn't in the correct format. The raw response is shown below.";
            setSessions(prev => prev.map(s => s.id === currentSessionId ? { ...s, messages: s.messages.map(m => m.id === openStudioMessageId ? { ...m, content: fullResponse } : m) } : s));
          }
        } else {
          console.warn("No valid JSON found in the final response. Treating as pure conversation.");
          finalConversationalPart = fullResponse;
        }
      }

      // Update the Nexus message with the FINAL conversational part and file changes list
      setSessions(prev => prev.map(s => {
        if (s.id === currentSessionId) {
          const finalGenerationFiles: GenerationFile[] = generatedFileObjects.map(f => ({
            path: f.path,
            action: f.action,
            status: 'generating',
          }));
          const messages = s.messages.map(msg => {
            if (msg.id === openStudioMessageId) {
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
            if (msg.id === openStudioMessageId && msg.generationInfo) {
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
            if (msg.id === openStudioMessageId && msg.generationInfo) {
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
          const messages = s.messages.map(m => m.id === openStudioMessageId ? { ...m, content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}` } : m);
          return { ...s, messages };
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
    onModelChange: handleModelChange,
  };

  if (view === 'new-chat' && !activeSessionId) {
    return <WelcomeScreen {...commonProps} />;
  }

  return (
    <div className="flex h-full bg-[#000000] text-zinc-400 selection:bg-white/10 selection:text-white overflow-hidden" style={{ zoom: 0.9 }}>
      {/* 🛸 LEFT SIDBAR */}
      <Sidebar
        onNavigate={handleNavigate}
        recentChats={sessions}
        onSelectChat={handleSelectChat}
        onDeleteSession={handleDeleteSession}
        activeView={view}
        activeChatId={activeSessionId}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      
      {/* 🏗️ MAIN WORKSPACE */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0C0C0C] relative overflow-hidden shadow-2xl">
        <div className="flex-1 overflow-hidden relative">
          <div className="absolute inset-0 overflow-y-auto custom-scrollbar">
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
              <div className="h-full">
                <WelcomeScreen {...commonProps} />
              </div>
            )}
            {view === 'storage' && (
              <div className="h-full pt-10 px-8">
                <LamaDBOfficeCockpit />
              </div>
            )}
            {view === 'deploy' && (
              <div className="h-full pt-10 px-8">
                <UnifiedOfficeCockpit />
              </div>
            )}
            {view === 'chat-session' && !activeSession && !isInitialLoad && (
              <div className="p-8 text-white flex flex-col items-center justify-center h-full text-center">
                <h1 className="text-xl font-semibold mb-2 tracking-tight">Session not found</h1>
                <p className="text-zinc-500 mb-8 max-w-sm leading-relaxed">The project session you are attempting to load does not exist or has been deleted.</p>
                <button
                  onClick={() => handleNavigate('new-chat')}
                  className="px-6 py-2.5 text-sm font-medium bg-white text-black hover:bg-zinc-200 transition-colors rounded-lg"
                >
                  Start New Session
                </button>
              </div>
            )}
            {view === 'all-chats' && <div className="p-8"><AllChatsView sessions={sessions} onSelectChat={handleSelectChat} onDeleteSession={handleDeleteSession} onNavigate={handleNavigate} /></div>}
            {view === 'settings' && <div className="h-full"><SettingsView /></div>}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;