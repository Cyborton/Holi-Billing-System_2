import axios from "axios";

const isLocalhost = typeof window !== "undefined"
  && ["localhost", "127.0.0.1"].includes(window.location.hostname);
const fallbackBaseURL = isLocalhost ? "http://localhost:5026/api" : "/api";
const baseURL = process.env.REACT_APP_API_URL || fallbackBaseURL;

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("token");
    }

    return Promise.reject(error);
  }
);

export default api;
