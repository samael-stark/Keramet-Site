import { doc, getDoc } from "firebase/firestore";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import { db } from "@/lib/firebase";
import ProductGallery from "./ProductGallery";

type Params = { id: string };

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;

  if (!id) return notFound();

  const ref = doc(db, "products", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) return notFound();

  const data = snap.data();

  const title = data.title ?? "Untitled Product";
  const price = Number(data.price ?? 0);
  const currency = data.currency ?? "USD";
  const description = data.description ?? "";
  const images =
    Array.isArray(data.images) && data.images.length > 0
      ? data.images
      : data.coverUrl
        ? [data.coverUrl]
        : [];

  return (
    <>
      <Header />

      <main style={{ background: "#f5f5eb", minHeight: "100vh" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "40px 24px" }}>
          <div className="detail-layout">
            {/* 🔥 GALLERY COMPONENT */}
            <ProductGallery images={images} title={title} />

            {/* RIGHT — PRODUCT INFO */}
            <div className="product-info">
              <h1>{title}</h1>

              <div className="price">
                {currency} {price.toFixed(2)}
              </div>

              {data.category && (
                <div className="meta">
                  <strong>Category:</strong> {data.category}
                </div>
              )}

              {data.size && (
                <div className="meta">
                  <strong>Size:</strong> {data.size}
                </div>
              )}

              <p className="description">{description}</p>

              <button className="add-to-cart">Add to Cart</button>
            </div>
          </div>
        </div>

        {/* STYLES */}
        <style>{`
          .detail-layout {
            display: grid;
            grid-template-columns: 100px 1fr 400px;
            gap: 40px;
            align-items: start;
          }

          /* thumbnails */
          .thumbs {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          .thumb {
            width: 90px;
            height: 90px;
            border-radius: 12px;
            overflow: hidden;
            cursor: pointer;
          }

          .thumb img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          /* MAIN IMAGE — WHITE BG REMOVED */
          .main-image-wrapper {
            position: relative;
            display: flex;
            justify-content: center;
          }

          .main-image {
            max-width: 100%;
            max-height: 700px;
            object-fit: contain;
          }

          .arrow {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border: none;
            background: #fff;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            font-size: 28px;
            cursor: pointer;
          }

          .arrow.left { left: 20px; }
          .arrow.right { right: 20px; }

          .product-info h1 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 10px;
          }

          .price {
            font-size: 22px;
            font-weight: 800;
            color: #7a1f1f;
            margin-bottom: 16px;
          }

          .meta {
            margin-bottom: 6px;
            font-size: 14px;
          }

          .description {
            margin-top: 16px;
            font-size: 14px;
            line-height: 22px;
          }

          .add-to-cart {
            margin-top: 24px;
            width: 100%;
            background: #7a1f1f;
            color: #fff;
            border: none;
            padding: 14px;
            border-radius: 12px;
            font-weight: 700;
            cursor: pointer;
          }

          @media (max-width: 1100px) {
            .detail-layout {
              grid-template-columns: 1fr;
            }

            .thumbs {
              flex-direction: row;
              overflow-x: auto;
            }
          }
        `}</style>
      </main>
    </>
  );
}
