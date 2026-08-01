import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useBlogStore = create ( (set,get) => ({

    isCreatingBlog: false,
    isFetchingBlogs: false,
    isFetchingBlog: false,
    AllBlogs: [],
    currentBlog: null,

    addBlog: async(data) => {
        set({isCreatingBlog: true});
        try{
            const response = await axiosInstance.post('/blog/addBlog', data);
            toast.success('Blog Added Successfully');
        }catch(error){
            toast.error(error.response.data.message);
            console.log("ERROR in addBlog", error);
        }finally{
            set({isCreatingBlog: false});
        }
    },

    getAllBlogs: async () => {
        set({isFetchingBlogs: true});
        try{
            const response = await axiosInstance.get("/blog/AllBlogs");
            set({AllBlogs: response.data});
        }catch(error){
            toast.error(error.response.data.message);
            console.log("ERROR in getAllBlogs", error);
        }finally{
            set({isFetchingBlogs: false});
        }
    },

    getBlog : async(blogid) => {
        set({isFetchingBlog: true});
        try{
            console.log("Inside getBlog");
            const response = await axiosInstance.get(`/blog/${blogid}`);
            console.log("Hola");
            set({currentBlog: response.data});
        }catch(error){
            toast.error(error.response.data.message);
            console.log("ERROR in getBlog", error);
        }finally{
            set({isFetchingBlog: false});
        }
    }
}))