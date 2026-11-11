import { NextRequest, NextResponse } from "next/server";

import {
  FieldValue,
} from "firebase-admin/firestore";

import { revalidateTag } from "next/cache";

import { adminDb } from "@/lib/firebase-admin";

import { PRODUCTS_CACHE_TAG } from "@/lib/products-server";

import {
  sendEmail,
  resendConfig,
} from "@/lib/resend";

import {
  getCustomerEmailHtml,
  getAdminEmailHtml,
} from "@/lib/email-templates";

class InventoryConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InventoryConflictError";
  }
}

export const runtime = "nodejs";

export const dynamic =
  "force-dynamic";

export async function POST(
  req: NextRequest
) {
  try {
    const Iyzipay =
      eval("require")(
        "iyzipay"
      );

    const iyzipay =
      new Iyzipay({
        apiKey:
          process.env
            .IYZICO_API_KEY || "",

        secretKey:
          process.env
            .IYZICO_SECRET_KEY || "",

        uri:
          process.env
            .IYZICO_BASE_URL ||
          "https://api.iyzipay.com",
      });

    // GET TOKEN

    const formData =
      await req.formData();

    const token =
      formData
        .get("token")
        ?.toString() || "";

    if (!token) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/payment-failed`,
        303
      );
    }

    // VERIFY PAYMENT

    const verifyData: any =
      await new Promise(
        (
          resolve,
          reject
        ) => {
          iyzipay.checkoutForm.retrieve(
            {
              locale: "en",
              token,
            },

            (
              err: any,
              result: any
            ) => {
              if (err) {
                reject(err);
              } else {
                resolve(result);
              }
            }
          );
        }
      );

    console.log(
      "IYZICO VERIFY:",
      verifyData
    );

    // PAYMENT FAILED

    if (
      verifyData.status !==
        "success" ||
      verifyData.paymentStatus !==
        "SUCCESS"
    ) {
      const failedOrderId =
        verifyData.basketId;

      if (failedOrderId) {
        await adminDb
          .collection("orders")
          .doc(failedOrderId)
          .update({
            updatedAt:
              FieldValue.serverTimestamp(),

            "payment.status":
              "failed",

            "payment.failureReason":
              verifyData.errorMessage ||
              "Payment failed",

            "payment.rawResponse":
              verifyData,
          });
      }

      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/payment-failed`,
        303
      );
    }

    // ORDER ID

    const orderId =
      verifyData.basketId;

    if (!orderId) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/payment-failed`,
        303
      );
    }

    const orderRef =
      adminDb
        .collection("orders")
        .doc(orderId);

    // GET ORDER

    const orderSnap =
      await orderRef.get();

    if (!orderSnap.exists) {
      console.error(
        "ORDER NOT FOUND:",
        orderId
      );

      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/payment-failed`,
        303
      );
    }

    const orderData =
      orderSnap.data();

    // DUPLICATE CALLBACK PROTECTION

    if (
      orderData?.payment
        ?.status === "paid"
    ) {
      console.log(
        "ORDER ALREADY PAID:",
        orderId
      );

      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/thank-you?orderId=${orderId}`,
        303
      );
    }

// Product code + stock per product, filled inside the transaction and
// used only in the ADMIN notification email (not the customer email).
const adminStockInfo: Record<
  string,
  { code: string; stockBefore: number; stockAfter: number }
> = {};

// MARK ORDER PAID + CLAIM PRODUCT STOCK ATOMICALLY
await adminDb.runTransaction(async (transaction) => {
  // Re-read the order inside the transaction.
  // This is important for duplicate-callback protection.
  const transactionOrderSnap =
    await transaction.get(orderRef);

  if (!transactionOrderSnap.exists) {
    throw new Error("Order no longer exists.");
  }

  const transactionOrder =
    transactionOrderSnap.data();

  // Another callback may have completed while this
  // callback was running.
  if (
    transactionOrder?.payment?.status ===
    "paid"
  ) {
    return;
  }

  const orderItems =
    Array.isArray(transactionOrder?.items)
      ? transactionOrder.items
      : [];

  if (!orderItems.length) {
    throw new Error(
      "Order contains no products."
    );
  }

  // ---------------------------------------------------
  // READ ALL PRODUCT DOCUMENTS FIRST
  // Firestore transactions require reads before writes.
  // ---------------------------------------------------

  const productRefs = orderItems.map(
    (item: any) =>
      adminDb
        .collection("products")
        .doc(item.productId)
  );

  const productSnapshots = [];

  for (const productRef of productRefs) {
    const productSnap =
      await transaction.get(productRef);

    productSnapshots.push(productSnap);
  }

  // ---------------------------------------------------
  // CHECK STOCK
  // ---------------------------------------------------

  for (
    let index = 0;
    index < productSnapshots.length;
    index++
  ) {
    const productSnap =
      productSnapshots[index];

    const item =
      orderItems[index];

   if (!productSnap.exists) {
  throw new InventoryConflictError(
    `Product not found: ${
      item.title || item.productId
    }`
  );
}

    const productData =
      productSnap.data();

    // Existing products without a stock field
    // are treated as having one available unit.
    const currentStock =
      productData?.stock === undefined
        ? 1
        : Number(productData.stock);

    // For the admin email: product code + stock before/after this sale.
    adminStockInfo[item.productId] = {
      code: String(productData?.productId || item.productCode || ""),
      stockBefore: currentStock,
      stockAfter: 0,
    };

  if (
  !Number.isFinite(currentStock) ||
  currentStock <= 0
) {
  throw new InventoryConflictError(
    `Product is already sold: ${
      item.title || item.productId
    }`
  );
}

    // One-of-one product protection.
if (Number(item.quantity) !== 1) {
  throw new InventoryConflictError(
    `Invalid quantity for product: ${
      item.title || item.productId
    }`
  );
}
  }

  // ---------------------------------------------------
  // UPDATE PRODUCT STOCK
  // ---------------------------------------------------

  for (
    let index = 0;
    index < productSnapshots.length;
    index++
  ) {
    const productRef =
      productRefs[index];

    transaction.update(productRef, {
      stock: 0,
      updatedAt:
        FieldValue.serverTimestamp(),
    });
  }

  // ---------------------------------------------------
  // MARK ORDER AS PAID
  // ---------------------------------------------------

  transaction.update(orderRef, {
    updatedAt:
      FieldValue.serverTimestamp(),

    status: "paid",

    orderStatus:
      "processing",

    fulfillmentStatus:
      "order_confirmed",

    "payment.status":
      "paid",

    "payment.provider":
      "iyzico",

    "payment.paidAt":
      FieldValue.serverTimestamp(),

    "payment.paymentId":
      verifyData.paymentId ||
      "",

    "payment.conversationId":
      verifyData.conversationId ||
      "",

    "payment.currency":
  verifyData.currency ||
  "USD",

    "payment.paidPrice":
      verifyData.paidPrice ||
      "",

    "payment.rawResponse":
      verifyData,
  });
});

    // The sold rug's stock is now 0: clear the cached shop/home/product
    // pages so it disappears from the store immediately.
    try {
      revalidateTag(PRODUCTS_CACHE_TAG);
    } catch (revalidateError) {
      console.error("PRODUCT CACHE REVALIDATE ERROR:", revalidateError);
    }

    // REFETCH UPDATED ORDER

    const updatedSnap =
      await orderRef.get();

    const updatedOrder =
      updatedSnap.data();

// SEND EMAILS

const customerEmail = updatedOrder?.customer?.email;

const customerName =
  `${updatedOrder?.customer?.firstName || ""} ${
    updatedOrder?.customer?.lastName || ""
  }`.trim() || "Customer";

const alreadyCustomerSent =
  updatedOrder?.emails?.customerConfirmationSent === true;

const alreadyAdminSent =
  updatedOrder?.emails?.adminNotificationSent === true;

// CUSTOMER CONFIRMATION EMAIL

if (customerEmail && !alreadyCustomerSent) {
  try {
    await sendEmail({
      from: resendConfig.from,

      to: customerEmail,

      subject: `Order Confirmed #${updatedOrder?.orderNumber}`,

      html: getCustomerEmailHtml({
        orderNumber: updatedOrder?.orderNumber || "",

        customerName,

        email: customerEmail,

        phone:
          updatedOrder?.customer?.phone || "",

        total:
          updatedOrder?.pricing?.total || 0,

        items:
          updatedOrder?.items || [],
      }),
    });

    await orderRef.update({
      "emails.customerConfirmationSent": true,
    });

    console.log(
      "CUSTOMER CONFIRMATION EMAIL SENT:",
      orderId
    );
  } catch (emailError) {
    console.error(
      "CUSTOMER EMAIL SEND ERROR:",
      emailError
    );
  }
}

