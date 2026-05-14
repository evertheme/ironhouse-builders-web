import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with IronHouse Builders. Call, email, or send a message to discuss your custom home, remodel, or renovation project in the Chicago area.",
  openGraph: {
    title: "Contact Us | IronHouse Builders",
    description:
      "Get in touch with IronHouse Builders to discuss your custom home, remodel, or renovation project in the Chicago area.",
    url: "https://ironhousebuilders.com/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
