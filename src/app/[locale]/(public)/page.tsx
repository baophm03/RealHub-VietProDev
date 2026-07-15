import { Hero } from "@/components/sections/hero";
import { StatsBar } from "@/components/sections/stats-bar";
import { FeaturedProperties } from "@/components/sections/featured-properties";
import { UserPathways } from "@/components/sections/user-pathways";
import { WhyRealHub } from "@/components/sections/why-realhub";
import { Testimonials } from "@/components/sections/testimonials";
import { CtaSection } from "@/components/sections/cta-section";

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsBar />
      <FeaturedProperties />
      <UserPathways />
      <WhyRealHub />
      <Testimonials />
      <CtaSection />
    </>
  );
}
