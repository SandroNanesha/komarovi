"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

const t = {
  en: {
    account: "ACCOUNT",
    login: "LOG IN",
    register: "REGISTER",
    email: "EMAIL",
    password: "PASSWORD",
    name: "FULL NAME",
    phone: "PHONE",
    submit: "CONTINUE",
    logout: "LOG OUT",
    myOrders: "MY ORDERS",
    noOrders: "No orders yet",
    welcome: "Welcome back,",
    loginError: "Invalid email or password",
    registerError: "Email already registered",
    switchToRegister: "Don't have an account? Register",
    switchToLogin: "Already have an account? Log in",
    pending: "PENDING",
    paid: "PAID",
    shipped: "SHIPPED",
    delivered: "DELIVERED",
    items: "items",
  },
  ge: {
    account: "ანგარიში",
    login: "შესვლა",
    register: "რეგისტრაცია",
    email: "ელ. ფოსტა",
    password: "პაროლი",
    name: "სრული სახელი",
    phone: "ტელეფონი",
    submit: "გაგრძელება",
    logout: "გასვლა",
    myOrders: "ჩემი შეკვეთები",
    noOrders: "შეკვეთები ჯერ არ არის",
    welcome: "გამარჯობა,",
    loginError: "არასწორი ელ. ფოსტა ან პაროლი",
    registerError: "ეს ელ. ფოსტა უკვე რეგისტრირებულია",
    switchToRegister: "არ გაქვთ ანგარიში? დარეგისტრირდით",
    switchToLogin: "უკვე გაქვთ ანგარიში? შედით",
    pending: "მოლოდინში",
    paid: "გადახდილი",
    shipped: "გაგზავნილი",
    delivered: "მიწოდებული",
    items: "ნივთი",
  },
};

const statusColors = {
  pending: "bg-amber-100 text-amber-700",
  paid: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
};

export default function AccountSlideOver() {
  const { user, isAccountOpen, closeAccount, register, login, logout } = useAuth();
  const { lang } = useLanguage();
  const router = useRouter();
  const tr = t[lang];

  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    let ok = false;
    if (mode === "login") {
      ok = login(form.email, form.password);
      if (!ok) setError(tr.loginError);
    } else {
      ok = register(form.name, form.email, form.phone, form.password);
      if (!ok) setError(tr.registerError);
    }

    if (ok) {
      closeAccount();
      router.push("/");
    }
  };

  return (
    <>
      {isAccountOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          onClick={closeAccount}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-[100] transform transition-transform duration-300 ease-in-out shadow-[0_0_80px_rgba(0,0,0,0.15)] ${
          isAccountOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-8 py-10 flex justify-between items-center border-b border-slate-100">
            <h3 className="text-2xl font-black tracking-tighter uppercase text-slate-900">
              {tr.account}
            </h3>
            <button
              onClick={closeAccount}
              className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 rounded-full transition-colors"
            >
              <span className="material-symbols-outlined text-slate-900">close</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-8 py-8">
            {user ? (
              /* Logged-in view */
              <div className="space-y-8">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">
                    {tr.welcome}
                  </p>
                  <p className="text-2xl font-black tracking-tighter text-slate-900 mt-1">
                    {user.name}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">{user.email}</p>
                </div>

                {/* Orders */}
                <div>
                  <h4 className="font-black text-sm uppercase tracking-widest text-slate-900 mb-4">
                    {tr.myOrders}
                  </h4>

                  {user.orders.length === 0 ? (
                    <p className="text-slate-400 text-sm py-8 text-center uppercase tracking-widest">
                      {tr.noOrders}
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {user.orders.map((order) => (
                        <div
                          key={order.id}
                          className="bg-slate-50 rounded-xl p-5 space-y-3"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-black text-sm text-slate-900">
                                {order.id}
                              </p>
                              <p className="text-[10px] text-slate-400 font-bold tracking-widest mt-0.5">
                                {order.date}
                              </p>
                            </div>
                            <span
                              className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${statusColors[order.status]}`}
                            >
                              {tr[order.status]}
                            </span>
                          </div>

                          <div className="space-y-1">
                            {order.items.map((item, i) => (
                              <div
                                key={i}
                                className="flex justify-between text-xs text-slate-600"
                              >
                                <span>
                                  {item.name}{" "}
                                  <span className="text-slate-400">
                                    ({item.size} x{item.qty})
                                  </span>
                                </span>
                                <span className="font-bold">
                                  {item.price * item.qty} GEL
                                </span>
                              </div>
                            ))}
                          </div>

                          <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              {order.items.length} {tr.items}
                            </span>
                            <span className="font-black text-slate-900">
                              {order.total} GEL
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={logout}
                  className="w-full border-2 border-slate-200 text-slate-600 py-3 rounded-lg font-bold text-sm uppercase tracking-widest hover:bg-slate-50 transition-all"
                >
                  {tr.logout}
                </button>
              </div>
            ) : (
              /* Auth form */
              <div className="space-y-6">
                {/* Tab toggle */}
                <div className="flex border-b border-slate-100">
                  <button
                    onClick={() => { setMode("login"); setError(""); }}
                    className={`flex-1 pb-3 text-sm font-black uppercase tracking-widest transition-colors ${
                      mode === "login"
                        ? "text-slate-900 border-b-2 border-slate-900"
                        : "text-slate-400"
                    }`}
                  >
                    {tr.login}
                  </button>
                  <button
                    onClick={() => { setMode("register"); setError(""); }}
                    className={`flex-1 pb-3 text-sm font-black uppercase tracking-widest transition-colors ${
                      mode === "register"
                        ? "text-slate-900 border-b-2 border-slate-900"
                        : "text-slate-400"
                    }`}
                  >
                    {tr.register}
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {mode === "register" && (
                    <>
                      <div className="space-y-1">
                        <label className="uppercase font-bold tracking-widest text-[10px] text-slate-400">
                          {tr.name}
                        </label>
                        <input
                          type="text"
                          required
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full bg-slate-50 border-none rounded-lg px-4 py-4 text-sm focus:ring-2 focus:ring-primary font-medium"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="uppercase font-bold tracking-widest text-[10px] text-slate-400">
                          {tr.phone}
                        </label>
                        <input
                          type="tel"
                          required
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          className="w-full bg-slate-50 border-none rounded-lg px-4 py-4 text-sm focus:ring-2 focus:ring-primary font-medium"
                          placeholder="+995 555 000 000"
                        />
                      </div>
                    </>
                  )}

                  <div className="space-y-1">
                    <label className="uppercase font-bold tracking-widest text-[10px] text-slate-400">
                      {tr.email}
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-slate-50 border-none rounded-lg px-4 py-4 text-sm focus:ring-2 focus:ring-primary font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="uppercase font-bold tracking-widest text-[10px] text-slate-400">
                      {tr.password}
                    </label>
                    <input
                      type="password"
                      required
                      minLength={4}
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="w-full bg-slate-50 border-none rounded-lg px-4 py-4 text-sm focus:ring-2 focus:ring-primary font-medium"
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-red-500 font-medium">{error}</p>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-primary-container text-white py-4 rounded-lg font-black text-sm uppercase tracking-widest hover:brightness-110 transition-all"
                  >
                    {tr.submit}
                  </button>
                </form>

                <button
                  onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
                  className="w-full text-xs text-primary font-bold uppercase tracking-widest text-center hover:underline"
                >
                  {mode === "login" ? tr.switchToRegister : tr.switchToLogin}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
