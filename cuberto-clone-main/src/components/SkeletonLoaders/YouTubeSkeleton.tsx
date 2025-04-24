import React from 'react';
import Skeleton from '../ui/Skeleton';

interface YouTubeSkeletonProps {
  className?: string;
  videoCount?: number;
}

const YouTubeSkeleton: React.FC<YouTubeSkeletonProps> = ({ 
  className = '',
  videoCount = 4
}) => {
  // Header with navigation tabs
  const renderHeader = () => (
    <div className="flex items-center justify-between w-full py-3">
      <div className="flex items-center gap-4">
        <Skeleton variant="rectangular" width={120} height={32} animation="wave" className="rounded" />
        <div className="hidden md:flex gap-2">
          <Skeleton variant="circular" width={32} height={32} animation="wave" />
          <Skeleton variant="circular" width={32} height={32} animation="wave" />
          <Skeleton variant="circular" width={32} height={32} animation="wave" />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Skeleton variant="rectangular" width={100} height={32} animation="wave" className="rounded-full" />
        <Skeleton variant="circular" width={32} height={32} animation="wave" />
      </div>
    </div>
  );

  // Category chips/tabs
  const renderCategories = () => (
    <div className="flex gap-2 overflow-x-auto py-3 no-scrollbar">
      {Array(8).fill(0).map((_, i) => (
        <Skeleton 
          key={i} 
          variant="rectangular" 
          animation="wave" 
          className="rounded-full" 
          width={i % 3 === 0 ? 80 : i % 3 === 1 ? 100 : 60} 
          height={32} 
        />
      ))}
    </div>
  );

  // Video items
  const renderVideoGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-3">
      {Array(videoCount).fill(0).map((_, i) => (
        <div key={i} className="flex flex-col gap-3">
          <Skeleton 
            variant="rectangular" 
            animation="wave" 
            className="w-full aspect-video rounded-lg" 
          />
          <div className="flex gap-3">
            <Skeleton variant="circular" width={40} height={40} animation="wave" />
            <div className="flex-1 flex flex-col gap-2">
              <Skeleton variant="text" animation="wave" className="w-full h-4" />
              <Skeleton variant="text" animation="wave" className="w-3/4 h-4" />
              <Skeleton variant="text" animation="wave" className="w-1/2 h-3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className={`w-full bg-black text-white py-2 ${className}`}>
      {renderHeader()}
      {renderCategories()}
      {renderVideoGrid()}
    </div>
  );
};

export default YouTubeSkeleton; 