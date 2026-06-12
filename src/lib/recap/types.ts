import type { Memory, MemoryMood } from "@/types/memory";

export type RecapAspectRatio = "16:9" | "9:16";
export type RecapJobStatus =
  | "queued"
  | "analyzing"
  | "ranking"
  | "storytelling"
  | "captions"
  | "narration"
  | "composing"
  | "rendering"
  | "assembling"
  | "ready"
  | "failed";

export type RecapTransition = "fade" | "dissolve" | "slow-zoom";

export interface MemorySalience {
  memoryId: string;
  score: number;
  emotionalTags: string[];
  visualNotes?: string;
  mood: MemoryMood;
  memory: Memory;
}

export interface RecapNarrativeArc {
  title: string;
  subtitle?: string;
  openingNarration: string;
  phases: Array<{
    name: string;
    narration: string;
  }>;
  closingNarration: string;
}

export interface RecapScene {
  id: string;
  memoryId: string;
  imageUrl: string;
  title: string;
  dateLabel: string;
  poeticCaption: string;
  narrationLine: string;
  salienceScore: number;
  mood: MemoryMood;
  durationFrames: number;
  transition: RecapTransition;
  startFrame: number;
}

export interface RecapSoundtrack {
  url: string;
  title: string;
  volume: number;
}

export interface RecapPlan {
  id: string;
  worldId: string;
  worldName: string;
  aspectRatio: RecapAspectRatio;
  fps: number;
  width: number;
  height: number;
  totalDurationFrames: number;
  title: string;
  narrative: RecapNarrativeArc;
  scenes: RecapScene[];
  fullNarrationScript: string;
  soundtrack?: RecapSoundtrack;
  narrationAudioUrl?: string;
}

export interface RecapJob {
  id: string;
  worldId: string;
  worldSlug: string;
  worldName: string;
  status: RecapJobStatus;
  progress: number;
  message: string;
  aspectRatio: RecapAspectRatio;
  plan?: RecapPlan;
  outputUrls?: {
    widescreen?: string;
    vertical?: string;
  };
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RecapGenerateInput {
  worldId: string;
  worldSlug: string;
  worldName: string;
  memories: Memory[];
  aspectRatio?: RecapAspectRatio;
  maxScenes?: number;
  periodLabel?: string;
}
