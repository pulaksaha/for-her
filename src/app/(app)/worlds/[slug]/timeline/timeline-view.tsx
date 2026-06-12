"use client";

import { CinematicTimeline } from "@/components/timeline/cinematic-timeline";
import { SectionHeader } from "@/components/dashboard/section-header";
import type { Memory, TimelineChapter } from "@/types/memory";

interface TimelineViewProps {
  chapters: TimelineChapter[];
  memories: Memory[];
  worldSlug: string;
}

export function TimelineView({
  chapters,
  memories,
  worldSlug,
}: TimelineViewProps) {
  return (
    <div className="pb-16 pt-6 sm:pt-8 lg:pb-12">
      <div className="px-4 sm:px-6 lg:px-10">
        <SectionHeader
          eyebrow="Timeline"
          title="Walk through memory"
          description="Not a feed — a path. Scroll slowly. Chapters open like scenes; moments arrive when you're ready."
        />
      </div>

      <div className="mt-4 sm:mt-8">
        <CinematicTimeline
          memories={memories}
          chapters={chapters}
          worldSlug={worldSlug}
        />
      </div>

      <p className="mx-auto mt-20 max-w-md px-6 text-center text-[11px] leading-relaxed tracking-wide text-verse-cream-faint">
        The line on the left is time — not pressure, just presence.
      </p>
    </div>
  );
}
