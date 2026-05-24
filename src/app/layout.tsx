import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";

export const metadata: Metadata = {
  title: "BharatCraft Wholesale | Artisan India B2B Marketplace",
  description:
    "Sourcing directly from master artisans. Verified quality, ethical standards, and seamless international logistics for high-volume enterprise partners.",
  keywords:
    "Indian handicrafts wholesale, B2B marketplace, artisan products, export-ready, handmade India",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
