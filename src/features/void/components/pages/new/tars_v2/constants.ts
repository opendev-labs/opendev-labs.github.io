import type { ModelConfig } from './types';

export const SUGGESTED_PROMPTS = [
    'Create a login page',
    'Create a multi-step form',
    'Create a dashboard',
    'Create a blog',
    'Create a landing page',
    'Create a pricing page',
    'Create a contact page',
    'Create a product page',
    'Create a portfolio website'
];

export const SUPPORTED_MODELS: ModelConfig[] = [
    { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', provider: 'Google', apiIdentifier: 'gemini-1.5-pro' },
    { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', provider: 'Google', apiIdentifier: 'gemini-1.5-flash' },

    // Top Free Coding Models
    { id: 'deepseek-coder-v2', name: 'DeepSeek Coder V2', provider: 'DeepSeek', apiIdentifier: 'deepseek-coder' },
    { id: 'openrouter-nous-hermes-2-mixtral', name: 'Nous Hermes 2 (OpenRouter)', provider: 'OpenRouter', apiIdentifier: 'nousresearch/nous-hermes-2-mixtral-8x7b-dpo' },
    { id: 'meta-codellama-70b', name: 'CodeLlama 70B', provider: 'Meta', apiIdentifier: 'codellama/CodeLlama-70b-hf' },
    { id: 'bigcode-starcoder', name: 'StarCoder', provider: 'BigCode', apiIdentifier: 'bigcode/starcoder' },
    { id: 'wizardlm-wizardcoder-python', name: 'WizardCoder', provider: 'WizardLM', apiIdentifier: 'WizardLM/WizardCoder-Python-34B-V1.0' },
    { id: 'mistral-ai-mistral-7b', name: 'Mistral 7B', provider: 'Mistral AI', apiIdentifier: 'mistralai/Mistral-7B-v0.1' },
    { id: 'openchat-openchat-3.5', name: 'OpenChat 3.5', provider: 'OpenChat', apiIdentifier: 'openchat/openchat-3.5' },
    { id: 'phind-codellama-v2', name: 'Phind CodeLlama V2', provider: 'Phind', apiIdentifier: 'phind/Phind-CodeLlama-34B-v2' },
    { id: 'replit-code-v1.5', name: 'Replit Code V1.5', provider: 'Replit', apiIdentifier: 'replit/replit-code-v1-3b' },

    // Existing Models
    { id: 'openai-gpt-4o', name: 'GPT-4o', provider: 'OpenAI', apiIdentifier: 'gpt-4o' },
    { id: 'openai-gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'OpenAI', apiIdentifier: 'gpt-4-turbo' },
    { id: 'anthropic-claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', apiIdentifier: 'claude-3-5-sonnet-20240620' },
    { id: 'anthropic-claude-3-opus', name: 'Claude 3 Opus', provider: 'Anthropic', apiIdentifier: 'claude-3-opus-20240229' },
    { id: 'anthropic-claude-3-haiku', name: 'Claude 3 Haiku', provider: 'Anthropic', apiIdentifier: 'claude-3-haiku-20240307' },
];