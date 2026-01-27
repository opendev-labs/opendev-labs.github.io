
import React, { useState, useCallback } from 'react';
import type { Project, Deployment } from '../types';
import { DeploymentStatus } from '../types';
import { UploadIcon } from './common/Icons';

interface DropzoneProps {
  onNewDeployment: (project: Project) => void;
}

export const Dropzone: React.FC<DropzoneProps> = ({ onNewDeployment }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    // In a real app, you would handle the files: e.dataTransfer.files
    setIsDeploying(true);

    // Simulate deployment process
    setTimeout(() => {
      const newDeployment: Deployment = {
        id: `dpl_${Date.now()}`,
        commit: 'Initial deployment via drag-and-drop',
        branch: 'main',
        timestamp: new Date().toISOString(),
        status: DeploymentStatus.BUILDING,
        url: `https://new-project-${Date.now().toString().slice(-5)}.opendev.app`,
      };

      const newProject: Project = {
        id: `proj_${Date.now()}`,
        name: 'new-react-app',
        framework: 'React',
        lastUpdated: 'Just now',
        deployments: [newDeployment],
        domains: [],
        envVars: {},
      };

      onNewDeployment(newProject);
      setIsDeploying(false);
    }, 2000);
  }, [onNewDeployment]);

  const dropzoneClasses = `
    border-2 border-dashed rounded-lg p-12 text-center transition-all duration-300
    ${isDragging ? 'border-white bg-white/5' : 'border-zinc-900 hover:border-white/50'}
  `;

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={dropzoneClasses}
    >
      {isDeploying ? (
        <div className="flex flex-col items-center justify-center">
          <div className="w-8 h-8 border-2 border-dashed rounded-full animate-spin border-zinc-400"></div>
          <p className="mt-4 text-zinc-300">Initiating deployment...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <UploadIcon />
          <p className="mt-4 text-lg font-semibold text-zinc-300">Drag & drop your project here</p>
          <p className="text-sm text-zinc-500">or click to browse files</p>
        </div>
      )}
    </div>
  );
};
