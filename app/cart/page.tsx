"use client";
import PriceDisplay from "@/components/PriceDisplay";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { normalizeCategory } from "@/lib/categories";
import {
  FaCreditCard,
  FaLock,
  FaShoppingBag,
  FaTrashAlt,
  FaTruck,
} from "react-icons/fa";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { auth } from "@/lib/firebase";
import { fetchProductsByIds } from "@/lib/products-client";
import { useRouter } from "next/navigation";
import {
  getCart,
  removeFromCart,
  clearCart,
  type CartItem,
} from "@/lib/cart";

type ProductDoc = {
  id: string;
  title?: string;
  coverUrl?: string;
  price?: number;
  category?: string;
  size?: string;
};

export default function CartPage() {
  const router = useRouter();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<ProductDoc[]>([]);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => setCart(getCart());
    sync();
    window.addEventListener("cartUpdated", sync);
    return () => window.removeEventListener("cartUpdated", sync);
  }, []);

  useEffect(() => {
    async function load() {
      const ids = cart.map((x) => x.id);

      if (!ids.length) {
        setProducts([]);
        setReady(true);
        return;
      }

      // Read only the products in the cart (1 read each), not the whole collection.
      const filtered = await fetchProductsByIds<ProductDoc>(ids);

      setProducts(filtered);
      setReady(true);
    }

    setReady(false);
    load();
  }, [cart]);

  const items = useMemo(() => {
    const map = new Map(products.map((p) => [p.id, p]));

    return cart
      .map((c) => {
        const p = map.get(c.id);
        if (!p) return null;

        return {
          ...p,
          price: Number(p.price || 0),
        };
      })
      .filter(Boolean) as Array<ProductDoc & { price: number }>;
  }, [cart, products]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, x) => sum + x.price, 0);
  }, [items]);

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 1800);
  };

  const onRemove = (id: string) => {
    removeFromCart(id);
    showToast("Removed from cart");
  };

  const onClear = () => {
    clearCart();
  showToast("Cart cleared");
  };

  const handleCheckout = () => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      router.push("/auth?redirect=/checkout");
      return;
    }

    router.push("/checkout");
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-custom-bg">
        <PageHero
          title="Your Cart"
          label="Shopping"
          crumbs={[{ label: "Cart" }]}
          subtitle={
            items.length > 0
              ? `${items.length} ${items.length === 1 ? "rug" : "rugs"} · Each one of a kind`
              : undefined
          }
        >
          {items.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex items-center rounded-full border border-custom-accent px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-custom-accent transition hover:bg-custom-accent hover:text-white"
              >
                Continue Shopping
              </Link>
              <button
                onClick={onClear}
                className="inline-flex items-center rounded-full px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted transition hover:text-custom-accent"
              >
                Clear Cart
              </button>
            </div>
          ) : null}
        </PageHero>

        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10 lg:py-14">
          {!ready ? (
            <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
              <div className="h-64 animate-pulse rounded-sm bg-paper" />
              <div className="h-64 animate-pulse rounded-sm bg-paper" />
            </div>
          ) : items.length === 0 ? (
            <div className="mx-auto max-w-xl rounded-sm border border-line bg-paper px-8 py-16 text-center">
              <FaShoppingBag className="mx-auto text-3xl text-custom-accent/60" />
              <h2 className="mt-5 font-display text-4xl font-semibold text-ink">
                Your cart is empty
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted">
                Add the rugs you love to your cart and complete your
                order.
              </p>
              <Link
                href="/products"
                className="mt-8 inline-flex items-center rounded-full bg-custom-accent px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-custom-accent-light"
              >
                Browse Rugs
              </Link>
            </div>
          ) : (
            <div className="grid items-start gap-8 lg:grid-cols-[1fr_380px] lg:gap-12">
              {/* Items */}
              <section className="divide-y divide-line border-y border-line">
                {items.map((p) => {
                  const category = normalizeCategory(p.category);

                  return (
                    <div key={p.id} className="flex gap-5 py-6">
                      <Link
                        href={`/products/${p.id}`}
                        className="block w-24 shrink-0 overflow-hidden rounded-sm bg-[#efe8dc] sm:w-32"
                      >
                        <div className="aspect-[3/4]">
                          {p.coverUrl ? (
                            <img
                              src={p.coverUrl}
                              alt={p.title || "Product"}
                              className="h-full w-full object-cover"
                            />
                          ) : null}
                        </div>
                      </Link>

                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
                          <div className="min-w-0">
                            {category ? (
                              <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-muted">
                                {category}
                              </p>
                            ) : null}
                            <Link
                              href={`/products/${p.id}`}
                              className="mt-1 block text-base leading-snug text-ink hover:text-custom-accent"
                            >
                              {p.title || "Untitled Product"}
                            </Link>
                            {p.size ? (
                              <p className="mt-1 text-sm text-muted">{p.size}</p>
                            ) : null}
                          </div>

                          <p className="text-lg font-semibold text-custom-accent">
                            <PriceDisplay basePrice={p.price} />
                          </p>
                        </div>

                        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
                          <span className="rounded-full bg-custom-accent/10 px-3 py-1 text-[11px] font-semibold text-custom-accent">
                            One of a kind · Only 1 available
                          </span>

                          <button
                            onClick={() => onRemove(p.id)}
                            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted transition hover:text-custom-accent"
                          >
                            <FaTrashAlt />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </section>

              {/* Summary */}
              <aside className="lg:sticky lg:top-32">
                <div className="rounded-sm border border-line bg-paper p-7">
                  <h2 className="font-display text-3xl font-semibold text-ink">
                    Order Summary
                  </h2>

                  <dl className="mt-6 space-y-3 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted">Subtotal</dt>
                      <dd className="font-semibold text-ink">
                        <PriceDisplay basePrice={subtotal} />
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted">Delivery</dt>
                      <dd className="font-semibold text-[#2e7d4e]">Free</dd>
                    </div>
                    <div className="flex items-baseline justify-between border-t border-line pt-4">
                      <dt className="font-semibold text-ink">Total</dt>
                      <dd className="text-2xl font-semibold text-custom-accent">
                        <PriceDisplay basePrice={subtotal} />
                      </dd>
                    </div>
                  </dl>

                  <button
                    onClick={handleCheckout}
                    className="mt-7 w-full rounded-full bg-custom-accent px-6 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-white shadow-[0_12px_26px_rgba(96,25,21,0.22)] transition hover:-translate-y-0.5 hover:bg-custom-accent-light"
                  >
                    Checkout
                  </button>

                  <ul className="mt-6 space-y-2.5 text-xs text-muted">
                    <li className="flex items-center gap-2.5">
                      <FaLock className="text-custom-accent" />
                      Secure payment with iyzico
                    </li>
                    <li className="flex items-center gap-2.5">
                      <FaCreditCard className="text-custom-accent" />
                      Visa and Mastercard accepted
                    </li>
                    <li className="flex items-center gap-2.5">
                      <FaTruck className="text-custom-accent" />
                      Shipped worldwide, delivered in 3–7 days
                    </li>
                  </ul>
                </div>
              </aside>
            </div>
          )}
        </div>

        {toast ? (
          <div
            role="status"
            className="fixed bottom-28 left-1/2 z-50 -translate-x-1/2 rounded-full bg-ink px-5 py-3 text-sm text-white shadow-xl lg:bottom-8"
          >
            {toast}
          </div>
        ) : null}
      </main>

      <Footer />
    </>
  );
}
