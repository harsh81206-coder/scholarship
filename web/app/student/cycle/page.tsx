"use client";

import { useState } from "react";
import Link from "next/link";
import { StudentShell } from "@/components/shell/StudentShell";
import { T } from "@/components/T";
import { Icon } from "@/components/Icon";
import { StatusChip } from "@/components/ui";
import { Skeleton } from "@/components/states/Skeleton";
import { ErrorState } from "@/components/states/ErrorState";
import { EmptyState } from "@/components/states/EmptyState";
import { ApiModeBadge } from "@/app/student/components/ApiModeBadge";
import { useMyCycle, useMe, useNotifications } from "@/lib/api/hooks";

export default function StudentCycleDeliveryPage() {
  const { data: profile, isLoading: loadingProfile, error: profileError, refetch: refetchProfile } = useMe();
  const { data: cycle, isLoading, error, refetch } = useMyCycle();
  const { data: notifications, isLoading: loadingNotifications, error: notificationsError, refetch: refetchNotifications } = useNotifications();

  const [copiedOtp, setCopiedOtp] = useState(false);
  const [copiedSerial, setCopiedSerial] = useState(false);

  if (isLoading || loadingProfile || loadingNotifications) {
    return (
      <StudentShell>
        <ApiModeBadge />
        <div className="p-4">
          <Skeleton rows={5} />
        </div>
      </StudentShell>
    );
  }

  if (error || profileError || notificationsError) {
    return (
      <StudentShell>
        <ApiModeBadge />
        <div className="p-4">
          <ErrorState error={error ?? profileError ?? notificationsError} onRetry={() => { void refetch(); void refetchProfile(); void refetchNotifications(); }} />
        </div>
      </StudentShell>
    );
  }

  const assigned = Boolean(cycle?.assigned);
  const status = String(cycle?.status ?? "pending");
  const serialNo = String(cycle?.serial_no ?? "");
  const cycleNotice = (notifications ?? []).find((notification) => String(notification.type) === "cycle");
  const otp = cycle?.handover_otp ?? cycle?.otp
    ? String(cycle.handover_otp ?? cycle.otp)
    : String(cycleNotice?.body ?? "").match(/\b\d{6}\b/)?.[0] ?? null;
  const isDelivered = status === "delivered" || status === "handed_over";

  const handleCopyOtp = () => {
    if (!otp) return;
    navigator.clipboard?.writeText(otp);
    setCopiedOtp(true);
    setTimeout(() => setCopiedOtp(false), 2000);
  };

  const handleCopySerial = () => {
    navigator.clipboard?.writeText(serialNo);
    setCopiedSerial(true);
    setTimeout(() => setCopiedSerial(false), 2000);
  };

  return (
    <StudentShell>
      <ApiModeBadge />
      <div className="flex flex-col w-full pb-20">
        <div className="px-4 py-3 bg-surface-container-low border-b border-outline-variant/60 shadow-sm">
          <div className="flex items-center gap-3">
            <Link
              href="/student"
              aria-label="Back to dashboard"
              className="w-10 h-10 rounded-full bg-surface-container hover:bg-surface-container-high text-primary flex items-center justify-center transition-colors shadow-sm shrink-0"
            >
              <Icon name="arrow_back" size={20} />
            </Link>
            <div>
              <h1 className="font-title-md text-on-surface font-bold">
                <T gu="સાયકલ ડિલિવરી (QR / OTP)" en="Cycle Delivery & QR/OTP" hi="साइकिल वितरण (QR / OTP)" />
              </h1>
              <p className="text-xs text-on-surface-variant font-mono">{profile?.cts_id ?? ""}</p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {!assigned ? (
            <EmptyState
              title="No cycle assigned yet"
              description="Once your school receives a bicycle batch and assigns a serial number, your QR & OTP will appear here."
            />
          ) : (
            <>
              <div className="card p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center">
                      <Icon name="pedal_bike" size={22} />
                    </div>
                    <div>
                      <p className="text-xs text-on-surface-variant">
                        <T gu="સીરીયલ નંબર" en="Bicycle Serial No." hi="साइकिल सीरियल नं." />
                      </p>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-sm text-on-surface">{serialNo || "—"}</span>
                        {serialNo && <button type="button" onClick={handleCopySerial} className="text-primary" aria-label="Copy cycle serial">
                          <Icon name={copiedSerial ? "check" : "content_copy"} size={14} />
                        </button>}
                      </div>
                    </div>
                  </div>
                  <StatusChip
                    status={isDelivered ? "approved" : "inprogress"}
                    label={isDelivered ? "Delivered" : status}
                  />
                </div>

                {Boolean(cycle?.batch_code) && (
                  <p className="text-xs text-on-surface-variant">
                    Batch: <span className="font-mono font-semibold">{String(cycle?.batch_code)}</span>
                  </p>
                )}
              </div>

              {isDelivered ? (
                <div className="card p-6 text-center space-y-2 bg-emerald-50 border border-emerald-200">
                  <div className="w-14 h-14 mx-auto rounded-full bg-emerald-600 text-white flex items-center justify-center">
                    <Icon name="check_circle" size={32} />
                  </div>
                  <h2 className="font-title-md font-bold text-emerald-900">
                    <T gu="સાયકલ ડિલિવર થઈ ગઈ છે!" en="Bicycle Delivered!" hi="साइकिल डिलीवर हो गई है!" />
                  </h2>
                  <p className="text-xs text-emerald-800">
                    <T
                      gu="શાળા ખાતે હેન્ડઓવર પૂર્ણ થયું."
                      en="Handover verified at school with OTP & photo."
                      hi="स्कूल में हस्तांतरण सत्यापित हो गया।"
                    />
                  </p>
                </div>
              ) : (
                <div className="card p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-on-surface uppercase tracking-wide">
                      <T gu="હેન્ડઓવર OTP" en="Handover Verification OTP" hi="हस्तांतरण OTP" />
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-2 py-2">
                    {otp ? otp.split("").map((digit, i) => (
                      <span
                        key={i}
                        className="w-10 h-12 rounded-xl bg-surface-container-low border border-outline-variant flex items-center justify-center font-mono text-xl font-extrabold text-primary"
                      >
                        {digit}
                      </span>
                    )) : <p className="text-xs text-on-surface-variant"><T gu="શાળા હેન્ડઓવર સમયે OTP આપશે" en="Your school will provide the OTP at handover" hi="हस्तांतरण के समय स्कूल OTP देगा" /></p>}
                  </div>

                  {otp && <button
                    type="button"
                    onClick={handleCopyOtp}
                    className="w-full py-2.5 rounded-xl bg-primary text-on-primary text-xs font-semibold flex items-center justify-center gap-1.5"
                  >
                    <Icon name={copiedOtp ? "check" : "content_copy"} size={16} />
                    <T gu={copiedOtp ? "OTP કોપી થયો" : "OTP કોપી કરો"} en={copiedOtp ? "OTP Copied!" : "Copy Handover OTP"} hi={copiedOtp ? "OTP कॉपी हुआ" : "OTP कॉपी करें"} />
                  </button>}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </StudentShell>
  );
}
