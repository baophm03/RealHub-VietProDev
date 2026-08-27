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

const updateCaslAbility = (user: User | null) => {
  const rules =
    (user?.roles ?? []).flatMap((r) =>
      (r.permissions ?? []).map((p) => ({
        action: p.action as Actions,
        subject: p.module,
      })),
    ) ?? [];

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
