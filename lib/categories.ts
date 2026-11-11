// Old category names still stored on existing products in Firestore,
// mapped to their current display name. Lets us rename a category
// without rewriting product documents. (None renamed on the English site yet.)
const LEGACY_CATEGORY_NAMES: Record<string, string> = {};

export function normalizeCategory(category?: string | null) {
  const trimmed = (category || "").trim();
  return LEGACY_CATEGORY_NAMES[trimmed] || trimmed;
}
