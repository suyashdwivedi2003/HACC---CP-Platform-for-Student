import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { getAuth, signOut } from "firebase/auth";
import io from "socket.io-client";
import { useContestStore } from "./useContestStore.js";


const BASE_URL = "https://hacc-2kvi.onrender.com";

export const useAuthStore = create(
  (set, get) => ({
    fullname: null,
    email: null,
    authProvider: null,
    bracnh: null,
    year: null,
    college: null,
    ccId: null,
    cfId: null,
    leetId: null,

    authUser: null,
    totalUsers: 0,
    isSigninUp: false,
    isLoggingIn: false,
    isCheckingAuth: false,
    isSendingOtp: false,
    isWorking: false,
    onlineUserCount: 0,
    socket: null,

    // Your actions...
    checkAuth: async (token) => {
      set({ isCheckingAuth: true });
      try {
        const res = await axiosInstance.post("/auth/check", { token });
        set({ authUser: res.data });
        useContestStore.setState({bookmarkContest: [...get().authUser.bookmarkedContests] })
        console.log("checkAuth authuser: ", get().authUser);    //for check
        get().connectSocket();
      } catch (error) {
        console.log("Error in checkAuth: ", error);
        set({ authUser: null });
      } finally {
        set({ isCheckingAuth: false });
      }
    },

    getTotalUsers: async () => {
      set({isWorking: true});
      try{
        const response = await axiosInstance.get("/auth/getTotalUsers");
        set({ totalUsers: response.data });
        
      } catch(error){
        console.log("Error in getTotalUsers: ", error);
        set({ totalUsers: 0})
      } finally{
        set({isWorking: false});
      }
    },


    signup: async (data) => {
      set({ isSigninUp: true });
      try {
        const res = await axiosInstance.post("/auth/signup", data);
        set({ authUser: res.data });
        toast.success("Account Created Successfully");
        useContestStore.setState({bookmarkContest: [...get().authUser.bookmarkedContests] })
        get().connectSocket();
      } catch (error) {
        set({ authUser: null });
        toast.error(error.response.data.message);
        console.log("Error in signup: ", error);
      } finally {
        set({ isSigninUp: false });
      }
    },

    login: async (data) => {
      set({ isLoggingIn: true });
      try {
        const res = await axiosInstance.post("/auth/login", data);
        set({ authUser: res.data });
        console.log("Login auth user: ", get().authUser);    //for check
        toast.success("Logged in Successfully");
        useContestStore.setState({bookmarkContest: [...get().authUser.bookmarkedContests] })
        get().connectSocket();
      } catch (error) {
        set({ authUser: null });
        console.log("Error in login: ", error);
        toast.error(error.response.data.message);
      } finally {
        set({ isLoggingIn: false });
      }
    },

    logout: async (navigate) => {
      try {
        const { authProvider } = get();
        await axiosInstance.post("/auth/logout");
        if (authProvider !== "local") {
          const auth = getAuth();
          signOut(auth)
            .then(() => {
              set({fullname: null,email: null,authProvider: null,authUser: null,branch: null,college: null,year: null,ccId: null,cfId: null,leetId: null,});
            })
            .catch((error) => {
              console.error("Error Logging out:", error);
            });
        } 
        else {
          set({ authUser: null });
        }
        get().disconnectSocket();
        navigate("/login");
        toast.success("Logged Out Successfully");
      } catch (error) {
        const message = error?.response?.data?.message|| error ?.message || "something went wrong";
        toast.error(message);
      }
    },

    updateCodingIds: async (data) => {
      set({isWorking: true});
      try{
        console.log("Inside AuthStore: updateCodingIds")
        const response = await axiosInstance.put("/auth/updateCodingIds", data);
        set({authUser: response.data});
        useContestStore.setState({bookmarkContest: [...get().authUser.bookmarkedContests] })
        toast.success("CodingIds Updated Successfully");
      }catch(error){
        toast.error(error.response.data.message);
      }finally{
        set({isWorking: false});
      }
    },

    updateProfile: async (data) => {
      set({isWorking: true});
      try{
        const response = await axiosInstance.put("/auth/updateProfile", data);  
        set({authUser: response.data});
        useContestStore.setState({bookmarkContest: [...get().authUser.bookmarkedContests] })
        toast.success("Profile Updated Successfully");
      }catch(error){
        toast.error(error.response.data.message);
      }finally{
        set({isWorking: false});
      }
    },

    updateImage: async (data) => {
      set({isWorking: true});
      try{
        console.log("Hola", data);
        const response = await axiosInstance.put("/auth/updateImage", data);
        set({authUser: response.data});
      } catch(error) {
        toast.error(error.response.data.message);
      } finally{
        set({isWorking: false});
      }
    },

    removeImage: async (data) => {
      set({isWorking: true});
      try{
        console.log("Hola", data);
        const response = await axiosInstance.put("/auth/removeImage", data);
        set({authUser: response.data});
      } catch(error) {
        toast.error(error.response.data.message);
      } finally{
        set({isWorking: false});
      }
    },

    refreshRatings: async (data) => {
      set({isWorking: true});
      try{
        const response = await axiosInstance.post("/auth/refreshRatings", data);
        set({authUser: response.data});
        useContestStore.setState({bookmarkContest: [...get().authUser.bookmarkedContests] })
        toast.success("Ratings Updated successfully.")
      }catch(error){
        toast.error(error.response.data.message);
      }finally{
        set({isWorking: false});
      }
    },

    connectSocket: async () => {
      const { authUser } = get();
      
      if (!authUser || get().socket?.connected) return;
    
      // Get the user ID safely, checking both direct and _doc paths
      const userId = authUser._id || (authUser._doc && authUser._doc._id);
      
      if (!userId) {
        console.error("Unable to find user ID in authUser object:", authUser);
        return;
      }
      
      // Important: Set autoConnect to false to prevent automatic connection
      const socket = io(BASE_URL, {
        autoConnect: false,
        query: {
          id: userId, // Use the actual user ID
        },
      });
      
      // Now manually connect
      socket.connect();
      set({ socket: socket });
      
      // console.log(get().socket.connected);
      // console.log("SOCKET AFTER CONNECTION: ", get().socket);
    
      socket.on("getOnlineUserCount", (cnt) => {
        set({ onlineUserCount: cnt });
      });
    },

    disconnectSocket: () => {
      if (get().socket?.connected) get().socket.disconnect();
    },

    oAuthLogin: async (user, navigate) => {
      set({ isLoggingIn: true });
      try {
        const response = await axiosInstance.post("/auth/oauthlogin",{fullname: user.displayName,email: user.email,authProvider: "google",},
          { headers: { "Content-Type": "application/json" } }
        );

        set({ authUser: response.data });
        toast.success("Logged in successfully!");
        get().connectSocket();

      } catch (error) {
        set({ fullname: null,email: null,authProvider: null,authUser: null });
        const auth = getAuth();
        signOut(auth).catch((error) => {
          console.error("Error signing out:", error);
        });
        console.log("Error in oAuthLogin: ", error);
        toast.error(error.response?.data?.message || "OAuth login failed!");
      } finally {
        set({ isLoggingIn: false });
      }
    },

    oAuthSignup: async (navigate) => {
      set({ isSigninUp: true });
      try {
        console.log("Inside oAuthSignup");
        const {fullname,email,authProvider,branch,college,year,ccId,cfId,leetId} = get();
        const response = await axiosInstance.post("/auth/oauthuser",{fullname,email,authProvider,branch,college,year,ccId,cfId,leetId,},
          { headers: { "Content-Type": "application/json" } } );

        set({ authUser: response.data });
        toast.success("Account Created Successfully!");
        get().connectSocket();
        navigate("/");
      } catch (error) {
        set({ authUser: null });
        toast.error(error.response.data.message);
        console.log("Error in signup: ", error);
      } finally {
        set({ isSigninUp: false });
      }
    },

    formValues: (data) => {
      set({ branch: data.branch,college: data.college,year: data.year,ccId: data.ccId,cfId: data.cfId,leetId: data.leetId });
    },

    oauthData: (data) => {
      set({ fullname: data.displayName,email: data.email,authProvider: "google" });
    },

    loginWithOTP: async (data) => {
      set({ isLoggingIn: true });
      try {
        console.log(data.OTP);
        const res = await axiosInstance.post("/auth/login-OTP", data);
        set({ authUser: res.data });
        toast.success("Logged in Successfully");
        get().connectSocket();
      } catch (error) {
        set({ authUser: null });
        console.log("Error in login: ", error);
        toast.error(error.response.data.message || "Login Failed");
        console.log("Error in login: ", error);
      } finally {
        set({ isLoggingIn: false });
      }
    },

    signUpWithOTP: async (data) => {
      set({ isSigninUp: true });
      try{
        const res = await axiosInstance.post("/auth/signUp-OTP", data);
        set({ authUser: res.data });
        toast.success("OTP verified Successfully");
      }catch(error) {
        toast.error(error.response.data.message || "OTP verification Failed");
        console.log("Error in login: ", error);
      }finally{
        set({isSigninUp: false});
      }
    },

    generateOTP: async (data) => {
      set({ isSendingOtp: true });
      try {
        await axiosInstance.post("/auth/gen-OTP", data);
        toast.success("OTP sent Successfully");
      } catch (error) {
        console.log("Error in Sending OTP: ", error);
        toast.error(error.response?.data?.message || "Error in generating OTP");
      } finally {
        set({ isSendingOtp: false });
      }
    },

    changePassword: async (data) => {
      try {
        await axiosInstance.post("/change-password", data);
        toast.success("Password changed Successfully");
      } catch (error) {
        console.log("Error in changing Password: ", error);
        toast.error(
          error.response?.data?.message || "Error in changing Password"
        );
      }
    },
  }),
  {
    name: "auth-store", // Unique name for localStorage key
    partialize: (state) => {
      // Exclude non-serializable values like socket from being persisted
      const { socket, ...persistedState } = state;
      return persistedState;
    },
  }
);