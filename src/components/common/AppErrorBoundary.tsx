
import ErrorBoundary from './ErrorBoundary';
import { ReactNode } from 'react';

interface AppErrorBoundaryProps {
  children: ReactNode;
}

export default function AppErrorBoundary({ children }: AppErrorBoundaryProps) {
  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  );
}
