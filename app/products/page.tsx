import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Header from "@/components/Header";
import ProductsClient from "./ProductsClient";

export default async function ProductsPage() {
  const snap = await getDocs(collection(db, "products"));

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
      createdAt: data.createdAt ? data.createdAt.seconds : null, // ✅ convert timestamp to number
    };
  });

  return (
    <>
      <Header />
      <main style={{ background: "#f5f5eb", minHeight: "100vh" }}>
        <div style={{ maxWidth: 1440, margin: "0 auto", padding: "32px 24px" }}>
          <ProductsClient products={products} />
        </div>
      </main>
    </>
  );
}
