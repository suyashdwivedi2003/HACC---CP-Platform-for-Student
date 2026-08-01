import { useState, useRef, useEffect } from "react";
import { useBlogStore } from "../stores/useBlogStore";
import { Editor } from "@tinymce/tinymce-react";
import { useChatStore } from "../stores/useChatStore";
import { CheckCircle } from 'lucide-react';

const CreateBlogPage = () => {


  const {messages, subscribeToMessage, unsubscribeToMessage} = useChatStore();
  const {isCreatingBlog, addBlog} = useBlogStore();

  const editorRef = useRef(null);
  
  useEffect(() => {
    subscribeToMessage();
    return () => unsubscribeToMessage();
  }, [messages]);
  
  const [progress, setProgress] = useState(100);
  const duration = 2600;
  
  
  useEffect(() => {
    const startTime = Date.now();
    const endTime = startTime + duration;
    setProgress(100);
    
    const progressInterval = setInterval(() => {
      const now = Date.now();
      const remaining = endTime - now;
      const percent = (remaining / duration) * 100;
      console.log(percent);
      if (percent <= 0) {
        clearInterval(progressInterval);
        setProgress(0);
      } else {
        setProgress(percent);
      }
    }, 100);
    
    return () => clearInterval(progressInterval);
  }, [isCreatingBlog]);



  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState();
  const [image, setImage] = useState(null);
  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  useEffect(() => {
    if (content) {
      console.log("Image updated:", content);
    }
  }, [content]);

  const fileInputRef = useRef(null);

  const handleFileUpload = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);

    if (image) {
      formData.append("image", image); // This field name should match what multer expects.
    }

    console.log("FormData ready for submission.");
    await addBlog(formData);

    setTitle("");
    setContent("");
    setImage(null);
    if (editorRef.current) {
      editorRef.current.setContent(""); // Clear TinyMCE editor content
    }
  };

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

    
      {
        isCreatingBlog && 
        (
          <div className="fixed bottom-4 left-4 bg-black text-white rounded shadow-lg px-4 py-3 flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="text-green-500" size={20} />
              <span>Blog is Adding...</span>
            </div>
            <div className="bg-gray-800 h-1 w-full rounded-full">
              <div 
                className="bg-green-500 h-1 rounded-full transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )
      }



      <div className="max-w-4xl mx-auto mt-20 p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl text-blue-500 font-bold mb-4">
          Add a New Blog
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-3">Post Title</label>
            <input
              type="text"
              value={title}
              placeholder="Title"
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded text-black"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-3">Post Content</label>
            <Editor
              apiKey="myjj8iymxg6y5rj4b996n0vuak7utowkf1snqnk5huqr5i11"
              textareaName="content"
              onInit={(evt, editor) => (editorRef.current = editor)}
              init={{
                placeholder: "Write your content here",
              }}
              onEditorChange={(newText) => setContent(newText)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-3">Cover Image</label>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={handleFileUpload}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Upload
            </button>
            <p className="mt-2 text-gray-600">
              {image ? `Selected: ${image.name}` : "No image selected"}
            </p>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Submit Blog
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateBlogPage;
