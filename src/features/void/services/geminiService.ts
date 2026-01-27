
import { GoogleGenAI } from "@google/genai";
import type { LogEntry } from '../types';

const API_KEY = process.env.API_KEY;

let ai: GoogleGenAI | null = null;
if (API_KEY) {
  try {
    ai = new GoogleGenAI({ apiKey: API_KEY });
  } catch (error) {
    console.error("Failed to initialize GoogleGenAI:", error);
  }
}

export const getAIAssistance = async (errorLogs: LogEntry[]): Promise<string> => {
  const errorMessages = errorLogs
    .filter(log => log.level === 'ERROR')
    .map(log => log.message)
    .join('\n');

  if (!errorMessages) {
    return "No critical errors found in the logs. If you're still facing issues, please provide more context about the problem.";
  }

  if (!ai) {
    // Fallback to mock response if API key is not configured
    console.warn("AI Assistant: API_KEY not found. Using mock response.");
    if (errorMessages.includes("Module not found")) {
      return "It seems like there's a problem with a file import. The log `Error: Module not found: Can't resolve './utils/helpers'` suggests that a file is trying to import from a path that doesn't exist or is incorrect. \n\n**Recommendation:**\n1. Check the import statement in the file that's causing the error.\n2. Verify that the file path `'./utils/helpers'` is correct and that the file exists.\n3. Ensure the file extension (e.g., `.ts`, `.js`) is correct if required by your bundler.";
    }
    return "AI Assistant is not configured. Please ensure your API key is set up correctly to enable this feature.";
  }

  try {
    const prompt = `
      As an expert software developer and deployment specialist, analyze the following build error logs and provide a concise, actionable solution.

      Error Logs:
      ---
      ${errorMessages}
      ---

      Your analysis should:
      1. Identify the most likely root cause of the error.
      2. Suggest a specific code or configuration change to fix it.
      3. Provide a brief explanation of why this error occurred.
      
      Format your response in Markdown with clear headings and code snippets where appropriate.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text ?? "No response from AI.";
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    let errorMessage = "An error occurred while contacting the AI assistant. ";
    if (error instanceof Error) {
      if (error.message.includes('API key not valid')) {
        errorMessage += "Please check if your API key is correct. ";
      } else if (error.message.includes('fetch')) {
        errorMessage += "A network error occurred. Please check your connection. ";
      }
    }
    errorMessage += "See the browser console for more technical details.";
    return errorMessage;
  }
};
