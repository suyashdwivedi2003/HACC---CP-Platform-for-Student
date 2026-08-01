import React, { useEffect, useState } from "react";
import parse from "html-react-parser";
import { useParams } from "react-router-dom";
import { useBlogStore } from "../stores/useBlogStore";
import { useChatStore } from "../stores/useChatStore";
import BlogDetailSkeleton from "../skeleton-screen/BlogDetailSkeleton.jsx";

const BlogDetails = () => {
  const { messages, subscribeToMessage, unsubscribeToMessage } = useChatStore();

  useEffect(() => {
    subscribeToMessage();
    return () => unsubscribeToMessage();
  }, [messages]);

  const { blogid } = useParams();
  const { getBlog, isFetchingBlog, currentBlog } = useBlogStore();

  useEffect(() => {
    getBlog(blogid);
  }, [blogid]);

  if (isFetchingBlog || !currentBlog) {
    return <BlogDetailSkeleton />;
  }

  return (
    <div className="relative w-full">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed top-0 left-0 w-full h-full object-cover z-[-1] blur-xl"
      >
        <source src="/bgvideo2.mp4" type="video/mp4" />
      </video>

      <div className="w-full max-w-4xl px-4 sm:px-6 md:px-12 py-6 mt-20 mx-auto">
        <img
          src={
            currentBlog.coverImage !== "null"
              ? currentBlog.coverImage
              : "/avatar.png"
          }
          alt="Cover"
          className="w-full max-h-[350px] object-cover rounded-md"
        />

        <h1 className="text-2xl sm:text-3xl font-bold mt-8">{currentBlog.title}</h1>
        <p className="text-gray-500 font-semibold mt-1 text-sm sm:text-base">
          By {currentBlog.createdBy?.fullname || "Unknown"}
        </p>

        <div className="prose prose-sm sm:prose-lg prose-slate mt-6 max-w-none">
          {parse(currentBlog.content)}
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
