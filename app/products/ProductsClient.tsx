"use client";

import "./products.css";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type Product = {
  id: string;
  title: string;
  price: number;
  coverUrl: string;
  size?: string;
  category?: string;
  stock?: number;
};

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

const COLLECTION_OPTIONS = [
  "Mamluk",
  "Sultani",
  "Bidjar",
  "Serapi",
  "Pazyryk",
  "Gabbeh",
  "Bakhtiari",
  "Striped",
  "Kazak",
  "Tree of Life",
  "Khal Muhammadi",
  "Belgic",
  "Kilim",
  "Runner",
  "Persian",
  "Waziri",
  "Sickle Leaf",
  "Karakul",
  "Pictorial Birds",
  "Suzani",
  "OverDye",
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

const PRODUCTS_PER_PAGE = 20;

export default function ProductsClient({ products }: { products: Product[] }) {
  const searchParams = useSearchParams();

  const [showSizes, setShowSizes] = useState(false);
  const [showCollections, setShowCollections] = useState(false);

  const [query, setQuery] = useState("");
  const [selectedCollection, setSelectedCollection] = useState("");
  const [selectedSizeLabel, setSelectedSizeLabel] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("wishlist");
    if (stored) setWishlist(JSON.parse(stored));
  }, []);

  useEffect(() => {
    const categoryFromURL = searchParams.get("category");

    if (categoryFromURL) {
      setSelectedCollection(categoryFromURL);
      setShowCollections(true);
      setShowSizes(false);
    } else {
      setSelectedCollection("");
    }
  }, [searchParams]);

  const toggleWishlist = (id: string) => {
    let updated: string[];

    if (wishlist.includes(id)) {
      updated = wishlist.filter((x) => x !== id);
    } else {
      updated = [...wishlist, id];
    }

    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = (p.title || "")
      .toLowerCase()
      .includes(query.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedCollection) {
      if ((p.category || "").trim() !== selectedCollection) return false;
    }

    if (selectedSizeLabel) {
      const expectedSize = SIZE_LABEL_TO_DB[selectedSizeLabel];
      if ((p.size || "").trim() !== expectedSize) return false;
    }

    return true;
  });

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [query, selectedCollection, selectedSizeLabel]);

  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE,
  );

  const hasActiveFilters = !!selectedCollection || !!selectedSizeLabel || !!query;

  const saleEndDate = new Date();
  saleEndDate.setDate(saleEndDate.getDate() + 10);

  const formattedSaleDate = saleEndDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
  });

  return (
    <div className="shop-shell">
      <div className="layout-wrapper">
        <aside className={`sidebar ${isFilterOpen ? "open" : ""}`}>
          <div className="sidebar-head">
            <h3>Browse</h3>
            <button
              className="close-drawer"
              onClick={() => setIsFilterOpen(false)}
              aria-label="Close filters"
            >
              ✕
            </button>
          </div>

          <button
            onClick={() => {
              setSelectedCollection("");
              setSelectedSizeLabel("");
              setQuery("");
            }}
            className={`all-products-btn ${
              !selectedCollection && !selectedSizeLabel && !query ? "active" : ""
            }`}
          >
            All Products
          </button>

          <div className="filter-block">
            <button
              className="filter-toggle"
              onClick={() => {
                setShowSizes((prev) => !prev);
                setShowCollections(false);
              }}
            >
              <span>Shop by Size</span>
              <span className={`arrow ${showSizes ? "open" : ""}`} />
            </button>

            {showSizes && (
              <div className="filter-list">
                {SIZE_OPTIONS.map((label) => {
                  const active = selectedSizeLabel === label;

                  return (
                    <button
                      key={label}
                      onClick={() => {
                        setSelectedSizeLabel(active ? "" : label);
                        setSelectedCollection("");
                      }}
                      className={`filter-chip ${active ? "active" : ""}`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="filter-block">
            <button
              className="filter-toggle"
              onClick={() => {
                setShowCollections((prev) => !prev);
                setShowSizes(false);
              }}
            >
              <span>Shop by Collection</span>
              <span className={`arrow ${showCollections ? "open" : ""}`} />
            </button>

            {showCollections && (
              <div className="filter-list">
                {COLLECTION_OPTIONS.map((collection) => {
                  const active = selectedCollection === collection;

                  return (
                    <button
                      key={collection}
                      onClick={() => {
                        setSelectedCollection(active ? "" : collection);
                        setSelectedSizeLabel("");
                      }}
                      className={`filter-chip ${active ? "active" : ""}`}
                    >
                      {collection}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </aside>

        <div className="content">
          <div className="topbar">
            <div className="topbar-left">
              <h2 className="page-title">
                {selectedCollection ? `${selectedCollection} Rugs` : "All Rugs"}
              </h2>

              <button
                className="mobile-filter-btn"
                onClick={() => setIsFilterOpen(true)}
              >
                Filters
              </button>
            </div>

            <div className="topbar-controls">
              <div className="search">
                <input
                  placeholder="Search rugs"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <svg
                  className="search-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>


            </div>
          </div>

          {hasActiveFilters && (
            <div className="active-filters">
              {query && (
                <span className="active-pill">
                  Search: {query}
                  <button onClick={() => setQuery("")}>×</button>
                </span>
              )}

              {selectedSizeLabel && (
                <span className="active-pill">
                  {selectedSizeLabel}
                  <button onClick={() => setSelectedSizeLabel("")}>×</button>
                </span>
              )}

              {selectedCollection && (
                <span className="active-pill">
                  {selectedCollection}
                  <button onClick={() => setSelectedCollection("")}>×</button>
                </span>
              )}
            </div>
          )}

          <div className="product-grid">
            {paginatedProducts.map((p) => {
              const isActive = wishlist.includes(p.id);
              const originalPrice =
  Number(p.price) > 0 ? Number(p.price) / 0.85 : 0;

              return (
                <Link
                  key={p.id}
                  href={`/products/${p.id}`}
                  className="product-link"
                >
                  <article className="product-shell">
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
                            toggleWishlist(p.id);
                          }}
                          aria-label="Add to wishlist"
                          title="Wishlist"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            width="22"
                            height="22"
                            className="heart-svg"
                          >
                            <path
                              d="M11.995 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5
                              2 5.42 4.42 3 7.5 3
                              c1.74 0 3.41.81 4.5 2.09
                              C13.09 3.81 14.76 3 16.5 3
                              19.58 3 22 5.42 22 8.5
                              c0 3.78-3.4 6.86-8.55 11.54l-1.455 1.31z"
                            />
                          </svg>
                        </button>
                      </div>

                      <div className="product-info">
                        {p.category && <p className="product-category">{p.category}</p>}
                        <p className="product-title">{p.title}</p>

                        <div className="price-block">
                          <div className="price-line">
                            <span className="price-current">
                              USD {Number(p.price).toFixed(2)}
                            </span>

                            <span className="price-old">
                              USD {originalPrice.toFixed(2)}
                            </span>
                          </div>

                         <p className="sale-note">
  15% off • Sale ends on {formattedSaleDate}
</p>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>

          {filteredProducts.length === 0 && (
            <div className="empty-state">
              <h3>No products found</h3>
              <p>Try a different search or remove filters.</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="pagination-wrapper">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="page-btn"
              >
                Previous
              </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
  .filter((page) => {
    return (
      page === 1 ||
      page === totalPages ||
      (page >= currentPage - 1 && page <= currentPage + 1)
    );
  })
  .map((page, index, pages) => (
    <div key={page} style={{ display: "contents" }}>
      {index > 0 && page - pages[index - 1] > 1 && (
        <span className="page-dots">...</span>
      )}

      <button
        onClick={() => setCurrentPage(page)}
        className={`page-btn ${
          page === currentPage ? "active-page" : ""
        }`}
      >
        {page}
      </button>
    </div>
  ))}

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
      </div>

      {isFilterOpen && (
        <div
          className="drawer-overlay"
          onClick={() => setIsFilterOpen(false)}
        />
      )}


    </div>
  );
}
