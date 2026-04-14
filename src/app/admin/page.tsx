"use client";

import { products } from "@/data/products";
import Link from "next/link";

export default function AdminDashboard() {
  const totalProducts = products.length;
  const inStockProducts = products.filter((p) => p.inStock).length;
  const outOfStockProducts = totalProducts - inStockProducts;
  const limitedProducts = products.filter((p) => p.limited).length;
  const totalRevenuePotential = products
    .filter((p) => p.inStock)
    .reduce((sum, p) => sum + p.price, 0);

  const stats = [
    { label: "Total Products", value: totalProducts, icon: "inventory_2", color: "bg-blue-500" },
    { label: "In Stock", value: inStockProducts, icon: "check_circle", color: "bg-green-500" },
    { label: "Out of Stock", value: outOfStockProducts, icon: "error", color: "bg-red-500" },
    { label: "Limited Edition", value: limitedProducts, icon: "star", color: "bg-amber-500" },
  ];

  const categoryBreakdown = [
    { name: "Hoodies", count: products.filter((p) => p.category === "hoodie").length },
    { name: "T-Shirts", count: products.filter((p) => p.category === "t-shirt").length },
    { name: "Accessories", count: products.filter((p) => p.category === "accessories").length },
  ];

  const genderBreakdown = [
    { name: "Men", count: products.filter((p) => p.gender === "male").length },
    { name: "Women", count: products.filter((p) => p.gender === "female").length },
    { name: "Unisex", count: products.filter((p) => p.gender === "unisex").length },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Overview of your store performance</p>
        </div>
        <Link href="/admin/products" className="bg-primary-container text-white px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-widest hover:brightness-110 transition-all">
          Manage Products
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center mb-4`}>
              <span className="material-symbols-outlined text-white text-xl">{stat.icon}</span>
            </div>
            <p className="text-3xl font-black text-slate-900">{stat.value}</p>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <h3 className="font-black text-sm uppercase tracking-widest text-slate-900 mb-6">Categories</h3>
          <div className="space-y-4">
            {categoryBreakdown.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">{cat.name}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-container rounded-full" style={{ width: `${(cat.count / totalProducts) * 100}%` }} />
                  </div>
                  <span className="text-sm font-black text-slate-900 w-6 text-right">{cat.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gender Breakdown */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <h3 className="font-black text-sm uppercase tracking-widest text-slate-900 mb-6">Gender</h3>
          <div className="space-y-4">
            {genderBreakdown.map((g) => (
              <div key={g.name} className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">{g.name}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-900 rounded-full" style={{ width: `${(g.count / totalProducts) * 100}%` }} />
                  </div>
                  <span className="text-sm font-black text-slate-900 w-6 text-right">{g.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <h3 className="font-black text-sm uppercase tracking-widest text-slate-900 mb-6">Revenue Potential</h3>
          <p className="text-4xl font-black text-primary tracking-tighter">{totalRevenuePotential} GEL</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Total value of in-stock inventory</p>
          <div className="mt-6 pt-6 border-t border-slate-100">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-500">Avg. Price</span>
              <span className="font-bold text-slate-900">{Math.round(totalRevenuePotential / inStockProducts)} GEL</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Price Range</span>
              <span className="font-bold text-slate-900">{Math.min(...products.map((p) => p.price))} - {Math.max(...products.map((p) => p.price))} GEL</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Products */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-black text-sm uppercase tracking-widest text-slate-900">All Products</h3>
          <Link href="/admin/products" className="text-xs font-bold text-primary uppercase tracking-widest hover:underline">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Product</th>
                <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Category</th>
                <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Gender</th>
                <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Price</th>
                <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.slice(0, 5).map((product) => (
                <tr key={product.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4"><p className="font-bold text-sm text-slate-900 uppercase">{product.name}</p></td>
                  <td className="px-6 py-4"><span className="text-xs font-medium text-slate-500 uppercase">{product.category}</span></td>
                  <td className="px-6 py-4"><span className="text-xs font-medium text-slate-500 uppercase">{product.gender}</span></td>
                  <td className="px-6 py-4"><span className="text-sm font-bold text-slate-900">{product.price} GEL</span></td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded ${product.inStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {product.inStock ? "In Stock" : "Sold Out"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
