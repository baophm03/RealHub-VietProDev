"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/lib/types";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  tenantCode: string | null;
  isAuthenticated: boolean;
  setAuth: (tokens: {
    accessToken: string;
    refreshToken: string;
    user: User;
  }) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setTenantCode: (code: string) => void;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      tenantCode: process.env.NEXT_PUBLIC_TENANT_CODE ?? null,
      isAuthenticated: false,

      setAuth: ({ accessToken, refreshToken, user }) =>
        set({
          accessToken,
          refreshToken,
          user,
          isAuthenticated: true,
        }),

      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),

      setTenantCode: (code) => set({ tenantCode: code }),

      logout: () =>
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
        }),

      hasPermission: (permission) => {
        const user = get().user;
        if (!user) return false;
        if (user.role === "SUPER_ADMIN") return true;
        return user.permissions.some(
          (p) => p === permission || p === "*"
        );
      },
    }),
    {
      name: "realhub-auth",
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        tenantCode: state.tenantCode,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
