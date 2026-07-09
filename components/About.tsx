import {
  FaGlobe,
  FaHandSparkles,
  FaShieldAlt,
  FaTruck,
} from "react-icons/fa";

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
    <section id="aboutus" className="bg-custom-bg py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        {/* Heading */}
        <div className="text-center">
          <h3 className="text-sm font-medium uppercase tracking-[0.28em] text-gray-600">
            Our Heritage
          </h3>

          <h2 className="mt-3 text-3xl font-extrabold text-custom-accent sm:text-4xl">
            About Keramet Rugs
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#5c554d] sm:text-lg">
            Keramet Rugs brings together generations of rug heritage, offering
            authentic Afghan and Persian hand-knotted rugs chosen for
            craftsmanship, character, and timeless beauty.
          </p>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#736b61] sm:text-base">
            Every piece is selected with care — designed to bring warmth, story,
            and lasting value into your home.
          </p>
        </div>

        {/* Trust Points */}
        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {trustPoints.map((point) => {
            const Icon = point.icon;

            return (
              <div
                key={point.title}
                className="text-center px-4"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f5ece6] text-custom-accent">
                  <Icon className="text-xl" />
                </div>

                <h4 className="mt-5 text-lg font-semibold text-[#2d2823]">
                  {point.title}
                </h4>

                <p className="mt-3 text-sm leading-7 text-[#6d655c]">
                  {point.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
