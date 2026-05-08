"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const AUTO_ADVANCE_MS = 5500;

interface ProjectGalleryProps {
  images: string[];
  title: string;
}

export default function ProjectGallery({ images, title }: ProjectGalleryProps) {
  const list = images.filter(Boolean);
  const [selectedImage, setSelectedImage] = useState(0);

  const safeIndex =
    list.length === 0 ? 0 : Math.min(selectedImage, list.length - 1);
  const multiple = list.length > 1;

  useEffect(() => {
    if (!multiple) return;
    const id = window.setInterval(() => {
      setSelectedImage((i) => (i + 1) % list.length);
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(id);
  }, [list.length, multiple, safeIndex]);

  if (list.length === 0) {
    return (
      <p className="text-center text-slate-500 py-12">No gallery images yet.</p>
    );
  }

  const mainSrc = list[safeIndex];

  const goPrev = () =>
    setSelectedImage((i) => (i - 1 + list.length) % list.length);
  const goNext = () =>
    setSelectedImage((i) => (i + 1) % list.length);

  return (
    <div className="space-y-4">
      <div
        className="relative aspect-[16/9] rounded-lg overflow-hidden bg-slate-900 group"
        role="region"
        aria-roledescription="carousel"
        aria-label={`${title} photo gallery`}
      >
        <Image
          src={mainSrc}
          alt={`${title} - Image ${safeIndex + 1} of ${list.length}`}
          fill
          className="object-cover"
          priority={safeIndex === 0}
          sizes="(max-width: 768px) 100vw, min(1200px, 100vw)"
        />

        {multiple && (
          <>
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center gap-1.5 pb-3"
              aria-hidden
            >
              {list.map((_, index) => (
                <span
                  key={index}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === safeIndex
                      ? "w-6 bg-white"
                      : "w-1.5 bg-white/40"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={goPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/45 p-2 text-white opacity-90 backdrop-blur-sm transition-opacity hover:bg-black/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:left-3 md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
              aria-label="Previous image"
            >
              <svg
                className="h-6 w-6 md:h-7 md:w-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/45 p-2 text-white opacity-90 backdrop-blur-sm transition-opacity hover:bg-black/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:right-3 md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
              aria-label="Next image"
            >
              <svg
                className="h-6 w-6 md:h-7 md:w-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}
      </div>

      <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 md:gap-2.5">
        {list.map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            onClick={() => setSelectedImage(index)}
            className={`relative aspect-square rounded-md overflow-hidden ${
              safeIndex === index ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-white" : ""
            }`}
            aria-label={`Show image ${index + 1}`}
            aria-current={safeIndex === index ? "true" : undefined}
          >
            <Image
              src={image}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 640px) 18vw, (max-width: 1024px) 12vw, 10vw"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
