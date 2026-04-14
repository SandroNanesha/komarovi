"use client";

import { useState } from "react";

interface MockOrder {
  id: string;
  customer: string;
  phone: string;
  items: { name: string; size: string; qty: number; price: number }[];
  total: number;
  status: "pending" | "paid" | "shipped";
  date: string;
}

const mockOrders: MockOrder[] = [
  {
    id: "ORD-001",
    customer: "Giorgi Komarovi",
    phone: "+995 555 123 456",
    items: [
      { name: "Theory Heavyweight Hoodie", size: "XL", qty: 1, price: 120 },
      { name: "Linear Algebra Tee", size: "L", qty: 2, price: 55 },
    ],
    total: 230,
    status: "paid",
    date: "2026-04-13",
  },
  {
    id: "ORD-002",
    customer: "Ana Beridze",
    phone: "+995 555 789 012",
    items: [
      { name: "Academic Rebel Hoodie", size: "M", qty: 1, price: 140 },
    ],
    total: 140,
    status: "pending",
    date: "2026-04-14",
  },
  {
    id: "ORD-003",
    customer: "Luka Tskhadadze",
    phone: "+995 555 345 678",
    items: [
      { name: "Scalar Ribbed Beanie", size: "ONE SIZE", qty: 1, price: 40 },
      { name: "Curated Scholar Cap", size: "ONE SIZE", qty: 1, price: 40 },
      { name: "Boxy Fit Rebel Tee", size: "L", qty: 1, price: 70 },
    ],
    total: 150,
    status: "shipped",
    date: "2026-04-12",
  },
  {
    id: "ORD-004",
    customer: "Mariam Janelidze",
    phone: "+995 555 901 234",
    items: [
      { name: "Olympiad Field Jacket", size: "S", qty: 1, price: 185 },
    ],
    total: 185,
    status: "paid",
    date: "2026-04-14",
  },
  {
    id: "ORD-005",
    customer: "Dato Kvaratskhelia",
    phone: "+995 555 567 890",
    items: [
      { name: "Grid Overlay Hoodie", size: "XL", qty: 1, price: 155 },
      { name: "Atelier Signature Tee", size: "XL", qty: 1, price: 65 },
    ],
    total: 220,
    status: "pending",
    date: "2026-04-14",
  },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<MockOrder[]>(mockOrders);
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const filtered =
    statusFilter === "all"
      ? orders
      : orders.filter((o) => o.status === statusFilter);

  const updateStatus = (id: string, newStatus: MockOrder["status"]) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
  };

  const totalRevenue = orders
    .filter((o) => o.status !== "pending")
    .reduce((sum, o) => sum + o.total, 0);

  const statusCounts = {
    pending: orders.filter((o) => o.status === "pending").length,
    paid: orders.filter((o) => o.status === "paid").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tighter uppercase text-slate-900">
          Orders
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Track and manage customer orders
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <p className="text-2xl font-black text-slate-900">{orders.length}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Total Orders
          </p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <p className="text-2xl font-black text-amber-600">
            {statusCounts.pending}
          </p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Pending
          </p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <p className="text-2xl font-black text-green-600">
            {statusCounts.paid + statusCounts.shipped}
          </p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Fulfilled
          </p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <p className="text-2xl font-black text-primary">{totalRevenue} GEL</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Revenue
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {[
          { key: "all", label: "All" },
          { key: "pending", label: "Pending" },
          { key: "paid", label: "Paid" },
          { key: "shipped", label: "Shipped" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setStatusFilter(f.key)}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
              statusFilter === f.key
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {filtered.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden"
          >
            {/* Order Header */}
            <div
              className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
              onClick={() =>
                setExpandedOrder(
                  expandedOrder === order.id ? null : order.id
                )
              }
            >
              <div className="flex items-center gap-6">
                <div>
                  <p className="font-black text-sm text-slate-900 uppercase">
                    {order.id}
                  </p>
                  <p className="text-[10px] text-slate-400 font-bold">
                    {order.date}
                  </p>
                </div>
                <div className="hidden sm:block">
                  <p className="font-bold text-sm text-slate-700">
                    {order.customer}
                  </p>
                  <p className="text-[10px] text-slate-400">{order.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-black text-slate-900">
                  {order.total} GEL
                </span>
                <span
                  className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                    order.status === "pending"
                      ? "bg-amber-100 text-amber-700"
                      : order.status === "paid"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                  }`}
                >
                  {order.status}
                </span>
                <span className="material-symbols-outlined text-slate-400 transition-transform">
                  {expandedOrder === order.id
                    ? "expand_less"
                    : "expand_more"}
                </span>
              </div>
            </div>

            {/* Expanded Details */}
            {expandedOrder === order.id && (
              <div className="px-6 pb-6 border-t border-slate-100 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Items */}
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                      Items
                    </h4>
                    <div className="space-y-2">
                      {order.items.map((item, i) => (
                        <div
                          key={i}
                          className="flex justify-between text-sm bg-slate-50 rounded-lg px-3 py-2"
                        >
                          <div>
                            <span className="font-bold">{item.name}</span>
                            <span className="text-slate-400 ml-2">
                              {item.size} x{item.qty}
                            </span>
                          </div>
                          <span className="font-bold">
                            {item.price * item.qty} GEL
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                      Update Status
                    </h4>
                    <div className="flex gap-2">
                      {(
                        ["pending", "paid", "shipped"] as MockOrder["status"][]
                      ).map((s) => (
                        <button
                          key={s}
                          onClick={() => updateStatus(order.id, s)}
                          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                            order.status === s
                              ? "bg-slate-900 text-white"
                              : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="text-center py-12 text-slate-400 text-sm uppercase tracking-widest">
            No orders found
          </p>
        )}
      </div>
    </div>
  );
}
