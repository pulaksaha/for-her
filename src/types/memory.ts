export type MediaType = "photo" | "video" | "voice" | "music";

export type MemoryMood =
  | "tender"
  | "joyful"
  | "nostalgic"
  | "quiet"
  | "celebration";

export interface MemoryMedia {
  id: string;
  type: MediaType;
  url: string;
  thumbnailUrl?: string;
  durationSeconds?: number;
  caption?: string;
  cloudflareId?: string;
}

export interface MemoryStory {
  id: string;
  content: string;
  tone: MemoryMood;
  generatedAt: string;
  provider?: "openai" | "anthropic";
}

export interface Memory {
  id: string;
  worldId: string;
  title: string;
  occurredAt: string;
  location?: string;
  mood: MemoryMood;
  caption?: string;
  media: MemoryMedia[];
  story?: MemoryStory;
  voiceNoteUrl?: string;
  musicTrack?: string;
  isHighlight: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MemoryWorld {
  id: string;
  slug: string;
  name: string;
  tagline?: string;
  coverImageUrl?: string;
  memberCount: number;
  memoryCount: number;
  createdAt: string;
  type: "couple" | "family" | "individual";
}

export interface TimelineChapter {
  id: string;
  worldId: string;
  title: string;
  subtitle?: string;
  startDate: string;
  endDate?: string;
  memoryIds: string[];
  coverMemoryId?: string;
}

export interface AnniversaryFilm {
  id: string;
  worldId: string;
  title: string;
  status: "draft" | "rendering" | "ready" | "failed";
  previewUrl?: string;
  durationSeconds?: number;
  createdAt: string;
}

export interface MemoryRecap {
  id: string;
  worldId: string;
  period: "week" | "month" | "year" | "season";
  title: string;
  story: string;
  memoryIds: string[];
  generatedAt: string;
}
