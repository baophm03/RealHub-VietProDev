"use client";

import { useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { FormSection, FormField } from "@/components/shared/form-section";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useGetApiFormSchemas } from "@/lib/api/endpoints/dynamic-fields";

interface DynamicField {
  id: string;
  fieldKey: string;
  fieldLabel: string;
  fieldType: string;
  groupId?: string | null;
  options?: { id: string; label: string; value: string; sortOrder?: number }[];
  defaultValue?: string | null;
  isRequired?: boolean;
}

interface FormSchemaField {
  id: string;
  fieldId?: string;
  groupId?: string;
  isRequired?: boolean;
  isVisible?: boolean;
  isReadonly?: boolean;
  sortOrder?: number;
  field?: DynamicField;
  group?: { id: string; name: string; code: string } | null;
}

interface FormSchema {
  id: string;
  name: string;
  entityType: string;
  propertyType?: { id: string; name: string; code: string } | null;
  fields?: FormSchemaField[];
}

interface FieldGroup {
  id: string;
  name: string;
  code: string;
  entityType: string;
  propertyType?: { id: string; name: string; code: string } | null;
}

interface DynamicFieldsSectionProps {
  entityType: string;
  propertyTypeId?: string;
  initialValues?: Record<string, unknown>;
  onChange: (values: Record<string, unknown>) => void;
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: DynamicField;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  const fieldType = field.fieldType;
  const options = field.options || [];
  const disabled = false;

  if (fieldType === "TEXT" || fieldType === "FILE" || fieldType === "IMAGE") {
    return (
      <Input
        value={(value as string) ?? ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
    );
  }

  if (fieldType === "TEXTAREA" || fieldType === "JSON") {
    return (
      <Textarea
        rows={3}
        value={(value as string) ?? ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
    );
  }

  if (fieldType === "NUMBER" || fieldType === "MONEY") {
    return (
      <Input
        type="number"
        value={value !== undefined && value !== null ? String(value) : ""}
        onChange={(e) => onChange(e.target.value === "" ? undefined : Number(e.target.value))}
        disabled={disabled}
      />
    );
  }

  if (fieldType === "DATE") {
    return (
      <Input
        type="date"
        value={(value as string) ?? ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
    );
  }

  if (fieldType === "DATETIME") {
    return (
      <Input
        type="datetime-local"
        value={(value as string) ?? ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
    );
  }

  if (fieldType === "BOOLEAN") {
    return (
      <Switch
        checked={Boolean(value)}
        onCheckedChange={(checked) => onChange(checked)}
        disabled={disabled}
      />
    );
  }

  if (fieldType === "SELECT" || fieldType === "RADIO") {
    return (
      <Select
        value={(value as string) ?? ""}
        onValueChange={(v) => onChange(v ?? "")}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Chọn..." />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.id} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  if (fieldType === "MULTI_SELECT" || fieldType === "CHECKBOX") {
    const currentValues = Array.isArray(value) ? (value as string[]) : [];
    return (
      <div className="flex flex-col gap-2">
        {options.map((opt) => {
          const checked = currentValues.includes(opt.value);
          return (
            <label key={opt.id} className="flex items-center gap-2 text-sm">
              <Switch
                checked={checked}
                onCheckedChange={(isChecked) => {
                  if (isChecked) {
                    onChange([...currentValues, opt.value]);
                  } else {
                    onChange(currentValues.filter((v) => v !== opt.value));
                  }
                }}
              />
              {opt.label}
            </label>
          );
        })}
      </div>
    );
  }

  return (
    <Input
      value={(value as string) ?? ""}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    />
  );
}

export function DynamicFieldsSection({
  entityType,
  propertyTypeId,
  initialValues,
  onChange,
}: DynamicFieldsSectionProps) {
  const { data: schemasData, isLoading } = useGetApiFormSchemas({
    entityType: entityType as any,
  });

  const filteredSchemas = useMemo(() => {
    const all = ((schemasData as any)?.data as FormSchema[]) || [];
    return all.filter(
      (s) => !s.propertyType || s.propertyType?.id === undefined || s.propertyType?.id === propertyTypeId,
    );
  }, [schemasData, propertyTypeId]);

  const allFields = useMemo(() => {
    return filteredSchemas.flatMap((schema) =>
      (schema.fields || [])
        .filter((f) => f.isVisible !== false && f.field)
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
        .map((f) => ({
          schemaName: schema.name,
          field: f.field!,
          groupCode: f.group?.code ?? null,
          groupName: f.group?.name ?? null,
          isRequired: f.isRequired ?? f.field?.isRequired ?? false,
        })),
    );
  }, [filteredSchemas]);

  useEffect(() => {
    if (allFields.length > 0 && !initialValues) {
      const defaults: Record<string, unknown> = {};
      for (const { field } of allFields) {
        if (field.defaultValue) {
          defaults[field.fieldKey] = field.defaultValue;
        }
      }
      if (Object.keys(defaults).length > 0) {
        onChange(defaults);
      }
    }
  }, [allFields, initialValues, onChange]);

  const handleFieldChange = (fieldKey: string, value: unknown) => {
    onChange({ ...initialValues, [fieldKey]: value });
  };

  const basicInfoFields = useMemo(
    () => allFields.filter((f) => f.groupCode === "basic_info"),
    [allFields],
  );

  const specialFields = useMemo(
    () => allFields.filter((f) => f.groupCode === "special"),
    [allFields],
  );

  const otherFields = useMemo(
    () => allFields.filter(
      (f) => f.groupCode !== "basic_info" && f.groupCode !== "special",
    ),
    [allFields],
  );

  if (isLoading) {
    return (
      <FormSection title="Trường động" description="Đang tải...">
        <div className="flex flex-col gap-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-12 animate-pulse rounded-lg bg-surface-muted" />
          ))}
        </div>
      </FormSection>
    );
  }

  if (allFields.length === 0) {
    return null;
  }

  const renderFields = (fields: typeof allFields) => (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {fields.map(({ field, isRequired }) => {
        const value = initialValues?.[field.fieldKey];
        return (
          <FormField
            key={field.id}
            label={field.fieldLabel}
            required={isRequired}
          >
            <FieldInput
              field={field}
              value={value}
              onChange={(v) => handleFieldChange(field.fieldKey, v)}
            />
          </FormField>
        );
      })}
    </div>
  );

  return (
    <>
      {basicInfoFields.length > 0 && (
        <FormSection title={basicInfoFields[0]?.groupName || "Thông tin cơ bản"} description="Một số thông tin của dự án/bất động sản">
          {renderFields(basicInfoFields)}
        </FormSection>
      )}

      {specialFields.length > 0 && (
        <FormSection title={specialFields[0]?.groupName || "Thông tin nổi bật"} description="Một số thông tin của dự án/bất động sản">
          {renderFields(specialFields)}
        </FormSection>
      )}

      {otherFields.length > 0 && (
        <FormSection title="Thông tin khác" description="Các trường động bổ sung">
          {renderFields(otherFields)}
        </FormSection>
      )}
    </>
  );
}
