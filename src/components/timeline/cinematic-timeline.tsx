"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { Memory, TimelineChapter } from "@/types/memory";
import {
  buildCinematicTimeline,
  estimateRowHeight,
} from "@/lib/timeline/build-timeline";
import type { TimelineScrubMarker } from "@/lib/timeline/types";
import { TimelineRowRenderer } from "@/components/timeline/timeline-row";
import { TimelineFullscreenMoment } from "@/components/timeline/timeline-fullscreen-moment";
import { TimelineScrubber } from "@/components/timeline/timeline-scrubber";
import { TimelineMobileScrubber } from "@/components/timeline/timeline-mobile-scrubber";
import { useAudioPlayer } from "@/contexts/audio-player-context";
import { cn } from "@/lib/utils/cn";

interface CinematicTimelineProps {
  memories: Memory[];
  chapters: TimelineChapter[];
  worldSlug: string;
  className?: string;
}

export function CinematicTimeline({
  memories,
  chapters,
  worldSlug,
  className,
}: CinematicTimelineProps) {
  const { rows, markers } = useMemo(
    () => buildCinematicTimeline(memories, chapters),
    [memories, chapters],
  );

  const memoryList = useMemo(
    () => memories.sort(
      (a, b) =>
        new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime(),
    ),
    [memories],
  );

  const parentRef = useRef<HTMLDivElement>(null);
  const [expandedMilestoneId, setExpandedMilestoneId] = useState<string | null>(
    null,
  );
  const [fullscreenMemory, setFullscreenMemory] = useState<Memory | null>(
    null,
  );
  const [activeMarkerId, setActiveMarkerId] = useState<string | null>(null);
  const { play } = useAudioPlayer();

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () =>
      typeof document !== "undefined" ? document.documentElement : null,
    estimateSize: (index) => {
      const row = rows[index];
      if (row.type === "milestone" && expandedMilestoneId === row.chapter.id) {
        return 680;
      }
      return estimateRowHeight(row);
    },
    overscan: 4,
    measureElement:
      typeof window !== "undefined" &&
      navigator.userAgent.indexOf("Firefox") === -1
        ? (element) => element.getBoundingClientRect().height
        : undefined,
  });

  useEffect(() => {
    virtualizer.measure();
  }, [expandedMilestoneId, virtualizer]);

  const scrollToRow = useCallback(
    (index: number) => {
      virtualizer.scrollToIndex(index, {
        align: "start",
        behavior: "smooth",
      });
    },
    [virtualizer],
  );

  const handleSeek = useCallback(
    (marker: TimelineScrubMarker) => {
      setActiveMarkerId(marker.id);
      scrollToRow(marker.rowIndex);
    },
    [scrollToRow],
  );

  useEffect(() => {
    const onScroll = () => {
      const virtualItems = virtualizer.getVirtualItems();
      if (virtualItems.length === 0) return;

      const firstIndex = virtualItems[0].index;
      let current: TimelineScrubMarker | null = null;
      for (const marker of markers) {
        if (marker.rowIndex <= firstIndex) current = marker;
        else break;
      }
      if (current) setActiveMarkerId(current.id);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [virtualizer, markers]);

  const openMemory = useCallback((memory: Memory) => {
    setFullscreenMemory(memory);
  }, []);

  const handlePlayVoice = useCallback(
    (memory: Memory) => {
      if (!memory.voiceNoteUrl) return;
      play({
        id: `voice-${memory.id}`,
        title: memory.title,
        subtitle: "Voice note",
        url: memory.voiceNoteUrl,
      });
    },
    [play],
  );

  const fullscreenIndex = fullscreenMemory
    ? memoryList.findIndex((m) => m.id === fullscreenMemory.id)
    : -1;

  const toggleMilestone = useCallback((id: string) => {
    setExpandedMilestoneId((prev) => (prev === id ? null : id));
  }, []);

  return (
    <div className={cn("relative", className)} ref={parentRef}>
      <TimelineMobileScrubber
        markers={markers}
        activeId={activeMarkerId}
        onSeek={handleSeek}
      />

      {/* Vertical spine */}
      <div
        className="pointer-events-none absolute top-0 bottom-0 left-3 w-px bg-gradient-to-b from-verse-gold/40 via-verse-border/30 to-transparent sm:left-5"
        aria-hidden
      />

      <div
        className="relative mx-auto max-w-3xl lg:max-w-4xl"
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const row = rows[virtualRow.index];
          return (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={virtualizer.measureElement}
              className="absolute left-0 w-full px-1 sm:px-2"
              style={{
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <TimelineRowRenderer
                row={row}
                expandedMilestoneId={expandedMilestoneId}
                onToggleMilestone={toggleMilestone}
                onOpenMemory={openMemory}
                onPlayVoice={handlePlayVoice}
              />
            </div>
          );
        })}
      </div>

      <TimelineScrubber
        markers={markers}
        activeId={activeMarkerId}
        onSeek={handleSeek}
      />

      <TimelineFullscreenMoment
        memory={fullscreenMemory}
        worldSlug={worldSlug}
        onClose={() => setFullscreenMemory(null)}
        hasPrev={fullscreenIndex > 0}
        hasNext={fullscreenIndex < memoryList.length - 1 && fullscreenIndex >= 0}
        onPrev={() => {
          if (fullscreenIndex > 0) {
            setFullscreenMemory(memoryList[fullscreenIndex - 1]);
          }
        }}
        onNext={() => {
          if (fullscreenIndex < memoryList.length - 1) {
            setFullscreenMemory(memoryList[fullscreenIndex + 1]);
          }
        }}
      />
    </div>
  );
}
