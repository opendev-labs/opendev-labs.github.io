import React from 'react';
import type { TeamMember } from '../../types';
import { TeamMemberRole } from '../../types';

export const TeamTab: React.FC<{ members: TeamMember[] }> = ({ members }) => {

    const handleInvite = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Invitation simulation: Dispatching neural handshake...");
    };

    return (
        <div className="border border-zinc-900 bg-black overflow-hidden">
            <div className="px-8 py-10 border-b border-zinc-900 bg-zinc-950/50">
                <h3 className="text-xl font-bold text-white tracking-tighter mb-2">Fleet Registry</h3>
                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Authorized neural nodes.</p>
            </div>

            <div className="divide-y divide-zinc-900">
                {members.map(member => (
                    <div key={member.id} className="p-8 flex justify-between items-center hover:bg-zinc-950/50 transition-all">
                        <div className="flex items-center gap-6">
                            <div className="w-12 h-12 border border-zinc-900 flex items-center justify-center bg-black overflow-hidden">
                                <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover grayscale opacity-60 group-hover:opacity-100 transition-all duration-500" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-[13px] font-bold text-white tracking-tight">{member.name}</p>
                                <p className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">{member.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-10">
                            <span className={`text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1 border ${member.role === TeamMemberRole.OWNER ? 'border-white text-white' : 'border-zinc-900 text-zinc-600'}`}>
                                {member.role === TeamMemberRole.OWNER ? 'PROTOCOL' : member.role}
                            </span>
                            {member.role !== TeamMemberRole.OWNER && (
                                <button className="text-[10px] font-bold text-zinc-800 hover:text-red-900 uppercase tracking-widest transition-colors">Sever</button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-10 border-t border-zinc-900 bg-zinc-950/20">
                <h4 className="text-[10px] font-bold text-white uppercase tracking-widest mb-6">Authorize Node</h4>
                <form onSubmit={handleInvite} className="flex gap-4">
                    <input
                        type="email"
                        placeholder="node-identity@nexus.sh"
                        className="flex-grow h-12 bg-black border border-zinc-900 px-6 text-[11px] font-mono text-white placeholder:text-zinc-800 focus:outline-none focus:border-white transition-all"
                    />
                    <button type="submit" className="h-12 bg-white text-black font-bold uppercase tracking-widest px-10 hover:bg-zinc-200 transition-all">
                        Authorize
                    </button>
                </form>
            </div>
        </div>
    );
};

