import { format } from "date-fns";
import { getAnthropic, getOpenAI, getPreferredProvider } from "@/lib/ai/providers";
import type { MemorySalience, RecapNarrativeArc } from "./types";

const SYSTEM = `You are the anniversary film writer for Verse — a private cinematic memory platform.
Write like a luxury documentary trailer: intimate, poetic, never cheesy. No hashtags or marketing speak.
Output valid JSON only matching the schema requested.`;

function buildArcPrompt(
  worldName: string,
  ranked: MemorySalience[],
  periodLabel?: string,
): string {
  const moments = ranked
    .map(
      (r, i) =>
        `${i + 1}. "${r.memory.title}" (${format(new Date(r.memory.occurredAt), "MMMM yyyy")}) — mood: ${r.mood}. ${r.memory.caption ?? ""} ${r.visualNotes ?? ""}`,
    )
    .join("\n");

  return `World: "${worldName}"
${periodLabel ? `Period: ${periodLabel}` : "Period: anniversary recap"}

Moments selected for the film (chronological):
${moments}

Return JSON:
{
  "title": "film title, 3-8 words, serif-documentary tone",
  "subtitle": "optional one line",
  "openingNarration": "15-25 words, hook the heart",
  "phases": [
    { "name": "phase name", "narration": "20-35 words bridging moments" }
  ],
  "closingNarration": "15-25 words, landing with warmth"
}

Use 2-4 phases. Voice: second person or collective "you both".`;
}

export async function generateNarrativeArc(
  worldName: string,
  ranked: MemorySalience[],
  periodLabel?: string,
): Promise<RecapNarrativeArc> {
  const provider = getPreferredProvider();
  const userPrompt = buildArcPrompt(worldName, ranked, periodLabel);

  if (provider === "anthropic") {
    const client = getAnthropic();
    if (client) {
      const msg = await client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1200,
        system: SYSTEM,
        messages: [{ role: "user", content: userPrompt }],
      });
      const text = msg.content[0]?.type === "text" ? msg.content[0].text : "{}";
      return JSON.parse(text) as RecapNarrativeArc;
    }
  }

  if (provider === "openai") {
    const client = getOpenAI();
    if (client) {
      const res = await client.chat.completions.create({
        model: "gpt-4o",
        max_tokens: 1200,
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
      });
      const text = res.choices[0]?.message?.content ?? "{}";
      return JSON.parse(text) as RecapNarrativeArc;
    }
  }

  return demoNarrativeArc(worldName, ranked);
}

function demoNarrativeArc(
  worldName: string,
  ranked: MemorySalience[],
): RecapNarrativeArc {
  return {
    title: `A Love Letter in Time`,
    subtitle: worldName,
    openingNarration:
      "Some years change the shape of everything — quietly, and all at once.",
    phases: [
      {
        name: "Becoming",
        narration:
          "You learned each other in small rooms and wide horizons — laughter before coffee, courage on fire escapes.",
      },
      {
        name: "Keeping",
        narration:
          "What you chose to keep was never the grand gesture alone, but the ordinary sacred: rain on glass, hands finding hands.",
      },
    ],
    closingNarration: `This is ${worldName} — still unfolding, still yours.`,
  };
}
