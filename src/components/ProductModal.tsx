"use client";

import { useState } from "react";
import Image from "next/image";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";

const translations = {
  en: {
    inStock: "IN STOCK",
    soldOut: "SOLD OUT",
    selectSize: "SELECT SIZE",
    addToCart: "ADD TO CART",
    addedToCart: "ADDED TO CART",
    selectASize: "SELECT A SIZE",
    freeShipping: "Free express shipping on orders over 150 GEL",
    specs: "SPECIFICATIONS",
    category: "CATEGORY",
    gender: "GENDER",
    fit: "FIT",
    origin: "ORIGIN",
    oversized: "OVERSIZED BOX CUT",
    designed: "DESIGNED IN TBILISI",
    editorial: "EDITORIAL NOTE",
    male: "MEN",
    female: "WOMEN",
    unisex: "UNISEX",
  },
  ge: {
    inStock: "მარაგშია",
    soldOut: "გაყიდულია",
    selectSize: "აირჩიეთ ზომა",
    addToCart: "კალათაში დამატება",
    addedToCart: "დამატებულია",
    selectASize: "აირჩიეთ ზომა",
    freeShipping: "უფასო ექსპრეს მიწოდება 150 GEL-ზე მეტ შეკვეთაზე",
    specs: "სპეციფიკაციები",
    category: "კატეგორია",
    gender: "სქესი",
    fit: "მორგება",
    origin: "წარმოშობა",
    oversized: "თავისუფალი ჭრა",
    designed: "დიზაინი თბილისში",
    editorial: "აღწერა",
    male: "კაცი",
    female: "ქალი",
    unisex: "უნისექსი",
  },
};

export default function ProductModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const { addItem } = useCart();
  const { lang } = useLanguage();
  const t = translations[lang];
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addItem(product, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const genderLabel = t[product.gender as keyof typeof t] as string;

  return (
    <div className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full max-w-5xl mx-4 my-8 rounded-2xl shadow-2xl overflow-hidden">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm"
        >
          <span className="material-symbols-outlined text-slate-900">close</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Images */}
          <div className="bg-surface-container-low p-6 space-y-4">
            <div className="aspect-[4/5] relative rounded-xl overflow-hidden">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-2 gap-4">
                {product.images.slice(1, 3).map((img, i) => (
                  <div key={i} className="aspect-square relative rounded-xl overflow-hidden">
                    <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-8 lg:p-10 flex flex-col">
            <p className="uppercase text-secondary font-bold tracking-widest text-xs mb-2">
              {genderLabel}
            </p>
            <h2 className="text-4xl lg:text-5xl font-black tracking-[-0.04em] text-on-surface uppercase leading-[0.9] mb-4">
              {lang === "ge" && product.nameGe ? product.nameGe : product.name}
            </h2>

            <div className="flex items-center gap-4 mb-8">
              <span className="text-2xl font-bold text-on-surface">
                {product.price}.00 GEL
              </span>
              <span
                className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                  product.inStock
                    ? "bg-surface-container-high text-tertiary"
                    : "bg-error-container text-on-error-container"
                }`}
              >
                {product.inStock ? t.inStock : t.soldOut}
              </span>
            </div>

            {/* Sizes */}
            {product.inStock && (
              <div className="mb-8">
                <label className="uppercase text-[10px] tracking-[0.05em] font-medium text-outline mb-3 block">
                  {t.selectSize}
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-5 py-3 border-2 font-bold text-sm transition-all ${
                        selectedSize === size
                          ? "border-primary bg-primary-container text-white"
                          : "border-outline-variant hover:border-primary"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            {product.inStock ? (
              <button
                onClick={handleAddToCart}
                disabled={!selectedSize}
                className={`w-full py-5 rounded-lg font-black text-base tracking-tighter uppercase mb-4 transition-all active:scale-[0.98] ${
                  !selectedSize
                    ? "bg-surface-container text-outline cursor-not-allowed"
                    : added
                      ? "bg-green-600 text-white"
                      : "bg-primary-container text-on-primary-container hover:opacity-90"
                }`}
              >
                {!selectedSize ? t.selectASize : added ? t.addedToCart : t.addToCart}
              </button>
            ) : (
              <div className="w-full py-5 rounded-lg font-black text-base tracking-tighter uppercase mb-4 text-center bg-surface-container text-outline">
                {t.soldOut}
              </div>
            )}

            <div className="flex items-center gap-2 text-xs text-outline mb-8">
              <span className="material-symbols-outlined text-base">local_shipping</span>
              <span>{t.freeShipping}</span>
            </div>

            {/* Specs */}
            <div className="border-t border-outline-variant/30 pt-6 mt-auto">
              <h3 className="font-black text-xs uppercase tracking-widest mb-3">{t.specs}</h3>
              <ul className="space-y-2 text-xs">
                <li className="flex justify-between">
                  <span className="text-outline">{t.category}</span>
                  <span className="font-medium uppercase">{product.category}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-outline">{t.gender}</span>
                  <span className="font-medium uppercase">{genderLabel}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-outline">{t.origin}</span>
                  <span className="font-medium">{t.designed}</span>
                </li>
              </ul>
              <p className="text-tertiary text-xs leading-relaxed mt-4">
                {lang === "ge" && product.descriptionGe ? product.descriptionGe : product.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
