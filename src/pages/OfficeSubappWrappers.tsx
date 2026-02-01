import React, { useState, useEffect } from 'react';
import { Dashboard } from '../features/void/components/Dashboard';
import { ConsoleView as LamaDBConsole } from './LamaDB';
import { useAuth } from '../features/void/hooks/useAuth';
import { LamaDB } from '../lib/lamaDB';
import { Project } from '../features/void/types';
import { GlobalLoader } from '../features/void/components/common/GlobalLoader';
import { SyncStackConsole } from './SyncStackConsole';

export const VoidOfficeCockpit: React.FC = () => {
    const { isAuthenticated, user } = useAuth();
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            if (!isAuthenticated || !user) return;
            try {
                const userContext = { uid: user.email, email: user.email };
                const userProjects = await LamaDB.store.collection('projects', userContext).get() as Project[];
                setProjects(userProjects.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()));
            } catch (error) {
                console.error("Failed to fetch office projects:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProjects();
    }, [isAuthenticated, user]);

    if (isLoading) return <GlobalLoader />;

    return (
        <div className="pt-24">
            <Dashboard projects={projects} onUpdateProject={(updated) => setProjects(prev => prev.map(p => p.id === updated.id ? updated : p))} />
        </div>
    );
};

export const LamaDBOfficeCockpit: React.FC = () => {
    return (
        <div className="-mt-24">
            <LamaDBConsole />
        </div>
    );
};

export const SyncStackOfficeCockpit: React.FC = () => {
    return (
        <div className="pt-0 h-screen bg-black overflow-hidden">
            <SyncStackConsole />
        </div>
    );
};
