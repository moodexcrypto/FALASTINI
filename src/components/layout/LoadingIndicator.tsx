'use client';

import React from 'react';
import { useLoading } from '@/context/LoadingContext';
import { cn } from '@/lib/utils';

const LoadingIndicator: React.FC = () => {
  const { isLoading } = useLoading();

  return (
    <div
      className={cn(
        'fixed top-0 left-0 z-[100] h-1 w-full transition-opacity duration-300 ease-in-out',
        isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none' // Show/hide based on loading state
      )}
      role="progressbar"
      aria-busy={isLoading}
      aria-valuetext={isLoading ? 'Loading...' : 'Idle'}
    >
      <div className="h-full w-full overflow-hidden">
         {/* The actual animated bar */}
        <div className={cn(
            "h-full bg-primary transition-transform duration-500 ease-linear",
            isLoading ? "animate-loading-bar-indeterminate" : "" // Apply indeterminate animation
        )}
        style={{ transformOrigin: 'left center' }} // Ensure scaling starts from left
        ></div>
      </div>
       <style jsx>{`
           @keyframes loading-bar-indeterminate {
             0% { transform: translateX(-100%) scaleX(0.1); }
             50% { transform: translateX(0%) scaleX(0.8); }
             100% { transform: translateX(100%) scaleX(0.1); }
           }
           .animate-loading-bar-indeterminate {
             animation: loading-bar-indeterminate 1.5s infinite ease-in-out;
           }
       `}</style>
    </div>
  );
};

export default LoadingIndicator;
