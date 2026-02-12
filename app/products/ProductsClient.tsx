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
    <div style={{ display: "flex", gap: 40 }}>
      {/* ================= LEFT SIDEBAR ================= */}
      <aside style={{ width: 260, flexShrink: 0 }}>
        <div
          onClick={() => {
            setSelectedCategory("ALL");
            setSelectedSizeLabel("");
          }}
          style={{
            cursor: "pointer",
            fontSize: 14,
            color: isAllActive ? "#7a1f1f" : "#111",
            fontWeight: isAllActive ? 700 : 400,
            marginBottom: 18,
          }}
        >
          All
        </div>

        <div
          onClick={() => {
            setSelectedCategory(CATEGORY_LARGE);
            setSelectedSizeLabel("");
          }}
          style={{
            cursor: "pointer",
            fontSize: 14,
            color: isLargeActive ? "#7a1f1f" : "#111",
            fontWeight: isLargeActive ? 700 : 400,
            marginBottom: 12,
          }}
        >
          Large Size Rugs
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {SIZE_OPTIONS.map((label) => {
            const active = selectedSizeLabel === label;
            return (
              <span
                key={label}
                onClick={() => {
                  setSelectedSizeLabel(active ? "" : label);
                  setSelectedCategory("ALL");
                }}
                style={{
                  cursor: "pointer",
                  fontSize: 14,
                  color: active ? "#7a1f1f" : "#111",
                  fontWeight: active ? 700 : 400,
                }}
              >
                {label}
              </span>
            );
          })}
        </div>

        <div
          style={{
            marginTop: 20,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <div
            onClick={() => {
              setSelectedCategory(CATEGORY_RUNNER);
              setSelectedSizeLabel("");
            }}
            style={{
              cursor: "pointer",
              fontSize: 14,
              color: isRunnerActive ? "#7a1f1f" : "#111",
              fontWeight: isRunnerActive ? 700 : 400,
            }}
          >
            Runner Rugs
          </div>

          <div
            onClick={() => {
              setSelectedCategory(CATEGORY_WALL);
              setSelectedSizeLabel("");
            }}
            style={{
              cursor: "pointer",
              fontSize: 14,
              color: isWallActive ? "#7a1f1f" : "#111",
              fontWeight: isWallActive ? 700 : 400,
            }}
          >
            Wall Hanging Rug
          </div>
        </div>
      </aside>

      {/* ================= RIGHT CONTENT ================= */}
      <div style={{ flex: 1 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>All items</h2>

          <div
            style={{
              background: "#ececec",
              borderRadius: 999,
              padding: "8px 14px",
              width: 260,
            }}
          >
            <input
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                width: "100%",
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: 14,
              }}
            />
          </div>
        </div>

        {/* PRODUCT GRID */}
        <div className="product-grid">
          {paginatedProducts.map((p) => (
            <Link key={p.id} href={`/products/${p.id}`}>
              <div className="product-shell">
                <div className="product-card">
                  <img
                    src={p.coverUrl}
                    alt={p.title}
                    className="product-image"
                  />

                  <div style={{ padding: "12px 10px 16px 10px" }}>
                    <p style={{ fontSize: 14, minHeight: 36 }}>{p.title}</p>
                    <p
                      style={{
                        fontWeight: 700,
                        color: "#7a1f1f",
                        marginTop: 6,
                      }}
                    >
                      USD {Number(p.price).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* PAGINATION BUTTONS */}
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
              const active = page === currentPage;

              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`page-btn ${active ? "active-page" : ""}`}
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

        {/* STYLES */}
        <style jsx>{`
          .product-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 24px;
          }

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
            border-radius: 12px;
            overflow: hidden;
            background: #f5f5eb;
          }

          .product-image {
            width: 100%;
            height: 256px;
            object-fit: cover;
            display: block;
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

          .page-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          .active-page {
            background: #7a1f1f;
            color: white;
            border-color: #7a1f1f;
          }

          @media (max-width: 768px) {
            .product-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }
        `}</style>
      </div>
    </div>
  );
}
