
import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingAnimationProps {
  variant?: 'spinner' | 'pulse' | 'skeleton' | 'dots';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export const LoadingAnimation: React.FC<LoadingAnimationProps> = ({
  variant = 'spinner',
  size = 'md',
  className,
  text
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const renderSpinner = () => (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <Loader2 className={cn('animate-spin text-primary', sizeClasses[size])} />
      {text && <p className="text-sm text-muted-foreground animate-pulse">{text}</p>}
    </div>
  );

  const renderPulse = () => (
    <div className={cn('flex items-center justify-center', className)}>
      <div className={cn('rounded-full bg-primary animate-pulse', sizeClasses[size])} />
      {text && <p className="ml-3 text-sm text-muted-foreground">{text}</p>}
    </div>
  );

  const renderSkeleton = () => (
    <div className={cn('animate-pulse space-y-3', className)}>
      <div className="h-4 bg-muted rounded w-3/4"></div>
      <div className="h-4 bg-muted rounded w-1/2"></div>
      <div className="h-4 bg-muted rounded w-5/6"></div>
      {text && <p className="text-xs text-muted-foreground">{text}</p>}
    </div>
  );

  const renderDots = () => (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
      {text && <p className="ml-3 text-sm text-muted-foreground">{text}</p>}
    </div>
  );

  switch (variant) {
    case 'pulse':
      return renderPulse();
    case 'skeleton':
      return renderSkeleton();
    case 'dots':
      return renderDots();
    default:
      return renderSpinner();
  }
};
