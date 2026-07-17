"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const policies = [
  { id: "1", name: "Bao ho 30 ngay", duration: 30, scope: "TAT CA" },
  { id: "2", name: "Bao ho 90 ngay - VIP", duration: 90, scope: "VIP" },
];

const disputes = [
  { id: "1", leadName: "Nguyen Van An", claimant: "Nguyen Van An", defendant: "Tran Thi Bich", status: "PENDING", createdAt: "2025-07-10" },
  { id: "2", leadName: "Le Minh Chau", claimant: "Pham Quoc Huy", defendant: "Hoang Thi Dung", status: "RESOLVED", createdAt: "2025-07-05" },
];

export default function LeadProtectionPage() {
  return (
          <div className="flex flex-col gap-6">
        <PageHeader eyebrow="Cai dat" title="Bao ho lead" description="Chinh sach bao ho lead va xu ly tranh chap" />

        <Tabs defaultValue="policies">
          <TabsList>
            <TabsTrigger value="policies">Chinh sach</TabsTrigger>
            <TabsTrigger value="disputes">Tranh chap</TabsTrigger>
          </TabsList>

          <TabsContent value="policies">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {policies.map((p) => (
                <Card key={p.id}>
                  <CardHeader>
                    <CardTitle>{p.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4 text-sm text-foreground-muted">
                      <span>{p.duration} ngay</span>
                      <Badge variant="blue">{p.scope}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="disputes">
            <div className="flex flex-col gap-3">
              {disputes.map((d) => (
                <Card key={d.id}>
                  <CardContent className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium">Lead: {d.leadName}</span>
                      <span className="text-xs text-foreground-muted">{d.claimant} vs {d.defendant} Â· {d.createdAt}</span>
                    </div>
                    <Badge variant={d.status === "PENDING" ? "yellow" : "green"} className="shrink-0 self-start sm:self-auto">
                      {d.status === "PENDING" ? "Cho xu ly" : "Da giai quyet"}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>  );
}
