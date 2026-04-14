"use client";

import { useState } from "react";
import Image from "next/image";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";
import { useLanguage } from "@/context/LanguageContext";
import { Product } from "@/types";

const t = {
  en: {
    subtitle: "Official School Collection",
    desc: "Engineered for mathematical precision and refined for the street. The inaugural collection for the academic vanguard.",
    shopNow: "Shop Now",
    all: "ALL",
    hoodies: "HOODIES",
    tshirts: "T-SHIRTS",
    accessories: "ACCESSORIES",
    men: "MEN",
    women: "WOMEN",
    unisex: "UNISEX",
    noProducts: "No products found.",
    philosophy: "Vladimir Komarov Physics-Mathematics School №199",
    headline: "REWRITE THE",
    headline2: "EQUATION.",
    brandText:
      "Named after Soviet cosmonaut Vladimir Komarov, our school is one of the most prestigious physics and mathematics institutions in Georgia. Founded during the Soviet era, it has produced generations of International Mathematical and Physics Olympiad medalists. Komarovi is more than a school — it is a movement where rigorous logic meets disruptive creativity. This merch is for those who solve for X and question why.",
    origins: "Shop Collection",
  },
  ge: {
    subtitle: "ოფიციალური სასკოლო კოლექცია",
    desc: "შექმნილია მათემატიკური სიზუსტით და ქუჩისთვის დახვეწილი. პირველი კოლექცია აკადემიური ავანგარდისთვის.",
    shopNow: "იყიდე ახლა",
    all: "ყველა",
    hoodies: "ჰუდები",
    tshirts: "მაისურები",
    accessories: "აქსესუარები",
    men: "კაცი",
    women: "ქალი",
    unisex: "უნისექსი",
    noProducts: "პროდუქტები ვერ მოიძებნა.",
    philosophy: "ვლადიმერ კომაროვის ფიზიკა-მათემატიკის №199 სკოლა",
    headline: "გადაწერე",
    headline2: "განტოლება.",
    brandText:
      "საბჭოთა კოსმონავტ ვლადიმერ კომაროვის სახელობის ჩვენი სკოლა საქართველოში ერთ-ერთი ყველაზე პრესტიჟული ფიზიკა-მათემატიკის სასწავლებელია. საბჭოთა ეპოქაში დაარსებული, მან აღზარდა საერთაშორისო მათემატიკური და ფიზიკის ოლიმპიადების მედალოსნების თაობები. კომაროვი სკოლაზე მეტია — ეს მოძრაობაა, სადაც მკაცრი ლოგიკა შემოქმედებას ხვდება. ეს მერჩი მათთვისაა, ვინც X-ს პოულობს და ეკითხება — რატომ.",
    origins: "კოლექციის ნახვა",
  },
};

export default function HomePage() {
  const { lang } = useLanguage();
  const tr = t[lang];
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeGender, setActiveGender] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const categories = [
    { key: "all", label: tr.all },
    { key: "hoodie", label: tr.hoodies },
    { key: "t-shirt", label: tr.tshirts },
    { key: "accessories", label: tr.accessories },
  ];

  const genders = [
    { key: "all", label: tr.all },
    { key: "male", label: tr.men },
    { key: "female", label: tr.women },
    { key: "unisex", label: tr.unisex },
  ];

  let filtered = products;
  if (activeCategory !== "all") filtered = filtered.filter((p) => p.category === activeCategory);
  if (activeGender !== "all") filtered = filtered.filter((p) => p.gender === activeGender);

  const scrollToShop = () => {
    document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative px-8 md:px-16 pt-20 pb-32 min-h-[90vh] flex flex-col justify-center items-start overflow-hidden">
        <div className="absolute inset-0 bg-grid-subtle pointer-events-none" />
        <div className="relative z-10 w-full">
          <h1 className="text-huge font-black tracking-[-0.05em] text-on-background flex flex-col">
            <span>{lang === "ge" ? "კომაროვი" : "KOMAROVI"}</span>
            <span className="text-outline-variant/40">{lang === "ge" ? "მერჩი" : "MERCH"}</span>
          </h1>
          <div className="mt-8 flex flex-col md:flex-row md:items-end justify-between gap-12 w-full">
            <div className="max-w-md">
              <p className="text-xs uppercase tracking-[0.2em] font-medium text-secondary mb-2">
                {tr.subtitle}
              </p>
              <p className="text-base text-on-surface-variant font-light">{tr.desc}</p>
            </div>
            <button
              onClick={scrollToShop}
              className="bg-primary-container text-on-primary-container px-10 py-5 rounded-lg font-bold uppercase tracking-widest text-sm hover:brightness-110 transition-all duration-300"
            >
              {tr.shopNow}
            </button>
          </div>
        </div>
        <div className="absolute right-[-10%] top-[20%] opacity-5 select-none pointer-events-none hidden lg:block">
          <span className="text-[30rem] font-black leading-none">&sum;</span>
        </div>
      </section>

      {/* Shop Section */}
      <section id="shop" className="px-8 md:px-16 py-20 max-w-[1920px] mx-auto">
        {/* Filters */}
        <div className="mb-12 space-y-4">
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-8 py-3 rounded-full font-bold tracking-widest text-xs transition-all hover:scale-105 ${
                  activeCategory === cat.key
                    ? "bg-primary-container text-white"
                    : "bg-surface-container text-on-surface hover:bg-surface-container-high"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            {genders.map((g) => (
              <button
                key={g.key}
                onClick={() => setActiveGender(g.key)}
                className={`px-6 py-2 rounded-full font-bold tracking-widest text-xs transition-all ${
                  activeGender === g.key
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {filtered.map((product) => (
            <div key={product.id} onClick={() => setSelectedProduct(product)}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-outline mt-20 uppercase tracking-widest text-sm">
            {tr.noProducts}
          </p>
        )}
      </section>

      {/* Brand Statement Section */}
      <section className="py-40 px-8 md:px-16 bg-surface-container-low overflow-hidden relative">
        <div className="max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative z-10">
            <span className="text-xs uppercase tracking-[0.3em] font-bold text-primary mb-6 block">
              {tr.philosophy}
            </span>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-10">
              {tr.headline} <br />
              {tr.headline2}
            </h2>
            <p className="text-xl md:text-2xl text-on-surface-variant font-light leading-relaxed max-w-xl">
              {tr.brandText}
            </p>
            <div className="mt-12">
              <button
                onClick={scrollToShop}
                className="inline-flex items-center gap-4 text-primary font-black uppercase tracking-widest text-sm group"
              >
                {tr.origins}
                <span className="material-symbols-outlined transition-transform duration-300 group-hover:translate-x-2">
                  trending_flat
                </span>
              </button>
            </div>
          </div>
          <div className="relative h-[600px] rounded-xl overflow-hidden">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPRToP8L9C46ezrAJ5RpSTqu9TFG5beYs9SZxKQYc3v-tV0DHzBIJCYzgVsRF_TUO4nw68NGOUbwXiJHXGpKvWOqgeS-MycaRcRTwXpEAqvPzSMbHgUUVt4vtr2D04clvsjERfHGJhPn_2lra2gT_ToylviYvL8hLkTaZsCrkC399381Ir_EogpJnhjoo9zHTyISezv_bHCPklk31X3iMSkIDiB1O5G7g8szgvHrkoTCcjLHjgOpaDhV5j5_59g4gD2x2zqGXoNIo"
              alt="School Corridor"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
          </div>
        </div>
      </section>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
}
