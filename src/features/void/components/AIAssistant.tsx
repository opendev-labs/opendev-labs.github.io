

import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { LogEntry, AiChatMessage } from '../types';
import { LogLevel, DeploymentStatus } from '../types';
import { getAIAssistance } from '../services/geminiService';
import { SparklesIcon, SendIcon } from './common/Icons';

interface AIAssistantProps {
  logs: LogEntry[];
  deploymentStatus: DeploymentStatus;
  deploymentId: string;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ logs, deploymentStatus, deploymentId }) => {
  const [messages, setMessages] = useState<AiChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const analyzedDeploymentIdRef = useRef<string | null>(null);

  const hasErrors = logs.some(log => log.level === LogLevel.ERROR);

  const handleAnalyzeErrors = useCallback(async () => {
    const errorLogs = logs.filter(log => log.level === LogLevel.ERROR);
    if (errorLogs.length === 0) return;

    setIsLoading(true);
    setMessages(prev => [...prev, { sender: 'ai', text: "I've detected an error in your recent deployment. Analyzing the logs now..." }]);

    const aiResponse = await getAIAssistance(errorLogs);

    setMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
    setIsLoading(false);
  }, [logs]);

  useEffect(() => {
    // We only act when a new deployment has failed and we have the error logs.
    if (
      deploymentStatus === DeploymentStatus.ERROR &&
      hasErrors &&
      deploymentId !== analyzedDeploymentIdRef.current
    ) {
      // Clear previous messages for the new error analysis
      setMessages([]);
      handleAnalyzeErrors();
      // Mark this deployment ID as analyzed to prevent re-triggering on subsequent renders.
      analyzedDeploymentIdRef.current = deploymentId;
    }
  }, [deploymentStatus, deploymentId, logs, hasErrors, handleAnalyzeErrors]);


  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setInput('');
    setIsLoading(true);

    // In a real app, this would call the Gemini chat API.
    // For now, we simulate a generic response.
    await new Promise(resolve => setTimeout(resolve, 1500));

    const errorLogs = logs.filter(log => log.level === LogLevel.ERROR);
    const aiResponse = await getAIAssistance(errorLogs); // Re-analyze with new context if needed

    setMessages(prev => [...prev, { sender: 'ai', text: `Regarding your question about "${userMessage}":\n\n${aiResponse}` }]);
    setIsLoading(false);
  }

  return (
    <div className="bg-void-card border border-void-line rounded-lg flex flex-col h-full sticky top-24 animate-fade-in-up">
      <div className="flex items-center gap-3 p-4 border-b border-void-line">
        <SparklesIcon />
        <h3 className="font-semibold text-white">AI Deployment Assistant</h3>
      </div>

      <div ref={chatContainerRef} className="flex-grow p-4 space-y-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs md:max-w-md lg:max-w-xs xl:max-w-md rounded-lg px-4 py-2 ${msg.sender === 'user' ? 'bg-void-neon text-black' : 'bg-void-line text-zinc-200'}`}>
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && messages[messages.length - 1]?.sender !== 'user' && (
          <div className="flex justify-start">
            <div className="bg-void-line rounded-lg px-4 py-3">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-zinc-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-zinc-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-zinc-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-void-line bg-void-card/80 rounded-b-lg">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a follow-up question..."
            className="w-full bg-void-line border border-zinc-700 py-2 px-3 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-void-neon"
            disabled={isLoading}
          />
          <button type="submit" className="bg-void-neon p-3 hover:opacity-90 disabled:bg-void-neon/50" disabled={isLoading || !input.trim()}>
            <SendIcon />
          </button>
        </form>
      </div>
    </div>
  );
};