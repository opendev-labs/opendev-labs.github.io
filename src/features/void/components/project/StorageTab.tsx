import React from 'react';
import type { Database } from '../../types';
import { DatabaseStatus, DatabaseType } from '../../types';

const DatabaseStatusIndicator: React.FC<{ status: DatabaseStatus }> = ({ status }) => {
    const config = {
        [DatabaseStatus.ACTIVE]: 'bg-green-500',
        [DatabaseStatus.CREATING]: 'bg-yellow-500',
        [DatabaseStatus.ERROR]: 'bg-red-500',
    };
    return <div className={`w-2.5 h-2.5 rounded-full ${config[status]}`}></div>;
};

const DatabaseIcon: React.FC<{ type: DatabaseType }> = ({ type }) => {
    const text = type === DatabaseType.POSTGRES ? 'Pg' : 'Re';
    return (
        <div className="w-8 h-8 rounded-full bg-void-line flex items-center justify-center font-bold text-sm text-zinc-300">
            {text}
        </div>
    )
};


export const StorageTab: React.FC<{ databases: Database[] }> = ({ databases }) => {
    
    const handleAddDatabase = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Simulation: This would open a modal to configure and create a new database instance.");
    };
    
    return (
        <div className="bg-void-card border border-void-line rounded-lg">
             <div className="p-6">
                <h3 className="font-semibold text-white text-xl">Project Storage</h3>
                <p className="text-zinc-400 text-sm mt-1">Manage databases connected to this project.</p>
            </div>

            <div className="divide-y divide-void-line">
                {databases.map(db => (
                    <div key={db.id} className="p-4 grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-5 flex items-center gap-3">
                            <DatabaseIcon type={db.type} />
                            <div>
                                <p className="font-semibold text-white">{db.name}</p>
                                <p className="text-xs text-zinc-400">{db.type} {db.version}</p>
                            </div>
                        </div>
                         <div className="col-span-3 flex items-center gap-2">
                             <DatabaseStatusIndicator status={db.status} />
                             <span className="text-zinc-300 text-sm">{db.status}</span>
                        </div>
                        <div className="col-span-2 text-zinc-400 text-sm">{db.region}</div>
                        <div className="col-span-2 text-right">
                            <button className="text-xs text-zinc-400 hover:text-white">Manage</button>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="p-6 border-t border-void-line bg-void-line/20 rounded-b-lg">
                <form onSubmit={handleAddDatabase} className="flex justify-between items-center">
                    <div>
                        <h4 className="font-semibold text-white">Add New Database</h4>
                        <p className="text-xs text-zinc-500 mt-1">Create a new PostgreSQL or Redis instance.</p>
                    </div>
                    <button type="submit" className="bg-white text-black font-semibold px-4 py-2 hover:bg-zinc-200 transition-colors text-sm">
                        Add New
                    </button>
                </form>
            </div>
        </div>
    );
};
