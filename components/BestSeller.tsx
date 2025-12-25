"use client";

import { useRef } from "react";
import { FaArrowRight, FaChevronLeft, FaChevronRight } from "react-icons/fa";

type Product = {
  id: string;
  title: string;
  image1: string;
  image2: string; // hover image (same for now)
};

const products: Product[] = [
  {
    id: "1",
    title: "Handmade Neutral Turkish Oushak Wool Runner Rug (2’10” x 9’8”)",
    image1: "/img/sample.jpg",
    image2: "/img/sample.jpg",
  },
  {
    id: "2",
    title: "Handmade Boho Nomadic Afghan Tribal Wool Rug (4’ x 6’)",
    image1: "/img/sample.jpg",
    image2: "/img/sample.jpg",
  },
  {
    id: "3",
    title: "Handmade Neutral Turkish Oushak Wool Runner Rug (3’0” x 9’8”)",
    image1: "/img/sample.jpg",
    image2: "/img/sample.jpg",
  },
  {
    id: "4",
    title: "Handmade Burgundy Fine Afghan Khal Mohammadi Wool Rug (3’4” x …)",
    image1: "/img/sample.jpg",
    image2: "/img/sample.jpg",
  },
  {
    id: "5",
    title: "Handmade Vintage Afghan Wool Rug (5’ x 8’)",
    image1: "/img/sample.jpg",
    image2: "/img/sample.jpg",
  },
];

export default function BestSeller() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;

    // scroll by almost one "card", feels natural
    const amount = el.clientWidth * 0.55;

    el.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-20 bg-custom-bg border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Heading */}
        <div className="text-center mb-14">
          <h3 className="text-sm font-medium text-gray-600 uppercase tracking-widest">
            Our Top Picks
          </h3>
          <h2 className="text-4xl font-extrabold text-gray-800 mt-2">
            Our Best Seller
          </h2>
        </div>

        {/* Slider */}
        <div className="relative">
          {/* Left button */}
          <button
            onClick={() => scroll("left")}
            className="hidden lg:flex absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 p-3 bg-white/70 backdrop-blur text-custom-accent shadow-xl rounded-full hover:bg-white transition"
            aria-label="Scroll best sellers left"
          >
            <FaChevronLeft />
          </button>

          {/* Track */}
          <div
            ref={scrollRef}
            className="overflow-x-auto scroll-smooth no-scrollbar"
          >
            {/* 
              Grid-based horizontal track:
              - On lg: each card is exactly 1/3 of the viewport width (minus gap) => equal widths.
              - On smaller screens: fixed widths for nice scrolling.
            */}
            <div
              className="
                grid
                grid-flow-col
                auto-cols-[80%]
                sm:auto-cols-[48%]
                lg:auto-cols-[calc((100%-5rem)/3)]
                gap-10
                pb-4
              "
            >
              {products.map((p) => (
                <a key={p.id} href="#" className="group block">
                  {/* Image box (same size always) */}
                  <div className="relative w-full aspect-[3/4] overflow-hidden bg-white">
                    <img
                      src={p.image1}
                      alt={p.title}
                      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 opacity-100 group-hover:opacity-0"
                    />
                    <img
                      src={p.image2}
                      alt={p.title}
                      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                    />
                  </div>

                  {/* Text under image */}
                  <p className="mt-4 text-lg text-gray-800 leading-snug">
                    {p.title}
                  </p>
                </a>
              ))}
            </div>
          </div>

          {/* Right button */}
          <button
            onClick={() => scroll("right")}
            className="hidden lg:flex absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 z-10 p-3 bg-white/70 backdrop-blur text-custom-accent shadow-xl rounded-full hover:bg-white transition"
            aria-label="Scroll best sellers right"
          >
            <FaChevronRight />
          </button>
        </div>

        {/* CTA Button */}
        <div className="text-center mt-14">
          <button className="inline-flex items-center border border-custom-accent text-custom-accent hover:bg-custom-accent hover:text-white font-semibold py-3 px-10 rounded-full transition-colors">
            View All Best Sellers
            <FaArrowRight className="ml-2" />
          </button>
        </div>
      </div>
    </section>
  );
}
