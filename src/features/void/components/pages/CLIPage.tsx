import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import type { Project, Deployment } from '../../types';
import { DeploymentStatus } from '../../types';
import { successBuildLogs, buildLogs } from '../../constants';

type OutputLine = {
    type: 'input' | 'output' | 'error' | 'success' | 'system';
    content: React.ReactNode;
    isHtml?: boolean;
};

const HELP_MESSAGE = `
<div class="space-y-1">
<div class="font-bold text-white uppercase tracking-widest text-[10px] mb-2">opendev CLI - Operational Protocols</div>
<div class="pl-0 flex gap-4"><span class="text-white font-bold w-32 shrink-0">help</span> <span class="text-zinc-600">Display available protocols.</span></div>
<div class="pl-0 flex gap-4"><span class="text-white font-bold w-32 shrink-0">fleet</span> <span class="text-zinc-600">List all registry nodes.</span></div>
<div class="pl-0 flex gap-4"><span class="text-white font-bold w-32 shrink-0">launch &lt;node&gt;</span> <span class="text-zinc-600">Initiate node deployment sequence.</span></div>
<div class="pl-0 flex gap-4"><span class="text-white font-bold w-32 shrink-0">telemetry &lt;node&gt;</span> <span class="text-zinc-600">Access real-time log stream.</span></div>
<div class="pl-0 flex gap-4"><span class="text-white font-bold w-32 shrink-0">whoami</span> <span class="text-zinc-600">Verify current authorization.</span></div>
<div class="pl-0 flex gap-4"><span class="text-white font-bold w-32 shrink-0">clear</span> <span class="text-zinc-600">Purge terminal buffer.</span></div>
<div class="pl-0 flex gap-4"><span class="text-white font-bold w-32 shrink-0">exit</span> <span class="text-zinc-600">Terminate secure session.</span></div>
</div>
`;

const formatTable = (headers: string[], rows: string[][]): string => {
    if (rows.length === 0) {
        return headers.join('  ');
    }
    const colWidths = headers.map((h, i) => Math.max(h.length, ...rows.map(r => r[i].length)));
    const headerRow = headers.map((h, i) => h.padEnd(colWidths[i])).join('  ');
    const separator = colWidths.map(w => '─'.repeat(w)).join('  ');
    const body = rows.map(row => row.map((cell, i) => cell.padEnd(colWidths[i])).join('  ')).join('\n');
    return `${headerRow}\n${separator}\n${body}`;
};


