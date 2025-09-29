// Centralized Axios instance with auth and refresh handling
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { getAccessToken, setAccessToken, clearAccessToken } from "../auth/token";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log("API URL ",API_BASE_URL)
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, 
});

// Attach access token on every request
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    (config.headers = config.headers || {})["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Refresh handling
let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
 
  const resp = await api.post("/auth/refresh");
  const newToken = resp.data?.access_token as string;
  if (!newToken) throw new Error("No access token returned from refresh");
  setAccessToken(newToken); // keep prior persistence mode
  return newToken;
}

function queueRefresh(): Promise<string> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshPromise = refreshAccessToken()
      .catch((e) => {
        clearAccessToken();
        throw e;
      })
      .finally(() => {
        isRefreshing = false;
        refreshPromise = null;
      });
  }
  // non-null assertion because once started we set refreshPromise
  return refreshPromise!;
}

api.interceptors.response.use(
  (r) => r,
  async (error: AxiosError) => {
    const original = error.config as AxiosRequestConfig & { _retry?: boolean };
    const status = error.response?.status;
    const url = (original?.url || "").toString();

    // Never try to refresh for login/refresh calls themselves
    if (url.includes("/auth/login") || url.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    if (status === 401 && !original._retry) {
      try {
        original._retry = true;
        const newToken = await queueRefresh();
        (original.headers = original.headers || {})["Authorization"] = `Bearer ${newToken}`;
        return api.request(original);
      } catch (e) {
        // bubble the 401 after clearing tokens
        return Promise.reject(e);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
