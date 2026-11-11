"use client";

import { useRef, useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaStar,
  FaArrowRight,
} from "react-icons/fa";
import SectionHeading from "@/components/home/SectionHeading";

// Real reviews from our Etsy store (international customers).
const reviews = [
  {
    name: "Lon",
    date: "27 Mar, 2026",
    rating: 5,
    text: "This rug is spectacular and the quality is outstanding! Fast delivery and exactly as pictured and described. This is the place to buy your rugs!",
    productTitle: "Hand Knotted Gabbeh Tree of Life Wool Rug: 6x8 Afghan Area Rug",
    productImage: "/img/reviews/review1.jpg",
  },
  {
    name: "Irene",
    date: "18 Feb, 2026",
    rating: 5,
    text: "Thank you for a beautiful product that arrived super fast and for great personal service. The only thing I miss is a certificate of origin that describes the product in detail. This would be important in case I would need to sell the product.",
    productTitle: "7x10 ft Hand Knotted Red Floral Sultani Afghan Area Wool Rug - Natural Vegetable Dye",
    productImage: "/img/reviews/review2.jpg",
  },
  {
    name: "Azhir",
    date: "07 Feb, 2026",
    rating: 5,
    text: "My purchase from this vendor was excellent. My wife and I were in the market for a large rug for a new house, and this vendor had the style I wanted. I messaged them to understand pricing and shipping options, and we made the sale. Shipping arrived extremely quick for an international sale and being very heavy/large. Overall, highly recommend.",
    productTitle: "10x13 ft Hand Knotted Brown Floral Sultani Afghan Wool Area Rug - Natural Vegetable Dye",
    productImage: "/img/reviews/review3.jpg",
  },
  {
    name: "Cynthia",
    date: "15 Dec, 2025",
    rating: 5,
    text: "Beautiful service, quick delivery, and great quality.",
    productTitle: "Hand Knotted 5x7 Afghan Wool Rug - Sultani Design - Natural Vegetable Dye",
    productImage: "/img/reviews/review4.jpg",
  },
  {
    name: "Kenneth",
    date: "15 Dec, 2025",
    rating: 5,
    text: "I’m very pleased with the carpet. Beautiful colours and very well finished. Love the colourful binding around the edge tassels. It lies absolutely flat. The carpet looks very good in the room I bought it for. Shipping and delivery was very quick. I thoroughly recommend this seller. A+++",
    productTitle: "Hand Knotted Blue Pazyryk 6x8 Afghan Wool Rug, Natural Vegetable Dye",
    productImage: "/img/reviews/review5.jpg",
  },
  {
    name: "Catarina",
    date: "15 Sept, 2025",
    rating: 5,
    text: "This rug is amazing! it's everything I hoped for. It is just as described and the photos don't do it justice. Also, Keramet was very thoughtful and packed a smaller rug as a gift :) I would buy again from this shop!",
    productTitle: "7x10 Pazyryk Afghan Rug: Hand-Knotted Wool, Horse Design",
    productImage: "/img/reviews/review6.jpg",
  },
];

const LONG_REVIEW = 220;

export default function Reviews() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState<number | null>(null);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;

    el.scrollBy({
      left: dir === "left" ? -el.clientWidth : el.clientWidth,
      behavior: "smooth",
    });
  };

  return (
    <section className="bg-custom-bg py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6 lg:mb-14">
          <SectionHeading
            align="left"
            label="Testimonials"
            title="Our Happy Customers"
            intro="Real reviews from customers who appreciate craftsmanship, quality, and timeless handmade design."
          />

          <div className="hidden items-center gap-3 sm:flex">
            <button
              onClick={() => scroll("left")}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-custom-accent/30 text-custom-accent transition hover:bg-custom-accent hover:text-white"
              aria-label="Scroll left"
            >
              <FaChevronLeft />
            </button>

            <button
              onClick={() => scroll("right")}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-custom-accent/30 text-custom-accent transition hover:bg-custom-accent hover:text-white"
              aria-label="Scroll right"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="no-scrollbar -mx-6 flex snap-x snap-mandatory items-stretch gap-5 overflow-x-auto scroll-smooth px-6 pb-2 lg:mx-0 lg:px-0"
        >
          {reviews.map((review, index) => {
            const isLong = review.text.length > LONG_REVIEW;
            const isOpen = expanded === index;

            return (
              <article
                key={review.name + review.date}
                className="flex w-[86%] flex-shrink-0 snap-start flex-col rounded-sm border border-line bg-paper p-7 sm:w-[60%] lg:w-[calc((100%-2.5rem)/3)]"
              >
                <div className="flex items-start justify-between">
                  <span
                    aria-hidden
                    className="font-display text-6xl leading-none text-custom-accent/25"
                  >
                    “
                  </span>

                  <div
                    className="flex gap-1 text-[13px] text-[#c8962e]"
                    aria-label={`${review.rating} out of 5 stars`}
                  >
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>
                </div>

                <p
                  className={`mt-2 text-[15px] leading-7 text-ink/85 ${
                    isLong && !isOpen ? "line-clamp-5" : ""
                  }`}
                >
                  {review.text}
                </p>

                {isLong ? (
                  <button
                    onClick={() => setExpanded(isOpen ? null : index)}
                    className="mt-2 self-start text-xs font-semibold uppercase tracking-[0.16em] text-custom-accent hover:text-custom-accent-light"
                  >
                    {isOpen ? "Show less" : "Read more"}
                  </button>
                ) : null}

                <div className="mt-6 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-custom-accent font-display text-lg font-semibold text-white">
                    {review.name.charAt(0)}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">
                      {review.name}
                    </p>
                    <p className="text-xs text-muted">{review.date}</p>
                  </div>
                </div>

                <div className="mt-auto flex items-center gap-3 border-t border-line pt-5">
                  <img
                    src={review.productImage}
                    alt={review.productTitle}
                    loading="lazy"
                    decoding="async"
                    className="h-14 w-14 shrink-0 rounded-sm object-cover"
                  />
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">
                      Reviewed Item
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-ink/80">
                      {review.productTitle}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 text-center">
          <a
            href="https://www.etsy.com/shop/KERAMETHALI?dd_referrer=#reviews"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-3 rounded-full border border-custom-accent px-10 py-3.5 text-sm font-semibold uppercase tracking-[0.16em] text-custom-accent transition hover:bg-custom-accent hover:text-white"
          >
            See All Reviews
            <FaArrowRight />
          </a>

          <p className="text-xs text-muted">
            Reviews are from customers of our Etsy store.
          </p>
        </div>
      </div>
    </section>
  );
}
