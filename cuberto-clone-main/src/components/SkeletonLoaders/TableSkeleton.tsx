import React from 'react';
import Skeleton from '../ui/Skeleton';

interface TableSkeletonProps {
  className?: string;
  rows?: number;
  columns?: number;
  hasHeader?: boolean;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({ 
  className = '',
  rows = 5,
  columns = 4,
  hasHeader = true
}) => {
  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="divide-y divide-gray-200">
          {/* Header */}
          {hasHeader && (
            <div className="grid gap-3 px-4 py-5 bg-gray-50" 
                 style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
              {Array(columns).fill(0).map((_, index) => (
                <Skeleton 
                  key={`header-${index}`}
                  variant="text" 
                  animation="wave" 
                  className="h-6"
                />
              ))}
            </div>
          )}
          
          {/* Rows */}
          {Array(rows).fill(0).map((_, rowIndex) => (
            <div 
              key={`row-${rowIndex}`}
              className="grid gap-3 px-4 py-5" 
              style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
            >
              {Array(columns).fill(0).map((_, colIndex) => (
                <Skeleton 
                  key={`cell-${rowIndex}-${colIndex}`}
                  variant="text" 
                  animation="wave" 
                  className="h-5"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TableSkeleton; 