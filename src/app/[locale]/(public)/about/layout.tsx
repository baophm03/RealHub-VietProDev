import type { Metadata } from "next";
import { generateSeoMetadata } from "@/lib/seo";
import { buildStaticContext } from "@/lib/seo-context";

export async function generateMetadata(): Promise<Metadata> {
  return generateSeoMetadata("ABOUT", buildStaticContext(), {
    title: "Giới thiệu - RealHub",
    description: "Tìm hiểu về RealHub - nền tảng hệ sinh thái bất động sản đa tenant.",
  });
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
