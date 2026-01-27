
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    // Attempt to reload the page or navigate to a safe route
    try {
        window.location.hash = '/';
        window.location.reload();
    } catch (e) {
        console.error("Failed to recover automatically:", e);
    }
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-void-bg text-zinc-200 flex items-center justify-center p-4">
          <div className="text-center bg-void-card border border-void-line p-10 rounded-lg max-w-lg">
            <h1 className="text-3xl font-bold text-red-400">Something went wrong.</h1>
            <p className="mt-4 text-zinc-400">
              An unexpected error occurred. We've logged the issue and our team will investigate.
            </p>
            {this.state.error && (
                <pre className="mt-4 text-left bg-black p-4 rounded-md text-red-300 text-xs overflow-auto max-h-40">
                    <code>{this.state.error.toString()}</code>
                </pre>
            )}
            <button
                onClick={this.handleReset}
                className="mt-8 bg-void-neon text-black font-semibold px-6 py-2 hover:opacity-90 transition-colors"
            >
              Try to Recover
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
