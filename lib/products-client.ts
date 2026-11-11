// Browser-side product reads.
//
// Cart, checkout and wishlist only need the few products the visitor
// picked, so read those documents by id (1 billed read each) instead of
// downloading the whole products collection.

import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export async function fetchProductsByIds<T = any>(ids: string[]): Promise<T[]> {
  const uniqueIds = Array.from(new Set(ids.filter(Boolean)));

  const snaps = await Promise.all(
    uniqueIds.map((id) => getDoc(doc(db, "products", id))),
  );

  return snaps
    .filter((snap) => snap.exists())
    .map((snap) => ({ id: snap.id, ...(snap.data() as object) }) as T);
}

// Called by the admin panel after creating, editing or deleting a product
// so the cached shop/home pages show the change right away instead of
// up to a day later. Failures are non-fatal: the cache still expires daily.
export async function refreshProductCache() {
  try {
    const user = auth.currentUser;
    if (!user) return;

    const idToken = await user.getIdToken();

    await fetch("/api/revalidate-products", {
      method: "POST",
      headers: { Authorization: `Bearer ${idToken}` },
    });
  } catch (err) {
    console.error("Product cache refresh failed:", err);
  }
}
