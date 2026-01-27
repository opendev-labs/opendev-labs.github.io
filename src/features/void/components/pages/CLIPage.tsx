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
<div>Void CLI - Available Commands:</div>
<div class="pl-2"><span class="text-void-neon w-28 inline-block">help</span> Show this help message.</div>
<div class="pl-2"><span class="text-void-neon w-28 inline-block">projects</span> List all projects.</div>
<div class="pl-2"><span class="text-void-neon w-28 inline-block">deploy &lt;name&gt;</span> Trigger a new deployment for a project.</div>
<div class="pl-2"><span class="text-void-neon w-28 inline-block">logs &lt;name&gt;</span> View latest deployment logs for a project.</div>
<div class="pl-2"><span class="text-void-neon w-28 inline-block">whoami</span> Display current user info.</div>
<div class="pl-2"><span class="text-void-neon w-28 inline-block">clear</span> Clear the terminal screen.</div>
<div class="pl-2"><span class="text-void-neon w-28 inline-block">logout</span> Log out of the CLI session.</div>
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
        addLine('Welcome to Void CLI v1.0.0', 'system');
        addLine('Type `help` for a list of available commands.', 'system');
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

        // A small delay to make it feel more responsive
        await new Promise(r => setTimeout(r, 50));

        switch (cmd.toLowerCase()) {
            case 'help':
                addLine(HELP_MESSAGE, 'output', true);
                break;
            case 'clear':
                setLines([]);
                break;
            case 'whoami':
                if (user) {
                    addLine(`Logged in as ${user.name} <${user.email}>`, 'success');
                } else {
                    addLine('Not logged in.', 'error');
                }
                break;
            case 'projects':
                if (projects.length > 0) {
                    const headers = ['NAME', 'FRAMEWORK', 'LAST DEPLOYMENT', 'STATUS'];
                    const rows = projects.map(p => [
                        p.name,
                        p.framework,
                        new Date(p.deployments[0].timestamp).toLocaleString(),
                        p.deployments[0].status,
                    ]);
                    addLine(<pre className="whitespace-pre">{formatTable(headers, rows)}</pre>);
                } else {
                    addLine('No projects found.', 'output');
                }
                break;
            case 'deploy':
                const deployProjectName = args[0];
                if (!deployProjectName) {
                    addLine('Usage: deploy <project-name>', 'error');
                    break;
                }
                const projectToDeploy = projects.find(p => p.name.toLowerCase() === deployProjectName.toLowerCase());
                if (!projectToDeploy) {
                    addLine(`Error: Project "${deployProjectName}" not found.`, 'error');
                    break;
                }
                
                const newDeployment: Deployment = {
                    id: `dpl_cli_${Date.now()}`,
                    commit: `build(cli): Manual deployment trigger`,
                    branch: 'main',
                    timestamp: new Date().toISOString(),
                    status: DeploymentStatus.QUEUED,
                    url: projectToDeploy.domains.find(d => d.isPrimary)?.name || `https://${projectToDeploy.name}.void.app`,
                };
                
                const updatedProject = {
                    ...projectToDeploy,
                    deployments: [newDeployment, ...projectToDeploy.deployments],
                };
                onUpdateProject(updatedProject);
                
                addLine(`Deployment queued for ${projectToDeploy.name}.`, 'system');
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                for (const log of successBuildLogs) {
                    addLine(<div className="flex gap-2"><span className="text-zinc-600">{new Date().toLocaleTimeString()}</span><span>{`[${log.level}] ${log.message}`}</span></div>, log.level === 'SYSTEM' ? 'system' : 'output');
                    await new Promise(r => setTimeout(r, 200 + Math.random() * 200));
                }
                
                const finalDeployment = { ...newDeployment, status: DeploymentStatus.DEPLOYED };
                onUpdateProject({ ...updatedProject, deployments: [finalDeployment, ...updatedProject.deployments.slice(1)]});
                addLine(`Deployment successful! Live at ${finalDeployment.url}`, 'success');
                break;

            case 'logs':
                const logProjectName = args[0];
                 if (!logProjectName) {
                    addLine('Usage: logs <project-name>', 'error');
                    break;
                }
                const projectToLog = projects.find(p => p.name.toLowerCase() === logProjectName.toLowerCase());
                 if (!projectToLog) {
                    addLine(`Error: Project "${logProjectName}" not found.`, 'error');
                    break;
                }
                const latestDeployment = projectToLog.deployments[0];
                const logSource = latestDeployment.status === DeploymentStatus.ERROR ? buildLogs : successBuildLogs;
                addLine(`Showing logs for latest deployment: ${latestDeployment.id}`, 'system');
                logSource.forEach(log => {
                     addLine(<div className="flex gap-2"><span className="text-zinc-600">{new Date().toLocaleTimeString()}</span><span>{`[${log.level}] ${log.message}`}</span></div>, log.level === 'ERROR' ? 'error' : 'output');
                });
                break;
            
            case 'logout':
                addLine('Logging out...', 'system');
                await new Promise(r => setTimeout(r, 500));
                logout();
                break;

            default:
                addLine(`command not found: ${cmd}`, 'error');
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
            input: 'text-zinc-400',
            output: 'text-zinc-200',
            error: 'text-red-400',
            success: 'text-green-400',
            system: 'text-void-neon',
        };

        const baseClasses = "min-h-[20px]";

        if (line.isHtml) {
            return <div key={index} className={`${baseClasses} ${classMap[line.type]}`} dangerouslySetInnerHTML={{ __html: line.content as string }} />;
        }

        return <div key={index} className={`${baseClasses} ${classMap[line.type]}`}>{line.content}</div>;
    };


    return (
        <div 
            ref={containerRef}
            className="bg-black font-mono text-sm p-4 h-[75vh] overflow-y-auto border border-void-line rounded-lg focus-within:border-void-neon transition-colors"
            onClick={() => inputRef.current?.focus()}
        >
            <div className="space-y-1">
                {lines.map(renderLine)}
            </div>
            
            {!isProcessing ? (
                <div className="flex items-center gap-2">
                    <span className="text-void-accent">{user?.name.split(' ')[0].toLowerCase() || 'guest'}@void:~$</span>
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="bg-transparent border-none text-zinc-200 w-full focus:outline-none p-0"
                        autoFocus
                        spellCheck="false"
                        autoComplete="off"
                        aria-label="CLI Input"
                    />
                </div>
            ) : (
                 <div className="flex items-center gap-2 h-[20px]">
                    <span className="text-zinc-500">Processing...</span>
                </div>
            )}
        </div>
    );
};
