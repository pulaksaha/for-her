import type { Memory } from "@/types/memory";
import { getOpenAI } from "@/lib/ai/providers";
import { env } from "@/lib/env";
import type { MemorySalience } from "./types";

const MOOD_WEIGHT: Record<string, number> = {
  celebration: 0.15,
  tender: 0.12,
  joyful: 0.1,
  nostalgic: 0.08,
  quiet: 0.05,
};

function heuristicSalience(memory: Memory): MemorySalience {
  let score = 0.4;

  if (memory.isHighlight) score += 0.25;
  if (memory.story?.content) score += 0.12;
  if (memory.caption) score += 0.08;
  if (memory.voiceNoteUrl) score += 0.1;
  if (memory.musicTrack) score += 0.05;
  if (memory.location) score += 0.04;
  score += MOOD_WEIGHT[memory.mood] ?? 0;

  const mediaRichness = memory.media.length;
  score += Math.min(mediaRichness * 0.04, 0.12);

  const emotionalTags: string[] = [memory.mood];
  if (memory.isHighlight) emotionalTags.push("milestone");
  if (memory.voiceNoteUrl) emotionalTags.push("voice");
  if (memory.story) emotionalTags.push("narrated");

  return {
    memoryId: memory.id,
    score: Math.min(score, 1),
    emotionalTags,
    mood: memory.mood,
    memory,
  };
}

async function visionSalienceBoost(
  memory: Memory,
  base: MemorySalience,
): Promise<MemorySalience> {
  const cover = memory.media.find((m) => m.type === "photo" || m.type === "video");
  if (!cover?.url || !env.OPENAI_API_KEY) return base;

  const openai = getOpenAI();
  if (!openai) return base;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 200,
      messages: [
        {
          role: "system",
          content: `You analyze personal memory photographs for emotional salience in an anniversary film.
Return JSON only: { "scoreBoost": 0-0.3, "visualNotes": "one sentence", "tags": ["tag1","tag2"] }`,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Memory: "${memory.title}". Caption: "${memory.caption ?? ""}". Mood: ${memory.mood}. Rate visual emotional power for a cinematic recap.`,
            },
            { type: "image_url", image_url: { url: cover.url, detail: "low" } },
          ],
        },
      ],
      response_format: { type: "json_object" },
    });

    const raw = response.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(raw) as {
      scoreBoost?: number;
      visualNotes?: string;
      tags?: string[];
    };

    return {
      ...base,
      score: Math.min(base.score + (parsed.scoreBoost ?? 0), 1),
      visualNotes: parsed.visualNotes,
      emotionalTags: [...new Set([...base.emotionalTags, ...(parsed.tags ?? [])])],
    };
  } catch {
    return base;
  }
}

export async function analyzeMemories(
  memories: Memory[],
  options?: { useVision?: boolean },
): Promise<MemorySalience[]> {
  const useVision = options?.useVision ?? Boolean(env.OPENAI_API_KEY);

  const results = await Promise.all(
    memories.map(async (memory) => {
      const base = heuristicSalience(memory);
      if (!useVision) return base;
      return visionSalienceBoost(memory, base);
    }),
  );

  return results.sort((a, b) => b.score - a.score);
}
