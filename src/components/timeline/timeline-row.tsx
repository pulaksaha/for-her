"use client";

import type { Memory } from "@/types/memory";
import type { TimelineRow } from "@/lib/timeline/types";
import { TimelineMemoryCard } from "@/components/timeline/timeline-memory-card";
import { TimelineMilestone } from "@/components/timeline/timeline-milestone";
import {
  TimelineMonthHeader,
  TimelineYearHeader,
} from "@/components/timeline/timeline-year-month";

interface TimelineRowProps {
  row: TimelineRow;
  expandedMilestoneId: string | null;
  onToggleMilestone: (id: string) => void;
  onOpenMemory: (memory: Memory) => void;
  onPlayVoice?: (memory: Memory) => void;
}

export function TimelineRowRenderer({
  row,
  expandedMilestoneId,
  onToggleMilestone,
  onOpenMemory,
  onPlayVoice,
}: TimelineRowProps) {
  switch (row.type) {
    case "milestone":
      return (
        <TimelineMilestone
          row={row}
          expanded={expandedMilestoneId === row.chapter.id}
          onToggle={() => onToggleMilestone(row.chapter.id)}
        />
      );
    case "year":
      return <TimelineYearHeader row={row} />;
    case "month":
      return <TimelineMonthHeader row={row} />;
    case "memory":
      return (
        <TimelineMemoryCard
          memory={row.memory}
          featured={row.featured}
          onOpen={onOpenMemory}
          onPlayVoice={onPlayVoice}
        />
      );
    case "pace":
      return <div className="h-8 sm:h-12" aria-hidden />;
    default:
      return null;
  }
}
