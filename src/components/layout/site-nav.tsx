"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils/cn";

interface SiteNavProps {
  transparent?: boolean;
}

export function SiteNav({ transparent = false }: SiteNavProps) {
  const [mounted, setMounted] = useState(false);
  const { scrollY } = useScroll();
  const navOpacity = useTransform(scrollY, [0, 120, 200], [0, 0, 1]);
  const navBg = useTransform(
    scrollY,
    [0, 200],
    ["rgba(8,7,6,0)", "rgba(8,7,6,0.85)"],
  );

  useEffect(() => { setTimeout(() => setMounted(true), 0); }, []);

  return (
    <motion.header
      initial={{ opacity: transparent ? 0 : 1 }}
      animate={{ opacity: transparent ? undefined : 1 }}
      style={
        transparent && mounted
          ? { backgroundColor: navBg, opacity: navOpacity }
          : undefined
      }
      className={cn(
        "fixed top-0 z-[60] w-full transition-[backdrop-filter] duration-700",
        transparent ? "backdrop-blur-0" : "border-b border-verse-border/30 bg-verse-void/85 backdrop-blur-md",
      )}
    >
      <nav
        className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-6 sm:px-12 lg:px-20"
        aria-label="Main"
      >
        <Link
          href="/"
          className="font-display text-lg tracking-[0.35em] text-verse-cream/90 uppercase"
        >
          Verse
        </Link>

        <div className="hidden items-center gap-12 md:flex">
          <Link
            href="/#story"
            className="text-[10px] tracking-[0.3em] text-verse-cream-faint uppercase transition-colors hover:text-verse-cream"
          >
            Story
          </Link>
          <Link
            href="/#memories"
            className="text-[10px] tracking-[0.3em] text-verse-cream-faint uppercase transition-colors hover:text-verse-cream"
          >
            Memories
          </Link>
          <Link
            href="/#pricing"
            className="text-[10px] tracking-[0.3em] text-verse-cream-faint uppercase transition-colors hover:text-verse-cream"
          >
            Pricing
          </Link>
        </div>

        <Link
          href="/signup"
          className="text-[10px] tracking-[0.3em] text-verse-cream uppercase transition-colors hover:text-verse-gold"
        >
          Begin →
        </Link>
      </nav>
    </motion.header>
  );
}
