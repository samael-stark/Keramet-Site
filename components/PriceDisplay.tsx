"use client";

// Prices are stored and charged in USD.
const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export default function PriceDisplay({ basePrice }: { basePrice: number }) {
  return <>{usd.format(Number(basePrice) || 0)}</>;
}
