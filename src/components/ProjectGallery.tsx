"use client";

import Image from "next/image";
import { useState } from "react";

interface ProjectGalleryProps {
  images: string[];
  title: string;
}

export default function ProjectGallery({ images, title }: ProjectGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="space-y-4">
      <div className="relative aspect-[16/9] rounded-lg overflow-hidden">
        <Image
          src={images[selectedImage]}
          alt={`${title} - Image ${selectedImage + 1}`}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`relative aspect-square rounded-lg overflow-hidden ${
              selectedImage === index ? "ring-4 ring-blue-500" : ""
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
