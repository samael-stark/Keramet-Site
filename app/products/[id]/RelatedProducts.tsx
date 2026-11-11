"use client";

import ProductCard, { type ProductCardData } from "@/components/ProductCard";
import SectionHeading from "@/components/home/SectionHeading";
import { useWishlist } from "@/lib/wishlist";

export default function RelatedProducts({
  products,
}: {
  products: ProductCardData[];
}) {
  const { wishlist, toggle } = useWishlist();

  if (!products.length) return null;

  return (
    <section className="border-t border-line bg-paper py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading align="left" label="You may also like" title="Similar Rugs" />

        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              wished={wishlist.includes(p.id)}
              onToggleWish={toggle}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
