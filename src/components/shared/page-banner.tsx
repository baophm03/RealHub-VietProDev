import { Link } from "@/i18n/navigation";
import { ChevronRight } from "lucide-react";

interface PageBannerProps {
  title: string;
  description?: string;
  breadcrumbs?: { label: string; href?: string }[];
  backgroundImage?: string;
}

export function PageBanner({
  title,
  description,
  breadcrumbs,
  backgroundImage = "/background.jpg",
}: PageBannerProps) {
  return (
    <section className="relative -mt-20 lg:-mt-28 pt-20 lg:pt-28">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />

      <div className="relative z-10 container py-16 md:pt-28 md:pb-10">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="mb-6 flex items-center gap-1.5 text-sm text-white/70">
            {breadcrumbs.map((bc, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {bc.href ? (
                  <Link href={bc.href} className="transition-colors hover:text-white">
                    {bc.label}
                  </Link>
                ) : (
                  <span className="text-white">{bc.label}</span>
                )}
                {i < breadcrumbs.length - 1 && <ChevronRight size={14} className="text-white/40" />}
              </span>
            ))}
          </nav>
        )}

        <div className="flex flex-col gap-2">
          <h1 className="max-w-[20ch] font-serif text-3xl font-semibold leading-tight tracking-tight text-white drop-shadow-lg md:text-4xl lg:text-5xl">
            {title}
          </h1>
          {description && (
            <p className="max-w-[56ch] text-[15px] leading-relaxed text-white/85 drop-shadow-md md:text-medium">
              {description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
