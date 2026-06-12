"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { format } from "date-fns";
import type { Memory } from "@/types/memory";
import { cn } from "@/lib/utils/cn";

interface MemoryCardProps {
  memory: Memory;
  worldSlug: string;
  variant?: "default" | "featured" | "compact";
  index?: number;
}

const moodLabels: Record<Memory["mood"], string> = {
  tender: "Tender",
  joyful: "Joyful",
  nostalgic: "Nostalgic",
  quiet: "Quiet",
  celebration: "Celebration",
};

export function MemoryCard({
  memory,
  worldSlug,
  variant = "default",
  index = 0,
}: MemoryCardProps) {
  const cover = memory.media[0];
  const href = `/worlds/${worldSlug}/memories/${memory.id}`;

  if (variant === "compact") {
    return (
      <Link href={href} className="group block">
        <article className="flex gap-4 rounded-2xl p-3 transition-colors hover:bg-verse-surface/60">
          {cover && (
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
              <Image
                src={cover.url}
                alt=""
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="64px"
              />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-lg text-verse-cream">
              {memory.title}
            </p>
            <p className="text-xs text-verse-cream-faint">
              {format(new Date(memory.occurredAt), "MMMM d, yyyy")}
            </p>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.8,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn(
        variant === "featured" && "md:col-span-2 md:row-span-2",
      )}
    >
      <Link href={href} className="group block">
        <div
          className={cn(
            "relative overflow-hidden rounded-3xl bg-verse-surface shadow-verse-soft",
            variant === "featured" ? "aspect-[4/5]" : "aspect-[3/4]",
          )}
        >
          {cover && (
            <Image
              src={cover.url}
              alt={memory.title}
              fill
              className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.03]"
              sizes={
                variant === "featured"
                  ? "(max-width: 768px) 100vw, 50vw"
                  : "(max-width: 768px) 100vw, 33vw"
              }
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-verse-void via-verse-void/20 to-transparent opacity-90" />
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
            <p className="text-[10px] tracking-[0.25em] text-verse-gold uppercase">
              {moodLabels[memory.mood]}
            </p>
            <h3
              className={cn(
                "mt-2 font-display font-light text-verse-cream",
                variant === "featured" ? "text-3xl sm:text-4xl" : "text-2xl",
              )}
            >
              {memory.title}
            </h3>
            <p className="mt-2 text-sm text-verse-cream-muted">
              {format(new Date(memory.occurredAt), "MMMM d, yyyy")}
              {memory.location && ` · ${memory.location}`}
            </p>
            {memory.caption && variant === "featured" && (
              <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-verse-cream-muted/90">
                {memory.caption}
              </p>
            )}
          </div>
          {memory.isHighlight && (
            <div className="absolute top-4 right-4 rounded-full bg-verse-gold/20 px-3 py-1 text-[10px] tracking-widest text-verse-gold uppercase backdrop-blur-sm">
              Highlight
            </div>
          )}
        </div>
      </Link>
    </motion.article>
  );
}
