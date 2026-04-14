"use client";

import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

const t = {
  en: {
    privacy: "PRIVACY POLICY",
    terms: "TERMS OF SERVICE",
    shipping: "SHIPPING & RETURNS",
    contact: "CONTACT",
    rights: "ALL RIGHTS RESERVED.",
    brand: "ATELIER ACADEMIC REBEL",
  },
  ge: {
    privacy: "კონფიდენციალურობა",
    terms: "მომსახურების პირობები",
    shipping: "მიწოდება და დაბრუნება",
    contact: "კონტაქტი",
    rights: "ყველა უფლება დაცულია.",
    brand: "ატელიე აკადემიური მეამბოხე",
  },
};

export default function Footer() {
  const pathname = usePathname();
  const { lang } = useLanguage();
  const tr = t[lang];

  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="bg-slate-50 w-full py-12 px-8 border-t border-slate-200">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 w-full max-w-[1920px] mx-auto">
        <div className="text-lg font-bold text-slate-900">{tr.brand}</div>
        <div className="flex flex-wrap justify-center gap-8">
          {[tr.privacy, tr.terms, tr.shipping, tr.contact].map((link) => (
            <a
              key={link}
              href="#"
              className="uppercase text-[10px] tracking-[0.05em] font-medium text-slate-400 hover:text-slate-900 underline transition-opacity opacity-80 hover:opacity-100"
            >
              {link}
            </a>
          ))}
        </div>
        <div className="uppercase text-[10px] tracking-[0.05em] font-medium text-slate-400">
          &copy; {new Date().getFullYear()} {tr.brand}. {tr.rights}
        </div>
      </div>
    </footer>
  );
}
