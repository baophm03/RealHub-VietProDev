import axios, { AxiosError, AxiosRequestConfig } from "axios";
import config from "@/config";

// API client (axios instance)
const apiClient = axios.create({
  baseURL: config.apiEndpoint,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// CSRF token management
let csrfToken: string | null = null;

const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
};

apiClient.interceptors.request.use((reqConfig) => {
  const token = csrfToken || getCookie("csrf-token");

  if (token) {
    reqConfig.headers.set("x-csrf-token", token);
  }

  reqConfig.headers.set("x-tenant-code", process.env.NEXT_PUBLIC_TENANT_CODE ?? "DEMO");

  return reqConfig;
});

apiClient.interceptors.response.use(
  (response) => {
    const token = response.headers?.["x-csrf-token"];
    if (token) {
      csrfToken = token;
    }
    return response;
  },
  (error: AxiosError) => {
    const statusCode = error.response?.status;
    if (typeof window !== "undefined") {
      if (statusCode === 401) {
        localStorage.removeItem("realhub-auth");
        localStorage.removeItem("realhub-user");
        window.location.href = "/vi/login";
      }

      if (statusCode === 403) {
        localStorage.removeItem("realhub-auth");
        localStorage.removeItem("realhub-user");
      }
    }

    return Promise.reject(error);
  },
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function customInstance<T = any>(config: AxiosRequestConfig): Promise<T> {
  const response = await apiClient(config);
  return response.data;
}