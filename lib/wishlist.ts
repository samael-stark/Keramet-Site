"use client";

import { useEffect, useState } from "react";

// Wishlist = array of product ids in localStorage["wishlist"].
// "wishlistUpdated" keeps the header count and other components in sync.

function readWishlist(): string[] {
  try {
    const raw = localStorage.getItem("wishlist");
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function useWishlist() {
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => setWishlist(readWishlist());
    sync();
    window.addEventListener("wishlistUpdated", sync);
    return () => window.removeEventListener("wishlistUpdated", sync);
  }, []);

  const toggle = (id: string) => {
    const current = readWishlist();
    const updated = current.includes(id)
      ? current.filter((x) => x !== id)
      : [...current, id];

    try {
      localStorage.setItem("wishlist", JSON.stringify(updated));
    } catch {
      // storage unavailable: keep in memory only
    }

    setWishlist(updated);
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  return { wishlist, toggle };
}
