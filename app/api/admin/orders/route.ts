import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { requireAdmin } from "@/lib/admin-auth";

const DEFAULT_PAGE_SIZE = 50;
const MAX_PAGE_SIZE = 100;

// Returns the newest orders one page at a time (1 read per order returned)
// instead of every order ever placed on every visit.
// Query params: ?limit=50&after=<orderId of the last row already shown>
export async function GET(req: NextRequest) {
  // Admin only: this returns customer names, emails, phones and addresses.
  const denied = await requireAdmin(req);
  if (denied) return denied;

  try {
    const params = req.nextUrl.searchParams;

    const pageSize = Math.min(
      Math.max(Number(params.get("limit")) || DEFAULT_PAGE_SIZE, 1),
      MAX_PAGE_SIZE,
    );

    const after = params.get("after");

    let query = adminDb
      .collection("orders")
      .orderBy("createdAt", "desc");

    if (after) {
      const cursorSnap = await adminDb.collection("orders").doc(after).get();

      if (cursorSnap.exists) {
        query = query.startAfter(cursorSnap);
      }
    }

    // Fetch one extra to know whether another page exists.
    const snapshot = await query.limit(pageSize + 1).get();

    const docs = snapshot.docs.slice(0, pageSize);
    const hasMore = snapshot.docs.length > pageSize;

    const orders = docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        orderNumber: data.orderNumber || "",
        customerName: `${data.customer?.firstName || ""} ${data.customer?.lastName || ""}`.trim(),
        email: data.customer?.email || "",
        phone: data.customer?.phone || "",
        total: data.pricing?.total || 0,
        status: data.fulfillmentStatus || "order_confirmed",
        paymentStatus: data.payment?.status || data.status || "pending",
        createdAt: data.createdAt?.toDate
          ? data.createdAt.toDate().toISOString()
          : null,
      };
    });

    return NextResponse.json({
      success: true,
      orders,
      hasMore,
      nextCursor: hasMore ? docs[docs.length - 1]?.id || null : null,
    });
  } catch (error: any) {
    console.error("Admin orders fetch error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to fetch orders",
      },
      { status: 500 }
    );
  }
}
