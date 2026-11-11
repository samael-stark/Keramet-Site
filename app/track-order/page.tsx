"use client";
import PriceDisplay from "@/components/PriceDisplay";
import { FormEvent, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";

type TrackOrderResponse = {
  id: string;
  orderNumber: string;
  customerName: string;
  email: string;
  fulfillmentStatus: string;
  fulfillmentStatusLabel: string;
  paymentStatus: string;
  createdAt: string | null;
  total: number;
    currency: string;
  items: {
    title: string;
    image: string;
    price: number;
  }[];
  statusHistory: {
    status: string;
    label: string;
    createdAt: string | null;
    note?: string;
  }[];
};

const STATUS_FLOW = [
  "order_confirmed",
  "processing",
  "shipped",
  "delivered",
];

const STATUS_LABELS: Record<string, string> = {
  order_confirmed: "Order Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

// Display labels per status key (falls back to the label the API sends).
function statusLabel(status: string, fallback?: string) {
  return STATUS_LABELS[status] || fallback || status;
}

function formatDate(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}


export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<TrackOrderResponse | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const res = await fetch("/api/track-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderNumber: orderNumber.trim(),
          email: email.trim().toLowerCase(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
      throw new Error(
  data.error || "Order details not found."
);
      }

      setOrder(data.order);
    } catch (err: any) {
      setError(
  err.message || "Order details not found."
);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentStepIndex = () => {
    if (!order) return 0;
    const index = STATUS_FLOW.indexOf(order.fulfillmentStatus);
    return index === -1 ? 0 : index;
  };

  const currentIndex = getCurrentStepIndex();
  const isCancelled = order?.fulfillmentStatus === "cancelled";

  const inputClass =
    "h-12 w-full rounded-sm border border-line bg-paper px-4 text-sm text-ink outline-none transition focus:border-custom-accent";

  return (
    <>
      <Header />

      <main className="min-h-screen bg-custom-bg">
        <PageHero
          title="Track Your Order"
          label="Where is my order?"
          crumbs={[{ label: "Track Order" }]}
          subtitle="See the status of your order with your order number and email address."
        />

        <div className="mx-auto max-w-5xl px-6 py-10 lg:px-10 lg:py-14">
          {/* Lookup form */}
          <div className="rounded-sm border border-line bg-paper p-6 md:p-8">
            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-ink/80">
                  Order Number
                </span>
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="e.g. KRM-20261109-AB12CD"
                  className={inputClass}
                  required
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-ink/80">
                  Email Address
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="The email you used for the order"
                  className={inputClass}
                  required
                />
              </label>

              <button
                disabled={loading}
                className="h-12 rounded-full bg-custom-accent px-8 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-custom-accent-light disabled:opacity-70"
              >
                {loading ? "Checking…" : "Track"}
              </button>
            </form>

            <p className="mt-4 text-xs leading-6 text-muted">
              You can find your order number in your confirmation email. Enter it
              without the # sign.
            </p>

            {error ? (
              <p role="alert" className="mt-4 rounded-sm bg-custom-accent/10 px-4 py-3 text-sm text-custom-accent">
                {error}
              </p>
            ) : null}
          </div>

          {order ? (
            <div className="mt-10 space-y-8">
              {/* Summary */}
              <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-muted">
                    Order
                  </p>
                  <h2 className="mt-2 break-all font-display text-4xl font-semibold text-ink">
                    #{order.orderNumber}
                  </h2>
                  <p className="mt-1 text-sm text-muted">
                    Order date: {formatDate(order.createdAt)}
                  </p>
                </div>

                <span
                  className={`rounded-full px-4 py-2 text-xs font-semibold ${
                    isCancelled
                      ? "bg-ink text-white"
                      : "bg-custom-accent text-white"
                  }`}
                >
                  {statusLabel(order.fulfillmentStatus)}
                </span>
              </div>

              {/* Progress */}
              {isCancelled ? (
                <div className="rounded-sm border border-line bg-paper p-6 text-sm leading-7 text-ink/80">
                  This order has been cancelled. Please contact us if you have
                  any questions.
                </div>
              ) : (
                <div className="rounded-sm border border-line bg-paper p-6 md:p-8">
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-custom-accent">
                    Order Status
                  </h3>

                  <ol className="mt-8 grid gap-6 md:grid-cols-4 md:gap-0">
                    {STATUS_FLOW.map((step, index) => {
                      const done = index <= currentIndex;
                      const isLast = index === STATUS_FLOW.length - 1;

                      return (
                        <li key={step} className="relative flex gap-4 md:flex-col md:items-center md:gap-3 md:text-center">
                          {/* connector */}
                          {!isLast ? (
                            <span
                              className={`absolute left-[13px] top-7 h-[calc(100%+0.5rem)] w-[2px] md:left-1/2 md:top-[13px] md:h-[2px] md:w-full ${
                                index < currentIndex ? "bg-custom-accent" : "bg-line"
                              }`}
                            />
                          ) : null}

                          <span
                            className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                              done
                                ? "bg-custom-accent text-white"
                                : "border-2 border-line bg-paper text-muted"
                            }`}
                          >
                            {done ? "✓" : index + 1}
                          </span>

                          <span
                            className={`pt-1 text-sm md:pt-0 ${
                              index === currentIndex ? "font-semibold text-ink" : done ? "text-ink/80" : "text-muted"
                            }`}
                          >
                            {STATUS_LABELS[step]}
                          </span>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              )}

              <div className="grid gap-8 lg:grid-cols-2">
                {/* History */}
                <div className="rounded-sm border border-line bg-paper p-6 md:p-8">
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-custom-accent">
                    History
                  </h3>

                  <ol className="mt-6 space-y-6">
                    {order.statusHistory.map((step, i) => (
                      <li key={i} className="relative pl-7">
                        {i !== order.statusHistory.length - 1 ? (
                          <span className="absolute -bottom-6 left-[5px] top-3 w-px bg-line" />
                        ) : null}
                        <span className="absolute left-0 top-1.5 h-3 w-3 rounded-full bg-custom-accent" />

                        <p className="text-sm font-semibold text-ink">
                          {statusLabel(step.status, step.label)}
                        </p>
                        <p className="text-xs text-muted">{formatDate(step.createdAt)}</p>
                        {step.note ? (
                          <p className="mt-2 rounded-sm bg-custom-bg px-3 py-2 text-sm leading-6 text-ink/80">
                            {step.note}
                          </p>
                        ) : null}
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Items */}
                <div className="rounded-sm border border-line bg-paper p-6 md:p-8">
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-custom-accent">
                    Order Items
                  </h3>

                  <ul className="mt-6 divide-y divide-line">
                    {order.items.map((item, index) => (
                      <li key={index} className="flex items-center gap-4 py-4 first:pt-0">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="h-20 w-16 shrink-0 rounded-sm object-cover"
                          />
                        ) : null}
                        <p className="min-w-0 flex-1 text-sm leading-6 text-ink">
                          {item.title}
                        </p>
                        <p className="text-sm font-semibold text-ink">
                          <PriceDisplay basePrice={item.price} />
                        </p>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 flex items-baseline justify-between border-t border-line pt-4">
                    <span className="text-sm font-semibold text-ink">Total</span>
                    <span className="text-xl font-semibold text-custom-accent">
                      <PriceDisplay basePrice={order.total} />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </main>

      <Footer />
    </>
  );
}
