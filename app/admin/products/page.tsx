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
  process.env.NEXT_PUBLIC_ADMIN_EMAIL || "keramethalisecond@gmail.com";

export default function AdminProductsPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [rows, setRows] = useState<ProductDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const isAdmin = useMemo(
    () => (userEmail || "").toLowerCase() === ADMIN_EMAIL.toLowerCase(),
    [userEmail],
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
      () => setLoading(false),
    );

    return () => unsub();
  }, [isAdmin]);

  const logout = async () => {
    await signOut(auth);
    router.push("/admin/login");
  };

  const getThumb = (p: ProductDoc) => p.coverUrl || p.images?.[0] || "";

  const formatPrice = (p?: number, currency?: string) => {
    if (!p || p <= 0) return "—";
    if ((currency || "USD").toUpperCase() === "USD") return `$${p.toFixed(2)}`;
    return `${p.toFixed(2)} ${currency}`;
  };

  const onDelete = async (product: ProductDoc) => {
    const ok = confirm(
      `Delete "${product.title || "Untitled"}"? This cannot be undone.`,
    );
    if (!ok) return;
    await deleteDoc(doc(db, "products", product.id));
  };

  const filteredRows = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return rows;
    return rows.filter((p) =>
      [p.title, p.category, p.description, p.productId, p.id]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [rows, search]);

  if (!isAdmin && userEmail) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="max-w-xl mx-auto bg-white rounded-xl border p-8">
          <h1 className="text-xl font-semibold text-red-600">Admin only</h1>
          <p className="mt-2 text-gray-600">
            Logged in as <b>{userEmail}</b>
          </p>
          <button
            onClick={logout}
            className="mt-6 rounded-md bg-black px-5 py-2 text-white"
          >
            Logout
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
            <p className="text-sm text-gray-500">Manage your store catalog</p>
          </div>

          <div className="flex items-center gap-3 opacity-100">
            {/* Search */}
            <input
              type="text"
              placeholder="Search products"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                h-10 w-60 rounded-md
                border border-gray-300 bg-white
                px-3 text-sm outline-none
                focus:border-black focus:ring-1 focus:ring-black
              "
            />

            {/* ADD PRODUCT — FORCED BLACK */}
            <Link
              href="/admin/products/new"
              className="
                inline-flex h-10 items-center gap-2
                rounded-md
                bg-black !text-white
                px-4 text-sm font-medium
                hover:bg-gray-900
                opacity-100
                pointer-events-auto
                transition
              "
            >
              <FaPlus />
              Add Product
            </Link>

            {/* Logout */}
            <button
              onClick={logout}
              className="
                h-10 rounded-md
                border border-gray-300
                px-4 text-sm
                hover:bg-gray-100
                transition
              "
            >
              Logout
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b flex justify-between text-sm text-gray-600">
            <span>
              Total: <b>{filteredRows.length}</b>
            </span>
            <span>
              Currency: <b>USD</b>
            </span>
          </div>

          {loading ? (
            <div className="p-8 text-gray-600">Loading…</div>
          ) : filteredRows.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              No matching products
            </div>
          ) : (
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase tracking-wide text-xs">
                <tr>
                  <th className="px-6 py-4 text-left">Product</th>
                  <th className="px-6 py-4 text-left">Category</th>
                  <th className="px-6 py-4 text-left">Description</th>
                  <th className="px-6 py-4 text-left">Price</th>
                  <th className="px-6 py-4 text-left">Size</th>
                  <th className="px-6 py-4 text-left">Product ID</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {filteredRows.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-md border bg-gray-100 overflow-hidden">
                          {getThumb(p) && (
                            <img
                              src={getThumb(p)}
                              alt={p.title || "Product"}
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                        <div className="font-medium text-gray-900">
                          {p.title || "Untitled"}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">{p.category || "—"}</td>
                    <td className="px-6 py-4 max-w-xs line-clamp-2">
                      {p.description || "—"}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {formatPrice(p.price, p.currency)}
                    </td>
                    <td className="px-6 py-4">{p.size || "—"}</td>
                    <td className="px-6 py-4 text-gray-500">
                      {p.productId || p.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => onDelete(p)}
                        className="rounded-md p-2 text-red-600 hover:bg-red-50"
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
      </div>
    </main>
  );
}
