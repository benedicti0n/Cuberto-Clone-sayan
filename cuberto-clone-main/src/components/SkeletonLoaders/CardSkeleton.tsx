"use client";

import React from 'react';
import Skeleton from '../ui/Skeleton';

interface CardSkeletonProps {
  className?: string;
  isDark?: boolean;
}

const CardSkeleton: React.FC<CardSkeletonProps> = ({ className, isDark = false }) => {
  return (
    <div className={`w-full h-full ${className}`}>
      <div className="relative overflow-hidden transition-all duration-300 h-full">
        {/* Main image container */}
        <Skeleton 
          variant="rectangular" 
          animation="shimmer" 
          className="w-full h-full" 
          isDark={isDark}
        />
        
        {/* Overlay with text and buttons */}
        <div className="absolute inset-0 flex flex-col justify-between p-3 sm:p-4 md:p-6">
          {/* Top controls */}
          <div className="flex justify-between w-full">
            <Skeleton
              variant="circular"
              width={24}
              height={24}
              animation="shimmer"
              isDark={isDark}
              className="sm:w-8 sm:h-8"
            />
            <Skeleton
              variant="circular"
              width={24}
              height={24}
              animation="shimmer"
              isDark={isDark}
              className="sm:w-8 sm:h-8"
            />
          </div>
          
          {/* Bottom text */}
          <div className="text-center w-full">
            <Skeleton 
              variant="text" 
              animation="shimmer" 
              className="w-3/4 h-5 sm:h-6 md:h-8 mx-auto mb-1 sm:mb-2" 
              isDark={isDark}
            />
            
            <Skeleton 
              variant="text" 
              animation="shimmer" 
              className="w-1/2 h-3 sm:h-4 mx-auto" 
              isDark={isDark}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardSkeleton; 