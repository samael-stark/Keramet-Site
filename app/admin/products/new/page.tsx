"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { uploadImagesToStorage } from "@/lib/upload";
import { FaMagic } from "react-icons/fa";

const ADMIN_EMAIL =
  process.env.NEXT_PUBLIC_ADMIN_EMAIL || "keramethalisecond@gmail.com";

const MAX_IMAGES = 7;
const CURRENCY: "USD" = "USD";

const YEAR_OPTIONS = Array.from(
  { length: 2026 - 2016 + 1 },
  (_, i) => 2016 + i
);
const UNIT_OPTIONS = ["ft", "in", "cm", "m"] as const;
type Unit = (typeof UNIT_OPTIONS)[number];

function generate7DigitId() {
  return String(Math.floor(1000000 + Math.random() * 9000000));
}

/** Client-side image compression (~90% quality) before upload */
async function compressImage(file: File, quality = 0.9): Promise<File> {
  if (!file.type.startsWith("image/")) return file;

  return new Promise((resolve) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = () => (img.src = reader.result as string);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve(file);

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (!blob) return resolve(file);

          resolve(
            new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            })
          );
        },
        file.type,
        quality
      );
    };

    img.onerror = () => resolve(file);
    reader.onerror = () => resolve(file);

    reader.readAsDataURL(file);
  });
}

function TrashIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M9 3h6m-8 4h10m-9 0 1 15h6l1-15M10 7v12m4-12v12"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function NewProductPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [userEmail, setUserEmail] = useState("");
  const isAdmin = useMemo(
    () => (userEmail || "").toLowerCase() === ADMIN_EMAIL.toLowerCase(),
    [userEmail]
  );

  // fields
  const [productId, setProductId] = useState<string>(generate7DigitId());
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState<string>("");
  const [madeYear, setMadeYear] = useState<number>(2024);

  const [width, setWidth] = useState<string>("");
  const [widthUnit, setWidthUnit] = useState<Unit>("ft");
  const [length, setLength] = useState<string>("");
  const [lengthUnit, setLengthUnit] = useState<Unit>("ft");

  // images
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [activeIdx, setActiveIdx] = useState<number>(0);

  // status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUserEmail(u?.email || ""));
    return () => unsub();
  }, []);

  useEffect(() => {
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    setActiveIdx((prev) => Math.min(prev, Math.max(0, urls.length - 1)));
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [files]);

  const openPicker = () => fileInputRef.current?.click();

  const onPickFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files || []);
    if (!picked.length) return;

    setError("");

    try {
      const compressed = await Promise.all(
        picked.map((f) => compressImage(f, 0.9))
      );
      setFiles((prev) => [...prev, ...compressed].slice(0, MAX_IMAGES));
    } catch (err) {
      console.error(err);
      setError("Image processing failed. Please try again.");
    } finally {
      e.target.value = "";
    }
  };

  const removeImage = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
    setActiveIdx((prev) => {
      if (idx === prev) return 0;
      if (idx < prev) return prev - 1;
      return prev;
    });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isAdmin) return setError(`Admin only. Please login as ${ADMIN_EMAIL}`);
    if (!productId.trim()) return setError("Please enter Product ID.");
    if (!title.trim()) return setError("Please enter a title.");
    if (!price || Number(price) <= 0) return setError("Enter a valid price.");
    if (!category.trim()) return setError("Please enter a category.");
    if (files.length === 0)
      return setError(`Please select at least 1 image (max ${MAX_IMAGES}).`);

    const computedSize =
      width && length ? `${width} ${widthUnit} x ${length} ${lengthUnit}` : "";

    setLoading(true);

    try {
      const imageUrls = await uploadImagesToStorage(files);

      await addDoc(collection(db, "products"), {
        productId: productId.trim(),
        title: title.trim(),
        description: description.trim(),
        category: category.trim(),
        price: Number(price),
        currency: CURRENCY,

        // compatibility
        size: computedSize,

        images: imageUrls,
        coverUrl: imageUrls[0] || "",
        isActive: true,
        createdAt: serverTimestamp(),

        madeYear,
        dimensions: {
          width: width ? Number(width) : null,
          widthUnit,
          length: length ? Number(length) : null,
          lengthUnit,
        },
      });

      router.push("/admin/products");
    } catch (err: any) {
      setError(err?.message || "Something went wrong while saving.");
    } finally {
      setLoading(false);
    }
  };

  // UI helpers
  const card =
    "rounded-3xl border border-gray-200/70 bg-white/60 backdrop-blur shadow-[0_18px_60px_rgba(0,0,0,0.08)]";
  const label = "block text-sm font-semibold text-gray-700";
  const input =
    "mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50/80 px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-custom-accent";
  const smallInput =
    "h-12 rounded-2xl border border-gray-200 bg-gray-50/80 px-4 outline-none focus:ring-2 focus:ring-custom-accent";

  // visible delete button style
  const deleteBtn =
    "rounded-full bg-custom-accent text-white shadow-lg ring-2 ring-white flex items-center justify-center hover:opacity-90 transition";

  return (
    <main className="min-h-screen bg-custom-bg px-6 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-custom-accent tracking-widest uppercase">
              Add Product
            </h1>
            <p className="mt-2 text-gray-700">
              Up to {MAX_IMAGES} images. Currency is <b>USD</b>.
            </p>
          </div>

          <Link
            href="/admin/products"
            className="rounded-full border border-gray-300 bg-white/70 px-6 py-2.5 font-semibold text-gray-900 hover:bg-white transition"
          >
            ← Back
          </Link>
        </div>

        <form id="add-product-form" onSubmit={onSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT */}
            <div className="lg:col-span-2 space-y-6">
              <section className={card}>
                <div className="p-6">
                  <h2 className="text-lg font-extrabold text-gray-900">
                    General Information
                  </h2>

                  <div className="mt-5">
                    <label className={label}>Product Title</label>
                    <input
                      className={input}
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Handmade Vintage Afghan Rug"
                    />
                  </div>

                  <div className="mt-5">
                    <label className={label}>Description</label>
                    <textarea
                      className={`${input} min-h-[140px]`}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Material, origin, condition notes, story..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                    <div>
                      <label className={label}>Category</label>
                      <input
                        className={input}
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="Afghan / Wool / Vintage"
                      />
                    </div>

                    <div>
                      <label className={label}>Made Year</label>
                      <select
                        className={`${smallInput} w-full mt-2 px-4`}
                        value={madeYear}
                        onChange={(e) => setMadeYear(Number(e.target.value))}
                      >
                        {YEAR_OPTIONS.map((y) => (
                          <option key={y} value={y}>
                            {y}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </section>

              <section className={card}>
                <div className="p-6">
                  <h2 className="text-lg font-extrabold text-gray-900">
                    Pricing & Dimensions
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                    <div>
                      <label className={label}>Price (USD)</label>

                      <div className="mt-2 flex items-stretch">
                        <span className="inline-flex items-center justify-center w-12 rounded-l-2xl border border-gray-200 bg-gray-100 text-gray-800 font-extrabold">
                          $
                        </span>
                        <input
                          type="number"
                          min="1"
                          className="w-full h-12 rounded-r-2xl border border-l-0 border-gray-200 bg-gray-50/80 px-4 outline-none focus:ring-2 focus:ring-custom-accent"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          placeholder="399"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={label}>Width</label>
                        <input
                          inputMode="decimal"
                          className={`${smallInput} w-full mt-2`}
                          value={width}
                          onChange={(e) =>
                            setWidth(e.target.value.replace(/[^\d.]/g, ""))
                          }
                          placeholder="4"
                        />
                      </div>

                      <div>
                        <label className={label}>Unit</label>
                        <select
                          className={`${smallInput} w-full mt-2 px-3`}
                          value={widthUnit}
                          onChange={(e) => setWidthUnit(e.target.value as Unit)}
                        >
                          {UNIT_OPTIONS.map((u) => (
                            <option key={u} value={u}>
                              {u}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className={label}>Length</label>
                        <input
                          inputMode="decimal"
                          className={`${smallInput} w-full mt-2`}
                          value={length}
                          onChange={(e) =>
                            setLength(e.target.value.replace(/[^\d.]/g, ""))
                          }
                          placeholder="6"
                        />
                      </div>

                      <div>
                        <label className={label}>Unit</label>
                        <select
                          className={`${smallInput} w-full mt-2 px-3`}
                          value={lengthUnit}
                          onChange={(e) =>
                            setLengthUnit(e.target.value as Unit)
                          }
                        >
                          {UNIT_OPTIONS.map((u) => (
                            <option key={u} value={u}>
                              {u}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 text-sm text-gray-600">
                    Saved size:{" "}
                    <b>
                      {width || "—"} {widthUnit}
                    </b>{" "}
                    ×{" "}
                    <b>
                      {length || "—"} {lengthUnit}
                    </b>
                  </p>
                </div>
              </section>

              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50/80 p-3 text-sm text-red-800">
                  {error}
                </div>
              )}
            </div>

            {/* RIGHT */}
            <div className="space-y-6">
              {/* ✅ Product ID section moved to TOP, no big bottom generate anymore */}
              <section className={card}>
                <div className="p-6">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-lg font-extrabold text-gray-900">
                      Product ID
                    </h2>

                    <button
                      type="button"
                      onClick={() => setProductId(generate7DigitId())}
                      className="rounded-full border border-gray-300 bg-white/80 px-4 py-2 text-sm font-bold text-gray-900 hover:bg-white transition inline-flex items-center gap-2"
                      title="Generate new Product ID"
                    >
                      <FaMagic />
                      Generate
                    </button>
                  </div>

                  <label className={`${label} mt-4`}>Product ID</label>
                  <input
                    className={input}
                    value={productId}
                    onChange={(e) =>
                      setProductId(
                        e.target.value.replace(/[^0-9]/g, "").slice(0, 7)
                      )
                    }
                    placeholder="1623107"
                  />
                </div>
              </section>

              <section className={card}>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-extrabold text-gray-900">
                      Upload Images
                    </h2>
                    <span className="text-sm text-gray-600">
                      {files.length}/{MAX_IMAGES}
                    </span>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={onPickFiles}
                    className="hidden"
                  />

                  {/* ✅ Main preview width = 200px */}
                  <div className="mt-4 flex justify-center">
                    <div className="relative w-[200px] max-w-full rounded-3xl bg-gray-50/80 border border-gray-200 overflow-hidden h-40 flex items-center justify-center">
                      {previews[activeIdx] ? (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={previews[activeIdx]}
                            alt="Main preview"
                            className="h-full w-full object-cover"
                          />

                          <button
                            type="button"
                            onClick={() => removeImage(activeIdx)}
                            className={`absolute top-2 right-2 h-11 w-11 ${deleteBtn}`}
                            title="Remove this image"
                            aria-label="Remove current image"
                          >
                            <TrashIcon size={22} />
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={openPicker}
                          className="flex flex-col items-center justify-center text-gray-500"
                        >
                          <span className="h-12 w-12 rounded-full bg-green-200 text-green-700 flex items-center justify-center text-2xl font-bold">
                            +
                          </span>
                          <span className="mt-2 font-semibold">Add images</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* ✅ Thumbnails row (delete is INSIDE each tile, so no icons below) */}
                  <div className="mt-4 flex items-center gap-3 overflow-x-auto pb-1">
                    {previews.map((src, idx) => (
                      <button
                        key={src}
                        type="button"
                        onClick={() => setActiveIdx(idx)}
                        className={[
                          "relative shrink-0 h-16 w-16 rounded-2xl overflow-hidden border transition bg-white",
                          idx === activeIdx
                            ? "border-gray-900"
                            : "border-gray-200 hover:border-gray-400",
                        ].join(" ")}
                        title="Select image"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={src}
                          alt={`Preview ${idx + 1}`}
                          className="h-full w-full object-cover"
                        />

                        {/* ✅ Delete button INSIDE tile (no under-icons possible) */}
                        <span className="absolute top-1 right-1">
                          <span
                            onClick={(ev) => {
                              ev.stopPropagation();
                              removeImage(idx);
                            }}
                            className={`h-9 w-9 ${deleteBtn} cursor-pointer`}
                            title="Remove"
                            aria-label="Remove image"
                          >
                            <TrashIcon size={18} />
                          </span>
                        </span>

                        {/* ✅ COVER truly centered */}
                        {idx === 0 && (
                          <span className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                            <span className="rounded-full bg-custom-accent text-custom-bg text-[11px] font-extrabold px-3 py-1 shadow-lg ring-2 ring-white/80">
                              COVER
                            </span>
                          </span>
                        )}
                      </button>
                    ))}

                    {files.length < MAX_IMAGES && (
                      <button
                        type="button"
                        onClick={openPicker}
                        className="shrink-0 h-16 w-16 rounded-2xl border border-dashed border-gray-300 bg-white/60 hover:bg-white transition flex items-center justify-center"
                        title="Add"
                      >
                        <span className="h-9 w-9 rounded-full bg-green-200 text-green-700 flex items-center justify-center text-xl font-bold">
                          +
                        </span>
                      </button>
                    )}
                  </div>

                  <p className="mt-4 text-center text-sm text-gray-600">
                    Selected: <b>{files.length}</b> / {MAX_IMAGES}{" "}
                    (auto-compressed ~90%)
                  </p>

                  <div className="mt-4 flex justify-center">
                    <button
                      type="button"
                      onClick={openPicker}
                      className="rounded-full bg-custom-accent px-6 py-2.5 font-bold text-custom-bg hover:bg-custom-accent-light transition"
                    >
                      Add Images
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* ✅ Save button at VERY END of page */}
          <div className="mt-8">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-custom-accent text-custom-bg font-extrabold py-4 text-lg shadow-xl hover:bg-custom-accent-light transition disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
