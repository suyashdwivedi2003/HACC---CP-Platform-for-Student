import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore.js";


export const useChatStore = create((set, get) => ({
    messages: [],
    isMessagesLoading: false,
    isSending: false,
    users: [],
    unreadMessages: 0,

    getMessages: async () => {
        set({ isMessagesLoading: true });
        try {
            const response = await axiosInstance.get("/messages");
            set({ messages: response.data });
            console.log("messages: ", response.data);
        } catch (error) {
            toast.error(error.response.data.messages);
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async (msgData) => {
        set({isSending: true});
        const { messages } = get();
        try {
            console.log("hola", msgData);
            const response = await axiosInstance.post("/messages/send", msgData);
            console.log("Response: ", response);
            set({ messages: [...messages, response.data] });
        } catch (error) {
            toast.error(error.response.data.messages);
        } finally{
            set({isSending: false});
        }
    },

    subscribeToMessage: () => {
        const socket = useAuthStore.getState().socket;
        const authUser = useAuthStore.getState().authUser;

        if (!socket) {
            console.warn("Socket is not initialized.");
            return;
        }

        socket.on("newMessage", (newMessage) => {
            console.log(newMessage);
            const isMessageSentFromOther = newMessage.senderId._id !== authUser._id;
            const isUserTagged = newMessage.taggedUserIds?.includes(authUser._id);

            if (isMessageSentFromOther && isUserTagged) {
                set((state) => ({
                    unreadMessages: state.unreadMessages + 1
                }));
                toast.success("You have an unread messages");
            }

            if(!isMessageSentFromOther) return;
        
            set({
                messages: [...get().messages, newMessage]
            });
        });
    },

    unsubscribeToMessage: () => {
        const socket = useAuthStore.getState().socket;
        if (!socket) {
            console.warn("Socket is not initialized.");
            return;
        }
        socket.off("newMessage");
    },

    getAllUsers: async () => {
        try {
            const response = await axiosInstance.get("/messages/get-users");
            set({ users: response });
        } catch (error) {
            toast.error(error.response.data.messages);
        }
    },

    clearUnreadMessages: () => {
        set({ unreadMessages: 0 });
    }
}))