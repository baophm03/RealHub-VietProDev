import { HeroSearch } from "./hero-search";
import { HeroFeatured } from "./hero-featured";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background -mt-20 lg:-mt-28">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://picsum.photos/seed/realhub-hero-architecture/1920/1080)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/88 to-background/72" />
      {/* Subtle grain texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 70% 20%, rgba(45,95,63,0.04), transparent 60%)",
        }}
      />

      <div className="relative mx-auto flex min-h-[100dvh] max-w-[1400px] flex-col justify-center px-6 pt-32 pb-20 md:px-8 md:pt-36 md:pb-24 lg:px-12">
        <div className="grid items-center gap-12 lg:grid-cols-[1.35fr_1fr] lg:gap-20">
          <div className="flex flex-col gap-8">
            <HeroSearch />
          </div>

          <HeroFeatured />
        </div>

        <div className="mt-16 flex flex-wrap items-center gap-x-10 gap-y-4 border-t border-border pt-8">
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
        </div>
      </div>
    </section>
  );
}
