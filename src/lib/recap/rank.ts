import type { MemorySalience } from "./types";

export function rankStrongestMoments(
  analyzed: MemorySalience[],
  maxScenes = 8,
): MemorySalience[] {
  const MIN_SCORE = 0.45;
  const candidates = analyzed.filter((a) => a.score >= MIN_SCORE);

  const selected: MemorySalience[] = [];
  const usedIds = new Set<string>();

  for (const item of candidates) {
    if (selected.length >= maxScenes) break;
    if (usedIds.has(item.memoryId)) continue;
    selected.push(item);
    usedIds.add(item.memoryId);
  }

  if (selected.length < Math.min(3, maxScenes)) {
    for (const item of analyzed) {
      if (selected.length >= Math.min(3, maxScenes)) break;
      if (!usedIds.has(item.memoryId)) {
        selected.push(item);
        usedIds.add(item.memoryId);
      }
    }
  }

  return selected
    .sort(
      (a, b) =>
        new Date(a.memory.occurredAt).getTime() -
        new Date(b.memory.occurredAt).getTime(),
    );
}
