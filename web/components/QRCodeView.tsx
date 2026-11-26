"use client";

import QRCode from "qrcode";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/states/Skeleton";

export function QRCodeView({ value, label, size = 144 }: { value: string; label: string; size?: number }) {
  const [image, setImage] = useState<string>();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    setImage(undefined);
    setFailed(false);
    QRCode.toDataURL(value, { width: size, margin: 1, errorCorrectionLevel: "M" })
      .then((result) => { if (active) setImage(result); })
      .catch(() => { if (active) setFailed(true); });
    return () => { active = false; };
  }, [size, value]);

  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-outline-variant bg-white p-3">
      {image ? <Image src={image} alt={`QR code for ${label}`} width={size} height={size} unoptimized /> : failed ? <p role="alert" className="text-xs text-error">QR could not be generated.</p> : <Skeleton className="h-36 w-36" />}
      <span className="max-w-full break-all text-center font-mono text-xs text-on-surface">{label}</span>
    </div>
  );
}
