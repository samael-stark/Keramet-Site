"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { FaBars, FaHeart, FaUser, FaShoppingBag } from "react-icons/fa";

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isShop = pathname.startsWith("/products");

  const navClass = (active: boolean) =>
    active ? "text-custom-accent" : "hover:text-custom-accent";

  return (
    <header className="bg-custom-bg sticky top-0 z-50 shadow-sm border-b border-gray-200">
      {/* Top row */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between border-b border-gray-200 relative">
        {/* Mobile menu button */}
        <button
          className="lg:hidden text-custom-accent"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <FaBars className="text-2xl" />
        </button>

        <div className="hidden lg:block w-24" />

        {/* Logo */}
        <div className="flex flex-col items-center flex-1">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/img/Kerametlogo.png"
              alt="Keramet Hali Logo"
              className="brand-logo"
            />
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-widest text-custom-accent uppercase">
              KERAMET HALI
            </h1>
          </Link>

          <p className="text-[11px] md:text-xs tracking-[0.25em] text-gray-600 uppercase mt-1">
            Every House Needs
          </p>
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-4 md:gap-6 text-gray-600">
          <FaHeart className="text-xl hover:text-custom-accent hidden sm:block cursor-pointer" />
          <FaUser className="text-xl hover:text-custom-accent hidden sm:block cursor-pointer" />

          <Link href="/cart" className="hover:text-custom-accent relative">
            <FaShoppingBag className="text-xl" />
            <span className="absolute -top-2 -right-2 bg-custom-accent text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
              0
            </span>
          </Link>
        </div>
      </div>

      {/* Desktop nav */}
      <nav className="hidden lg:flex justify-center py-3 text-gray-800 text-sm font-semibold">
        <div className="flex items-center gap-10">
          <Link href="/" className={navClass(isHome)}>
            HOME
          </Link>

          <Link href="/#categories" className={navClass(false)}>
            RUG COLLECTION
          </Link>

          <Link href="/products" className={navClass(isShop)}>
            SHOP
          </Link>

          <Link href="/#aboutus" className={navClass(false)}>
            ABOUT
          </Link>

          <Link href="/#contact" className={navClass(false)}>
            CONTACT
          </Link>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden fixed inset-0 bg-custom-bg z-50 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="text-xl font-bold text-custom-accent">Menu</div>
            <button
              className="text-custom-accent font-semibold"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>

          <ul className="space-y-4 text-lg text-gray-800">
            <li>
              <Link
                href="/"
                className="block py-2 border-b border-gray-200"
                onClick={() => setOpen(false)}
              >
                HOME
              </Link>
            </li>

            <li>
              <Link
                href="/#categories"
                className="block py-2 border-b border-gray-200"
                onClick={() => setOpen(false)}
              >
                RUG COLLECTION
              </Link>
            </li>

            <li>
              <Link
                href="/products"
                className="block py-2 border-b border-gray-200"
                onClick={() => setOpen(false)}
              >
                SHOP
              </Link>
            </li>

            <li>
              <Link
                href="/#aboutus"
                className="block py-2 border-b border-gray-200"
                onClick={() => setOpen(false)}
              >
                ABOUT
              </Link>
            </li>

            <li>
              <Link
                href="/#contact"
                className="block py-2 border-b border-gray-200"
                onClick={() => setOpen(false)}
              >
                CONTACT
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
