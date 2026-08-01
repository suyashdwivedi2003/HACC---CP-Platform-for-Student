import React from "react";
import { Link } from "react-router-dom";

const BlogCard = ({ blog }) => {
  return (
    <Link to={`/blogs/${blog._id}`} className="block">
      {" "}
      {/*when this card component will be clicked it will open the blog post page for that particualr blog */}
      <div
        className="bg-white rounded-xl shadow-md overflow-hidden max-w-sm cursor-pointer 
                 transition-transform duration-300 ease-in-out hover:shadow-lg 
                 hover:-translate-y-1 relative"
      >
        {/* Cover Image */}
        <div className="h-48 overflow-hidden">
          <img
            src={blog.coverImage || "/api/placeholder/400/250"}
            alt={blog.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
        </div>
        <div className="p-6 border-t border-gray-700 bg-gray-700">
          <h3 className="text-2xl font-bold mb-3 text-blue-300">
            {blog.title}
          </h3>
            <p className="text-gray-500 text-sm">
              By {blog.createdBy?.fullname || "Unknown"}
            </p>
        </div>

        {/* Blog Info */}
      </div>
    </Link>
  );
};

export default BlogCard;
