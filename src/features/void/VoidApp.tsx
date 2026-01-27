import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { ProjectDetailView } from './components/ProjectDetailView';
import { Footer } from './components/Footer';
import type { Project, Template, Deployment, GitProvider, Repository, User, Workflow } from './types';
import { DeploymentStatus, DatabaseType, DatabaseStatus } from './types';
import { mockProjects, generateInitialProjectData, availableIntegrations } from './constants';
import { DocsPage } from './components/pages/DocsPage';
import { NewProjectPage } from './components/pages/NewProjectPage';
import { PricingPage } from './components/pages/PricingPage';
import { LoginPage } from './components/pages/LoginPage';
import { SignUpPage } from './components/pages/SignUpPage';
import { UpgradePage } from './components/pages/UpgradePage';
import { VerifyEmailPage } from './components/pages/VerifyEmailPage';
import { HomePage } from './components/pages/HomePage';
import { UsagePage } from './components/pages/UsagePage';
import { NotFoundPage } from './components/pages/NotFoundPage';
import { safeNavigate, MEMORY_ROUTE_CHANGE_EVENT } from './services/navigation';
import { useLocalStorage } from './hooks/useLocalStorage';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import { GlobalLoader } from './components/common/GlobalLoader';
import { StatusFooter } from './components/common/StatusFooter';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { CLIPage } from './components/pages/CLIPage';
import { GitHubCallbackHandler } from './components/auth/GitHubCallbackHandler';
import { DeploymentPage } from './components/pages/DeploymentPage';
import { REAL_TEMPLATES } from './src/data/real_templates';
import { motion, AnimatePresence } from 'framer-motion';

// FIX: Create a component alias for motion.div to help TypeScript resolve the complex types from framer-motion.
// This can resolve issues where motion props like 'initial' or 'variants' are not recognized.
const MotionDiv = motion.div;

