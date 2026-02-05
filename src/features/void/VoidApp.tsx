import React, { useState, useEffect, Suspense } from 'react';
import { Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
const Dashboard = React.lazy(() => import('./components/Dashboard').then(m => ({ default: m.Dashboard })));
const ProjectDetailView = React.lazy(() => import('./components/ProjectDetailView').then(m => ({ default: m.ProjectDetailView })));
const DocsPage = React.lazy(() => import('./components/pages/DocsPage').then(m => ({ default: m.DocsPage })));
const NewProjectPage = React.lazy(() => import('./components/pages/NewProjectPage').then(m => ({ default: m.NewProjectPage })));
const PricingPage = React.lazy(() => import('./components/pages/PricingPage').then(m => ({ default: m.PricingPage })));
const UpgradePage = React.lazy(() => import('./components/pages/UpgradePage').then(m => ({ default: m.UpgradePage })));
const VerifyEmailPage = React.lazy(() => import('./components/pages/VerifyEmailPage').then(m => ({ default: m.VerifyEmailPage })));
const AuthPage = React.lazy(() => import('./components/pages/AuthPage').then(m => ({ default: m.AuthPage })));
const HomePage = React.lazy(() => import('./components/pages/HomePage').then(m => ({ default: m.HomePage })));
const UsagePage = React.lazy(() => import('./components/pages/UsagePage').then(m => ({ default: m.UsagePage })));
const NotFoundPage = React.lazy(() => import('./components/pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));
const CLIPage = React.lazy(() => import('./components/pages/CLIPage').then(m => ({ default: m.CLIPage })));
const SettingsPage = React.lazy(() => import('./components/pages/SettingsPage').then(m => ({ default: m.SettingsPage })));
const DeploymentPage = React.lazy(() => import('./components/pages/DeploymentPage').then(m => ({ default: m.DeploymentPage })));
import type { Project, Template, Deployment, GitProvider, Repository, Workflow, DeploymentPlatform } from './types';
import { DeploymentStatus, DatabaseType, DatabaseStatus } from './types';
import { mockProjects, generateInitialProjectData, availableIntegrations } from './constants';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useAuth } from './hooks/useAuth';
import { GlobalLoader } from './components/common/GlobalLoader';
import { StatusFooter } from './components/common/StatusFooter';
import { GitHubCallbackHandler } from './components/auth/GitHubCallbackHandler';
import { REAL_TEMPLATES } from './real_templates';
import { motion, AnimatePresence } from 'framer-motion';

import { LamaDB } from '../../lib/lamaDB';

const MotionDiv = motion.div;

const AppContent: React.FC = () => {
    // State management refactored to use LamaDB (Firestore/IndexedDB) instead of localStorage
    const [projects, setProjects] = useState<Project[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const { isAuthenticated, user, createRepository, uploadFile } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Fetch User-Scoped Projects from LamaDB
    useEffect(() => {
        const fetchProjects = async () => {
            if (!isAuthenticated || !user) return;

            try {
                // Stateless API: requires user context
                const userContext = { uid: user.email, email: user.email };
                const userProjects = await LamaDB.store.collection('projects', userContext).get() as Project[];
                if (userProjects.length > 0) {
                    setProjects(userProjects.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()));
                } else {
                    // Seed initial data if empty (Simulated "Welcome" state) without writing it persistently yet
                    // or write it if you want every new user to have mocks. Let's start empty or simple.
                    // For now, let's keep it empty to prove isolation, or maybe just one welcome project.
                    setProjects([]);
                }
            } catch (error) {
                console.error("Failed to fetch projects:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchProjects();
        } else {
            // Public/Demo mode
            setProjects(mockProjects);
            setIsLoading(false);
        }

    }, [isAuthenticated, user]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.has('code')) {
            setIsAuthenticating(true);
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            document.body.classList.add('authenticated');
        } else {
            document.body.classList.remove('authenticated');
        }
    }, [isAuthenticated]);

    if (isAuthenticating) {
        return <GitHubCallbackHandler />;
    }

    if (isLoading) {
        return <GlobalLoader />;
    }

    const handleUpdateProject = (updatedProject: Project) => {
        setProjects(prevProjects => prevProjects.map(p => p.id === updatedProject.id ? updatedProject : p));
    };

    const handleDeployTemplate = async (template: Template, projectName: string, platform: DeploymentPlatform, isPrivate?: boolean) => {
        const urlFriendlyName = projectName.toLowerCase().replace(/\s+/g, '-');

        const newDeployment: Deployment = {
            id: `dpl_${Date.now()}`,
            commit: `Initial deployment from ${template.name} template`,
            branch: 'main',
            timestamp: new Date().toISOString(),
            status: DeploymentStatus.QUEUED,
            url: `https://${urlFriendlyName}.${platform === 'github' ? 'github.io' : platform + '.app'}`,
        };

        const newProject: Project = {
            id: `proj_${Date.now()}`,
            name: projectName,
            framework: template.framework,
            lastUpdated: new Date().toISOString(),
            deployments: [newDeployment],
            domains: [{ name: `https://${urlFriendlyName}.${platform === 'github' ? 'github.io' : platform + '.app'}`, isPrimary: true }],
            envVars: {},
            ...generateInitialProjectData(),
        };

        // Write to LamaDB (User Scoped)
        if (isAuthenticated && user) {
            const userContext = { uid: user.email, email: user.email };
            await LamaDB.store.collection('projects', userContext).add(newProject);
        }

        setProjects(prev => [newProject, ...prev]);
        navigate(`/void/projects/${newProject.id}`);
    };

    const handleImportRepository = async (repo: Repository, projectName: string) => {
        const urlFriendlyName = projectName.toLowerCase().replace(/\s+/g, '-');
        const newDeployment: Deployment = {
            id: `dpl_${repo.provider}_${repo.id}_${Date.now()}`,
            commit: `Initial import from ${repo.provider}`,
            branch: 'main',
            timestamp: new Date().toISOString(),
            status: DeploymentStatus.QUEUED,
            url: `https://${urlFriendlyName}.void.app`,
        };

        const newProject: Project = {
            id: `proj_${repo.provider}_${repo.id}_${Date.now()}`,
            name: projectName,
            framework: 'Node.js',
            lastUpdated: new Date().toISOString(),
            deployments: [newDeployment],
            domains: [{ name: `https://${urlFriendlyName}.void.app`, isPrimary: true }],
            envVars: {},
            ...generateInitialProjectData(),
        };

        // Write to LamaDB (User Scoped)
        if (isAuthenticated && user) {
            const userContext = { uid: user.email, email: user.email };
            try {
                await LamaDB.store.collection('projects', userContext).add(newProject);
            } catch (err) {
                console.error("Failed to persist imported project:", err);
            }
        }

        setProjects(prev => [newProject, ...prev]);
        navigate(`/void/projects/${newProject.id}`);
    };

    const handleDeployWorkflow = (workflow: Workflow, projectName: string) => {
        const urlFriendlyName = projectName.toLowerCase().replace(/\s+/g, '-');
        const newDeployment: Deployment = {
            id: `dpl_wf_${Date.now()}`,
            commit: `Initial deployment from ${workflow.name} workflow`,
            branch: 'main',
            timestamp: new Date().toISOString(),
            status: DeploymentStatus.QUEUED,
            url: `https://${urlFriendlyName}.void.app`,
        };

        const frameworkComponent = workflow.components.find(c => c.type === 'framework');

        const newProject: Project = {
            id: `proj_wf_${Date.now()}`,
            name: projectName,
            framework: frameworkComponent?.name || 'Workflow',
            lastUpdated: 'Just now',
            deployments: [newDeployment],
            domains: [{ name: `https://${urlFriendlyName}.void.app`, isPrimary: true }],
            envVars: {},
            ...generateInitialProjectData(),
            storage: [],
            integrations: [],
        };

        workflow.components.forEach(component => {
            if (component.type === 'database') {
                const dbType = component.name.toLowerCase().includes('postgre') ? DatabaseType.POSTGRES : DatabaseType.REDIS;
                newProject.storage?.push({
                    id: `db_${Date.now()}`,
                    name: `${urlFriendlyName}-${dbType.toLowerCase()}-db`,
                    type: dbType,
                    region: 'us-east-1 (CLE)',
                    status: DatabaseStatus.ACTIVE,
                    version: dbType === DatabaseType.POSTGRES ? '14.8' : '7.2',
                });
                newProject.envVars[dbType === DatabaseType.POSTGRES ? 'DATABASE_URL' : 'REDIS_URL'] = `${dbType.toLowerCase()}://${urlFriendlyName}...`;
            }

            if (component.type === 'service') {
                const integrationToAdd = availableIntegrations.find(i => i.name.toLowerCase() === component.name.toLowerCase());
                if (integrationToAdd) {
                    newProject.integrations?.push({ ...integrationToAdd, isConnected: true });
                }
            }
        });

        setProjects(prev => [newProject, ...prev]);

        // Write to LamaDB (User Scoped)
        if (isAuthenticated && user) {
            const userContext = { uid: user.email, email: user.email };
            LamaDB.store.collection('projects', userContext).add(newProject).catch(err => {
                console.error("Failed to persist workflow project:", err);
            });
        }

        navigate(`/sub0/projects/${newProject.id}`);
    };

    return (
        <div className="min-h-screen bg-black font-sans flex flex-col selection:bg-white selection:text-black">
            <Header />
            <main className="flex-grow relative z-10 flex flex-col container mx-auto px-4 py-8">
                <Suspense fallback={<GlobalLoader />}>
                    <AnimatePresence mode="wait">
                        <MotionDiv
                            key={location.pathname}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.15 }}
                            className="flex-grow flex flex-col"
                        >
                            <Routes>
                                <Route index element={isAuthenticated ? <Dashboard projects={projects} onUpdateProject={handleUpdateProject} /> : <HomePage />} />
                                <Route path="dashboard" element={<Dashboard projects={projects} onUpdateProject={handleUpdateProject} />} />
                                <Route path="new/*" element={
                                    <NewProjectPage
                                        onDeployTemplate={handleDeployTemplate}
                                        onImportRepository={handleImportRepository}
                                        onDeployWorkflow={handleDeployWorkflow}
                                    />
                                } />
                                <Route path="projects/:id" element={<ProjectDetailWrapper projects={projects} isLoading={isLoading} onUpdateProject={handleUpdateProject} />} />
                                <Route path="deploy/:id" element={<DeploymentPage projectId="" />} />
                                <Route path="docs/*" element={<DocsPage />} />
                                <Route path="pricing" element={<PricingPage />} />
                                <Route path="upgrade" element={<UpgradePage />} />
                                <Route path="usage" element={<UsagePage />} />
                                <Route path="settings" element={<SettingsPage />} />
                                <Route path="cli" element={<CLIPage projects={projects} onUpdateProject={handleUpdateProject} />} />
                                <Route path="*" element={<NotFoundPage />} />
                            </Routes>
                        </MotionDiv>
                    </AnimatePresence>
                </Suspense>
            </main>
            <Footer />
            <StatusFooter />
        </div>
    );
};

const ProjectDetailWrapper: React.FC<{
    projects: Project[],
    isLoading: boolean,
    onUpdateProject: (p: Project) => void
}> = ({ projects, isLoading, onUpdateProject }) => {
    const { id } = useParams<{ id: string }>();
    const project = projects.find(p => p.id === id);

    if (isLoading) return <GlobalLoader />;
    if (!project) return <NotFoundPage />;

    return <ProjectDetailView project={project} onUpdateProject={onUpdateProject} />;
};

const VoidApp: React.FC = () => {
    return <AppContent />;
};

export default VoidApp;