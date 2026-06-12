"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { cn } from "@/lib/utils/cn";

interface ParallaxHeroProps {
  imageUrl: string;
  children: React.ReactNode;
  className?: string;
  overlay?: boolean;
}

export function ParallaxHero({
  imageUrl,
  children,
  className,
  overlay = true,
}: ParallaxHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.3]);

  useEffect(() => {
    const el = imageRef.current;
    if (!el) return;

    gsap.to(el, {
      scale: 1.08,
      duration: 20,
      ease: "none",
      repeat: -1,
      yoyo: true,
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("relative min-h-[100svh] overflow-hidden", className)}
    >
      <motion.div
        ref={imageRef}
        style={{ y: imageY, opacity }}
        className="absolute inset-0 will-change-transform"
      >
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
        {overlay && (
          <div className="absolute inset-0 bg-gradient-to-b from-verse-void/40 via-verse-void/60 to-verse-void" />
        )}
      </motion.div>
      <div className="relative z-10 flex min-h-[100svh] flex-col justify-end pb-24 pt-32">
        {children}
      </div>
    </div>
  );
}