// Custom hook for hash-based navigation with memory fallback
const useSafeNavigation = () => {
    const [route, setRoute] = useState(() => {
        try {
            return window.location.hash || '#/';
        } catch (e) {
            return '#/';
        }
    });

    useEffect(() => {
        const handleRouteChange = () => {
            try {
                setRoute(window.location.hash);
            } catch (e) {
                // In some sandboxed environments, even reading hash can fail.
                // The memory route change event will handle updates instead.
            }
        };

        const handleMemoryRouteChange = (e: Event) => {
            const customEvent = e as CustomEvent;
            setRoute(customEvent.detail.hash);
        };

        window.addEventListener('hashchange', handleRouteChange);
        window.addEventListener(MEMORY_ROUTE_CHANGE_EVENT, handleMemoryRouteChange);

        // Initial check
        handleRouteChange();

        return () => {
            window.removeEventListener('hashchange', handleRouteChange);
            window.removeEventListener(MEMORY_ROUTE_CHANGE_EVENT, handleMemoryRouteChange);
        };
    }, []);

    const cleanHash = route.replace(/^#\/?/, '');
    const parts = cleanHash.split('/');

    if (parts[0] === 'projects' && parts[1]) {
        return { page: 'projectDetail', projectId: parts[1] };
    }

    if (parts[0] === 'deploy' && parts[1]) {
        return { page: 'deploy', projectId: parts[1] };
    }

    if (parts[0] === '404') {
        return { page: '404', projectId: null };
    }

    // Redirect old templates route to new project page
    if (parts[0] === 'templates') {
        return { page: 'new', projectId: null };
    }

    // Default to dashboard for empty or root hash
    if (parts[0] === '') {
        return { page: 'dashboard', projectId: null };
    }

    return { page: parts[0], projectId: null };
};


const AppContent: React.FC = () => {
    const [projects, setProjects] = useLocalStorage<Project[]>('void_projects', mockProjects);
    const [connectedProvider, setConnectedProvider] = useLocalStorage<GitProvider | null>('void_git_provider', null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const { page, projectId } = useSafeNavigation();
    const { isAuthenticated, user, createRepository, uploadFile } = useAuth();

    useEffect(() => {
        // Check for GitHub OAuth callback code on initial load
        const params = new URLSearchParams(window.location.search);
        if (params.has('code')) {
            setIsAuthenticating(true);
        } else {
            setTimeout(() => {
                setIsLoading(false);
            }, 1500); // Increased loading time for effect
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

    const handleUpdateProject = (updatedProject: Project) => {
        setProjects(prevProjects => prevProjects.map(p => p.id === updatedProject.id ? updatedProject : p));
    };

    const handleDeployTemplate = async (template: Template, projectName: string, createRepo?: boolean, isPrivate?: boolean) => {
        const urlFriendlyName = projectName.toLowerCase().replace(/\s+/g, '-');

        // Handle GitHub Repo Creation
        if (createRepo && createRepository && uploadFile) {
            try {
                await createRepository(projectName, `Deployed from ${template.name}`, !!isPrivate);

                // Determine which real template code to use
                // Map template IDs or names to our REAL_TEMPLATES keys
                let templateKey = 'default';
                if (template.name.toLowerCase().includes('landing')) templateKey = 'landing-page';
                else if (template.name.toLowerCase().includes('next')) templateKey = 'nextjs-starter';

                const filesToUpload = REAL_TEMPLATES[templateKey] || REAL_TEMPLATES['default'];

                // Upload each file
                for (const [path, content] of Object.entries(filesToUpload)) {
                    await uploadFile(projectName, path, content, `Initial commit: Add ${path}`);
                }

            } catch (err) {
                console.error("Failed to create repo or upload files", err);
                // Continue with deployment even if repo creation fails (or show error)
            }
        }

        const newDeployment: Deployment = {
            id: `dpl_${Date.now()}`,
            commit: `Initial deployment from ${template.name} template`,
            branch: 'main',
            timestamp: new Date().toISOString(),
            status: DeploymentStatus.QUEUED,
            url: `https://${urlFriendlyName}.void.app`,
        };

        const newProject: Project = {
            id: `proj_${Date.now()}`,
            name: projectName,
            framework: template.framework,
            lastUpdated: 'Just now',
            deployments: [newDeployment],
            domains: [{ name: `https://${urlFriendlyName}.void.app`, isPrimary: true }],
            envVars: {},
            ...generateInitialProjectData(),
        };

        setProjects(prev => [newProject, ...prev]);
        safeNavigate(`/projects/${newProject.id}`);
    };

    const handleImportRepository = (repo: Repository, projectName: string) => {
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
            // In a real app, framework would be auto-detected
            framework: 'Node.js',
            lastUpdated: 'Just now',
            deployments: [newDeployment],
            domains: [{ name: `https://${urlFriendlyName}.void.app`, isPrimary: true }],
            envVars: {},
            ...generateInitialProjectData(),
        };

        setProjects(prev => [newProject, ...prev]);
        safeNavigate(`/projects/${newProject.id}`);
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

        // Customize project based on workflow components
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
        safeNavigate(`/projects/${newProject.id}`);
    };


    const renderContent = () => {
        if (isLoading) {
            return <GlobalLoader />;
        }

        // Handle root path: HomePage for logged-out, Dashboard for logged-in
        if (page === 'dashboard') {
            return isAuthenticated ? <Dashboard projects={projects} onUpdateProject={handleUpdateProject} /> : <HomePage />;
        }

        const publicPages = ['login', 'signup', 'verify-email', 'pricing', 'docs', '404'];
        if (!isAuthenticated && !publicPages.includes(page)) {
            safeNavigate('/login');
            return <LoginPage />;
        }

        if (isAuthenticated && (page === 'login' || page === 'signup')) {
            safeNavigate('/dashboard');
            return <Dashboard projects={projects} onUpdateProject={handleUpdateProject} />;
        }

        if (page === 'projectDetail' && projectId) {
            const project = projects.find(p => p.id === projectId);
            if (project) {
                return <ProjectDetailView key={project.id} project={project} onUpdateProject={handleUpdateProject} />;
            }
            safeNavigate('/404');
            return <NotFoundPage />;
        }

        switch (page) {
            case 'new':
                return <NewProjectPage
                    onDeployTemplate={handleDeployTemplate}
                    onImportRepository={handleImportRepository}
                    onDeployWorkflow={handleDeployWorkflow}
                    connectedProvider={connectedProvider}
                    setConnectedProvider={setConnectedProvider}
                />;
            case 'docs': return <DocsPage />;
            case 'pricing': return <PricingPage />;
            case 'login': return <LoginPage />;
            case 'signup': return <SignUpPage />;
            case 'verify-email': return <VerifyEmailPage />;
            case 'upgrade': return <UpgradePage />;
            case 'usage': return <UsagePage />;
            case 'cli': return <CLIPage projects={projects} onUpdateProject={handleUpdateProject} />;
            case 'deploy': return <DeploymentPage projectId={projectId || ''} />;
            case '404': return <NotFoundPage />;
            default:
                safeNavigate('/dashboard');
                return isAuthenticated ? <Dashboard projects={projects} onUpdateProject={handleUpdateProject} /> : <HomePage />;
        }
    };

    // Special case for deployment page to avoid wrapper layout if desired, 
    // or keep it consistent. The simulated page has its own full-screen look.
    if (page === 'deploy') {
        return <DeploymentPage projectId={projectId || ''} />;
    }

    return (
        <div className="min-h-screen bg-void-bg font-sans flex flex-col">
            <div className="main-app-bg"></div>
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8 sm:py-12 relative z-10 flex flex-col">
                <AnimatePresence mode="wait">
                    <MotionDiv
                        key={page + (projectId || '')}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.25 }}
                        className="flex-grow flex flex-col"
                    >
                        {renderContent()}
                    </MotionDiv>
                </AnimatePresence>
            </main>
            <Footer />
            {page === 'projectDetail' && <StatusFooter />}
        </div>
    );
};


const App: React.FC = () => {
    return (
        <AuthProvider>
            <ErrorBoundary>
                <AppContent />
            </ErrorBoundary>
        </AuthProvider>
    );
};

export default App;