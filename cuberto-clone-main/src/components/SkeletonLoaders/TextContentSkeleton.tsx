import React from 'react';
import Skeleton from '../ui/Skeleton';

interface TextContentSkeletonProps {
  className?: string;
  lines?: number;
  heading?: boolean;
}

const TextContentSkeleton: React.FC<TextContentSkeletonProps> = ({ 
  className = '',
  lines = 5,
  heading = true
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {heading && (
        <Skeleton 
          variant="text" 
          animation="wave" 
          className="w-2/3 h-8 mb-6" 
        />
      )}
      
      <div className="space-y-2">
        {Array(lines).fill(0).map((_, index) => (
          <Skeleton 
            key={index}
            variant="text" 
            animation="wave" 
            className={`h-4 ${index === lines - 1 ? 'w-4/5' : 'w-full'}`} 
          />
        ))}
      </div>
    </div>
  );
};

export default TextContentSkeleton; 