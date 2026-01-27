
import React from 'react';
import type { TeamMember } from '../../types';
import { TeamMemberRole } from '../../types';

export const TeamTab: React.FC<{ members: TeamMember[] }> = ({ members }) => {

    const handleInvite = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulation: In a real app, this would trigger an invitation flow.
        alert("Invitation simulation: The user would receive an email to join the project.");
    };

    return (
        <div className="bg-void-card border border-void-line rounded-lg">
            <div className="p-6">
                <h3 className="font-semibold text-white text-xl">Project Members</h3>
                <p className="text-zinc-400 text-sm mt-1">Manage who has access to this project.</p>
            </div>
            
            <div className="divide-y divide-void-line">
                {members.map(member => (
                    <div key={member.id} className="p-4 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <img src={member.avatarUrl} alt={member.name} className="w-9 h-9" />
                            <div>
                                <p className="font-semibold text-white">{member.name}</p>
                                <p className="text-xs text-zinc-400">{member.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-0.5 ${member.role === TeamMemberRole.OWNER ? 'bg-void-neon/20 text-void-neon' : 'bg-zinc-700 text-zinc-300'}`}>
                                {member.role}
                            </span>
                             {member.role !== TeamMemberRole.OWNER && (
                                <button className="text-xs text-red-400 hover:underline">Remove</button>
                             )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-6 border-t border-void-line bg-void-line/20 rounded-b-lg">
                <h4 className="font-semibold text-white mb-3">Invite New Member</h4>
                <form onSubmit={handleInvite} className="flex gap-2">
                    <input
                        type="email"
                        placeholder="new-member@example.com"
                        className="flex-grow bg-void-card border border-void-line py-2 px-3 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-void-neon"
                    />
                    <button type="submit" className="bg-white text-black font-semibold px-4 py-2 hover:bg-zinc-200 transition-colors text-sm">
                        Invite
                    </button>
                </form>
            </div>
        </div>
    );
};
