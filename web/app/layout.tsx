import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";
import { DemoBar } from "@/components/DemoBar";
import { ToastContainer } from "@/components/Toast";

const inter = localFont({
  src: "../fonts/inter-latin-wght-normal.woff2",
  weight: "100 900",
  variable: "--font-inter",
  display: "swap",
});

const notoGujarati = localFont({
  src: "../fonts/noto-sans-gujarati-wght-normal.woff2",
  weight: "100 900",
  variable: "--font-noto-gujarati",
  display: "swap",
});

export const metadata: Metadata = {
  title: "વિદ્યા પ્રગતિ સેતુ | Vidya Pragati Setu — Gujarat Scholarship Portal",
  description:
    "Gujarat Government scholarship platform for students — apply for Namo Lakshmi, NMMS, Saraswati Sadhna Cycle and more. Single ID, one-click application, direct DBT to bank.",
  keywords: ["Gujarat scholarship", "Namo Lakshmi", "NMMS", "student portal", "DBT", "vidya pragati setu"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="gu" className={`${inter.variable} ${notoGujarati.variable}`}>
      <body className="font-sans bg-surface text-on-surface antialiased">
        <Providers>
          <DemoBar />
          {children}
          <ToastContainer />
        </Providers>
      </body>
    </html>
  );
}
