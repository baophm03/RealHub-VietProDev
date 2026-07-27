// Core
import axios, { AxiosInstance } from "axios";
import { QueryClient } from "@tanstack/react-query";
import config from "@/config";
import { useAuthStore } from "@/lib/stores/auth-store";

// API client (axios instance)
export const apiClient: AxiosInstance = axios.create({
  baseURL: `${config.apiEndpoint}`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

let csrfToken: string | null = null;

apiClient.interceptors.request.use((config) => {
  const tenantCode = useAuthStore.getState().tenantCode;

  if (tenantCode) {
    config.headers.set("x-tenant-code", tenantCode);
  } else {
    config.headers.set("x-tenant-code", "DEMO");
  }

  const token = csrfToken || getCookie("csrf-token");
  if (token) {
    config.headers.set("x-csrf-token", token);
  }

  return config;
});

apiClient.interceptors.response.use((response) => {
  const token = response.headers?.["x-csrf-token"];
  if (token) {
    csrfToken = token;
  }
  return response;
});

// Query client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      placeholderData: (previousData: unknown) => previousData,
    },
  },
});

export default queryClient;
