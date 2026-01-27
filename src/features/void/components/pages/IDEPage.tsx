import React, { useState, useEffect, useCallback } from 'react';
import type { Project, FileSystemNode, LogEntry } from '../../types';
import { LogLevel } from '../../types';
import { mockFileSystem, successBuildLogs } from '../../constants';
import { LogViewer } from '../LogViewer';
import { safeNavigate } from '../../services/navigation';
import { FrameworkIcon } from '../common/Indicators';

const FolderIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
);

const FileIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
                    className="flex items-center gap-3 py-2 cursor-pointer hover:bg-zinc-950/50 transition-colors"
                    style={{ paddingLeft: `${level * 16 + 16}px` }}
                >
                    <FolderIcon />
                    <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest select-none">{node.name}</span>
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
            className={`flex items-center gap-3 py-2 cursor-pointer transition-colors ${isSelected ? 'bg-zinc-900' : 'hover:bg-zinc-950/50'}`}
            style={{ paddingLeft: `${level * 16 + 16}px` }}
        >
            <FileIcon />
            <span className={`text-[11px] font-bold select-none ${isSelected ? 'text-white' : 'text-zinc-600 uppercase tracking-widest'}`}>{node.name}</span>
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
        console.log(`Simulating save for ${selectedFile.name}`);
        triggerBuild();
    };

    const triggerBuild = useCallback(() => {
        setLogs([]);
        setIsBuilding(true);
        let logIndex = 0;
        const interval = setInterval(() => {
            if (logIndex < successBuildLogs.length) {
                setLogs(prev => [...prev, { ...successBuildLogs[logIndex], timestamp: new Date().toISOString() }]);
                logIndex++;
            } else {
                setIsBuilding(false);
                clearInterval(interval);
            }
        }, 300);
    }, []);

    const handleNav = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, path: string) => {
        e.preventDefault();
        safeNavigate(path);
    };

    return (
        <div className="space-y-12 flex flex-col flex-grow h-full selection:bg-white selection:text-black">
            <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between px-2">
                <div className="flex items-center gap-8">
                    <FrameworkIcon framework={project.framework} size="large" />
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <h2 className="text-3xl font-bold tracking-tighter text-white">{project.name}</h2>
                            <div className="w-1.5 h-1.5 rounded-full bg-zinc-800"></div>
                        </div>
                        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em]">Cognitive Development Interface</p>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <button
                        onClick={(e) => handleNav(e, `/projects/${project.id}`)}
                        className="text-[10px] font-bold text-zinc-600 hover:text-white uppercase tracking-widest transition-colors"
                    >
                        Return to Node
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isBuilding}
                        className="h-12 border border-zinc-900 px-10 text-[10px] font-bold text-white uppercase tracking-widest hover:border-white transition-all disabled:opacity-30 disabled:hover:border-zinc-900"
                    >
                        Push to Nexus
                    </button>
                </div>
            </div>

            <div className="flex-grow grid grid-cols-12 grid-rows-6 gap-0 border border-zinc-900 bg-black min-h-[70vh]">
                {/* File Explorer */}
                <div className="col-span-2 row-span-6 border-r border-zinc-900 overflow-y-auto no-scrollbar py-6">
                    <div className="px-8 mb-6">
                        <h3 className="text-[9px] font-bold text-zinc-800 uppercase tracking-[0.3em]">Project Explorer</h3>
                    </div>
                    {mockFileSystem.map(node => (
                        <FileTree key={node.name} node={node} onSelect={setSelectedFile} selectedFile={selectedFile} />
                    ))}
                </div>

                {/* Editor */}
                <div className="col-span-10 row-span-4 flex flex-col">
                    <div className="h-12 border-b border-zinc-900 flex items-center px-8 bg-zinc-950/20">
                        <span className="text-[11px] font-bold text-white tracking-widest uppercase">{selectedFile?.name || 'buffer'}</span>
                        <div className="ml-auto flex gap-2">
                            <div className="w-1 h-1 bg-zinc-900 rounded-full"></div>
                            <div className="w-1 h-1 bg-zinc-900 rounded-full"></div>
                            <div className="w-1 h-1 bg-zinc-900 rounded-full"></div>
                        </div>
                    </div>
                    <textarea
                        value={editorContent}
                        onChange={(e) => setEditorContent(e.target.value)}
                        className="w-full h-full bg-black font-mono text-[13px] p-10 resize-none focus:outline-none text-zinc-300 leading-relaxed caret-white"
                        placeholder="// Dispatch neural instructions..."
                    />
                </div>

                {/* Log Viewer */}
                <div className="col-span-10 row-span-2 border-t border-zinc-900">
                    <LogViewer logs={logs} isBuilding={isBuilding} currentBuildStatusText="Synthesizing" />
                </div>
            </div>
        </div>
    );
};

