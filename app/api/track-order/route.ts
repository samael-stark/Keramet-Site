import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

function getStatusLabel(status?: string) {
  switch (status) {
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
      return "Order Confirmed";
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const orderNumber = String(body.orderNumber || "").trim();
    const email = String(body.email || "").trim().toLowerCase();

    if (!orderNumber || !email) {
      return NextResponse.json(
        { error: "Order number and email address are required." },
        { status: 400 }
      );
    }

    const snapshot = await adminDb
      .collection("orders")
      .where("orderNumber", "==", orderNumber)
      .where("customer.email", "==", email)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return NextResponse.json(
        { error: "No order matches these details. Please check your order number and email address." },
        { status: 404 }
      );
    }

    const doc = snapshot.docs[0];
    const data = doc.data();

    const fulfillmentStatus = data.fulfillmentStatus || "order_confirmed";
    const statusHistory =
      Array.isArray(data.statusHistory) && data.statusHistory.length > 0
        ? data.statusHistory.map((item: any) => ({
            status: item.status,
            label: item.label || getStatusLabel(item.status),
            createdAt: item.createdAt?.toDate
              ? item.createdAt.toDate().toISOString()
              : null,
            note: item.note || "",
          }))
        : [
            {
              status: fulfillmentStatus,
              label: getStatusLabel(fulfillmentStatus),
              createdAt: data.createdAt?.toDate
                ? data.createdAt.toDate().toISOString()
                : null,
              note: "",
            },
          ];

    return NextResponse.json({
      success: true,
      order: {
        id: doc.id,
        orderNumber: data.orderNumber,
        customerName: `${data.customer?.firstName || ""} ${
          data.customer?.lastName || ""
        }`.trim(),
        email: data.customer?.email || "",
        fulfillmentStatus,
        fulfillmentStatusLabel: getStatusLabel(fulfillmentStatus),
        paymentStatus: data.payment?.status || data.status || "pending",
        createdAt: data.createdAt?.toDate
          ? data.createdAt.toDate().toISOString()
          : null,
        total: data.pricing?.total || 0,
        currency: data.pricing?.currency || "USD",
        items: Array.isArray(data.items)
          ? data.items.map((item: any) => ({
              title: item.title || "",
              image: item.image || "",
              price: item.price || 0,
            }))
          : [],
        statusHistory,
      },
    });
  } catch (error) {
    console.error("Track order error:", error);
    return NextResponse.json(
      { error: "Could not load the order details. Please try again." },
      { status: 500 }
    );
  }
}
