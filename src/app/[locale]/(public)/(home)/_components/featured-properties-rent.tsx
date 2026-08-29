import { FeaturedPropertiesSection } from "@/app/[locale]/(public)/(home)/_components/featured-properties-section";

export function FeaturedPropertiesRent() {
  return (
    <FeaturedPropertiesSection
      transactionType="RENT"
      eyebrow="Cho thuê"
      title="Bất động sản cho thuê"
      description="Những bất động sản đang cho thuê tốt nhất từ các agency và chủ đầu tư trên toàn hệ sinh thái."
      sectionClassName="bg-surface-muted/30"
    />
  );
}
