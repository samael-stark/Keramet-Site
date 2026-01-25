"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { usePathname, useRouter } from "next/navigation";
import { ADMIN_EMAIL } from "@/lib/admin";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  // ✅ Never guard the login page. No loading UI. No wrappers.
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const [status, setStatus] = useState<"loading" | "ok">("loading");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user: User | null) => {
      // not logged in
      if (!user) {
        router.replace("/admin/login");
        return;
      }

      // not admin
      const email = (user.email || "").toLowerCase();
      if (email !== ADMIN_EMAIL.toLowerCase()) {
        router.replace("/admin/login");
        return;
      }

      setStatus("ok");
    });

    return () => unsub();
  }, [router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-custom-bg flex items-center justify-center">
        <div className="rounded-2xl border border-white/50 bg-white/30 backdrop-blur-xl px-6 py-4 shadow-xl">
          <p className="text-gray-700 font-semibold">Checking admin access…</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
