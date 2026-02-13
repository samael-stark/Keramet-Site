"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Product = {
  id: string;
  title: string;
  price: number;
  coverUrl: string;
  size?: string;
  category?: string;
};

/* ===================== SIZE OPTIONS ===================== */

const SIZE_OPTIONS = [
  "9 × 12 ft · 275 × 365 cm",
  "8 × 10 ft · 250 × 300 cm",
  "7 × 10 ft · 200 × 300 cm",
  "6 × 9 ft · 180 × 270 cm",
  "6 × 8 ft · 170 × 240 cm",
  "5 × 7 ft · 150 × 200 cm",
  "5 × 6 ft · 150 × 180 cm",
  "4 × 6 ft · 120 × 180 cm",
  "3 × 5 ft · 100 × 150 cm",
  "3 × 4 ft · 80 × 120 cm",
  "2 × 3 ft · 60 × 90 cm",
];

const SIZE_LABEL_TO_DB: Record<string, string> = {
  "9 × 12 ft · 275 × 365 cm": "9 ft x 12 ft",
  "8 × 10 ft · 250 × 300 cm": "8 ft x 10 ft",
  "7 × 10 ft · 200 × 300 cm": "7 ft x 10 ft",
  "6 × 9 ft · 180 × 270 cm": "6 ft x 9 ft",
  "6 × 8 ft · 170 × 240 cm": "6 ft x 8 ft",
  "5 × 7 ft · 150 × 200 cm": "5 ft x 7 ft",
  "5 × 6 ft · 150 × 180 cm": "5 ft x 6 ft",
  "4 × 6 ft · 120 × 180 cm": "4 ft x 6 ft",
  "3 × 5 ft · 100 × 150 cm": "3 ft x 5 ft",
  "3 × 4 ft · 80 × 120 cm": "3 ft x 4 ft",
  "2 × 3 ft · 60 × 90 cm": "2 ft x 3 ft",
};

const CATEGORY_LARGE = "Large Size Rugs";
const CATEGORY_RUNNER = "Runner Rugs";
const CATEGORY_WALL = "Wall Hanging Rug";

const PRODUCTS_PER_PAGE = 20;

