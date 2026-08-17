"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormSection, FormField } from "@/components/shared/form-section";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { usePostApiDeal } from "@/lib/api/endpoints/deals-reservations";
import { useGetApiCustomers } from "@/lib/api/endpoints/customers";
import { useGetApiProperties } from "@/lib/api/endpoints/properties";
import { useGetApiUsers } from "@/lib/api/endpoints/users";

interface Customer {
  id: string;
  fullName: string;
  phone?: string;
}
interface Property {
  id: string;
  title: string;
  propertyCode: string;
}
interface User {
  id: string;
  fullName: string;
  email?: string;
}

const txOptions = [
  { value: "SALE", label: "Bán" },
  { value: "RENT", label: "Cho thuê" },
  { value: "TRANSFER", label: "Chuyển nhượng" },
];

const dealSchema = z.object({
  dealCode: z.string().min(1, "Vui lòng nhập mã giao dịch"),
  customerId: z.string().optional(),
  propertyId: z.string().min(1, "Vui lòng chọn BĐS"),
  transactionType: z.enum(["SALE", "RENT", "TRANSFER"]),
  expectedValue: z.string().optional(),
  leadId: z.string().optional(),
  salesUserId: z.string().optional(),
});

type DealFormData = z.infer<typeof dealSchema>;

export default function DealFormPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedTx, setSelectedTx] = useState("SALE");
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const [selectedSalesId, setSelectedSalesId] = useState("");

  const { mutateAsync: createDeal } = usePostApiDeal();

  const { data: customersData } = useGetApiCustomers({ limit: "100", offset: "0" });
  const customers = ((customersData as unknown as { data: Customer[] })?.data) || [];

  const { data: propertiesData } = useGetApiProperties({ limit: "100", offset: "0" });
  const properties = ((propertiesData as unknown as { data: Property[] })?.data) || [];

  const { data: usersData } = useGetApiUsers({ limit: "100", offset: "0" });
  const users = ((usersData as unknown as { data: User[] })?.data) || [];

  const customerItems = useMemo(() => {
    const map: Record<string, string> = { __none__: "— Không chọn —" };
    for (const c of customers) {
      map[c.id] = `${c.fullName}${c.phone ? ` · ${c.phone}` : ""}`;
    }
    return map;
  }, [customers]);

  const propertyItems = useMemo(() => {
    const map: Record<string, string> = { __none__: "— Không chọn —" };
    for (const p of properties) {
      map[p.id] = `${p.title} (#${p.propertyCode})`;
    }
    return map;
  }, [properties]);

  const salesItems = useMemo(() => {
    const map: Record<string, string> = { __none__: "— Không chọn —" };
    for (const u of users) {
      map[u.id] = `${u.fullName}${u.email ? ` · ${u.email}` : ""}`;
    }
    return map;
  }, [users]);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<DealFormData>({
    resolver: zodResolver(dealSchema),
    defaultValues: { transactionType: "SALE" },
  });

  const onSubmit = async (data: DealFormData) => {
    setLoading(true);
    try {
      await createDeal({
        data: {
          dealCode: data.dealCode,
          propertyId: data.propertyId,
          transactionType: data.transactionType,
          customerId: data.customerId || undefined,
          expectedValue: data.expectedValue || undefined,
          leadId: data.leadId || undefined,
          salesUserId: data.salesUserId || undefined,
        },
      });
      toast.success("Đã tạo giao dịch mới");
      router.push("/dashboard/deals");
    } catch (err) {
      toast.error("Có lỗi xảy ra khi tạo giao dịch, vui lòng thử lại");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push("/dashboard/deals")}
          className="rounded-md p-2 text-foreground-muted hover:bg-surface-muted"
          aria-label="Quay lại"
        >
          <ArrowLeft size={20} />
        </button>
        <PageHeader eyebrow="Giao dịch" title="Tạo giao dịch" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormSection title="Thông tin giao dịch">
          <FormField label="Mã giao dịch" htmlFor="dealCode" required error={errors.dealCode?.message}>
            <Input id="dealCode" placeholder="DEAL-001" {...register("dealCode")} />
          </FormField>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="Khách hàng">
              <Select
                value={selectedCustomerId || "__none__"}
                items={customerItems}
                onValueChange={(v) => {
                  const val = (v ?? "") === "__none__" ? "" : (v ?? "");
                  setSelectedCustomerId(val);
                  setValue("customerId", val || undefined);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn khách hàng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__" label="— Không chọn —">— Không chọn —</SelectItem>
                  {customers.map((c) => {
                    const label = `${c.fullName}${c.phone ? ` · ${c.phone}` : ""}`;
                    return (
                      <SelectItem key={c.id} value={c.id} label={label}>
                        {label}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="BĐS" required error={errors.propertyId?.message}>
              <Select
                value={selectedPropertyId || "__none__"}
                items={propertyItems}
                onValueChange={(v) => {
                  const val = (v ?? "") === "__none__" ? "" : (v ?? "");
                  setSelectedPropertyId(val);
                  setValue("propertyId", val);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn BĐS" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__" label="— Không chọn —">— Không chọn —</SelectItem>
                  {properties.map((p) => {
                    const label = `${p.title} (#${p.propertyCode})`;
                    return (
                      <SelectItem key={p.id} value={p.id} label={label}>
                        {label}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </FormField>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="Loại giao dịch" required>
              <Select
                value={selectedTx}
                items={Object.fromEntries(txOptions.map((o) => [o.value, o.label]))}
                onValueChange={(v) => {
                  if (v) {
                    setSelectedTx(v);
                    setValue("transactionType", v as DealFormData["transactionType"]);
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn loại giao dịch" />
                </SelectTrigger>
                <SelectContent>
                  {txOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value} label={o.label}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Giá trị dự kiến (VND)" htmlFor="expectedValue">
              <Input id="expectedValue" placeholder="5000000000" {...register("expectedValue")} />
            </FormField>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="Khách hàng tiềm năng" htmlFor="leadId">
              <Input id="leadId" placeholder="ID khách hàng tiềm năng (nếu có)" {...register("leadId")} />
            </FormField>
            <FormField label="Sales phụ trách">
              <Select
                value={selectedSalesId || "__none__"}
                items={salesItems}
                onValueChange={(v) => {
                  const val = (v ?? "") === "__none__" ? "" : (v ?? "");
                  setSelectedSalesId(val);
                  setValue("salesUserId", val || undefined);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn sales" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__" label="— Không chọn —">— Không chọn —</SelectItem>
                  {users.map((u) => {
                    const label = `${u.fullName}${u.email ? ` · ${u.email}` : ""}`;
                    return (
                      <SelectItem key={u.id} value={u.id} label={label}>
                        {label}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </FormField>
          </div>
        </FormSection>

        <div className="flex items-center justify-end gap-2">
          <Button type="button" variant="secondary" onClick={() => router.push("/dashboard/deals")}>
            Hủy
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Đang lưu..." : "Lưu giao dịch"}
          </Button>
        </div>
      </form>
    </div>
  );
}
