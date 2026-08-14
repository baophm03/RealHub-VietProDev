"use client";

import { PageHeader } from "@/components/shared/page-header";
import { VerificationList } from "./_components/verification-list";

export default function VerificationPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Kiểm duyệt"
        title="Duyệt bất động sản"
        description="Xác minh chủ nguồn & sản phẩm trước khi hiển thị public"
      />
      <VerificationList />
    </div>
  );
}
