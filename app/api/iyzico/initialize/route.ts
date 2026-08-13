import { NextRequest, NextResponse } from "next/server";

import { FieldValue } from "firebase-admin/firestore";

import {
  adminAuth,
  adminDb,
} from "@/lib/firebase-admin";

export const runtime = "nodejs";

export const dynamic =
  "force-dynamic";

export async function POST(
  req: NextRequest
) {
  try {
    const Iyzipay =
      require("iyzipay");

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

    // AUTH

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
            "Unauthorized",
        },
        { status: 401 }
      );
    }

    const idToken =
      authHeader.split(
        "Bearer "
      )[1];

    const decodedToken =
      await adminAuth.verifyIdToken(
        idToken
      );

    // BODY

    const body =
      await req.json();

    const orderId =
      body.orderId;

    if (!orderId) {
      return NextResponse.json(
        {
          error:
            "Order ID required",
        },
        { status: 400 }
      );
    }

    // GET ORDER

    const orderRef =
      adminDb
        .collection("orders")
        .doc(orderId);

    const orderSnap =
      await orderRef.get();

    if (!orderSnap.exists) {
      return NextResponse.json(
        {
          error:
            "Order not found",
        },
        { status: 404 }
      );
    }

    const order =
      orderSnap.data();

    if (!order) {
      return NextResponse.json(
        {
          error:
            "Order missing",
        },
        { status: 404 }
      );
    }

    // SECURITY

    if (
      order.customer?.uid !==
      decodedToken.uid
    ) {
      return NextResponse.json(
        {
          error:
            "Forbidden",
        },
        { status: 403 }
      );
    }

 const origin =
  process.env.NEXT_PUBLIC_SITE_URL ||
  req.nextUrl.origin;

console.log("================================");
console.log("SITE URL ENV:", process.env.NEXT_PUBLIC_SITE_URL);
console.log("REQUEST ORIGIN:", req.nextUrl.origin);
console.log("ORIGIN USED:", origin);
console.log("CALLBACK URL:", `${origin}/api/iyzico/callback`);
console.log("================================");

    const conversationId = `ORDER_${Date.now()}`;

    // CREATE PAYMENT

    const iyzicoData: any =
      await new Promise(
        (
          resolve,
          reject
        ) => {
          iyzipay.checkoutFormInitialize.create(
            {
              locale: "en",

              conversationId,

              price: Number(
                order.pricing
                  ?.subtotal || 0
              ).toFixed(2),

              paidPrice: Number(
                order.pricing
                  ?.total || 0
              ).toFixed(2),

              currency:
                "USD",

              basketId:
                orderId,

              paymentGroup:
                "PRODUCT",

              callbackUrl: `${origin}/api/iyzico/callback`,

              enabledInstallments:
                [1],

              buyer: {
                id:
                  order.customer
                    ?.uid ||
                  "customer",

                name:
                  order.customer
                    ?.firstName ||
                  "Customer",

                surname:
                  order.customer
                    ?.lastName ||
                  "User",

                gsmNumber:
                  order.customer
                    ?.phone ||
                  "+10000000000",

                email:
                  order.customer
                    ?.email ||
                  "test@test.com",

                identityNumber:
                  "11111111111",

                registrationAddress:
                  order.customer
                    ?.addressLine1 ||
                  "Address",

                city:
                  order.customer
                    ?.city ||
                  "City",

                country:
                  order.customer
                    ?.country ||
                  "Country",

                zipCode:
                  order.customer
                    ?.postalCode ||
                  "00000",

                ip:
                  req.headers.get(
                    "x-forwarded-for"
                  ) ||
                  "127.0.0.1",
              },

              shippingAddress:
                {
                  contactName: `${order.customer?.firstName || ""} ${
                    order.customer?.lastName ||
                    ""
                  }`,

                  city:
                    order.customer
                      ?.city ||
                    "City",

                  country:
                    order.customer
                      ?.country ||
                    "Country",

                  address:
                    order.customer
                      ?.addressLine1 ||
                    "Address",

                  zipCode:
                    order.customer
                      ?.postalCode ||
                    "00000",
                },

              billingAddress:
                {
                  contactName: `${order.customer?.firstName || ""} ${
                    order.customer?.lastName ||
                    ""
                  }`,

                  city:
                    order.customer
                      ?.city ||
                    "City",

                  country:
                    order.customer
                      ?.country ||
                    "Country",

                  address:
                    order.customer
                      ?.addressLine1 ||
                    "Address",

                  zipCode:
                    order.customer
                      ?.postalCode ||
                    "00000",
                },

              basketItems:
                (
                  order.items ||
                  []
                ).map(
                  (
                    item: any,
                    index: number
                  ) => ({
                    id:
                      item.productId ||
                      `item_${index}`,

                    name:
                      item.title ||
                      "Product",

                    category1:
                      "Carpet",

                    itemType:
                      "PHYSICAL",

                    price:
                      Number(
                        item.price ||
                          0
                      ).toFixed(
                        2
                      ),
                  })
                ),
            },

            function (
              err: any,
              result: any
            ) {
              if (err) {
                console.error(
                  "IYZICO SDK ERROR:",
                  err
                );

                reject(err);
              } else {
                resolve(
                  result
                );
              }
            }
          );
        }
      );

    console.log(
      "IYZICO RESPONSE:",
      iyzicoData
    );

    // FAILED

    if (
      iyzicoData.status !==
      "success"
    ) {
      await orderRef.update({
        updatedAt:
          FieldValue.serverTimestamp(),

        "payment.status":
          "failed",
      });

      return NextResponse.json(
        {
          error:
            iyzicoData.errorMessage ||
            "Payment initialize failed",

          iyzico:
            iyzicoData,
        },
        { status: 400 }
      );
    }

    // SAVE PAYMENT

    await orderRef.update({
      updatedAt:
        FieldValue.serverTimestamp(),

      "payment.status":
        "pending",

      "payment.conversationId":
        conversationId,

      "payment.token":
        iyzicoData.token,

      "payment.paymentPageUrl":
        iyzicoData.paymentPageUrl,
    });

    // SUCCESS

    return NextResponse.json({
      success: true,

      paymentPageUrl:
        iyzicoData.paymentPageUrl,

      token:
        iyzicoData.token,
    });
  } catch (error) {
    console.error(
      "IYZICO INIT ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          (error as Error)
            ?.message ||
          "Payment initialization failed",
      },
      { status: 500 }
    );
  }
}
