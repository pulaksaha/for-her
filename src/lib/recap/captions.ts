import { getAnthropic, getOpenAI, getPreferredProvider } from "@/lib/ai/providers";
import type { MemorySalience, RecapNarrativeArc } from "./types";

export async function generatePoeticCaptions(
  ranked: MemorySalience[],
  narrative: RecapNarrativeArc,
): Promise<Map<string, string>> {
  const provider = getPreferredProvider();
  const payload = ranked.map((r) => ({
    id: r.memoryId,
    title: r.memory.title,
    caption: r.memory.caption,
    mood: r.mood,
  }));

  const prompt = `Film: "${narrative.title}"
For each memory, write ONE poetic on-screen caption (8-16 words). Literary, present or past tense. No quotes in output.

Memories:
${JSON.stringify(payload, null, 2)}

Return JSON: { "captions": { "memoryId": "caption text" } }`;

  if (provider === "anthropic") {
    const client = getAnthropic();
    if (client) {
      const msg = await client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 800,
        system: "You write poetic film captions. JSON only.",
        messages: [{ role: "user", content: prompt }],
      });
      const text = msg.content[0]?.type === "text" ? msg.content[0].text : "{}";
      const parsed = JSON.parse(text) as { captions: Record<string, string> };
      return new Map(Object.entries(parsed.captions ?? {}));
    }
  }

  if (provider === "openai") {
    const client = getOpenAI();
    if (client) {
      const res = await client.chat.completions.create({
        model: "gpt-4o",
        max_tokens: 800,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });
      const text = res.choices[0]?.message?.content ?? "{}";
      const parsed = JSON.parse(text) as { captions: Record<string, string> };
      return new Map(Object.entries(parsed.captions ?? {}));
    }
  }

  const map = new Map<string, string>();
  for (const r of ranked) {
    map.set(
      r.memoryId,
      r.memory.caption ??
        `${r.memory.title} — held in ${r.mood} light`,
    );
  }
  return map;
}
