import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import { PRODUCTS_CACHE_TAG } from "@/lib/products-server";

export const runtime = "nodejs";

// Clears the cached product data (home, shop and product pages).
// Only the admin account may call it.
export async function POST(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  try {
    revalidateTag(PRODUCTS_CACHE_TAG);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Revalidate products error:", error);
    return NextResponse.json({ error: "Failed to refresh" }, { status: 500 });
  }
}
