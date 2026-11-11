"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  FaHeart,
  FaUser,
  FaShoppingBag,
  FaHome,
  FaStore,
  FaTruck,
  FaPhoneAlt,
  FaRegHeart,
  FaRegUser,
} from "react-icons/fa";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { getCartCount } from "@/lib/cart";

const NAV_LINKS = [
  { href: "/", label: "Home", match: (p: string) => p === "/" },
  { href: "/#categories", label: "Collections", match: () => false },
  { href: "/products", label: "Shop", match: (p: string) => p.startsWith("/products") },
  { href: "/track-order", label: "Track Order", match: (p: string) => p === "/track-order" },
  { href: "/#aboutus", label: "About", match: () => false },
  { href: "/#contact", label: "Contact", match: () => false },
];

function readWishlistCount() {
  try {
    const stored = localStorage.getItem("wishlist");
    const ids = stored ? JSON.parse(stored) : [];
    return Array.isArray(ids) ? ids.length : 0;
  } catch {
    return 0;
  }
}

function CountBadge({ count }: { count: number }) {
  if (count <= 0) return null;

  return (
    <span className="absolute -right-2 -top-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-custom-accent px-1 text-[10px] font-semibold text-white">
      {count}
    </span>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const update = () => setWishlistCount(readWishlistCount());

    update();
    window.addEventListener("storage", update);
    window.addEventListener("wishlistUpdated", update);

    return () => {
      window.removeEventListener("storage", update);
      window.removeEventListener("wishlistUpdated", update);
    };
  }, []);

  useEffect(() => {
    const update = () => setCartCount(getCartCount());

    update();
    window.addEventListener("storage", update);
    window.addEventListener("cartUpdated", update);

    return () => {
      window.removeEventListener("storage", update);
      window.removeEventListener("cartUpdated", update);
    };
  }, []);

  // Compact header after scrolling a little.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the desktop account menu on outside click.
  useEffect(() => {
    if (!showAccountMenu) return;

    const onClick = (e: MouseEvent) => {
      if (!accountMenuRef.current?.contains(e.target as Node)) {
        setShowAccountMenu(false);
      }
    };

    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [showAccountMenu]);

  // Bottom nav: "/" must match exactly, other tabs by prefix.
  const isBottomActive = (path: string) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);

  const bottomNavClass = (path: string) =>
    isBottomActive(path) ? "text-custom-accent" : "text-ink/55";

  const userLabel = user?.displayName || user?.email || "";

  return (
    <>
      <header className="sticky top-0 z-50">
        {/* Announcement bar */}
        <div
          className={`overflow-hidden bg-custom-accent text-white transition-all duration-300 ${
            scrolled ? "max-h-0" : "max-h-12"
          }`}
        >
          {/* Left: payment · Center: delivery · Right: phone.
              Phones show only the centered delivery line. */}
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-6 px-4 py-2 text-[11px] tracking-[0.14em] md:grid-cols-3">
            <span className="hidden md:block">SECURE PAYMENT</span>
            <span className="text-center font-semibold">WORLDWIDE DELIVERY IN 3–7 DAYS</span>
            <a
              href="tel:+905065274930"
              className="hidden items-center gap-2 justify-self-end hover:text-gold md:inline-flex"
            >
              <FaPhoneAlt className="text-[10px]" />
              +90 506 527 49 30
            </a>
          </div>
        </div>

        <div
          className={`border-b border-line bg-custom-bg/95 backdrop-blur transition-shadow ${
            scrolled ? "shadow-[0_6px_24px_rgba(0,0,0,0.06)]" : ""
          }`}
        >
          {/* Logo row */}
          <div
            className={`relative mx-auto flex max-w-7xl items-center justify-between px-4 transition-all duration-300 lg:px-10 ${
              scrolled ? "py-2" : "py-4"
            }`}
          >
            <div className="hidden w-64 lg:block" />

            <Link href="/" className="flex flex-1 flex-col items-center">
              <span className="flex items-center gap-3">
                <img
                  src="/img/Kerametlogo.png"
                  alt="Keramet Rugs logo"
                  className={`object-contain transition-all duration-300 ${
                    scrolled ? "h-10 w-10" : "h-12 w-12 md:h-16 md:w-16"
                  }`}
                />
                <span
                  className={`font-display font-semibold uppercase tracking-[0.12em] text-custom-accent transition-all duration-300 ${
                    scrolled ? "text-2xl md:text-3xl" : "text-3xl md:text-[2.75rem]"
                  }`}
                >
                  Keramet Rugs
                </span>
              </span>

              <span
                className={`overflow-hidden text-[10px] uppercase tracking-[0.3em] text-muted transition-all duration-300 md:text-[11px] ${
                  scrolled ? "max-h-0 opacity-0" : "mt-1 max-h-6 opacity-100"
                }`}
              >
                Every House Needs
              </span>
            </Link>

            {/* Desktop icons */}
            <div className="hidden w-64 items-center justify-end gap-6 text-ink/75 lg:flex">
              <Link
                href="/wishlist"
                className="relative hover:text-custom-accent"
                aria-label="Wishlist"
              >
                <FaRegHeart className="text-xl" />
                <CountBadge count={wishlistCount} />
              </Link>

              <Link
                href="/cart"
                className="relative hover:text-custom-accent"
                aria-label="Cart"
              >
                <FaShoppingBag className="text-xl" />
                <CountBadge count={cartCount} />
              </Link>

              {user ? (
                <div className="relative" ref={accountMenuRef}>
                  <button
                    onClick={() => setShowAccountMenu((v) => !v)}
                    className="flex items-center gap-2 hover:text-custom-accent"
                    aria-haspopup="menu"
                    aria-expanded={showAccountMenu}
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-custom-accent font-display text-base font-semibold uppercase text-white">
                      {userLabel.charAt(0)}
                    </span>
                    <span className="max-w-[120px] truncate text-sm font-semibold">
                      {user.displayName || "My Account"}
                    </span>
                  </button>

                  {showAccountMenu ? (
                    <div
                      role="menu"
                      className="absolute right-0 top-full mt-3 w-60 rounded-sm border border-line bg-paper p-4 shadow-xl"
                    >
                      <p className="truncate text-sm font-semibold text-ink">
                        {user.displayName || "My Account"}
                      </p>
                      <p className="truncate text-xs text-muted">{user.email}</p>

                      <div className="mt-4 space-y-1 border-t border-line pt-3 text-sm">
                        <Link
                          href="/track-order"
                          className="block rounded-sm px-2 py-1.5 text-ink/80 hover:bg-custom-bg hover:text-custom-accent"
                        >
                          Track Order
                        </Link>
                        <button
                          onClick={() => {
                            signOut(auth);
                            setShowAccountMenu(false);
                          }}
                          className="block w-full rounded-sm px-2 py-1.5 text-left text-custom-accent hover:bg-custom-bg"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : (
                <Link
                  href="/auth"
                  className="hover:text-custom-accent"
                  aria-label="Sign in"
                >
                  <FaRegUser className="text-xl" />
                </Link>
              )}
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden justify-center border-t border-line/70 lg:flex" aria-label="Main menu">
            <ul className="flex items-center gap-10">
              {NAV_LINKS.map((link) => {
                const active = link.match(pathname);

                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`group relative block py-3 text-[12px] font-semibold uppercase tracking-[0.18em] transition ${
                        active ? "text-custom-accent" : "text-ink/80 hover:text-custom-accent"
                      }`}
                    >
                      {link.label}
                      <span
                        className={`absolute inset-x-0 bottom-2 h-px origin-left bg-custom-accent transition-transform duration-300 ${
                          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                        }`}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </header>

      {/* Mobile bottom nav */}
      <nav
        className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-paper/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-6px_20px_rgba(0,0,0,0.05)] backdrop-blur lg:hidden"
        aria-label="Bottom menu"
      >
        <div className="flex justify-around py-2.5 text-[11px] font-medium">
          <Link href="/" className={`flex flex-col items-center gap-1 ${bottomNavClass("/")}`}>
            <FaHome className="text-lg" />
            <span>Home</span>
          </Link>

          <Link
            href="/products"
            className={`flex flex-col items-center gap-1 ${bottomNavClass("/products")}`}
          >
            <FaStore className="text-lg" />
            <span>Shop</span>
          </Link>

          <Link
            href="/track-order"
            className={`flex flex-col items-center gap-1 ${bottomNavClass("/track-order")}`}
          >
            <FaTruck className="text-lg" />
            <span>Track</span>
          </Link>

          <Link
            href="/wishlist"
            className={`relative flex flex-col items-center gap-1 ${bottomNavClass("/wishlist")}`}
          >
            <span className="relative">
              <FaHeart className="text-lg" />
              <CountBadge count={wishlistCount} />
            </span>
            <span>Wishlist</span>
          </Link>

          <Link
            href="/cart"
            className={`relative flex flex-col items-center gap-1 ${bottomNavClass("/cart")}`}
          >
            <span className="relative">
              <FaShoppingBag className="text-lg" />
              <CountBadge count={cartCount} />
            </span>
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
            className={`flex flex-col items-center gap-1 ${bottomNavClass("/auth")}`}
          >
            <FaUser className="text-lg" />
            <span>{user ? "Account" : "Sign in"}</span>
          </button>
        </div>
      </nav>

      {/* Mobile account sheet */}
      {showAccountModal && user ? (
        <div className="fixed inset-0 z-[60] flex items-end justify-center lg:hidden">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setShowAccountModal(false)}
          />

          <div className="animate-slideUp relative w-full rounded-t-2xl bg-paper p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-xl">
            <div className="mb-5 text-center">
              <p className="font-display text-2xl font-semibold text-ink">
                {user.displayName || "User"}
              </p>
              <p className="text-sm text-muted">{user.email}</p>
            </div>

            <Link
              href="/track-order"
              onClick={() => setShowAccountModal(false)}
              className="block w-full rounded-full border border-custom-accent py-3 text-center text-sm font-semibold text-custom-accent"
            >
              Track Order
            </Link>

            <button
              onClick={() => {
                signOut(auth);
                setShowAccountModal(false);
              }}
              className="mt-3 w-full rounded-full bg-custom-accent py-3 text-sm font-semibold text-white"
            >
              Sign Out
            </button>

            <button
              onClick={() => setShowAccountModal(false)}
              className="mt-3 w-full py-2 text-sm text-muted"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
