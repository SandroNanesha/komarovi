"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";
import Link from "next/link";

const translations = {
  en: {
    secure: "SECURE CHECKOUT",
    title: "SHIPPING & PAYMENT",
    step1: "01. CREATE ACCOUNT",
    step1Done: "01. ACCOUNT",
    contact: "02. SHIPPING ADDRESS",
    payment: "03. PAYMENT METHOD",
    fullName: "FULL NAME",
    email: "EMAIL",
    phone: "PHONE NUMBER",
    password: "PASSWORD",
    registerTab: "REGISTER",
    loginTab: "LOG IN",
    registerBtn: "CONTINUE TO SHIPPING",
    loginBtn: "LOG IN",
    switchToLogin: "Already have an account? Log in",
    switchToRegister: "Don't have an account? Register",
    loginError: "Invalid email or password",
    registerError: "Email already registered",
    loggedAs: "Logged in as",
    changeAccount: "Change account",
    street: "STREET ADDRESS",
    city: "CITY",
    zip: "ZIP CODE",
    country: "COUNTRY",
    complete: "COMPLETE PURCHASE",
    processing: "PROCESSING...",
    orderSummary: "ORDER SUMMARY",
    itemsInCart: "ITEMS IN CART",
    subtotal: "SUBTOTAL",
    shipping: "SHIPPING",
    free: "FREE",
    taxes: "TAXES",
    total: "TOTAL",
    orderPlaced: "Order Placed",
    orderMsg: "Thank you! You will be redirected to Keepz for payment.",
    orderTrack: "You can track your order status in your account.",
    backHome: "Back to Home",
    emptyCart: "Your cart is empty",
    continueShopping: "Continue shopping",
    sizeLabel: "SIZE",
    qtyLabel: "QTY",
    expressPay: "EXPRESS PAY",
    secureVia: "SECURE CHECKOUT VIA KEEPZ",
  },
  ge: {
    secure: "უსაფრთხო გადახდა",
    title: "მიწოდება და გადახდა",
    step1: "01. ანგარიშის შექმნა",
    step1Done: "01. ანგარიში",
    contact: "02. მიწოდების მისამართი",
    payment: "03. გადახდის მეთოდი",
    fullName: "სრული სახელი",
    email: "ელ. ფოსტა",
    phone: "ტელეფონის ნომერი",
    password: "პაროლი",
    registerTab: "რეგისტრაცია",
    loginTab: "შესვლა",
    registerBtn: "გაგრძელება მიწოდებაზე",
    loginBtn: "შესვლა",
    switchToLogin: "უკვე გაქვთ ანგარიში? შედით",
    switchToRegister: "არ გაქვთ ანგარიში? დარეგისტრირდით",
    loginError: "არასწორი ელ. ფოსტა ან პაროლი",
    registerError: "ეს ელ. ფოსტა უკვე რეგისტრირებულია",
    loggedAs: "შესული ხართ როგორც",
    changeAccount: "ანგარიშის შეცვლა",
    street: "ქუჩის მისამართი",
    city: "ქალაქი",
    zip: "საფოსტო კოდი",
    country: "ქვეყანა",
    complete: "შეკვეთის დასრულება",
    processing: "მუშავდება...",
    orderSummary: "შეკვეთის შეჯამება",
    itemsInCart: "ნივთი კალათაში",
    subtotal: "ჯამი",
    shipping: "მიწოდება",
    free: "უფასო",
    taxes: "გადასახადი",
    total: "სულ",
    orderPlaced: "შეკვეთა გაფორმებულია",
    orderMsg: "გმადლობთ! თქვენ გადამისამართდებით Keepz-ზე გადახდისთვის.",
    orderTrack: "შეკვეთის სტატუსის თვალყურის დევნება შეგიძლიათ თქვენს ანგარიშში.",
    backHome: "მთავარ გვერდზე",
    emptyCart: "კალათა ცარიელია",
    continueShopping: "განაგრძეთ ყიდვა",
    sizeLabel: "ზომა",
    qtyLabel: "რაოდ.",
    expressPay: "სწრაფი გადახდა",
    secureVia: "უსაფრთხო გადახდა KEEPZ-ით",
  },
};

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const { user, register, login, logout, addOrder } = useAuth();
  const { lang } = useLanguage();
  const t = translations[lang];

  const [authMode, setAuthMode] = useState<"register" | "login">("register");
  const [authForm, setAuthForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [authError, setAuthError] = useState("");

  const [form, setForm] = useState({
    street: "",
    city: "",
    zip: "",
    country: lang === "ge" ? "საქართველო" : "Georgia",
  });
  const [submitting, setSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    let ok = false;
    if (authMode === "register") {
      ok = register(authForm.name, authForm.email, authForm.phone, authForm.password);
      if (!ok) setAuthError(t.registerError);
    } else {
      ok = login(authForm.email, authForm.password);
      if (!ok) setAuthError(t.loginError);
    }
    // Stay on checkout after auth — no redirect
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0 || !user) return;
    setSubmitting(true);

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((item) => ({
          productId: item.product.id,
          name: item.product.name,
          price: item.product.price,
          size: item.size,
          quantity: item.quantity,
        })),
        total,
        customer: {
          name: user.name,
          phone: user.phone,
          address: `${form.street}, ${form.city} ${form.zip}, ${form.country}`,
        },
      }),
    });

    const data = await res.json();

    if (data.success) {
      addOrder({
        id: data.orderId,
        items: items.map((item) => ({
          name: item.product.name,
          size: item.size,
          qty: item.quantity,
          price: item.product.price,
        })),
        total,
        status: "pending",
        date: new Date().toISOString().split("T")[0],
      });
      setOrderPlaced(true);
      clearCart();
    }

    setSubmitting(false);
  };

  // --- Order placed ---
  if (orderPlaced) {
    return (
      <div className="max-w-lg mx-auto px-6 py-24 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <span className="material-symbols-outlined text-4xl text-green-600">check_circle</span>
        </div>
        <h1 className="text-5xl font-black tracking-tighter uppercase">{t.orderPlaced}</h1>
        <p className="text-outline mt-4 text-sm uppercase tracking-widest">{t.orderMsg}</p>
        <p className="text-primary mt-2 text-sm font-medium">{t.orderTrack}</p>
        <Link href="/" className="inline-block mt-10 bg-primary-container text-white px-10 py-5 rounded-lg font-bold uppercase tracking-widest text-sm hover:brightness-110 transition-all">
          {t.backHome}
        </Link>
      </div>
    );
  }

  // --- Empty cart ---
  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-6 py-24 text-center">
        <h1 className="text-4xl font-black uppercase tracking-tighter">{t.emptyCart}</h1>
        <Link href="/" className="inline-block mt-6 text-sm text-primary font-bold uppercase tracking-widest underline">
          {t.continueShopping}
        </Link>
      </div>
    );
  }

  const tax = Math.round(total * 0.08 * 100) / 100;
  const grandTotal = total + tax;

  return (
    <div className="px-8 max-w-[1920px] mx-auto min-h-screen pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
        {/* Left Column */}
        <div className="lg:col-span-3 space-y-12">
          <header className="space-y-2">
            <span className="uppercase text-[10px] tracking-[0.05em] font-medium text-primary">{t.secure}</span>
            <h1 className="text-6xl font-black tracking-[-0.04em] text-on-surface leading-none">{t.title}</h1>
          </header>

          {/* STEP 1: Account */}
          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-outline-variant opacity-20" />
              <span className="uppercase text-[12px] tracking-widest font-bold text-outline">
                {user ? t.step1Done : t.step1}
              </span>
              <div className="h-px flex-1 bg-outline-variant opacity-20" />
            </div>

            {user ? (
              /* Logged in confirmation */
              <div className="bg-green-50 border border-green-100 rounded-xl p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-green-700">check</span>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.email} &middot; {user.phone}</p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors"
                >
                  {t.changeAccount}
                </button>
              </div>
            ) : (
              /* Register / Login form */
              <div className="bg-surface-container-low rounded-xl p-8">
                {/* Tabs */}
                <div className="flex border-b border-outline-variant/30 mb-6">
                  <button
                    onClick={() => { setAuthMode("register"); setAuthError(""); }}
                    className={`flex-1 pb-3 text-sm font-black uppercase tracking-widest transition-colors ${
                      authMode === "register"
                        ? "text-slate-900 border-b-2 border-slate-900"
                        : "text-slate-400"
                    }`}
                  >
                    {t.registerTab}
                  </button>
                  <button
                    onClick={() => { setAuthMode("login"); setAuthError(""); }}
                    className={`flex-1 pb-3 text-sm font-black uppercase tracking-widest transition-colors ${
                      authMode === "login"
                        ? "text-slate-900 border-b-2 border-slate-900"
                        : "text-slate-400"
                    }`}
                  >
                    {t.loginTab}
                  </button>
                </div>

                <form onSubmit={handleAuth} className="space-y-4">
                  {authMode === "register" && (
                    <>
                      <div className="space-y-1">
                        <label className="uppercase font-bold tracking-widest text-[10px] text-outline ml-1">{t.fullName}</label>
                        <input
                          type="text"
                          required
                          value={authForm.name}
                          onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                          className="w-full bg-white border border-outline-variant/30 rounded-lg px-4 py-4 text-sm focus:ring-2 focus:ring-primary focus:border-transparent font-medium"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="uppercase font-bold tracking-widest text-[10px] text-outline ml-1">{t.email}</label>
                          <input
                            type="email"
                            required
                            value={authForm.email}
                            onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                            className="w-full bg-white border border-outline-variant/30 rounded-lg px-4 py-4 text-sm focus:ring-2 focus:ring-primary focus:border-transparent font-medium"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="uppercase font-bold tracking-widest text-[10px] text-outline ml-1">{t.phone}</label>
                          <input
                            type="tel"
                            required
                            value={authForm.phone}
                            onChange={(e) => setAuthForm({ ...authForm, phone: e.target.value })}
                            className="w-full bg-white border border-outline-variant/30 rounded-lg px-4 py-4 text-sm focus:ring-2 focus:ring-primary focus:border-transparent font-medium"
                            placeholder="+995 555 000 000"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {authMode === "login" && (
                    <div className="space-y-1">
                      <label className="uppercase font-bold tracking-widest text-[10px] text-outline ml-1">{t.email}</label>
                      <input
                        type="email"
                        required
                        value={authForm.email}
                        onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                        className="w-full bg-white border border-outline-variant/30 rounded-lg px-4 py-4 text-sm focus:ring-2 focus:ring-primary focus:border-transparent font-medium"
                      />
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="uppercase font-bold tracking-widest text-[10px] text-outline ml-1">{t.password}</label>
                    <input
                      type="password"
                      required
                      minLength={4}
                      value={authForm.password}
                      onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                      className="w-full bg-white border border-outline-variant/30 rounded-lg px-4 py-4 text-sm focus:ring-2 focus:ring-primary focus:border-transparent font-medium"
                    />
                  </div>

                  {authError && (
                    <p className="text-sm text-red-500 font-medium">{authError}</p>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-primary-container text-white py-4 rounded-lg font-black text-sm uppercase tracking-widest hover:brightness-110 transition-all"
                  >
                    {authMode === "register" ? t.registerBtn : t.loginBtn}
                  </button>
                </form>

                <button
                  onClick={() => { setAuthMode(authMode === "login" ? "register" : "login"); setAuthError(""); }}
                  className="w-full mt-4 text-xs text-primary font-bold uppercase tracking-widest text-center hover:underline"
                >
                  {authMode === "login" ? t.switchToRegister : t.switchToLogin}
                </button>
              </div>
            )}
          </section>

          {/* STEP 2 & 3: Only show when logged in */}
          {user && (
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Shipping */}
              <section className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-px flex-1 bg-outline-variant opacity-20" />
                  <span className="uppercase text-[12px] tracking-widest font-bold text-outline">{t.contact}</span>
                  <div className="h-px flex-1 bg-outline-variant opacity-20" />
                </div>
                <div className="space-y-6">
                  <div className="space-y-1">
                    <label className="uppercase font-bold tracking-widest text-[10px] text-outline ml-1">{t.street}</label>
                    <input type="text" name="street" required value={form.street} onChange={handleChange} className="w-full bg-surface-container-high border-none rounded-sm px-4 py-4 focus:ring-2 focus:ring-primary transition-all font-bold tracking-tight" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1">
                      <label className="uppercase font-bold tracking-widest text-[10px] text-outline ml-1">{t.city}</label>
                      <input type="text" name="city" required value={form.city} onChange={handleChange} className="w-full bg-surface-container-high border-none rounded-sm px-4 py-4 focus:ring-2 focus:ring-primary transition-all font-bold tracking-tight" />
                    </div>
                    <div className="space-y-1">
                      <label className="uppercase font-bold tracking-widest text-[10px] text-outline ml-1">{t.zip}</label>
                      <input type="text" name="zip" required value={form.zip} onChange={handleChange} className="w-full bg-surface-container-high border-none rounded-sm px-4 py-4 focus:ring-2 focus:ring-primary transition-all font-bold tracking-tight" />
                    </div>
                    <div className="space-y-1">
                      <label className="uppercase font-bold tracking-widest text-[10px] text-outline ml-1">{t.country}</label>
                      <input type="text" name="country" required value={form.country} onChange={handleChange} className="w-full bg-surface-container-high border-none rounded-sm px-4 py-4 focus:ring-2 focus:ring-primary transition-all font-bold tracking-tight" />
                    </div>
                  </div>
                </div>
              </section>

              {/* Payment */}
              <section className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-px flex-1 bg-outline-variant opacity-20" />
                  <span className="uppercase text-[12px] tracking-widest font-bold text-outline">{t.payment}</span>
                  <div className="h-px flex-1 bg-outline-variant opacity-20" />
                </div>
                <div className="relative overflow-hidden rounded-xl bg-slate-900 p-8 text-white min-h-[220px] group transition-all duration-500 hover:scale-[1.01]">
                  <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
                  <div className="relative z-10 flex flex-col h-full justify-between">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="text-xs tracking-widest opacity-60 uppercase font-bold">{t.expressPay}</div>
                        <div className="text-2xl font-black italic tracking-tighter">KEEPZ</div>
                      </div>
                      <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>contactless</span>
                    </div>
                    <div className="mt-8 space-y-4">
                      <div className="flex gap-4">
                        <div className="bg-white/10 w-12 h-8 rounded-md" />
                        <div className="text-xl font-mono tracking-[0.2em] self-center">**** **** **** ****</div>
                      </div>
                      <div className="text-sm font-bold tracking-widest uppercase opacity-70">{t.secureVia}</div>
                    </div>
                  </div>
                </div>
              </section>

              <button type="submit" disabled={submitting} className="w-full bg-primary-container text-white py-6 rounded-xl font-black tracking-widest uppercase text-lg hover:bg-primary transition-all duration-300 transform active:scale-[0.98] shadow-xl shadow-primary/10 disabled:opacity-50 disabled:cursor-not-allowed">
                {submitting ? t.processing : t.complete}
              </button>
            </form>
          )}
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-2">
          <div className="sticky top-32 bg-surface-container-low rounded-xl p-10 space-y-8">
            <header className="pb-6 border-b border-outline-variant/20">
              <h2 className="text-2xl font-black tracking-[-0.04em] uppercase text-slate-900">{t.orderSummary}</h2>
              <span className="text-xs font-bold text-outline uppercase tracking-widest">{items.length} {t.itemsInCart}</span>
            </header>
            <div className="space-y-6">
              {items.map((item) => (
                <div key={`${item.product.id}-${item.size}`} className="flex gap-6 group">
                  <div className="w-24 h-24 bg-surface-container-highest rounded-lg overflow-hidden flex-shrink-0 relative">
                    <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <h3 className="font-bold text-slate-900 tracking-tight uppercase leading-none">{lang === "ge" && item.product.nameGe ? item.product.nameGe : item.product.name}</h3>
                      <p className="text-[10px] text-outline font-bold mt-1 uppercase tracking-widest">{t.sizeLabel}: {item.size}</p>
                    </div>
                    <div className="flex justify-between items-end">
                      <span className="text-xs font-black text-slate-600">{t.qtyLabel} {item.quantity}</span>
                      <span className="text-sm font-black text-primary">{item.product.price * item.quantity}.00 GEL</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-8 space-y-4 border-t border-outline-variant/20">
              <div className="flex justify-between items-center">
                <span className="uppercase font-bold tracking-widest text-[10px] text-outline">{t.subtotal}</span>
                <span className="font-bold text-slate-900">{total}.00 GEL</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="uppercase font-bold tracking-widest text-[10px] text-outline">{t.shipping}</span>
                <span className="font-bold text-slate-900">{t.free}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="uppercase font-bold tracking-widest text-[10px] text-outline">{t.taxes}</span>
                <span className="font-bold text-slate-900">{tax.toFixed(2)} GEL</span>
              </div>
              <div className="pt-4 flex justify-between items-end">
                <span className="text-lg font-black text-slate-900 tracking-tighter">{t.total}</span>
                <span className="text-3xl font-black text-primary tracking-tighter leading-none">{grandTotal.toFixed(2)} GEL</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
