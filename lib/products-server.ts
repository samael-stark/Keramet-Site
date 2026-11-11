// Server-side, cached product reads.
//
// Every Firestore document read is billed (after the free 50k/day).
// The home and shop pages used to read the WHOLE products collection on
// every single page view (including bots/crawlers). These helpers cache
// the result in Next.js' data cache, so Firestore is only hit when the
// cache expires (once a day) or when it is explicitly invalidated with
// revalidateTag(PRODUCTS_CACHE_TAG) after an admin edit or a sale.
//
// The daily expiry is only a safety net for edits made outside the admin
// panel (e.g. directly in the Firebase console); normal admin edits and
// sales refresh the cache immediately.

import { unstable_cache } from "next/cache";
import { adminDb } from "@/lib/firebase-admin";
import { normalizeCategory } from "@/lib/categories";

export const PRODUCTS_CACHE_TAG = "products";

const ONE_DAY = 60 * 60 * 24;

export type ProductSummary = {
  id: string;
  title: string;
  price: number;
  coverUrl: string;
  size: string;
  category: string;
  stock: number;
  isActive: boolean;
};

export type ProductDetail = {
  id: string;
  title: string | null;
  price: number | null;
  description: string | null;
  images: string[];
  coverUrl: string;
  category: string;
  size: string;
  stock: number;
  isActive: boolean;
};

// Listing data for the home page and the shop page (shared cache entry).
export const getProductSummaries = unstable_cache(
  async (): Promise<ProductSummary[]> => {
    const snap = await adminDb
      .collection("products")
      .select("title", "price", "coverUrl", "size", "category", "stock", "isActive")
      .get();

    return snap.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        title: data.title || "",
        price: Number(data.price || 0),
        coverUrl: data.coverUrl || "",
        size: data.size || "",
        category: normalizeCategory(data.category),
        stock: data.stock === undefined ? 1 : Number(data.stock),
        isActive: data.isActive ?? true,
      };
    });
  },
  ["product-summaries"],
  { revalidate: ONE_DAY, tags: [PRODUCTS_CACHE_TAG] },
);

// Single product for the product detail page. The id is part of the cache key.
export const getProductDetail = unstable_cache(
  async (id: string): Promise<ProductDetail | null> => {
    const snap = await adminDb.collection("products").doc(id).get();

    if (!snap.exists) return null;

    const data = snap.data() || {};

    return {
      id: snap.id,
      title: data.title ?? null,
      price: data.price ?? null,
      description: data.description ?? null,
      images: Array.isArray(data.images) ? data.images : [],
      coverUrl: data.coverUrl || "",
      category: normalizeCategory(data.category),
      size: data.size || "",
      stock: data.stock === undefined ? 1 : Number(data.stock),
      isActive: data.isActive ?? true,
    };
  },
  ["product-detail"],
  { revalidate: ONE_DAY, tags: [PRODUCTS_CACHE_TAG] },
);
