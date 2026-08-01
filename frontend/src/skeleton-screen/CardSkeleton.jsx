import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const CardSkeleton = () => {
  return (
    <div className="flex flex-col md:flex-row justify-center items-center w-full bg-gray-900 py-8 px-4">
      {/* Card 1 */}
      <div className="w-full md:w-1/3 max-w-xs mx-2 mb-6 md:mb-0 bg-gray-800 rounded-lg overflow-hidden">
        <div className="h-40 w-full">
          <Skeleton height="100%" baseColor="#374151" highlightColor="#4B5563" />
        </div>
        <div className="p-4">
          <Skeleton width={80} height={24} baseColor="#374151" highlightColor="#4B5563" />
          <div className="mt-4">
            <Skeleton 
              height={36} 
              width={100} 
              baseColor="#2563EB" 
              highlightColor="#3B82F6" 
              className="rounded-full" 
            />
          </div>
        </div>
      </div>

      {/* Card 2 */}
      <div className="w-full md:w-1/3 max-w-xs mx-2 mb-6 md:mb-0 bg-gray-800 rounded-lg overflow-hidden">
        <div className="h-40 w-full">
          <Skeleton height="100%" baseColor="#374151" highlightColor="#4B5563" />
        </div>
        <div className="p-4">
          <Skeleton width={200} height={24} baseColor="#374151" highlightColor="#4B5563" />
          <div className="mt-4">
            <Skeleton 
              height={36} 
              width={100} 
              baseColor="#2563EB" 
              highlightColor="#3B82F6" 
              className="rounded-full" 
            />
          </div>
        </div>
      </div>

      {/* Card 3 */}
      <div className="w-full md:w-1/3 max-w-xs mx-2 bg-gray-800 rounded-lg overflow-hidden">
        <div className="h-40 w-full">
          <Skeleton height="100%" baseColor="#374151" highlightColor="#4B5563" />
        </div>
        <div className="p-4">
          <Skeleton width={80} height={24} baseColor="#374151" highlightColor="#4B5563" />
          <div className="mt-4">
            <Skeleton 
              height={36} 
              width={100} 
              baseColor="#2563EB" 
              highlightColor="#3B82F6" 
              className="rounded-full" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardSkeleton;