import { setRequestLocale } from "next-intl/server";
import { getApiProjectCode, getApiProjects } from "@/lib/api/endpoints/projects";
import type {
  GetProjectItemResponse,
  GetProjectsResponse,
  Project,
} from "@/lib/api/types/projects";
import { Link } from "@/i18n/navigation";
import {
  MapPin,
  ArrowLeft,
  Phone,
  Calendar,
  ArrowRight,
  Camera,
  Building2,
  Hash,
  Ruler,
  Tag,
  Home,
  BedDouble,
  Bath,
  Square
} from "lucide-react";
import { formatPriceWithTransaction } from "@/utils";
import type { ProjectProperty } from "@/lib/api/types/projects";
import { getProjectPriceRange } from "@/utils/project-helpers";
import { ProjectCard } from "@/components/shared/project-card";

type Props = {
  params: Promise<{ locale: string; code: string }>;
};

export const dynamic = "force-static";
export const revalidate = 1800;

export async function generateStaticParams() {
  const projectsRes = await getApiProjects({ limit: "100" });
  const projects = (projectsRes as unknown as GetProjectsResponse)?.data ?? [];
  return ["vi", "en"].flatMap((locale) =>
    projects.map((p) => ({ locale, code: p.code })),
  );
}

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

function getProjectImages(project: Project): { url: string; caption: string | null; id: string }[] {
  const mediaList = project.media;
  if (!mediaList || mediaList.length === 0) return [];
  return mediaList
    .filter((m) => m.type === "IMAGE" || m.file?.mimeType?.startsWith("image/"))
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map((m) => ({ url: m.file?.url ?? "", caption: m.caption, id: m.id }));
}

const buttonBase =
  "inline-flex shrink-0 items-center justify-center rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none select-none gap-1.5 h-10 px-2.5 w-full";
const buttonPrimary = `${buttonBase} bg-primary text-primary-foreground hover:bg-primary/80`;
const buttonOutline = `${buttonBase} border border-border bg-background shadow-xs hover:bg-muted hover:text-foreground`;

const businessStatusBadge: Record<string, { label: string; class: string }> = {
  AVAILABLE: { label: "Sẵn có", class: "bg-accent-green text-accent-green-text" },
  RESERVED: { label: "Đặt cọc", class: "bg-accent-yellow text-accent-yellow-text" },
  SOLD: { label: "Đã bán", class: "bg-accent-red text-accent-red-text" },
  RENTED: { label: "Đã thuê", class: "bg-accent-blue text-accent-blue-text" },
  OFF_MARKET: { label: "Ngừng bán", class: "bg-surface-muted text-foreground-muted" },
};

const txLabel: Record<string, string> = {
  SALE: "Bán",
  RENT: "Cho thuê",
  TRANSFER: "Chuyển nhượng",
  INVESTMENT: "Đầu tư",
};

const propertyBadgeBase =
  "inline-flex h-6 min-w-[3.25rem] items-center justify-center px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide rounded-md shadow-sm whitespace-nowrap";

const BEDROOM_KEYS = ["bed_room_count", "bedroom_count", "bedrooms", "beds", "phong_ngu"];
const BATHROOM_KEYS = ["bathroom_count", "bathrooms", "baths", "pathroom_count", "phong_tam"];

function pickDynamicValue(
  dynamicValues: Record<string, unknown> | null | undefined,
  keys: string[],
): string | null {
  if (!dynamicValues) return null;
  for (const k of keys) {
    const v = dynamicValues[k];
    if (v !== undefined && v !== null && v !== "") return String(v);
  }
  return null;
}

function firstPropertyImageUrl(property: ProjectProperty): string | null {
  if (!property.media || property.media.length === 0) return null;
  const imageItem = property.media.filter((m) => m.file?.url)[0];
  return imageItem?.file?.url ?? null;
}

