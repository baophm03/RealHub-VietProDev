"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { formatPriceWithTransaction as formatPrice } from "@/utils";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  MapPin,
  MagnifyingGlass,
  House,
  Building,
  Warehouse,
  MapTrifold,
  Storefront,
  TrendUp,
  Users,
  Spinner,
} from "@phosphor-icons/react";
import { useGetApiProperties } from "@/lib/api/endpoints/properties";
import { GetPropertiesResponse, Property } from "@/lib/api/types/properties";
import { PropertyCardImage } from "@/components/shared/property-card-image";

function pickRandom<T>(items: T[]): T | undefined {
  if (items.length === 0) return undefined;
  return items[Math.floor(Math.random() * items.length)];
}

const searchTabs = [
  { label: "Mua", value: "sale" },
  { label: "Thuê", value: "rent" },
];

const propertyTypes = [
  { icon: House, label: "Căn hộ" },
  { icon: Building, label: "Biệt thự" },
  { icon: Warehouse, label: "Nhà phố" },
  { icon: MapTrifold, label: "Đất nền" },
  { icon: Storefront, label: "Mặt bằng" },
];

export function Hero() {
  const [activeTab, setActiveTab] = useState("sale");

  // Fetch the 5 most recent properties, then pick one at random to feature.
  const { data: propertiesData, isLoading } = useGetApiProperties({
    verificationStatus: "VERIFIED",
    publicationStatus: "PUBLIC",
    limit: "5",
  } as any);
  const properties = ((propertiesData as unknown as GetPropertiesResponse)?.data) || [];

  // Stable random pick — only re-roll when the underlying list changes.
  const featured: Property | undefined = useMemo(
    () => pickRandom(properties),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [properties.map((p) => p.id).join(",")],
  );

  const featuredLocation = featured
    ? [featured?.district?.name, featured?.province?.name].filter(Boolean).join(", ")
    : "";

  return (
    <section className="relative overflow-hidden bg-background -mt-20 lg:-mt-28">
      {/* Background image — real estate architecture */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://picsum.photos/seed/realhub-hero-architecture/1920/1080)",
        }}
      />
      {/* Warm neutral overlay — keeps image visible but readable */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/88 to-background/72" />
      {/* Subtle grain texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Soft radial accent — warm sage tint */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 70% 20%, rgba(45,95,63,0.04), transparent 60%)",
        }}
      />

      <div className="relative mx-auto flex min-h-[100dvh] max-w-[1400px] flex-col justify-center px-6 pt-32 pb-20 md:px-8 md:pt-36 md:pb-24 lg:px-12">
        {/* Headline section — editorial split */}
        <div className="grid items-center gap-12 lg:grid-cols-[1.35fr_1fr] lg:gap-20">
          {/* Left — editorial typography + search */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-8"
          >
            {/* Eyebrow pill — green accent */}
            <span className="w-fit rounded-full bg-primary/8 px-3.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-primary">
              Nền tảng Bất động sản
            </span>

            {/* Headline — mixed serif/sans, editorial */}
            <h1 className="font-serif text-5xl font-semibold leading-[1.05] tracking-tighter text-balance text-foreground md:text-6xl lg:text-[4.25rem]">
              Kết nối toàn vòng đời{" "}
              <span className="italic text-primary">bất động sản</span>
            </h1>

            <p className="max-w-[50ch] text-base leading-relaxed text-foreground-muted md:text-lg">
              Từ sản phẩm đến khách hàng, từ lịch hẹn đến giao dịch và hoa hồng —
              RealHub là hệ sinh thái cho Agency, Developer và Distributor.
            </p>

            {/* Search Bar — Double-Bezel on light surface */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="mt-2 max-w-[560px]"
            >
              {/* Tabs */}
              <div className="mb-3 flex gap-2">
                {searchTabs.map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value)}
                    className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${activeTab === tab.value
                      ? "bg-foreground text-background"
                      : "text-foreground-muted hover:text-foreground"
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Search input — Double-Bezel */}
              <div className="rounded-[1.5rem] bg-black/5 p-1.5 ring-1 ring-black/5">
                <div className="flex items-center gap-2 rounded-[calc(1.5rem-0.375rem)] bg-surface p-2 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)]">
                  <div className="flex flex-1 items-center gap-3 px-4">
                    <MapPin size={18} className="text-primary" />
                    <input
                      type="text"
                      placeholder="Nhập khu vực, dự án, hoặc địa chỉ..."
                      className="flex-1 bg-transparent py-2.5 text-sm text-foreground placeholder:text-foreground-muted/50 focus:outline-none"
                    />
                  </div>
                  <Button
                    size="sm"
                    rightIcon={
                      <span className="flex size-6 items-center justify-center rounded-full bg-primary/15">
                        <MagnifyingGlass size={12} weight="bold" />
                      </span>
                    }
                    render={<Link href="/listings" />}
                  >
                    Tìm kiếm
                  </Button>
                </div>
              </div>

              {/* Quick category chips */}
              <div className="mt-3 flex flex-wrap gap-2">
                {propertyTypes.map((type) => (
                  <Link
                    key={type.label}
                    href="/listings"
                    className="group flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-xs font-medium text-foreground-muted transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-border-strong hover:text-foreground"
                  >
                    <type.icon size={14} weight="duotone" />
                    {type.label}
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* CTA row — button-in-button */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mt-2 flex flex-wrap items-center gap-4"
            >
              <Button
                size="lg"
                rightIcon={
                  <span className="flex size-7 items-center justify-center rounded-full bg-white/10">
                    <ArrowRight size={14} weight="bold" />
                  </span>
                }
                render={<Link href="/register" />}
              >
                Đăng ký miễn phí
              </Button>
              <Link
                href="/listings"
                className="group flex items-center gap-2.5 text-sm font-medium text-foreground-muted transition-colors duration-300 hover:text-foreground"
              >
                Khám phá bất động sản
                <span className="flex size-7 items-center justify-center rounded-full bg-black/5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5">
                  <ArrowRight size={12} weight="bold" />
                </span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right — layered visual cards with Double-Bezel */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative hidden flex-col gap-4 lg:flex"
          >
            {/* Main featured property — Double-Bezel */}
            <div className="rounded-[1.5rem] bg-black/5 p-1.5 ring-1 ring-black/5">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[calc(1.5rem-0.375rem)]">
                {isLoading ? (
                  <div className="flex h-full items-center justify-center bg-surface">
                    <Spinner size={28} className="animate-spin text-primary" />
                  </div>
                ) : featured ? (
                  <Link href={`/listings/${featured.id}`} className="group/featured relative block h-full">
                    <div className="absolute inset-0 overflow-hidden transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/featured:scale-105">
                      <PropertyCardImage
                        propertyId={featured.id}
                        alt={featured.title}
                        className="h-full w-full object-cover"
                        iconSize={40}
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                    {/* Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary backdrop-blur-sm">
                        Nổi bật
                      </span>
                    </div>
                    {/* Content */}
                    <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-white/60">
                          {featuredLocation || "Đang cập nhật"}
                        </span>
                        <span className="font-serif text-xl font-semibold text-white">
                          {featured.title}
                        </span>
                      </div>
                      <span className="rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-foreground">
                        {formatPrice(featured.price, featured.transactionType)}
                      </span>
                    </div>
                  </Link>
                ) : (
                  <div className="flex h-full items-center justify-center bg-surface">
                    <span className="text-xs text-foreground-muted">Chưa có bất động sản</span>
                  </div>
                )}
              </div>
            </div>

            {/* Stats row — Double-Bezel mini cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-[1.25rem] bg-black/5 p-1.5 ring-1 ring-black/5">
                <div className="flex flex-col gap-1.5 rounded-[calc(1.25rem-0.375rem)] bg-surface p-4">
                  <TrendUp size={16} weight="duotone" className="text-primary" />
                  <span className="font-serif text-2xl font-semibold tabular-nums tracking-tighter text-foreground">
                    1,247
                  </span>
                  <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-foreground-muted">
                    BĐS đang bán
                  </span>
                </div>
              </div>
              <div className="rounded-[1.25rem] bg-black/5 p-1.5 ring-1 ring-black/5">
                <div className="flex flex-col gap-1.5 rounded-[calc(1.25rem-0.375rem)] bg-surface p-4">
                  <Users size={16} weight="duotone" className="text-primary" />
                  <span className="font-serif text-2xl font-semibold tabular-nums tracking-tighter text-foreground">
                    38
                  </span>
                  <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-foreground-muted">
                    Agency tin dùng
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Trust strip — partner logos / metrics */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 flex flex-wrap items-center gap-x-10 gap-y-4 border-t border-border pt-8"
        >
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-foreground-muted">
            Được tin dùng bởi
          </span>
          {["Mekong Realty", "East Gate", "Saigon Holdings", "Vina Capital", "Masteri Group"].map(
            (name) => (
              <span
                key={name}
                className="font-serif text-sm font-medium text-foreground-muted/60"
              >
                {name}
              </span>
            )
          )}
        </motion.div>
      </div>
    </section>
  );
}
