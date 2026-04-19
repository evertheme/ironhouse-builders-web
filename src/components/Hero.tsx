"use client";

import { motion } from "framer-motion";

interface HeroProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  height?: "small" | "medium" | "large";
}

export default function Hero({
  title,
  subtitle,
  backgroundImage = "/images/hero-bg.jpg",
  height = "large",
}: HeroProps) {
  const heightClasses = {
    small: "h-[40vh]",
    medium: "h-[60vh]",
    large: "h-[80vh]",
  };

  return (
    <div
      className={`relative ${heightClasses[height]} flex items-center justify-center overflow-hidden`}
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="relative z-10 text-center text-white px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-200"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </div>
  );
}
