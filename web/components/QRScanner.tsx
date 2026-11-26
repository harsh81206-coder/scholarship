"use client";

import { useEffect, useId, useRef, useState } from "react";

type Props = { onScan: (value: string) => void; label?: string };
export function QRScanner({ onScan, label = "Scan a QR code" }: Props) {
  const stableId = useId();
  const hostId = useRef(`qr-reader-${stableId.replaceAll(":", "")}`);
  const scanner = useRef<import("html5-qrcode").Html5Qrcode | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [pasteValue, setPasteValue] = useState("");
  const [error, setError] = useState("");
  useEffect(() => () => {
    const activeScanner = scanner.current;
    if (activeScanner) void activeScanner.stop().catch(() => undefined).then(() => activeScanner.clear());
  }, []);
  async function startCamera() {
    setError("");
    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      const instance = scanner.current ?? new Html5Qrcode(hostId.current);
      scanner.current = instance;
      await instance.start({ facingMode: "environment" }, { fps: 8, qrbox: { width: 230, height: 230 } }, (value) => {
        onScan(value);
        void instance.stop().then(() => setCameraActive(false)).catch(() => undefined);
      }, () => undefined);
      setCameraActive(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Camera could not start. Use image upload or paste instead.");
    }
  }
  async function scanImage(file?: File) {
    if (!file) return;
    setError("");
    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      const instance = scanner.current ?? new Html5Qrcode(hostId.current);
      scanner.current = instance;
      const value = await instance.scanFile(file, true);
      onScan(value);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No QR code found in this image.");
    }
  }
  return <section className="space-y-2 rounded-xl border border-outline-variant p-3" aria-label={label}>
    <div className="flex flex-wrap gap-2"><button type="button" onClick={() => cameraActive ? void scanner.current?.stop().then(() => setCameraActive(false)) : void startCamera()} className="rounded-lg border border-outline-variant px-3 py-2 text-xs font-semibold">{cameraActive ? "Stop camera" : "Use camera"}</button><label className="cursor-pointer rounded-lg border border-outline-variant px-3 py-2 text-xs font-semibold">Scan image<input className="sr-only" type="file" accept="image/*" capture="environment" onChange={(event) => void scanImage(event.target.files?.[0])} /></label></div>
    <div id={hostId.current} className={cameraActive ? "max-w-sm overflow-hidden rounded-lg" : "hidden"} />
    <div className="flex gap-2"><input value={pasteValue} onChange={(event) => setPasteValue(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && pasteValue.trim()) { event.preventDefault(); onScan(pasteValue.trim()); setPasteValue(""); } }} className="h-10 min-w-0 flex-1 rounded-lg border border-outline-variant px-3 font-mono text-xs" placeholder="Paste a signed QR payload or serial" /><button type="button" disabled={!pasteValue.trim()} onClick={() => { onScan(pasteValue.trim()); setPasteValue(""); }} className="rounded-lg bg-primary px-3 text-xs font-semibold text-on-primary">Use code</button></div>
    {error && <p role="status" className="text-xs text-error">{error}</p>}
  </section>;
}
