import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './ui/button';
import { Warning, ArrowClockwise, House } from 'phosphor-react';
import { logger } from '../utils/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
                <Warning className="w-8 h-8 text-destructive" />
              </div>
              
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-foreground">
                  Ops! Algo deu errado
                </h1>
                <p className="text-muted-foreground">
                  Encontramos um problema inesperado. Tente novamente ou volte ao início.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={this.handleRetry}
                className="w-full"
              >
                <ArrowClockwise className="w-4 h-4 mr-2" />
                Tentar Novamente
              </Button>
              
              <Button 
                variant="outline" 
                onClick={this.handleGoHome}
                className="w-full"
              >
                <House className="w-4 h-4 mr-2" />
                Voltar ao Início
              </Button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-left bg-muted rounded-lg p-4 mt-4">
                <summary className="cursor-pointer font-medium text-sm">
                  Detalhes do erro (desenvolvimento)
                </summary>
                <div className="mt-2 text-xs space-y-2">
                  <div>
                    <strong>Erro:</strong>
                    <pre className="mt-1 p-2 bg-background rounded text-red-500 overflow-auto">
                      {this.state.error.message}
                    </pre>
                  </div>
                  {this.state.errorInfo && (
                    <div>
                      <strong>Stack:</strong>
                      <pre className="mt-1 p-2 bg-background rounded text-muted-foreground overflow-auto">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 