// src/components/ErrorBoundary.tsx - NOWY KOMPONENT
import { Component, type ErrorInfo, type ReactNode } from "react";

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

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center ">
          <div className="max-w-md w-full text-center">
            <h1 className="text-2xl font-bold text-muted-foreground mb-4">
              Coś poszło nie tak
            </h1>
            <p className="text-muted-foreground mb-6">
              Przepraszamy, wystąpił nieoczekiwany błąd. Spróbuj odświeżyć
              stronę.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-primary"
            >
              Odśwież stronę
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
