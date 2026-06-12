import type { Memory, TimelineChapter } from "@/types/memory";

export type TimelineRowType =
  | "milestone"
  | "year"
  | "month"
  | "memory"
  | "pace";

export interface TimelineMilestoneRow {
  type: "milestone";
  id: string;
  chapter: TimelineChapter;
  coverMemory?: Memory;
  memoryCount: number;
}

export interface TimelineYearRow {
  type: "year";
  id: string;
  year: number;
}

export interface TimelineMonthRow {
  type: "month";
  id: string;
  year: number;
  month: number;
  label: string;
}

export interface TimelineMemoryRow {
  type: "memory";
  id: string;
  memory: Memory;
  featured: boolean;
}

export interface TimelinePaceRow {
  type: "pace";
  id: string;
}

export type TimelineRow =
  | TimelineMilestoneRow
  | TimelineYearRow
  | TimelineMonthRow
  | TimelineMemoryRow
  | TimelinePaceRow;

export interface TimelineScrubMarker {
  id: string;
  label: string;
  kind: "year" | "milestone";
  rowIndex: number;
}

export interface BuiltTimeline {
  rows: TimelineRow[];
  markers: TimelineScrubMarker[];
  memoryIndexById: Map<string, number>;
}
