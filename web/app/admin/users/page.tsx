"use client";

import { useState } from "react";
import { T } from "@/components/T";
import { EmptyState } from "@/components/states/EmptyState";
import { ErrorState } from "@/components/states/ErrorState";
import { Skeleton } from "@/components/states/Skeleton";
import { OfficerShell } from "@/components/shell/OfficerShell";
import { useAdminUsers, useSetAdminUserActive } from "@/lib/api/hooks";
import { useAppStore } from "@/lib/store";

type User = { id: number; officer_id: string; name: string; role: string; is_active: boolean };
export default function Page() {
  const query = useAdminUsers(); const toggle = useSetAdminUserActive(); const [busy, setBusy] = useState<number | null>(null); const showError = useAppStore((s) => s.showError);
  const users = (query.data?.items ?? []) as User[];
  async function setActive(user: User) { setBusy(user.id); try { await toggle.mutateAsync({ id: user.id, is_active: !user.is_active }); } catch (error) { showError(error instanceof Error ? error.message : "Update failed"); } finally { setBusy(null); } }
  return <OfficerShell role="admin"><main className="mx-auto max-w-6xl space-y-5 p-5"><header><p className="font-label-sm text-primary">ACCESS CONTROL</p><h1 className="mt-1 font-headline-md text-on-surface"><T gu="અધિકારી વપરાશકર્તાઓ" en="Officer users" hi="अधिकारी उपयोगकर्ता" /></h1><p className="mt-1 text-sm text-on-surface-variant"><T gu="ડેમો એકાઉન્ટ્સ અને તેમની સક્રિય સ્થિતિ." en="Demo accounts and their access status." hi="डेमो खाते और उनकी पहुंच स्थिति।" /></p></header>{query.isLoading ? <Skeleton rows={6} /> : query.isError ? <ErrorState error={query.error} onRetry={() => void query.refetch()} /> : users.length === 0 ? <EmptyState title="No officer accounts" description="No users were returned by the API." /> : <div className="overflow-x-auto rounded-xl border border-outline-variant bg-surface-container-lowest"><table className="min-w-full text-left text-sm"><thead className="bg-surface-container-low text-xs uppercase text-on-surface-variant"><tr><th className="px-4 py-3">Officer</th><th className="px-4 py-3">User ID</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Action</th></tr></thead><tbody>{users.map((user) => <tr key={user.id} className="border-t border-outline-variant/60"><td className="px-4 py-3 font-medium">{user.name}</td><td className="px-4 py-3 font-mono text-xs">{user.officer_id}</td><td className="px-4 py-3 capitalize">{user.role}</td><td className="px-4 py-3">{user.is_active ? "Active" : "Disabled"}</td><td className="px-4 py-3"><button disabled={busy === user.id} onClick={() => void setActive(user)} className="rounded-lg border border-outline-variant px-3 py-1.5 text-xs">{user.is_active ? "Disable" : "Enable"}</button></td></tr>)}</tbody></table></div>}</main></OfficerShell>;
}
