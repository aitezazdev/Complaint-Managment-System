import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", 
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // IMPORTANT: Don't modify data if it's FormData (for file uploads)
    if (config.data instanceof FormData) {
      // Remove Content-Type header to let browser set it with boundary
      delete config.headers["Content-Type"];
      
      // Append metadata to FormData instead of replacing config.data
      config.data.append("appVersion", "1.0.0");
      config.data.append("platform", "web");
    } else {
      // For regular JSON requests
      config.data = {
        ...config.data,
        appVersion: "1.0.0",
        platform: "web",
      };
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("Unauthorized, redirect to login");
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;