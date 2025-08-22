import axios from "axios";
import { store } from "../app/store";

// Use env base URL in production, fall back to /api for dev with Vite proxy
const baseURL = (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL) || "/api";
export const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const url = (config?.url || "").toString();
  // Do not attach Authorization for auth endpoints
  if (url.startsWith("/auth") || url.startsWith("auth") || url.includes("/auth/")) {
    return config;
  }
  const state = store.getState().auth ?? {};
  const token = state.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  }
  // Fallback: Basic auth string if present in state (email:password base64)
  if (state.basic) {
    config.headers.Authorization = `Basic ${state.basic}`;
  }
  return config;
});
