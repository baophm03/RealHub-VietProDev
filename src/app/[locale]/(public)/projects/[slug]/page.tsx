"use client";

import { use } from "react";
import { motion } from "framer-motion";
import { mockProjects, mockProjectStatuses, type MockProject } from "@/lib/mock/projects";
import { MapPin, Building, House, ArrowLeft, CheckCircle, Phone, Calendar, ArrowRight } from "@phosphor-icons/react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export default function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const project = mockProjects.find((p) => p.slug === slug) ?? mockProjects[0];

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-8 md:px-8 md:py-12 lg:px-12">
      <Link
        href="/projects"
        className="mb-6 inline-flex items-center gap-2 text-sm text-foreground-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft size={16} /> Quay lại danh sách dự án
      </Link>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative mb-8 aspect-[16/9] overflow-hidden rounded-lg"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${project.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <span className="mb-3 inline-block rounded-full bg-primary px-3 py-1 text-[10px] font-medium uppercase tracking-wide text-primary-foreground">
            {mockProjectStatuses[project.status]}
          </span>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-white md:text-4xl">
            {project.name}
          </h1>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-white/70">
            <MapPin size={14} weight="fill" /> {project.location}
          </p>
        </div>
      </motion.div>

      {/* Quick Info */}
      <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: "Giá từ", value: project.priceRange },
          { label: "Quy mô", value: project.scale },
          { label: "Loại hình", value: project.propertyTypes.join(", ") },
          { label: "Bàn giao", value: project.handover },
        ].map((item) => (
          <div key={item.label} className="flex flex-col gap-1 rounded-lg border border-border bg-surface p-4">
            <span className="text-[10px] font-medium uppercase tracking-wide text-foreground-muted">{item.label}</span>
            <span className="text-sm font-semibold text-foreground">{item.value}</span>
          </div>
        ))}
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-8">
          {/* Description */}
          <div>
            <h2 className="mb-3 font-serif text-xl font-semibold">Giới thiệu dự án</h2>
            <p className="text-base leading-relaxed text-foreground-muted">{project.description}</p>
          </div>

          {/* Details */}
          <div>
            <h2 className="mb-4 font-serif text-xl font-semibold">Thông tin chi tiết</h2>
            <div className="grid grid-cols-1 gap-0 md:grid-cols-2">
              {[
                { label: "Tên dự án", value: project.name },
                { label: "Vị trí", value: project.location },
                { label: "Chủ đầu tư", value: project.investor },
                { label: "Quy mô", value: project.scale },
                { label: "Loại hình", value: project.propertyTypes.join(", ") },
                { label: "Dự kiến bàn giao", value: project.handover },
              ].map((row) => (
                <div key={row.label} className="flex justify-between border-b border-border py-3">
                  <span className="text-sm text-foreground-muted">{row.label}</span>
                  <span className="text-sm font-medium text-foreground">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <h2 className="mb-4 font-serif text-xl font-semibold">Tiện ích</h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {project.amenities.map((amenity) => (
                <div key={amenity} className="flex items-center gap-2 rounded-lg bg-surface-muted px-3 py-2.5">
                  <CheckCircle size={16} className="text-primary" />
                  <span className="text-sm text-foreground">{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Gallery */}
          {project.gallery.length > 0 && (
            <div>
              <h2 className="mb-4 font-serif text-xl font-semibold">Hình ảnh</h2>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {project.gallery.map((img, idx) => (
                  <div
                    key={idx}
                    className="aspect-[4/3] overflow-hidden rounded-lg bg-cover bg-center transition-transform duration-500 hover:scale-105"
                    style={{ backgroundImage: `url(${img})` }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="flex flex-col gap-5 rounded-lg border border-border bg-surface p-6">
            <div>
              <span className="text-xs font-medium uppercase tracking-wide text-foreground-muted">Khoảng giá</span>
              <p className="text-2xl font-semibold text-primary">{project.priceRange}</p>
            </div>

            <div className="h-px w-full bg-border" />

            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold">Đăng ký tư vấn</h3>
              <p className="text-xs text-foreground-muted">
                Đội ngũ RealHub sẵn sàng tư vấn chi tiết về dự án {project.name}.
              </p>
              <Button size="lg" className="w-full" leftIcon={<Phone size={16} />}>
                Liên hệ ngay
              </Button>
              <Button variant="outline" size="lg" className="w-full" leftIcon={<Calendar size={16} />}>
                Đặt lịch xem dự án
              </Button>
            </div>

            <div className="h-px w-full bg-border" />

            <div className="flex flex-col gap-2 text-xs text-foreground-muted">
              <div className="flex justify-between">
                <span>Chủ đầu tư</span>
                <span className="font-medium text-foreground">{project.investor}</span>
              </div>
              <div className="flex justify-between">
                <span>Trạng thái</span>
                <span className="font-medium text-foreground">{mockProjectStatuses[project.status]}</span>
              </div>
              <div className="flex justify-between">
                <span>Bàn giao</span>
                <span className="font-medium text-foreground">{project.handover}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Related Projects */}
      <div className="mt-16">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-serif text-2xl font-semibold tracking-tight">Dự án liên quan</h2>
          <Link
            href="/projects"
            className="group flex items-center gap-2 text-sm font-medium text-foreground-muted transition-colors hover:text-foreground"
          >
            Xem tất cả
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mockProjects
            .filter((p) => p.id !== project.id)
            .slice(0, 3)
            .map((p) => (
              <Link
                key={p.id}
                href={`/projects/${p.slug}`}
                className="group flex flex-col overflow-hidden rounded-lg border border-border bg-surface transition-all duration-500 hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.08)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url(${p.image})` }}
                  />
                </div>
                <div className="flex flex-col gap-2 p-4">
                  <h3 className="font-serif text-base font-medium transition-colors group-hover:text-primary">{p.name}</h3>
                  <p className="flex items-center gap-1.5 text-xs text-foreground-muted">
                    <MapPin size={12} weight="fill" /> {p.location}
                  </p>
                  <span className="text-sm font-semibold text-primary">{p.priceRange}</span>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
