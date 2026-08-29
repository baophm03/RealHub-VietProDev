"use client";

import { useState, useEffect } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { Building2, List, X } from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useUserStore } from "@/lib/stores/user-store";
import { HeaderDesktopNav, useNavLinks } from "./components/header-desktop-nav";
import { HeaderMobileMenu } from "./components/header-mobile-menu";
import { HeaderAuthDropdown } from "./components/header-auth-dropdown";

export function PublicHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  const navLinks = useNavLinks();

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useUserStore((s) => s.user);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/projects") return pathname.startsWith("/projects");
    if (href === "/news") return pathname.startsWith("/news");
    return pathname === href;
  };
  const isListingsActive = pathname.startsWith("/listings");

  const initials =
    user?.fullName
      ?.split(" ")
      .slice(-2)
      .map((n) => n[0])
      .join("")
      .toUpperCase() ?? "U";

  return (
    <header className="fixed inset-x-0 top-0 z-30 [--primary-foreground:#ffffff]">
      <div
        className="bg-[#092909]"
      >
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6 md:h-18 md:px-8 lg:px-12">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-lg bg-white text-primary-foreground transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105">
              <Building2 size={22} className="text-primary" />
            </span>
            <div className="flex flex-col leading-none">
              <span className="font-serif text-lg font-semibold tracking-tight text-white">
                RealHub
              </span>
              <span className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.2em] text-white/60">
                Real Estate Platform
              </span>
            </div>
          </Link>

          <HeaderDesktopNav isActive={isActive} isListingsActive={isListingsActive} />

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {mounted && isAuthenticated ? (
              <HeaderAuthDropdown initials={initials} />
            ) : (
              <Link
                href="/login"
                className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#092909] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white/90"
              >
                Tham gia ngay
              </Link>
            )}

            {/* Mobile Toggle */}
            <button
              className="flex size-10 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10 lg:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <List size={20} />}
            </button>
          </div>
        </div>
      </div>

      <HeaderMobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        isActive={isActive}
        navLinks={navLinks}
        initials={initials}
        isAuthenticated={isAuthenticated}
        mounted={mounted}
      />
    </header>
  );
}
