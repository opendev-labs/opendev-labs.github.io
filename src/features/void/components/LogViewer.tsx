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
      return 'text-red-500';
    case LogLevel.WARN:
      return 'text-yellow-600';
    case LogLevel.SYSTEM:
      return 'text-white font-bold';
    case LogLevel.DEBUG:
      return 'text-zinc-700';
    default:
      return 'text-zinc-500';
  }
};

const getStatusColorClasses = (statusText: string) => {
  const text = statusText.toLowerCase();
  if (text.includes('deploying') || text.includes('building') || text.includes('cloning') || text.includes('installing')) {
    return { text: 'text-white', ping: 'bg-white', dot: 'bg-white' };
  }
  return { text: 'text-zinc-600', ping: 'bg-zinc-600', dot: 'bg-zinc-700' };
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
    <div className="border border-zinc-900 bg-black flex flex-col flex-grow min-h-[500px]">
      <div className="flex justify-between items-center px-8 py-5 border-b border-zinc-900 bg-zinc-950/50">
        <h3 className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">Real-time Telemetry</h3>
        {isBuilding && (
          <div className={`flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest ${statusColors.text}`}>
            <span className="relative flex h-1.5 w-1.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${statusColors.ping} opacity-40`}></span>
              <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${statusColors.dot}`}></span>
            </span>
            {currentBuildStatusText}
          </div>
        )}
      </div>
      <div ref={logContainerRef} className="p-8 overflow-y-auto font-mono text-[13px] bg-black flex-grow selection:bg-white selection:text-black">
        <div className="space-y-2">
          {logs.map((log, index) => (
            <div key={index} className="flex leading-relaxed group">
              <span className="text-zinc-800 text-[11px] font-bold mr-6 select-none shrink-0 w-20">
                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
              </span>
              <div className="flex-grow">
                <span className={`${getLogLevelColor(log.level)}`}>
                  <span className="opacity-30 mr-3 text-[11px] font-bold uppercase tracking-tighter">{log.level}</span>
                  <span className="tracking-tight font-medium">
                    {log.message}
                  </span>
                </span>
              </div>
            </div>
          ))}
          {isBuilding && (
            <div className="flex gap-1.5 mt-4">
              <div className="w-1.5 h-1.5 bg-zinc-700 rounded-full animate-pulse"></div>
              <div className="w-1.5 h-1.5 bg-zinc-700 rounded-full animate-pulse [animation-delay:200ms]"></div>
              <div className="w-1.5 h-1.5 bg-zinc-700 rounded-full animate-pulse [animation-delay:400ms]"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};