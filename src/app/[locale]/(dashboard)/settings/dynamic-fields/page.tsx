"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { GroupsTab } from "./components/groups-tab";
import { DefinitionsTab } from "./components/definitions-tab";
import { FormSchemasTab } from "./components/form-schemas-tab";
import type { GetApiFieldGroupsEntityType } from "@/lib/api/models/getApiFieldGroupsEntityType";
import type { GetApiFormSchemasEntityType } from "@/lib/api/models/getApiFormSchemasEntityType";

const entityTypeOptions: { value: string; label: string }[] = [
  { value: "PROPERTY", label: "Bất động sản" },
  { value: "CUSTOMER_NEED", label: "Nhu cầu khách hàng" },
  { value: "LEAD", label: "Khách tiềm năng" },
  { value: "DEAL", label: "Giao dịch" },
  { value: "OWNER_PROFILE", label: "Hồ sơ chủ nhà" },
];

export default function DynamicFieldsPage() {
  const [entityType, setEntityType] = useState<string>("");

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Cài đặt"
        title="Trường động"
        description="Nhóm trường, định nghĩa và form schema — render động theo đối tượng"
        actions={
          <Select
            value={entityType}
            onValueChange={(v) => setEntityType(v as string)}
          >
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Tất cả">
                {(value: string) => {
                  if (!value) return "Tất cả";
                  const opt = entityTypeOptions.find((o) => o.value === value);
                  return opt?.label || value;
                }}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tất cả</SelectItem>
              {entityTypeOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      <Tabs defaultValue="groups">
        <TabsList>
          <TabsTrigger value="groups">Nhóm trường</TabsTrigger>
          <TabsTrigger value="definitions">Định nghĩa trường</TabsTrigger>
          <TabsTrigger value="form-schemas">Form schema</TabsTrigger>
        </TabsList>

        <TabsContent value="groups">
          <GroupsTab
            entityType={entityType ? (entityType as GetApiFieldGroupsEntityType) : undefined}
          />
        </TabsContent>

        <TabsContent value="definitions">
          <DefinitionsTab
            entityType={entityType ? (entityType as GetApiFieldGroupsEntityType) : undefined}
          />
        </TabsContent>

        <TabsContent value="form-schemas">
          <FormSchemasTab
            entityType={entityType ? (entityType as GetApiFormSchemasEntityType) : undefined}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
