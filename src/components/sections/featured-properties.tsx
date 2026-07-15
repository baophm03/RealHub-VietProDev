"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Bed, Bathtub, Square, ArrowUpRight } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";

const properties = [
  {
    id: 1,
    title: "Vinhomes Central Park",
    location: "Bình Thạnh, TP.HCM",
    price: "5.2 tỷ",
    badge: "green" as const,
    badgeText: "Đang bán",
    beds: 3,
    baths: 2,
    area: "98m²",
    image: "https://picsum.photos/seed/realhub-vinhome-cp/800/600",
    span: "lg:col-span-2 lg:row-span-2",
    featured: true,
  },
  {
    id: 2,
    title: "Masteri Thao Dien",
    location: "Thủ Đức, TP.HCM",
    price: "3.8 tỷ",
    badge: "blue" as const,
    badgeText: "Mới",
    beds: 2,
    baths: 2,
    area: "76m²",
    image: "https://picsum.photos/seed/realhub-masteri-td/600/400",
    span: "",
    featured: false,
  },
  {
    id: 3,
    title: "Landmark 81",
    location: "Bình Thạnh, TP.HCM",
    price: "12 tỷ",
    badge: "yellow" as const,
    badgeText: "Đang giữ chỗ",
    beds: 4,
    baths: 3,
    area: "150m²",
    image: "https://picsum.photos/seed/realhub-landmark-81/600/400",
    span: "",
    featured: false,
  },
  {
    id: 4,
    title: "Sunset Grand",
    location: "Quận 7, TP.HCM",
    price: "2.9 tỷ",
    badge: "green" as const,
    badgeText: "Đang bán",
    beds: 2,
    baths: 1,
    area: "65m²",
    image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=600&q=80",
    span: "",
    featured: false,
  },
  {
    id: 5,
    title: "Gem Riverside",
    location: "Quận 2, TP.HCM",
    price: "7.5 tỷ",
    badge: "blue" as const,
    badgeText: "Mới",
    beds: 4,
    baths: 3,
    area: "120m²",
    image: "https://picsum.photos/seed/realhub-gem-riverside/800/400",
    span: "lg:col-span-2",
    featured: false,
  },
];

export function FeaturedProperties() {
  return (
    <section className="py-32 md:py-40">
      <div className="mx-auto max-w-[1400px] px-6 md:px-8 lg:px-12">
        {/* Header — editorial style */}
        <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-4">
            <span className="w-fit rounded-full bg-primary/8 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-primary">
              Bất động sản
            </span>
            <h2 className="font-serif text-3xl font-semibold tracking-tighter md:text-5xl">
              Sản phẩm nổi bật
            </h2>
            <p className="max-w-[48ch] text-sm leading-relaxed text-foreground-muted">
              Tuyển chọn những bất động sản tốt nhất từ các agency và chủ đầu tư trên toàn hệ sinh thái.
            </p>
          </div>
          <Button
            variant="outline"
            rightIcon={
              <span className="flex size-6 items-center justify-center rounded-full bg-primary/8">
                <ArrowRight size={12} weight="bold" />
              </span>
            }
            render={<Link href="/listings" />}
          >
            Xem tất cả
          </Button>
        </div>

        {/* Bento grid — Double-Bezel cards */}
        <div className="grid auto-rows-[240px] grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:auto-rows-[280px]">
          {properties.map((prop, i) => (
            <motion.div
              key={prop.id}
              initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className={prop.span}
            >
              <Link
                href={`/listings/${prop.id}`}
                className="group/property relative flex h-full flex-col justify-end overflow-hidden rounded-[1.5rem] ring-1 ring-black/5"
              >
                {/* Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/property:scale-105"
                  style={{ backgroundImage: `url(${prop.image})` }}
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                {/* Badge */}
                <div className="absolute top-5 left-5 z-10">
                  <Badge variant={prop.badge}>{prop.badgeText}</Badge>
                </div>

                {/* Price tag — top right, pill */}
                <div className="absolute top-5 right-5 z-10 rounded-full bg-primary-foreground/95 px-3.5 py-1.5 text-sm font-semibold text-primary backdrop-blur-sm">
                  {prop.price}
                </div>

                {/* Content */}
                <div className="relative z-10 p-6 text-white">
                  <div className="flex items-center gap-1.5 text-xs text-white/50">
                    <MapPin size={12} weight="fill" />
                    {prop.location}
                  </div>
                  <h3 className={cn(
                    "mt-2 font-serif font-semibold leading-tight",
                    prop.featured ? "text-2xl" : "text-lg",
                  )}>
                    {prop.title}
                  </h3>
                  <div className="mt-3 flex items-center gap-4 text-xs text-white/60">
                    <span className="flex items-center gap-1.5">
                      <Bed size={14} /> {prop.beds}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Bathtub size={14} /> {prop.baths}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Square size={14} /> {prop.area}
                    </span>
                  </div>
                </div>

                {/* Hover arrow — bottom right, button-in-button */}
                <div className="absolute bottom-6 right-6 z-10 flex size-10 translate-y-2 items-center justify-center rounded-full bg-primary-foreground/95 text-primary opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/property:translate-y-0 group-hover/property:opacity-100">
                  <ArrowUpRight size={16} weight="bold" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
