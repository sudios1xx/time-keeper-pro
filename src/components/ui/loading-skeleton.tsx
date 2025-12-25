import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  className?: string;
  count?: number;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  className, 
  count = 1 
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "animate-pulse bg-muted rounded-md",
            className || "h-4 w-full"
          )}
        />
      ))}
    </>
  );
};

// Skeleton específico para cards
export const CardSkeleton: React.FC = () => (
  <div className="card-glass rounded-2xl p-6 space-y-4 animate-pulse">
    <div className="flex items-center space-x-3">
      <div className="w-12 h-12 bg-muted rounded-xl" />
      <div className="space-y-2 flex-1">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-1/2" />
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-3 bg-muted rounded" />
      <div className="h-3 bg-muted rounded w-5/6" />
    </div>
  </div>
);

// Skeleton para listas
export const ListSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="flex items-center space-x-3 p-4 card-glass rounded-xl">
        <div className="w-10 h-10 bg-muted rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-muted rounded w-1/2" />
          <div className="h-3 bg-muted rounded w-3/4" />
        </div>
        <div className="w-16 h-6 bg-muted rounded" />
      </div>
    ))}
  </div>
);

export default LoadingSkeleton; 