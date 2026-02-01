import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { Template, Repository, Workflow } from '../../types';
import { NewProjectLanding } from './new/NewProjectLanding';
import { ImportPage } from './new/ImportPage';
import { TemplatesPage } from './new/TemplatesPage';
import { MeshPage } from './new/MeshPage';
import { OpenURLPage } from './new/OpenURLPage';
import { TarsPage } from './new/TarsPage';
import { HostingPage } from './new/HostingPage';
import { DeploymentPlatform } from './DeploymentConfigForm';

interface NewProjectPageProps {
    onDeployTemplate: (template: Template, projectName: string, platform: DeploymentPlatform, isPrivate?: boolean) => void;
    onImportRepository: (repo: Repository, projectName: string) => void;
    onDeployWorkflow: (workflow: Workflow, projectName: string) => void;
}

export const NewProjectPage: React.FC<NewProjectPageProps> = ({
    onDeployTemplate,
    onImportRepository,
    onDeployWorkflow
}) => {
    const isTars = window.location.pathname.includes('/tars');

    return (
        <div className={isTars ? "h-full" : "pb-32 px-6"}>
            <Routes>
                <Route index element={<NewProjectLanding />} />
                <Route path="import" element={<ImportPage onImportRepository={onImportRepository} />} />
                <Route path="templates" element={<TemplatesPage onDeployTemplate={onDeployTemplate} />} />
                <Route path="mesh" element={<MeshPage onDeployWorkflow={onDeployWorkflow} />} />
                <Route path="tars" element={<TarsPage />} />
                <Route path="hosting" element={<HostingPage onDeployTemplate={onDeployTemplate} />} />
            </Routes>
            <Outlet />
        </div>
    );
};