import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <PublicHeader />
      <main className="flex-1 pt-20 lg:pt-28">{children}</main>
      <PublicFooter />
    </div>
  );
}
