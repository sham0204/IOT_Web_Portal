import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: { "Content-Type": "application/json" }
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  login: (data:any) => api.post("/auth/login", data),
  register: (data:any) => api.post("/auth/register", data)
};

export const projectAPI = {
  getAll: () => api.get("/projects"),
  getById: (id:string) => api.get(`/projects/${id}`),
  create: (data:any) => api.post("/projects", data),
  update: (id:string,data:any)=>api.put(`/projects/${id}`,data),
  delete: (id:string)=>api.delete(`/projects/${id}`)
};

export const iotAPI = {
  getDevices: () => api.get("/iot/devices"),
  getDeviceData: (id:string)=>api.get(`/iot/devices/${id}`),
  sendCommand:(id:string,data:any)=>api.post(`/iot/devices/${id}/command`,data)
};

export const stepAPI = {
  getAll: () => api.get("/steps"),
  getById: (id:string) => api.get(`/steps/${id}`),
  create: (data:any) => api.post("/steps", data),
  update: (id:string,data:any)=>api.put(`/steps/${id}`,data),
  delete: (id:string)=>api.delete(`/steps/${id}`)
};

export default api;
