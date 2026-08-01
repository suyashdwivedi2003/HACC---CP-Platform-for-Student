import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://hacc-2kvi.onrender.com/api",   //"https://hacc-2kvi.onrender.com/api"
  withCredentials: true,
});