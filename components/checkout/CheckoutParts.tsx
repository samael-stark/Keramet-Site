import PriceDisplay from "@/components/PriceDisplay";
import { normalizeCategory } from "@/lib/categories";
import { FaCreditCard, FaLock, FaTruck } from "react-icons/fa";

// Shared pieces for the checkout pages (delivery + payment review).

const STEPS = ["Cart", "Delivery", "Payment"];

export function CheckoutSteps({ current }: { current: 1 | 2 }) {
  return (
    <ol className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em]">
      {STEPS.map((step, index) => {
        const done = index < current;
        const active = index === current;

        return (
          <li key={step} className="flex items-center gap-3">
            <span
              className={`flex items-center gap-2 ${
                active ? "text-custom-accent" : done ? "text-ink/70" : "text-muted"
              }`}
            >
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] ${
                  active
                    ? "bg-custom-accent text-white"
                    : done
                      ? "bg-ink/15 text-ink"
                      : "border border-line text-muted"
                }`}
              >
                {done ? "✓" : index + 1}
              </span>
              <span className="hidden sm:inline">{step}</span>
            </span>
            {index < STEPS.length - 1 ? <span className="h-px w-6 bg-line sm:w-10" /> : null}
          </li>
        );
      })}
    </ol>
  );
}

type SummaryItem = {
  id: string;
  title?: string;
  coverUrl?: string;
  price?: number;
  category?: string;
  size?: string;
};

export function CheckoutSummary({
  items,
  subtotal,
  children,
}: {
  items: SummaryItem[];
  subtotal: number;
  children?: React.ReactNode;
}) {
  return (
    <aside className="lg:sticky lg:top-32">
      <div className="rounded-sm border border-line bg-paper p-7">
        <h2 className="font-display text-3xl font-semibold text-ink">Order Summary</h2>

        <ul className="mt-6 divide-y divide-line">
          {items.map((item) => {
            const category = normalizeCategory(item.category);

            return (
              <li key={item.id} className="flex gap-4 py-4 first:pt-0">
                <div className="w-16 shrink-0 overflow-hidden rounded-sm bg-[#efe8dc]">
                  <div className="aspect-[3/4]">
                    {item.coverUrl ? (
                      <img
                        src={item.coverUrl}
                        alt={item.title || "Product"}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm leading-snug text-ink">
                    {item.title || "Untitled Product"}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {category || "Rug"}
                    {item.size ? ` · ${item.size}` : ""}
                  </p>
                  <p className="mt-1.5 text-sm font-semibold text-custom-accent">
                    <PriceDisplay basePrice={Number(item.price || 0)} />
                  </p>
                </div>
              </li>
            );
          })}
        </ul>

        <dl className="mt-4 space-y-3 border-t border-line pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Subtotal</dt>
            <dd className="font-semibold text-ink">
              <PriceDisplay basePrice={subtotal} />
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Delivery</dt>
            <dd className="font-semibold text-[#2e7d4e]">Free</dd>
          </div>
          <div className="flex items-baseline justify-between border-t border-line pt-4">
            <dt className="font-semibold text-ink">Total</dt>
            <dd className="text-2xl font-semibold text-custom-accent">
              <PriceDisplay basePrice={subtotal} />
            </dd>
          </div>
        </dl>

        {children}

        <ul className="mt-6 space-y-2.5 text-xs text-muted">
          <li className="flex items-center gap-2.5">
            <FaLock className="text-custom-accent" />
            Secure payment with iyzico
          </li>
          <li className="flex items-center gap-2.5">
            <FaCreditCard className="text-custom-accent" />
            Visa and Mastercard accepted
          </li>
          <li className="flex items-center gap-2.5">
            <FaTruck className="text-custom-accent" />
            Shipped worldwide, delivered in 3–7 days
          </li>
        </ul>
      </div>
    </aside>
  );
}

// Simple centered state box (loading / empty).
export function StateCard({
  title,
  text,
  children,
}: {
  title: string;
  text?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-xl rounded-sm border border-line bg-paper px-8 py-16 text-center">
      <h2 className="font-display text-4xl font-semibold text-ink">{title}</h2>
      {text ? <p className="mt-3 text-sm leading-7 text-muted">{text}</p> : null}
      {children}
    </div>
  );
}
