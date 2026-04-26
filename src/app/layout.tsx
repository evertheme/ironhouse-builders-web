import type { Metadata } from "next";
import { Cardo, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const cardo = Cardo({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-cardo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Iron House Builders - Quality Home Builders",
  description:
    "Building exceptional homes with quality craftsmanship and attention to detail.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cardo.variable}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
