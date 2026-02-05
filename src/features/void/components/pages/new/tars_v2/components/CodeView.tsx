import React, { useState, useMemo, useEffect, useRef } from 'react';
import Editor, { loader, OnMount } from '@monaco-editor/react';
import type { FileNode, ChatSession, GenerationInfo, GenerationFile } from '../types';
import { FileIcon, FolderIcon, SpinnerIcon, FilePlusIcon, FolderPlusIcon, TrashIcon, PencilIcon, PanelLeftCloseIcon, SidebarIcon } from './icons/Icons';

// Configure monaco-editor loader to fetch assets from a CDN
loader.config({
    paths: {
        vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.49.0/min/vs',
    },
});

declare global {
    interface Window {
        Babel: any;
    }
}

interface CodeViewProps {
    session: ChatSession;
    setActiveFile: (file: FileNode | null) => void;
    onFileContentChange: (path: string, content: string) => void;
    generationInfo: GenerationInfo | null;
    onAddFileOrFolder: (path: string, type: 'file' | 'folder') => void;
    onDeleteFileOrFolder: (path: string, isFile: boolean) => void;
    onRenameFileOrFolder: (oldPath: string, newPath: string, isFile: boolean) => void;
    activeTab: 'code' | 'preview';
}

type TreeNode = {
    [key: string]: TreeNode | FileNode;
};

const buildFileTree = (files: FileNode[]): TreeNode => {
    const root: TreeNode = {};
    files.forEach(file => {
        const parts = file.path.split('/');
        let current: TreeNode = root;
        parts.forEach((part, i) => {
            if (i === parts.length - 1) {
                current[part] = file;
            } else {
                current[part] = current[part] || {};
                current = current[part] as TreeNode;
            }
        });
    });
    return root;
};


