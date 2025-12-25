"use client";

import { useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const reviews = [
  {
    name: "Ahmed Khan",
    country: "United Kingdom",
    text: "Absolutely stunning rug. The quality exceeded my expectations and delivery was fast. It completely transformed our living room.",
  },
  {
    name: "Sarah Williams",
    country: "United States",
    text: "Beautiful craftsmanship and rich colors. You can feel the tradition and care that went into making this rug.",
  },
  {
    name: "Omar Farooq",
    country: "Canada",
    text: "The rug arrived exactly as described. Premium feel, elegant design, and excellent customer service.",
  },
  {
    name: "Fatima Noor",
    country: "Germany",
    text: "Elegant, timeless, and clearly handmade with care. I will definitely be ordering again.",
  },
];

export default function Reviews() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -360 : 360,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-24 bg-custom-bg border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Heading */}
        <div className="text-center mb-20">
          <h3 className="text-sm font-medium text-gray-600 uppercase tracking-widest">
            Testimonials
          </h3>
          <h2 className="text-4xl font-extrabold text-gray-800 mt-3">
            Our Happy Customers
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Real words from customers who value craftsmanship, authenticity, and
            timeless design.
          </p>
        </div>

        <div className="relative flex items-center">
          {/* Left arrow */}
          <button
            onClick={() => scroll("left")}
            className="hidden lg:flex absolute -left-12 z-10 p-3 bg-white/60 backdrop-blur-md text-custom-accent shadow-xl rounded-full hover:bg-white/80 transition"
            aria-label="Scroll testimonials left"
          >
            <FaChevronLeft />
          </button>

          {/* Reviews slider */}
          <div
            ref={scrollRef}
            className="flex gap-8 overflow-x-auto scroll-smooth no-scrollbar pb-6 -mx-6 px-6 lg:mx-0 lg:px-0"
          >
            {reviews.map((review, index) => (
              <div key={index} className="flex-shrink-0 w-[22rem]">
                {/* Glass card */}
                <div
                  className="
                    rounded-2xl
                    p-8
                    bg-white/20 backdrop-blur-md
                    border border-white/40
                    shadow-lg
                    hover:shadow-2xl
                    transition
                    h-full
                  "
                >
                  <p className="text-gray-800 leading-relaxed text-lg italic mb-8">
                    “{review.text}”
                  </p>

                  <div className="w-12 h-px bg-custom-accent mb-4" />

                  <div className="text-sm font-semibold text-gray-900">
                    {review.name}
                  </div>
                  <div className="text-xs uppercase tracking-widest text-gray-600 mt-1">
                    {review.country}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right arrow */}
          <button
            onClick={() => scroll("right")}
            className="hidden lg:flex absolute -right-12 z-10 p-3 bg-white/60 backdrop-blur-md text-custom-accent shadow-xl rounded-full hover:bg-white/80 transition"
            aria-label="Scroll testimonials right"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
}
