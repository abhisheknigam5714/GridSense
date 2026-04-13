import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      localStorage.removeItem("pincode");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
};

export const outageAPI = {
  report: (outageData) => api.post("/outages/report", outageData),
  getActive: (pincode) =>
    api.get("/outages/active", { params: pincode ? { pincode } : {} }),
  getAll: () => api.get("/outages/all"),
  resolve: (id) => api.put(`/outages/resolve/${id}`),
  confirm: (id) => api.put(`/outages/confirm/${id}`),
  predict: (pincode) => api.get("/outages/predict", { params: { pincode } }),
  getStats: () => api.get("/outages/stats"),
};

export const adminAPI = {
  sendMaintenanceAlert: (alertData) => api.post("/admin/alert", alertData),
};

export default api;
