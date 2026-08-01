import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function GallerySkeleton() {
  const items = Array.from({ length: 6 });

  return (
    <div className="bg-gray-900 min-h-screen p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
        {items.map((_, index) => (
          <div
            key={index}
            className="bg-gray-800 rounded-lg overflow-hidden shadow"
          >
            {/* full‑width shimmer placeholder */}
            <div className="w-full aspect-[6/3]">
              <Skeleton
                className="w-full h-full"
                baseColor="#1e2837"
                highlightColor="#2a3649"
                borderRadius={0}
              />
            </div>

            {/* footer with “By” */}
            <div className="px-4 py-3 bg-gray-800 border-t border-gray-700 flex items-center">
              <span className="text-sm text-gray-500">By</span>
              <Skeleton
                className="ml-2 inline-block"
                width={60}
                height={14}
                baseColor="#1e2837"
                highlightColor="#2a3649"
                borderRadius={2}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
