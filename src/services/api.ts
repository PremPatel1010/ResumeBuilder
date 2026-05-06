import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";

const baseURL =
  (typeof import.meta !== "undefined" && (import.meta.env?.VITE_API_URL as string | undefined)) ||
  "http://localhost:5000/api";

const api: AxiosInstance = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  timeout: 20000,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("arb_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (typeof window !== "undefined" && error?.response?.status === 401) {
      localStorage.removeItem("arb_token");
      localStorage.removeItem("arb_user");
    }
    return Promise.reject(error);
  }
);

export default api;
