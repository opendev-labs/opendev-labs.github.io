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
    setMessages(prev => [...prev, { sender: 'ai', text: "Analyzing protocol failure logs. Synchronizing neural context..." }]);

    const aiResponse = await getAIAssistance(errorLogs);

    setMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
    setIsLoading(false);
  }, [logs]);

  useEffect(() => {
    if (
      deploymentStatus === DeploymentStatus.ERROR &&
      hasErrors &&
      deploymentId !== analyzedDeploymentIdRef.current
    ) {
      setMessages([]);
      handleAnalyzeErrors();
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

    await new Promise(resolve => setTimeout(resolve, 1500));

    const errorLogs = logs.filter(log => log.level === LogLevel.ERROR);
    const aiResponse = await getAIAssistance(errorLogs);

    setMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
    setIsLoading(false);
  }

  return (
    <div className="bg-black border border-zinc-900 rounded-none flex flex-col h-full sticky top-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-3 p-5 border-b border-zinc-900 bg-zinc-950/50">
        <SparklesIcon className="w-5 h-5 text-zinc-400" />
        <h3 className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">Neural Analyst</h3>
      </div>

      <div ref={chatContainerRef} className="flex-grow p-6 space-y-6 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-none px-4 py-3 ${msg.sender === 'user' ? 'bg-white text-black text-[13px] font-bold' : 'bg-black border border-zinc-900 text-zinc-300 text-[13px] font-medium leading-relaxed'}`}>
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && messages[messages.length - 1]?.sender !== 'user' && (
          <div className="flex justify-start">
            <div className="bg-black border border-zinc-900 px-4 py-4">
              <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-pulse"></div>
                <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-pulse [animation-delay:200ms]"></div>
                <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-pulse [animation-delay:400ms]"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-5 border-t border-zinc-900 bg-black">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Inquire node status..."
            className="flex-grow bg-zinc-950 border border-zinc-900 px-4 py-3 text-xs font-bold text-white placeholder:text-zinc-700 focus:outline-none focus:border-white transition-all uppercase tracking-widest"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="h-11 w-11 bg-white text-black flex items-center justify-center hover:bg-zinc-200 disabled:opacity-50 transition-all"
            disabled={isLoading || !input.trim()}
          >
            <SendIcon className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};