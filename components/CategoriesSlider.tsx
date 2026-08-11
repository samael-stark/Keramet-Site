"use client";

import Link from "next/link";
import { useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const categories = [
  {
    title: "MAMLUK",
    subtitle: "ORNATE HERITAGE",
    value: "Mamluk",
    image: "/img/Categories/mamluk.JPG",
  },
  {
    title: "BIDJAR",
    subtitle: "DENSE & DURABLE",
    value: "Bidjar",
    image: "/img/Categories/bidjar.jpg",
  },
  {
    title: "SERAPI",
    subtitle: "TIMELESS MEDALLIONS",
    value: "Serapi",
    image: "/img/Categories/serapi.jpg",
  },
  {
    title: "PAZYRYK",
    subtitle: "ANCIENT INSPIRED",
    value: "Pazyryk",
    image: "/img/Categories/pazyryk.JPG",
  },
  {
    title: "GABBEH",
    subtitle: "MINIMAL & ARTISAN",
    value: "Gabbeh",
    image: "/img/Categories/Gabbeh.JPG",
  },
  {
    title: "BAKHTIARI",
    subtitle: "TRIBAL ELEGANCE",
    value: "Bakhtiari",
    image: "/img/Categories/bakhtiari.jpg",
  },
  {
    title: "STRIPED",
    subtitle: "LINEAR RHYTHM",
    value: "Striped",
    image: "/img/Categories/striped.jpg",
  },
  {
    title: "KAZAK",
    subtitle: "BOLD GEOMETRY",
    value: "Kazak",
    image: "/img/Categories/kazak.jpg",
  },
  {
    title: "TREE OF LIFE",
    subtitle: "SYMBOLIC BEAUTY",
    value: "Tree of Life",
    image: "/img/Categories/treeoflife.jpg",
  },
  {
  title: "SULTANI",
  subtitle: "ROYAL HERITAGE",
  value: "Sultani",
  image: "/img/Categories/sultani.JPG",
},
  {
    title: "KHAL MUHAMMADI",
    subtitle: "RICH RED TONES",
    value: "Khal Muhammadi",
    image: "/img/Categories/khalmuhammadi.JPG",
  },

  {
    title: "KILIM",
    subtitle: "FLAT-WOVEN ARTISTRY",
    value: "Kilim",
    image: "/img/Categories/kilim .jpg",
  },
   {
    title: "BELGIC",
    subtitle: "EUROPEAN CHARACTER",
    value: "Belgic",
    image: "/img/Categories/belgic.JPG",
  },
  {
    title: "RUNNER",
    subtitle: "LONG HALLWAY STYLE",
    value: "Runner",
    image: "/img/Categories/runnerrugs.jpg",
  },
  {
    title: "PERSIAN",
    subtitle: "CLASSIC LUXURY",
    value: "Persian",
      image: "/img/Categories/persian.jpg",
  },
  {
    title: "WAZIRI",
    subtitle: "TRADITIONAL CRAFT",
    value: "Waziri",
    image: "/img/Categories/waziri.jpg",
  },
  {
    title: "SICKLE LEAF",
    subtitle: "ORNAMENTAL MOTIFS",
    value: "Sickle Leaf",
    image: "/img/Categories/Sickle Leaf.JPG",
  },
  {
    title: "KARAKUL",
    subtitle: "REGIONAL DISTINCTION",
    value: "Karakul",
    image: "/img/Categories/Karakul.JPG",
  },
  {
    title: "PICTORIAL BIRDS",
    subtitle: "ARTISTIC STORYTELLING",
    value: "Pictorial Birds",
    image: "/img/Categories/pictorialbirds.JPG",
  },
  {
    title: "SUZANI",
    subtitle: "DECORATIVE TEXTILES",
    value: "Suzani",
    image: "/img/Categories/suzani.jpg",
  },
  {
    title: "OVERDYE",
    subtitle: "MODERN VINTAGE LOOK",
    value: "OverDye",
    image: "/img/Categories/overdye.jpg",
  },
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
    <section id="categories" className="bg-custom-bg py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-14 text-center lg:mb-16">
          <h3 className="text-sm font-medium uppercase tracking-[0.28em] text-gray-600">
            Shop By Collection
          </h3>

          <h2 className="mt-3 text-3xl font-extrabold text-custom-accent md:text-4xl">
            Discover timeless rug collections for every space
          </h2>
        </div>

        <div className="relative flex items-center">
          <button
            onClick={() => scroll("left")}
            className="absolute -left-12 z-10 hidden rounded-full border border-[#e7ddd7] bg-white p-3 text-custom-accent shadow-xl transition hover:-translate-y-0.5 hover:bg-gray-50 lg:flex"
            aria-label="Scroll left"
          >
            <FaChevronLeft />
          </button>

          <div
            ref={scrollRef}
            className="no-scrollbar flex gap-6 overflow-x-auto scroll-smooth pb-2 -mx-6 px-6 lg:mx-0 lg:px-0"
          >
            {categories.map((cat) => (
              <Link
                key={cat.value}
                href={`/products?category=${encodeURIComponent(cat.value)}`}
                className="group relative block w-64 flex-shrink-0 overflow-hidden rounded-[22px] bg-white shadow-[0_12px_35px_rgba(0,0,0,0.08)] transition duration-300 hover:-translate-y-1 md:w-72 lg:w-[32%]"
              >
                <div className="relative h-[24rem] overflow-hidden">
                 <img
  src={cat.image}
  alt={cat.title}
  loading="lazy"
  decoding="async"
  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.05] group-hover:blur-[1.5px]"
/>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-black/10 transition duration-300 group-hover:from-black/75 group-hover:via-black/30 group-hover:to-black/20" />

                  <div className="absolute inset-x-0 bottom-0 z-10 p-6 text-white">
                    <p className="mb-2 text-[11px] uppercase tracking-[0.24em] text-white/85">
                      {cat.subtitle}
                    </p>

                    <h3 className="text-2xl font-bold leading-tight md:text-[30px]">
                      {cat.title}
                    </h3>

                    <span className="mt-4 inline-block border-b border-white pb-1 text-sm uppercase tracking-[0.22em] text-white transition-colors group-hover:border-[#d9b8a7] group-hover:text-[#f0d7cb]">
                      Shop
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <button
            onClick={() => scroll("right")}
            className="absolute -right-12 z-10 hidden rounded-full border border-[#e7ddd7] bg-white p-3 text-custom-accent shadow-xl transition hover:-translate-y-0.5 hover:bg-gray-50 lg:flex"
            aria-label="Scroll right"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
}
