
import React from 'react';
import { LoadingAnimation } from './loading-animation';
import { cn } from '@/lib/utils';

interface LoadingWrapperProps {
  loading: boolean;
  children: React.ReactNode;
  loadingText?: string;
  variant?: 'spinner' | 'pulse' | 'skeleton' | 'dots';
  className?: string;
}

export const LoadingWrapper: React.FC<LoadingWrapperProps> = ({
  loading,
  children,
  loadingText,
  variant = 'spinner',
  className
}) => {
  if (loading) {
    return (
      <div className={cn('flex items-center justify-center p-8', className)}>
        <LoadingAnimation variant={variant} text={loadingText} />
      </div>
    );
  }

  return <>{children}</>;
};