export const CLIPage: React.FC<{ projects: Project[], onUpdateProject: (p: Project) => void }> = ({ projects, onUpdateProject }) => {
    const { user, logout } = useAuth();
    const [lines, setLines] = useState<OutputLine[]>([]);
    const [input, setInput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const addLine = useCallback((content: React.ReactNode, type: OutputLine['type'] = 'output', isHtml = false) => {
        setLines(prev => [...prev, { type, content, isHtml }]);
    }, []);

    useEffect(() => {
        addLine('opendev secure terminal [version 1.0.0]', 'system');
        addLine('establishing neural handshake with nexus...', 'system');
        addLine('ready. type `help` for protocols.', 'system');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
        if (!isProcessing) {
            inputRef.current?.focus();
        }
    }, [lines, isProcessing]);

    const handleProcessCommand = async (command: string) => {
        const [cmd, ...args] = command.trim().split(' ').filter(Boolean);
        if (!cmd) return;

        addLine(`> ${command}`, 'input');
        setIsProcessing(true);

        await new Promise(r => setTimeout(r, 100));

        switch (cmd.toLowerCase()) {
            case 'help':
                addLine(HELP_MESSAGE, 'output', true);
                break;
            case 'clear':
                setLines([]);
                break;
            case 'whoami':
                if (user) {
                    addLine(`Authorized: ${user.name} <${user.email}>`, 'success');
                } else {
                    addLine('No active authorization detected.', 'error');
                }
                break;
            case 'fleet':
            case 'projects':
                if (projects.length > 0) {
                    const headers = ['NAME', 'FRAMEWORK', 'LAST MODIFIED', 'STATUS'];
                    const rows = projects.map(p => [
                        p.name,
                        p.framework,
                        new Date(p.deployments[0].timestamp).toLocaleDateString(),
                        p.deployments[0].status,
                    ]);
                    addLine(<pre className="whitespace-pre text-zinc-400 mt-2 font-mono text-[12px]">{formatTable(headers, rows)}</pre>);
                } else {
                    addLine('Empty fleet registry.', 'output');
                }
                break;
            case 'launch':
            case 'deploy':
                const deployProjectName = args[0];
                if (!deployProjectName) {
                    addLine('Usage: launch <node-id>', 'error');
                    break;
                }
                const projectToDeploy = projects.find(p => p.name.toLowerCase() === deployProjectName.toLowerCase());
                if (!projectToDeploy) {
                    addLine(`Error: Registry entry "${deployProjectName}" not found.`, 'error');
                    break;
                }

                const newDeployment: Deployment = {
                    id: `dpl_cli_${Date.now()}`,
                    commit: `build(cli): protocol handshake sequence`,
                    branch: 'main',
                    timestamp: new Date().toISOString(),
                    status: DeploymentStatus.QUEUED,
                    url: projectToDeploy.domains.find(d => d.isPrimary)?.name || `https://${projectToDeploy.name}.opendev.app`,
                };

                const updatedProject = {
                    ...projectToDeploy,
                    deployments: [newDeployment, ...projectToDeploy.deployments],
                };
                onUpdateProject(updatedProject);

                addLine(`queued. synching nexus nodes for ${projectToDeploy.name}...`, 'system');
                await new Promise(resolve => setTimeout(resolve, 1000));

                for (const log of successBuildLogs) {
                    addLine(<div className="flex gap-4"><span className="text-zinc-800 tabular-nums">{new Date().toLocaleTimeString([], { hour12: false })}</span><span className="text-zinc-500 font-bold uppercase text-[10px] w-12">{log.level}</span><span className="text-zinc-300">{log.message}</span></div>, 'output');
                    await new Promise(r => setTimeout(r, 100 + Math.random() * 150));
                }

                const finalDeployment = { ...newDeployment, status: DeploymentStatus.DEPLOYED };
                onUpdateProject({ ...updatedProject, deployments: [finalDeployment, ...updatedProject.deployments.slice(1)] });
                addLine(`Deployment success. Access live node: ${finalDeployment.url}`, 'success');
                break;

            case 'telemetry':
            case 'logs':
                const logProjectName = args[0];
                if (!logProjectName) {
                    addLine('Usage: telemetry <node-id>', 'error');
                    break;
                }
                const projectToLog = projects.find(p => p.name.toLowerCase() === logProjectName.toLowerCase());
                if (!projectToLog) {
                    addLine(`Error: Registry entry "${logProjectName}" not found.`, 'error');
                    break;
                }
                const latestDeployment = projectToLog.deployments[0];
                const logSource = latestDeployment.status === DeploymentStatus.ERROR ? buildLogs : successBuildLogs;
                addLine(`Streaming telemetry for node: ${latestDeployment.id}`, 'system');
                logSource.forEach(log => {
                    addLine(<div className="flex gap-4"><span className="text-zinc-800 tabular-nums">{new Date().toLocaleTimeString([], { hour12: false })}</span><span className="text-zinc-500 font-bold uppercase text-[10px] w-12">{log.level}</span><span className="text-zinc-300">{log.message}</span></div>, log.level === 'ERROR' ? 'error' : 'output');
                });
                break;

            case 'exit':
            case 'logout':
                addLine('terminating secure tunnel...', 'system');
                await new Promise(r => setTimeout(r, 500));
                logout();
                break;

            default:
                addLine(`unknown command: ${cmd}. type 'help' for protocols.`, 'error');
        }

        setIsProcessing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (!input.trim() || isProcessing) return;
            const command = input.trim();
            setHistory(prev => [command, ...prev]);
            setHistoryIndex(-1);
            handleProcessCommand(command);
            setInput('');
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const newIndex = Math.min(history.length - 1, historyIndex + 1);
            if (newIndex >= 0) {
                setHistoryIndex(newIndex);
                setInput(history[newIndex]);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            const newIndex = Math.max(-1, historyIndex - 1);
            setHistoryIndex(newIndex);
            setInput(newIndex >= 0 ? history[newIndex] : '');
        } else if (e.key === 'l' && e.ctrlKey) {
            e.preventDefault();
            setLines([]);
        }
    };

    const renderLine = (line: OutputLine, index: number) => {
        const classMap = {
            input: 'text-zinc-500',
            output: 'text-zinc-300',
            error: 'text-red-900',
            success: 'text-white font-bold',
            system: 'text-zinc-400 italic',
        };

        const baseClasses = "min-h-[24px] leading-relaxed";

        if (line.isHtml) {
            return <div key={index} className={`${baseClasses} ${classMap[line.type]}`} dangerouslySetInnerHTML={{ __html: line.content as string }} />;
        }

        return <div key={index} className={`${baseClasses} ${classMap[line.type]}`}>{line.content}</div>;
    };


    return (
        <div
            ref={containerRef}
            className="bg-black font-mono text-[13px] p-10 h-[70vh] overflow-y-auto border border-zinc-900 group focus-within:border-white transition-all duration-700 selection:bg-white selection:text-black"
            onClick={() => inputRef.current?.focus()}
        >
            <div className="space-y-1 mb-6">
                {lines.map(renderLine)}
            </div>

            {!isProcessing ? (
                <div className="flex items-center gap-4">
                    <span className="text-white font-bold">{user?.name.split(' ')[0].toLowerCase() || 'guest'}@opendev:~$</span>
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="bg-transparent border-none text-white w-full focus:outline-none p-0 caret-white"
                        autoFocus
                        spellCheck="false"
                        autoComplete="off"
                        aria-label="CLI Input"
                    />
                </div>
            ) : (
                <div className="flex items-center gap-3 h-[24px]">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
                    <span className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">Executing protocol sequence...</span>
                </div>
            )}
        </div>
    );
};

