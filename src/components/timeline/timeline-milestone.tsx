"use client";

import { format, parseISO } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "@/hooks/use-in-view";
import { TimelineLazyImage } from "@/components/timeline/timeline-lazy-image";
import type { TimelineMilestoneRow } from "@/lib/timeline/types";
import { cn } from "@/lib/utils/cn";

interface TimelineMilestoneProps {
  row: TimelineMilestoneRow;
  expanded: boolean;
  onToggle: () => void;
}

export function TimelineMilestone({
  row,
  expanded,
  onToggle,
}: TimelineMilestoneProps) {
  const { chapter, coverMemory, memoryCount } = row;
  const { ref, inView } = useInView<HTMLElement>({
    rootMargin: "-10% 0px",
    threshold: 0.2,
    triggerOnce: false,
  });

  const yearLabel = format(parseISO(chapter.startDate), "yyyy");
  const endYear = chapter.endDate
    ? format(parseISO(chapter.endDate), "yyyy")
    : null;

  return (
    <section
      ref={ref}
      className="relative py-12 sm:py-20"
      aria-label={chapter.title}
    >
      <motion.div
        animate={{
          opacity: inView ? 1 : 0.4,
          scale: inView ? 1 : 0.98,
        }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        <button
          type="button"
          onClick={onToggle}
          className={cn(
            "group w-full overflow-hidden rounded-sm border text-left transition-all duration-700",
            expanded
              ? "border-verse-gold/30 bg-verse-elevated/30 shadow-verse-glow"
              : "border-verse-border/40 bg-verse-surface/10 hover:border-verse-border",
          )}
        >
          <div
            className={cn(
              "relative w-full overflow-hidden transition-[height] duration-700 ease-out",
              expanded ? "h-[50vh] min-h-[320px] sm:h-[55vh]" : "h-48 sm:h-56",
            )}
          >
            {coverMemory?.media[0] && (
              <TimelineLazyImage
                src={coverMemory.media[0].url}
                alt=""
                blurSrc={coverMemory.media[0].thumbnailUrl}
                priority={expanded}
                sizes="100vw"
                className="transition-transform duration-[1.8s] group-hover:scale-[1.03]"
              />
            )}
            <div
              className={cn(
                "absolute inset-0 transition-opacity duration-700",
                expanded
                  ? "bg-gradient-to-t from-verse-void via-verse-void/50 to-verse-void/30"
                  : "bg-gradient-to-t from-verse-void via-verse-void/60 to-verse-void/40",
              )}
            />
          </div>

          <div className="relative px-6 py-8 sm:px-12 sm:py-12">
            <p className="text-[10px] tracking-[0.45em] text-verse-gold uppercase">
              {yearLabel}
              {endYear && endYear !== yearLabel && ` — ${endYear}`}
            </p>
            <h2
              className={cn(
                "mt-4 font-display font-light text-verse-cream transition-all duration-700",
                expanded
                  ? "text-5xl sm:text-6xl lg:text-7xl"
                  : "text-4xl sm:text-5xl",
              )}
            >
              {chapter.title}
            </h2>
            {chapter.subtitle && (
              <p
                className={cn(
                  "mt-3 text-verse-cream-muted transition-all duration-500",
                  expanded ? "text-lg sm:text-xl" : "text-base",
                )}
              >
                {chapter.subtitle}
              </p>
            )}

            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="mt-8 max-w-xl text-sm leading-relaxed text-verse-cream-faint">
                    {memoryCount === 0
                      ? "A chapter waiting to be written."
                      : `${memoryCount} moment${memoryCount === 1 ? "" : "s"} live in this chapter — scroll slowly.`}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <p className="mt-6 text-[10px] tracking-[0.3em] text-verse-cream-faint uppercase">
              {expanded ? "Close chapter" : "Open chapter"}
            </p>
          </div>
        </button>
      </motion.div>
    </section>
  );
}
