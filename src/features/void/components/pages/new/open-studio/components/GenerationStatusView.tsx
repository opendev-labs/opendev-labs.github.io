import React from 'react';
import type { GenerationInfo } from '../types';
import { TaskStatusIcon, SpinnerIcon, CheckCircleIcon, NewChatIcon, PencilIcon, TrashIcon } from './icons/Icons';

interface GenerationStatusViewProps {
  info: GenerationInfo;
}

export function GenerationStatusView({ info }: GenerationStatusViewProps) {
  const fileCount = info.files.length;
  const title = info.status === 'generating' 
    ? `Applying ${fileCount} change${fileCount !== 1 ? 's' : ''}`
    : `Applied ${fileCount} change${fileCount !== 1 ? 's' : ''}`;

  return (
    <div className="mt-4 border border-white/10 rounded-lg p-3 bg-black/20">
      <div className="flex items-center gap-2 mb-3">
        <TaskStatusIcon className="w-4 h-4 text-gray-400" />
        <h3 className="text-sm font-semibold text-white">
          {title}
        </h3>
      </div>
      <ul className="space-y-2">
        {info.files.map((file, index) => (
          <li key={index} className="flex items-center justify-between text-xs text-gray-400">
             <div className="flex items-center gap-2">
                {file.action === 'created' ? (
                    <NewChatIcon className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                ) : file.action === 'modified' ? (
                    <PencilIcon className="w-3.5 h-3.5 text-yellow-500 flex-shrink-0" />
                ) : (
                    <TrashIcon className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                )}
                <span className="font-mono">{file.path}</span>
            </div>
            {file.status === 'generating' ? (
              <SpinnerIcon className="w-3.5 h-3.5 animate-spin text-gray-500" />
            ) : (
              <CheckCircleIcon className="w-3.5 h-3.5 text-green-500" />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
