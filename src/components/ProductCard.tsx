"use client";

import Image from "next/image";
import { Product } from "@/types";
import { useLanguage } from "@/context/LanguageContext";

const genderLabels = {
  en: { male: "Men", female: "Women", unisex: "Unisex" },
  ge: { male: "კაცი", female: "ქალი", unisex: "უნისექსი" },
};

export default function ProductCard({ product }: { product: Product }) {
  const { lang } = useLanguage();

  return (
    <div className={`group block cursor-pointer ${!product.inStock ? "opacity-80" : ""}`}>
      <div className="relative aspect-square rounded-xl overflow-hidden bg-surface-container-low mb-4">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className={`object-cover transition-all duration-700 ${
            product.inStock
              ? "grayscale group-hover:grayscale-0 group-hover:scale-105"
              : "grayscale"
          }`}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          {product.limited && (
            <span className="bg-black text-white text-[10px] font-black tracking-widest px-3 py-1 uppercase">
              {lang === "en" ? "Limited" : "ლიმიტირებული"}
            </span>
          )}
          {!product.inStock && (
            <span className="bg-slate-400 text-white text-[10px] font-black tracking-widest px-3 py-1 uppercase">
              {lang === "en" ? "Sold Out" : "გაყიდულია"}
            </span>
          )}
        </div>
      </div>

      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <span className="text-[10px] font-bold tracking-[0.2em] text-secondary uppercase">
            {genderLabels[lang][product.gender]}
          </span>
          <h3 className="font-bold text-lg leading-tight uppercase tracking-tight">
            {lang === "ge" && product.nameGe ? product.nameGe : product.name}
          </h3>
        </div>
        <p className={`font-bold text-lg ${!product.inStock ? "text-slate-400" : "text-primary-container"}`}>
          {product.price} GEL
        </p>
      </div>
    </div>
  );
}
