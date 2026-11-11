import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaPhoneAlt,
} from "react-icons/fa";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/#categories", label: "Collections" },
  { href: "/products", label: "Shop" },
  { href: "/track-order", label: "Track Order" },
  { href: "/#aboutus", label: "About" },
  { href: "/#contact", label: "Contact" },
];

const policyLinks = [
  { href: "/distance-selling-agreement", label: "Distance Sales Agreement" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/return-policy", label: "Return Policy" },
  { href: "/shipping-policy", label: "Shipping Policy" },
  { href: "/terms", label: "Terms & Conditions" },
];

const socials = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61580349339271#",
    icon: FaFacebookF,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/keramethali/",
    icon: FaInstagram,
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@keramet.hali",
    icon: FaTiktok,
  },
];

const phones = [
  { display: "+90 506 527 49 30", href: "tel:+905065274930" },
  { display: "+90 531 921 45 75", href: "tel:+905319214575" },
];

export default function Footer() {
  return (
    <footer className="bg-[#3d0f0c] text-custom-bg">
      <div className="mx-auto max-w-7xl px-6 pb-10 pt-16 lg:px-10 lg:pt-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <img
                src="/img/Kerametlogo.png"
                alt="Keramet Rugs logo"
                className="h-12 w-12 rounded-full bg-custom-bg object-contain p-1"
              />
              <span className="whitespace-nowrap font-display text-2xl font-semibold uppercase tracking-[0.1em]">
                Keramet Rugs
              </span>
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-7 text-custom-bg/70">
              Handwoven rugs for every home. Each one is one of a kind, and each
              carries the work of its weaver.
            </p>

            <div className="mt-6 flex gap-3">
              {socials.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.name}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-custom-bg/30 text-custom-bg transition hover:bg-custom-bg hover:text-custom-accent"
                  >
                    <Icon />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">
              Quick Links
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-custom-bg/75 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">
              Policies
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              {policyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-custom-bg/75 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + payments */}
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">
              Contact
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              {phones.map((phone) => (
                <li key={phone.href}>
                  <a
                    href={phone.href}
                    className="inline-flex items-center gap-3 text-custom-bg/75 transition hover:text-white"
                  >
                    <FaPhoneAlt className="text-xs text-gold" />
                    {phone.display}
                  </a>
                </li>
              ))}
            </ul>

            <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">
              Secure Payment
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {[
                { src: "/payment-logos/pay_with_iyzico.svg", alt: "Pay with iyzico" },
                { src: "/payment-logos/Visa_Inc._logo.svg", alt: "Visa" },
                { src: "/payment-logos/Mastercard-logo.svg", alt: "Mastercard" },
              ].map((logo) => (
                <span
                  key={logo.src}
                  className="flex h-9 items-center rounded-sm bg-custom-bg px-3"
                >
                  <img src={logo.src} alt={logo.alt} className="h-5 w-auto object-contain" />
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-custom-bg/15 pt-8 text-xs text-custom-bg/60 md:flex-row">
          <p>© {new Date().getFullYear()} Keramet Rugs. All rights reserved.</p>
          <p>Handwoven · One of a kind · Original design</p>
        </div>
      </div>
    </footer>
  );
}
