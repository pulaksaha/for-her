"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

interface PhotoCardProps {
  src: string;
  alt: string;
  title?: string;
  meta?: string;
  aspect?: "square" | "portrait" | "landscape" | "tall";
  onClick?: () => void;
  className?: string;
  priority?: boolean;
}

const aspects = {
  square: "aspect-square",
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
  tall: "aspect-[2/3]",
};

export function PhotoCard({
  src,
  alt,
  title,
  meta,
  aspect = "portrait",
  onClick,
  className,
  priority,
}: PhotoCardProps) {
  const Comp = onClick ? "button" : "div";

  return (
    <motion.article
      className={cn("group relative w-full", className)}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <Comp
        type={onClick ? "button" : undefined}
        onClick={onClick}
        className={cn(
          "relative block w-full overflow-hidden rounded-sm bg-verse-surface text-left",
          aspects[aspect],
          onClick && "cursor-pointer",
        )}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        <div className="absolute inset-0 bg-verse-void/0 transition-colors duration-700 group-hover:bg-verse-void/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-verse-void/90 via-verse-void/10 to-transparent opacity-70 transition-opacity duration-700 group-hover:opacity-100" />

        {(title || meta) && (
          <div className="absolute inset-x-0 bottom-0 translate-y-2 p-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 sm:p-5">
            {meta && (
              <p className="text-[10px] tracking-[0.25em] text-verse-gold uppercase">
                {meta}
              </p>
            )}
            {title && (
              <p className="mt-1 font-display text-lg text-verse-cream sm:text-xl">
                {title}
              </p>
            )}
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-verse-cream/5" />
      </Comp>
    </motion.article>
  );
}
