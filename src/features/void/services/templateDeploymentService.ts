/**
 * Template Deployment Service
 * Handles automated deployment of template code to GitHub + hosting platforms
 */

import { githubPATService } from './githubPATService';
import { TemplateGenerator } from './templateGenerator';

export interface DeploymentConfig {
    templateId: string;
    projectName: string;
    isPrivate?: boolean;
    platform?: 'github-pages' | 'vercel' | 'firebase';
}

export interface DeploymentResult {
    success: boolean;
    repoUrl?: string;
    liveUrl?: string;
    error?: string;
}

class TemplateDeploymentService {
    /**
     * Deploy a template to GitHub and hosting platform
     */
    async deployTemplate(config: DeploymentConfig): Promise<DeploymentResult> {
        try {
            // 1. Generate template code
            const template = TemplateGenerator.generateTemplate(config.templateId, config.projectName);

            // 2. Format files for GitHub API
            const files = Object.entries(template.files).map(([path, content]) => ({
                path,
                content
            }));

            // Add README
            files.push({
                path: 'README.md',
                content: template.readme
            });

            // 3. Deploy to GitHub Pages using PAT
            const result = await githubPATService.deployToGitHubPages(
                config.projectName,
                files,
                `${config.projectName} - Created with OpenDev Labs`,
                config.isPrivate || false
            );

            return {
                success: true,
                repoUrl: result.repoUrl,
                liveUrl: result.pagesUrl
            };

        } catch (error) {
            console.error('Deployment error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown deployment error'
            };
        }
    }

    /**
     * Quick deploy to check if PAT is configured
     */
    isPATConfigured(): boolean {
        return !!githubPATService.getPAT();
    }
}

export const templateDeploymentService = new TemplateDeploymentService();
