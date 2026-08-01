import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function ContestSkeleton() {
  return (
    <div className="bg-black min-h-screen text-white p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Contest List</h1>
        
        {/* Filter Tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="rounded-full">
              <Skeleton height={32} width={80} borderRadius={20} baseColor="#333" highlightColor="#444" />
            </div>
          ))}
        </div>
        
        {/* Gold divider */}
        <div className="h-1 bg-yellow-500 rounded mb-4" />
      </div>
      
      {/* Contest Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((card) => (
          <div key={card} className="bg-gray-900 rounded-lg p-4 relative">
            {/* Bookmark Icon */}
            <div className="absolute right-4 top-4">
              <Skeleton height={20} width={20} circle baseColor="#333" highlightColor="#444" />
            </div>
            
            {/* Platform Badge */}
            <div className="mb-2">
              <Skeleton height={28} width={90} borderRadius={16} baseColor="#333" highlightColor="#444" />
            </div>
            
            {/* Contest Title */}
            <div className="mb-4">
              <Skeleton height={24} width="80%" baseColor="#333" highlightColor="#444" />
            </div>
            
            {/* Status Row */}
            <div className="flex items-center gap-2 mb-2">
              <Skeleton circle height={16} width={16} baseColor="#333" highlightColor="#444" />
              <Skeleton height={16} width={60} baseColor="#333" highlightColor="#444" />
            </div>
            
            {/* Date Row */}
            <div className="flex items-center gap-2 mb-2">
              <Skeleton circle height={16} width={16} baseColor="#333" highlightColor="#444" />
              <Skeleton height={16} width={120} baseColor="#333" highlightColor="#444" />
            </div>
            
            {/* Duration Row */}
            <div className="flex items-center gap-2 mb-4">
              <Skeleton circle height={16} width={16} baseColor="#333" highlightColor="#444" />
              <Skeleton height={16} width={100} baseColor="#333" highlightColor="#444" />
            </div>
            
            {/* Button */}
            <Skeleton height={40} borderRadius={8} baseColor="#333" highlightColor="#444" />
          </div>
        ))}
      </div>
    </div>
  );
}