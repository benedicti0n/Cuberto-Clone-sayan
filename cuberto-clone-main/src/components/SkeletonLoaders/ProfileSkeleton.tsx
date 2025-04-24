import React from 'react';
import Skeleton from '../ui/Skeleton';

interface ProfileSkeletonProps {
  className?: string;
}

const ProfileSkeleton: React.FC<ProfileSkeletonProps> = ({ className }) => {
  return (
    <div className={`flex flex-col md:flex-row gap-6 ${className}`}>
      {/* Avatar placeholder */}
      <Skeleton 
        variant="circular"
        animation="wave" 
        width={100} 
        height={100} 
      />
      
      <div className="flex flex-col gap-3 flex-1">
        {/* Name placeholder */}
        <Skeleton 
          variant="text" 
          animation="wave" 
          className="w-1/3 h-8" 
        />
        
        {/* Bio placeholder */}
        <div className="space-y-2">
          <Skeleton variant="text" animation="wave" className="w-full h-4" />
          <Skeleton variant="text" animation="wave" className="w-full h-4" />
          <Skeleton variant="text" animation="wave" className="w-3/4 h-4" />
        </div>
        
        {/* Stats placeholder */}
        <div className="flex gap-4 mt-2">
          <Skeleton variant="rectangular" animation="wave" className="w-20 h-8 rounded-full" />
          <Skeleton variant="rectangular" animation="wave" className="w-20 h-8 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton; 