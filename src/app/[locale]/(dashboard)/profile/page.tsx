"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormSection, FormField } from "@/components/shared/form-section";
import { useUserStore } from "@/lib/stores/user-store";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";

export default function ProfilePage() {
  const user = useUserStore((s) => s.user);
  const [loading, setLoading] = useState(false);

  const initials = user?.fullName
    ?.split(" ")
    .slice(-2)
    .map((n) => n[0])
    .join("")
    .toUpperCase() ?? "U";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader eyebrow="Tai khoan" title="Ho so ca nhan" description="Thong tin tai khoan va mat khau" />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-6">
            <Avatar className="size-20 rounded-lg overflow-hidden">
              <AvatarFallback className="flex size-20 items-center justify-center rounded-lg bg-surface-muted text-xl font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <p className="text-sm font-medium">{user?.fullName ?? "User"}</p>
              <p className="text-xs text-foreground-muted">{user?.email}</p>
            </div>
            {user && <Badge variant="blue">{user.role}</Badge>}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Thong tin ca nhan</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField label="Ho va ten">
                  <Input defaultValue={user?.fullName ?? ""} />
                </FormField>
                <FormField label="Email">
                  <Input defaultValue={user?.email ?? ""} disabled />
                </FormField>
                <FormField label="So dien thoai">
                  <Input defaultValue={user?.phone ?? ""} placeholder="0901234567" />
                </FormField>
                <FormField label="Anh dai dien URL">
                  <Input defaultValue={user?.avatarUrl ?? ""} placeholder="https://..." />
                </FormField>
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={loading}>{loading ? "Dang luu..." : "Luu thay doi"}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Doi mat khau</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <FormField label="Mat khau hien tai" required>
                <Input type="password" placeholder="Nhap mat khau hien tai" />
              </FormField>
              <FormField label="Mat khau moi" required>
                <Input type="password" placeholder="Nhap mat khau moi" />
              </FormField>
              <FormField label="Xac nhan mat khau" required>
                <Input type="password" placeholder="Nhap lai mat khau moi" />
              </FormField>
            </div>
            <div className="flex justify-end">
              <Button type="submit" variant="secondary" disabled={loading}>Doi mat khau</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>);
}
