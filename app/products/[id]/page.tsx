import { doc, getDoc } from "firebase/firestore";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { db } from "@/lib/firebase";
import ProductGallery from "./ProductGallery";
import PriceDisplay from "@/components/PriceDisplay";
import AddToCartButton from "./AddToCartButton";

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
  const description = data.description ?? "";
  const images =
    Array.isArray(data.images) && data.images.length > 0
      ? data.images
      : data.coverUrl
        ? [data.coverUrl]
        : [];

 const originalPrice = price > 0 ? price / 0.85 : 0;

  const saleEndDate = new Date();
  saleEndDate.setDate(saleEndDate.getDate() + 10);

  const formattedSaleDate = saleEndDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
  });

  return (
    <>
      <Header />

      <main style={{ background: "#f5f5eb", minHeight: "100vh" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "44px 24px 56px" }}>
          <div className="detail-layout">
            <ProductGallery images={images} title={title} productId={id} />

            <div className="product-info">
              <h1>{title}</h1>

              <div className="price-block">
                <div className="price-line">
                  <span className="now-label">Now</span>

                  <div className="current-price">
                    <PriceDisplay basePrice={price} />
                  </div>

                  <div className="old-price">
                    <PriceDisplay basePrice={originalPrice} />
                  </div>
                </div>

                <div className="sale-note">
                  <span>15% off</span>
                  <span className="dot">•</span>
                  <span>Sale ends on {formattedSaleDate}</span>
                </div>
              </div>

              {(data.category || data.size) && (
                <div className="meta-row">
                  {data.category && (
                    <div className="meta-pill">
                      <span className="meta-label">Category</span>
                      <span className="meta-value">{data.category}</span>
                    </div>
                  )}

                  {data.size && (
                    <div className="meta-pill">
                      <span className="meta-label">Size</span>
                      <span className="meta-value">{data.size}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="description-block">
                <h3>Description</h3>
                <p className="description">{description}</p>
              </div>

              <div className="cta-wrap">
                <AddToCartButton productId={id} />
              </div>
            </div>
          </div>
        </div>

        <style>{`
          .detail-layout {
            display: grid;
            grid-template-columns: minmax(0, 1.1fr) 420px;
            gap: 48px;
            align-items: start;
          }

          .product-info {
            position: sticky;
            top: 24px;
            background: #f8f6ef;
            border: 1px solid rgba(122, 31, 31, 0.08);
            border-radius: 28px;
            padding: 28px 26px;
            box-shadow: 0 14px 40px rgba(0, 0, 0, 0.04);
          }

          .product-info h1 {
            margin: 0 0 16px;
            font-size: 33px;
            line-height: 1.2;
            font-weight: 700;
            color: #241f1a;
          }

          .price-block {
            margin-bottom: 22px;
          }

          .price-line {
            display: flex;
            align-items: baseline;
            flex-wrap: wrap;
            gap: 10px;
            margin-bottom: 8px;
          }

          .now-label {
            font-size: 14px;
            font-weight: 700;
            color: #7a1f1f;
          }

          .current-price {
            font-size: 24px;
            font-weight: 800;
            color: #1f2a44;
            line-height: 1;
          }

          .old-price {
            font-size: 16px;
            font-weight: 500;
            color: #5f564d;
            opacity: 0.9;
            text-decoration: line-through;
            line-height: 1;
          }

          .sale-note {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 8px;
            font-size: 14px;
            font-weight: 700;
            color: #5e8a1f;
          }

          .dot {
            color: #5e8a1f;
          }

          .meta-row {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-bottom: 24px;
          }

          .meta-pill {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            flex-wrap: wrap;
            padding: 10px 14px;
            border-radius: 999px;
            background: #efe8e3;
            border: 1px solid rgba(122, 31, 31, 0.08);
          }

          .meta-label {
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            color: #8f8376;
          }

          .meta-value {
            font-size: 14px;
            font-weight: 600;
            color: #413932;
          }

          .description-block {
            border-top: 1px solid rgba(0, 0, 0, 0.08);
            padding-top: 20px;
          }

          .description-block h3 {
            margin: 0 0 10px;
            font-size: 15px;
            font-weight: 700;
            color: #2a241f;
            letter-spacing: 0.02em;
          }

          .description {
            margin: 0;
            font-size: 15px;
            line-height: 1.85;
            color: #4d463f;
            white-space: pre-line;
          }

          .cta-wrap {
            margin-top: 26px;
          }

          @media (max-width: 1180px) {
            .detail-layout {
              grid-template-columns: 1fr;
              gap: 30px;
            }

            .product-info {
              position: static;
            }
          }

          @media (max-width: 640px) {
            .product-info {
              padding: 22px 18px;
              border-radius: 22px;
            }

            .product-info h1 {
              font-size: 27px;
            }

            .current-price {
              font-size: 22px;
            }

            .old-price {
              font-size: 15px;
            }

            .sale-note {
              font-size: 13px;
            }

            .description {
              font-size: 14px;
              line-height: 1.75;
            }
          }
        `}</style>
      </main>

      <Footer />
    </>
  );
}
