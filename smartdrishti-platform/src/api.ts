import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

if (import.meta.env.DEV) {
  console.log("API_BASE_URL:", API_BASE);
}

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: { "Content-Type": "application/json" }
});

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

export const authAPI = {
  async login(data: { email: string; password: string }) {
    const res = await api.post("/auth/login", data);
    return res.data;
  },

  async signup(data: { email: string; password: string; name: string }) {
    const res = await api.post("/auth/register", data);
    return res.data;
  }
};

export default api;
