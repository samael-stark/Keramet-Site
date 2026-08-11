"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { auth, db } from "@/lib/firebase";

import { onAuthStateChanged } from "firebase/auth";

import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

const ADMIN_EMAIL =
  process.env.NEXT_PUBLIC_ADMIN_EMAIL ||
  "keramethalisecond@gmail.com";

const UNIT_OPTIONS = ["ft", "in", "cm", "m"] as const;

type Unit = (typeof UNIT_OPTIONS)[number];

export default function EditProductPage() {
  const router = useRouter();

  const params = useParams();

  const id = params.id as string;

  const [userEmail, setUserEmail] = useState("");

  const isAdmin = useMemo(
    () =>
      (userEmail || "").toLowerCase() ===
      ADMIN_EMAIL.toLowerCase(),
    [userEmail],
  );

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [productId, setProductId] = useState("");

  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

  const [category, setCategory] = useState("");

  const [price, setPrice] = useState("");

  const [madeYear, setMadeYear] = useState("");

  const [stock, setStock] = useState("1");

  const [width, setWidth] = useState("");

  const [widthUnit, setWidthUnit] =
    useState<Unit>("ft");

  const [length, setLength] = useState("");

  const [lengthUnit, setLengthUnit] =
    useState<Unit>("ft");

  useEffect(() => {
    const unsub = onAuthStateChanged(
      auth,
      (u) => {
        setUserEmail(u?.email || "");
      },
    );

    return () => unsub();
  }, []);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const snap = await getDoc(
          doc(db, "products", id),
        );

        if (!snap.exists()) {
          setError("Product not found.");
          setLoading(false);
          return;
        }

        const data: any = snap.data();

        setProductId(data.productId || "");

        setTitle(data.title || "");

        setDescription(data.description || "");

        setCategory(data.category || "");

        setPrice(
          data.price
            ? String(data.price)
            : "",
        );

        setMadeYear(
          data.madeYear
            ? String(data.madeYear)
            : "",
        );

        setStock(
  data.stock === 0
    ? "0"
    : "1",
);

        setWidth(
          data.dimensions?.width
            ? String(
                data.dimensions.width,
              )
            : "",
        );

        setLength(
          data.dimensions?.length
            ? String(
                data.dimensions.length,
              )
            : "",
        );

        setWidthUnit(
          data.dimensions?.widthUnit ||
            "ft",
        );

        setLengthUnit(
          data.dimensions?.lengthUnit ||
            "ft",
        );

        setLoading(false);
      } catch (err) {
        console.error(err);

        setError(
          "Failed to load product.",
        );

        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id]);

  const onSave = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();

    setError("");

    if (!isAdmin) {
      return setError(
        `Admin only. Login as ${ADMIN_EMAIL}`,
      );
    }

    setSaving(true);

    try {
      const computedSize =
        width && length
          ? `${width} ${widthUnit} x ${length} ${lengthUnit}`
          : "";

      await updateDoc(
        doc(db, "products", id),
        {
          productId: productId.trim(),

          title: title.trim(),

          description:
            description.trim(),

          category: category.trim(),

          price: Number(price),

          stock: Number(stock),

          madeYear: madeYear
            ? Number(madeYear)
            : null,

          size: computedSize,

          dimensions: {
            width: width
              ? Number(width)
              : null,

            widthUnit,

            length: length
              ? Number(length)
              : null,

            lengthUnit,
          },
        },
      );

      router.push(
        "/admin/products",
      );
    } catch (err) {
      console.error(err);

      setError(
        "Failed to update product.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="p-10">
        Loading product...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-custom-bg px-6 py-10">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-3xl font-extrabold text-custom-accent mb-8">
          Edit Product
        </h1>

        <form
          onSubmit={onSave}
          className="space-y-5"
        >
          <input
            className="w-full border rounded-xl p-3"
            value={productId}
            onChange={(e) =>
              setProductId(
                e.target.value,
              )
            }
            placeholder="Product ID"
          />

          <input
            className="w-full border rounded-xl p-3"
            value={title}
            onChange={(e) =>
              setTitle(
                e.target.value,
              )
            }
            placeholder="Title"
          />

          <textarea
            className="w-full border rounded-xl p-3 min-h-[140px]"
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value,
              )
            }
            placeholder="Description"
          />

          <input
            className="w-full border rounded-xl p-3"
            value={category}
            onChange={(e) =>
              setCategory(
                e.target.value,
              )
            }
            placeholder="Category"
          />

          <input
            type="number"
            className="w-full border rounded-xl p-3"
            value={price}
            onChange={(e) =>
              setPrice(
                e.target.value,
              )
            }
            placeholder="Price"
          />

          <input
            className="w-full border rounded-xl p-3"
            value={madeYear}
            onChange={(e) =>
              setMadeYear(
                e.target.value,
              )
            }
            placeholder="Made Year"
          />

          <div className="space-y-2">
  <label className="block text-sm font-semibold text-gray-700">
    Stock
  </label>

  <select
    className="w-full border rounded-xl p-3 bg-white"
    value={stock}
    onChange={(e) => setStock(e.target.value)}
  >
    <option value="1">
      1 — Available
    </option>

    <option value="0">
      0 — Sold Out
    </option>
  </select>

  <p className="text-sm text-gray-500">
    Keramet products are one-of-one. Keep stock at 1 while the rug is available and 0 once sold.
  </p>
</div>

          <div className="grid grid-cols-2 gap-4">
            <input
              className="border rounded-xl p-3"
              value={width}
              onChange={(e) =>
                setWidth(
                  e.target.value,
                )
              }
              placeholder="Width"
            />

            <select
              className="border rounded-xl p-3"
              value={widthUnit}
              onChange={(e) =>
                setWidthUnit(
                  e.target
                    .value as Unit,
                )
              }
            >
              {UNIT_OPTIONS.map(
                (u) => (
                  <option
                    key={u}
                    value={u}
                  >
                    {u}
                  </option>
                ),
              )}
            </select>

            <input
              className="border rounded-xl p-3"
              value={length}
              onChange={(e) =>
                setLength(
                  e.target.value,
                )
              }
              placeholder="Length"
            />

            <select
              className="border rounded-xl p-3"
              value={lengthUnit}
              onChange={(e) =>
                setLengthUnit(
                  e.target
                    .value as Unit,
                )
              }
            >
              {UNIT_OPTIONS.map(
                (u) => (
                  <option
                    key={u}
                    value={u}
                  >
                    {u}
                  </option>
                ),
              )}
            </select>
          </div>

          {error && (
            <div className="text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-custom-accent px-8 py-3 font-bold text-white"
          >
            {saving
              ? "Updating..."
              : "Update Product"}
          </button>
        </form>
      </div>
    </main>
  );
}
