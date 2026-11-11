"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Link from "next/link";
import { FaLock } from "react-icons/fa";
import { CheckoutSteps, CheckoutSummary } from "@/components/checkout/CheckoutParts";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";

type CheckoutItem = {
  id: string;
  title?: string;
  coverUrl?: string;
  price: number;
  category?: string;
  size?: string;
};

type CheckoutPayload = {
  customer: {
    country: string;
    fullName: string;
    streetAddress: string;
    apartment: string;
    city: string;
    postalCode: string;
    countryCode: string;
    phoneNumber: string;
};
  items: CheckoutItem[];
  subtotal: number;
};

export default function CheckoutReviewPage() {
  const router = useRouter();

  const [ready, setReady] = useState(false);
  const [checkoutData, setCheckoutData] = useState<CheckoutPayload | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState("");

  useEffect(() => {
    const raw = sessionStorage.getItem("checkoutDetails");

    if (!raw) {
      router.replace("/checkout");
      return;
    }

    try {
      const parsed = JSON.parse(raw) as CheckoutPayload;

      if (!parsed?.customer || !parsed?.items?.length) {
        router.replace("/checkout");
        return;
      }

      setCheckoutData(parsed);
      setReady(true);
    } catch {
      router.replace("/checkout");
    }
  }, [router]);

  const fullAddress = useMemo(() => {
    if (!checkoutData) return "";

    return [
    checkoutData.customer.streetAddress,
    checkoutData.customer.apartment,
    checkoutData.customer.city,
    checkoutData.customer.postalCode,
    checkoutData.customer.country,
]

      .filter(Boolean)
      .join(", ");
  }, [checkoutData]);

  const fullPhone = useMemo(() => {
    if (!checkoutData) return "";
   return `${checkoutData.customer.countryCode} ${checkoutData.customer.phoneNumber}`.trim();
  }, [checkoutData]);

  const handleEditAddress = () => {
    router.push("/checkout");
  };
// chekout flow edited again for iyizico
const handlePlaceOrder = async () => {
  try {
    setIsSubmitting(true);
    setOrderError("");

    const user = auth.currentUser;

    if (!user) {
      router.push("/auth");
      return;
    }

    if (!checkoutData || !checkoutData.items?.length) {
     setOrderError("Checkout details are missing.");
      return;
    }

    const idToken = await user.getIdToken();

    const trimmedName =
      checkoutData.customer.fullName.trim();

    const nameParts =
      trimmedName.split(/\s+/);

    const firstName =
      nameParts[0] || "Guest";

    const lastName =
      nameParts.slice(1).join(" ") || "-";

    const orderPayload = {
      customer: {
        email: user.email || "",

        firstName,

        lastName,

      phone: `${checkoutData.customer.countryCode} ${checkoutData.customer.phoneNumber}`.trim(),

    country: checkoutData.customer.country,

        city: checkoutData.customer.city,

        addressLine1:
          checkoutData.customer.streetAddress,

      addressLine2:
          checkoutData.customer.apartment || "",

        postalCode:
          checkoutData.customer.postalCode || "",
      },

      items: checkoutData.items.map((item) => ({
        productId: item.id,

        title:
          item.title || "Untitled Product",

        price: Number(item.price || 0),

        image: item.coverUrl || "",

        quantity: 1 as const,
      })),

      shipping: 0,

     currency: "USD",
    };

    // CREATE ORDER

    const orderRes = await fetch(
      "/api/orders",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",

          Authorization: `Bearer ${idToken}`,
        },

        body: JSON.stringify(orderPayload),
      }
    );

    const orderData = await orderRes.json();

    if (!orderRes.ok) {
      throw new Error(
        orderData.error ||
          "Failed to create the order."
      );
    }

    // SAVE ORDER INFO

    sessionStorage.setItem(
      "pendingOrderId",
      orderData.orderId
    );

    sessionStorage.setItem(
      "pendingOrderNumber",
      orderData.orderNumber
    );

    // INITIALIZE IYZICO PAYMENT

    const iyzicoRes = await fetch(
      "/api/iyzico/initialize",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",

          Authorization: `Bearer ${idToken}`,
        },

        body: JSON.stringify({
          orderId: orderData.orderId,
        }),
      }
    );

const responseText =
  await iyzicoRes.text();

console.log(
  "RAW RESPONSE:",
  responseText
);

let iyzicoData: any = {};

