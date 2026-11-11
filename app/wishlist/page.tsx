"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import ProductCard from "@/components/ProductCard";
import { useEffect, useState } from "react";
import { fetchProductsByIds } from "@/lib/products-client";
import { useWishlist } from "@/lib/wishlist";
import Link from "next/link";
import { FaRegHeart } from "react-icons/fa";

type WishProduct = {
  id: string;
  title?: string;
  coverUrl?: string;
  price?: number;
  category?: string;
  size?: string;
  stock?: number;
  isActive?: boolean;
};

export default function WishlistPage() {
  const { wishlist, toggle } = useWishlist();
  const [products, setProducts] = useState<WishProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Load the wishlisted products once (1 read per product, not the whole
  // collection). Removing a favorite just hides it from the list below.
  useEffect(() => {
    let ids: string[] = [];

    try {
      const stored = localStorage.getItem("wishlist");
      const parsed = stored ? JSON.parse(stored) : [];
      ids = Array.isArray(parsed) ? parsed : [];
    } catch {
      ids = [];
    }

    if (!ids.length) {
      setLoading(false);
      return;
    }

    fetchProductsByIds<WishProduct>(ids)
      .then(setProducts)
      .catch((err) => console.error("Wishlist load failed:", err))
      .finally(() => setLoading(false));
  }, []);

  const visible = products.filter((p) => wishlist.includes(p.id));
  const isEmpty = !loading && visible.length === 0;

  return (
    <>
      <Header />

      <main className="min-h-screen bg-custom-bg">
        <PageHero
          title="Your Wishlist"
          label="Saved Rugs"
          crumbs={[{ label: "Wishlist" }]}
          subtitle={
            !loading && visible.length > 0
              ? `${visible.length} ${visible.length === 1 ? "rug" : "rugs"} in your wishlist`
              : undefined
          }
        />

        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10 lg:py-14">
          {loading ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] animate-pulse rounded-sm bg-paper" />
              ))}
            </div>
          ) : isEmpty ? (
            <div className="mx-auto max-w-xl rounded-sm border border-line bg-paper px-8 py-16 text-center">
              <FaRegHeart className="mx-auto text-3xl text-custom-accent/60" />
              <h2 className="mt-5 font-display text-4xl font-semibold text-ink">
                Your wishlist is empty
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted">
                Tap the heart on any rug to save it here and come back to it
                anytime.
              </p>
              <Link
                href="/products"
                className="mt-8 inline-flex items-center rounded-full bg-custom-accent px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-custom-accent-light"
              >
                Browse Rugs
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 xl:grid-cols-4">
                {visible.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={{
                      id: p.id,
                      title: p.title || "Untitled Product",
                      coverUrl: p.coverUrl || "",
                      price: Number(p.price) || 0,
                      category: p.category,
                    }}
                    wished
                    onToggleWish={toggle}
                    soldOut={p.isActive === false || Number(p.stock ?? 1) <= 0}
                  />
                ))}
              </div>

              <p className="mt-12 text-center text-sm text-muted">
                Tap the heart to remove a rug from your
                wishlist.
              </p>
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
