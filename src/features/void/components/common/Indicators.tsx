import React from 'react';
import { DeploymentStatus } from '../../types';

interface StatusIndicatorProps {
  status: DeploymentStatus;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status }) => {
  const baseClasses = "h-2.5 w-2.5 rounded-full";
  const statusConfig = {
    [DeploymentStatus.DEPLOYED]: {
      color: 'bg-green-500',
      pulseColor: 'bg-green-400',
      hasPulse: false
    },
    [DeploymentStatus.BUILDING]: {
      color: 'bg-yellow-500',
      pulseColor: 'bg-yellow-400',
      hasPulse: true
    },
    [DeploymentStatus.DEPLOYING]: {
      color: 'bg-blue-500',
      pulseColor: 'bg-blue-400',
      hasPulse: true
    },
    [DeploymentStatus.QUEUED]: {
      color: 'bg-zinc-500',
      pulseColor: 'bg-zinc-400',
      hasPulse: true
    },
    [DeploymentStatus.ERROR]: {
      color: 'bg-red-500',
      pulseColor: 'bg-red-400',
      hasPulse: false
    },
    [DeploymentStatus.CANCELED]: {
      color: 'bg-zinc-600',
      pulseColor: '',
      hasPulse: false
    },
  };

  const config = statusConfig[status];

  return (
    <span className="relative flex h-2.5 w-2.5 items-center justify-center">
      {config.hasPulse && <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${config.pulseColor} opacity-75`}></span>}
      <span className={`relative inline-flex rounded-full ${baseClasses} ${config.color}`}></span>
    </span>
  );
};


interface FrameworkIconProps {
  framework: string;
  size?: 'small' | 'large';
}

export const FrameworkIcon: React.FC<FrameworkIconProps> = ({ framework, size = 'small' }) => {
    const sizeClasses = size === 'small' ? 'h-7 w-7' : 'h-10 w-10';
    const textClasses = size === 'small' ? 'text-xs' : 'text-base';

    return (
        <div className={`flex items-center justify-center rounded-full bg-void-line border border-zinc-700 ${sizeClasses}`}>
            <span className={`font-bold text-zinc-400 ${textClasses}`}>
                {framework.slice(0, 2).toUpperCase()}
            </span>
        </div>
    );
};