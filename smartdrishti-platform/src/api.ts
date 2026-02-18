import axios from "axios";

// Centralized API config for production and development
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Debug log in development
if (import.meta.env.DEV) {
  console.log("API_BASE_URL:", API_BASE);
}

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: { "Content-Type": "application/json" }
});

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API functions with proper error handling
export async function login(data: { email: string; password: string }) {
  try {
    const res = await api.post("/auth/login", data);
    return res.data;
  } catch (err: any) {
    console.error("AUTH ERROR:", err.response?.data || err.message);
    throw new Error(err.response?.data?.message || "Server connection failed");
  }
}

export async function signup(data: { email: string; password: string; name: string }) {
  try {
    const res = await api.post("/auth/register", data);
    return res.data;
  } catch (err: any) {
    console.error("AUTH ERROR:", err.response?.data || err.message);
    throw new Error(err.response?.data?.message || "Server connection failed");
  }
}

export default api;