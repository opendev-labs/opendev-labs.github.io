import React from 'react';
import { DeploymentStatus } from '../../types';
import { CubeIcon } from '../common/Icons';

interface StatusIndicatorProps {
  status: DeploymentStatus;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status }) => {
  const baseClasses = "h-2 w-2 rounded-full";
  const statusConfig = {
    [DeploymentStatus.DEPLOYED]: {
      color: 'bg-white',
      pulseColor: 'bg-white',
      hasPulse: false
    },
    [DeploymentStatus.BUILDING]: {
      color: 'bg-zinc-500',
      pulseColor: 'bg-zinc-400',
      hasPulse: true
    },
    [DeploymentStatus.DEPLOYING]: {
      color: 'bg-zinc-400',
      pulseColor: 'bg-zinc-300',
      hasPulse: true
    },
    [DeploymentStatus.QUEUED]: {
      color: 'bg-zinc-800',
      pulseColor: 'bg-zinc-700',
      hasPulse: true
    },
    [DeploymentStatus.ERROR]: {
      color: 'bg-red-600',
      pulseColor: 'bg-red-500',
      hasPulse: false
    },
    [DeploymentStatus.CANCELED]: {
      color: 'bg-zinc-900',
      pulseColor: '',
      hasPulse: false
    },
  };

  const config = statusConfig[status];

  return (
    <span className="relative flex h-2 w-2 items-center justify-center">
      {config.hasPulse && <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${config.pulseColor} opacity-40`}></span>}
      <span className={`relative inline-flex rounded-full ${baseClasses} ${config.color}`}></span>
    </span>
  );
};


interface FrameworkIconProps {
  framework: string;
  size?: 'small' | 'large';
}

export const FrameworkIcon: React.FC<FrameworkIconProps> = ({ framework, size = 'small' }) => {
  const sizeClasses = size === 'small' ? 'h-8 w-8' : 'h-12 w-12';
  const iconSize = size === 'small' ? 'w-4 h-4' : 'w-6 h-6';
  const isNext = framework.toLowerCase().includes('next');

  return (
    <div className={`flex items-center justify-center bg-black border border-zinc-900 ${sizeClasses}`}>
      {isNext ? (
        <svg viewBox="0 0 180 180" className={`${iconSize} fill-white`}><path d="M90 0a90 90 0 1 0 0 180A90 90 0 0 0 90 0Zm33.66 128.23-42.34-54.66-20.2 26.24v28.42H48.4V51.77h12.72v44.64l38.74-51.2 5.09-6.73h17.65l-44.5 57.5 25.56 32.25Z" /></svg>
      ) : (
        <CubeIcon className={`${iconSize} text-white`} />
      )}
    </div>
  );
};