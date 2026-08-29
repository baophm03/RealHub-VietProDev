import { FeaturedPropertiesSection } from "@/app/[locale]/(public)/(home)/_components/featured-properties-section";

export function FeaturedPropertiesSale() {
  return (
    <FeaturedPropertiesSection
      transactionType="SALE"
      eyebrow="Bán"
      title="Bất động sản bán"
      description="Những bất động sản đang bán tốt nhất từ các agency và chủ đầu tư trên toàn hệ sinh thái."
      sectionClassName="bg-white"
    />
  );
}
