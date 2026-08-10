"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const policies = [
  { id: "1", name: "Mask SÄT cho Sales", entity: "LEAD", rules: 3, active: true },
  { id: "2", name: "An gia cho Collaborator", entity: "PROPERTY", rules: 2, active: true },
  { id: "3", name: "An dia chi cho Public", entity: "PROPERTY", rules: 4, active: false },
];

export default function VisibilityPoliciesPage() {
  return (
          <div className="flex flex-col gap-6">
        <PageHeader eyebrow="Cai dat" title="Chinh sach hien thi" description="An/mask du lieu theo role va context" />
        <div className="flex flex-col gap-3">
          {policies.map((policy) => (
            <Card key={policy.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium">{policy.name}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="blue">{policy.entity}</Badge>
                    <span className="text-xs text-foreground-muted">{policy.rules} rules</span>
                  </div>
                </div>
                <Badge variant={policy.active ? "green" : "default"}>
                  {policy.active ? "Hoat dong" : "Tat"}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>  );
}
