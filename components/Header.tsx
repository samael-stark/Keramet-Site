"use client";

import Link from "next/link";
import { useState } from "react";
import { FaBars, FaHeart, FaUser, FaShoppingBag } from "react-icons/fa";

export default function Header() {
  const [open, setOpen] = useState(false);

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

        {/* Spacer for centering */}
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
          <a href="#" className="hover:text-custom-accent hidden sm:block">
            <FaHeart className="text-xl" />
          </a>

          <a href="#" className="hover:text-custom-accent hidden sm:block">
            <FaUser className="text-xl" />
          </a>

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
          <Link href="/" className="text-custom-accent">
            HOME
          </Link>

          {/* Scrolls */}
          <a href="#categories" className="hover:text-custom-accent">
            RUG COLLECTION
          </a>

          {/* No link yet */}
          <span className="cursor-default hover:text-custom-accent">SHOP</span>

          <span className="cursor-default hover:text-custom-accent">
            GALLERY
          </span>

          {/* Scrolls */}
          <a href="#aboutus" className="hover:text-custom-accent">
            ABOUT
          </a>

          {/* Scrolls */}
          <a href="#contact" className="hover:text-custom-accent">
            CONTACT
          </a>
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
                className="block py-2 border-b border-gray-200 hover:text-custom-accent"
                onClick={() => setOpen(false)}
              >
                HOME
              </Link>
            </li>

            <li>
              <a
                href="#categories"
                className="block py-2 border-b border-gray-200 hover:text-custom-accent"
                onClick={() => setOpen(false)}
              >
                RUG COLLECTION
              </a>
            </li>

            <li className="block py-2 border-b border-gray-200 text-gray-500">
              SHOP
            </li>

            <li className="block py-2 border-b border-gray-200 text-gray-500">
              GALLERY
            </li>

            <li>
              <a
                href="#aboutus"
                className="block py-2 border-b border-gray-200 hover:text-custom-accent"
                onClick={() => setOpen(false)}
              >
                ABOUT
              </a>
            </li>

            <li>
              <a
                href="#contact"
                className="block py-2 border-b border-gray-200 hover:text-custom-accent"
                onClick={() => setOpen(false)}
              >
                CONTACT
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
