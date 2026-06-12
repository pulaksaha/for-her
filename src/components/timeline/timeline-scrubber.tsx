"use client";

import { cn } from "@/lib/utils/cn";
import type { TimelineScrubMarker } from "@/lib/timeline/types";

interface TimelineScrubberProps {
  markers: TimelineScrubMarker[];
  activeId: string | null;
  onSeek: (marker: TimelineScrubMarker) => void;
  className?: string;
}

export function TimelineScrubber({
  markers,
  activeId,
  onSeek,
  className,
}: TimelineScrubberProps) {
  if (markers.length === 0) return null;

  return (
    <nav
      className={cn(
        "fixed right-3 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-end gap-3 lg:flex xl:right-6",
        className,
      )}
      aria-label="Timeline navigation"
    >
      {markers.map((marker) => {
        const active = activeId === marker.id;
        return (
          <button
            key={marker.id}
            type="button"
            onClick={() => onSeek(marker)}
            className="group flex items-center gap-2"
            aria-label={`Jump to ${marker.label}`}
            aria-current={active ? "true" : undefined}
          >
            <span
              className={cn(
                "max-w-0 overflow-hidden text-[10px] tracking-[0.2em] text-verse-cream-faint uppercase opacity-0 transition-all duration-300 group-hover:max-w-[8rem] group-hover:opacity-100",
                active && "max-w-[8rem] text-verse-gold opacity-100",
              )}
            >
              {marker.label}
            </span>
            <span
              className={cn(
                "block rounded-full transition-all duration-500",
                marker.kind === "milestone"
                  ? active
                    ? "h-3 w-3 bg-verse-gold"
                    : "h-2.5 w-2.5 bg-verse-gold/40 group-hover:bg-verse-gold/70"
                  : active
                    ? "h-2 w-2 bg-verse-cream"
                    : "h-1.5 w-1.5 bg-verse-cream/25 group-hover:bg-verse-cream/50",
              )}
            />
          </button>
        );
      })}
    </nav>
  );
}
