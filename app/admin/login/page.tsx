"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ADMIN_EMAIL =
  process.env.NEXT_PUBLIC_ADMIN_EMAIL || "keramethalisecond@gmail.com";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        setError(`Admin only. Use ${ADMIN_EMAIL}`);
        setLoading(false);
        return;
      }

      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin");
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-custom-bg min-h-[100dvh] flex items-center justify-center py-20">
      {/* WRAPPER */}
      <div className="w-full max-w-[1200px] px-8">
        <div className="grid lg:grid-cols-2 items-center gap-20">
          {/* LEFT SIDE */}
          <div className="hidden lg:flex flex-col items-center text-center">
            <img
              src="/img/Kerametlogo.png"
              alt="Keramet Hali Logo"
              className="h-12 w-12 object-contain"
            />

            <h1 className="mt-2 text-2xl font-extrabold tracking-widest text-custom-accent uppercase">
              Keramet Hali
            </h1>

            <p className="mt-0.5 text-[11px] tracking-[0.35em] uppercase text-gray-700">
              Admin Portal
            </p>
          </div>

          {/* RIGHT SIDE */}
          {/* ✅ key change: move box a bit LEFT only on large screens */}
          <div className="w-full max-w-md mx-auto lg:mx-0 lg:justify-self-start">
            <div className="text-center mb-6">
              <h2 className="text-4xl font-light text-gray-900">Welcome</h2>
              <p className="mt-2 text-xs tracking-[0.35em] uppercase text-gray-600">
                Please login to admin dashboard.
              </p>
            </div>

            <div className="rounded-3xl border border-white/50 bg-white/20 backdrop-blur-xl shadow-2xl p-6">
              <form onSubmit={onSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold tracking-widest uppercase mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-2xl border bg-white/70 px-4 py-3 focus:ring-2 focus:ring-custom-accent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold tracking-widest uppercase mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl border bg-white/70 px-4 py-3 focus:ring-2 focus:ring-custom-accent outline-none"
                  />
                </div>

                {error && (
                  <div className="text-sm text-red-800 bg-red-50 border border-red-200 rounded-xl p-3">
                    {error}
                  </div>
                )}

                <button
                  disabled={loading}
                  className="w-full rounded-2xl bg-custom-accent text-custom-bg py-3 font-semibold hover:bg-custom-accent-light transition disabled:opacity-60"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>

                <div className="text-center">
                  <Link
                    href="/"
                    className="text-sm font-semibold text-custom-accent hover:underline"
                  >
                    ← Back to website
                  </Link>
                </div>
              </form>
            </div>

            <p className="mt-4 text-center text-xs text-gray-500">
              Restricted to store administrators only.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
