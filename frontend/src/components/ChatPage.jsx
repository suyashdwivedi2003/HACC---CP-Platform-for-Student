import React, { useEffect, useRef, useState } from "react";
import { useChatStore } from "../stores/useChatStore.js";
import { useAuthStore } from "../stores/useAuthStore.js";
import { formatMessageTime, formatMessageDate } from "../lib/utils.js";
import MessageInput from "./MessageInput.jsx";
import ChatSkeleton from "../skeleton-screen/ChatSkeleton.jsx";

import toast from "react-hot-toast";

const ChatPage = () => {
  const {
    isMessagesLoading,
    messages,
    getMessages,
    subscribeToMessage,
    unsubscribeToMessage,
    unreadMessages,
    isSending,
  } = useChatStore();
  const { authUser, checkAuth, onlineUserCount } = useAuthStore();
  const messageEndRef = useRef(null);

  const [previewSrc, setPreviewSrc] = useState(null);
  const handleImageClick = (src) => {
    setPreviewSrc(src);
  };
  const handleClosePreview = () => {
    setPreviewSrc(null);
  };

  useEffect(() => {
    const fetchMessages = async () => {
      await getMessages();
    };
    fetchMessages();

    const timer = setTimeout(() => {
      console.log("3 seconds passed!");

      toast("Messages older than 4 days will be automatically deleted.", {
        icon: "⚠️",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    }, 3000);


    // Cleanup (optional, but good practice)
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    subscribeToMessage();
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
    return () => unsubscribeToMessage();
  }, [messages]);

  if (isMessagesLoading) {
    return <ChatSkeleton />;
  }
  if (isSending) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900">
        <div className="bg-white/10 backdrop-blur-lg p-12 rounded-2xl shadow-2xl flex flex-col items-center border border-white/20">
          <div className="w-20 h-20 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-6"></div>
          <h1 className="text-2xl font-bold text-white">Sending Message...</h1>
          <p className="text-blue-200 mt-2">This will just take a moment</p>
        </div>
      </div>
    );
  }
  const groupMessagesByDate = (messages) => {
    return messages.reduce((groups, message) => {
      const date = formatMessageDate(message.createdAt);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
      return groups;
    }, {});
  };

  console.log(unreadMessages);

  const validMessages = messages.filter((eachmsg) => eachmsg.senderId !== null);
  const messagesByDate = groupMessagesByDate(validMessages);
  const dates = Object.keys(messagesByDate);

  return (
    <div className="relative w-full mb-20">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed top-0 left-0 w-full h-full object-cover z-[-1]"
      >
        <source src="/bgvideo2.mp4" type="video/mp4" />
      </video>

      <div className="bg-blue-100 p-3 rounded-lg shadow-sm mb-4 flex items-center justify-center text-blue-800 font-medium mt-20">
        <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
        <span>{`Online users: ${onlineUserCount}`}</span>
      </div>

      {previewSrc && (
        <div
          onClick={handleClosePreview}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <img
            src={previewSrc}
            alt="preview"
            style={{ maxHeight: "90%", maxWidth: "90%", borderRadius: "10px" }}
          />
        </div>
      )}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {dates.map((date) => (
          <div key={date}>
            <div className="text-center my-4 relative">
              <div className="border-t border-gray-300 absolute w-full top-1/2"></div>
              <span className="bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-1.5 rounded-full text-sm font-medium text-gray-700 relative inline-block shadow-sm border border-gray-200">
                {date}
              </span>
            </div>
            {messagesByDate[date].map((eachmsg) => (
              <div
                key={eachmsg._id}
                className={`chat ${
                  eachmsg.senderId._id === authUser._id
                    ? "chat-end"
                    : "chat-start"
                }`}
                ref={messageEndRef}
              >
                <div className="chat-image avatar">
                  <div className="size-10 rounded-full border cursor-pointer">
                    <img
                      src={eachmsg.senderId.profilePic || "/avatar.png"}
                      alt="profile pic"
                      onClick={() =>
                        handleImageClick(
                          eachmsg.senderId.profilePic || "/avatar.png"
                        )
                      }
                    />
                  </div>
                </div>
                <div className="chat-header mb-1">
                  {eachmsg.senderId.fullname}
                  <time className="text-xs opacity-50 ml-1">
                    {formatMessageTime(eachmsg.createdAt)}
                  </time>
                </div>
                <div className="chat-bubble flex flex-col">
                  {eachmsg.image && (
                    <img
                      src={eachmsg.image}
                      alt="Attachment"
                      className="sm:max-w-[200px] rounded-md mb-2"
                    />
                  )}
                  {eachmsg.text && <p>{eachmsg.text}</p>}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <MessageInput />
    </div>
  );
};
export default ChatPage;
