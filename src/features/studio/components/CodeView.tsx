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

// Sandpack-powered preview (replaces old Babel iframe)
import { SandpackPreview as SandpackPreviewComponent } from './SandpackPreview';
const PreviewPane: React.FC<{ files: FileNode[] }> = ({ files }) => {
    return <SandpackPreviewComponent files={files} />;
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
        <div className="flex flex-col h-full bg-[#050505]">
            {activeTab === 'code' ? (
                <div className="flex-1 flex overflow-hidden">
                    {isFileTreeVisible && (
                        <aside className="w-64 bg-[#050505] p-6 overflow-y-auto border-r border-zinc-900/50">
                            <header className="flex items-center justify-between pb-6 border-b border-zinc-900/30 mb-6">
                                <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Project Files</h3>
                                <div className="flex items-center gap-1">
                                    <button onClick={() => setRootCreating('folder')} className="p-1.5 hover:bg-zinc-900 text-zinc-600 hover:text-white transition-colors rounded-lg border border-transparent hover:border-zinc-800" title="New Folder">
                                        <FolderPlusIcon className="w-3.5 h-3.5" />
                                    </button>
                                    <button onClick={() => setRootCreating('file')} className="p-1.5 hover:bg-zinc-900 text-zinc-600 hover:text-white transition-colors rounded-lg border border-transparent hover:border-zinc-800" title="New File">
                                        <FilePlusIcon className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </header>

                            {rootCreating && (
                                <form onSubmit={handleCreateSubmit} className="w-full text-left text-sm flex items-center gap-2 px-3 py-2 bg-zinc-900/50 border border-zinc-800/50 rounded-xl mb-3">
                                    {rootCreating === 'file' ? <FileIcon className="h-3.5 w-3.5 text-zinc-600" /> : <FolderIcon className="h-3.5 w-3.5 text-zinc-600" />}
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        name="name"
                                        onBlur={() => setRootCreating(null)}
                                        className="bg-transparent text-white text-[11px] w-full focus:outline-none placeholder-zinc-700 font-medium"
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
                                <div className="flex flex-col items-center justify-center mt-20 opacity-40">
                                   <div className="w-1.5 h-1.5 rounded-full bg-zinc-600 mb-4" />
                                   <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider text-center">Empty Workspace</p>
                                </div>
                            )}
                        </aside>
                    )}

                    <main className="flex-1 flex flex-col overflow-hidden relative bg-[#080808]">
                        {!isFileTreeVisible && (
                            <button
                                onClick={() => setIsFileTreeVisible(true)}
                                className="absolute top-6 left-6 z-10 p-2 bg-zinc-900/80 border border-zinc-800/50 hover:border-zinc-700 transition-colors rounded-xl backdrop-blur-md"
                                title="Show Explorer"
                            >
                                <SidebarIcon className="w-4 h-4 text-zinc-600" />
                            </button>
                        )}
                        {activeFile ? (
                            <>
                                <div className="flex-shrink-0 bg-[#080808] px-8 h-16 flex items-center justify-between border-b border-zinc-900/50">
                                    <div className="flex items-center gap-3">
                                        <div className="p-1.5 bg-zinc-900/50 border border-zinc-800/50 rounded-lg">
                                           <FileIcon className="h-3.5 w-3.5 text-zinc-500" />
                                        </div>
                                        <span className="text-[13px] font-medium text-white">{activeFile.path}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Saved</span>
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
                                            fontSize: 14,
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
                                            padding: { top: 24, bottom: 24 },
                                            backgroundColor: '#080808'
                                        }}
                                    />
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full">
                                <div className="w-16 h-16 bg-zinc-900/30 border border-zinc-900/50 flex items-center justify-center mb-8 rounded-[2rem]">
                                    <FileIcon className="h-6 w-6 text-zinc-800" />
                                </div>
                                <p className="text-sm font-medium text-zinc-500">Select a file to edit</p>
                                <p className="text-xs text-zinc-600 mt-2">Create a new file or select from the file explorer</p>
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