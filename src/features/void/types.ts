

export enum SyncStatus {
    IDLE = 'Idle',
    SYNCING = 'Syncing',
    COMPLETED = 'Completed',
    ERROR = 'Error',
    AGENT_OFFLINE = 'Agent Offline',
}

export enum DeploymentStatus {
    QUEUED = 'Queued',
    BUILDING = 'Building',
    DEPLOYING = 'Deploying',
    DEPLOYED = 'Deployed',
    ERROR = 'Error',
    CANCELED = 'Canceled',
}

export interface Deployment {
    id: string;
    commit: string;
    branch: string;
    timestamp: string;
    status: DeploymentStatus;
    url: string;
}

export interface Domain {
    name: string;
    isPrimary: boolean;
    gitBranch?: string;
}

export enum LogLevel {
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR',
    DEBUG = 'DEBUG',
    SYSTEM = 'SYSTEM',
}

export interface LogEntry {
    timestamp: string;
    level: LogLevel;
    message: string;
}

export interface AiChatMessage {
    sender: 'user' | 'ai';
    text: string;
}

export interface Template {
    id: string;
    name: string;
    framework: string;
    description: string;
    author: string;
    imageUrl?: string;
    logoUrl?: string;
    previewUrl?: string;
    features?: string[];
    category?: string;
}

// New types for Git provider integration
export type GitProvider = 'GitHub' | 'GitLab' | 'Bitbucket';
export type DeploymentPlatform = 'github' | 'vercel' | 'firebase' | 'huggingface' | 'syncstack';

export interface Repository {
    id: string;
    name: string;
    owner: string;
    description: string;
    updatedAt: string;
    provider: GitProvider;
}

export interface User {
    uid: string;
    name: string;
    email: string;
    avatar?: string;
    providers?: string[];
}

// --- New types for Vercel-inspired features ---

export enum TeamMemberRole {
    OWNER = 'Owner',
    MEMBER = 'Member',
}

export interface WebVitals {
    lcp: number; // Largest Contentful Paint in s
    fid: number; // First Input Delay in ms
    cls: number; // Cumulative Layout Shift
}

export interface AnalyticsData {
    dailyVisitors: { day: string; visitors: number }[];
    totalPageViews: number;
    avgLoadTime: number; // in ms
    webVitals: WebVitals;
}

export enum FunctionStatus {
    ACTIVE = 'Active',
    IDLE = 'Idle',
    ERROR = 'Error',
}

export interface ServerlessFunction {
    id: string;
    name: string;
    path: string;
    status: FunctionStatus;
    region: string;
    invocations: number;
}

export interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: TeamMemberRole;
    avatarUrl?: string;
}

export interface ActivityEvent {
    id: string;
    type: 'Deployment' | 'Domain' | 'Settings' | 'Storage' | 'Integration' | 'Git';
    description: string;
    actor: string; // User name
    timestamp: string;
}


// --- New types for Storage and Integrations ---

export enum DatabaseType {
    POSTGRES = 'PostgreSQL',
    REDIS = 'Redis',
    SUPABASE = 'Supabase',
    NEON = 'Neon',
    MONGODB = 'MongoDB',
    LAMADB = 'LamaDB',
}

export enum DatabaseStatus {
    ACTIVE = 'Active',
    CREATING = 'Creating',
    ERROR = 'Error',
}

export interface Database {
    id: string;
    name: string;
    type: DatabaseType;
    region: string;
    status: DatabaseStatus;
    version: string;
}

export interface Integration {
    id: string;
    name: string;
    description: string;
    category: 'Monitoring' | 'Database' | 'Logging' | 'Auth' | 'Commerce';
    logoUrl: string;
    isConnected: boolean;
}

export interface FileSystemNode {
    name: string;
    type: 'file' | 'directory';
    content?: string;
    children?: FileSystemNode[];
}

// New type for workflows
export interface Workflow {
    id: string;
    name: string;
    description: string;
    components: {
        name: string;
        type: 'framework' | 'database' | 'service';
        logoUrl?: string
    }[];
}


export interface Project {
    id: string;
    name: string;
    framework: string;
    lastUpdated: string;
    deployments: Deployment[];
    domains: Domain[];
    envVars: { [key: string]: string };
    gitProvider?: GitProvider;
    // Vercel-like features
    analytics?: AnalyticsData;
    functions?: ServerlessFunction[];
    teamMembers?: TeamMember[];
    activityLog?: ActivityEvent[];
    storage?: Database[];
    integrations?: Integration[];
}


export interface UsageMetrics {
    bandwidth: { used: number; total: number; unit: 'GB' };
    buildMinutes: { used: number; total: number; unit: 'minutes' };
    functionInvocations: { used: number; total: number; unit: '' };
    storage: { used: number; total: number; unit: 'GB' };
}

export interface GenerationFile {
    path: string;
    status: 'generating' | 'complete' | 'error';
    action: 'created' | 'modified' | 'deleted';
}

export interface GenerationInfo {
    status: 'generating' | 'complete';
    files: GenerationFile[];
}

export interface Message {
    id: number;
    role: 'user' | 'tars';
    content: string;
    intentAnalysis?: string;
    commands?: string[];
    generationInfo?: GenerationInfo;
}

export interface FileNode {
    path: string;
    content: string;
}

export interface ModelConfig {
    id: string;
    name: string;
    provider: 'Google' | 'OpenAI' | 'Anthropic' | 'DeepSeek' | 'Meta' | 'BigCode' | 'WizardLM' | 'Mistral AI' | 'OpenChat' | 'Phind' | 'Replit' | 'OpenRouter';
    apiIdentifier: string;
}
export type TarsView = 'new-chat' | 'chat-session' | 'all-chats' | 'settings';

export interface ChatSession {
    id: string;
    title: string;
    messages: Message[];
    fileTree: FileNode[];
    activeFile: FileNode | null;
    suggestions?: string[];
    lastUpdated: number;
}