const FileTreeView: React.FC<{
    tree: TreeNode;
    onSelectFile: (file: FileNode) => void;
    activeFile: FileNode | null;
    generationStatusMap: Map<string, GenerationFile>;
    onAddFileOrFolder: (path: string, type: 'file' | 'folder') => void;
    onDeleteFileOrFolder: (path: string, isFile: boolean) => void;
    onRenameFileOrFolder: (oldPath: string, newPath: string, isFile: boolean) => void;
    level?: number;
    parentPath?: string;
}> = ({ tree, onSelectFile, activeFile, generationStatusMap, onAddFileOrFolder, onDeleteFileOrFolder, onRenameFileOrFolder, level = 0, parentPath = '' }) => {
    const [renaming, setRenaming] = useState<string | null>(null);
    const [creating, setCreating] = useState<'file' | 'folder' | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (renaming || creating) {
            inputRef.current?.focus();
            inputRef.current?.select();
        }
    }, [renaming, creating]);

    const handleRenameSubmit = (e: React.FormEvent, oldPath: string, isFile: boolean) => {
        e.preventDefault();
        const newName = ((e.currentTarget as HTMLFormElement).elements.namedItem('name') as HTMLInputElement).value;
        const oldName = oldPath.split('/').pop() || '';
        if (newName && newName !== oldName) {
            const newPath = [...oldPath.split('/').slice(0, -1), newName].join('/');
            onRenameFileOrFolder(oldPath, newPath, isFile);
        }
        setRenaming(null);
    };

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const name = ((e.currentTarget as HTMLFormElement).elements.namedItem('name') as HTMLInputElement).value;
        if (name && creating) {
            const newPath = parentPath ? `${parentPath}/${name}` : name;
            onAddFileOrFolder(newPath, creating);
        }
        setCreating(null);
    };

    const EntryInput: React.FC<{
        defaultValue?: string;
        onSubmit: (e: React.FormEvent) => void;
        onBlur: () => void;
        icon: React.ReactNode;
    }> = ({ defaultValue, onSubmit, onBlur, icon }) => (
        <form onSubmit={onSubmit} className="w-full text-left text-sm flex items-center gap-2 px-2 py-1 rounded-md bg-white/10" style={{ paddingLeft: `${level * 1.25 + 0.5}rem` }}>
            {icon}
            <input
                ref={inputRef}
                type="text"
                name="name"
                defaultValue={defaultValue}
                onBlur={onBlur}
                className="bg-transparent text-white w-full focus:outline-none"
                autoComplete="off"
            />
        </form>
    );

    return (
        <ul className="space-y-0.5">
            {Object.entries(tree)
                .filter(([name]) => name !== '.keep')
                .sort(([aName, aNode], [bName, bNode]) => {
                    const aIsFile = !!(aNode as FileNode).path;
                    const bIsFile = !!(bNode as FileNode).path;
                    if (aIsFile === bIsFile) return aName.localeCompare(bName);
                    return aIsFile ? 1 : -1;
                })
                .map(([name, node]) => {
                    const isFile = !!(node as FileNode).path;
                    const currentPath = parentPath ? `${parentPath}/${name}` : name;

                    if (renaming === currentPath) {
                        return (
                            <li key={currentPath}>
                                <EntryInput
                                    defaultValue={name}
                                    onSubmit={(e) => handleRenameSubmit(e, currentPath, isFile)}
                                    onBlur={() => setRenaming(null)}
                                    icon={isFile ? <FileIcon className="h-4 w-4 flex-shrink-0" /> : <FolderIcon className="h-4 w-4 flex-shrink-0" />}
                                />
                            </li>
                        );
                    }

                    return (
                        <li key={currentPath}>
                            <div className="group relative">
                                <button
                                    onClick={() => isFile && onSelectFile(node as FileNode)}
                                    style={{ paddingLeft: `${level * 1.25}rem` }}
                                    className={`w-full text-left text-sm flex items-center justify-between gap-2 px-2 py-1 rounded-md ${activeFile?.path === currentPath ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                                >
                                    <div className="flex items-center gap-2 truncate">
                                        {isFile ? <FileIcon className="h-4 w-4 flex-shrink-0" /> : <FolderIcon className="h-4 w-4 flex-shrink-0" />}
                                        <span className="truncate">{name}</span>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        {generationStatusMap.get(currentPath)?.status === 'generating' && <SpinnerIcon className="w-3.5 h-3.5 animate-spin text-gray-500" />}
                                    </div>
                                </button>
                                <div className="absolute top-1/2 -translate-y-1/2 right-1 flex items-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 rounded-md">
                                    <button onClick={() => setRenaming(currentPath)} className="p-1 text-gray-400 hover:text-white" title="Rename"><PencilIcon className="w-3.5 h-3.5" /></button>
                                    <button onClick={() => onDeleteFileOrFolder(currentPath, isFile)} className="p-1 text-gray-400 hover:text-red-500" title="Delete"><TrashIcon className="w-3.5 h-3.5" /></button>
                                </div>
                            </div>
                            {!isFile && (
                                <FileTreeView
                                    tree={node as TreeNode}
                                    onSelectFile={onSelectFile}
                                    activeFile={activeFile}
                                    generationStatusMap={generationStatusMap}
                                    onAddFileOrFolder={onAddFileOrFolder}
                                    onDeleteFileOrFolder={onDeleteFileOrFolder}
                                    onRenameFileOrFolder={onRenameFileOrFolder}
                                    level={level + 1}
                                    parentPath={currentPath}
                                />
                            )}
                        </li>
                    );
                })}
            {creating && (
                <li>
                    <EntryInput
                        onSubmit={handleCreateSubmit}
                        onBlur={() => setCreating(null)}
                        icon={creating === 'file' ? <FileIcon className="h-4 w-4 flex-shrink-0" /> : <FolderIcon className="h-4 w-4 flex-shrink-0" />}
                    />
                </li>
            )}
        </ul>
    );
};

const PreviewPane: React.FC<{ files: FileNode[] }> = ({ files }) => {
    const [babelLoaded, setBabelLoaded] = useState(!!window.Babel);
    const [srcDoc, setSrcDoc] = useState('<html><body style="background-color: #0A0A0A;"></body></html>');

    useEffect(() => {
        if (babelLoaded) return;
        const interval = setInterval(() => {
            if (window.Babel) {
                setBabelLoaded(true);
                clearInterval(interval);
            }
        }, 100);
        return () => clearInterval(interval);
    }, [babelLoaded]);

    useEffect(() => {
        const loadingHtml = (title: string, message: string) => `<html><body style="margin: 0; background-color: #0A0A0A; color: #9ca3af; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; text-align: center;"><div style="display: flex; flex-direction: column; align-items: center; gap: 8px;"><div>${title}</div><div style="font-size: 0.8rem; color: #6b7280;">${message}</div></div></body></html>`;

        if (!babelLoaded) {
            setSrcDoc(loadingHtml('Loading Preview Engine', 'Waiting for Babel transpiler...'));
            return;
        }

        const indexHtmlFile = files.find(f => f.path === 'index.html');
        if (indexHtmlFile) {
            setSrcDoc(indexHtmlFile.content);
            return;
        }

        const indexFile = files.find(f => /index\.(tsx|jsx|ts|js)$/i.test(f.path));
        if (!indexFile) {
            setSrcDoc(loadingHtml('Preview Error', 'An `index.html` or `index.tsx` file must exist to render a preview.'));
            return;
        }

        try {
            const pathToModuleId = (path: string) => path.replace(/[^a-zA-Z0-9]/g, '_');
            const fileMap = new Map<string, string>(files.map(f => [f.path, f.content]));
            const importMap: { imports: Record<string, string> } = {
                imports: {
                    "react": "https://esm.sh/react@18.2.0",
                    "react-dom/client": "https://esm.sh/react-dom@18.2.0/client",
                }
            };
            let mainModuleId = '';

            for (const file of files) {
                if (/\.(tsx|jsx|ts|js)$/.test(file.path)) {
                    const moduleId = pathToModuleId(file.path);
                    if (file.path === indexFile.path) {
                        mainModuleId = moduleId;
                    }

                    let processedCode = file.content;
                    const importRegex = /import\s+(?:[\w\s{},*]+ as \w+\s*)?([\w\s{},*]+)?\s+from\s+['"](\.\.?\/.*?)['"]/g;

                    processedCode = processedCode.replace(importRegex, (match, _, relativePath) => {
                        const pathSegments = file.path.split('/');
                        pathSegments.pop();
                        const relativeSegments = relativePath.split('/');

                        for (const segment of relativeSegments) {
                            if (segment === '.') continue;
                            if (segment === '..') {
                                if (pathSegments.length > 0) pathSegments.pop();
                            } else {
                                pathSegments.push(segment);
                            }
                        }
                        const resolvedBasePath = pathSegments.join('/');
                        const extensionsToTry = ['.ts', '.tsx', '.js', '.jsx', '/index.ts', '/index.tsx', '/index.js', '/index.jsx'];
                        let absolutePath: string | null = null;

                        // Case 1: Direct match (e.g., './Button.tsx')
                        if (fileMap.has(resolvedBasePath)) {
                            absolutePath = resolvedBasePath;
                        } else {
                            // Case 2: Extensionless match (e.g., './Button')
                            for (const ext of extensionsToTry) {
                                const potentialPath = resolvedBasePath + ext;
                                if (fileMap.has(potentialPath)) {
                                    absolutePath = potentialPath;
                                    break;
                                }
                            }
                        }

                        if (absolutePath) {
                            return match.replace(relativePath, pathToModuleId(absolutePath));
                        }
                        return match;
                    });

                    const transformed = window.Babel.transform(processedCode, {
                        presets: ['react', 'typescript'],
                        filename: file.path,
                    }).code;

                    importMap.imports[moduleId] = `data:text/javascript,${encodeURIComponent(transformed)}`;
                }
            }

            const errorDisplayScript = `
              document.body.innerHTML = \`<div style="background-color: #0A0A0A; color: #e5e7eb; font-family: Inter, sans-serif; height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2rem; box-sizing: border-box;">
                <div style="border: 1px solid #27272A; background-color: #171717; padding: 1.5rem; border-radius: 0.5rem; max-width: 80%;">
                  <h3 style="color: #fca5a5; font-size: 1.125rem; margin: 0 0 0.75rem 0; font-weight: 600;">Preview Runtime Error</h3>
                  <pre style="background-color: #27272A; color: #d1d5db; padding: 1rem; border-radius: 0.25rem; white-space: pre-wrap; word-break: break-all; font-family: 'JetBrains Mono', monospace; font-size: 0.875rem;">\${error.message}</pre>
                </div>
              </div>\`;
              console.error("Preview Error:", error);
            `;

            const newSrcDoc = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>Preview</title>
                    <script src="https://cdn.tailwindcss.com"></script>
                    <script async src="https://ga.jspm.io/npm:es-module-shims@1.10.0/dist/es-module-shims.js"></script>
                    <link rel="preconnect" href="https://fonts.googleapis.com">
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
                    <style> body { font-family: 'Inter', sans-serif; background-color: #fff; } </style>
                </head>
                <body>
                    <div id="root"></div>
                    <script type="importmap">
                        ${JSON.stringify(importMap)}
                    </script>
                    <script type="module">
                        window.onerror = function(message, source, lineno, colno, error) {
                           ${errorDisplayScript}
                           return true;
                        };
                        try {
                            await import('${mainModuleId}');
                        } catch (error) {
                           ${errorDisplayScript}
                        }
                    </script>
                </body>
                </html>
            `;
            setSrcDoc(newSrcDoc);

        } catch (error: any) {
            console.error("Error creating preview:", error);
            // Fix: Corrected the malformed regular expression in the replace call.
            const errorMessage = error.message.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            setSrcDoc(`<html><body style="margin: 0; background-color: #0A0A0A; color: #fca5a5; font-family: 'JetBrains Mono', monospace; padding: 1rem; font-size: 0.9rem; white-space: pre-wrap;">Failed to transpile code for preview:\n\n${errorMessage}</body></html>`);
        }
    }, [files, babelLoaded]);

    return (
        <iframe
            srcDoc={srcDoc}
            title="Preview"
            sandbox="allow-scripts allow-same-origin"
            className="w-full h-full bg-white"
        />
    );
};

export function CodeView({ session, setActiveFile, onFileContentChange, generationInfo, onAddFileOrFolder, onDeleteFileOrFolder, onRenameFileOrFolder, activeTab }: CodeViewProps) {
    const { fileTree, activeFile } = session;
    const [rootCreating, setRootCreating] = useState<'file' | 'folder' | null>(null);
    const [isFileTreeVisible, setIsFileTreeVisible] = useState(true);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (rootCreating) {
            inputRef.current?.focus();
            inputRef.current?.select();
        }
    }, [rootCreating]);

    const handleEditorDidMount: OnMount = (editor, monaco) => {
        // Configure TypeScript/JavaScript language services
        monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
            target: monaco.languages.typescript.ScriptTarget.ESNext,
            allowNonTsExtensions: true,
            moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
            module: monaco.languages.typescript.ModuleKind.ESNext,
            noEmit: true,
            jsx: monaco.languages.typescript.JsxEmit.ReactJSX,
            reactNamespace: "React",
            typeRoots: ["file:///node_modules/@types"]
        });

        // Add React type definitions
        const addExtraLibs = async () => {
            try {
                const reactVersion = "18";
                const [reactTypes, reactGlobalTypes, reactDomTypes] = await Promise.all([
                    fetch(`https://unpkg.com/@types/react@${reactVersion}/index.d.ts`).then(res => res.text()),
                    fetch(`https://unpkg.com/@types/react@${reactVersion}/global.d.ts`).then(res => res.text()),
                    fetch(`https://unpkg.com/@types/react-dom@${reactVersion}/index.d.ts`).then(res => res.text())
                ]);

                monaco.languages.typescript.typescriptDefaults.addExtraLib(reactTypes, `file:///node_modules/@types/react/index.d.ts`);
                monaco.languages.typescript.typescriptDefaults.addExtraLib(reactGlobalTypes, `file:///node_modules/@types/react/global.d.ts`);
                monaco.languages.typescript.typescriptDefaults.addExtraLib(reactDomTypes, `file:///node_modules/@types/react-dom/index.d.ts`);
                console.log("Monaco TypeScript environment configured for React.");
            } catch (error) {
                console.error("Could not fetch React type definitions for Monaco:", error);
            }
        };

        addExtraLibs();
    };

    const fileTreeData = useMemo(() => buildFileTree(fileTree), [fileTree]);

    const generationStatusMap = useMemo(() => {
        const map = new Map<string, GenerationFile>();
        if (generationInfo) {
            generationInfo.files.forEach(f => map.set(f.path, f));
        }
        return map;
    }, [generationInfo]);

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const name = ((e.currentTarget as HTMLFormElement).elements.namedItem('name') as HTMLInputElement).value;
        if (name && rootCreating) {
            onAddFileOrFolder(name, rootCreating);
        }
        setRootCreating(null);
    };

    const editorLoadingState = (
        <div className="flex items-center justify-center h-full text-neutral-600 gap-2">
            <SpinnerIcon className="w-5 h-5 animate-spin" />
            <span>Loading Editor...</span>
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-[#0A0A0A]">
            {activeTab === 'code' ? (
                <div className="flex-1 flex overflow-hidden">
                    {isFileTreeVisible && (
                        <aside className="w-56 bg-zinc-950 p-4 overflow-y-auto border-r border-zinc-900">
                            <header className="flex items-center justify-between pb-4 border-b border-zinc-900 mb-4">
                                <h3 className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.3em]">Node Files</h3>
                                <div className="flex items-center gap-1">
                                    <button onClick={() => setRootCreating('folder')} className="p-1.5 hover:bg-zinc-900 text-zinc-600 hover:text-white transition-colors" title="New Folder">
                                        <FolderPlusIcon className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => setRootCreating('file')} className="p-1.5 hover:bg-zinc-900 text-zinc-600 hover:text-white transition-colors" title="New File">
                                        <FilePlusIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </header>

                            {rootCreating && (
                                <form onSubmit={handleCreateSubmit} className="w-full text-left text-sm flex items-center gap-2 px-2 py-1.5 bg-zinc-900 border border-zinc-800 mb-2">
                                    {rootCreating === 'file' ? <FileIcon className="h-4 w-4 text-zinc-500" /> : <FolderIcon className="h-4 w-4 text-zinc-500" />}
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        name="name"
                                        onBlur={() => setRootCreating(null)}
                                        className="bg-transparent text-white text-xs w-full focus:outline-none placeholder-zinc-700"
                                        autoComplete="off"
                                        placeholder="Name..."
                                    />
                                </form>
                            )}

                            {Object.keys(fileTreeData).length > 0 || rootCreating ? (
                                <FileTreeView
                                    tree={fileTreeData}
                                    onSelectFile={setActiveFile}
                                    activeFile={activeFile}
                                    generationStatusMap={generationStatusMap}
                                    onAddFileOrFolder={onAddFileOrFolder}
                                    onDeleteFileOrFolder={onDeleteFileOrFolder}
                                    onRenameFileOrFolder={onRenameFileOrFolder}
                                />
                            ) : (
                                <p className="text-[9px] font-bold text-zinc-800 uppercase tracking-widest text-center mt-10">Neural void</p>
                            )}
                        </aside>
                    )}

                    <main className="flex-1 flex flex-col overflow-hidden relative">
                        {!isFileTreeVisible && (
                            <button
                                onClick={() => setIsFileTreeVisible(true)}
                                className="absolute top-4 left-4 z-10 p-2 bg-zinc-950 border border-zinc-900 hover:border-zinc-700 transition-colors"
                                title="Show File Manager"
                            >
                                <SidebarIcon className="w-4 h-4 text-zinc-500" />
                            </button>
                        )}
                        {activeFile ? (
                            <>
                                <div className="flex-shrink-0 bg-black px-6 py-3 flex items-center justify-between border-b border-zinc-900">
                                    <div className="flex items-center gap-3">
                                        <FileIcon className="h-3.5 w-3.5 text-zinc-600" />
                                        <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">{activeFile.path}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-none bg-orange-500/50" />
                                        <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.2em]">Materializing...</span>
                                    </div>
                                </div>
                                <div className="flex-1 relative">
                                    <Editor
                                        path={activeFile.path}
                                        value={activeFile.content}
                                        onChange={(value) => onFileContentChange(activeFile.path, value || '')}
                                        theme="vs-dark"
                                        loading={editorLoadingState}
                                        onMount={handleEditorDidMount}
                                        options={{
                                            minimap: { enabled: false },
                                            fontSize: 13,
                                            fontFamily: "'JetBrains Mono', monospace",
                                            wordWrap: 'on',
                                            lineNumbers: 'on',
                                            glyphMargin: false,
                                            folding: true,
                                            lineDecorationsWidth: 10,
                                            lineNumbersMinChars: 3,
                                            scrollBeyondLastLine: false,
                                            automaticLayout: true,
                                            tabSize: 2,
                                            insertSpaces: true,
                                            padding: { top: 20, bottom: 20 },
                                        }}
                                    />
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-zinc-800">
                                <div className="w-12 h-12 bg-zinc-950 border border-zinc-900 flex items-center justify-center mb-6">
                                    <FileIcon className="h-6 w-6 opacity-20" />
                                </div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.4em]">Select Node Segment</p>
                                <p className="text-[9px] font-bold uppercase tracking-[0.2em] mt-2 opacity-50">Or ask the Architect to materialize one</p>
                            </div>
                        )}
                    </main>
                </div>
            ) : (
                <div className="flex-1 bg-white">
                    <PreviewPane files={fileTree} />
                </div>
            )}
        </div>
    );
}