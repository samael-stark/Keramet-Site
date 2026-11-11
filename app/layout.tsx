import type { Metadata } from "next";
import { Cormorant_Garamond, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Serif display font for homepage headings (used via the `font-display`
// utility). latin-ext covers accented names.
const displaySerif = Cormorant_Garamond({
  variable: "--font-display-serif",
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: "Keramet Rugs",
    template: "%s | Keramet Rugs",
  },
  description:
    "Keramet Rugs offers premium carpets and rugs with elegant designs, quality craftsmanship, and reliable delivery.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${displaySerif.variable} antialiased bg-white text-slate-900`}
      >
        {/* Added mobile bottom padding to prevent bottom nav overlap */}
        <div className="min-h-screen">
          <div className="pb-24 lg:pb-0">{children}</div>
        </div>
      </body>
    </html>
  );
}
