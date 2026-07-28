"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PropertiesList } from "./_components/properties-list";
import { ProjectsList } from "./_components/projects-list";

export default function PropertiesPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Bất động sản"
        title="Quản lý bất động sản"
        description="Quản lý toàn bộ bất động sản và dự án trong hệ thống"
      />

      <Tabs defaultValue="properties">
        <TabsList>
          <TabsTrigger value="properties">Bất động sản</TabsTrigger>
          <TabsTrigger value="projects">Dự án</TabsTrigger>
        </TabsList>

        <TabsContent value="properties">
          <PropertiesList />
        </TabsContent>

        <TabsContent value="projects">
          <ProjectsList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
