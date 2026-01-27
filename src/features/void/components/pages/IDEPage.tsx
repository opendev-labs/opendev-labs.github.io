
import React, { useState, useEffect, useCallback } from 'react';
import type { Project, FileSystemNode, LogEntry } from '../../types';
import { LogLevel } from '../../types';
import { mockFileSystem, successBuildLogs } from '../../constants';
import { LogViewer } from '../LogViewer';
import { safeNavigate } from '../../services/navigation';
import { FrameworkIcon } from '../common/Indicators';

const FolderIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
);

const FileIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
);


const FileTree: React.FC<{ node: FileSystemNode; onSelect: (file: FileSystemNode) => void; selectedFile: FileSystemNode | null; level?: number }> = ({ node, onSelect, selectedFile, level = 0 }) => {
    const [isOpen, setIsOpen] = useState(true);

    if (node.type === 'directory') {
        return (
            <div>
                <div
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 py-1 cursor-pointer hover:bg-void-line/50"
                    style={{ paddingLeft: `${level * 16}px` }}
                >
                    <FolderIcon />
                    <span className="text-sm text-zinc-300 select-none">{node.name}</span>
                </div>
                {isOpen && node.children?.map(child => (
                    <FileTree key={child.name} node={child} onSelect={onSelect} selectedFile={selectedFile} level={level + 1} />
                ))}
            </div>
        );
    }

    const isSelected = selectedFile?.name === node.name && selectedFile.content === node.content;

    return (
        <div
            onClick={() => onSelect(node)}
            className={`flex items-center gap-2 py-1 cursor-pointer ${isSelected ? 'bg-void-neon/20' : 'hover:bg-void-line/50'}`}
            style={{ paddingLeft: `${level * 16}px` }}
        >
            <FileIcon />
            <span className="text-sm text-zinc-300 select-none">{node.name}</span>
        </div>
    );
};

export const IDEPage: React.FC<{ project: Project }> = ({ project }) => {
    const [selectedFile, setSelectedFile] = useState<FileSystemNode | null>(mockFileSystem.find(n => n.name === 'src')?.children?.find(c => c.name === 'App.tsx') || null);
    const [editorContent, setEditorContent] = useState(selectedFile?.content || '');
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [isBuilding, setIsBuilding] = useState(false);

    useEffect(() => {
        setEditorContent(selectedFile?.content || '');
    }, [selectedFile]);

    const handleSave = () => {
        if (!selectedFile) return;
        // In a real app, this would save the file. Here, we just trigger a build.
        console.log(`Simulating save for ${selectedFile.name}`);
        triggerBuild();
    };
    
    const triggerBuild = useCallback(() => {
        setLogs([]);
        setIsBuilding(true);
        let logIndex = 0;
        const interval = setInterval(() => {
            if (logIndex < successBuildLogs.length) {
                setLogs(prev => [...prev, {...successBuildLogs[logIndex], timestamp: new Date().toISOString()}]);
                logIndex++;
            } else {
                setIsBuilding(false);
                clearInterval(interval);
            }
        }, 300);
    }, []);

    const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
        e.preventDefault();
        safeNavigate(path);
    };

    return (
        <div className="space-y-6 flex flex-col flex-grow h-full">
            <div>
                <a href={`/#/projects/${project.id}`} onClick={(e) => handleNav(e, `/projects/${project.id}`)} className="text-sm text-zinc-400 hover:text-white mb-4 inline-block">&larr; Back to Project Overview</a>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <FrameworkIcon framework={project.framework} size="large" />
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-white">{project.name}</h2>
                            <p className="text-zinc-400 text-sm">Cloud Development Environment</p>
                        </div>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={isBuilding}
                        className="bg-void-neon text-black font-semibold px-5 py-2 hover:opacity-90 transition-colors text-sm disabled:bg-zinc-400 disabled:text-zinc-600"
                    >
                        Save & Deploy
                    </button>
                </div>
            </div>

            <div className="flex-grow grid grid-cols-12 grid-rows-6 gap-4 h-[70vh]">
                {/* File Explorer */}
                <div className="col-span-2 row-span-6 bg-void-card border border-void-line rounded-lg overflow-y-auto p-2">
                     {mockFileSystem.map(node => (
                        <FileTree key={node.name} node={node} onSelect={setSelectedFile} selectedFile={selectedFile} />
                     ))}
                </div>

                {/* Editor */}
                <div className="col-span-10 row-span-4 bg-void-card border border-void-line rounded-lg flex flex-col">
                    <div className="p-2 border-b border-void-line text-sm text-zinc-300 bg-void-line/30 rounded-t-lg">
                        {selectedFile?.name || 'No file selected'}
                    </div>
                    <textarea
                        value={editorContent}
                        onChange={(e) => setEditorContent(e.target.value)}
                        className="w-full h-full bg-black font-mono text-sm p-4 resize-none focus:outline-none text-zinc-200 rounded-b-lg"
                        placeholder="// Select a file to start editing"
                    />
                </div>

                {/* Log Viewer */}
                <div className="col-span-10 row-span-2">
                     <LogViewer logs={logs} isBuilding={isBuilding} currentBuildStatusText="Building" />
                </div>
            </div>
        </div>
    );
};
