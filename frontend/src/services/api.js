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
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    config.data = {
      ...config.data,
      appVersion: "1.0.0",
      platform: "web",
    };

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      console.log("Unauthorized, redirect to login");
    }
    return Promise.reject(error);
  }
);

export default api;
