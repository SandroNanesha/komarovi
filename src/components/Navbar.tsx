"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

export default function Navbar() {
  const { openCart, itemCount } = useCart();
  const { openAccount, user } = useAuth();
  const pathname = usePathname();
  const { lang, toggleLang } = useLanguage();

  if (pathname.startsWith("/admin")) return null;

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl">
      <div className="flex justify-between items-center w-full px-8 py-6 max-w-[1920px] mx-auto">
        <Link
          href="/"
          className="text-2xl font-black tracking-tighter text-slate-900 uppercase"
        >
          {lang === "ge" ? "ატელიე" : "ATELIER"}
        </Link>

        <div className="flex items-center gap-6">
          <button
            onClick={toggleLang}
            className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors border border-slate-200 px-3 py-1.5 rounded-lg"
          >
            {lang === "en" ? "GE" : "EN"}
          </button>
          <button
            onClick={openCart}
            className="relative scale-95 transition-transform duration-150 hover:text-blue-500"
          >
            <span className="material-symbols-outlined text-on-surface">
              shopping_bag
            </span>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary-container text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {itemCount}
              </span>
            )}
          </button>
          <button
            onClick={openAccount}
            className="relative scale-95 transition-transform duration-150 hover:text-blue-500"
          >
            <span className="material-symbols-outlined text-on-surface">
              person
            </span>
            {user && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
