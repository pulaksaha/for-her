"use client";

import { cn } from "@/lib/utils/cn";
import type { TimelineScrubMarker } from "@/lib/timeline/types";

interface TimelineMobileScrubberProps {
  markers: TimelineScrubMarker[];
  activeId: string | null;
  onSeek: (marker: TimelineScrubMarker) => void;
}

export function TimelineMobileScrubber({
  markers,
  activeId,
  onSeek,
}: TimelineMobileScrubberProps) {
  const condensed = markers.filter(
    (m) => m.kind === "milestone" || m.kind === "year",
  );

  return (
    <div
      className="sticky top-[4.5rem] z-20 -mx-4 border-b border-verse-border/30 bg-verse-void/90 px-4 py-3 backdrop-blur-xl lg:hidden"
      aria-label="Jump to chapter or year"
    >
      <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {condensed.map((marker) => (
          <button
            key={marker.id}
            type="button"
            onClick={() => onSeek(marker)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 text-[10px] tracking-[0.2em] uppercase transition-colors",
              activeId === marker.id
                ? "border-verse-gold/50 bg-verse-gold/10 text-verse-gold"
                : "border-verse-border/50 text-verse-cream-faint hover:text-verse-cream",
            )}
          >
            {marker.label}
          </button>
        ))}
      </div>
    </div>
  );
}
