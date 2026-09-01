import { setRequestLocale } from "next-intl/server";
import { Hero } from "./_components/hero";
import { StatsBar } from "./_components/stats-bar";
import { FeaturedPropertiesSection } from "./_components/featured-properties-section";
import { FeaturedProjects } from "./_components/featured-projects";
import { FeaturedNews } from "./_components/featured-news";
import { CtaSection } from "./_components/cta-section";
import { RevealSection } from "@/components/shared/reveal-section";

type Props = {
  params: Promise<{ locale: string }>;
};

export const dynamic = "force-static";
export const revalidate = 1800;

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
        <FeaturedPropertiesSection
          transactionType="SALE"
          eyebrow="Bán"
          title="Bất động sản bán"
          description="Những bất động sản đang bán tốt nhất từ các chủ đầu tư trong hệ sinh thái."
          sectionClassName="bg-white"
        />
      </RevealSection>
      <RevealSection>
        <FeaturedPropertiesSection
          transactionType="RENT"
          eyebrow="Cho thuê"
          title="Bất động sản cho thuê"
          description="Những bất động sản đang cho thuê tốt nhất từ các chủ đầu tư trong hệ sinh thái."
          sectionClassName="bg-surface-muted/30"
        />
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
