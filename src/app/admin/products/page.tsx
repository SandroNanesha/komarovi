"use client";

import { useState } from "react";
import Image from "next/image";
import { products as initialProducts } from "@/data/products";
import { Product } from "@/types";

const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "ONE SIZE"];

export default function AdminProductsPage() {
  const [productList, setProductList] = useState<Product[]>(initialProducts);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filter, setFilter] = useState("all");

  const filtered =
    filter === "all"
      ? productList
      : filter === "in-stock"
        ? productList.filter((p) => p.inStock)
        : filter === "out-of-stock"
          ? productList.filter((p) => !p.inStock)
          : filter === "male" || filter === "female" || filter === "unisex"
            ? productList.filter((p) => p.gender === filter)
            : productList.filter((p) => p.category === filter);

  const toggleStock = (id: string) => {
    setProductList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, inStock: !p.inStock } : p))
    );
  };

  const toggleLimited = (id: string) => {
    setProductList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, limited: !p.limited } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProductList((prev) => prev.filter((p) => p.id !== id));
  };

  const updateProduct = (updated: Product) => {
    setProductList((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
    setEditingProduct(null);
  };

  const addProduct = (product: Product) => {
    setProductList((prev) => [...prev, product]);
    setShowAddForm(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase text-slate-900">Products</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your product catalog</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-primary-container text-white px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-widest hover:brightness-110 transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: "all", label: "All" },
          { key: "in-stock", label: "In Stock" },
          { key: "out-of-stock", label: "Out of Stock" },
          { key: "hoodie", label: "Hoodies" },
          { key: "t-shirt", label: "T-Shirts" },
          { key: "accessories", label: "Accessories" },
          { key: "male", label: "Men" },
          { key: "female", label: "Women" },
          { key: "unisex", label: "Unisex" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
              filter === f.key
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Add/Edit Form Modal */}
      {(showAddForm || editingProduct) && (
        <ProductForm
          product={editingProduct}
          onSave={editingProduct ? updateProduct : addProduct}
          onCancel={() => {
            setShowAddForm(false);
            setEditingProduct(null);
          }}
        />
      )}

      {/* Product Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Product</th>
                <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Category</th>
                <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Gender</th>
                <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Sizes</th>
                <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Price</th>
                <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</th>
                <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50 group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 relative">
                        <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-900 uppercase">{product.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium text-slate-500 uppercase bg-slate-100 px-2 py-1 rounded">{product.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium uppercase px-2 py-1 rounded ${
                      product.gender === "male" ? "bg-blue-50 text-blue-600" :
                      product.gender === "female" ? "bg-pink-50 text-pink-600" :
                      "bg-slate-100 text-slate-500"
                    }`}>
                      {product.gender}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1 flex-wrap">
                      {product.sizes.map((s) => (
                        <span key={s} className="text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{s}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-slate-900">{product.price} GEL</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleStock(product.id)}
                        className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded cursor-pointer transition-colors ${
                          product.inStock ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-red-100 text-red-700 hover:bg-red-200"
                        }`}
                      >
                        {product.inStock ? "In Stock" : "Sold Out"}
                      </button>
                      {product.limited && (
                        <button
                          onClick={() => toggleLimited(product.id)}
                          className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded bg-amber-100 text-amber-700 hover:bg-amber-200 cursor-pointer transition-colors"
                        >
                          Limited
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setEditingProduct(product)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors">
                        <span className="material-symbols-outlined text-lg text-slate-600">edit</span>
                      </button>
                      <button onClick={() => deleteProduct(product.id)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 transition-colors">
                        <span className="material-symbols-outlined text-lg text-red-500">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className="text-center py-12 text-slate-400 text-sm uppercase tracking-widest">No products found</p>
        )}
      </div>
    </div>
  );
}

function ProductForm({
  product,
  onSave,
  onCancel,
}: {
  product: Product | null;
  onSave: (product: Product) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    id: product?.id || "",
    name: product?.name || "",
    price: product?.price || 0,
    category: product?.category || ("hoodie" as Product["category"]),
    gender: product?.gender || ("unisex" as Product["gender"]),
    description: product?.description || "",
    limited: product?.limited || false,
    inStock: product?.inStock ?? true,
    sizes: product?.sizes || [] as string[],
    image: product?.images[0] || "",
  });

  const toggleSize = (size: string) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = form.id || form.name.toLowerCase().replace(/\s+/g, "-");
    onSave({
      id,
      name: form.name,
      price: form.price,
      images: form.image ? [form.image] : [product?.images[0] || ""],
      sizes: form.sizes,
      category: form.category,
      gender: form.gender,
      description: form.description,
      limited: form.limited,
      inStock: form.inStock,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black uppercase tracking-tighter">
            {product ? "Edit Product" : "Add Product"}
          </h2>
          <button onClick={onCancel} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">Price (GEL)</label>
              <input
                type="number"
                required
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as Product["category"] })}
                className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="hoodie">Hoodie</option>
                <option value="t-shirt">T-Shirt</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>
          </div>

          {/* Gender Selection */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-2">Gender</label>
            <div className="flex gap-4">
              {(["male", "female", "unisex"] as const).map((g) => (
                <label key={g} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    checked={form.gender === g}
                    onChange={() => setForm({ ...form, gender: g })}
                    className="accent-primary"
                  />
                  <span className="text-sm font-medium capitalize">{g === "male" ? "Men" : g === "female" ? "Women" : "Unisex"}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Size Checkboxes */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-2">Sizes</label>
            <div className="flex flex-wrap gap-2">
              {ALL_SIZES.map((size) => (
                <label
                  key={size}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 cursor-pointer transition-all ${
                    form.sizes.includes(size)
                      ? "border-primary bg-primary-container text-white"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={form.sizes.includes(size)}
                    onChange={() => toggleSize(size)}
                    className="sr-only"
                  />
                  <span className="text-xs font-bold">{size}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">Image URL</label>
            <input
              type="url"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.inStock}
                onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
                className="rounded border-slate-300"
              />
              <span className="text-sm font-medium">In Stock</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.limited}
                onChange={(e) => setForm({ ...form, limited: e.target.checked })}
                className="rounded border-slate-300"
              />
              <span className="text-sm font-medium">Limited Edition</span>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" className="flex-1 bg-primary-container text-white py-3 rounded-lg font-bold text-sm uppercase tracking-widest hover:brightness-110 transition-all">
              {product ? "Update" : "Create"}
            </button>
            <button type="button" onClick={onCancel} className="px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-widest border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
