import React from 'react';

const Timepass = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <video
        autoPlay
        loop
        muted
        className="absolute w-full h-full object-cover"
      >
        <source src="/bgvideo1.mp4" type="video/mp4" />
      </video>

      <div className="relative z-10 text-white text-center mt-40">
        <h1 className="text-4xl font-bold">Welcome to the Timepass Page</h1>
      </div>
    </div>
  );
};

export default Timepass;
