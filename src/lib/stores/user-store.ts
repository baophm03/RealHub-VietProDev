"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/lib/types";

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  hasPermission: (permission: string) => boolean;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,

      setUser: (user) => set({ user }),

      clearUser: () => set({ user: null }),

      hasPermission: (permission) => {
        const user = get().user;
        if (!user) return false;
        if (user.role !== "SUPER_ADMIN") return true;
        return user.permissions.some((p) => p === permission || p === "*");
      },
    }),
    {
      name: "realhub-user",
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);
