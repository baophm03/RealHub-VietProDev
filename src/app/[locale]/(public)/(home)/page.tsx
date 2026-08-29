import { setRequestLocale } from "next-intl/server";
import { Hero } from "./_components/hero";
import { StatsBar } from "./_components/stats-bar";
import { FeaturedPropertiesSale } from "./_components/featured-properties-sale";
import { FeaturedPropertiesRent } from "./_components/featured-properties-rent";
import { FeaturedProjects } from "./_components/featured-projects";
import { FeaturedNews } from "./_components/featured-news";
import { CtaSection } from "./_components/cta-section";
import { RevealSection } from "@/components/shared/reveal-section";

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
      <RevealSection>
        <StatsBar />
      </RevealSection>
      <RevealSection>
        <FeaturedPropertiesSale />
      </RevealSection>
      <RevealSection>
        <FeaturedPropertiesRent />
      </RevealSection>
      <RevealSection>
        <FeaturedProjects />
      </RevealSection>
      <RevealSection>
        <FeaturedNews />
      </RevealSection>
      <RevealSection>
        <CtaSection />
      </RevealSection>
    </>
  );
}
