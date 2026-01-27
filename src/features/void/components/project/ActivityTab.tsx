import React from 'react';
import type { ActivityEvent } from '../../types';
import { DeploymentStatus } from '../../types';
import { StatusIndicator } from '../common/Indicators';
import { ClockIcon, UserGroupIcon, LinkIcon, DatabaseIcon, PuzzlePieceIcon, GitBranchIcon } from '../common/Icons';

const eventTypeToIcon = (type: ActivityEvent['type']) => {
    switch (type) {
        case 'Deployment':
            return <StatusIndicator status={DeploymentStatus.DEPLOYED} />; // Re-using for icon
        case 'Domain':
            return <LinkIcon />;
        case 'Settings':
            return <UserGroupIcon />; // Placeholder
        case 'Storage':
            return <DatabaseIcon />;
        case 'Integration':
            return <PuzzlePieceIcon />;
        case 'Git':
            return <GitBranchIcon className="h-4 w-4 text-zinc-400" />;
        default:
            return <ClockIcon />;
    }
};

const timeSince = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
}

export const ActivityTab: React.FC<{ events: ActivityEvent[] }> = ({ events }) => {
    return (
        <div className="bg-void-card border border-void-line rounded-lg">
            <div className="p-6 border-b border-void-line">
                <h3 className="font-semibold text-white text-xl">Project Activity</h3>
            </div>
            <div className="p-4 space-y-2">
                {events.map(event => (
                    <div key={event.id} className="grid grid-cols-12 gap-4 p-3 items-start">
                        <div className="col-span-1 flex justify-center pt-1">{eventTypeToIcon(event.type)}</div>
                        <div className="col-span-8">
                            <p className="text-white font-medium">{event.description}</p>
                            <p className="text-zinc-400 text-xs">by {event.actor}</p>
                        </div>
                        <div className="col-span-3 text-right text-zinc-500 text-xs pt-1">
                           {timeSince(new Date(event.timestamp))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};