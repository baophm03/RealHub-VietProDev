"use client";

import { PageHeader } from "@/components/shared/page-header";
import { ProjectsList } from "./_components/projects-list";

export default function ProjectsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Dự án"
        title="Quản lý dự án"
        description="Quản lý toàn bộ dự án và quỹ căn trong hệ thống"
      />
      <ProjectsList />
    </div>
  );
}
