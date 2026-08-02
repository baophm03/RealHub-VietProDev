import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { setRequestLocale } from "next-intl/server";
import { prefetchGetApiPropertiesQuery } from "@/lib/api/endpoints/properties";
import { Hero } from "@/components/sections/hero";
import { StatsBar } from "@/components/sections/stats-bar";
import { FeaturedProperties } from "@/components/sections/featured-properties";
import { UserPathways } from "@/components/sections/user-pathways";
import { WhyRealHub } from "@/components/sections/why-realhub";
import { Testimonials } from "@/components/sections/testimonials";
import { CtaSection } from "@/components/sections/cta-section";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const queryClient = new QueryClient();

  await prefetchGetApiPropertiesQuery(queryClient, { limit: "5" } as any);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Hero />
      <StatsBar />
      <FeaturedProperties />
      <UserPathways />
      <WhyRealHub />
      <Testimonials />
      <CtaSection />
    </HydrationBoundary>
  );
}
