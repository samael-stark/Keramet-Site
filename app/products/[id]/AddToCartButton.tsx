"use client";

import { useState } from "react";
import Link from "next/link";
import { addToCart } from "@/lib/cart";

export default function AddToCartButton({
  productId,
  soldOut = false,
}: {
  productId: string;
  soldOut?: boolean;
}) {
  const [added, setAdded] = useState(false);

  if (soldOut) {
    return (
      <button
        disabled
        className="w-full cursor-not-allowed rounded-full bg-ink/15 px-6 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-ink/60"
      >
        This Rug Has Been Sold
      </button>
    );
  }

  const handleClick = () => {
    addToCart(productId, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="space-y-3">
      <button
        onClick={handleClick}
        className={`w-full rounded-full px-6 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-white shadow-[0_12px_26px_rgba(96,25,21,0.22)] transition hover:-translate-y-0.5 ${
          added ? "bg-[#2e7d4e]" : "bg-custom-accent hover:bg-custom-accent-light"
        }`}
      >
        {added ? "Added to Cart ✓" : "Add to Cart"}
      </button>

      <Link
        href="/cart"
        className="block w-full rounded-full border border-custom-accent px-6 py-4 text-center text-sm font-semibold uppercase tracking-[0.16em] text-custom-accent transition hover:bg-custom-accent hover:text-white"
      >
        Go to Cart
      </Link>
    </div>
  );
}
