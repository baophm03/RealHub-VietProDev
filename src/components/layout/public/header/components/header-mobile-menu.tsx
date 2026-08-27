"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { ArrowUpRight, ChevronDown, LogOut, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useUserStore } from "@/lib/stores/user-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { propertyCategories } from "@/config/property-categories";
import { getPortalEntry } from "@/config/portal-entry";
import type { NavLink } from "./header-desktop-nav";

export interface HeaderMobileMenuProps {
  open: boolean;
  onClose: () => void;
  isActive: (href: string) => boolean;
  navLinks: NavLink[];
  initials: string;
  isAuthenticated: boolean | null;
  mounted: boolean;
}

export function HeaderMobileMenu({
  open,
  onClose,
  isActive,
  navLinks,
  initials,
  isAuthenticated,
  mounted,
}: HeaderMobileMenuProps) {
  const t = useTranslations("public");
  const [megaOpen, setMegaOpen] = useState(false);
  const user = useUserStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  const codes = user?.roles?.map((r) => r.code) ?? [];
  const portalEntry = getPortalEntry(codes);

  return (
    <div
      className={cn(
        "overflow-hidden bg-primary/95 backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] lg:hidden",
        open
          ? "max-h-[600px] border-t border-primary-foreground/10 opacity-100"
          : "max-h-0 opacity-0"
      )}
    >
      <nav className="flex flex-col gap-1 px-6 py-4">
        {/* Mobile Search */}
        <div className="mb-3 flex items-center gap-3 rounded-lg bg-primary-foreground/10 px-4 py-3">
          <Search size={18} className="text-primary-foreground/50" />
          <input
            type="text"
            placeholder="Tìm kiếm bất động sản..."
            className="flex-1 bg-transparent text-sm text-primary-foreground placeholder:text-primary-foreground/40 focus:outline-none"
          />
        </div>

        {/* Mobile Mega Menu — Accordion */}
        <div className="flex flex-col">
          <button
            onClick={() => setMegaOpen(!megaOpen)}
            className="flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium text-primary-foreground/70 transition-colors hover:bg-primary-foreground/10"
          >
            {t("browseProperties")}
            <ChevronDown
              size={14}
              className={cn("transition-transform duration-300", megaOpen && "rotate-180")}
            />
          </button>
          {megaOpen && (
            <div className="flex flex-col gap-0.5 pb-2 pl-4">
              {propertyCategories.map((cat) => (
                <Link
                  key={cat.label}
                  href={cat.href}
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-primary-foreground/60 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground"
                >
                  <cat.icon size={16} />
                  {cat.label}
                </Link>
              ))}
              <Link
                href="/listings"
                onClick={onClose}
                className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-primary-foreground"
              >
                Xem tất cả
                <ArrowUpRight size={12} />
              </Link>
            </div>
          )}
        </div>

        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className={cn(
              "rounded-lg px-4 py-3 text-sm font-medium transition-colors",
              isActive(link.href)
                ? "bg-primary-foreground/15 text-primary-foreground"
                : "text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground"
            )}
          >
            {link.label}
          </Link>
        ))}

        <div className="mt-3 flex flex-col gap-2 border-t border-primary-foreground/10 pt-4">
          {mounted && isAuthenticated ? (
            <>
              <div className="flex items-center gap-3 rounded-lg bg-primary-foreground/10 px-4 py-3">
                <Avatar className="size-9 rounded-full overflow-hidden">
                  {user?.avatarUrl && (
                    <AvatarImage src={user.avatarUrl} alt={user?.fullName ?? "User"} />
                  )}
                  <AvatarFallback className="flex size-9 items-center justify-center rounded-full bg-primary-foreground/15 text-xs font-medium text-primary-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-primary-foreground">
                    {user?.fullName ?? "User"}
                  </span>
                  <span className="text-xs text-primary-foreground/50">{user?.email}</span>
                </div>
              </div>

              {portalEntry && (
                <button
                  onClick={() => {
                    router.push(`/${portalEntry.slug}`);
                    onClose();
                  }}
                  className="flex items-center justify-center gap-2 rounded-lg bg-primary-foreground px-4 py-3 text-sm font-medium text-primary transition-colors"
                >
                  <portalEntry.icon size={16} />
                  {portalEntry.label}
                </button>
              )}

              <button
                onClick={() => {
                  logout();
                  router.push("/login");
                  onClose();
                }}
                className="flex items-center justify-center gap-2 rounded-lg border border-primary-foreground/20 px-4 py-3 text-sm font-medium text-primary-foreground/80 transition-colors hover:bg-primary-foreground/10"
              >
                <LogOut size={16} />
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={onClose}
                className="rounded-lg border border-primary-foreground/20 px-4 py-3 text-center text-sm font-medium text-primary-foreground/80 transition-colors hover:bg-primary-foreground/10"
              >
                {t("signIn")}
              </Link>
              <Link
                href="/register"
                onClick={onClose}
                className="flex items-center justify-center gap-2 rounded-lg bg-primary-foreground px-4 py-3 text-sm font-medium text-primary transition-colors"
              >
                {t("signUp")}
                <ArrowUpRight size={14} />
              </Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}
