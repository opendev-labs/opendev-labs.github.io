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
    const isPostgres = type === DatabaseType.POSTGRES;
    return (
        <div className="w-10 h-10 bg-black border border-zinc-900 flex items-center justify-center font-bold text-[10px] text-zinc-600 uppercase tracking-widest">
            {isPostgres ? 'SQL' : 'KVS'}
        </div>
    )
};


export const StorageTab: React.FC<{ databases: Database[] }> = ({ databases }) => {

    const handleAddDatabase = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Simulation: Initializing new registry node...");
    };

    return (
        <div className="border border-zinc-900 bg-black overflow-hidden">
            <div className="px-8 py-10 border-b border-zinc-900 bg-zinc-950/50">
                <h3 className="text-xl font-bold text-white tracking-tighter mb-2">Edge Storage</h3>
                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Distributed protocol registries.</p>
            </div>

            <div className="divide-y divide-zinc-900">
                {databases.map(db => (
                    <div key={db.id} className="p-8 grid grid-cols-12 gap-8 items-center hover:bg-zinc-950/50 transition-all">
                        <div className="col-span-5 flex items-center gap-6">
                            <DatabaseIcon type={db.type} />
                            <div className="space-y-1">
                                <p className="text-[13px] font-bold text-white tracking-tight">{db.name}</p>
                                <p className="text-[10px] font-bold text-zinc-700 uppercase tracking-[0.2em]">{db.type} {db.version}</p>
                            </div>
                        </div>
                        <div className="col-span-3 flex items-center gap-3">
                            <DatabaseStatusIndicator status={db.status} />
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none">{db.status}</span>
                        </div>
                        <div className="col-span-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{db.region}</div>
                        <div className="col-span-2 text-right">
                            <button className="text-[10px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest transition-colors">Configure</button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-10 border-t border-zinc-900 bg-zinc-950/20">
                <form onSubmit={handleAddDatabase} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-2">
                        <h4 className="text-[10px] font-bold text-white uppercase tracking-widest">Initialize Registry Node</h4>
                        <p className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">Provision a new PostgreSQL or Redis instance across the nexus.</p>
                    </div>
                    <button type="submit" className="h-12 border border-zinc-900 px-8 text-[10px] font-bold text-zinc-500 uppercase tracking-widest hover:border-white hover:text-white transition-all">
                        Initialize
                    </button>
                </form>
            </div>
        </div>
    );
};

