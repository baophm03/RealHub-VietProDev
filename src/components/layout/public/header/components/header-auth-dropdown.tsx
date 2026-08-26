"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { ArrowUpRight, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useUserStore } from "@/lib/stores/user-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getPortalEntry } from "@/config/portal-entry";
import { usePostApiLogout } from "@/lib/api/endpoints/auth";

export interface HeaderAuthDropdownProps {
  initials: string;
}

export function HeaderAuthDropdown({ initials }: HeaderAuthDropdownProps) {
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const { mutate: logoutAsync } = usePostApiLogout();

  const handleLogout = async () => {
    await logoutAsync();
    await logout();
    await router.push("/");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-full p-0 hover:bg-transparent transition-all duration-300">
        <Avatar className="size-8 rounded-full overflow-hidden">
          {user?.avatarUrl && (
            <AvatarImage src={user.avatarUrl} alt={user?.fullName ?? "User"} />
          )}
          <AvatarFallback className="flex size-8 items-center justify-center rounded-full bg-primary-foreground/15 text-xs font-medium text-primary-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
        <span className="hidden text-sm font-medium text-primary-foreground/90 md:block">
          {user?.fullName ?? "User"}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="z-30 mt-2 min-w-[220px] rounded-2xl border border-border bg-surface p-1.5 shadow-[0_12px_40px_-12px_rgba(26,22,20,0.12)]"
      >
        <div className="px-3 py-2.5">
          <p className="text-sm font-medium text-foreground">{user?.fullName ?? "User"}</p>
          <p className="text-xs text-foreground-muted">{user?.email}</p>
        </div>
        <DropdownMenuSeparator className="my-1 border-border" />
        {(() => {
          const entry = getPortalEntry(user?.role?.code);
          if (!entry) return null;
          const Icon = entry.icon;
          return (
            <DropdownMenuItem
              onClick={() => router.push(`/${entry.slug}`)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-foreground-muted hover:bg-surface-muted cursor-pointer outline-none transition-colors"
            >
              <Icon size={16} />
              <span>{entry.label}</span>
            </DropdownMenuItem>
          );
        })()}
        <DropdownMenuItem
          onClick={handleLogout}
          className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-accent-red-text hover:bg-accent-red/10 cursor-pointer outline-none transition-colors"
        >
          <LogOut size={16} />
          <span>Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function HeaderGuestActions() {
  const t = useTranslations("public");
  return (
    <>
      <Link
        href="/login"
        className="hidden rounded-lg px-4 py-2 text-sm font-medium text-primary-foreground/70 transition-colors hover:text-primary-foreground md:block"
      >
        {t("signIn")}
      </Link>
      <Link
        href="/register"
        className="group hidden items-center gap-2.5 rounded-lg bg-primary-foreground px-5 py-2.5 text-sm font-medium text-primary transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.2)] hover:-translate-y-[1px] active:scale-[0.97] md:inline-flex"
      >
        <span>{t("signUp")}</span>
        <span className="flex size-5 items-center justify-center rounded-full bg-primary/15 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-px">
          <ArrowUpRight size={12} />
        </span>
      </Link>
    </>
  );
}
