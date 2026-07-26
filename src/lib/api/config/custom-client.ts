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
});

apiClient.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;
  const tenantCode = useAuthStore.getState().tenantCode;

  if (accessToken) {
    config.headers.set("Authorization", `Bearer ${accessToken}`);
  }

  if (tenantCode) {
    config.headers.set("x-tenant-code", tenantCode);
  } else {
    config.headers.set("x-tenant-code", "DEMO");
  }
  return config;
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
