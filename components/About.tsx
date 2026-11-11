import Link from "next/link";
import {
  FaGlobe,
  FaHandSparkles,
  FaShieldAlt,
  FaTruck,
} from "react-icons/fa";
import SectionHeading from "@/components/home/SectionHeading";

const trustPoints = [
  {
    icon: FaHandSparkles,
    title: "Authentic Handmade Rugs",
    text: "Hand-knotted rugs selected for detail, character, and lasting beauty.",
  },
  {
    icon: FaShieldAlt,
    title: "Quality & Transparency",
    text: "Carefully sourced materials and honest craftsmanship you can trust.",
  },
  {
    icon: FaGlobe,
    title: "Heritage & Craft",
    text: "Rooted in generations of weaving tradition and timeless design.",
  },
  {
    icon: FaTruck,
    title: "Worldwide Delivery",
    text: "Bringing handcrafted rugs from artisans to homes across the world.",
  },
];

export default function About() {
  return (
    <section id="aboutus" className="scroll-mt-32 bg-custom-bg py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Image */}
          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden rounded-sm">
              <img
                src="/img/BannerThree.jpg"
                alt="Keramet Rugs handwoven rug"
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="absolute -bottom-6 right-6 rounded-sm bg-custom-accent px-7 py-5 text-white shadow-xl md:-right-6">
              <p className="font-display text-3xl font-semibold leading-none">
                One of a Kind
              </p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.24em] text-white/80">
                Every rug is unique
              </p>
            </div>
          </div>

          {/* Text */}
          <div>
            <SectionHeading align="left" label="Our Heritage" title="Keramet Rugs" />

            <p className="mt-6 text-base leading-8 text-ink/80 sm:text-lg">
              Keramet Rugs brings together generations of rug heritage, offering
              authentic Afghan and Persian hand-knotted rugs chosen for
              craftsmanship, character, and timeless beauty.
            </p>

            <p className="mt-4 text-base leading-8 text-muted">
              Every piece is selected with care — designed to bring warmth, story,
              and lasting value into your home.
            </p>

            <div className="mt-10 grid gap-x-8 gap-y-7 sm:grid-cols-2">
              {trustPoints.map((point) => {
                const Icon = point.icon;

                return (
                  <div key={point.title} className="flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-custom-accent/25 text-custom-accent">
                      <Icon />
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-ink">
                        {point.title}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-muted">
                        {point.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <Link
              href="/products"
              className="mt-10 inline-flex items-center border-b border-custom-accent pb-1 text-xs font-semibold uppercase tracking-[0.2em] text-custom-accent transition hover:text-custom-accent-light"
            >
              Explore the Collection
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
