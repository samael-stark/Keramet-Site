"use client";

import Link from "next/link";
import { useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import SectionHeading from "@/components/home/SectionHeading";

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
    const el = scrollRef.current;
    if (!el) return;

    const amount = el.clientWidth * 0.8;

    el.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section id="categories" className="scroll-mt-32 bg-custom-bg py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6 lg:mb-14">
          <SectionHeading
            align="left"
            label="Shop By Collection"
            title="Discover timeless rug collections for every space"
          />

          <div className="flex items-center gap-3">
            <Link
              href="/products"
              className="mr-2 border-b border-custom-accent pb-1 text-xs font-semibold uppercase tracking-[0.2em] text-custom-accent transition hover:text-custom-accent-light"
            >
              View All
            </Link>

            <button
              onClick={() => scroll("left")}
              className="hidden h-11 w-11 items-center justify-center rounded-full border border-custom-accent/30 text-custom-accent transition hover:bg-custom-accent hover:text-white sm:flex"
              aria-label="Scroll left"
            >
              <FaChevronLeft />
            </button>

            <button
              onClick={() => scroll("right")}
              className="hidden h-11 w-11 items-center justify-center rounded-full border border-custom-accent/30 text-custom-accent transition hover:bg-custom-accent hover:text-white sm:flex"
              aria-label="Scroll right"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="no-scrollbar -mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-6 pb-2 lg:mx-0 lg:px-0"
        >
          {categories.map((cat) => (
            <Link
              key={cat.value}
              href={`/products?category=${encodeURIComponent(cat.value)}`}
              className="group relative block w-[68%] flex-shrink-0 snap-start overflow-hidden rounded-sm bg-[#e9e1d3] sm:w-[42%] lg:w-[calc((100%-3.75rem)/4)]"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.title}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.06]"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-5 text-white md:p-6">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-gold">
                    {cat.subtitle}
                  </p>

                  <h3 className="mt-2 font-display text-3xl font-semibold leading-none">
                    {cat.value}
                  </h3>

                  <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/90">
                    Shop
                    <span className="h-px w-6 bg-white/70 transition-all duration-300 group-hover:w-10" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
