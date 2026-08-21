import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/hero";
import { StatsBar } from "@/components/sections/stats-bar";
import { FeaturedProperties } from "@/components/sections/featured-properties";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import { FeaturedNews } from "@/components/sections/featured-news";
import { UserPathways } from "@/components/sections/user-pathways";
import { CtaSection } from "@/components/sections/cta-section";

type Props = {
  params: Promise<{ locale: string }>;
};

export const dynamic = "force-static";

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <StatsBar />
      <FeaturedProperties />
      <FeaturedProjects />
      <FeaturedNews />
      <UserPathways />
      <CtaSection />
    </>
  );
}
