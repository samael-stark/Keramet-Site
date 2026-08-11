"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type OrderStatusHistoryItem = {
  status: string;
  label: string;
  createdAt: string | null;
  note?: string;
};

type OrderItem = {
  title: string;
  image: string;
  price: number;
  quantity?: number;
  size?: string;
};

type OrderDetail = {
  id: string;
  orderNumber: string;
  fulfillmentStatus: string;
  fulfillmentStatusLabel: string;
  paymentStatus: string;
  createdAt: string | null;

  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    country: string;
    countryCode?: string;
    city: string;
    addressLine1: string;
    addressLine2?: string;
    postalCode?: string;
  };

  items: OrderItem[];

  pricing: {
    subtotal: number;
    shipping: number;
    total: number;
    currency: string;
  };

  statusHistory: OrderStatusHistoryItem[];
};

function formatDate(value: string | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString();
}

function getCurrencySymbol(currency: string) {
  switch (currency) {
    case "USD":
      return "$";
    case "EUR":
      return "€";
    case "GBP":
      return "£";
    case "TRY":
      return "₺";
    default:
      return `${currency} `;
  }
}

function formatMoney(amount: number, currency: string) {
  const symbol = getCurrencySymbol(currency);

  return `${symbol}${amount.toFixed(2)}`;
}

function getPaymentStatusStyles(status: string) {
  const normalized = status.toLowerCase();

  if (normalized === "paid") {
    return "bg-green-100 text-green-700";
  }

  if (
    normalized === "failed" ||
    normalized === "cancelled" ||
    normalized === "canceled"
  ) {
    return "bg-red-100 text-red-700";
  }

  if (normalized === "pending") {
    return "bg-yellow-100 text-yellow-700";
  }

  return "bg-gray-100 text-gray-700";
}

