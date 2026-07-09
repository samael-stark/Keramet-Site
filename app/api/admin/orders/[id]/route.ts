import { NextRequest, NextResponse } from "next/server";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";
import { resend, resendConfig } from "@/lib/resend";
import { getOrderStatusEmailHtml } from "@/lib/email-templates";

type OrderStatus =
  | "order_confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

/**
 * Allowed fulfillment statuses
 */
const ALLOWED_STATUSES: OrderStatus[] = [
  "order_confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

type StatusHistoryItem = {
  status: OrderStatus;
  label?: string;
  createdAt?: any;
  note?: string;
};

function getStatusLabel(status: OrderStatus | string) {
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
      return status;
  }
}

/**
 * ======================
 * GET ORDER
 * ======================
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const docRef = adminDb.collection("orders").doc(id);
    const snapshot = await docRef.get();

    if (!snapshot.exists) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const data = snapshot.data();
    const fulfillmentStatus: OrderStatus =
      (data?.fulfillmentStatus as OrderStatus) || "order_confirmed";

    const statusHistory =
      Array.isArray(data?.statusHistory) && data.statusHistory.length > 0
        ? data.statusHistory.map((item: StatusHistoryItem) => ({
            status: item.status,
            label: item.label || getStatusLabel(item.status),
            createdAt: item.createdAt?.toDate
              ? item.createdAt.toDate().toISOString()
              : null,
            note: item.note || "",
          }))
        : [];

    return NextResponse.json({
      success: true,
      order: {
        id: snapshot.id,
        orderNumber: data?.orderNumber || "",
        fulfillmentStatus,
        fulfillmentStatusLabel: getStatusLabel(fulfillmentStatus),
        paymentStatus: data?.payment?.status || data?.status || "pending",
        createdAt: data?.createdAt?.toDate
          ? data.createdAt.toDate().toISOString()
          : null,
        customer: {
          firstName: data?.customer?.firstName || "",
          lastName: data?.customer?.lastName || "",
          email: data?.customer?.email || "",
          phone: data?.customer?.phone || "",
          country: data?.customer?.country || "",
          city: data?.customer?.city || "",
          addressLine1: data?.customer?.addressLine1 || "",
          addressLine2: data?.customer?.addressLine2 || "",
          postalCode: data?.customer?.postalCode || "",
        },
        items: Array.isArray(data?.items)
          ? data.items.map(
              (item: {
                title?: string;
                image?: string;
                price?: number;
              }) => ({
                title: item.title || "",
                image: item.image || "",
                price: item.price || 0,
              })
            )
          : [],
        pricing: {
          subtotal: data?.pricing?.subtotal || 0,
          shipping: data?.pricing?.shipping || 0,
          total: data?.pricing?.total || 0,
          currency: data?.pricing?.currency || "TRY",
        },
        statusHistory,
      },
    });
  } catch (error) {
    console.error("Get admin order error:", error);
    return NextResponse.json(
      { error: "Failed to load order" },
      { status: 500 }
    );
  }
}

/**
 * ======================
 * UPDATE STATUS
 * ======================
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const status = String(body.status || "").trim() as OrderStatus;
    const note = String(body.note || "").trim();

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      );
    }

    if (!ALLOWED_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    const docRef = adminDb.collection("orders").doc(id);
    const snapshot = await docRef.get();

    if (!snapshot.exists) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const data = snapshot.data();
    const currentStatus: OrderStatus =
      (data?.fulfillmentStatus as OrderStatus) || "order_confirmed";

    if (currentStatus === status) {
      return NextResponse.json(
        { error: "Status is already set to this value" },
        { status: 400 }
      );
    }

    const label = getStatusLabel(status);

    await docRef.update({
      fulfillmentStatus: status,
      updatedAt: FieldValue.serverTimestamp(),
      statusHistory: FieldValue.arrayUnion({
        status,
        label,
        createdAt: Timestamp.now(),
        note: note || "",
      }),
    });

    /**
     * 📧 Send PREMIUM status email
     */
    if (data?.customer?.email) {
      try {
        await resend.emails.send({
          from: resendConfig.from,
          to: data.customer.email,
          subject: `Order Update #${data.orderNumber}`,
          html: getOrderStatusEmailHtml({
            orderNumber: data.orderNumber || "",
            customerName:
              `${data.customer.firstName || ""} ${
                data.customer.lastName || ""
              }`.trim() || "Customer",
            status,
            note,
            trackUrl: "https://kerametrugs.com/track-order",
          }),
        });
      } catch (emailError) {
        console.error("Status email error:", emailError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update admin order error:", error);
    return NextResponse.json(
      { error: "Failed to update order status" },
      { status: 500 }
    );
  }
}
