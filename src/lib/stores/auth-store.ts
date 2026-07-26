"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useUserStore } from "@/lib/stores/user-store";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  tenantCode: string | null;
  isAuthenticated: boolean;
  activeTenantId: string | null;
  expiresIn: number | null;
  roleInTenant: string | null;
  sessionId: string | null;
  setAuth: (tokens: {
    accessToken: string;
    refreshToken: string;
    activeTenantId: string;
    expiresIn: number;
    roleInTenant: string;
    sessionId: string;
  }) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setTenantCode: (code: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      tenantCode: process.env.NEXT_PUBLIC_TENANT_CODE ?? null,
      isAuthenticated: false,
      activeTenantId: null,
      expiresIn: null,
      roleInTenant: null,
      sessionId: null,

      setAuth: ({ accessToken, refreshToken, activeTenantId, expiresIn, roleInTenant, sessionId }) =>
        set({
          accessToken,
          refreshToken,
          isAuthenticated: true,
          activeTenantId,
          expiresIn,
          roleInTenant,
          sessionId,
        }),

      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),

      setTenantCode: (code) => set({ tenantCode: code }),

      logout: () => {
        useUserStore.getState().clearUser();
        set({
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          activeTenantId: null,
          expiresIn: null,
          roleInTenant: null,
          sessionId: null,
        });
      },
    }),
    {
      name: "realhub-auth",
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        activeTenantId: state.activeTenantId,
        expiresIn: state.expiresIn,
        roleInTenant: state.roleInTenant,
        sessionId: state.sessionId,
      }),
    }
  )
);
