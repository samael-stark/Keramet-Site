import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductsClient from "./ProductsClient";
import { getProductSummaries } from "@/lib/products-server";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  // Cached: Firestore is read at most once a day (or after an admin change / sale),
  // not on every visit.
  const products = await getProductSummaries();

  const activeProducts = products.filter(
    (product) => product.isActive !== false && Number(product.stock ?? 1) > 0,
  );

  return (
    <>
      <Header />

      <main className="min-h-screen bg-custom-bg">
        <ProductsClient products={activeProducts} />
      </main>

      <Footer />
    </>
  );
}
