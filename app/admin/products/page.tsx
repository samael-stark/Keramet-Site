"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { refreshProductCache } from "@/lib/products-client";

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";

import { useRouter } from "next/navigation";

import { FaPlus, FaTrash } from "react-icons/fa";

type ProductDoc = {
  id: string;
  productId?: string;
  title?: string;
  category?: string;
  description?: string;
  size?: string;
  price?: number;
  currency?: string;
  images?: string[];
  coverUrl?: string;
  createdAt?: any;
};

const ADMIN_EMAIL =
  process.env.NEXT_PUBLIC_ADMIN_EMAIL ||
  "keramethalisecond@gmail.com";

export default function AdminProductsPage() {
  const router = useRouter();

  const [userEmail, setUserEmail] = useState("");

  const [rows, setRows] = useState<ProductDoc[]>([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const isAdmin = useMemo(
    () =>
      (userEmail || "").toLowerCase() ===
      ADMIN_EMAIL.toLowerCase(),
    [userEmail],
  );

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      const email = u?.email || "";

      setUserEmail(email);

      if (!email) {
        router.push("/admin/login");
      }
    });

    return () => unsub();
  }, [router]);

  // One-time load (1 read per product) instead of a live listener, which
  // re-read the whole collection every time this page was opened and kept
  // reading on every change. Use the Refresh button to reload.
  const loadProducts = useCallback(async () => {
    setLoading(true);

    try {
      const snap = await getDocs(
        query(
          collection(db, "products"),
          orderBy("createdAt", "desc"),
        ),
      );

      setRows(
        snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
        })),
      );
    } catch (err) {
      console.error("Load products failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAdmin) return;

    loadProducts();
  }, [isAdmin, loadProducts]);

  const logout = async () => {
    await signOut(auth);

    router.push("/admin/login");
  };

  const getThumb = (p: ProductDoc) =>
    p.coverUrl || p.images?.[0] || "";

  const formatPrice = (
    p?: number,
    currency?: string,
  ) => {
    if (!p || p <= 0) return "—";

    if (
      (currency || "USD").toUpperCase() === "USD"
    ) {
      return `$${p.toFixed(2)}`;
    }

    return `${p.toFixed(2)} ${currency}`;
  };

  const onDelete = async (product: ProductDoc) => {
    const ok = confirm(
      `Delete "${
        product.title || "Untitled"
      }"? This cannot be undone.`,
    );

    if (!ok) return;

    try {
  await deleteDoc(doc(db, "products", product.id));
  setRows((prev) => prev.filter((p) => p.id !== product.id));
  await refreshProductCache();
  console.log("Deleted successfully");
} catch (err) {
  console.error("Delete failed:", err);
  alert(String(err));
}
  };

  const filteredRows = useMemo(() => {
    const q = search.toLowerCase();

    if (!q) return rows;

    return rows.filter((p) =>
      [
        p.title,
        p.category,
        p.description,
        p.productId,
        p.id,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [rows, search]);

  if (!isAdmin && userEmail) {
    return (
      <main className="min-h-screen bg-custom-bg px-6 py-12">
        <div className="max-w-xl mx-auto rounded-3xl border border-gray-200/70 bg-white/70 backdrop-blur shadow-[0_18px_60px_rgba(0,0,0,0.08)] p-8">
          <h1 className="text-2xl font-bold text-red-600">
            Admin only
          </h1>

          <p className="mt-3 text-gray-700">
            Logged in as <b>{userEmail}</b>
          </p>

          <button
            onClick={logout}
            className="mt-6 rounded-full bg-black px-6 py-3 font-semibold text-white hover:bg-gray-900 transition"
          >
            Logout
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-custom-bg px-6 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-custom-accent tracking-widest uppercase">
              Products
            </h1>

            <p className="mt-2 text-gray-700">
              Manage your store catalog and inventory.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <input
              type="text"
              placeholder="Search products"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="
                h-11 w-64 rounded-full
                border border-gray-200
                bg-white/80 backdrop-blur
                px-5 text-sm text-gray-900
                outline-none
                focus:ring-2 focus:ring-custom-accent
              "
            />

            {/* Refresh */}
            <button
              onClick={loadProducts}
              disabled={loading}
              className="
                h-11 rounded-full
                border border-gray-300
                bg-white/80
                px-5 text-sm font-semibold
                text-gray-900
                hover:bg-white
                transition
                disabled:opacity-60
              "
            >
              {loading ? "Loading…" : "Refresh"}
            </button>

            {/* Add Product */}
            <Link
              href="/admin/products/new"
              className="
                inline-flex h-11 items-center gap-2
                rounded-full
                bg-custom-accent
                px-5 text-sm font-bold
                text-custom-bg
                hover:bg-custom-accent-light
                transition
              "
            >
              <FaPlus />
              Add Product
            </Link>

            {/* Dashboard */}
            <Link
              href="/admin"
              className="
                inline-flex h-11 items-center
                rounded-full
                border border-gray-300
                bg-white/80
                px-5 text-sm font-semibold
                text-gray-900
                hover:bg-white
                transition
              "
            >
              ← Dashboard
            </Link>

            {/* Logout */}
            <button
              onClick={logout}
              className="
                h-11 rounded-full
                border border-gray-300
                bg-white/80
                px-5 text-sm font-semibold
                text-gray-900
                hover:bg-white
                transition
              "
            >
              Logout
            </button>
          </div>
        </div>

        {/* Table Card */}
        <div className="overflow-hidden rounded-3xl border border-gray-200/70 bg-white/70 backdrop-blur shadow-[0_18px_60px_rgba(0,0,0,0.08)]">
          {/* Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200/60 px-6 py-5 text-sm text-gray-700">
            <span>
              Total Products:{" "}
              <b>{filteredRows.length}</b>
            </span>

            <span>
              Currency: <b>USD</b>
            </span>
          </div>

          {loading ? (
            <div className="p-8 text-gray-700">
              Loading products...
            </div>
          ) : filteredRows.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No matching products found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="border-b border-gray-200/60 bg-white/40 text-left text-xs uppercase tracking-wider text-gray-600">
                  <tr>
                    <th className="px-6 py-4">
                      Product
                    </th>

                    <th className="px-6 py-4">
                      Category
                    </th>

                    <th className="px-6 py-4">
                      Description
                    </th>

                    <th className="px-6 py-4">
                      Price
                    </th>

                    <th className="px-6 py-4">
                      Size
                    </th>

                    <th className="px-6 py-4">
                      Product ID
                    </th>

                    <th className="px-6 py-4 text-right">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredRows.map((p) => (
                    <tr
                      key={p.id}
                      className="border-b border-gray-100 hover:bg-white/40 transition"
                    >
                      {/* Product */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="h-16 w-16 overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
                            {getThumb(p) && (
                              <img
                                src={getThumb(p)}
                                alt={
                                  p.title || "Product"
                                }
                                className="h-full w-full object-cover"
                              />
                            )}
                          </div>

                          <div>
                            <div className="font-bold text-gray-900">
                              {p.title || "Untitled"}
                            </div>

                            <div className="mt-1 text-xs text-gray-500">
                              Firestore ID:{" "}
                              {p.id.slice(0, 8)}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-5 text-gray-700">
                        {p.category || "—"}
                      </td>

                      {/* Description */}
                      <td className="max-w-xs px-6 py-5 text-gray-600 line-clamp-2">
                        {p.description || "—"}
                      </td>

                      {/* Price */}
                      <td className="px-6 py-5 font-semibold text-gray-900">
                        {formatPrice(
                          p.price,
                          p.currency,
                        )}
                      </td>

                      {/* Size */}
                      <td className="px-6 py-5 text-gray-700">
                        {p.size || "—"}
                      </td>

                      {/* Product ID */}
                      <td className="px-6 py-5">
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">
                          {p.productId ||
                            p.id
                              .slice(0, 8)
                              .toUpperCase()}
                        </span>
                      </td>

                      {/* Actions */}
                     <td className="px-6 py-5 text-right">
  <div className="flex justify-end gap-2">
    <Link
      href={`/admin/products/edit/${p.id}`}
      className="
        inline-flex h-10 w-10 items-center justify-center
        rounded-full
        bg-blue-50
        text-blue-600
        hover:bg-blue-100
        transition
      "
    >
      ✏️
    </Link>

    <button
      onClick={() => onDelete(p)}
      className="
        inline-flex h-10 w-10 items-center justify-center
        rounded-full
        bg-red-50
        text-red-600
        hover:bg-red-100
        transition
      "
    >
      <FaTrash />
    </button>
  </div>
</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
