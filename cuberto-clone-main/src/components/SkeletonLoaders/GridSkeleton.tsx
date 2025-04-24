"use client";

import React from 'react';
import CardSkeleton from './CardSkeleton';

interface GridSkeletonProps {
  className?: string;
  count?: number;
  columns?: number;
  isDark?: boolean;
}

const GridSkeleton: React.FC<GridSkeletonProps> = ({ 
  className = '', 
  count = 4,
  columns = 2,
  isDark = false
}) => {
  return (
    <div 
      className={`grid gap-4 ${className}`}
      style={{
        gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, ${280 * (1/columns)}px), 1fr))`
      }}
    >
      {Array(count).fill(0).map((_, index) => (
        <CardSkeleton 
          key={index} 
          isDark={isDark}
          className="h-auto max-h-[500px] sm:h-[400px] md:h-[450px] lg:h-[500px]" 
        />
      ))}
    </div>
  );
};

export default GridSkeleton; 