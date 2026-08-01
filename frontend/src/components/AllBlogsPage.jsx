import React, { useEffect, useState } from "react";
import BlogCard from "./BlogCard.jsx";
import { useBlogStore } from "../stores/useBlogStore";
import { useChatStore } from "../stores/useChatStore.js";
import GallerySkeleton from "../skeleton-screen/GallerySkeleton.jsx";

const AllBlogsPage = () => {
  const {messages, subscribeToMessage, unsubscribeToMessage} = useChatStore();
  
  useEffect(() => {
    subscribeToMessage();
    return () => unsubscribeToMessage();
  }, [messages]);
  const { isFetchingBlogs, AllBlogs, getAllBlogs} = useBlogStore();

  useEffect(() => {
    getAllBlogs();
  }, []);

  if (isFetchingBlogs) {
    return <GallerySkeleton />;
  } else if (AllBlogs.length === 0) {
    return(
      <div className="relative w-full">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed top-0 left-0 w-full h-full object-cover z-[-1]"
      >
        <source src="/bgvideo2.mp4" type="video/mp4" />
      </video>
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-5xl font-bold mb-4">No Blogs Available</h1>
      <p className="text-xl mb-6">No blogs available right now</p>
      </div>
      </div>
    )
  }

  return (
    <div className="relative w-full">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed top-0 left-0 w-full h-full object-cover z-[-1]"
      >
        <source src="/bgvideo2.mp4" type="video/mp4" />
      </video>

      <div className="p-6 mt-15">
        <h1 className="text-3xl font-semibold mb-4">Blog List</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
          {AllBlogs.map((eachblog) => (
            <BlogCard key={eachblog._id} blog={eachblog} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllBlogsPage;
