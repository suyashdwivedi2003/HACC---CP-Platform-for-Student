import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function BlogDetailSkeleton() {
  return (
    <div className="bg-gray-900 min-h-screen text-white px-8 md:px-12 lg:px-16 py-8 mt-15">
      <div className="max-w-6xl">
        {/* Top section: Image - aligned to left */}
        <div className="mb-10">
          <Skeleton 
            height={250} 
            className="w-full md:w-7/12 lg:w-5/12" 
            baseColor="#1f2937" 
            highlightColor="#374151"
          />
        </div>
        
        {/* Title and subtitle - aligned to left */}
        <div className="mb-8 ml-1">
          <Skeleton 
            height={38} 
            width={300} 
            className="mb-3" 
            baseColor="#1f2937" 
            highlightColor="#374151"
          />
          <Skeleton 
            height={20} 
            width={120} 
            baseColor="#1f2937" 
            highlightColor="#374151"
          />
        </div>
        
        {/* Main content paragraphs - aligned to left */}
        <div className="space-y-5 ml-1 max-w-5xl">
          <Skeleton 
            count={1} 
            height={16} 
            className="w-full" 
            baseColor="#1f2937" 
            highlightColor="#374151"
          />
          
          <Skeleton 
            count={2} 
            height={16} 
            className="w-full" 
            baseColor="#1f2937" 
            highlightColor="#374151"
          />
          
          <div className="mt-6">
            <Skeleton 
              height={16} 
              width={250} 
              className="mb-3" 
              baseColor="#1f2937" 
              highlightColor="#374151"
            />
            
            <Skeleton 
              count={1} 
              height={16} 
              className="w-full" 
              baseColor="#1f2937" 
              highlightColor="#374151"
            />
          </div>
          
          {/* List items - aligned to left with indentation */}
          <div className="space-y-3 mt-5">
            {[1, 2, 3].map(item => (
              <Skeleton 
                key={item}
                height={16} 
                className="w-3/4" 
                baseColor="#1f2937" 
                highlightColor="#374151"
              />
            ))}
          </div>
          
          {/* Final paragraph with links */}
          <div className="mt-5">
            <Skeleton 
              count={2} 
              height={16} 
              className="w-full" 
              baseColor="#1f2937" 
              highlightColor="#374151"
            />
          </div>
        </div>
      </div>
    </div>
  );
}