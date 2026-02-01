import React from 'react';
import type { Database } from '../../types';
import { DatabaseStatus, DatabaseType } from '../../types';

const DatabaseStatusIndicator: React.FC<{ status: DatabaseStatus }> = ({ status }) => {
    const config = {
        [DatabaseStatus.ACTIVE]: 'bg-white',
        [DatabaseStatus.CREATING]: 'bg-zinc-800',
        [DatabaseStatus.ERROR]: 'bg-red-600',
    };
    return <div className={`w-1.5 h-1.5 rounded-full ${config[status]}`}></div>;
};

const DatabaseIcon: React.FC<{ type: DatabaseType }> = ({ type }) => {
    const config = {
        [DatabaseType.POSTGRES]: { label: 'SQL', color: 'text-zinc-600' },
        [DatabaseType.REDIS]: { label: 'KVS', color: 'text-red-500' },
        [DatabaseType.SUPABASE]: { label: 'SUPA', color: 'text-emerald-500' },
        [DatabaseType.NEON]: { label: 'NEON', color: 'text-zinc-400' },
        [DatabaseType.MONGODB]: { label: 'DOC', color: 'text-green-600' },
        [DatabaseType.LAMADB]: { label: 'LAMA', color: 'text-orange-500' },
    };
    const item = config[type] || { label: 'DB', color: 'text-zinc-600' };

    return (
        <div className="w-10 h-10 bg-black border border-zinc-900 flex items-center justify-center font-bold text-[9px] uppercase tracking-widest shrink-0">
            <span className={item.color}>{item.label}</span>
        </div>
    )
};


import { availableIntegrations } from '../../constants';

export const StorageTab: React.FC<{ databases: Database[] }> = ({ databases }) => {
    const databaseIntegrations = availableIntegrations.filter(i => i.category === 'Database');

    const handleInitialize = (id: string) => {
        alert(`Initializing synchronization bridge with ${id}. Awaiting handshake...`);
    };

    return (
        <div className="space-y-12">
            <div className="border border-zinc-900 bg-black overflow-hidden">
                <div className="px-8 py-10 border-b border-zinc-900 bg-zinc-950/50 flex justify-between items-end">
                    <div>
                        <h3 className="text-xl font-bold text-white tracking-tighter mb-2">Active Resources</h3>
                        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Distributed protocol registries currently in fleet.</p>
                    </div>
                </div>

                <div className="divide-y divide-zinc-900">
                    {databases.map(db => (
                        <div key={db.id} className="p-8 grid grid-cols-12 gap-8 items-center hover:bg-zinc-950/50 transition-all">
                            <div className="col-span-12 md:col-span-5 flex items-center gap-6">
                                <DatabaseIcon type={db.type} />
                                <div className="space-y-1">
                                    <p className="text-[13px] font-bold text-white tracking-tight">{db.name}</p>
                                    <p className="text-[10px] font-bold text-zinc-700 uppercase tracking-[0.2em]">{db.type} {db.version}</p>
                                </div>
                            </div>
                            <div className="col-span-6 md:col-span-3 flex items-center gap-3">
                                <DatabaseStatusIndicator status={db.status} />
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none">{db.status}</span>
                            </div>
                            <div className="col-span-6 md:col-span-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{db.region}</div>
                            <div className="col-span-12 md:col-span-2 text-right">
                                <button className="h-10 w-full md:w-auto px-6 border border-zinc-900 text-[10px] font-bold text-zinc-500 hover:border-white hover:text-white uppercase tracking-widest transition-all">Manage</button>
                            </div>
                        </div>
                    ))}
                    {databases.length === 0 && (
                        <div className="p-20 text-center">
                            <p className="text-[10px] font-bold text-zinc-700 uppercase tracking-[0.3em]">No active storage nodes.</p>
                        </div>
                    )}
                </div>
            </div>

            <div>
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-[1px] flex-1 bg-zinc-900"></div>
                    <h3 className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.4em]">Protocol Marketplace</h3>
                    <div className="h-[1px] flex-1 bg-zinc-900"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {databaseIntegrations.map(integration => (
                        <div key={integration.id} className="border border-zinc-900 bg-black p-8 hover:border-zinc-700 transition-all group flex flex-col justify-between h-64">
                            <div>
                                <div className="flex items-start justify-between mb-6">
                                    <div className="w-12 h-12 bg-white border border-zinc-900 p-2.5 shrink-0 flex items-center justify-center">
                                        <img src={integration.logoUrl} alt={integration.name} className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500" />
                                    </div>
                                    <span className="text-[9px] font-bold text-zinc-700 border border-zinc-900 px-2 py-0.5 uppercase tracking-widest group-hover:text-zinc-500 transition-colors">Enterprise</span>
                                </div>
                                <h4 className="text-lg font-bold text-white tracking-tighter mb-2">{integration.name}</h4>
                                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-relaxed line-clamp-2">{integration.description}</p>
                            </div>
                            <button
                                onClick={() => handleInitialize(integration.id)}
                                className="h-12 w-full bg-white text-black text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all mt-6"
                            >
                                Initialize Bridge
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

