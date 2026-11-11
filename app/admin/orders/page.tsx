"use client";

import Link from "next/link";

import { useCallback, useEffect, useState } from "react";

import {
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import { FaTrash } from "react-icons/fa";

type OrderRow = {
  id: string;
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string | null;
};

function formatDate(value: string | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString();
}

function formatStatusLabel(value: string) {
  switch (value) {
    case "order_confirmed":
      return "Order Confirmed";

    case "processing":
      return "Processing";

    case "shipped":
      return "Shipped";

    case "delivered":
      return "Delivered";

    case "cancelled":
      return "Cancelled";

    default:
      return value;
  }
}

function getFulfillmentBadgeClass(status: string) {
  switch (status) {
    case "order_confirmed":
      return "bg-blue-100 text-blue-800";

    case "processing":
      return "bg-yellow-100 text-yellow-800";

    case "shipped":
      return "bg-indigo-100 text-indigo-800";

    case "delivered":
      return "bg-green-100 text-green-800";

    case "cancelled":
      return "bg-red-100 text-red-800";

    default:
      return "bg-gray-100 text-gray-800";
  }
}

function getPaymentBadgeClass(status: string) {
  switch (status) {
    case "paid":
      return "bg-green-100 text-green-800";

    case "failed":
      return "bg-red-100 text-red-800";

    case "Pending":
    default:
      return "bg-yellow-100 text-yellow-800";
  }
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [debugResponse, setDebugResponse] =
    useState("");

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  // Orders are loaded 50 at a time (newest first) to keep Firestore reads low.
  const [nextCursor, setNextCursor] =
    useState<string | null>(null);

  const [loadingMore, setLoadingMore] =
    useState(false);

  const fetchOrders = useCallback(
    async (cursor: string | null) => {
      try {
        if (cursor) {
          setLoadingMore(true);
        } else {
          setLoading(true);
        }

        setError("");

        setDebugResponse("");

        const url = cursor
          ? `/api/admin/orders?after=${encodeURIComponent(cursor)}`
          : "/api/admin/orders";

        const res = await fetch(
          url,
          {
            cache: "no-store",
          },
        );

        const rawText = await res.text();

        if (!rawText) {
          throw new Error(
            "API returned an empty response",
          );
        }

        let data: any;

        try {
          data = JSON.parse(rawText);
        } catch {
          console.error(
            "Non-JSON API response:",
            rawText,
          );

          setDebugResponse(rawText);

          throw new Error(
            "API did not return JSON",
          );
        }

        if (!res.ok || !data.success) {
          throw new Error(
            data.error ||
              "Failed to fetch orders",
          );
        }

        const page: OrderRow[] =
          data.orders || [];

        setOrders((prev) =>
          cursor ? [...prev, ...page] : page,
        );

        setNextCursor(
          data.hasMore
            ? data.nextCursor || null
            : null,
        );
      } catch (err: any) {
        console.error(
          "Orders fetch error:",
          err,
        );

        if (cursor) {
          alert(
            err.message ||
              "Failed to load more orders.",
          );
        } else {
          setError(
            err.message ||
              "Failed to load orders.",
          );
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchOrders(null);
  }, [fetchOrders]);

  const onDelete = async (
    order: OrderRow,
  ) => {
    const ok = confirm(
      `Delete order #${order.orderNumber}? This cannot be undone.`,
    );

    if (!ok) return;

    try {
      setDeletingId(order.id);

      await deleteDoc(
        doc(db, "orders", order.id),
      );

      setOrders((prev) =>
        prev.filter(
          (item) => item.id !== order.id,
        ),
      );
    } catch (err) {
      console.error(
        "Delete order error:",
        err,
      );

      alert("Failed to delete order.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-custom-bg px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-custom-accent tracking-wide">
              Orders
            </h1>

            <p className="mt-2 text-gray-700">
              View and manage all customer
              orders.
            </p>
          </div>

          <Link
            href="/admin"
            className="
              inline-flex items-center
              rounded-full
              border border-gray-300
              bg-white/80
              px-5 py-3
              text-sm font-semibold
              text-gray-900
              hover:bg-white
              transition
            "
          >
            ← Dashboard
          </Link>
        </div>

        <div className="mt-10 overflow-x-auto rounded-[1.75rem] border border-white/50 bg-white/20 backdrop-blur-xl shadow-xl">
          {loading ? (
            <div className="p-6 text-gray-700">
              Loading orders...
            </div>
          ) : error ? (
            <div className="p-6">
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                {error}
              </div>

              {debugResponse ? (
                <pre className="mt-4 overflow-x-auto rounded-2xl border border-gray-200 bg-white/70 p-4 text-xs text-gray-700">
                  {debugResponse}
                </pre>
              ) : null}
            </div>
          ) : orders.length === 0 ? (
            <div className="p-6 text-gray-700">
              No orders found.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b border-white/40 text-left">
                <tr className="text-gray-800">
                  <th className="p-4">
                    Order
                  </th>

                  <th className="p-4">
                    Customer
                  </th>

                  <th className="p-4">
                    Email
                  </th>

                  <th className="p-4">
                    Phone
                  </th>

                  <th className="p-4">
                    Total
                  </th>

                  <th className="p-4">
                    Fulfillment
                  </th>

                  <th className="p-4">
                    Payment
                  </th>

                  <th className="p-4">
                    Date
                  </th>

                  <th className="p-4 text-right">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-white/30 hover:bg-white/10 transition"
                  >
                    <td className="p-4 font-semibold text-gray-900">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="hover:underline"
                      >
                        #
                        {
                          order.orderNumber
                        }
                      </Link>
                    </td>

                    <td className="p-4 text-gray-800">
                      {
                        order.customerName
                      }
                    </td>

                    <td className="p-4 text-gray-700">
                      {order.email}
                    </td>

                    <td className="p-4 text-gray-700">
                      {order.phone}
                    </td>

                    <td className="p-4 font-medium text-gray-900">
                      {order.total}
                    </td>

                    <td className="p-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getFulfillmentBadgeClass(
                          order.status,
                        )}`}
                      >
                        {formatStatusLabel(
                          order.status,
                        )}
                      </span>
                    </td>

                    <td className="p-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getPaymentBadgeClass(
                          order.paymentStatus,
                        )}`}
                      >
                        {
                          order.paymentStatus
                        }
                      </span>
                    </td>

                    <td className="p-4 text-gray-600">
                      {formatDate(
                        order.createdAt,
                      )}
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() =>
                          onDelete(order)
                        }
                        disabled={
                          deletingId ===
                          order.id
                        }
                        className="
                          inline-flex h-10 w-10 items-center justify-center
                          rounded-full
                          bg-red-50
                          text-red-600
                          hover:bg-red-100
                          transition
                          disabled:opacity-50
                        "
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {!loading && !error && nextCursor ? (
          <div className="mt-6 flex justify-center">
            <button
              onClick={() =>
                fetchOrders(nextCursor)
              }
              disabled={loadingMore}
              className="
                inline-flex items-center
                rounded-full
                border border-gray-300
                bg-white/80
                px-6 py-3
                text-sm font-semibold
                text-gray-900
                hover:bg-white
                transition
                disabled:opacity-60
              "
            >
              {loadingMore
                ? "Loading…"
                : "Load more orders"}
            </button>
          </div>
        ) : null}
      </div>
    </main>
  );
}
