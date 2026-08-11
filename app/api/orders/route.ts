import { NextRequest, NextResponse } from "next/server";

import {
  FieldValue,
  Timestamp,
} from "firebase-admin/firestore";

import {
  adminAuth,
  adminDb,
} from "@/lib/firebase-admin";

import { generateOrderNumber } from "@/lib/order-utils";

import type {
  FulfillmentStatus,
  OrderDocument,
  OrderItem,
} from "@/lib/order-types";

type CreateOrderRequest = {
  customer: {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    country: string;
    city: string;
    addressLine1: string;
    addressLine2?: string;
    postalCode?: string;
  };

  items: OrderItem[];

  shipping?: number;

  currency?: string;
};

function isValidItem(
  item: any
): item is OrderItem {
  return (
    item &&
    typeof item.productId ===
      "string" &&
    typeof item.title ===
      "string" &&
    typeof item.price ===
      "number" &&
    typeof item.image ===
      "string" &&
    item.quantity === 1
  );
}

function getFulfillmentLabel(
  status: FulfillmentStatus
) {
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

export async function POST(
  req: NextRequest
) {
  try {
    // AUTHORIZATION

    const authHeader =
      req.headers.get(
        "authorization"
      );

    if (
      !authHeader?.startsWith(
        "Bearer "
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Unauthorized request",
        },
        { status: 401 }
      );
    }

    // VERIFY USER

    const idToken =
      authHeader.split(
        "Bearer "
      )[1];

    const decodedToken =
      await adminAuth.verifyIdToken(
        idToken
      );

    // REQUEST BODY

    const body =
      (await req.json()) as CreateOrderRequest;

    // VALIDATIONS

    if (!body.customer) {
      return NextResponse.json(
        {
          error:
            "Customer details are required",
        },
        { status: 400 }
      );
    }

    if (
      !Array.isArray(body.items) ||
      body.items.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "At least one item is required",
        },
        { status: 400 }
      );
    }

    const validItems =
      body.items.every(
        isValidItem
      );

    if (!validItems) {
      return NextResponse.json(
        {
          error:
            "Invalid order items",
        },
        { status: 400 }
      );
    }

    // CHECK PRODUCT STOCK
for (const item of body.items) {
  const productRef = adminDb
    .collection("products")
    .doc(item.productId);

  const productSnap = await productRef.get();

  if (!productSnap.exists) {
    return NextResponse.json(
      {
        error: `Product not found: ${item.title}`,
      },
      { status: 400 }
    );
  }

  const productData = productSnap.data();

  // Existing products without a stock field are treated as available.
  const stock =
    productData?.stock === undefined
      ? 1
      : Number(productData.stock);

  if (stock <= 0) {
    return NextResponse.json(
      {
        error: `${item.title} is no longer available.`,
      },
      { status: 409 }
    );
  }

  // One-of-one product protection.
  if (item.quantity !== 1) {
    return NextResponse.json(
      {
        error: `${item.title} can only be purchased as one unit.`,
      },
      { status: 400 }
    );
  }
}

    // PRICING

    const shipping =
      typeof body.shipping ===
      "number"
        ? body.shipping
        : 0;

    const currency =
      body.currency || "USD";

    const subtotal =
      body.items.reduce(
        (sum, item) =>
          sum + item.price,
        0
      );

    const total =
      subtotal + shipping;

    // ORDER META

    const orderNumber =
      generateOrderNumber();

    const fulfillmentStatus: FulfillmentStatus =
      "order_confirmed";

    const normalizedEmail =
      body.customer.email
        .trim()
        .toLowerCase();

    // ORDER DATA

    const orderData: OrderDocument & {
      emails: {
        customerConfirmationSent: boolean;
        adminNotificationSent: boolean;
        sentAt: null;
      };
    } = {
      orderNumber,

      status: "pending",

      fulfillmentStatus,

      statusHistory: [
        {
          status:
            fulfillmentStatus,

          label:
            getFulfillmentLabel(
              fulfillmentStatus
            ),

          createdAt:
            Timestamp.now(),

          note: "",
        },
      ],

      customer: {
        uid:
          decodedToken.uid,

        email:
          normalizedEmail,

        firstName:
          body.customer
            .firstName,

        lastName:
          body.customer
            .lastName,

        phone:
          body.customer.phone,

        country:
          body.customer
            .country,

        city:
          body.customer.city,

        addressLine1:
          body.customer
            .addressLine1,

        addressLine2:
          body.customer
            .addressLine2 ||
          "",

        postalCode:
          body.customer
            .postalCode ||
          "",
      },

      items: body.items.map(
        (item) => ({
          productId:
            item.productId,

          title:
            item.title,

          price:
            item.price,

          image:
            item.image,

          slug:
            item.slug || "",

          quantity: 1,
        })
      ),

      pricing: {
        subtotal,

        shipping,

        total,

        currency,
      },

      payment: {
        provider: "iyzico",

        status: "pending",

        iyzicoConversationId:
          "",

        iyzicoToken: "",

        paidAt: null,
      },

      // EMAIL FLAGS

      emails: {
        customerConfirmationSent: false,

        adminNotificationSent: false,

        sentAt: null,
      },

      createdAt:
        FieldValue.serverTimestamp(),

      updatedAt:
        FieldValue.serverTimestamp(),
    };

    // CREATE ORDER

    const docRef =
      await adminDb
        .collection("orders")
        .add(orderData);

    console.log(
      "ORDER CREATED:",
      docRef.id
    );

    // RESPONSE

    return NextResponse.json({
      success: true,

      orderId: docRef.id,

      orderNumber,
    });
  } catch (error: any) {
    console.error(
      "CREATE ORDER ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Failed to create order",
      },
      { status: 500 }
    );
  }
}