try {
  iyzicoData =
    JSON.parse(responseText);
} catch (error) {
  console.error(
    "INVALID JSON RESPONSE:",
    responseText
  );

  setOrderError(
    responseText
  );

  setIsSubmitting(false);

  return;
}
    if (!iyzicoRes.ok) {
      throw new Error(
        iyzicoData.error ||
          "Failed to start the iyzico payment."
      );
    }

    if (!iyzicoData.paymentPageUrl) {
      throw new Error(
        "Could not open the payment page."
      );
    }

    // REDIRECT TO IYZICO HOSTED PAGE

    window.location.href =
      iyzicoData.paymentPageUrl;
  } catch (error: any) {
    console.error(
      "Place order flow failed:",
      error
    );

    setOrderError(
      error.message ||
        "Something went wrong while placing your order."
    );
  } finally {
    setIsSubmitting(false);
  }
};

  if (!ready || !checkoutData) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-custom-bg">
          <PageHero
            title="Payment"
            crumbs={[{ href: "/cart", label: "Cart" }, { href: "/checkout", label: "Delivery" }, { label: "Payment" }]}
          />
          <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10 lg:py-14">
            <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
              <div className="h-80 animate-pulse rounded-sm bg-paper" />
              <div className="h-72 animate-pulse rounded-sm bg-paper" />
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-custom-bg">
        <PageHero
          title="Payment"
          label="Final Step"
          crumbs={[{ href: "/cart", label: "Cart" }, { href: "/checkout", label: "Delivery" }, { label: "Payment" }]}
          subtitle="Check your details, then continue to the secure payment page."
        >
          <CheckoutSteps current={2} />
        </PageHero>

        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10 lg:py-14">
          <div className="grid items-start gap-8 lg:grid-cols-[1fr_400px] lg:gap-12">
            <section className="space-y-6">
              {/* Delivery details */}
              <div className="rounded-sm border border-line bg-paper p-6 md:p-8">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="font-display text-3xl font-semibold text-ink">
                    Delivery Details
                  </h2>
                  <button
                    onClick={handleEditAddress}
                    className="text-xs font-semibold uppercase tracking-[0.14em] text-custom-accent hover:text-custom-accent-light"
                  >
                    Edit
                  </button>
                </div>

                <dl className="mt-6 grid gap-5 sm:grid-cols-2">
                  <div>
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted">
                      Full Name
                    </dt>
                    <dd className="mt-1 text-sm font-semibold text-ink">
                      {checkoutData.customer.fullName}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted">
                      Phone
                    </dt>
                    <dd className="mt-1 text-sm font-semibold text-ink">{fullPhone}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted">
                      Address
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-ink">{fullAddress}</dd>
                  </div>
                </dl>
              </div>

              {/* Payment */}
              <div className="rounded-sm border border-line bg-paper p-6 md:p-8">
                <h2 className="font-display text-3xl font-semibold text-ink">
                  Payment Method
                </h2>

                <div className="mt-6 flex gap-4 rounded-sm border border-custom-accent/30 bg-custom-bg p-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-custom-accent text-white">
                    <FaLock />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">
                      Credit / Debit Card · iyzico
                    </p>
                    <p className="mt-1 text-sm leading-6 text-muted">
                      You will be redirected to iyzico&apos;s secure payment page
                      to complete your order with Visa or Mastercard.
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      {[
                        { src: "/payment-logos/pay_with_iyzico.svg", alt: "Pay with iyzico" },
                        { src: "/payment-logos/Visa_Inc._logo.svg", alt: "Visa" },
                        { src: "/payment-logos/Mastercard-logo.svg", alt: "Mastercard" },
                      ].map((logo) => (
                        <span
                          key={logo.src}
                          className="flex h-9 items-center rounded-sm border border-line bg-paper px-3"
                        >
                          <img src={logo.src} alt={logo.alt} className="h-5 w-auto object-contain" />
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {orderError ? (
                  <p role="alert" className="mt-5 rounded-sm bg-custom-accent/10 px-4 py-3 text-sm text-custom-accent">
                    {orderError}
                  </p>
                ) : null}

                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                  className="mt-6 w-full rounded-full bg-custom-accent px-6 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-white shadow-[0_12px_26px_rgba(96,25,21,0.22)] transition hover:-translate-y-0.5 hover:bg-custom-accent-light disabled:translate-y-0 disabled:opacity-70"
                >
                  {isSubmitting ? "Redirecting to Payment…" : "Continue to Secure Payment"}
                </button>

                <p className="mt-4 text-center text-xs leading-6 text-muted">
                  By continuing to payment, you agree to the{" "}
                  <Link href="/distance-selling-agreement" className="underline hover:text-custom-accent">
                    Distance Sales Agreement
                  </Link>{" "}
                  and{" "}
                  <Link href="/return-policy" className="underline hover:text-custom-accent">
                    Return Policy
                  </Link>
                  .
                </p>
              </div>
            </section>

            <CheckoutSummary items={checkoutData.items} subtotal={checkoutData.subtotal} />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
