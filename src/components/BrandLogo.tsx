"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const LOGO = {
  src: "/images/brand/logo-dark.png",
  width: 1258,
  height: 240,
} as const;

const ALT = "Iron House Builders";

type BrandLogoProps = {
  variant: "header" | "footer";
  className?: string;
  withLink?: boolean;
  /** Use only for the first above-the-fold logo (LCP) */
  priority?: boolean;
};

export default function BrandLogo({
  variant,
  className,
  withLink = true,
  priority = false,
}: BrandLogoProps) {
  const image = (
    <Image
      src={LOGO.src}
      alt={ALT}
      width={LOGO.width}
      height={LOGO.height}
      priority={priority}
      className={cn(
        "w-auto max-w-full object-contain object-left",
        variant === "header" && "h-9 sm:h-10",
        variant === "footer" && "h-10 sm:h-11 md:h-12",
        className,
      )}
      sizes={
        variant === "header"
          ? "(max-width: 640px) 220px, 250px"
          : "(max-width: 1024px) 280px, 320px"
      }
    />
  );

  if (withLink) {
    return (
      <Link href="/" className="inline-block min-w-0 shrink-0">
        {image}
      </Link>
    );
  }

  return image;
}
