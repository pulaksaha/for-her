"use client";

import { format } from "date-fns";
import { MapPin, Mic, Music, Play, Sparkles } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import type { Memory } from "@/types/memory";
import { TimelineLazyImage } from "@/components/timeline/timeline-lazy-image";
import { TimelineReveal } from "@/components/timeline/timeline-reveal";
import { cn } from "@/lib/utils/cn";

interface TimelineMemoryCardProps {
  memory: Memory;
  featured: boolean;
  onOpen: (memory: Memory) => void;
  onPlayVoice?: (memory: Memory) => void;
}

export function TimelineMemoryCard({
  memory,
  featured,
  onOpen,
  onPlayVoice,
}: TimelineMemoryCardProps) {
  const cover = memory.media.find((m) => m.type === "photo" || m.type === "video");
  const cardRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.06, 1, 1.04]);

  const hasVideo = memory.media.some((m) => m.type === "video");

  return (
    <TimelineReveal>
      <article
        ref={cardRef}
        className={cn(
          "group relative pl-8 sm:pl-12",
          featured && "py-4 sm:py-8",
        )}
      >
        {/* Spine node */}
        <div
          className="absolute top-8 left-0 z-10 h-2 w-2 -translate-x-[3px] rounded-full bg-verse-gold/80 ring-4 ring-verse-void sm:top-10"
          aria-hidden
        />

        <button
          type="button"
          onClick={() => onOpen(memory)}
          className={cn(
            "w-full overflow-hidden rounded-sm border border-verse-border/40 bg-verse-surface/20 text-left transition-colors duration-500",
            "hover:border-verse-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-verse-gold-soft",
            featured ? "shadow-verse-soft" : "",
          )}
        >
          {cover && (
            <div
              className={cn(
                "relative w-full overflow-hidden",
                featured ? "aspect-[16/10] sm:aspect-[2/1]" : "aspect-[4/3]",
              )}
            >
              <motion.div
                style={{ y: imageY, scale: imageScale }}
                className="absolute inset-0 will-change-transform"
              >
                <TimelineLazyImage
                  src={cover.url}
                  alt={memory.title}
                  blurSrc={cover.thumbnailUrl}
                  sizes={
                    featured
                      ? "(max-width: 768px) 100vw, 896px"
                      : "(max-width: 768px) 100vw, 640px"
                  }
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-verse-void via-verse-void/25 to-transparent opacity-90" />

              {hasVideo && (
                <span className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-verse-void/50 text-verse-cream backdrop-blur-sm">
                  <Play className="h-4 w-4 fill-current" strokeWidth={0} />
                </span>
              )}

              {featured && (
                <span className="absolute top-4 left-4 text-[10px] tracking-[0.3em] text-verse-gold uppercase">
                  Featured
                </span>
              )}
            </div>
          )}

          <div className={cn("p-5 sm:p-8", featured && "sm:p-10")}>
            <div className="flex flex-wrap items-center gap-3 text-[10px] tracking-[0.25em] text-verse-cream-faint uppercase">
              <time dateTime={memory.occurredAt}>
                {format(new Date(memory.occurredAt), "EEEE · MMMM d")}
              </time>
              <span className="text-verse-gold/80">{memory.mood}</span>
            </div>

            <h3
              className={cn(
                "mt-3 font-display font-light text-verse-cream transition-transform duration-700 group-hover:translate-x-0.5",
                featured ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl",
              )}
            >
              {memory.title}
            </h3>

            {memory.location && (
              <p className="mt-2 flex items-center gap-1.5 text-sm text-verse-cream-faint">
                <MapPin className="h-3.5 w-3.5" strokeWidth={1.25} />
                {memory.location}
              </p>
            )}

            {memory.caption && (
              <p
                className={cn(
                  "mt-4 leading-relaxed text-verse-cream-muted",
                  featured ? "text-base sm:text-lg" : "text-sm",
                )}
              >
                {memory.caption}
              </p>
            )}

            {memory.story && (
              <p className="mt-4 line-clamp-3 font-display text-sm leading-relaxed text-verse-cream-faint italic sm:text-base">
                {memory.story.content}
              </p>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-4">
              {memory.voiceNoteUrl && onPlayVoice && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlayVoice(memory);
                  }}
                  className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] text-verse-cream-muted uppercase transition-colors hover:text-verse-gold"
                >
                  <Mic className="h-3.5 w-3.5" strokeWidth={1.25} />
                  Voice
                </button>
              )}
              {memory.musicTrack && (
                <span className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] text-verse-cream-faint uppercase">
                  <Music className="h-3.5 w-3.5" strokeWidth={1.25} />
                  <span className="max-w-[12rem] truncate">{memory.musicTrack}</span>
                </span>
              )}
              {memory.story && (
                <span className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] text-verse-cream-faint uppercase">
                  <Sparkles className="h-3.5 w-3.5" strokeWidth={1.25} />
                  AI story
                </span>
              )}
            </div>
          </div>
        </button>
      </article>
    </TimelineReveal>
  );
}
