"use client";

import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Bell, CheckCheck, Inbox, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  getGetApiNotificationsQueryKey,
  getGetApiUnreadNotificationCountQueryKey,
  useGetApiNotifications,
  useGetApiUnreadNotificationCount,
  usePatchApiMarkNotificationRead,
  usePostApiMarkAllNotificationsRead,
} from "@/lib/api/endpoints/notifications";
import { cn } from "@/lib/utils";

type UnknownRecord = Record<string, unknown>;

interface NotificationItem {
  id: string;
  title: string;
  body?: string;
  createdAt?: string;
  isRead: boolean;
}

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(record: UnknownRecord, ...keys: string[]) {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value;
  }
  return undefined;
}

function extractNotificationItems(value: unknown): NotificationItem[] {
  const list = Array.isArray(value)
    ? value
    : isRecord(value) && Array.isArray(value.data)
      ? value.data
      : isRecord(value) && Array.isArray(value.items)
        ? value.items
        : isRecord(value) && isRecord(value.data) && Array.isArray(value.data.items)
          ? value.data.items
          : [];

  return list.flatMap((item) => {
    if (!isRecord(item) || typeof item.id !== "string") return [];

    const status = readString(item, "status")?.toUpperCase();
    const isRead = item.isRead === true || item.readAt != null || status === "READ";

    return [{
      id: item.id,
      title: readString(item, "title", "subject", "type") ?? "Thông báo mới",
      body: readString(item, "body", "message", "content", "description"),
      createdAt: readString(item, "createdAt", "sentAt", "updatedAt"),
      isRead,
    }];
  });
}

function extractUnreadCount(value: unknown): number {
  if (typeof value === "number") return value;
  if (!isRecord(value)) return 0;

  const count = value.count ?? value.unreadCount;
  if (typeof count === "number") return count;
  if (isRecord(value.data)) return extractUnreadCount(value.data);

  return 0;
}

function formatNotificationTime(value?: string) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function NotificationMenu() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: unreadCountRaw } = useGetApiUnreadNotificationCount({
    query: {
      refetchInterval: 60_000,
      refetchIntervalInBackground: false,
    },
  });
  const unreadCount = extractUnreadCount(unreadCountRaw);

  const {
    data: notificationsRaw,
    isFetching: isLoadingNotifications,
    isError: isNotificationsError,
    refetch: refetchNotifications,
  } = useGetApiNotifications(undefined, {
    query: {
      enabled: open,
      refetchOnWindowFocus: false,
    },
  });
  const notifications = useMemo(
    () => extractNotificationItems(notificationsRaw),
    [notificationsRaw],
  );

  const refreshNotificationData = () => {
    void queryClient.invalidateQueries({ queryKey: getGetApiNotificationsQueryKey() });
    void queryClient.invalidateQueries({
      queryKey: getGetApiUnreadNotificationCountQueryKey(),
    });
  };

  const { mutate: markAsRead, isPending: isMarkingAsRead } =
    usePatchApiMarkNotificationRead({
      mutation: { onSuccess: refreshNotificationData },
    });
  const { mutate: markAllAsRead, isPending: isMarkingAllAsRead } =
    usePostApiMarkAllNotificationsRead({
      mutation: { onSuccess: refreshNotificationData },
    });

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label={
              unreadCount > 0
                ? `Thông báo, ${unreadCount} chưa đọc`
                : "Thông báo"
            }
          />
        }
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span
            aria-hidden="true"
            className="absolute -right-0.5 -top-0.5 flex min-w-4 h-4 px-1 items-center justify-center rounded-full bg-accent-red text-[10px] font-semibold tabular-nums text-accent-red-text ring-2 ring-surface"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="z-20 mt-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-border bg-surface p-0 shadow-[0_12px_40px_-12px_rgba(26,22,20,0.12)]"
      >
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-sm font-semibold">Thông báo</p>
            {unreadCount > 0 && (
              <p className="text-xs text-foreground-muted">
                {unreadCount} chưa đọc
              </p>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="xs"
              disabled={isMarkingAllAsRead}
              onClick={() => markAllAsRead()}
              className="text-xs text-foreground-muted hover:text-foreground"
            >
              <CheckCheck size={14} />
              Đọc hết
            </Button>
          )}
        </div>
        <DropdownMenuSeparator className="m-0" />

        <div className="max-h-[min(28rem,calc(100dvh-7rem))] overflow-y-auto" aria-busy={isLoadingNotifications}>
          {isLoadingNotifications ? (
            <div className="space-y-3 p-4" aria-label="Đang tải thông báo">
              {[0, 1, 2].map((item) => (
                <div key={item} className="animate-pulse space-y-2">
                  <div className="h-3 w-3/4 rounded bg-border/50" />
                  <div className="h-3 w-full rounded bg-border/30" />
                </div>
              ))}
            </div>
          ) : isNotificationsError ? (
            <div className="flex flex-col items-center gap-3 px-4 py-10 text-center">
              <p className="text-sm font-medium">Không thể tải thông báo</p>
              <Button variant="outline" size="sm" onClick={() => refetchNotifications()}>
                <RefreshCw size={14} />
                Thử lại
              </Button>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-4 py-10 text-center text-foreground-muted">
              <Inbox size={22} aria-hidden="true" />
              <p className="text-sm font-medium text-foreground">Chưa có thông báo</p>
              <p className="text-xs">Thông báo mới sẽ xuất hiện tại đây.</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                disabled={isMarkingAsRead}
                onClick={() => {
                  if (!notification.isRead) markAsRead({ id: notification.id });
                }}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-none px-4 py-3 text-left hover:bg-surface-muted focus:bg-surface-muted",
                  !notification.isRead && "bg-accent-blue/30",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "mt-1.5 size-1.5 shrink-0 rounded-full",
                    notification.isRead ? "bg-border-strong" : "bg-accent-blue-text",
                  )}
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-foreground">
                    {notification.title}
                  </span>
                  {notification.body && (
                    <span className="mt-0.5 block line-clamp-2 text-xs leading-relaxed text-foreground-muted">
                      {notification.body}
                    </span>
                  )}
                  {notification.createdAt && (
                    <span className="mt-1 block font-mono text-[10px] text-foreground-muted">
                      {formatNotificationTime(notification.createdAt)}
                    </span>
                  )}
                </span>
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
