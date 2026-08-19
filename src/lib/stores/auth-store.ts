"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useUserStore } from "@/lib/stores/user-store";

interface AuthState {
  tenantCode: string | null;
  isAuthenticated: boolean;
  activeTenantId: string | null;
  expiresIn: number | null;
  roleInTenant: string | null;
  sessionId: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  _hasHydrated: boolean
  setHasHydrated: (val: boolean) => void
  setAuth: (data: {
    activeTenantId: string;
    expiresIn: number;
    roleInTenant: string;
    sessionId: string;
    accessToken: string;
    refreshToken: string;
  }) => void;
  setTenantCode: (code: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      tenantCode: process.env.NEXT_PUBLIC_TENANT_CODE ?? null,
      isAuthenticated: false,
      activeTenantId: null,
      expiresIn: null,
      roleInTenant: null,
      sessionId: null,
      accessToken: null,
      refreshToken: null,
      _hasHydrated: false,

      setHasHydrated: (val: boolean) => set({ _hasHydrated: val }),
      setAuth: ({ activeTenantId, expiresIn, roleInTenant, sessionId, accessToken, refreshToken }) =>
        set({
          isAuthenticated: true,
          activeTenantId,
          expiresIn,
          roleInTenant,
          sessionId,
          accessToken,
          refreshToken,
        }),

      setTenantCode: (code) => set({ tenantCode: code }),

      logout: () => {
        useUserStore.getState().clearUser();
        set({
          isAuthenticated: false,
          activeTenantId: null,
          expiresIn: null,
          roleInTenant: null,
          sessionId: null,
          accessToken: null,
          refreshToken: null,
        });
      },
    }),
    {
      name: "realhub-auth",
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        activeTenantId: state.activeTenantId,
        expiresIn: state.expiresIn,
        roleInTenant: state.roleInTenant,
        sessionId: state.sessionId,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      }
    }
  )
);
