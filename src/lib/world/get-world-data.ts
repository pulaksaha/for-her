import {
  demoChapters,
  demoFilms,
  demoMemories,
  demoRecap,
  demoSharing,
  demoVoiceNotes,
  demoWorld,
} from "@/lib/data/demo";
import type { MemoryWorld } from "@/types/memory";

export function getWorldBySlug(slug: string): MemoryWorld | null {
  if (slug !== demoWorld.slug) return null;
  return demoWorld;
}

export function getWorldDashboardData(slug: string) {
  const world = getWorldBySlug(slug);
  if (!world) return null;

  return {
    world,
    memories: demoMemories,
    chapters: demoChapters,
    films: demoFilms,
    recap: demoRecap,
    voiceNotes: demoVoiceNotes,
    sharing: demoSharing,
    highlights: demoMemories.filter((m) => m.isHighlight),
    vault: demoMemories,
  };
}

export type WorldDashboardData = NonNullable<
  ReturnType<typeof getWorldDashboardData>
>;
