import { useRef, useState, useEffect } from "react";
import { useChatStore } from "../stores/useChatStore.js";
import { useAuthStore } from "../stores/useAuthStore.js";
import { Image, Send, X, User } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {

  const { authUser } = useAuthStore();
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [text, setText] = useState("");
  const { sendMessage, users, getAllUsers } = useChatStore();
  const [suggestions, setSuggestions] = useState([]);
  const [ids, setIds] = useState([]);
  const [cursorPos, setCursorPos] = useState(0);

  // console.log(users);

  useEffect(() => {
      const fetchUsers = async () => {
        await getAllUsers();
      }
      fetchUsers();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({ 
        text : text.trim(),
        image: imagePreview,
        ids: ids,
      });
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.log("Failed to send message: ", error);
    }
  }

  const handleInputChange = (e) => {
    const msg = e.target.value;
    setText(msg);
    const cursor = e.target.selectionStart;
    setCursorPos(cursor);

    const regex = /(?:^|\s)(@(?:[^\s]+(?:\s+[^\s]+)*)?)/;
    const substring = text.slice(0, cursor);
    const match = substring.match(regex);
    if(match){
      console.log("Hola");
      const query = match[1].slice(1);
      const filtered = users.data.filter((user)=>
        user.fullname.startsWith(query)
      );
      setSuggestions(filtered);
    } else{
      setSuggestions([]);
    }
  }

  const selectSuggestion = (user) => {
    const regex = /(?:^|\s)(@(?:[^\s]+(?:\s+[^\s]+)*)?)/;
    const beforeCursor = text.slice(0, cursorPos);
    // const afterCursor = text.slice(cursorPos);
    const newBeforeCursor = beforeCursor.replace(regex, `@${user.fullname}`);
    const newMessage = newBeforeCursor;
    setText(newMessage);
    setSuggestions([]);
    setIds((prevIds) => [...prevIds, user._id]);
  }



  return (
    <div className="p-4 w-full">

      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
                flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2 relative">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            disabled={authUser === null ? true : false}
            onChange={handleInputChange}
          />
          {
            suggestions.length > 0 && (
              <ul className="absolute bottom-full left-0 mb-2 w-72 max-h-60 overflow-y-auto bg-base-200 rounded-lg shadow-lg border border-zinc-700 z-10">
                {
                  suggestions.map(user => (
                    <li 
                      key={user._id} 
                      onClick={() => selectSuggestion(user)}
                      className="px-4 py-2 hover:bg-base-300 cursor-pointer flex items-center gap-2 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
                        {user.avatar ? (
                          <img 
                            src={user.avatar} 
                            alt={user.fullname} 
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <User size={16} className="text-zinc-300" />
                        )}
                      </div>
                      <span className="font-medium">{user.fullname}</span>
                    </li>
                  ))
                }
              </ul>
            )
          }

          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`hidden sm:flex btn btn-circle
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>

        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
}

export default MessageInput