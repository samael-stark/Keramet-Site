"use client";

import SectionHeading from "@/components/home/SectionHeading";
import ProductCard, { type ProductCardData } from "@/components/ProductCard";
import { useWishlist } from "@/lib/wishlist";
import { useMemo, useRef } from "react";
import Link from "next/link";
import { FaArrowRight, FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function BestSeller({ products }: { products: ProductCardData[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { wishlist, toggle } = useWishlist();

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;

    const amount = el.clientWidth * 0.8;

    el.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  const saleEndDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 10);

    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
    });
  }, []);

  if (!products.length) return null;

  return (
    <section className="bg-paper py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6 lg:mb-14">
          <SectionHeading
            align="left"
            label="Featured"
            title="Best Sellers"
            intro={`Sale prices end on ${saleEndDate}.`}
          />

          <div className="hidden items-center gap-3 sm:flex">
            <button
              onClick={() => scroll("left")}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-custom-accent/30 text-custom-accent transition hover:bg-custom-accent hover:text-white"
              aria-label="Scroll left"
            >
              <FaChevronLeft />
            </button>

            <button
              onClick={() => scroll("right")}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-custom-accent/30 text-custom-accent transition hover:bg-custom-accent hover:text-white"
              aria-label="Scroll right"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="no-scrollbar -mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-6 pb-2 lg:mx-0 lg:px-0"
        >
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              wished={wishlist.includes(p.id)}
              onToggleWish={toggle}
              className="w-[72%] flex-shrink-0 snap-start sm:w-[44%] lg:w-[calc((100%-3.75rem)/4)]"
            />
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-3 rounded-full bg-custom-accent px-10 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-custom-accent-light"
          >
            View All Rugs
            <FaArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}
