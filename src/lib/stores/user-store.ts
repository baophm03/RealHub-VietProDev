"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/lib/types";
import { ability, type Actions } from "@/config/casl/ability";

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

// helper
const updateCaslAbility = (user: User | null) => {
  const roleCode = user?.role?.code;
  // SUPER_ADMIN / AGENCY_ADMIN bypass — full access to all modules
  if (roleCode === "SUPER_ADMIN" || roleCode === "AGENCY_ADMIN") {
    ability.update([{ action: "manage", subject: "all" } as any]);
    return;
  }
  const rules =
    user?.role?.permissions.map((p) => ({
      action: p.action as Actions,
      subject: p.module,
    })) ?? [];

  ability.update(rules);
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => {
        set({ user });
        updateCaslAbility(user);
      },

      clearUser: () => {
        set({ user: null });
        ability.update([]);
      },
    }),
    {
      name: "realhub-user",
      partialize: (state) => ({
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.user) {
          updateCaslAbility(state.user);
        }
      },
    }
  )
);
