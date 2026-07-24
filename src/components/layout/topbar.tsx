"use client";

import { useAuthStore } from "@/lib/stores/auth-store";
import { useUserStore } from "@/lib/stores/user-store";
import { useRouter } from "next/navigation";
import { List, Bell, Moon, Sun, SignOut, UserCircle } from "@phosphor-icons/react";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { useTheme } from "@/lib/hooks/use-theme";

export function TopBar({ onMenuClick }: { onMenuClick?: () => void }) {
  const user = useUserStore((s) => s.user);
  const tenantCode = useAuthStore((s) => s.tenantCode);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const initials = user?.fullName
    ?.split(" ")
    .slice(-2)
    .map((n) => n[0])
    .join("")
    .toUpperCase() ?? "U";

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-surface/70 px-4 backdrop-blur-xl md:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden rounded-lg p-2 text-foreground-muted hover:bg-surface-muted transition-colors duration-300"
          aria-label="Menu"
        >
          <List size={20} />
        </button>
        {tenantCode && (
          <span className="hidden md:inline-flex items-center rounded-lg border border-primary/20 bg-primary/8 px-3 py-1 text-[11px] font-medium tracking-wide text-primary">
            {tenantCode}
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={toggleTheme}
          className="rounded-lg p-2.5 text-foreground-muted hover:bg-surface-muted transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-foreground"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button
          className="relative rounded-lg p-2.5 text-foreground-muted hover:bg-surface-muted transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span className="absolute right-2 top-2 size-1.5 rounded-lg bg-primary" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-surface-muted transition-all duration-300"
          >
            <Avatar className="size-8 rounded-lg overflow-hidden">
              <AvatarFallback className="flex size-8 items-center justify-center rounded-lg bg-surface-muted text-xs font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="z-30 mt-2 min-w-[220px] rounded-2xl border border-border bg-surface p-1.5 shadow-[0_12px_40px_-12px_rgba(26,22,20,0.12)]"
          >
            <div className="px-3 py-2.5">
              <p className="text-sm font-medium">{user?.fullName ?? "User"}</p>
              <p className="text-xs text-foreground-muted">{user?.email}</p>
            </div>
            <DropdownMenuSeparator className="my-1 border-border" />
            <DropdownMenuItem
              onClick={() => router.push("/profile")}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-foreground-muted hover:bg-surface-muted cursor-pointer outline-none transition-colors"
            >
              <UserCircle size={16} />
              <span>Hồ sơ cá nhân</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => { logout(); router.push("/login"); }}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-accent-red-text hover:bg-accent-red/10 cursor-pointer outline-none transition-colors"
            >
              <SignOut size={16} />
              <span>Đăng xuất</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
