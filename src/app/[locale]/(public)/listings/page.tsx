"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { mockProperties, mockPropertyTypes, mockDistricts } from "@/lib/mock/properties";
import { Bed, Bathtub, MapPin, House, ArrowRight, Funnel } from "@phosphor-icons/react";
import { Link } from "@/i18n/navigation";

export default function ListingsPage() {
  const [selectedType, setSelectedType] = useState("Tất cả");
  const [selectedDistrict, setSelectedDistrict] = useState("Tất cả");
  const [transactionType, setTransactionType] = useState<"ALL" | "SALE" | "RENT">("ALL");

  const filtered = mockProperties.filter((p) => {
    if (selectedType !== "Tất cả" && p.type !== selectedType) return false;
    if (selectedDistrict !== "Tất cả" && p.district !== selectedDistrict) return false;
    if (transactionType !== "ALL" && p.transactionType !== transactionType) return false;
    return true;
  });

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-12 md:px-8 md:py-16 lg:px-12">
      <div className="mb-10 flex flex-col gap-4">
        <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-primary">
          Khám phá
        </span>
        <h1 className="font-serif text-4xl font-semibold tracking-tight md:text-5xl">
          Bất động sản nổi bật
        </h1>
        <p className="max-w-[56ch] text-base leading-relaxed text-foreground-muted">
          Tìm kiếm căn hộ, biệt thự, nhà phố, đất nền và mặt bằng phù hợp nhu cầu của bạn.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="flex items-center gap-2 border-b border-border pb-3 mb-4">
            <Funnel size={18} className="text-primary" />
            <h2 className="text-sm font-semibold uppercase tracking-wide">Bộ lọc</h2>
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-foreground-muted">
                Loại giao dịch
              </label>
              <div className="flex gap-2">
                {(["ALL", "SALE", "RENT"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTransactionType(t)}
                    className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                      transactionType === t
                        ? "bg-primary text-primary-foreground"
                        : "bg-surface-muted text-foreground-muted hover:bg-border/40"
                    }`}
                  >
                    {t === "ALL" ? "Tất cả" : t === "SALE" ? "Bán" : "Cho thuê"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-foreground-muted">
                Loại BĐS
              </label>
              <div className="flex flex-col gap-1">
                {mockPropertyTypes.map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedType(t)}
                    className={`rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                      selectedType === t
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-foreground-muted hover:bg-surface-muted"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-foreground-muted">
                Khu vực
              </label>
              <div className="flex flex-col gap-1">
                {mockDistricts.map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDistrict(d)}
                    className={`rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                      selectedDistrict === d
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-foreground-muted hover:bg-surface-muted"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <div>
          <p className="mb-6 text-sm text-foreground-muted">
            Hiển thị <span className="font-medium text-foreground">{filtered.length}</span> bất động sản
          </p>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((property, i) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              >
                <Link
                  href={`/listings/${property.id}`}
                  className="group block overflow-hidden rounded-lg border border-border bg-surface transition-all duration-500 hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.08)]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                      style={{ backgroundImage: `url(${property.image})` }}
                    />
                    <div className="absolute left-3 top-3 flex gap-2">
                      <span className={`rounded-lg px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide ${
                        property.transactionType === "SALE"
                          ? "bg-primary text-primary-foreground"
                          : "bg-accent-blue text-accent-blue-text"
                      }`}>
                        {property.transactionType === "SALE" ? "Bán" : "Cho thuê"}
                      </span>
                      {property.status === "RESERVED" && (
                        <span className="rounded-lg bg-accent-yellow px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-accent-yellow-text">
                          Giữ chỗ
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 p-4">
                    <div className="flex items-center gap-1.5 text-xs text-foreground-muted">
                      <MapPin size={12} weight="fill" />
                      <span>{property.district}, {property.province}</span>
                    </div>

                    <h3 className="font-serif text-lg font-medium leading-snug tracking-tight group-hover:text-primary transition-colors">
                      {property.title}
                    </h3>

                    <div className="flex items-center gap-4 text-xs text-foreground-muted">
                      {property.bedrooms > 0 && (
                        <span className="flex items-center gap-1">
                          <Bed size={14} /> {property.bedrooms} PN
                        </span>
                      )}
                      {property.bathrooms > 0 && (
                        <span className="flex items-center gap-1">
                          <Bathtub size={14} /> {property.bathrooms} WC
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <House size={14} /> {property.area}m²
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-t border-border pt-3">
                      <span className="text-lg font-semibold text-primary">
                        {property.priceText}
                      </span>
                      <ArrowRight
                        size={16}
                        className="text-foreground-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary"
                      />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
              <p className="text-base text-foreground-muted">Không tìm thấy BĐS phù hợp bộ lọc.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
