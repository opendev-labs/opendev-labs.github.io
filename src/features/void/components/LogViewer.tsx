import React, { useEffect, useRef } from 'react';
import type { LogEntry } from '../types';
import { LogLevel } from '../types';

interface LogViewerProps {
  logs: LogEntry[];
  isBuilding: boolean;
  currentBuildStatusText: string;
}

const getLogLevelColor = (level: LogLevel): string => {
  switch (level) {
    case LogLevel.ERROR:
      return 'text-red-400';
    case LogLevel.WARN:
      return 'text-yellow-400';
    case LogLevel.SYSTEM:
      return 'text-void-neon';
    case LogLevel.DEBUG:
        return 'text-zinc-500';
    default:
      return 'text-zinc-300';
  }
};

const getStatusColorClasses = (statusText: string) => {
    const text = statusText.toLowerCase();
    if (text.includes('deploying')) {
        return { text: 'text-blue-400', ping: 'bg-blue-400', dot: 'bg-blue-500' };
    }
    if (text.includes('building') || text.includes('cloning') || text.includes('installing')) {
        return { text: 'text-yellow-400', ping: 'bg-yellow-400', dot: 'bg-yellow-500' };
    }
    return { text: 'text-zinc-400', ping: 'bg-zinc-400', dot: 'bg-zinc-500' }; // for Queued
}

export const LogViewer: React.FC<LogViewerProps> = ({ logs, isBuilding, currentBuildStatusText }) => {
  const logContainerRef = useRef<HTMLDivElement>(null);
  const statusColors = getStatusColorClasses(currentBuildStatusText);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-void-card border border-void-line rounded-lg flex flex-col flex-grow">
      <div className="flex justify-between items-center p-4 border-b border-void-line">
        <h3 className="font-semibold text-white">Real-time Logs</h3>
        {isBuilding && (
            <div className={`flex items-center gap-2 text-sm font-medium ${statusColors.text}`}>
                <span className="relative flex h-2.5 w-2.5">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${statusColors.ping} opacity-75`}></span>
                    <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${statusColors.dot}`}></span>
                </span>
                {currentBuildStatusText}...
            </div>
        )}
      </div>
      <div ref={logContainerRef} className="p-4 overflow-y-auto font-mono text-sm bg-black rounded-b-lg flex-grow">
        {logs.map((log, index) => (
          <div key={index} className="flex">
            <span className="text-zinc-600 mr-4 select-none">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}</span>
            <div className={`flex-grow ${log.level !== LogLevel.SYSTEM ? 'ml-4' : ''}`}>
                <span className={`${getLogLevelColor(log.level)}`}>
                  <span className="font-bold w-16 inline-block opacity-60">{`[${log.level}]`}</span>
                  <span>
                    {log.message}
                  </span>
                </span>
            </div>
          </div>
        ))}
        {isBuilding && <div className="w-3 h-3 bg-white animate-pulse mt-2"></div>}
      </div>
    </div>
  );
};