"use client";

import { useState, useEffect, useRef } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import {
  List,
  X,
  ArrowUpRight,
  MagnifyingGlass,
  CaretDown,
  Phone,
  House,
  Building,
  Warehouse,
  MapTrifold,
  Storefront,
  Globe,
  SignOut,
  UserCircle,
  User,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils/cn";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useUserStore } from "@/lib/stores/user-store";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const propertyCategories = [
  { icon: House, label: "Căn hộ", desc: "Chung cư, studio, penthouse", href: "/listings?type=apartment" },
  { icon: Building, label: "Biệt thự", desc: "Biệt thự đơn lập, song lập", href: "/listings?type=villa" },
  { icon: Warehouse, label: "Nhà phố", desc: "Nhà phố, nhà mặt tiền", href: "/listings?type=townhouse" },
  { icon: MapTrifold, label: "Đất nền", desc: "Đất thổ cư, đất dự án", href: "/listings?type=land" },
  { icon: Storefront, label: "Mặt bằng", desc: "Văn phòng, shop, kho xưởng", href: "/listings?type=commercial" },
];

export function PublicHeader() {
  const t = useTranslations("public");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [localeOpen, setLocaleOpen] = useState(false);
  const [mobileMegaOpen, setMobileMegaOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const megaRef = useRef<HTMLDivElement>(null);
  const localeRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useUserStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const initials = user?.fullName
    ?.split(" ")
    .slice(-2)
    .map((n) => n[0])
    .join("")
    .toUpperCase() ?? "U";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMegaOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) setMegaOpen(false);
      if (localeRef.current && !localeRef.current.contains(e.target as Node)) setLocaleOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const isActive = (href: string) => {
    if (href === "/projects") return pathname.startsWith("/projects");
    if (href === "/news") return pathname.startsWith("/news");
    return pathname === href;
  };
  const isListingsActive = pathname.startsWith("/listings");

  return (
    <header className="fixed inset-x-0 top-0 z-30">
      {/* Top Strip — hotline + tagline + locale */}
      <div
        className={cn(
          "hidden overflow-hidden bg-primary transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] lg:block",
          scrolled ? "max-h-0 py-0 opacity-0 border-transparent" : "max-h-12 opacity-100 border-b border-primary-foreground/10"
        )}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-8 py-2 lg:px-12">
          <div className="flex items-center gap-6 text-xs text-primary-foreground/60">
            <span className="flex items-center gap-1.5">
              <Phone size={12} weight="fill" />
              <span className="font-mono tabular-nums">1900 1234</span>
            </span>
            <span className="h-3 w-px bg-primary-foreground/15" />
            <span className="max-w-[60ch] truncate">{t("tagline")}</span>
          </div>

          {/* Locale Switcher */}
          <div ref={localeRef} className="relative">
            <button
              onClick={() => setLocaleOpen(!localeOpen)}
              className="flex items-center gap-1.5 text-xs font-medium text-primary-foreground/60 transition-colors hover:text-primary-foreground"
            >
              <Globe size={12} />
              <span>VI</span>
              <CaretDown size={10} className={cn("transition-transform duration-300", localeOpen && "rotate-180")} />
            </button>
            {localeOpen && (
              <div className="absolute right-0 top-full mt-2 w-32 overflow-hidden rounded-lg border border-border bg-surface py-1 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.12)]">
                {[
                  { code: "vi", label: "Tiếng Việt" },
                  { code: "en", label: "English" },
                ].map((locale) => (
                  <button
                    key={locale.code}
                    className="flex w-full items-center px-3 py-2 text-left text-sm text-foreground-muted transition-colors hover:bg-surface-muted hover:text-foreground"
                  >
                    {locale.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

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
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary-foreground/15 text-primary-foreground transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="shrink-0">
                <path d="M2 14.5L9 3.5L16 14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5.5 14.5V10H12.5V14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8 14.5V12H10V14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
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

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            {/* Mega Menu Trigger */}
            <div ref={megaRef} className="relative">
              <button
                onClick={() => setMegaOpen(!megaOpen)}
                className={cn(
                  "group relative flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-300",
                  isListingsActive
                    ? "text-primary-foreground"
                    : "text-primary-foreground/70 hover:text-primary-foreground"
                )}
              >
                {t("browseProperties")}
                <CaretDown
                  size={12}
                  className={cn("transition-transform duration-300", megaOpen && "rotate-180")}
                />
                <span
                  className={cn(
                    "absolute bottom-0.5 left-1/2 h-px -translate-x-1/2 bg-primary-foreground transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                    isListingsActive ? "w-5" : "w-0 group-hover:w-5"
                  )}
                />
              </button>

              {/* Mega Menu Dropdown */}
              {megaOpen && (
                <div className="absolute left-1/2 top-full mt-2 w-[480px] -translate-x-1/2 overflow-hidden rounded-lg border border-border bg-surface shadow-[0_16px_48px_-12px_rgba(0,0,0,0.12)]">
                  <div className="border-b border-border px-5 py-3">
                    <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-foreground-muted">
                      Khám phá theo loại
                    </span>
                  </div>
                  <div className="grid grid-cols-1">
                    {propertyCategories.map((cat) => (
                      <Link
                        key={cat.label}
                        href={cat.href}
                        onClick={() => setMegaOpen(false)}
                        className="group flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-surface-muted"
                      >
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary transition-transform duration-300 group-hover:scale-110">
                          <cat.icon size={20} weight="duotone" />
                        </span>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-medium text-foreground">{cat.label}</span>
                          <span className="text-xs text-foreground-muted">{cat.desc}</span>
                        </div>
                        <ArrowUpRight
                          size={14}
                          className="ml-auto text-foreground-muted/50 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"
                        />
                      </Link>
                    ))}
                  </div>
                  <div className="border-t border-border bg-surface-muted px-5 py-3">
                    <Link
                      href="/listings"
                      onClick={() => setMegaOpen(false)}
                      className="flex items-center justify-between text-sm font-medium text-primary transition-colors hover:text-primary/80"
                    >
                      Xem tất cả bất động sản
                      <ArrowUpRight size={14} weight="bold" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Regular Nav Links */}
            {[
              { label: "Dự án", href: "/projects" },
              { label: "Tin tức", href: "/news" },
              { label: t("about"), href: "/about" },
              { label: t("contact"), href: "/contact" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "group relative rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-300",
                  isActive(link.href)
                    ? "text-primary-foreground"
                    : "text-primary-foreground/70 hover:text-primary-foreground"
                )}
              >
                {link.label}
                <span
                  className={cn(
                    "absolute bottom-0.5 left-1/2 h-px -translate-x-1/2 bg-primary-foreground transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                    isActive(link.href) ? "w-5" : "w-0 group-hover:w-5"
                  )}
                />
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Search Trigger */}
            <div ref={searchRef} className="relative hidden md:block">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="flex size-9 items-center justify-center rounded-lg text-primary-foreground/70 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground"
                aria-label="Search"
              >
                <MagnifyingGlass size={18} />
              </button>
              {searchOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 overflow-hidden rounded-lg border border-border bg-surface shadow-[0_16px_48px_-12px_rgba(0,0,0,0.12)]">
                  <div className="flex items-center gap-3 border-b border-border px-4 py-3">
                    <MagnifyingGlass size={18} className="text-foreground-muted" />
                    <input
                      autoFocus
                      type="text"
                      placeholder="Tìm kiếm bất động sản..."
                      className="flex-1 bg-transparent text-sm text-foreground placeholder:text-foreground-muted/50 focus:outline-none"
                    />
                    <kbd className="rounded border border-border bg-surface-muted px-1.5 py-0.5 font-mono text-[10px] text-foreground-muted">
                      ESC
                    </kbd>
                  </div>
                  <div className="px-4 py-3">
                    <span className="mb-2 block text-[10px] font-medium uppercase tracking-[0.2em] text-foreground-muted">
                      Tìm kiếm phổ biến
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {["Căn hộ Quận 1", "Biệt thự Thủ Đức", "Đất nền Bình Dương", "Nhà phố Tân Bình"].map((term) => (
                        <button
                          key={term}
                          className="rounded-lg bg-surface-muted px-2.5 py-1.5 text-xs text-foreground-muted transition-colors hover:bg-border/40 hover:text-foreground"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Divider */}
            <span className="hidden h-6 w-px bg-primary-foreground/15 md:block" />

            {/* Auth: Signed in → Avatar dropdown | Signed out → Sign in/up */}
            {mounted && isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-primary-foreground/10 transition-all duration-300">
                  <Avatar className="size-8 rounded-lg overflow-hidden">
                    <AvatarFallback className="flex size-8 items-center justify-center rounded-lg bg-primary-foreground/15 text-xs font-medium text-primary-foreground">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden text-sm font-medium text-primary-foreground/90 md:block">
                    {user?.fullName?.split(" ").slice(-1)[0] ?? "User"}
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
                  <DropdownMenuItem
                    onClick={() => router.push("/dashboard/profile")}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-foreground-muted hover:bg-surface-muted cursor-pointer outline-none transition-colors"
                  >
                    <User size={16} />
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
            ) : (
              <>
                {/* Sign In */}
                <Link
                  href="/login"
                  className="hidden rounded-lg px-4 py-2 text-sm font-medium text-primary-foreground/70 transition-colors hover:text-primary-foreground md:block"
                >
                  {t("signIn")}
                </Link>

                {/* Sign Up — Button-in-button pattern */}
                <Link
                  href="/register"
                  className="group hidden items-center gap-2.5 rounded-lg bg-primary-foreground px-5 py-2.5 text-sm font-medium text-primary transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.2)] hover:-translate-y-[1px] active:scale-[0.97] md:inline-flex"
                >
                  <span>{t("signUp")}</span>
                  <span className="flex size-5 items-center justify-center rounded-full bg-primary/15 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-px">
                    <ArrowUpRight size={12} weight="bold" />
                  </span>
                </Link>
              </>
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

      {/* Mobile Menu */}
      <div
        className={cn(
          "overflow-hidden bg-primary/95 backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] lg:hidden",
          mobileOpen ? "max-h-[600px] border-t border-primary-foreground/10 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <nav className="flex flex-col gap-1 px-6 py-4">
          {/* Mobile Search */}
          <div className="mb-3 flex items-center gap-3 rounded-lg bg-primary-foreground/10 px-4 py-3">
            <MagnifyingGlass size={18} className="text-primary-foreground/50" />
            <input
              type="text"
              placeholder="Tìm kiếm bất động sản..."
              className="flex-1 bg-transparent text-sm text-primary-foreground placeholder:text-primary-foreground/40 focus:outline-none"
            />
          </div>

          {/* Mobile Mega Menu — Accordion */}
          <div className="flex flex-col">
            <button
              onClick={() => setMobileMegaOpen(!mobileMegaOpen)}
              className="flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium text-primary-foreground/70 transition-colors hover:bg-primary-foreground/10"
            >
              {t("browseProperties")}
              <CaretDown size={14} className={cn("transition-transform duration-300", mobileMegaOpen && "rotate-180")} />
            </button>
            {mobileMegaOpen && (
              <div className="flex flex-col gap-0.5 pb-2 pl-4">
                {propertyCategories.map((cat) => (
                  <Link
                    key={cat.label}
                    href={cat.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-primary-foreground/60 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground"
                  >
                    <cat.icon size={16} weight="duotone" />
                    {cat.label}
                  </Link>
                ))}
                <Link
                  href="/listings"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-primary-foreground"
                >
                  Xem tất cả
                  <ArrowUpRight size={12} weight="bold" />
                </Link>
              </div>
            )}
          </div>

          {[
            { label: "Dự án", href: "/projects" },
            { label: "Tin tức", href: "/news" },
            { label: t("about"), href: "/about" },
            { label: t("contact"), href: "/contact" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
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
                  <Avatar className="size-9 rounded-lg overflow-hidden">
                    <AvatarFallback className="flex size-9 items-center justify-center rounded-lg bg-primary-foreground/15 text-xs font-medium text-primary-foreground">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-primary-foreground">{user?.fullName ?? "User"}</span>
                    <span className="text-xs text-primary-foreground/50">{user?.email}</span>
                  </div>
                </div>
                <button
                  onClick={() => { logout(); router.push("/login"); setMobileOpen(false); }}
                  className="flex items-center justify-center gap-2 rounded-lg border border-primary-foreground/20 px-4 py-3 text-sm font-medium text-primary-foreground/80 transition-colors hover:bg-primary-foreground/10"
                >
                  <SignOut size={16} />
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg border border-primary-foreground/20 px-4 py-3 text-center text-sm font-medium text-primary-foreground/80 transition-colors hover:bg-primary-foreground/10"
                >
                  {t("signIn")}
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-lg bg-primary-foreground px-4 py-3 text-sm font-medium text-primary transition-colors"
                >
                  {t("signUp")}
                  <ArrowUpRight size={14} weight="bold" />
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