// ADMIN NOTIFICATION EMAIL

if (!alreadyAdminSent) {
  try {
    await sendEmail({
      from: resendConfig.from,

      to: resendConfig.adminEmail,

      subject: `New Order Received #${updatedOrder?.orderNumber}`,

      html: getAdminEmailHtml({
        orderNumber:
          updatedOrder?.orderNumber || "",

        customerName,

        email: customerEmail || "",

        phone:
          updatedOrder?.customer?.phone || "",

        total:
          updatedOrder?.pricing?.total || 0,

        items: (updatedOrder?.items || []).map(
          (item: any) => {
            const info =
              adminStockInfo[item.productId];

            return {
              ...item,
              productCode:
                info?.code ||
                item.productCode ||
                "",
              stockBefore: info?.stockBefore,
              stockAfter: info?.stockAfter,
            };
          }
        ),
      }),
    });

    await orderRef.update({
      "emails.adminNotificationSent": true,
    });

    console.log(
      "ADMIN NOTIFICATION EMAIL SENT:",
      orderId
    );
  } catch (emailError) {
    console.error(
      "ADMIN EMAIL SEND ERROR:",
      emailError
    );
  }
}

    // SUCCESS REDIRECT

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/thank-you?orderId=${orderId}`,
      303
    );
} catch (error) {
  console.error(
    "IYZICO CALLBACK ERROR:",
    error
  );

  if (
    error instanceof InventoryConflictError
  ) {
    console.error(
      "INVENTORY CONFLICT AFTER SUCCESSFUL PAYMENT:",
      error.message
    );

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/payment-failed?reason=inventory`,
      303
    );
  }

  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/payment-failed`,
    303
  );
}
}
