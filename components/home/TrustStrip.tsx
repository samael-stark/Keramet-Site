import { FaHandSparkles, FaLock, FaTruck, FaPhoneAlt } from "react-icons/fa";

// Short value points shown right under the hero.
// Keep every claim here true for the store (see the shipping policy).
const points = [
  {
    icon: FaHandSparkles,
    title: "Handwoven & One of a Kind",
    text: "Every rug is a unique piece",
  },
  {
    icon: FaTruck,
    title: "Worldwide Delivery",
    text: "Shipped from Turkey in 15–30 days",
  },
  {
    icon: FaLock,
    title: "Secure Payment",
    text: "Protected by iyzico",
  },
  {
    icon: FaPhoneAlt,
    title: "Personal Support",
    text: "Let us help you choose the right rug",
  },
];

export default function TrustStrip() {
  return (
    <section className="border-b border-line bg-paper">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-6 px-6 py-8 lg:grid-cols-4 lg:px-10">
        {points.map((point, i) => {
          const Icon = point.icon;

          return (
            <div
              key={point.title}
              className={`flex items-center gap-4 lg:justify-center ${
                i > 0 ? "lg:border-l lg:border-line" : ""
              }`}
            >
              <Icon className="shrink-0 text-xl text-custom-accent" />
              <div>
                <p className="text-sm font-semibold text-ink">{point.title}</p>
                <p className="mt-0.5 text-xs text-muted">{point.text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