export default function ProductsClient({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedSizeLabel, setSelectedSizeLabel] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // wishlist UI state (local only)
  const [wish, setWish] = useState<Record<string, boolean>>({});

  /* ===================== FILTER ===================== */

  const filteredProducts = products.filter((p) => {
    const matchesSearch = (p.title || "")
      .toLowerCase()
      .includes(query.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedCategory !== "ALL") {
      if ((p.category || "").trim() !== selectedCategory) return false;
    }

    if (selectedSizeLabel) {
      const expectedSize = SIZE_LABEL_TO_DB[selectedSizeLabel];
      if ((p.size || "").trim() !== expectedSize) return false;
    }

    return true;
  });

  /* ===================== PAGINATION ===================== */

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [query, selectedCategory, selectedSizeLabel]);

  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE,
  );

  /* ===================== ACTIVE STATES ===================== */

  const isAllActive = selectedCategory === "ALL" && !selectedSizeLabel;
  const isLargeActive =
    selectedCategory === CATEGORY_LARGE && !selectedSizeLabel;
  const isRunnerActive = selectedCategory === CATEGORY_RUNNER;
  const isWallActive = selectedCategory === CATEGORY_WALL;

  return (
    <div className="layout-wrapper">
      {/* ================= MOBILE FILTER BUTTON ================= */}
      <button
        className="mobile-filter-btn"
        onClick={() => setIsFilterOpen(true)}
      >
        ☰ Filters
      </button>

      {/* ================= SIDEBAR ================= */}
      <aside className={`sidebar ${isFilterOpen ? "open" : ""}`}>
        <button className="close-drawer" onClick={() => setIsFilterOpen(false)}>
          ✕
        </button>

        <div
          onClick={() => {
            setSelectedCategory("ALL");
            setSelectedSizeLabel("");
          }}
          className={`filter-item ${isAllActive ? "active" : ""}`}
        >
          All
        </div>

        <div
          onClick={() => {
            setSelectedCategory(CATEGORY_LARGE);
            setSelectedSizeLabel("");
          }}
          className={`filter-item ${isLargeActive ? "active" : ""}`}
        >
          Large Size Rugs
        </div>

        <div className="size-list">
          {SIZE_OPTIONS.map((label) => {
            const active = selectedSizeLabel === label;
            return (
              <span
                key={label}
                onClick={() => {
                  setSelectedSizeLabel(active ? "" : label);
                  setSelectedCategory("ALL");
                }}
                className={active ? "active" : ""}
              >
                {label}
              </span>
            );
          })}
        </div>

        <div
          onClick={() => {
            setSelectedCategory(CATEGORY_RUNNER);
            setSelectedSizeLabel("");
          }}
          className={`filter-item ${isRunnerActive ? "active" : ""}`}
        >
          Runner Rugs
        </div>

        <div
          onClick={() => {
            setSelectedCategory(CATEGORY_WALL);
            setSelectedSizeLabel("");
          }}
          className={`filter-item ${isWallActive ? "active" : ""}`}
        >
          Wall Hanging Rug
        </div>
      </aside>

      {/* ================= RIGHT CONTENT ================= */}
      <div className="content">
        <div className="topbar">
          <h2>All items</h2>

          <div className="search">
            <input
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="product-grid">
          {paginatedProducts.map((p) => {
            const isActive = wish[p.id];

            return (
              <Link key={p.id} href={`/products/${p.id}`}>
                <div className="product-shell">
                  <div className="product-card">
                    <div className="img-wrap">
                      <img
                        src={p.coverUrl}
                        alt={p.title}
                        className="product-image"
                      />

                      <button
                        className={`wish-btn ${isActive ? "active" : ""}`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setWish((prev) => ({
                            ...prev,
                            [p.id]: !prev[p.id],
                          }));
                        }}
                        aria-label="Add to wishlist"
                        title="Wishlist"
                      >
                        <span className="heart">{isActive ? "♥" : "♡"}</span>
                      </button>
                    </div>

                    <div className="product-info">
                      <p>{p.title}</p>
                      <p className="price">USD {Number(p.price).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* ================= PAGINATION ================= */}
        {totalPages > 1 && (
          <div className="pagination-wrapper">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="page-btn"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }).map((_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`page-btn ${
                    page === currentPage ? "active-page" : ""
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="page-btn"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {isFilterOpen && (
        <div
          className="drawer-overlay"
          onClick={() => setIsFilterOpen(false)}
        />
      )}

      {/* ================= STYLES ================= */}
      <style jsx>{`
        .layout-wrapper {
          display: flex;
          gap: 40px;
        }

        .sidebar {
          width: 260px;
          flex-shrink: 0;
        }

        .filter-item {
          cursor: pointer;
          margin-bottom: 12px;
          font-size: 14px;
        }

        .filter-item.active,
        .size-list span.active {
          color: #7a1f1f;
          font-weight: 700;
        }

        .size-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 20px;
        }

        .size-list span {
          cursor: pointer;
          font-size: 14px;
        }

        .content {
          flex: 1;
        }

        .topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .search {
          background: #ececec;
          border-radius: 999px;
          padding: 8px 14px;
          width: 260px;
        }

        .search input {
          width: 100%;
          border: none;
          background: transparent;
          outline: none;
        }

        .product-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }

        /* ✅ hover shadow restored (your old behavior) */
        .product-shell {
          padding: 9px;
          border-radius: 12px;
          cursor: pointer;
          transition:
            box-shadow 0.25s ease,
            transform 0.25s ease;
        }

        .product-shell:hover {
          box-shadow:
            0 14px 28px rgba(0, 0, 0, 0.14),
            0 28px 56px rgba(0, 0, 0, 0.1);
          transform: translateY(-3px);
        }

        .product-card {
          background: #f5f5eb;
          overflow: hidden;
        }

        .img-wrap {
          position: relative;
        }

        .product-image {
          width: 100%;
          height: 256px;
          object-fit: cover;
          display: block;
        }

        /* ✅ wishlist icon */
        .wish-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 44px;
          height: 44px;
          border-radius: 999px;
          border: none;
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
          font-size: 22px;
          cursor: pointer;
          display: grid;
          place-items: center;
          color: #222;
          transition: all 0.25s ease;
        }

        .wish-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 36px;
          height: 36px;
          border-radius: 999px;
          border: none;
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
          font-size: 26px;
          cursor: pointer;
          display: grid;
          place-items: center;
          color: #222;
          transition: all 0.25s ease;
        }

        /* Hover effect */
        .wish-btn:hover {
          transform: scale(1.15);
          color: #7a1f1f;
        }

        /* Fill heart on hover */
        .wish-btn:hover .heart {
          color: #7a1f1f;
        }

        /* Active (clicked) */
        .wish-btn.active {
          color: #7a1f1f;
        }

        .wish-btn:hover {
          transform: scale(1.15);
          color: #7a1f1f;
        }

        /* When active (clicked) */
        .wish-btn.active {
          color: #7a1f1f;
        }

        .product-info {
          padding: 12px;
        }

        .price {
          font-weight: 700;
          color: #7a1f1f;
        }

        .pagination-wrapper {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-top: 40px;
          flex-wrap: wrap;
        }

        .page-btn {
          padding: 10px 16px;
          border-radius: 12px;
          border: 1px solid #ddd;
          background: #f3f3f3;
          cursor: pointer;
          font-weight: 600;
        }

        .active-page {
          background: #7a1f1f;
          color: white;
          border-color: #7a1f1f;
        }

        .mobile-filter-btn {
          display: none;
        }

        .drawer-overlay {
          display: none;
        }

        /* ✅ IMPORTANT: close button must NOT show on desktop */
        .close-drawer {
          display: none;
        }

        @media (max-width: 900px) {
          .layout-wrapper {
            flex-direction: column;
          }

          .mobile-filter-btn {
            display: block;
            margin-bottom: 20px;
            background: #7a1f1f;
            color: white;
            border: none;
            padding: 8px 14px;
            border-radius: 10px;
          }

          .sidebar {
            position: fixed;
            top: 0;
            left: -100%;
            height: 100vh;
            width: 280px;
            background: #f5f5eb;
            padding: 20px;
            z-index: 1000;
            overflow-y: auto;
            transition: left 0.3s ease;
          }

          .sidebar.open {
            left: 0;
          }

          .drawer-overlay {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.4);
            z-index: 999;
          }

          .product-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          /* show close ONLY in mobile drawer */
          .close-drawer {
            display: inline-block;
            margin-bottom: 14px;
            background: transparent;
            border: none;
            font-size: 22px;
            cursor: pointer;
          }
        }
      `}</style>
    </div>
  );
}
