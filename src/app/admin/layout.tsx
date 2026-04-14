"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ADMIN_USER = "Admin";
const ADMIN_PASS = "Pass123";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "dashboard" },
  { href: "/admin/products", label: "Products", icon: "inventory_2" },
  { href: "/admin/orders", label: "Orders", icon: "receipt_long" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const session = localStorage.getItem("komarovi_admin");
    if (session === "true") setAuthed(true);
    setChecking(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      localStorage.setItem("komarovi_admin", "true");
      setAuthed(true);
    } else {
      setError("Invalid username or password");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("komarovi_admin");
    setAuthed(false);
    setUsername("");
    setPassword("");
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-slate-50 -mt-24 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-primary-container rounded-full animate-spin" />
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-slate-900 -mt-24 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black tracking-tighter text-white uppercase">
              ATELIER
            </h1>
            <p className="text-[10px] tracking-widest text-slate-500 font-bold uppercase mt-1">
              ADMIN PANEL
            </p>
          </div>

          <form onSubmit={handleLogin} className="bg-slate-800 rounded-xl p-8 space-y-5">
            <div className="space-y-1">
              <label className="uppercase font-bold tracking-widest text-[10px] text-slate-500">
                USERNAME
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-700 border-none rounded-lg px-4 py-4 text-sm text-white focus:ring-2 focus:ring-primary-container font-medium placeholder-slate-500"
                placeholder="Enter username"
              />
            </div>

            <div className="space-y-1">
              <label className="uppercase font-bold tracking-widest text-[10px] text-slate-500">
                PASSWORD
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-700 border-none rounded-lg px-4 py-4 text-sm text-white focus:ring-2 focus:ring-primary-container font-medium placeholder-slate-500"
                placeholder="Enter password"
              />
            </div>

            {error && (
              <p className="text-sm text-red-400 font-medium">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-primary-container text-white py-4 rounded-lg font-black text-sm uppercase tracking-widest hover:brightness-110 transition-all"
            >
              LOG IN
            </button>
          </form>

          <div className="text-center mt-6">
            <Link
              href="/"
              className="text-xs text-slate-500 font-bold uppercase tracking-widest hover:text-slate-300 transition-colors"
            >
              Back to Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 -mt-24 pt-0">
      <div className="flex">
        {/* Sidebar */}
        <aside className="fixed top-0 left-0 h-screen w-64 bg-slate-900 text-white flex flex-col z-50">
          <div className="px-6 py-8 border-b border-slate-800">
            <Link href="/admin" className="block">
              <h1 className="text-xl font-black tracking-tighter uppercase">
                ATELIER
              </h1>
              <p className="text-[10px] tracking-widest text-slate-500 font-bold uppercase mt-1">
                ADMIN PANEL
              </p>
            </Link>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1">
            {navItems.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary-container text-white"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="px-4 py-6 border-t border-slate-800 space-y-1">
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <span className="material-symbols-outlined text-xl">
                storefront
              </span>
              View Store
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors w-full text-left"
            >
              <span className="material-symbols-outlined text-xl">
                logout
              </span>
              Log Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-8 min-h-screen">{children}</main>
      </div>
    </div>
  );
}
