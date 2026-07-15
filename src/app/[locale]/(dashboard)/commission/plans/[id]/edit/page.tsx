"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash } from "@phosphor-icons/react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormSection, FormField } from "@/components/shared/form-section";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface SplitRow {
  id: string;
  role: string;
  type: string;
  value: string;
}

export default function CommissionPlanFormPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [splits, setSplits] = useState<SplitRow[]>([
    { id: "1", role: "Sales chinh", type: "PERCENT", value: "60" },
    { id: "2", role: "Truong nhom", type: "PERCENT", value: "25" },
  ]);

  const addSplit = () => setSplits([...splits, { id: Date.now().toString(), role: "", type: "PERCENT", value: "" }]);
  const removeSplit = (id: string) => setSplits(splits.filter((s) => s.id !== id));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      router.push("/commission/plans");
    } finally {
      setLoading(false);
    }
  };

  return (
          <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/commission/plans")} className="rounded-md p-2 text-foreground-muted hover:bg-surface-muted" aria-label="Quay lai">
            <ArrowLeft size={20} />
          </button>
          <PageHeader eyebrow="Hoa hong" title="Tao ke hoach hoa hong" />
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <FormSection title="Thong tin co ban">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField label="Ten ke hoach" required>
                <Input placeholder="Hoa hong ban nha dat - 2025" />
              </FormField>
              <FormField label="Loai tinh" required>
                <Select defaultValue="PERCENT">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERCENT">Theo %</SelectItem>
                    <SelectItem value="FIXED">Co dinh</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField label="Co so tinh" required>
                <Select defaultValue="ACTUAL_VALUE">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EXPECTED_VALUE">Gia tri du kien</SelectItem>
                    <SelectItem value="ACTUAL_VALUE">Gia tri thuc te</SelectItem>
                    <SelectItem value="NET_VALUE">Gia tri rong</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Ty le co ban (%)" required>
                <Input type="number" placeholder="3" />
              </FormField>
            </div>
          </FormSection>

          <FormSection title="Phan chia hoa hong" description="Dinh nghia ty le phan chia cho tung vai tro">
            <div className="flex flex-col gap-3">
              {splits.map((split) => (
                <div key={split.id} className="flex items-center gap-3">
                  <Input placeholder="Vai tro (vd: Sales chinh)" defaultValue={split.role} className="flex-1" />
                  <Select defaultValue={split.type}>
                    <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PERCENT">Theo %</SelectItem>
                      <SelectItem value="FIXED">Co dinh</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input type="number" placeholder="60" defaultValue={split.value} className="w-24" />
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeSplit(split.id)} aria-label="Xoa">
                    <Trash size={16} />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="secondary" onClick={addSplit} className="w-fit">
                <Plus size={16} />
                Them phan chia
              </Button>
            </div>
          </FormSection>

          <div className="flex items-center justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => router.push("/commission/plans")}>Huy</Button>
            <Button type="submit" disabled={loading}>{loading ? "Dang luu..." : "Luu ke hoach"}</Button>
          </div>
        </form>
      </div>  );
}
