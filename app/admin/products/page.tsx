"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { FaPlus, FaTrash } from "react-icons/fa";

type ProductDoc = {
  id: string; // Firestore doc id
  productId?: string; // your custom product id
  title?: string;
  category?: string;
  size?: string;
  price?: number;
  currency?: string; // "USD"
  images?: string[];
  coverUrl?: string;
  createdAt?: any;
};

const ADMIN_EMAIL =
  process.env.NEXT_PUBLIC_ADMIN_EMAIL || "keramethalisecond@gmail.com";

export default function AdminProductsPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [rows, setRows] = useState<ProductDoc[]>([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = useMemo(
    () => (userEmail || "").toLowerCase() === ADMIN_EMAIL.toLowerCase(),
    [userEmail]
  );

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      const email = u?.email || "";
      setUserEmail(email);

      if (!email) router.push("/admin/login");
    });

    return () => unsub();
  }, [router]);

  useEffect(() => {
    if (!isAdmin) return;

    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const list: ProductDoc[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
        }));
        setRows(list);
        setLoading(false);
      },
      () => setLoading(false)
    );

    return () => unsub();
  }, [isAdmin]);

  const logout = async () => {
    await signOut(auth);
    router.push("/admin/login");
  };

  const formatPrice = (p?: number, currency?: string) => {
    if (!p || p <= 0) return "—";
    const cur = (currency || "USD").toUpperCase();
    // You asked USD: show $
    if (cur === "USD") return `$${p.toFixed(2)}`;
    return `${p.toFixed(2)} ${cur}`;
  };

  const getThumb = (p: ProductDoc) => {
    // ✅ This fixes your issue: if coverUrl missing, use images[0]
    return p.coverUrl || p.images?.[0] || "";
  };

  const onDelete = async (product: ProductDoc) => {
    const ok = confirm(
      `Delete product "${product.title || "Untitled"}"? This can't be undone.`
    );
    if (!ok) return;

    await deleteDoc(doc(db, "products", product.id));
  };

  if (!isAdmin && userEmail) {
    return (
      <main className="min-h-screen bg-custom-bg px-6 py-12">
        <div className="max-w-3xl mx-auto rounded-3xl border border-white/50 bg-white/20 backdrop-blur-xl shadow-2xl p-8">
          <h1 className="text-2xl font-extrabold text-custom-accent">
            Admin only
          </h1>
          <p className="mt-2 text-gray-700">
            You are logged in as <b>{userEmail}</b> but admin allowed is{" "}
            <b>{ADMIN_EMAIL}</b>.
          </p>
          <button
            onClick={logout}
            className="mt-6 rounded-xl bg-custom-accent text-custom-bg px-5 py-2.5 font-semibold hover:bg-custom-accent-light transition"
          >
            Logout
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-custom-bg px-6 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-custom-accent tracking-widest uppercase">
              Products
            </h1>
            <p className="mt-2 text-gray-700">
              Manage products. Images show from <b>coverUrl</b> or{" "}
              <b>images[0]</b>.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-2 rounded-full bg-custom-accent px-5 py-2.5 font-semibold text-custom-bg hover:bg-custom-accent-light transition"
            >
              <FaPlus />
              Add Product
            </Link>

            <button
              onClick={logout}
              className="rounded-full border border-gray-300 bg-white/60 px-5 py-2.5 font-semibold text-gray-900 hover:bg-white transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Table Card */}
        <div className="mt-8 rounded-3xl border border-white/50 bg-white/20 backdrop-blur-xl shadow-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/40 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Total: <b>{rows.length}</b>
            </div>
            <div className="text-sm text-gray-700">
              Currency: <b>USD</b>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-gray-700">Loading…</div>
          ) : rows.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-gray-700">No products yet.</p>
              <Link
                href="/admin/products/new"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-custom-accent px-6 py-3 font-semibold text-custom-bg hover:bg-custom-accent-light transition"
              >
                <FaPlus /> Add first product
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="bg-white/30">
                  <tr className="text-xs uppercase tracking-widest text-gray-600">
                    <th className="px-6 py-4">Product ID</th>
                    <th className="px-6 py-4">Image</th>
                    <th className="px-6 py-4">Product Name</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Size</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {rows.map((p) => {
                    const thumb = getThumb(p);

                    return (
                      <tr
                        key={p.id}
                        className="border-t border-white/30 hover:bg-white/20 transition"
                      >
                        <td className="px-6 py-5 font-semibold text-gray-800 whitespace-nowrap">
                          {p.productId || p.id.slice(0, 8).toUpperCase()}
                        </td>

                        <td className="px-6 py-5">
                          <div className="h-14 w-14 rounded-xl overflow-hidden border border-white/50 bg-white/40 flex items-center justify-center">
                            {thumb ? (
                              // ✅ Using <img> avoids Next/Image domain config problems
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={thumb}
                                alt={p.title || "Product"}
                                className="h-full w-full object-cover"
                                loading="lazy"
                              />
                            ) : (
                              <span className="text-xs text-gray-600">
                                No image
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <div className="font-semibold text-gray-900">
                            {p.title || "Untitled"}
                          </div>
                          <div className="text-sm text-gray-600">
                            Doc: {p.id.slice(0, 8)}…
                          </div>
                        </td>

                        <td className="px-6 py-5 text-gray-800">
                          {p.category || "—"}
                        </td>

                        <td className="px-6 py-5 text-gray-800">
                          {p.size || "—"}
                        </td>

                        <td className="px-6 py-5 font-semibold text-gray-900 whitespace-nowrap">
                          {formatPrice(p.price, p.currency || "USD")}
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex justify-end">
                            <button
                              onClick={() => onDelete(p)}
                              className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50/80 px-4 py-2 font-semibold text-red-800 hover:bg-red-100 transition"
                              title="Delete"
                            >
                              <FaTrash />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick note */}
        <p className="mt-6 text-sm text-gray-600">
          If you ever switch to <b>next/image</b> for thumbnails, you must add
          Firebase Storage domain to <code>next.config.js</code>. For now this
          table uses <code>&lt;img&gt;</code> so it always works.
        </p>
      </div>
    </main>
  );
}
