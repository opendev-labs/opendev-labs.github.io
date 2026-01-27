
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
    try {
      window.location.pathname = '/';
      window.location.reload();
    } catch (e) {
      console.error("Failed to recover automatically:", e);
    }
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-zinc-200 flex items-center justify-center p-4 selection:bg-white selection:text-black">
          <div className="text-center bg-black border border-zinc-900 p-16 shadow-2xl max-w-lg">
            <h1 className="text-4xl font-bold tracking-tighter text-white uppercase mb-6">Nexus Failure</h1>
            <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-[0.2em] leading-loose mb-10">
              A neural protocol exception has occurred. The system state has been recorded for forensic analysis.
            </p>
            {this.state.error && (
              <pre className="mb-10 text-left bg-zinc-950 border border-zinc-900 p-6 text-zinc-600 text-[10px] font-mono overflow-auto max-h-40 leading-relaxed uppercase tracking-tight">
                <code>{this.state.error.toString()}</code>
              </pre>
            )}
            <button
              onClick={this.handleReset}
              className="h-12 bg-white text-black font-bold px-12 uppercase tracking-widest hover:bg-zinc-200 transition-all"
            >
              Reinitialize Nexus
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
