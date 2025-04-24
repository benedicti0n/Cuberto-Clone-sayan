"use client";

import React from 'react';
import Skeleton from '../ui/Skeleton';

interface VideoSkeletonProps {
  className?: string;
  includeControls?: boolean;
  isDark?: boolean;
}

const VideoSkeleton: React.FC<VideoSkeletonProps> = ({ 
  className = '',
  includeControls = true,
  isDark = false
}) => {
  return (
    <div className={`flex flex-col gap-2 sm:gap-3 ${className} shiny-effect`} style={{ background: 'transparent' }}>
      {/* Main video container with overlay gradient */}
      <div className="relative h-full w-full aspect-[16/10] sm:aspect-[16/9] rounded-lg overflow-hidden shiny-effect">
        <Skeleton 
          customShape="movie-slide"
          animation="shimmer" 
          className="w-full h-full rounded-lg" 
          isDark={isDark}
        />
        
        {/* Text overlay - similar to your actual design */}
        <div className="absolute bottom-8 sm:bottom-12 md:bottom-16 left-3 sm:left-4 md:left-6 max-w-2xl z-10">
          <Skeleton 
            variant="text" 
            animation="shimmer" 
            className="w-3/4 h-6 sm:h-8 md:h-10 lg:h-16 mb-2 sm:mb-4" 
            isDark={isDark}
          />
          <div className="space-y-1 sm:space-y-2">
            <Skeleton 
              variant="text" 
              animation="shimmer" 
              className="w-full h-3 sm:h-4" 
              isDark={isDark}
            />
            <Skeleton 
              variant="text" 
              animation="shimmer" 
              className="w-3/4 h-3 sm:h-4" 
              isDark={isDark}
            />
          </div>
          
          <Skeleton 
            variant="rectangular" 
            animation="shimmer" 
            className="mt-4 sm:mt-6 md:mt-8 w-24 sm:w-32 md:w-36 h-8 sm:h-10 rounded-full" 
            isDark={isDark}
          />
        </div>
        
        {/* Proficiency bar in bottom right */}
        <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 right-3 sm:right-4 md:right-6 z-10">
          <Skeleton 
            variant="rectangular" 
            animation="shimmer" 
            className="w-32 sm:w-40 md:w-48 h-6 sm:h-8 rounded-full" 
            isDark={isDark}
          />
        </div>
      </div>
      
      {includeControls && (
        <div className="flex justify-center mt-1 sm:mt-2">
          <div className="flex gap-1 sm:gap-2">
            {[1, 2, 3, 4, 5].map((_, i) => (
              <Skeleton 
                key={i}
                variant="circular" 
                width={8}
                height={8}
                className="sm:w-10 sm:h-10 md:w-12 md:h-12"
                animation="shimmer" 
                isDark={isDark}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoSkeleton; 