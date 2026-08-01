import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ChatSkeleton = () => {
  // Array to generate multiple messages
  const messages = Array(8).fill(null);
  
  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Top status bar */}
      <div className="bg-gray-800/40 p-4 flex justify-end">
        <div className="flex items-center">
          <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
          <Skeleton width={100} height={16} baseColor="#1E293B" highlightColor="#334155" />
        </div>
      </div>
      
      {/* Date divider */}
      <div className="flex items-center justify-center my-6">
        <div className="border-t border-gray-700 flex-grow"></div>
        <div className="mx-4">
          <Skeleton width={100} height={24} baseColor="#1E293B" highlightColor="#334155" className="rounded-full" />
        </div>
        <div className="border-t border-gray-700 flex-grow"></div>
      </div>
      
      {/* Chat messages - strictly alternating */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-6">
        {messages.map((_, index) => {
          const isRight = index % 2 !== 0;
          // Randomize message width between 100-200px
          const messageWidth = Math.floor(Math.random() * 100) + 100;
          
          return (
            <div key={index} className={`flex flex-col ${isRight ? 'items-end' : 'items-start'}`}>
              <div className="flex items-center mb-1">
                <Skeleton 
                  width={isRight ? 60 : 40} 
                  height={14} 
                  baseColor="#1E293B" 
                  highlightColor="#334155" 
                  className="mr-2" 
                />
                <Skeleton 
                  width={40} 
                  height={14} 
                  baseColor="#1E293B" 
                  highlightColor="#334155" 
                />
              </div>
              <div className="flex items-center">
                {!isRight && (
                  <div className="mr-2">
                    <Skeleton circle width={30} height={30} baseColor="#1E293B" highlightColor="#334155" />
                  </div>
                )}
                <div className="bg-gray-800/70 rounded-lg px-4 py-2 max-w-xs">
                  <Skeleton 
                    width={messageWidth} 
                    height={16} 
                    baseColor="#1E293B" 
                    highlightColor="#334155" 
                  />
                </div>
                {isRight && (
                  <div className="ml-2">
                    <Skeleton circle width={30} height={30} baseColor="#1E293B" highlightColor="#334155" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Message input area */}
      <div className="p-4">
        <div className="flex items-center">
          <div className="flex-1 relative">
            <Skeleton height={40} baseColor="#1E293B" highlightColor="#334155" className="rounded-full" />
          </div>
          <div className="ml-2">
            <Skeleton circle width={40} height={40} baseColor="#1E293B" highlightColor="#334155" />
          </div>
          <div className="ml-2">
            <Skeleton circle width={40} height={40} baseColor="#1E293B" highlightColor="#334155" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSkeleton;