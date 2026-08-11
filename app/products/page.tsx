import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductsClient from "./ProductsClient";
import { adminDb } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const snap = await adminDb.collection("products").get();

  const products = snap.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      title: data.title || "",
      price: data.price || 0,
      coverUrl: data.coverUrl || "",
      size: data.size || "",
      category: data.category || "",
      description: data.description || "",
      images: data.images || [],
      madeYear: data.madeYear || null,
      currency: data.currency || "USD",
      productId: data.productId || "",
      isActive: data.isActive ?? true,
      stock: data.stock ?? 1,
      createdAt: data.createdAt?.toDate
        ? data.createdAt.toDate().toISOString()
        : null,
    };
  });

 const activeProducts = products.filter(
  (product) =>
    product.isActive !== false &&
    Number(product.stock ?? 1) > 0
);

  return (
    <>
      <Header />

      <main style={{ background: "#f5f5eb", minHeight: "100vh" }}>
        <div style={{ maxWidth: 1440, margin: "0 auto", padding: "32px 24px" }}>
          <ProductsClient products={activeProducts} />
        </div>
      </main>

      <Footer />
    </>
  );
}
