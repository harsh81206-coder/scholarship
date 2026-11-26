"use client";

import { useState } from "react";
import Link from "next/link";
import { StudentShell } from "@/components/shell/StudentShell";
import { T } from "@/components/T";
import { Icon } from "@/components/Icon";
import { Skeleton } from "@/components/states/Skeleton";
import { ErrorState } from "@/components/states/ErrorState";
import { EmptyState } from "@/components/states/EmptyState";
import { ApiModeBadge } from "@/app/student/components/ApiModeBadge";
import { useAppStore } from "@/lib/store";
import { useNotifications, useReadNotification, useReadAllNotifications } from "@/lib/api/hooks";

export default function StudentNotificationsPage() {
  const lang = useAppStore((s) => s.lang);
  const showSuccess = useAppStore((s) => s.showSuccess);
  const showError = useAppStore((s) => s.showError);
  const { data, isLoading, error, refetch } = useNotifications();
  const readOne = useReadNotification();
  const readAll = useReadAllNotifications();
  const [filter, setFilter] = useState<"all" | "unread">("all");

  if (isLoading) {
    return (
      <StudentShell>
        <ApiModeBadge />
        <div className="p-4">
          <Skeleton rows={5} />
        </div>
      </StudentShell>
    );
  }

  if (error) {
    return (
      <StudentShell>
        <ApiModeBadge />
        <div className="p-4">
          <ErrorState error={error} onRetry={() => void refetch()} />
        </div>
      </StudentShell>
    );
  }

  const list = Array.isArray(data) ? data : [];
  const filtered = filter === "unread" ? list.filter((n) => !n.read) : list;
  const unreadCount = list.filter((n) => !n.read).length;

  async function handleReadAll() {
    try {
      await readAll.mutateAsync();
      showSuccess("All notifications marked as read");
    } catch (error) {
      showError(error instanceof Error ? error.message : "Could not update notifications");
    }
  }

  return (
    <StudentShell>
      <ApiModeBadge />
      <div className="px-4 py-3 space-y-4 pb-24">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Link href="/student" className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
              <Icon name="arrow_back" size={20} />
            </Link>
            <div>
              <h1 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                <T gu="સૂચનાઓ" en="Notifications" hi="सूचनाएं" />
              </h1>
              <p className="text-xs text-on-surface-variant">{unreadCount} unread</p>
            </div>
          </div>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleReadAll}
              disabled={readAll.isPending}
              className="text-xs font-semibold text-primary hover:underline"
            >
              <T gu="બધી વાંચેલી કરો" en="Mark all read" hi="सभी को पढ़ा चिह्नित करें" />
            </button>
          )}
        </div>

        <div className="flex gap-2">
          {(["all", "unread"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setFilter(t)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize ${
                filter === t ? "bg-primary text-on-primary" : "bg-surface-container-low text-on-surface-variant"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <EmptyState title="No notifications" description="You are all caught up." />
        ) : (
          <div className="space-y-2.5">
            {filtered.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => { if (!n.read) readOne.mutate(n.id, { onError: (error) => showError(error.message) }); }}
                aria-label={`${n.read ? "Read" : "Mark as read"}: ${String(n.title_en)}`}
                className={`w-full text-left rounded-2xl p-3.5 border transition-all ${
                  n.read
                    ? "bg-surface-container-lowest border-outline-variant"
                    : "bg-blue-50/60 border-primary/30 shadow-xs"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-on-surface">
                      {lang === "gu" ? String(n.title_gu ?? n.title_en) : lang === "hi" ? String(n.title_hi ?? n.title_en) : n.title_en}
                    </p>
                    <p className="text-xs text-on-surface-variant mt-1">{String(n.body ?? "")}</p>
                  </div>
                  {!n.read && <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0 mt-1" />}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </StudentShell>
  );
}
