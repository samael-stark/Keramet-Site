"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
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

      <main className="page">
        <div className="wrap">
          <div className="top">
            <h1 className="title">Your Cart</h1>
            <div className="actions">
              {items.length > 0 && (
                <>
                  <Link href="/products">
                    <span className="filledBtn">Continue shopping</span>
                  </Link>

                  <button className="ghost" onClick={onClear}>
                    Clear cart
                  </button>
                </>
              )}
            </div>
          </div>

          {!ready ? (
            <div className="skeleton">
              <div className="sk-left" />
              <div className="sk-right" />
            </div>
          ) : items.length === 0 ? (
            <div className="empty">
              <h2>Nothing in your cart yet.</h2>
              <p>
                Add a rug, then come back here to review your order and
                checkout.
              </p>
              <Link href="/products">
                <span className="filledBtn">Browse rugs</span>
              </Link>
            </div>
          ) : (
            <div className="grid">
              <section className="items">
                {items.map((p) => (
                  <div key={p.id} className="row">
                    <Link href={`/products/${p.id}`} className="thumb">
                      <img src={p.coverUrl || ""} alt={p.title || "Product"} />
                    </Link>

                    <div className="info">
                      <Link href={`/products/${p.id}`} className="name">
                        {p.title || "Untitled product"}
                      </Link>

                      <div className="meta">
                        {p.category ? <span>{p.category}</span> : null}
                        {p.size ? <span>• {p.size}</span> : null}
                      </div>

                      <span className="scarcity">Only one piece available</span>

                      <div className="controls">
                        <button
                          className="remove"
                          onClick={() => onRemove(p.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="price">
                      <div className="line">USD {p.price.toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </section>

              <aside className="summary">
                <div className="summaryCard">
                  <h3>Order summary</h3>

                  <div className="sumRow">
                    <span>Subtotal</span>
                    <strong>USD {subtotal.toFixed(2)}</strong>
                  </div>
                  <div className="sumRow">
                    <span>Delivery</span>
                    <strong>Free</strong>
                  </div>
                  <div
                    className="sumRow"
                    style={{ marginTop: "10px", fontWeight: "900" }}
                  >
                    <span>Total</span>
                    <strong>USD {subtotal.toFixed(2)}</strong>
                  </div>

                  <button className="checkout" onClick={handleCheckout}>
                    Checkout
                  </button>

                  <div className="safe">
                    Secure checkout. Your payment is encrypted.
                  </div>
                </div>
              </aside>
            </div>
          )}
        </div>

        {toast && <div className="toast">{toast}</div>}
      </main>

      <Footer />

      <style jsx>{`
        .page {
          background: #f5f5eb;
          min-height: 100vh;
        }

        .filledBtn {
          display: inline-block;
          border: 1px solid #7a1f1f;
          background: #7a1f1f;
          color: #fff;
          padding: 10px 14px;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .filledBtn:hover {
          background: #5f1717;
          border-color: #5f1717;
        }

        .wrap {
          max-width: 1200px;
          margin: 0 auto;
          padding: 48px 20px 70px;
        }

        .top {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 26px;
        }

        .title {
          font-size: 44px;
          font-weight: 900;
          color: #7a1f1f;
          letter-spacing: 0.2px;
        }

        .actions {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .ghost {
          border: 1px solid rgba(122, 31, 31, 0.25);
          background: rgba(255, 255, 255, 0.6);
          color: #7a1f1f;
          padding: 10px 14px;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .grid {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 24px;
          align-items: start;
        }

        .items {
          background: rgba(255, 255, 255, 0.55);
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 18px;
          overflow: hidden;
        }

        .row {
          display: grid;
          grid-template-columns: 120px 1fr 160px;
          gap: 16px;
          padding: 18px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        }

        .row:last-child {
          border-bottom: none;
        }

        .thumb {
          width: 120px;
          height: 120px;
          border-radius: 14px;
          overflow: hidden;
          display: block;
          background: #fff;
        }

        .thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .info {
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-width: 0;
        }

        .name {
          font-weight: 900;
          color: #1c1c1c;
          text-decoration: none;
          line-height: 1.2;
          font-size: 16px;
        }

        .name:hover {
          color: #7a1f1f;
        }

        .meta {
          color: rgba(0, 0, 0, 0.55);
          font-size: 13px;
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .scarcity {
          display: inline-block;
          font-size: 12px;
          font-weight: 800;
          color: #b91c1c;
          background: rgba(185, 28, 28, 0.08);
          padding: 6px 10px;
          border-radius: 999px;
          width: fit-content;
        }

        .controls {
          display: flex;
          gap: 12px;
          align-items: center;
          margin-top: 6px;
          flex-wrap: wrap;
        }

        .remove {
          border: none;
          background: transparent;
          color: #7a1f1f;
          font-weight: 800;
          cursor: pointer;
          padding: 8px 0;
        }

        .remove:hover {
          text-decoration: underline;
        }

        .price {
          text-align: right;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 6px;
        }

        .line {
          color: #7a1f1f;
          font-weight: 900;
          font-size: 16px;
        }

        .summaryCard {
          background: rgba(255, 255, 255, 0.75);
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 18px;
          padding: 18px;
          position: sticky;
          top: 96px;
        }

        .summaryCard h3 {
          font-size: 16px;
          font-weight: 900;
          margin-bottom: 14px;
          color: #1c1c1c;
        }

        .sumRow {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 14px;
          margin-bottom: 10px;
        }

        .checkout {
          width: 100%;
          border: none;
          background: #7a1f1f;
          color: #fff;
          font-weight: 900;
          padding: 14px 16px;
          border-radius: 14px;
          cursor: pointer;
          box-shadow: 0 10px 22px rgba(122, 31, 31, 0.22);
        }

        .safe {
          text-align: center;
          font-size: 12px;
          color: rgba(0, 0, 0, 0.55);
          margin-top: 12px;
        }

        .empty {
          text-align: center;
          margin-top: 110px;
        }

        .empty h2 {
          font-size: 28px;
          font-weight: 900;
          margin-bottom: 10px;
          color: #1c1c1c;
        }

        .empty p {
          max-width: 520px;
          margin: 0 auto 18px;
          color: rgba(0, 0, 0, 0.6);
          line-height: 1.6;
        }

        .toast {
          position: fixed;
          bottom: 34px;
          left: 50%;
          transform: translateX(-50%);
          background: #7a1f1f;
          color: #fff;
          padding: 12px 18px;
          border-radius: 12px;
          font-weight: 800;
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.22);
          z-index: 5000;
        }

        .skeleton {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 24px;
        }

        .sk-left,
        .sk-right {
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.65);
          border: 1px solid rgba(0, 0, 0, 0.06);
          height: 360px;
        }

        @media (max-width: 1024px) {
          .grid,
          .skeleton {
            grid-template-columns: 1fr;
          }

          .summaryCard {
            position: static;
          }

          .row {
            grid-template-columns: 90px 1fr;
          }

          .price {
            grid-column: 1 / -1;
            text-align: left;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            padding-top: 6px;
          }

          .thumb {
            width: 90px;
            height: 90px;
          }

          .title {
            font-size: 34px;
          }
        }
      `}</style>
    </>
  );
}
