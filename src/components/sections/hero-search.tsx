"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  MapPin,
  Search,
} from "lucide-react";
import { propertyCategories } from "@/config/property-categories";

const searchTabs = [
  { label: "Mua", value: "sale" },
  { label: "Thuê", value: "rent" },
];

export function HeroSearch() {
  const [activeTab, setActiveTab] = useState("sale");

  return (
    <>
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
              aria-label="Tìm kiếm"
              render={<Link href="/listings" />}
              className="flex size-10 items-center justify-center rounded-[calc(1.5rem-0.375rem)] p-0"
            >
              <Search size={18} />
            </Button>
          </div>
        </div>

        {/* Quick category chips */}
        <div className="mt-3 flex flex-wrap gap-2">
          {propertyCategories.map((type) => (
            <Link
              key={type.label}
              href={type.href}
              className="group flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-xs font-medium text-foreground-muted transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-border-strong hover:text-foreground"
            >
              <type.icon size={14} />
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
              <ArrowRight size={14} />
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
            <ArrowRight size={12} />
          </span>
        </Link>
      </motion.div>
    </>
  );
}
