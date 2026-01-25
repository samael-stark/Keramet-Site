"use client";

import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

  const logout = async () => {
    await signOut(auth);
    router.push("/admin/login");
  };

  return (
    <main className="min-h-screen bg-custom-bg px-6 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-custom-accent tracking-wide">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-gray-700">
              Add, edit, and remove products anytime.
            </p>
          </div>

          {/* Logout button – slightly more rounded */}
          <button
            onClick={logout}
            className="
              rounded-xl
              border border-custom-accent/40
              bg-custom-accent
              text-custom-bg
              px-4 py-2
              text-sm font-semibold
              hover:border-custom-accent
              hover:bg-custom-accent-light
              transition
            "
          >
            Logout
          </button>
        </div>

        {/* Cards */}
        <div className="mt-10 grid sm:grid-cols-2 gap-6">
          <Link
            href="/admin/products"
            className="
              rounded-[1.75rem]
              border border-white/50
              bg-white/20
              backdrop-blur-xl
              p-6
              shadow-xl
              hover:shadow-2xl
              transition
            "
          >
            <h2 className="text-xl font-bold text-gray-900">Manage Products</h2>
            <p className="mt-2 text-gray-700">
              View all products, edit, or delete.
            </p>
          </Link>

          <Link
            href="/admin/products/new"
            className="
              rounded-[1.75rem]
              border border-white/50
              bg-white/20
              backdrop-blur-xl
              p-6
              shadow-xl
              hover:shadow-2xl
              transition
            "
          >
            <h2 className="text-xl font-bold text-gray-900">Add New Product</h2>
            <p className="mt-2 text-gray-700">
              Upload images and publish a new rug.
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}
