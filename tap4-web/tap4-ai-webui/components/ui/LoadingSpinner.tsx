'use client';

import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: number;
  text?: string;
  className?: string;
}

export function LoadingSpinner({ size = 24, text, className = '' }: LoadingSpinnerProps) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <Loader2 className="animate-spin text-primary" size={size} />
      {text && (
        <p className="mt-2 text-sm text-gray-400">{text}</p>
      )}
    </div>
  );
}

interface LoadingContainerProps {
  children: React.ReactNode;
  isLoading: boolean;
  height?: string;
  text?: string;
}

export function LoadingContainer({ children, isLoading, height = 'h-[400px]', text = 'Loading...' }: LoadingContainerProps) {
  if (isLoading) {
    return (
      <div className={`flex items-center justify-center ${height}`}>
        <LoadingSpinner size={32} text={text} />
      </div>
    );
  }
  
  return <>{children}</>;
} 