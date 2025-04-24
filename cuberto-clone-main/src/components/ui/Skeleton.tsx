import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'rectangular' | 'circular' | 'text' | 'image' | 'custom';
  animation?: 'pulse' | 'wave' | 'shimmer';
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  customShape?: 'project-card' | 'movie-slide' | 'profile';
  isDark?: boolean;
}

const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rectangular',
  animation = 'shimmer',
  width,
  height,
  borderRadius,
  customShape,
  isDark = false,
}) => {
  // Colors based on theme - light or dark mode
  const baseColor = isDark ? 'bg-gray-800' : 'bg-gray-200';
  const highlightColor = isDark ? 'bg-gray-700' : 'bg-gray-100';
  
  const baseStyle = `relative overflow-hidden ${baseColor} before:absolute before:inset-0 transition-opacity duration-300`;
  
  const getVariantStyle = () => {
    if (customShape) {
      switch (customShape) {
        case 'project-card':
          return 'h-[500px] md:h-[500px] lg:h-[650px] xl:h-[585px] rounded-none';
        case 'movie-slide':
          return 'w-full h-[497px] md:h-[550px] lg:h-[650px] rounded-lg bg-transparent';
        case 'profile':
          return 'rounded-full';
        default:
          return 'rounded-md';
      }
    }
    
    switch (variant) {
      case 'circular':
        return 'rounded-full';
      case 'text':
        return 'h-4 w-full rounded';
      case 'image':
        return 'rounded-md';
      default:
        return 'rounded-md';
    }
  };

  const getAnimationStyle = () => {
    switch (animation) {
      case 'wave':
        return 'before:animate-wave before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent';
      case 'shimmer':
        return 'before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent';
      case 'pulse':
      default:
        return 'animate-pulse';
    }
  };

  const style: React.CSSProperties = {
    width: width,
    height: height,
    borderRadius: borderRadius
  };

  return (
    <div
      className={cn(
        baseStyle,
        getVariantStyle(),
        getAnimationStyle(),
        'shiny-effect',
        className
      )}
      style={style}
    />
  );
};

export default Skeleton; 