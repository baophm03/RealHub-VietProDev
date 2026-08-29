"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ability } from "@/config/casl/ability";
import { GroupsTab } from "./components/groups-tab";
import { DefinitionsTab } from "./components/definitions-tab";
import { FormSchemasTab } from "./components/form-schemas-tab";

export default function DynamicFieldsPage() {
  const canCreate = ability.can("CREATE", "DYNAMIC_FIELD");
  const canUpdate = ability.can("UPDATE", "DYNAMIC_FIELD");
  const canDelete = ability.can("DELETE", "DYNAMIC_FIELD");

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Cài đặt"
        title="Trường động"
        description="Nhóm trường, định nghĩa và form schema — render động theo đối tượng"
      />

      <Tabs defaultValue="groups">
        <TabsList>
          <TabsTrigger value="groups">Nhóm trường dữ liệu</TabsTrigger>
          <TabsTrigger value="definitions">Trường dữ liệu</TabsTrigger>
          <TabsTrigger value="form-schemas">Nhóm đối tượng</TabsTrigger>
        </TabsList>

        <TabsContent value="groups" className="mt-2">
          <GroupsTab canCreate={canCreate} canUpdate={canUpdate} canDelete={canDelete} />
        </TabsContent>

        <TabsContent value="definitions" className="mt-2">
          <DefinitionsTab canCreate={canCreate} canUpdate={canUpdate} canDelete={canDelete} />
        </TabsContent>

        <TabsContent value="form-schemas" className="mt-2">
          <FormSchemasTab canCreate={canCreate} canUpdate={canUpdate} canDelete={canDelete} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
