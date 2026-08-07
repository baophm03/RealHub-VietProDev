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
  _hasHydrated: boolean
  setHasHydrated: (val: boolean) => void
  setAuth: (data: {
    activeTenantId: string;
    expiresIn: number;
    roleInTenant: string;
    sessionId: string;
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
      _hasHydrated: false,

      setHasHydrated: (val: boolean) => set({ _hasHydrated: val }),
      setAuth: ({ activeTenantId, expiresIn, roleInTenant, sessionId }) =>
        set({
          isAuthenticated: true,
          activeTenantId,
          expiresIn,
          roleInTenant,
          sessionId,
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
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      }
    }
  )
);
