"use client";

import { useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const categories = [
  { title: "PERSIAN RUGS", subtitle: "FINE & SILK RUGS" },
  { title: "TURKISH RUGS", subtitle: "VINTAGE / MODERN" },
  { title: "AFGHAN RUGS", subtitle: "HANDMADE TRADITION" },
  { title: "KILIMS", subtitle: "FLAT-WOVEN ARTISTRY" },
  { title: "ANTIQUE RUGS", subtitle: "TIMELESS TREASURES" },
];

export default function CategoriesSlider() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -340 : 340,
      behavior: "smooth",
    });
  };

  return (
    <section id="categories" className="py-20 bg-custom-bg">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-16">
          <h3 className="text-sm font-medium text-gray-600 uppercase tracking-widest">
            Shop By Categories
          </h3>
          <h2 className="text-4xl font-extrabold text-gray-800 mt-2">
            Discover lots products from different pattern
          </h2>
        </div>

        <div className="relative flex items-center">
          {/* Left button */}
          <button
            onClick={() => scroll("left")}
            className="hidden lg:flex absolute -left-12 z-10 p-3 bg-white text-custom-accent shadow-xl rounded-full hover:bg-gray-100 transition"
            aria-label="Scroll left"
          >
            <FaChevronLeft />
          </button>

          {/* Slider (scrollbar hidden but still scrollable) */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar pb-2 -mx-6 px-6 lg:mx-0 lg:px-0"
          >
            {categories.map((cat) => (
              <a
                key={cat.title}
                href="#"
                className="group flex-shrink-0 w-64 md:w-72 lg:w-[32%] bg-white shadow-lg overflow-hidden transform hover:scale-[1.02] transition duration-300"
              >
                <div className="h-[24rem] relative">
                  {/* Image */}
                  <img
                    src="/img/sample.jpg"
                    alt={cat.title}
                    className="w-full h-full object-cover transition duration-300 group-hover:blur-[2px] group-hover:scale-[1.03]"
                  />

                  {/* Dark overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition duration-300" />

                  {/* Text overlay (stays sharp) */}
                  <div className="category-overlay-text text-white">
                    <p className="text-sm uppercase tracking-wide mb-1">
                      {cat.subtitle}
                    </p>
                    <h3 className="text-3xl font-bold leading-tight mt-1">
                      {cat.title}
                    </h3>
                    <span className="text-sm uppercase tracking-wide mt-3 inline-block border-b border-white pb-1 group-hover:border-custom-accent group-hover:text-custom-accent transition-colors">
                      SHOP
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Right button */}
          <button
            onClick={() => scroll("right")}
            className="hidden lg:flex absolute -right-12 z-10 p-3 bg-white text-custom-accent shadow-xl rounded-full hover:bg-gray-100 transition"
            aria-label="Scroll right"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
}
