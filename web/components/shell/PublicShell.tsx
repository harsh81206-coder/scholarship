"use client";
import Link from "next/link";
import { T } from "@/components/T";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { RoleSwitcher } from "@/components/RoleSwitcher";

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      {/* Gov top strip */}
      <div className="bg-primary-container text-on-primary text-center py-1 font-label-sm text-label-sm">
        <T
          gu="ભારત સરકાર | ગુજરાત સરકાર — સત્તાવાર સ્કૉલરશિપ પોર્ટલ"
          en="Government of India | Government of Gujarat — Official Scholarship Portal"
          hi="भारत सरकार | गुजरात सरकार — आधिकारिक छात्रवृत्ति पोर्टल"
        />
      </div>

      {/* Main nav */}
      <header className="sticky top-0 z-40 bg-surface-container-lowest border-b border-outline-variant shadow-level-1">
        <div className="page-container flex items-center justify-between h-16 gap-4">
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary text-[22px]">school</span>
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-title-md text-title-md text-on-surface leading-tight">
                <T gu="વિદ્યા પ્રગતિ સેતુ" en="Vidya Pragati Setu" hi="विद्या प्रगति सेतु" />
              </span>
              <span className="font-caption text-caption text-on-surface-variant">
                <T gu="ગુજરાત શિષ્યવૃત્તિ પ્લેટફૉર્મ" en="Gujarat Scholarship Platform" hi="गुजरात छात्रवृत्ति मंच" />
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/#schemes" className="font-label-lg text-label-lg text-on-surface-variant hover:text-primary transition-colors">
              <T gu="યોજનાઓ" en="Schemes" hi="योजनाएं" />
            </Link>
            <Link href="/#how" className="font-label-lg text-label-lg text-on-surface-variant hover:text-primary transition-colors">
              <T gu="કેવી રીતે કામ કરે" en="How it Works" hi="कैसे काम करता है" />
            </Link>
            <Link href="/#portals" className="font-label-lg text-label-lg text-on-surface-variant hover:text-primary transition-colors">
              <T gu="પોર્ટલ" en="Portals" hi="पोर्टल" />
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link href="/login" className="btn-cta flex items-center gap-2 px-4 py-2 rounded h-10 text-sm">
              <span className="material-symbols-outlined text-[18px]">login</span>
              <T gu="લૉગિન" en="Login" hi="लॉगिन" />
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-primary-container text-on-primary py-8 mt-12">
        <div className="page-container grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div>
            <p className="font-title-sm mb-2">
              <T gu="વિદ્યા પ્રગતિ સેતુ" en="Vidya Pragati Setu" hi="विद्या प्रगति सेतु" />
            </p>
            <p className="text-on-primary/70 font-body-sm text-body-sm">
              <T
                gu="ગુજરાત સરકાર, શિક્ષણ વિભાગ"
                en="Government of Gujarat, Education Department"
                hi="गुजरात सरकार, शिक्षा विभाग"
              />
            </p>
          </div>
          <div className="text-on-primary/70 font-body-sm text-body-sm">
            <p>Helpline: 1800-233-5500</p>
            <p>Email: support@vps.gujarat.gov.in</p>
          </div>
          <div className="text-on-primary/70 font-caption text-caption">
            <T
              gu="© 2025 ગુજરાત સરકાર. સર્વ હક્કો સુરક્ષિત."
              en="© 2025 Government of Gujarat. All rights reserved."
              hi="© 2025 गुजरात सरकार। सर्वाधिकार सुरक्षित।"
            />
          </div>
        </div>
      </footer>
      <RoleSwitcher />
    </div>
  );
}
