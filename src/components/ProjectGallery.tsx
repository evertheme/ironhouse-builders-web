"use client";

import Image from "next/image";
import { useState } from "react";

interface ProjectGalleryProps {
  images: string[];
  title: string;
}

export default function ProjectGallery({ images, title }: ProjectGalleryProps) {
  const list = images.filter(Boolean);
  const [selectedImage, setSelectedImage] = useState(0);

  if (list.length === 0) {
    return (
      <p className="text-center text-slate-500 py-12">No gallery images yet.</p>
    );
  }

  const safeIndex = Math.min(selectedImage, list.length - 1);
  const mainSrc = list[safeIndex];

  return (
    <div className="space-y-4">
      <div className="relative aspect-[16/9] rounded-lg overflow-hidden">
        <Image
          src={mainSrc}
          alt={`${title} - Image ${safeIndex + 1}`}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
        {list.map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            onClick={() => setSelectedImage(index)}
            className={`relative aspect-square rounded-lg overflow-hidden ${
              safeIndex === index ? "ring-4 ring-blue-500" : ""
            }`}
          >
            <Image
              src={image}
              alt={`${title} thumbnail ${index + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
