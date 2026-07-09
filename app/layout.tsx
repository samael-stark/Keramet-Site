import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-slate-900`}
      >
        {/* Added mobile bottom padding to prevent bottom nav overlap */}
        <div className="min-h-screen">
          <div className="pb-24 lg:pb-0">{children}</div>
        </div>
      </body>
    </html>
  );
}
