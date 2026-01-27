import axios from "axios";

// 1. Create the Axios instance
const api = axios.create({
  baseURL: "http://localhost:8080/api", // Make sure port matches your backend
});

// 2. 🔥 CRITICAL: Add Interceptor to attach Token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // 👈 This was likely missing!
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
