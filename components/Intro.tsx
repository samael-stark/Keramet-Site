import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

export default function Intro() {
  return (
    <section className="bg-custom-bg py-16 px-6 sm:px-10 lg:px-16 flex justify-center border-t border-b border-gray-200">
      <div className="text-center max-w-4xl">
        <p className="text-sm font-medium text-gray-700 uppercase tracking-wide mb-2">
          KERAMET HALI DELIVER TO YOUR DOOR STEP{" "}
          <span className="font-bold">WORLDWIDE</span>
        </p>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 leading-tight mb-4">
          Carpets and Rugs Collection{" "}
          <span className="text-custom-accent">Keramet Hali</span>
        </h2>

        <p className="text-lg text-gray-700 mb-8">
          More than 1000+ new products by Keramet Hali.
        </p>

        <Link
          href="/products"
          className="inline-flex items-center border border-custom-accent text-custom-accent hover:bg-custom-accent hover:text-white font-semibold py-3 px-8 rounded-full transition-colors"
        >
          Shop Now <FaArrowRight className="ml-2" />
        </Link>
      </div>
    </section>
  );
}
