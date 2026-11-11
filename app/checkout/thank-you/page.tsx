"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaCheck } from "react-icons/fa";
import { clearCart } from "@/lib/cart";

export default function ThankYouPage() {
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const orderId = params.get("orderId");
    const storedOrderNumber = sessionStorage.getItem("pendingOrderNumber");

    // No order data found
    if (!orderId && !storedOrderNumber) {
      router.replace("/");
      return;
    }

    if (storedOrderNumber) {
      setOrderNumber(storedOrderNumber);
    } else if (orderId) {
      setOrderNumber(orderId);
    }

    // The order is paid: empty the cart (it still held the purchased rug)
    clearCart();

    // Clear temp checkout storage
    sessionStorage.removeItem("checkoutDetails");
    sessionStorage.removeItem("pendingOrderId");
    sessionStorage.removeItem("pendingOrderNumber");
  }, [router]);

  return (
    <>
      <Header />

      <main className="min-h-screen bg-custom-bg">
        <div className="mx-auto max-w-2xl px-6 py-16 text-center lg:py-24">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-custom-accent text-2xl text-white shadow-[0_12px_26px_rgba(96,25,21,0.25)]">
            <FaCheck />
          </span>

          <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.3em] text-custom-accent">
            Payment Successful
          </p>
          <h1 className="mt-3 font-display text-5xl font-semibold leading-tight text-ink md:text-6xl">
            Thank You for Your Order!
          </h1>
          <p className="mx-auto mt-4 max-w-md text-base leading-7 text-muted">
            Your payment was completed successfully, and we will start
            carefully preparing your rug.
          </p>

          {orderNumber ? (
            <div className="mx-auto mt-10 max-w-md rounded-sm border border-line bg-paper px-6 py-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-muted">
                Your Order Number
              </p>
              <p className="mt-2 break-all text-2xl font-semibold tracking-wide text-custom-accent">
                {orderNumber}
              </p>
              <p className="mt-3 text-xs leading-6 text-muted">
                Use this number to track your order anytime.
              </p>
            </div>
          ) : null}

          <ol className="mx-auto mt-10 grid max-w-xl gap-4 text-left sm:grid-cols-3">
            {[
              { title: "Email confirmation", text: "Your order summary is sent to your email." },
              { title: "Preparation", text: "Your rug is checked and packed with care." },
              { title: "Delivery", text: "Shipped worldwide and delivered in 3–7 days." },
            ].map((step, i) => (
              <li key={step.title} className="rounded-sm bg-paper p-4">
                <p className="text-xs font-semibold text-custom-accent">0{i + 1}</p>
                <p className="mt-1 text-sm font-semibold text-ink">{step.title}</p>
                <p className="mt-1 text-xs leading-5 text-muted">{step.text}</p>
              </li>
            ))}
          </ol>

          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/track-order"
              className="rounded-full bg-custom-accent px-8 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-custom-accent-light"
            >
              Track My Order
            </Link>
            <Link
              href="/products"
              className="rounded-full border border-custom-accent px-8 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-custom-accent transition hover:bg-custom-accent hover:text-white"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
