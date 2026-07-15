"use client";

import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/lib/stores/auth-store";
import type { ApiError } from "@/lib/types";

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

export const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const { accessToken, tenantCode } = useAuthStore.getState();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  if (tenantCode) {
    config.headers["x-tenant-code"] = tenantCode;
  }

  return config;
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (token: string | null, error: unknown) => {
  failedQueue.forEach((promise) => {
    if (token) promise.resolve(token);
    else promise.reject(error);
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/")
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(apiClient(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { refreshToken, setTokens } = useAuthStore.getState();
        if (!refreshToken) throw new Error("No refresh token");

        const { data } = await axios.post(`${baseURL}/auth/refresh`, {
          refreshToken,
        });

        setTokens(data.accessToken, data.refreshToken);
        processQueue(data.accessToken, null);

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(null, refreshError);
        useAuthStore.getState().logout();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