function getFulfillmentStatusStyles(status: string) {
  const normalized = status.toLowerCase();

  switch (normalized) {
    case "processing":
      return "bg-blue-100 text-blue-700";

    case "shipped":
      return "bg-purple-100 text-purple-700";

    case "delivered":
      return "bg-green-100 text-green-700";

    case "cancelled":
      return "bg-red-100 text-red-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
}

const STATUS_OPTIONS = [
  {
    value: "processing",
    label: "Processing",
  },
  {
    value: "shipped",
    label: "Shipped",
  },
  {
    value: "delivered",
    label: "Delivered",
  },
  {
    value: "cancelled",
    label: "Cancelled",
  },
];

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();

  const id = params?.id as string;

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [note, setNote] = useState("");

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`/api/admin/orders/${id}`, {
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to load order");
      }

      setOrder(data.order);
    } catch (err: any) {
      setError(err.message || "Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchOrder();
    }
  }, [id]);

  const updateFulfillmentStatus = async (status: string) => {
    if (!order) return;

    if (order.fulfillmentStatus === status) {
      setError("This status is already set.");
      return;
    }

    try {
      setUpdating(status);
      setError("");
      setSuccess("");

      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
          note,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update status");
      }

      setSuccess("Status updated successfully");
      setNote("");

      await fetchOrder();
    } catch (err: any) {
      setError(err.message || "Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-custom-bg px-6 py-12">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-[1.75rem] bg-white/30 p-8 shadow-xl backdrop-blur-xl">
            <p className="text-gray-700">Loading order...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error && !order) {
    return (
      <main className="min-h-screen bg-custom-bg px-6 py-12">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-[1.75rem] border border-red-200 bg-red-50 p-6 text-red-700">
            {error}
          </div>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-custom-bg px-6 py-12">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-[1.75rem] bg-white/30 p-6 shadow-xl backdrop-blur-xl">
            <p className="text-gray-700">Order not found.</p>
          </div>
        </div>
      </main>
    );
  }

  const customerName =
    `${order.customer.firstName || ""} ${order.customer.lastName || ""}`.trim() ||
    "—";

  const currency = order.pricing.currency;

  return (
    <main className="min-h-screen bg-custom-bg px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-5xl space-y-6 sm:space-y-8">

        {/* HEADER */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium text-gray-500">
              Order Details
            </p>

            <h1 className="text-3xl font-extrabold text-custom-accent sm:text-4xl">
              Order #{order.orderNumber}
            </h1>

            <p className="mt-2 text-sm text-gray-600">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/admin")}
            className="w-fit rounded-full border border-gray-300 bg-white/70 px-5 py-2.5 text-sm font-semibold text-gray-800 transition hover:bg-white"
          >
            ← Dashboard
          </button>
        </div>

        {/* SUCCESS / ERROR */}
        {error && (
          <div className="rounded-[1.25rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-[1.25rem] border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        {/* CUSTOMER + ADDRESS */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* CUSTOMER INFORMATION */}
          <div className="rounded-[1.75rem] bg-white/30 p-6 shadow-xl backdrop-blur-xl">
            <h2 className="mb-5 text-lg font-bold text-gray-900">
              Customer Information
            </h2>

            <div className="space-y-4">

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Full Name
                </p>

                <p className="mt-1 text-sm font-medium text-gray-900">
                  {customerName}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Email
                </p>

                <p className="mt-1 break-all text-sm font-medium text-gray-900">
                  {order.customer.email || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Phone
                </p>

                <p className="mt-1 text-sm font-medium text-gray-900">
                  {order.customer.phone || "—"}
                </p>
              </div>

            </div>
          </div>

          {/* DELIVERY ADDRESS */}
          <div className="rounded-[1.75rem] bg-white/30 p-6 shadow-xl backdrop-blur-xl">
            <h2 className="mb-5 text-lg font-bold text-gray-900">
              Delivery Address
            </h2>

            <div className="space-y-4">

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Country
                </p>

                <p className="mt-1 text-sm font-medium text-gray-900">
                  {order.customer.country || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Street Address
                </p>

                <p className="mt-1 text-sm font-medium text-gray-900">
                  {order.customer.addressLine1 || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Flat / Other
                </p>

                <p className="mt-1 text-sm font-medium text-gray-900">
                  {order.customer.addressLine2 || "—"}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    City
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {order.customer.city || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Postal Code
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {order.customer.postalCode || "—"}
                  </p>
                </div>

              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Phone
                </p>

                <p className="mt-1 text-sm font-medium text-gray-900">
                  {order.customer.countryCode
                    ? `${order.customer.countryCode} ${order.customer.phone || ""}`
                    : order.customer.phone || "—"}
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* ORDER INFORMATION */}
        <div className="rounded-[1.75rem] bg-white/30 p-6 shadow-xl backdrop-blur-xl">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              Order Information
            </h2>

            <div className="flex flex-wrap gap-2">
              <span
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getPaymentStatusStyles(
                  order.paymentStatus
                )}`}
              >
                Payment: {order.paymentStatus || "—"}
              </span>

              <span
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getFulfillmentStatusStyles(
                  order.fulfillmentStatus
                )}`}
              >
                {order.fulfillmentStatusLabel ||
                  order.fulfillmentStatus ||
                  "—"}
              </span>
            </div>
          </div>

          {/* PRODUCTS */}
          <div className="space-y-4">

            {order.items?.length ? (
              order.items.map((item, index) => (
                <div
                  key={`${item.title}-${index}`}
                  className="flex flex-col gap-4 rounded-2xl border border-white/50 bg-white/50 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-4">

                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-20 w-20 shrink-0 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-xs text-gray-500">
                        No image
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900">
                        {item.title}
                      </p>

                      {item.size && (
                        <p className="mt-1 text-sm text-gray-600">
                          Size: {item.size}
                        </p>
                      )}

                      {item.quantity !== undefined && (
                        <p className="mt-1 text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                      )}
                    </div>

                  </div>

                  <p className="shrink-0 text-base font-bold text-custom-accent">
                    {formatMoney(item.price, currency)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-600">
                No products found for this order.
              </p>
            )}

          </div>

          {/* PRICING */}
          <div className="mt-6 border-t border-gray-300/60 pt-5">
            <div className="ml-auto max-w-sm space-y-3">

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  Subtotal
                </span>

                <span className="font-medium text-gray-900">
                  {formatMoney(order.pricing.subtotal, currency)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  Delivery
                </span>

                <span className="font-medium text-gray-900">
                  {order.pricing.shipping === 0
                    ? "Free"
                    : formatMoney(order.pricing.shipping, currency)}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-gray-300/60 pt-3">
                <span className="text-base font-bold text-gray-900">
                  Total
                </span>

                <span className="text-xl font-extrabold text-custom-accent">
                  {formatMoney(order.pricing.total, currency)}
                </span>
              </div>

            </div>
          </div>
        </div>

        {/* STATUS UPDATE */}
        <div className="rounded-[1.75rem] bg-white/30 p-6 shadow-xl backdrop-blur-xl">
          <h2 className="mb-4 text-lg font-bold text-gray-900">
            Update Fulfillment Status
          </h2>

          <textarea
            placeholder="Optional note (e.g. tracking number, delay reason)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="mb-4 min-h-[100px] w-full resize-none rounded-xl border border-white/40 bg-white/60 p-3 text-sm text-gray-900 outline-none placeholder:text-gray-500 focus:ring-2 focus:ring-custom-accent"
          />

          <div className="flex flex-wrap gap-3">
            {STATUS_OPTIONS.map((item) => {
              const active =
                order.fulfillmentStatus === item.value;

              const isLoading =
                updating === item.value;

              return (
                <button
                  key={item.value}
                  disabled={!!updating || active}
                  onClick={() =>
                    updateFulfillmentStatus(item.value)
                  }
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    active
                      ? "bg-custom-accent text-white"
                      : "bg-white/60 text-gray-800 hover:bg-white"
                  } disabled:cursor-not-allowed disabled:opacity-70`}
                >
                  {isLoading ? "Updating..." : item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* STATUS HISTORY */}
        <div className="rounded-[1.75rem] bg-white/30 p-6 shadow-xl backdrop-blur-xl">
          <h2 className="mb-5 text-lg font-bold text-gray-900">
            Status Timeline
          </h2>

          <div className="space-y-4">

            {order.statusHistory?.length ? (
              order.statusHistory.map((entry, index) => (
                <div
                  key={`${entry.status}-${index}`}
                  className="flex gap-4 rounded-2xl border border-white/50 bg-white/50 p-4"
                >
                  <div className="mt-1 flex shrink-0">
                    <div className="h-3 w-3 rounded-full bg-custom-accent" />
                  </div>

                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900">
                      {entry.label}
                    </p>

                    <p className="text-sm text-gray-600">
                      {formatDate(entry.createdAt)}
                    </p>

                    {entry.note && (
                      <div className="mt-2 rounded-lg bg-gray-100/70 px-3 py-2">
                        <p className="text-sm text-gray-700">
                          {entry.note}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-600">
                No status history yet.
              </p>
            )}

          </div>
        </div>

      </div>
    </main>
  );
}
