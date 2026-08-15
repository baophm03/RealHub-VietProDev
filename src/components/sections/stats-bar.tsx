"use client";

import { motion } from "framer-motion";
import { TrendUp } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

const stats = [
  { value: "1,247", label: "BĐS đang bán", change: "+12.4%" },
  { value: "847", label: "Khách hàng", change: "+8.2%" },
  { value: "203", label: "Giao dịch", change: "+23.1%" },
  { value: "38", label: "Agency", change: "+5.7%" },
];

export function StatsBar() {
  return (
    <section className="border-y border-border bg-surface-muted/40 py-12 md:py-16">
      <div className="mx-auto max-w-[1400px] px-6 md:px-8 lg:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "flex flex-col gap-3 px-6 py-6 md:px-10 md:py-8",
                i > 0 && "md:border-l md:border-border",
                i === 2 && "border-t border-border md:border-t-0",
                i === 3 && "border-t border-border md:border-t-0",
                i < 2 && "border-r border-border md:border-r-0",
              )}
            >
              <span className="font-serif text-5xl font-semibold tabular-nums tracking-tighter md:text-6xl">
                {stat.value}
              </span>
              <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-foreground-muted">
                {stat.label}
              </span>
              <div className="flex items-center gap-1.5">
                <TrendUp size={12} weight="bold" className="text-primary" />
                <span className="text-xs font-semibold tabular-nums text-primary">
                  {stat.change}
                </span>
                <span className="text-xs text-foreground-muted">tháng trước</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
