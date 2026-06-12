import { format, parseISO } from "date-fns";
import type { Memory, TimelineChapter } from "@/types/memory";
import type {
  BuiltTimeline,
  TimelineRow,
  TimelineScrubMarker,
} from "./types";

function memoryInChapter(memory: Memory, chapter: TimelineChapter): boolean {
  const t = new Date(memory.occurredAt).getTime();
  const start = parseISO(chapter.startDate).getTime();
  const end = chapter.endDate
    ? parseISO(chapter.endDate).getTime()
    : Number.POSITIVE_INFINITY;
  return t >= start && t <= end;
}

export function estimateRowHeight(row: TimelineRow): number {
  switch (row.type) {
    case "milestone":
      return 520;
    case "year":
      return 140;
    case "month":
      return 72;
    case "memory":
      return row.featured ? 520 : 360;
    case "pace":
      return 48;
    default:
      return 200;
  }
}

export function buildCinematicTimeline(
  memories: Memory[],
  chapters: TimelineChapter[],
): BuiltTimeline {
  const sorted = [...memories].sort(
    (a, b) =>
      new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime(),
  );

  const sortedChapters = [...chapters].sort(
    (a, b) =>
      parseISO(a.startDate).getTime() - parseISO(b.startDate).getTime(),
  );

  const rows: TimelineRow[] = [];
  const markers: TimelineScrubMarker[] = [];
  const memoryIndexById = new Map<string, number>();

  const insertedMilestones = new Set<string>();
  let lastYear: number | null = null;
  let lastMonthKey: string | null = null;

  for (const memory of sorted) {
    const date = new Date(memory.occurredAt);
    const year = date.getFullYear();
    const month = date.getMonth();
    const monthKey = `${year}-${month}`;

    for (const chapter of sortedChapters) {
      if (
        !insertedMilestones.has(chapter.id) &&
        memoryInChapter(memory, chapter)
      ) {
        const chapterMemories = sorted.filter((m) =>
          memoryInChapter(m, chapter),
        );
        const cover = chapter.coverMemoryId
          ? sorted.find((m) => m.id === chapter.coverMemoryId)
          : chapterMemories[0];

        rows.push({
          type: "milestone",
          id: `milestone-${chapter.id}`,
          chapter,
          coverMemory: cover,
          memoryCount: chapterMemories.length,
        });

        markers.push({
          id: `milestone-${chapter.id}`,
          label: chapter.title.replace("Chapter ", ""),
          kind: "milestone",
          rowIndex: rows.length - 1,
        });

        insertedMilestones.add(chapter.id);
        rows.push({ type: "pace", id: `pace-after-${chapter.id}` });
      }
    }

    if (lastYear !== year) {
      rows.push({ type: "year", id: `year-${year}`, year });
      markers.push({
        id: `year-${year}`,
        label: String(year),
        kind: "year",
        rowIndex: rows.length - 1,
      });
      lastYear = year;
      lastMonthKey = null;
    }

    if (lastMonthKey !== monthKey) {
      rows.push({
        type: "month",
        id: `month-${monthKey}`,
        year,
        month,
        label: format(date, "MMMM"),
      });
      lastMonthKey = monthKey;
    }

    const featured = memory.isHighlight;
    rows.push({
      type: "memory",
      id: `memory-${memory.id}`,
      memory,
      featured,
    });
    memoryIndexById.set(memory.id, rows.length - 1);
  }

  for (const chapter of sortedChapters) {
    if (!insertedMilestones.has(chapter.id)) {
      const chapterMemories = sorted.filter((m) =>
        memoryInChapter(m, chapter),
      );
      const cover = chapter.coverMemoryId
        ? sorted.find((m) => m.id === chapter.coverMemoryId)
        : undefined;

      rows.push({
        type: "milestone",
        id: `milestone-${chapter.id}`,
        chapter,
        coverMemory: cover,
        memoryCount: chapterMemories.length,
      });
      markers.push({
        id: `milestone-${chapter.id}`,
        label: chapter.title,
        kind: "milestone",
        rowIndex: rows.length - 1,
      });
    }
  }

  return { rows, markers, memoryIndexById };
}
