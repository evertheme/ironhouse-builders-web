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
  metadataBase: new URL("https://ironhousebuilders.com"),
  title: {
    default: "IronHouse Builders | Chicago Custom Home Builder",
    template: "%s | IronHouse Builders",
  },
  description:
    "Chicago-area custom home builder specializing in new construction, complete remodeling, additions, garages, roofing, and premium siding. Quality craftsmanship since day one.",
  openGraph: {
    type: "website",
    siteName: "IronHouse Builders",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "IronHouse Builders",
  url: "https://ironhousebuilders.com",
  email: "ironhousebuilders@gmail.com",
  telephone: "+17735476502",
  areaServed: {
    "@type": "City",
    name: "Chicago",
    sameAs: "https://www.wikidata.org/wiki/Q1297",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Chicago",
    addressRegion: "IL",
    addressCountry: "US",
  },
  description:
    "Chicago-area custom home builder specializing in new construction, complete remodeling, additions, garages, roofing, and premium siding.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cardo.variable}>
      <body className={inter.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
