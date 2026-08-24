"use client";

import { useState, useEffect } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { Building2, List, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useUserStore } from "@/lib/stores/user-store";
import { HeaderTopStrip } from "./components/header-top-strip";
import { HeaderDesktopNav, useNavLinks } from "./components/header-desktop-nav";
import { HeaderSearch } from "./components/header-search";
import { HeaderAuthDropdown, HeaderGuestActions } from "./components/header-auth-dropdown";
import { HeaderMobileMenu } from "./components/header-mobile-menu";
import { Spinner } from "@/components/ui/spinner";

export function PublicHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  const navLinks = useNavLinks();

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasHydrated = useAuthStore((s) => s._hasHydrated);
  const user = useUserStore((s) => s.user);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
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
    <header className="fixed inset-x-0 top-0 z-30">
      <HeaderTopStrip scrolled={scrolled} />

      {/* Main Bar */}
      <div
        className={cn(
          "transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
          scrolled
            ? "bg-primary/95 backdrop-blur-xl shadow-[0_4px_24px_-4px_rgba(0,0,0,0.15)]"
            : "bg-primary"
        )}
      >
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6 md:h-18 md:px-8 lg:px-12">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-lg bg-white text-primary-foreground transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105">
              <Building2 size={22} className="text-primary" />
            </span>
            <div className="flex flex-col leading-none">
              <span className="font-serif text-lg font-semibold tracking-tight text-primary-foreground">
                RealHub
              </span>
              <span className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.2em] text-primary-foreground/40">
                Real Estate Platform
              </span>
            </div>
          </Link>

          <HeaderDesktopNav isActive={isActive} isListingsActive={isListingsActive} />

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <HeaderSearch />

            <span className="hidden h-6 w-px bg-primary-foreground/15 md:block" />
            {hasHydrated ? (
              <>
                {mounted && isAuthenticated ? (
                  <HeaderAuthDropdown initials={initials} />
                ) : (
                  <HeaderGuestActions />
                )}
              </>
            ) : (
              <Spinner />
            )}

            {/* Mobile Toggle */}
            <button
              className="flex size-10 items-center justify-center rounded-lg text-primary-foreground transition-colors hover:bg-primary-foreground/10 lg:hidden"
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
