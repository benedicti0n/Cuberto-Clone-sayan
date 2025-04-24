"use client";

import React, { useState, useEffect } from 'react';
import { useSkeletonLoader } from '@/lib/hooks';

interface SectionLoaderProps {
  children: React.ReactNode;
  skeleton: React.ReactNode;
  fetchData?: () => Promise<any>;
  minLoadTime?: number;
  className?: string;
  isDark?: boolean;
}

/**
 * SectionLoader component that displays a skeleton while data is loading
 * with smooth transitions between loading and loaded states
 */
const SectionLoader: React.FC<SectionLoaderProps> = ({
  children,
  skeleton,
  fetchData,
  minLoadTime = 1000,
  className = '',
  isDark = false,
}) => {
  const [showContent, setShowContent] = useState(false);
  const { isLoading } = useSkeletonLoader(
    fetchData,
    { minimumLoadTime: minLoadTime }
  );

  useEffect(() => {
    let transitionTimeout: NodeJS.Timeout;
    if (!isLoading) {
      // Delay showing content slightly for smooth transition
      transitionTimeout = setTimeout(() => {
        setShowContent(true);
      }, 200);
    } else {
      setShowContent(false);
    }
    
    return () => {
      if (transitionTimeout) clearTimeout(transitionTimeout);
    };
  }, [isLoading]);

  return (
    <div className={`relative overflow-visible ${className}`}>
      {/* Skeleton loader with fade-out animation when content is ready */}
      <div
        className={`transition-opacity duration-300 overflow-visible ${
          showContent ? 'opacity-0 absolute inset-0 pointer-events-none z-0' : 'opacity-100 z-10'
        }`}
      >
        <div className="section-skeleton-container overflow-visible">{skeleton}</div>
      </div>
      
      {/* Actual content with fade-in animation */}
      <div
        className={`transition-opacity duration-500 overflow-visible ${
          showContent ? 'opacity-100 z-10' : 'opacity-0 absolute inset-0 pointer-events-none z-0'
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default SectionLoader; 