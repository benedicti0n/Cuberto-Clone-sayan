"use client";

import React, { useEffect, useState } from 'react';
import { useSkeletonLoader } from '@/lib/hooks';
import { CardSkeleton } from '@/components/SkeletonLoaders';
import Skeleton from '../ui/Skeleton';

interface FullScreenLoaderProps {
  children: React.ReactNode;
  initialDelay?: number;
  minDisplayTime?: number;
  isDark?: boolean;
}

/**
 * A full-screen loader component that wraps around the entire application
 * and shows a skeleton UI during initial load that matches your site design
 */
const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({ 
  children, 
  initialDelay = 0,
  minDisplayTime = 1500,
  isDark = false
}) => {
  const [shouldShowLoader, setShouldShowLoader] = useState(true);
  
  // Simulate initial app loading
  const { isLoading } = useSkeletonLoader(
    async () => {
      // Delay start if needed
      if (initialDelay > 0) {
        await new Promise(resolve => setTimeout(resolve, initialDelay));
      }
      // Return any data your app might need on initial load
      return {};
    },
    { minimumLoadTime: minDisplayTime }
  );
  
  useEffect(() => {
    if (!isLoading) {
      // Add a small delay before hiding to allow for a smooth transition
      const timeout = setTimeout(() => {
        setShouldShowLoader(false);
      }, 300);
      
      return () => clearTimeout(timeout);
    } else {
      setShouldShowLoader(true);
    }
  }, [isLoading]);
  
  // Fix for body scrolling while loader is showing
  useEffect(() => {
    if (shouldShowLoader) {
      document.body.style.overflow = 'hidden';
    } else {
      // Use the original overflow style
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [shouldShowLoader]);
  
  if (!shouldShowLoader) {
    return <div className="content-transition opacity-0 animate-fadeIn">{children}</div>;
  }
  
  const bgClass = isDark ? 'bg-black text-white' : 'bg-white text-black';
  
  return (
    <div className={`fixed inset-0 w-full h-full ${bgClass} z-50 skeleton-fade-in overflow-hidden`}>
      <div className={`w-full h-full ${bgClass} p-4 md:p-8 overflow-hidden`}>
        {/* Header with your site's nav */}
        <div className="flex items-center justify-between mb-4 md:mb-8 px-4">
          <Skeleton 
            variant="text" 
            width={120} 
            height={28} 
            animation="shimmer" 
            className="rounded" 
            isDark={isDark}
          />
          
          <div className="hidden md:flex items-center space-x-6">
            <Skeleton 
              variant="text" 
              width={60} 
              height={24} 
              animation="shimmer" 
              isDark={isDark}
            />
            <Skeleton 
              variant="text" 
              width={60} 
              height={24} 
              animation="shimmer" 
              isDark={isDark}
            />
            <Skeleton 
              variant="text" 
              width={60} 
              height={24} 
              animation="shimmer" 
              isDark={isDark}
            />
          </div>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <Skeleton 
              variant="rectangular" 
              width={32} 
              height={32} 
              animation="shimmer" 
              isDark={isDark}
            />
          </div>
        </div>
        
        {/* Hero section skeleton - responsive height */}
        <div className="relative h-[70vh] sm:h-[75vh] md:h-[80vh] mb-6 md:mb-12 overflow-hidden">
          <Skeleton 
            variant="rectangular" 
            animation="shimmer" 
            className="w-full h-full" 
            isDark={isDark}
          />
          
          <div className="absolute inset-0 flex flex-col justify-center items-start px-4 sm:px-8 md:px-16">
            <Skeleton 
              variant="text" 
              animation="shimmer" 
              className="w-4/5 sm:w-3/4 md:w-1/2 h-6 sm:h-8 md:h-12 mb-4" 
              isDark={isDark}
            />
            
            <div className="space-y-2 sm:space-y-4 mb-6 sm:mb-8 w-full max-w-md">
              <Skeleton 
                variant="text" 
                animation="shimmer" 
                className="w-full h-4 sm:h-5" 
                isDark={isDark}
              />
              <Skeleton 
                variant="text" 
                animation="shimmer" 
                className="w-full h-4 sm:h-5" 
                isDark={isDark}
              />
              <Skeleton 
                variant="text" 
                animation="shimmer" 
                className="w-3/4 h-4 sm:h-5" 
                isDark={isDark}
              />
            </div>
            
            <Skeleton 
              variant="rectangular" 
              animation="shimmer" 
              className="w-28 sm:w-32 md:w-36 h-10 sm:h-12 rounded-full" 
              isDark={isDark}
            />
          </div>
        </div>
        
        {/* Projects section with responsive grid */}
        <div className="mb-8 md:mb-12 overflow-hidden">
          <Skeleton 
            variant="text" 
            animation="shimmer" 
            className="w-48 sm:w-56 md:w-64 h-6 sm:h-8 mb-6 md:mb-8 mx-auto" 
            isDark={isDark}
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="aspect-[4/5] sm:aspect-auto sm:h-[350px] md:h-[450px]">
              <CardSkeleton isDark={isDark} />
            </div>
            <div className="aspect-[4/5] sm:aspect-auto sm:h-[350px] md:h-[450px] hidden sm:block">
              <CardSkeleton isDark={isDark} />
            </div>
          </div>
        </div>
        
        {/* Loading indicator at bottom */}
        <div className="flex justify-center items-center py-4 sm:py-6">
          <div className="flex space-x-2">
            <div className={`h-2 sm:h-3 w-2 sm:w-3 rounded-full ${isDark ? 'bg-white' : 'bg-gray-800'} animate-bounce`}></div>
            <div className={`h-2 sm:h-3 w-2 sm:w-3 rounded-full ${isDark ? 'bg-white' : 'bg-gray-800'} animate-bounce [animation-delay:0.2s]`}></div>
            <div className={`h-2 sm:h-3 w-2 sm:w-3 rounded-full ${isDark ? 'bg-white' : 'bg-gray-800'} animate-bounce [animation-delay:0.4s]`}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullScreenLoader; 