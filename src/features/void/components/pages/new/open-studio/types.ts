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
  role: 'user' | 'open-studio';
  content: string;
  generationInfo?: GenerationInfo;
}

export interface FileNode {
  path: string;
  content: string;
}

export type View = 'new-chat' | 'chat-session' | 'all-chats' | 'settings';

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  fileTree: FileNode[];
  activeFile: FileNode | null;
  suggestions?: string[];
  lastUpdated: number;
}

export interface ModelConfig {
  id: string;
  name: string;
  provider: 'Google' | 'OpenAI' | 'Anthropic' | 'DeepSeek' | 'Meta' | 'BigCode' | 'WizardLM' | 'Mistral AI' | 'OpenChat' | 'Phind' | 'Replit' | 'OpenRouter';
  apiIdentifier: string;
}