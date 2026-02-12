"use client";

import { useState, useRef } from "react";

export default function ProductGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const touchStartX = useRef<number | null>(null);

  if (!images || images.length === 0) return null;

  const nextImage = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  /* ===================== MOBILE SWIPE ===================== */

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;

    const diff = touchStartX.current - e.changedTouches[0].clientX;

    if (diff > 50) {
      nextImage(); // swipe left
    } else if (diff < -50) {
      prevImage(); // swipe right
    }

    touchStartX.current = null;
  };

  return (
    <>
      {/* ================= THUMBNAILS ================= */}
      <div className="thumbs">
        {images.map((src, i) => (
          <div
            key={i}
            className={`thumb ${i === activeIndex ? "active" : ""}`}
            onClick={() => setActiveIndex(i)}
          >
            <img src={src} alt="thumb" />
          </div>
        ))}
      </div>

      {/* ================= MAIN IMAGE ================= */}
      <div
        className="main-image-wrapper"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={images[activeIndex]}
          alt={title}
          className="main-image"
          onClick={() => setIsZoomOpen(true)}
        />

        <button className="arrow left" onClick={prevImage}>
          ‹
        </button>

        <button className="arrow right" onClick={nextImage}>
          ›
        </button>
      </div>

      {/* ================= FULLSCREEN PREVIEW ================= */}
      {isZoomOpen && (
        <div
          className="zoom-overlay"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button className="close-btn" onClick={() => setIsZoomOpen(false)}>
            ✕
          </button>

          <button className="arrow left" onClick={prevImage}>
            ‹
          </button>

          <img src={images[activeIndex]} alt={title} className="zoom-image" />

          <button className="arrow right" onClick={nextImage}>
            ›
          </button>
        </div>
      )}

      <style jsx>{`
        .thumbs {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .thumb {
          width: 90px;
          height: 90px;
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          border: 2px solid transparent;
        }

        .thumb.active {
          border-color: #7a1f1f;
        }

        .thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .main-image-wrapper {
          position: relative;
          width: 100%;
          height: 700px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .main-image {
          max-width: 100%;
          max-height: 700px;
          object-fit: contain;
          cursor: zoom-in;
        }

        .arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: none;
          background: #fff;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          font-size: 28px;
          cursor: pointer;
          z-index: 2;
        }

        .arrow.left {
          left: 20px;
        }

        .arrow.right {
          right: 20px;
        }

        /* ================= FULLSCREEN ================= */

        .zoom-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }

        .zoom-image {
          max-width: 90%;
          max-height: 90%;
          object-fit: contain;
        }

        .close-btn {
          position: absolute;
          top: 30px;
          right: 30px;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: none;
          background: #fff;
          font-size: 18px;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        @media (max-width: 1100px) {
          .thumbs {
            flex-direction: row;
            overflow-x: auto;
          }

          .main-image-wrapper {
            height: 500px;
          }
        }
      `}</style>
    </>
  );
}
