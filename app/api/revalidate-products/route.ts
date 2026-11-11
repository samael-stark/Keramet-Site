import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { adminAuth } from "@/lib/firebase-admin";
import { ADMIN_EMAIL } from "@/lib/admin";
import { PRODUCTS_CACHE_TAG } from "@/lib/products-server";

export const runtime = "nodejs";

// Clears the cached product data (home, shop and product pages).
// Only the admin account may call it.
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = await adminAuth.verifyIdToken(authHeader.split("Bearer ")[1]);

    const adminEmail = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || ADMIN_EMAIL).toLowerCase();

    if ((decoded.email || "").toLowerCase() !== adminEmail) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    revalidateTag(PRODUCTS_CACHE_TAG);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Revalidate products error:", error);
    return NextResponse.json({ error: "Failed to refresh" }, { status: 500 });
  }
}
