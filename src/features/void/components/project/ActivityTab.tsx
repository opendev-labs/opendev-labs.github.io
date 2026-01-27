import React from 'react';
import type { ActivityEvent } from '../../types';
import { DeploymentStatus } from '../../types';
import { StatusIndicator } from '../common/Indicators';
import { ClockIcon, UserGroupIcon, LinkIcon, DatabaseIcon, PuzzlePieceIcon, GitBranchIcon, CubeIcon } from '../common/Icons';

const eventTypeToIcon = (type: ActivityEvent['type']) => {
    const iconClass = "h-4 w-4 text-zinc-500";
    switch (type) {
        case 'Deployment':
            return <StatusIndicator status={DeploymentStatus.DEPLOYED} />;
        case 'Domain':
            return <LinkIcon className={iconClass} />;
        case 'Settings':
            return <UserGroupIcon className={iconClass} />;
        case 'Storage':
            return <DatabaseIcon className={iconClass} />;
        case 'Integration':
            return <PuzzlePieceIcon className={iconClass} />;
        case 'Git':
            return <GitBranchIcon className={iconClass} />;
        default:
            return <ClockIcon className={iconClass} />;
    }
};

const timeSince = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "Y";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "M";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "D";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "H";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "M";
    return Math.floor(seconds) + "S";
}

export const ActivityTab: React.FC<{ events: ActivityEvent[] }> = ({ events }) => {
    return (
        <div className="border border-zinc-900 bg-black overflow-hidden">
            <div className="px-8 py-5 border-b border-zinc-900 bg-zinc-950/50">
                <h3 className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">Protocol History</h3>
            </div>
            <div className="divide-y divide-zinc-900">
                {events.map(event => (
                    <div key={event.id} className="grid grid-cols-12 gap-6 p-8 items-start hover:bg-zinc-950/50 transition-all">
                        <div className="col-span-1 flex justify-center pt-1">{eventTypeToIcon(event.type)}</div>
                        <div className="col-span-9 space-y-1">
                            <p className="text-[13px] font-bold text-white leading-relaxed">{event.description}</p>
                            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">via {event.actor}</p>
                        </div>
                        <div className="col-span-2 text-right text-[10px] font-bold text-zinc-700 uppercase tracking-widest pt-1">
                            {timeSince(new Date(event.timestamp))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};