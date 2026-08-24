"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navGroups } from "./nav.config";
import { ability } from "@/config/casl/ability";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-border bg-surface h-full">
      <Link href="/" className="flex h-16 items-center px-6">
        <span className="font-serif text-xl font-semibold tracking-tight text-foreground">
          RealHub
        </span>
      </Link>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-6">
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground-muted/60">
              {group.label}
            </p>
            <ul className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                const hasAccess = !item.permission || ability.can(item.permission.action, item.permission.subject);
                if (!hasAccess) return null;

                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-foreground-muted hover:bg-surface-muted/60 hover:text-foreground"
                      )}
                    >
                      <Icon
                        size={18}
                        className={cn(
                          "transition-transform duration-300",
                          isActive ? "" : "group-hover:scale-110"
                        )}
                      />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