export default async function ProjectDetailPage({ params }: Props) {
  const { locale, code } = await params;
  setRequestLocale(locale);

  const [projectRes, projectsRes] = await Promise.all([
    getApiProjectCode(code),
    getApiProjects({ limit: "10" }),
  ]);

  const project = (projectRes as unknown as GetProjectItemResponse)?.data ?? null;
  const allProjects = (projectsRes as unknown as GetProjectsResponse)?.data ?? [];
  const relatedProjects = allProjects.filter((p) => p.code !== code).slice(0, 3);

  // Properties trong dự án — media đã được embed trong ProjectProperty
  const properties = project?.properties ?? [];

  if (!project) {
    return (
      <div className="container py-8 md:py-12">
        <Link
          href="/projects"
          className="mb-6 inline-flex items-center gap-2 text-sm text-foreground-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft size={16} /> Quay lại danh sách dự án
        </Link>
        <div className="mx-auto max-w-3xl py-20 text-center">
          <h1 className="mb-2 font-serif text-2xl font-semibold">Không tìm thấy dự án</h1>
          <p className="text-sm text-foreground-muted">Dự án bạn tìm kiếm không tồn tại hoặc đã bị xoá.</p>
        </div>
      </div>
    );
  }

  const location = getProjectLocation(project);
  const scale = getProjectScale(project);
  const projectImages = getProjectImages(project);
  const heroImage = projectImages[0]?.url || null;

  return (
    <div className="container pb-8 md:pb-12">
      <Link
        href="/projects"
        className="mb-6 inline-flex items-center gap-2 text-sm text-foreground-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft size={16} /> Quay lại danh sách dự án
      </Link>

      {/* Hero */}
      <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-lg">
        {heroImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={heroImage}
            alt={project.name}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-surface-muted">
            <div className="flex flex-col items-center gap-2 text-foreground-muted">
              <Camera size={32} />
              <span className="text-sm">Chưa có hình ảnh cho dự án này</span>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <span className="mb-3 inline-block rounded-full bg-primary px-3 py-1 text-[10px] font-medium uppercase tracking-wide text-primary-foreground">
            {projectStatusLabels[project.status] ?? project.status}
          </span>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-white md:text-4xl">
            {project.name}
          </h1>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-white/70">
            <MapPin size={14} />
            <span>{location}</span>
          </p>
        </div>
      </div>

      {/* Gallery */}
      {projectImages.length > 1 && (
        <div className="mb-8 grid grid-cols-2 gap-2 md:grid-cols-4">
          {projectImages.slice(1, 5).map((img, i) => (
            <div key={img.id || i} className="relative aspect-[4/3] overflow-hidden rounded-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={img.caption || project.name}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-10 lg:grid-cols-12">
        <div className="flex flex-col gap-8 lg:col-span-8">
          {/* Description */}
          <div>
            <h2 className="mb-3 font-serif text-xl font-semibold">Giới thiệu dự án</h2>
            {project.description ? (
              <p className="whitespace-pre-line text-base leading-relaxed text-foreground-muted">{project.description}</p>
            ) : (
              <p className="text-base leading-relaxed text-foreground-muted">Đang cập nhật thông tin giới thiệu cho dự án {project.name}.</p>
            )}
          </div>

          <div>
            <h2 className="mb-4 font-serif text-xl font-semibold">Thông tin chi tiết</h2>
            <div className="rounded-xl border border-border bg-white p-6 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.08)]">
              <div className="grid grid-cols-2 divide-y divide-border md:grid-cols-2 md:divide-y-0">
                {[
                  { label: "Tên dự án", value: project.name, icon: Building2 },
                  { label: "Mã dự án", value: project.code, icon: Hash },
                  { label: "Vị trí", value: location, icon: MapPin },
                  { label: "Chủ đầu tư", value: project.developer ?? "Đang cập nhật", icon: Building2 },
                  { label: "Quy mô", value: scale, icon: Ruler },
                  {
                    label: "Trạng thái",
                    value: projectStatusLabels[project.status] ?? project.status,
                    icon: Tag,
                  },
                  { label: "Loại hình", value: "Đang cập nhật", icon: Home },
                  { label: "Bàn giao", value: project.handoverDate ?? "Đang cập nhật", icon: Calendar },
                ].map(({ label, value, icon: Icon }, i) => (
                  <div
                    key={label}
                    className={`flex items-center gap-3 py-4 ${i % 2 === 0 ? "md:pr-6 md:border-r md:border-border" : "md:pl-6"} ${i >= 2 ? "md:border-t md:border-border" : ""} ${i < 2 ? "pt-0" : ""} ${i >= 6 ? "pb-0" : ""}`}
                  >
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Icon size={16} className="text-primary" />
                    </div>
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="text-[11px] font-medium uppercase tracking-wide text-foreground-muted">
                        {label}
                      </span>
                      <span className="text-sm font-semibold text-foreground line-clamp-1">
                        {value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <aside className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
          <div className="flex flex-col gap-5 rounded-lg border border-border bg-surface p-6">
            <div>
              <span className="text-xs font-medium uppercase tracking-wide text-foreground-muted">Khoảng giá</span>
              <p className="text-2xl font-semibold text-primary">{getProjectPriceRange(project)}</p>
            </div>

            <div className="h-px w-full bg-border" />

            <div className="flex flex-col gap-3">
              <button type="button" className={buttonPrimary}>
                <Phone size={16} />
                Liên hệ ngay
              </button>
              <button type="button" className={buttonOutline}>
                <Calendar size={16} />
                Đặt lịch xem dự án
              </button>
            </div>
          </div>
        </aside>
      </div>

      {properties.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-4 font-serif text-xl font-semibold">Bất động sản thuộc dự án</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {properties.map((property) => {
              const badge = businessStatusBadge[property.businessStatus ?? ""];
              const imageUrl = firstPropertyImageUrl(property);
              const bedrooms = pickDynamicValue(property.dynamicValuesJson, BEDROOM_KEYS);
              const bathrooms = pickDynamicValue(property.dynamicValuesJson, BATHROOM_KEYS);
              const tx = property.transactionType ?? "";
              return (
                <Link
                  key={property.id}
                  href={`/listings/${property.propertyCode}`}
                  className="group flex flex-col bg-surface rounded-xl border border-border overflow-hidden hover:border-primary transition-colors shadow-sm hover:shadow-md"
                >
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden">
                    {imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={imageUrl}
                        alt={property.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-surface-muted">
                        <span className="text-xs text-foreground-muted">Không có hình ảnh</span>
                      </div>
                    )}
                    {badge && (
                      <div className="absolute top-3 right-3 z-10">
                        <span className={`${propertyBadgeBase} ${badge.class}`}>{badge.label}</span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3 z-10">
                      <span
                        className={`${propertyBadgeBase} ${tx === "SALE"
                          ? "bg-primary text-primary-foreground"
                          : "bg-accent-blue text-accent-blue-text"
                          }`}
                      >
                        {txLabel[tx] ?? tx}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col gap-2 flex-1">
                    <h3 className="font-serif text-lg font-medium text-primary truncate pr-2 group-hover:text-primary/80 transition-colors">
                      {property.title}
                    </h3>

                    <p className="text-sm text-foreground-muted flex items-center gap-1">
                      <MapPin size={16} />
                      <span>
                        {property?.district?.name ?? "Đang cập nhật"},{" "}
                        {property?.province?.name ?? "Đang cập nhật"}
                      </span>
                    </p>

                    {property.propertyType?.name && (
                      <div className="flex gap-2 mt-1">
                        <span className="bg-surface-muted text-xs px-2 py-1 rounded text-foreground-muted">
                          {property.propertyType.name}
                        </span>
                      </div>
                    )}

                    {/* Giá tiền */}
                    <div className="flex flex-col items-start justify-start gap-1 mt-1">
                      <div className="font-serif text-2xl font-bold text-primary">
                        {formatPriceWithTransaction(String(property.price ?? 0), tx)}
                      </div>
                    </div>

                    {/* Thông tin phòng ngủ, phòng tắm, diện tích */}
                    <div className="flex flex-wrap items-center justify-start gap-3 mt-auto pt-4 border-t border-border text-xs text-foreground-muted">
                      {bedrooms && (
                        <span className="flex items-center gap-1">
                          <BedDouble size={13} className="shrink-0" />
                          <span className="tabular-nums">{bedrooms}</span>
                          <span>PN</span>
                        </span>
                      )}
                      {bathrooms && (
                        <span className="flex items-center gap-1">
                          <Bath size={13} className="shrink-0" />
                          <span className="tabular-nums">{bathrooms}</span>
                          <span>WC</span>
                        </span>
                      )}
                      {property.area != null && (
                        <span className="flex items-center gap-1">
                          <Square size={13} className="shrink-0" />
                          <span className="tabular-nums">
                            {property.area.toLocaleString("vi-VN")}
                          </span>
                          <span>m²</span>
                        </span>
                      )}
                    </div>

                    {/* Xem chi tiết */}
                    <div className="flex items-center gap-1 pt-2 text-xs font-medium text-primary">
                      Xem chi tiết
                      <ArrowRight size={13} className="shrink-0" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
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
            {relatedProjects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
