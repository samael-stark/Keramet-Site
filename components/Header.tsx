"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  FaHeart,
  FaUser,
  FaShoppingBag,
  FaHome,
  FaStore,
  FaTruck,
} from "react-icons/fa";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { getCartCount } from "@/lib/cart";

export default function Header() {
  const [showAccountModal, setShowAccountModal] = useState(false);
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const updateWishlistCount = () => {
      const stored = localStorage.getItem("wishlist");
      const ids = stored ? JSON.parse(stored) : [];
      setWishlistCount(ids.length);
    };

    updateWishlistCount();
    window.addEventListener("storage", updateWishlistCount);
    window.addEventListener("wishlistUpdated", updateWishlistCount);

    return () => {
      window.removeEventListener("storage", updateWishlistCount);
      window.removeEventListener("wishlistUpdated", updateWishlistCount);
    };
  }, []);

  useEffect(() => {
    const updateCartCount = () => {
      const count = getCartCount();
      setCartCount(count);
    };

    updateCartCount();
    window.addEventListener("storage", updateCartCount);
    window.addEventListener("cartUpdated", updateCartCount);

    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  const isHome = pathname === "/";
  const isShop = pathname.startsWith("/products");

  const navClass = (active: boolean) =>
    active ? "text-custom-accent" : "hover:text-custom-accent";

  const bottomNavClass = (path: string) =>
    pathname === path || pathname.startsWith(path)
      ? "text-custom-accent"
      : "text-gray-500";

  return (
    <>
      <header className="bg-custom-bg sticky top-0 z-50 shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between border-b border-gray-200 relative">
          <div className="hidden lg:block w-24 md:w-72" />

          <div className="flex flex-col items-center flex-1">
            <Link href="/" className="flex items-center gap-3">
              <img
                src="/img/Kerametlogo.png"
                alt="Keramet Rugs Logo"
                className="brand-logo"
              />
              <h1 className="text-2xl md:text-4xl font-extrabold tracking-widest text-custom-accent uppercase">
                KERAMET RUGS
              </h1>
            </Link>

            <p className="text-[11px] md:text-xs tracking-[0.25em] text-gray-600 uppercase mt-1">
              Every House Needs
            </p>
          </div>

          <div className="hidden lg:flex w-24 md:w-72 justify-end items-center gap-4 md:gap-6 text-gray-600">
            <Link
              href="/wishlist"
              className="hover:text-custom-accent relative shrink-0"
            >
              <FaHeart className="text-xl" />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-custom-accent text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              className="hover:text-custom-accent relative shrink-0"
            >
              <FaShoppingBag className="text-xl" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-custom-accent text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-2 min-w-0 justify-end">
                <span className="text-sm font-semibold hidden md:block truncate max-w-[140px]">
                  {user.displayName || user.email}
                </span>
                <button
                  onClick={() => signOut(auth)}
                  className="text-xs text-red-600 hover:underline shrink-0"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/auth" className="shrink-0">
                <FaUser className="text-xl hover:text-custom-accent cursor-pointer" />
              </Link>
            )}
          </div>
        </div>

        {/* DESKTOP NAV */}
        <nav className="hidden lg:flex justify-center py-3 text-gray-800 text-sm font-semibold">
          <div className="flex items-center gap-10">
            <Link href="/" className={navClass(isHome)}>
              HOME
            </Link>
            <Link href="/#categories">RUG COLLECTION</Link>
            <Link href="/products" className={navClass(isShop)}>
              SHOP
            </Link>

            <Link
              href="/track-order"
              className={navClass(pathname === "/track-order")}
            >
              TRACK ORDER
            </Link>

            <Link href="/#aboutus">ABOUT</Link>
            <Link href="/#contact">CONTACT</Link>
          </div>
        </nav>
      </header>

      {/* MOBILE NAV */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-custom-bg border-t border-gray-200 shadow-md z-50">
        <div className="flex justify-around py-3 text-xs font-medium">
          <Link
            href="/"
            className={`flex flex-col items-center ${bottomNavClass("/")}`}
          >
            <FaHome className="text-lg mb-1" />
            <span>Home</span>
          </Link>

          <Link
            href="/products"
            className={`flex flex-col items-center ${bottomNavClass("/products")}`}
          >
            <FaStore className="text-lg mb-1" />
            <span>Shop</span>
          </Link>

          {/* UPDATED TRACK ICON */}
          <Link
            href="/track-order"
            className={`flex flex-col items-center ${bottomNavClass("/track-order")}`}
          >
            <FaTruck className="text-lg mb-1" />
            <span>Track</span>
          </Link>

          <Link
            href="/wishlist"
            className={`flex flex-col items-center relative ${bottomNavClass("/wishlist")}`}
          >
            <FaHeart className="text-lg mb-1" />
            {wishlistCount > 0 && (
              <span className="absolute top-0 right-2 bg-custom-accent text-white text-[9px] rounded-full h-4 w-4 flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
            <span>Wishlist</span>
          </Link>

          <Link
            href="/cart"
            className={`flex flex-col items-center relative ${bottomNavClass("/cart")}`}
          >
            <FaShoppingBag className="text-lg mb-1" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-2 bg-custom-accent text-white text-[9px] rounded-full h-4 w-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
            <span>Cart</span>
          </Link>

          <button
            onClick={() => {
              if (user) {
                setShowAccountModal(true);
              } else {
                window.location.href = "/auth";
              }
            }}
            className="flex flex-col items-center text-gray-500"
          >
            <FaUser className="text-lg mb-1" />
            <span>{user ? "Account" : "Login"}</span>
          </button>
        </div>
      </div>

      {/* ACCOUNT MODAL */}
      {showAccountModal && user && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center lg:hidden">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setShowAccountModal(false)}
          />

          <div className="relative w-full bg-custom-bg rounded-t-2xl p-6 shadow-xl animate-slideUp">
            <div className="text-center mb-4">
              <p className="font-semibold text-lg">
                {user.displayName || "User"}
              </p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>

            <button
              onClick={() => {
                signOut(auth);
                setShowAccountModal(false);
              }}
              className="w-full py-3 bg-[#7a1f1f] text-white rounded-lg font-semibold"
            >
              Logout
            </button>

            <button
              onClick={() => setShowAccountModal(false)}
              className="w-full py-3 mt-3 border border-gray-300 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
