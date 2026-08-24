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
import { useGetApiPropertyTypes } from "@/lib/api/endpoints/properties";
import type { GetApiFieldGroupsEntityType } from "@/lib/api/models/getApiFieldGroupsEntityType";
import type { GetApiFormSchemasEntityType } from "@/lib/api/models/getApiFormSchemasEntityType";

type PropertyType = {
  id: string;
  name: string;
  code: string;
};

const entityTypeOptions: { value: string; label: string }[] = [
  { value: "PROPERTY", label: "Bất động sản" },
  { value: "CUSTOMER_NEED", label: "Nhu cầu khách hàng" },
  { value: "LEAD", label: "Khách tiềm năng" },
  { value: "DEAL", label: "Giao dịch" },
  { value: "OWNER_PROFILE", label: "Hồ sơ chủ nhà" },
];

export default function DynamicFieldsPage() {
  const [entityType, setEntityType] = useState<string>("");
  const [propertyTypeId, setPropertyTypeId] = useState<string>("");

  const { data: propertyTypesData } = useGetApiPropertyTypes();
  const propertyTypes = ((propertyTypesData as { data?: PropertyType[] } | undefined)?.data) || [];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Cài đặt"
        title="Trường động"
        description="Nhóm trường, định nghĩa và form schema — render động theo đối tượng"
        actions={
          <div className="flex items-center gap-2">
            <Select
              value={entityType}
              onValueChange={(v) => {
                setEntityType(v as string);
                setPropertyTypeId("");
              }}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Tất cả">
                  {(value: string) => {
                    if (!value) return "Tất cả";
                    const opt = entityTypeOptions.find((o) => o.value === value);
                    return opt?.label || value;
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="" label="Tất cả">Tất cả</SelectItem>
                {entityTypeOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} label={opt.label}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {entityType === "PROPERTY" && (
              <Select
                value={propertyTypeId}
                onValueChange={(v) => setPropertyTypeId(v as string)}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Tất cả loại BĐS">
                    {(value: string) => {
                      if (!value) return "Tất cả loại BĐS";
                      const pt = propertyTypes.find((p) => p.id === value);
                      return pt?.name || value;
                    }}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="" label="Tất cả loại BĐS">Tất cả loại BĐS</SelectItem>
                  {propertyTypes.map((pt) => (
                    <SelectItem key={pt.id} value={pt.id} label={pt.name}>
                      {pt.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        }
      />

      <Tabs defaultValue="groups">
        <TabsList>
          <TabsTrigger value="groups">Nhóm trường dữ liệu</TabsTrigger>
          <TabsTrigger value="definitions">Trường dữ liệu</TabsTrigger>
          <TabsTrigger value="form-schemas">Nhóm đối tượng</TabsTrigger>
        </TabsList>

        <TabsContent value="groups">
          <GroupsTab
            entityType={entityType ? (entityType as GetApiFieldGroupsEntityType) : undefined}
            propertyTypeId={entityType === "PROPERTY" && propertyTypeId ? propertyTypeId : undefined}
          />
        </TabsContent>

        <TabsContent value="definitions">
          <DefinitionsTab
            entityType={entityType ? (entityType as GetApiFieldGroupsEntityType) : undefined}
            propertyTypeId={entityType === "PROPERTY" && propertyTypeId ? propertyTypeId : undefined}
          />
        </TabsContent>

        <TabsContent value="form-schemas">
          <FormSchemasTab
            entityType={entityType ? (entityType as GetApiFormSchemasEntityType) : undefined}
            propertyTypeId={entityType === "PROPERTY" && propertyTypeId ? propertyTypeId : undefined}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
