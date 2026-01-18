// src/components/common/ErrorBoundary.jsx
import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className='flex items-center justify-center min-h-screen p-4'>
          <Card className='max-w-lg w-full'>
            <CardHeader>
              <div className='flex items-center gap-2'>
                <AlertCircle className='h-6 w-6 text-destructive' />
                <CardTitle>Algo salió mal</CardTitle>
              </div>
              <CardDescription>
                Ha ocurrido un error inesperado. Por favor, intenta recargar la página.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className='p-4 bg-muted rounded-md overflow-auto max-h-60'>
                  <p className='text-sm font-mono text-destructive mb-2'>
                    {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo && (
                    <pre className='text-xs text-muted-foreground whitespace-pre-wrap'>
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              )}
              <div className='flex gap-2'>
                <Button onClick={this.handleReset} className='flex-1'>
                  <RefreshCw className='mr-2 h-4 w-4' />
                  Recargar Página
                </Button>
                <Button variant='outline' onClick={() => window.history.back()}>
                  Volver
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
