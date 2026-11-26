"use client";

import React, { useState } from "react";
import { MobileShell } from "@/components/shell/MobileShell";
import { T } from "@/components/T";
import { Icon } from "@/components/Icon";
import { StatusChip } from "@/components/ui";
import { Skeleton } from "@/components/states/Skeleton";
import { ErrorState } from "@/components/states/ErrorState";
import { EmptyState } from "@/components/states/EmptyState";
import { useAppStore } from "@/lib/store";
import { useCycleOverview, useReceiveBatch, useHandover } from "@/lib/api/hooks";

export default function SchoolCycleReceiveHandoverPage() {
  const showSuccess = useAppStore((s) => s.showSuccess);
  const showError = useAppStore((s) => s.showError);
  const lang = useAppStore((s) => s.lang);

  const { data: overview, isLoading, error, refetch } = useCycleOverview();
  const receiveBatch = useReceiveBatch();
  const handover = useHandover();

  const [tab, setTab] = useState<"receive" | "handover">("receive");
  const [batchIdInput, setBatchIdInput] = useState("1");
  const [receivedQty, setReceivedQty] = useState("10");
  const [scannedSerials, setScannedSerials] = useState("");

  const [studentCts, setStudentCts] = useState("GJ-AND-2026-004512");
  const [studentId, setStudentId] = useState("1");
  const [serialNo, setSerialNo] = useState("SSB-2026-700000");
  const [otpInput, setOtpInput] = useState("");
  const [handoverStarted, setHandoverStarted] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  if (isLoading) {
    return (
      <MobileShell role="school">
        <div className="p-4">
          <Skeleton rows={4} />
        </div>
      </MobileShell>
    );
  }

  if (error) {
    return (
      <MobileShell role="school">
        <div className="p-4">
          <ErrorState error={error} onRetry={() => void refetch()} />
        </div>
      </MobileShell>
    );
  }

  const batches = Array.isArray(overview?.batches) ? (overview.batches as Array<Record<string, unknown>>) : [];
  const emptyBatchCopy = {
    gu: { title: "હજુ કોઈ સાયકલ બેચ નથી", description: "વેન્ડર દ્વારા મોકલેલા બેચ અહીં દેખાશે." },
    en: { title: "No cycle batches yet", description: "Dispatched vendor batches will appear here." },
    hi: { title: "अभी कोई साइकिल बैच नहीं", description: "विक्रेता द्वारा भेजे गए बैच यहां दिखाई देंगे।" },
  }[lang];

  async function handleReceive(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await receiveBatch.mutateAsync({
        id: Number(batchIdInput),
        input: {
          received_qty: Number(receivedQty),
          scanned_serials: scannedSerials.split(/[\n,\s]+/).map((value) => value.trim()).filter(Boolean),
        },
      });
      const mismatch = Boolean(res.mismatch);
      showSuccess(
        mismatch
          ? `Batch #${batchIdInput} received with quantity mismatch alert!`
          : `Batch #${batchIdInput} received (${receivedQty} cycles)`
      );
      void refetch();
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to receive batch");
    }
  }

  async function handleInitiateHandover() {
    try {
      const res = await handover.mutateAsync({
        action: "initiate",
        input: { student_id: Number(studentId), cycle_serial: serialNo },
      });
      setHandoverStarted(true);
      if (typeof res.demo_otp === "string") setOtpInput(res.demo_otp);
      showSuccess(`Handover OTP sent to ${studentCts}`);
    } catch (err) {
      showError(err instanceof Error ? err.message : "Could not initiate handover");
    }
  }

  async function handleConfirmHandover(e: React.FormEvent) {
    e.preventDefault();
    try {
      await handover.mutateAsync({
        action: "confirm",
        input: {
          cycle_serial: serialNo,
          otp: otpInput,
          ...(location ? { lat: location.lat, lng: location.lng } : {}),
        },
      });
      showSuccess(`Cycle ${serialNo} handed over to ${studentCts}!`);
      setHandoverStarted(false);
      void refetch();
    } catch (err) {
      showError(err instanceof Error ? err.message : "Handover confirmation failed");
    }
  }

  function captureLocation() {
    if (!navigator.geolocation) {
      showError("Location is not available in this browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => setLocation({ lat: coords.latitude, lng: coords.longitude }),
      (geoError) => showError(geoError.message || "Could not capture location"),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  return (
    <MobileShell role="school">
      <div className="px-4 py-3 space-y-4 pb-24">
        <div>
          <h1 className="font-headline-sm text-headline-sm font-bold text-on-surface">
            <T gu="સાયકલ રિસીવ અને હેન્ડઓવર" en="Cycle Receive & Handover" hi="साइकिल प्राप्ति और हस्तांतरण" />
          </h1>
          <p className="text-xs text-on-surface-variant">
            Ordered: {String(overview?.ordered ?? 0)} • Dispatched: {String(overview?.dispatched ?? 0)} • Delivered:{" "}
            {String(overview?.delivered ?? 0)}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setTab("receive")}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold ${
              tab === "receive" ? "bg-primary text-on-primary" : "bg-surface-container-low text-on-surface-variant"
            }`}
          >
            <T gu="બેચ રિસીવ" en="Receive Batch" hi="बैच प्राप्त करें" />
          </button>
          <button
            type="button"
            onClick={() => setTab("handover")}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold ${
              tab === "handover" ? "bg-primary text-on-primary" : "bg-surface-container-low text-on-surface-variant"
            }`}
          >
            <T gu="વિદ્યાર્થી હેન્ડઓવર" en="Student Handover" hi="छात्र हस्तांतरण" />
          </button>
        </div>

        {tab === "receive" ? (
          <div className="space-y-4">
            <form onSubmit={handleReceive} className="card p-4 space-y-3">
              <h2 className="text-sm font-bold text-on-surface">Receive Vendor Batch</h2>
              <div>
                <label className="block text-xs text-on-surface-variant mb-1">Batch ID</label>
                <input
                  type="number"
                  value={batchIdInput}
                  onChange={(e) => setBatchIdInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-on-surface-variant mb-1">Received Quantity</label>
                <input
                  type="number"
                  value={receivedQty}
                  onChange={(e) => setReceivedQty(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-on-surface-variant mb-1">
                  <T gu="સ્કેન કરેલા સાયકલ સીરીયલ" en="Scanned cycle serials" hi="स्कैन किए गए साइकिल सीरियल" />
                </label>
                <textarea
                  value={scannedSerials}
                  onChange={(e) => setScannedSerials(e.target.value)}
                  rows={3}
                  placeholder={{
                    gu: "દરેક સીરીયલ નવી લાઇનમાં પેસ્ટ કરો અથવા કોમાથી અલગ કરો",
                    en: "Paste one serial per line, or separate serials with commas",
                    hi: "हर सीरियल नई पंक्ति में पेस्ट करें या कॉमा से अलग करें",
                  }[lang]}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface text-sm font-mono"
                />
              </div>
              <button
                type="submit"
                disabled={receiveBatch.isPending || !Number(batchIdInput) || Number(receivedQty) < 0 || !scannedSerials.trim()}
                className="w-full py-2.5 rounded-xl bg-primary text-on-primary text-xs font-semibold"
              >
                Confirm Batch Receipt
              </button>
            </form>

            {batches.length > 0 ? (
              <div className="card p-4 space-y-2">
                <h3 className="text-xs font-bold text-on-surface-variant uppercase">Recent Batches</h3>
                {batches.map((b) => (
                  <div key={String(b.id)} className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low text-xs">
                    <span className="font-mono font-semibold">
                      #{String(b.id)} • {String(b.batch_code ?? "")} ({String(b.qty ?? 0)})
                    </span>
                    <StatusChip status={b.status === "received" ? "approved" : "inprogress"} label={String(b.status ?? "")} />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title={emptyBatchCopy.title} description={emptyBatchCopy.description} />
            )}
          </div>
        ) : (
          <form onSubmit={handleConfirmHandover} className="card p-4 space-y-3">
            <h2 className="text-sm font-bold text-on-surface">Student Bicycle Handover</h2>
            <div>
              <label className="block text-xs text-on-surface-variant mb-1">Student CTS ID</label>
              <input
                type="text"
                value={studentCts}
                onChange={(e) => setStudentCts(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs text-on-surface-variant mb-1">
                <T gu="વિદ્યાર્થી રેકોર્ડ ID" en="Student record ID" hi="छात्र रिकॉर्ड ID" />
              </label>
              <input
                type="number"
                min={1}
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs text-on-surface-variant mb-1">Bicycle Serial No.</label>
              <input
                type="text"
                value={serialNo}
                onChange={(e) => setSerialNo(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface text-sm font-mono"
              />
            </div>
            <button
              type="button"
              onClick={handleInitiateHandover}
              disabled={handover.isPending || !Number(studentId) || !serialNo.trim()}
              className="w-full py-2 rounded-xl bg-surface-container text-primary text-xs font-semibold flex items-center justify-center gap-1"
            >
              <Icon name="sms" size={16} />
              Send Handover OTP to Student
            </button>

            <div>
              <label className="block text-xs text-on-surface-variant mb-1">Student Handover OTP</label>
              <input
                type="text"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                placeholder={{ gu: "વિદ્યાર્થીનો OTP દાખલ કરો", en: "Enter OTP from the student", hi: "छात्र से मिला OTP दर्ज करें" }[lang]}
                className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface text-sm font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={handover.isPending || !handoverStarted || !otpInput.trim()}
              className="w-full py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold"
            >
              {handoverStarted ? (
                <T gu="OTP ચકાસો અને હેન્ડઓવર પૂર્ણ કરો" en="Verify OTP & Complete Handover" hi="OTP सत्यापित कर हस्तांतरण पूरा करें" />
              ) : (
                <T gu="હેન્ડઓવર પુષ્ટિ કરો" en="Confirm Handover" hi="हस्तांतरण की पुष्टि करें" />
              )}
            </button>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-on-surface-variant">
                {location
                  ? `${{ gu: "સ્થાન મળ્યું", en: "Location captured", hi: "स्थान मिला" }[lang]} (${location.lat.toFixed(4)}, ${location.lng.toFixed(4)})`
                  : { gu: "વૈકલ્પિક: વર્તમાન સ્થાન જોડો", en: "Optional: attach current location", hi: "वैकल्पिक: वर्तमान स्थान जोड़ें" }[lang]}
              </span>
              <button type="button" onClick={captureLocation} className="px-3 py-1.5 rounded-lg border border-outline-variant text-xs font-semibold">
                <T gu="સ્થાન મેળવો" en="Capture Location" hi="स्थान प्राप्त करें" />
              </button>
            </div>
          </form>
        )}
      </div>
    </MobileShell>
  );
}
