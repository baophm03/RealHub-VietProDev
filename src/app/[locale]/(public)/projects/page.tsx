"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { mockProjectCategories } from "@/lib/mock/projects";
import { MapPin, Building, House, ArrowRight, Funnel, Spinner } from "@phosphor-icons/react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { useGetApiProjects } from "@/lib/api/endpoints/projects";
import { GetProjectsResponse, Project } from "@/lib/api/types/projects";

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80";

const MOCK_EXTRAS = {
  image: PLACEHOLDER_IMAGE,
  priceRange: "Đang cập nhật",
  handover: "Đang cập nhật",
  propertyTypes: [] as string[],
};

const projectStatusLabels: Record<string, string> = {
  ACTIVE: "Đang hoạt động",
  INACTIVE: "Ngừng hoạt động",
};

function getProjectLocation(project: Project): string {
  const parts: string[] = [];
  if (project.district?.name) parts.push(project.district.name);
  if (project.province?.name) parts.push(project.province.name);
  return parts.length > 0 ? parts.join(", ") : "Đang cập nhật";
}

function getProjectScale(project: Project): string {
  const count = project._count?.properties;
  if (count && count > 0) return `${count.toLocaleString("vi-VN")} BĐS`;
  return "Đang cập nhật";
}

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");

  const { data: projectsData, isLoading } = useGetApiProjects();
  const projects = ((projectsData as unknown as GetProjectsResponse)?.items) || [];

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      if (selectedCategory !== "Tất cả") {
        if (!MOCK_EXTRAS.propertyTypes.includes(selectedCategory)) return false;
      }
      return true;
    });
  }, [projects, selectedCategory]);

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-12 md:px-8 md:py-16 lg:px-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="mb-10 flex flex-col gap-4"
      >
        <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-primary">
          Dự án
        </span>
        <h1 className="font-serif text-4xl font-semibold tracking-tight md:text-5xl">
          Dự án bất động sản
        </h1>
        <p className="max-w-[56ch] text-base leading-relaxed text-foreground-muted">
          Khám phá các dự án bất động sản nổi bật từ các chủ đầu tư uy tín trên toàn hệ sinh thái RealHub.
        </p>
      </motion.div>

      <div className="mb-8 flex flex-wrap items-center gap-2">
        <Funnel size={16} className="text-primary" />
        {mockProjectCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${selectedCategory === cat
              ? "bg-primary text-primary-foreground"
              : "bg-surface-muted text-foreground-muted hover:bg-border/40"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <p className="mb-6 text-sm text-foreground-muted">
        Hiển thị <span className="font-medium text-foreground">{filtered.length}</span> dự án
      </p>

      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Spinner size={32} className="animate-spin text-primary" />
        </div>
      )}

      {!isLoading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link
                href={`/projects/${project.id}`}
                className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface transition-all duration-500 hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.08)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url(${MOCK_EXTRAS.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute left-3 top-3">
                    <span className="rounded-full bg-primary px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-primary-foreground">
                      {projectStatusLabels[project.status] ?? project.status}
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-3 p-5">
                  <h3 className="font-serif text-lg font-medium leading-snug tracking-tight transition-colors group-hover:text-primary">
                    {project.name}
                  </h3>

                  <p className="flex items-center gap-1.5 text-xs text-foreground-muted">
                    <MapPin size={12} weight="fill" />
                    <span className="line-clamp-1">{getProjectLocation(project)}</span>
                  </p>

                  <div className="flex items-center justify-between border-t border-border pt-3">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-medium uppercase tracking-wide text-foreground-muted">Giá từ</span>
                      <span className="text-sm font-semibold text-primary">{MOCK_EXTRAS.priceRange}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-medium uppercase tracking-wide text-foreground-muted">Quy mô</span>
                      <span className="text-sm font-medium text-foreground">{getProjectScale(project)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-foreground-muted">
                    <span className="flex items-center gap-1">
                      <Building size={12} /> {project.developer ?? "Đang cập nhật"}
                    </span>
                    {MOCK_EXTRAS.propertyTypes[0] && (
                      <span className="flex items-center gap-1">
                        <House size={12} /> {MOCK_EXTRAS.propertyTypes[0]}
                      </span>
                    )}
                  </div>

                  <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
                    <span className="text-xs text-foreground-muted">Bàn giao: {MOCK_EXTRAS.handover}</span>
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
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <p className="text-base text-foreground-muted">Không tìm thấy dự án phù hợp bộ lọc.</p>
        </div>
      )}
    </div>
  );
}
