"use client";

import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";
import Link from "next/link";

const t = {
  en: {
    title: "YOUR CART",
    items: "ITEMS SELECTED",
    item: "ITEM SELECTED",
    empty: "Your cart is empty",
    remove: "REMOVE",
    subtotal: "SUBTOTAL",
    shipping: "SHIPPING",
    shippingCalc: "CALCULATED AT CHECKOUT",
    total: "TOTAL",
    checkout: "CHECKOUT NOW",
    freeShipping: "COMPLIMENTARY SHIPPING ON ORDERS OVER 250 GEL",
  },
  ge: {
    title: "თქვენი კალათა",
    items: "ნივთი არჩეულია",
    item: "ნივთი არჩეულია",
    empty: "კალათა ცარიელია",
    remove: "წაშლა",
    subtotal: "ჯამი",
    shipping: "მიწოდება",
    shippingCalc: "გადახდისას გამოითვლება",
    total: "სულ",
    checkout: "შეკვეთის გაფორმება",
    freeShipping: "უფასო მიწოდება 250 GEL-ზე მეტ შეკვეთაზე",
  },
};

export default function CartSlideOver() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total } = useCart();
  const { lang } = useLanguage();
  const tr = t[lang];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity"
          onClick={closeCart}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full max-w-lg bg-white z-[100] transform transition-transform duration-300 ease-in-out shadow-[0_0_80px_rgba(0,0,0,0.15)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="px-8 py-10 flex justify-between items-center border-b border-slate-100">
            <div>
              <h3 className="text-2xl font-black tracking-tighter uppercase text-slate-900">{tr.title}</h3>
              <p className="text-[10px] font-bold tracking-widest text-slate-400 mt-1 uppercase">
                {items.length} {items.length === 1 ? tr.item : tr.items}
              </p>
            </div>
            <button onClick={closeCart} className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 rounded-full transition-colors">
              <span className="material-symbols-outlined text-slate-900">close</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-8 py-6 space-y-12">
            {items.length === 0 ? (
              <p className="text-slate-400 text-center mt-20 uppercase tracking-widest text-sm">{tr.empty}</p>
            ) : (
              items.map((item) => (
                <div key={`${item.product.id}-${item.size}`} className="flex gap-6">
                  <div className="w-32 h-40 bg-slate-50 rounded-lg overflow-hidden flex-shrink-0 relative">
                    <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-slate-900 tracking-tight uppercase">{lang === "ge" && item.product.nameGe ? item.product.nameGe : item.product.name}</h4>
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">{item.size}</p>
                      </div>
                      <span className="font-black text-slate-900">{item.product.price}.00 GEL</span>
                    </div>
                    <div className="mt-auto flex justify-between items-center">
                      <div className="flex items-center bg-slate-50 rounded-lg px-2 py-1">
                        <button onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:text-primary transition-colors">
                          <span className="material-symbols-outlined text-sm">remove</span>
                        </button>
                        <span className="px-4 text-sm font-bold text-slate-900">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:text-primary transition-colors">
                          <span className="material-symbols-outlined text-sm">add</span>
                        </button>
                      </div>
                      <button onClick={() => removeItem(item.product.id, item.size)} className="text-[10px] font-black text-slate-400 hover:text-secondary uppercase tracking-widest transition-colors">
                        {tr.remove}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && (
            <div className="px-8 py-10 bg-white border-t border-slate-100">
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400 font-medium uppercase tracking-widest">{tr.subtotal}</span>
                  <span className="text-slate-900 font-bold">{total}.00 GEL</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400 font-medium uppercase tracking-widest">{tr.shipping}</span>
                  <span className="text-slate-900 font-bold">{tr.shippingCalc}</span>
                </div>
                <div className="pt-4 flex justify-between items-end border-t border-slate-50">
                  <span className="text-slate-900 font-black text-lg tracking-tighter uppercase">{tr.total}</span>
                  <span className="text-3xl font-black text-slate-900 tracking-tighter">{total}.00 GEL</span>
                </div>
              </div>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full bg-primary-container text-white py-6 rounded-lg font-black tracking-tight text-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
              >
                {tr.checkout}
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
              <p className="text-center mt-6 text-[10px] text-slate-400 font-bold tracking-[0.1em] uppercase">{tr.freeShipping}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
