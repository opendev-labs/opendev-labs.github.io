import React from 'react';
import { PageWrapper } from '../common/PageWrapper';
import { mockTemplates } from '../../constants';
import { TemplateCard } from './TemplateCard';
import type { Template } from '../../types';

interface TemplatesPageProps {
    // FIX: The signature of onDeployTemplate has been updated to include projectName,
    // to match the signature of the `onDeploy` prop expected by `TemplateCard`.
    onDeployTemplate: (template: Template, projectName: string) => void;
}

export const TemplatesPage: React.FC<TemplatesPageProps> = ({ onDeployTemplate }) => {
    return (
        <PageWrapper
            title="Deploy a Template"
            subtitle="Get started quickly by cloning a pre-built project. Choose from a variety of frameworks and use cases."
        >
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockTemplates.map(template => (
                    // FIX: The prop passed to TemplateCard was incorrect. It expected `onDeploy` but was given `onDeployTemplate`.
                    <TemplateCard key={template.id} template={template} onDeploy={onDeployTemplate} />
                ))}
            </div>
        </PageWrapper>
    );
};