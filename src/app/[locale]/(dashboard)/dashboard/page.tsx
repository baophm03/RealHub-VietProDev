"use client";

import { TrendUp, TrendDown, Buildings, Users, Handshake, UserCircle, ArrowUpRight } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const stats = [
  {
    label: "Tong bat dong san",
    value: "1,247",
    change: "+12.4%",
    trend: "up" as const,
    icon: Buildings,
  },
  {
    label: "Khach hang",
    value: "3,891",
    change: "+8.2%",
    trend: "up" as const,
    icon: Users,
  },
  {
    label: "Leads moi",
    value: "156",
    change: "+23.1%",
    trend: "up" as const,
    icon: UserCircle,
  },
  {
    label: "Giao dich thang",
    value: "42",
    change: "-3.5%",
    trend: "down" as const,
    icon: Handshake,
  },
];

const recentLeads = [
  { name: "Nguyen Van An", phone: "090****567", status: "Moi", statusVariant: "blue" as const, property: "Vinhomes Central Park" },
  { name: "Tran Thi Bich", phone: "098****321", status: "Da lien he", statusVariant: "yellow" as const, property: "Masteri Thao Dien" },
  { name: "Le Minh Chau", phone: "091****890", status: "Quan tam", statusVariant: "purple" as const, property: "Sunwah Pearl" },
  { name: "Pham Quoc Huy", phone: "093****147", status: "Chuyen doi", statusVariant: "green" as const, property: "The Metropole" },
];

const activities = [
  { text: "Le Minh Chau tao lich hen", time: "5 phut truoc" },
  { text: "Deal #042 da duoc duyet", time: "1 gio truoc" },
  { text: "Nguyen Van An them BDS moi", time: "2 gio truoc" },
  { text: "Tran Thi Bich chuyen lead sang 'Quan tam'", time: "3 gio truoc" },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2 animate-fade-up">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
          Tong quan
        </p>
        <h1 className="font-serif text-3xl font-medium tracking-tight md:text-4xl">
          Dashboard
        </h1>
        <p className="text-sm text-foreground-muted leading-relaxed max-w-[60ch]">
          Tong quan hoat dong bat dong san, khach hang va giao dich
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-fade-up-delay-1">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === "up" ? TrendUp : TrendDown;
          return (
            <div
              key={stat.label}
              className="group flex flex-col gap-4 rounded-[1.25rem] border border-border bg-surface p-6 shadow-[0_1px_3px_rgba(42,37,32,0.02),0_8px_24px_-12px_rgba(45,95,63,0.06)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-[2px] hover:shadow-[0_4px_12px_rgba(45,95,63,0.06),0_16px_40px_-12px_rgba(45,95,63,0.12)]"
            >
              <div className="flex items-center justify-between">
                <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10">
                  <Icon size={20} weight="duotone" className="text-primary" />
                </div>
                <span
                  className={`flex items-center gap-1 text-xs font-medium tabular-nums ${
                    stat.trend === "up" ? "text-accent-green-text" : "text-accent-red-text"
                  }`}
                >
                  <TrendIcon size={12} weight="bold" />
                  {stat.change}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-3xl font-semibold tabular-nums tracking-tight">
                  {stat.value}
                </span>
                <span className="text-xs text-foreground-muted">{stat.label}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 animate-fade-up-delay-2">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Leads gan day</CardTitle>
            <a
              href="/leads"
              className="group inline-flex items-center gap-1.5 text-xs font-medium text-foreground-muted transition-colors hover:text-foreground"
            >
              Xem tat ca
              <span className="inline-flex size-5 items-center justify-center rounded-lg bg-surface-muted transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <ArrowUpRight size={10} />
              </span>
            </a>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col divide-y divide-border">
              {recentLeads.map((lead) => (
                <div
                  key={lead.name}
                  className="group flex items-center justify-between py-3.5 first:pt-0 last:pb-0 transition-colors"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium">{lead.name}</span>
                    <span className="text-xs text-foreground-muted tabular-nums">
                      {lead.phone} · {lead.property}
                    </span>
                  </div>
                  <Badge variant={lead.statusVariant}>{lead.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hoat dong</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-5">
              {activities.map((activity, i) => (
                <div key={i} className="flex flex-col gap-0.5 border-l-2 border-border pl-4">
                  <span className="text-sm leading-snug">{activity.text}</span>
                  <span className="text-xs text-foreground-muted tabular-nums">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
