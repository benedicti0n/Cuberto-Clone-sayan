"use client";

import React from 'react';

interface SkeletonWrapperProps {
  isLoading: boolean;
  children: React.ReactNode;
  skeleton: React.ReactNode;
  className?: string;
}

/**
 * A wrapper component that shows a skeleton loader while content is loading
 * This preserves the layout and prevents content jumping when data loads
 */
const SkeletonWrapper: React.FC<SkeletonWrapperProps> = ({ 
  isLoading, 
  children, 
  skeleton,
  className = ''
}) => {
  return (
    <div className={className}>
      {isLoading ? (
        // Show skeleton while loading, maintaining the same layout
        <div className="skeleton-container relative">
          {skeleton}
        </div>
      ) : (
        // Show actual content when loaded
        children
      )}
    </div>
  );
};

export default SkeletonWrapper; 