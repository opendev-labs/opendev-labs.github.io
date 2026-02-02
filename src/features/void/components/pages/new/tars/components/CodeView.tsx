import React, { useState, useMemo, useEffect, useRef } from 'react';
import Editor, { loader, OnMount } from '@monaco-editor/react';
import type { FileNode, ChatSession, GenerationInfo, GenerationFile } from '../../../../../types';
import { FileIcon, FolderIcon, SpinnerIcon, FilePlusIcon, FolderPlusIcon, TrashIcon, PencilIcon, PanelLeftCloseIcon, SidebarIcon } from './icons/Icons';

loader.config({
    paths: {
        vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.49.0/min/vs',
    },
});

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
                                    style={{ paddingLeft: `${level * 1.25 + 0.5}rem` }}
                                    className={`w-full text-left text-[13px] flex items-center justify-between gap-2 px-2 py-1.5 rounded-md transition-all ${activeFile?.path === currentPath ? 'bg-white/10 text-white' : 'text-neutral-400 hover:bg-white/5 hover:text-neutral-200'}`}
                                >
                                    <div className="flex items-center gap-2 truncate">
                                        {isFile ? <FileIcon className="h-3.5 w-3.5 flex-shrink-0" /> : <FolderIcon className="h-3.5 w-3.5 flex-shrink-0" />}
                                        <span className="truncate">{name}</span>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        {generationStatusMap.get(currentPath)?.status === 'generating' && <SpinnerIcon className="w-3.5 h-3.5 animate-spin text-gray-500" />}
                                    </div>
                                </button>
                                <div className="absolute top-1/2 -translate-y-1/2 right-1 flex items-center opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-800 rounded-md p-0.5">
                                    <button onClick={() => setRenaming(currentPath)} className="p-1 text-gray-400 hover:text-white" title="Rename"><PencilIcon className="w-3 h-3" /></button>
                                    <button onClick={() => onDeleteFileOrFolder(currentPath, isFile)} className="p-1 text-gray-400 hover:text-red-500" title="Delete"><TrashIcon className="w-3 h-3" /></button>
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
    const [srcDoc, setSrcDoc] = useState('<html><body style="background-color: #000;"></body></html>');

    useEffect(() => {
        const loadingHtml = (title: string, message: string) => `<html><body style="margin: 0; background-color: #000; color: #9ca3af; font-family: -apple-system, system-ui, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; text-align: center;"><div style="display: flex; flex-direction: column; align-items: center; gap: 8px;"><div>${title}</div><div style="font-size: 0.8rem; color: #6b7280;">${message}</div></div></body></html>`;

        const indexHtmlFile = files.find(f => f.path === 'index.html');
        if (indexHtmlFile) {
            setSrcDoc(indexHtmlFile.content);
            return;
        }

        const indexFile = files.find(f => /index\.(tsx|jsx|ts|js)$/i.test(f.path));
        if (!indexFile) {
            setSrcDoc(loadingHtml('Engine Offline', 'No index.html found. Connect a neural endpoint.'));
            return;
        }

        // Simulating a more robust preview generator for static content
        setSrcDoc(`<html><body style="margin: 0; background-color: #fff; color: #000; font-family: Inter, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; text-align: center;"><div><h1 style="font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem;">Pulse V2 Preview</h1><p style="color: #666;">Generated React components require a live node for rendering.</p></div></body></html>`);

    }, [files]);

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

    const handleEditorDidMount: OnMount = (editor: any, monaco: any) => {
        monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
            target: monaco.languages.typescript.ScriptTarget.ESNext,
            allowNonTsExtensions: true,
            moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
            module: monaco.languages.typescript.ModuleKind.ESNext,
            jsx: monaco.languages.typescript.JsxEmit.ReactJSX,
        });
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

    return (
        <div className="flex flex-col h-full bg-[#0A0A0A]">
            {activeTab === 'code' ? (
                <div className="flex-1 flex overflow-hidden">
                    {isFileTreeVisible && (
                        <aside className="w-60 bg-black p-3 overflow-y-auto border-r border-neutral-800">
                            <header className="flex items-center justify-between pb-4">
                                <h3 className="px-2 text-[11px] font-bold text-neutral-500 uppercase tracking-widest text-[#666]">Manifest</h3>
                                <div className="flex items-center gap-1">
                                    <button onClick={() => setRootCreating('folder')} className="p-1 rounded hover:bg-neutral-800" title="New Folder">
                                        <FolderPlusIcon className="w-3.5 h-3.5 text-neutral-400" />
                                    </button>
                                    <button onClick={() => setRootCreating('file')} className="p-1 rounded hover:bg-neutral-800" title="New File">
                                        <FilePlusIcon className="w-3.5 h-3.5 text-neutral-400" />
                                    </button>
                                    <button onClick={() => setIsFileTreeVisible(false)} className="p-1 rounded hover:bg-neutral-800" title="Hide Explorer">
                                        <PanelLeftCloseIcon className="w-3.5 h-3.5 text-neutral-400 rotate-180" />
                                    </button>
                                </div>
                            </header>

                            {rootCreating && (
                                <form onSubmit={handleCreateSubmit} className="w-full text-left text-sm flex items-center gap-2 px-2 py-1 rounded-md bg-white/10 mb-1">
                                    {rootCreating === 'file' ? <FileIcon className="h-4 w-4 flex-shrink-0" /> : <FolderIcon className="h-4 w-4 flex-shrink-0" />}
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        name="name"
                                        onBlur={() => setRootCreating(null)}
                                        className="bg-transparent text-white w-full focus:outline-none"
                                        autoComplete="off"
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
                                <p className="px-2 text-xs text-neutral-600 italic">No nodes identified.</p>
                            )}
                        </aside>
                    )}

                    <main className="flex-1 flex flex-col overflow-hidden relative bg-[#0D0D0D]">
                        {!isFileTreeVisible && (
                            <button
                                onClick={() => setIsFileTreeVisible(true)}
                                className="absolute top-2 left-2 z-10 p-1.5 rounded-md bg-neutral-900 border border-neutral-800 hover:bg-neutral-800"
                                title="Show Explorer"
                            >
                                <SidebarIcon className="w-4 h-4 text-neutral-300" />
                            </button>
                        )}
                        {activeFile ? (
                            <>
                                <div className="flex-shrink-0 bg-neutral-900 px-4 py-2 text-[12px] font-mono text-neutral-400 border-b border-neutral-800">
                                    {activeFile.path}
                                </div>
                                <div className="flex-1 relative">
                                    <Editor
                                        path={activeFile.path}
                                        value={activeFile.content}
                                        onChange={(value: string | undefined) => onFileContentChange(activeFile.path, value || '')}
                                        theme="vs-dark"
                                        onMount={handleEditorDidMount}
                                        options={{
                                            minimap: { enabled: false },
                                            fontSize: 13,
                                            fontFamily: "'JetBrains Mono', monospace",
                                            wordWrap: 'on',
                                            scrollBeyondLastLine: false,
                                            automaticLayout: true,
                                            tabSize: 2,
                                            insertSpaces: true,
                                            padding: { top: 16, bottom: 16 },
                                            lineNumbersMinChars: 3,
                                            glyphMargin: false,
                                            folding: true,
                                            renderLineHighlight: 'all',
                                        }}
                                    />
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-neutral-700">
                                <div className="w-16 h-16 rounded-3xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-6">
                                    <FileIcon className="h-8 w-8 text-neutral-700" />
                                </div>
                                <p className="text-sm font-semibold text-neutral-500">Node Standby</p>
                                <p className="text-xs text-neutral-600 mt-2">Select a neural fragment to modify.</p>
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
