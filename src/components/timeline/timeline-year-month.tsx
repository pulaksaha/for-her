"use client";

import { TimelineReveal } from "@/components/timeline/timeline-reveal";
import type { TimelineMonthRow, TimelineYearRow } from "@/lib/timeline/types";

export function TimelineYearHeader({ row }: { row: TimelineYearRow }) {
  return (
    <TimelineReveal>
      <div className="relative py-10 pl-8 sm:pl-12 sm:py-14">
        <div
          className="absolute top-1/2 left-0 h-px w-6 -translate-y-1/2 bg-verse-gold/50 sm:w-10"
          aria-hidden
        />
        <p className="font-display text-6xl font-light tabular-nums text-verse-cream/90 sm:text-7xl lg:text-8xl">
          {row.year}
        </p>
      </div>
    </TimelineReveal>
  );
}

export function TimelineMonthHeader({ row }: { row: TimelineMonthRow }) {
  return (
    <TimelineReveal delay={0.05}>
      <div className="relative py-4 pl-8 sm:pl-12">
        <p className="text-[11px] tracking-[0.4em] text-verse-cream-faint uppercase">
          {row.label}
        </p>
      </div>
    </TimelineReveal>
  );
}
