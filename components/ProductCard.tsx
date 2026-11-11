"use client";

import Link from "next/link";
import PriceDisplay from "@/components/PriceDisplay";
import { normalizeCategory } from "@/lib/categories";

export type ProductCardData = {
  id: string;
  title: string;
  coverUrl: string;
  price: number;
  category?: string;
  size?: string;
};

// Shared product card (homepage "Featured" and the shop grid).
export default function ProductCard({
  product,
  wished,
  onToggleWish,
  className = "",
  priority = false,
  soldOut = false,
}: {
  product: ProductCardData;
  wished: boolean;
  onToggleWish: (id: string) => void;
  className?: string;
  priority?: boolean;
  soldOut?: boolean;
}) {
  const price = Number(product.price) || 0;
  const originalPrice = price > 0 ? price / 0.85 : 0;
  const category = normalizeCategory(product.category);

  return (
    <Link href={`/products/${product.id}`} className={`group block ${className}`}>
      <article>
        <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-[#efe8dc]">
          {product.coverUrl ? (
            <img
              src={product.coverUrl}
              alt={product.title}
              loading={priority ? "eager" : "lazy"}
              decoding="async"
              className={`h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04] ${
                soldOut ? "opacity-50 grayscale" : ""
              }`}
            />
          ) : null}

          <span
            className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide text-white ${
              soldOut ? "bg-ink" : "bg-custom-accent"
            }`}
          >
            {soldOut ? "Sold" : "15% Off"}
          </span>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleWish(product.id);
            }}
            className={`absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur transition hover:scale-105 ${
              wished ? "text-custom-accent" : "text-ink/60 hover:text-custom-accent"
            }`}
            aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={wished}
          >
            <svg
              viewBox="0 0 24 24"
              width="19"
              height="19"
              fill={wished ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M11.995 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54l-1.455 1.31z" />
            </svg>
          </button>

          <span className="absolute inset-x-3 bottom-3 hidden translate-y-2 rounded-full bg-white/95 py-2.5 text-center text-xs font-semibold uppercase tracking-[0.18em] text-custom-accent opacity-0 shadow-sm transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 md:block">
            View Rug
          </span>
        </div>

        <div className="pt-4">
          {category ? (
            <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-muted">
              {category}
            </p>
          ) : null}

          <h3 className="mt-1.5 line-clamp-2 text-[15px] leading-snug text-ink">
            {product.title}
          </h3>

          <div className="mt-2 flex flex-wrap items-baseline gap-x-2">
            <span className="text-base font-semibold text-custom-accent">
              <PriceDisplay basePrice={price} />
            </span>
            {originalPrice > 0 && !soldOut ? (
              <span className="text-xs text-muted line-through">
                <PriceDisplay basePrice={originalPrice} />
              </span>
            ) : null}
          </div>
        </div>
      </article>
    </Link>
  );
}
