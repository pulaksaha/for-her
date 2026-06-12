import type { Memory, MemoryMood } from "@/types/memory";
import { getAnthropic, getOpenAI, getPreferredProvider } from "./providers";

const MOOD_GUIDANCE: Record<MemoryMood, string> = {
  tender: "intimate, soft, unhurried — like a letter read aloud",
  joyful: "light and alive, but never saccharine",
  nostalgic: "warm distance, golden memory, gentle ache",
  quiet: "minimal, spacious, reverent silence between words",
  celebration: "elevated but grounded — a toast, not a party",
};

export interface GenerateStoryInput {
  memory: Pick<Memory, "title" | "caption" | "location" | "mood" | "occurredAt">;
  worldName?: string;
}

export interface GenerateStoryResult {
  content: string;
  provider: "openai" | "anthropic";
}

const SYSTEM_PROMPT = `You are the narrative voice of Verse — a private cinematic memory platform.
Write short, literary memory stories (80–140 words) that feel human, warm, and intentional.
Never use hashtags, emojis, or marketing language. No clichés like "cherished moments" or "making memories."
Write in second person or third person as feels natural. Present tense for immediacy, past for reflection — choose deliberately.
Output only the story prose, nothing else.`;

function buildUserPrompt(input: GenerateStoryInput): string {
  const { memory, worldName } = input;
  const date = new Date(memory.occurredAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return `World: ${worldName ?? "A private memory world"}
Memory title: ${memory.title}
Date: ${date}
${memory.location ? `Place: ${memory.location}` : ""}
Mood: ${memory.mood} — ${MOOD_GUIDANCE[memory.mood]}
${memory.caption ? `Caption from the person who lived it: "${memory.caption}"` : ""}

Write the story.`;
}

export async function generateMemoryStory(
  input: GenerateStoryInput,
): Promise<GenerateStoryResult> {
  const provider = getPreferredProvider();
  const userPrompt = buildUserPrompt(input);

  if (provider === "anthropic") {
    const client = getAnthropic();
    if (!client) throw new Error("Anthropic not configured");

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 400,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    });

    const text =
      message.content[0]?.type === "text" ? message.content[0].text : "";
    return { content: text.trim(), provider: "anthropic" };
  }

  if (provider === "openai") {
    const client = getOpenAI();
    if (!client) throw new Error("OpenAI not configured");

    const completion = await client.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 400,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
    });

    const text = completion.choices[0]?.message?.content ?? "";
    return { content: text.trim(), provider: "openai" };
  }

  // Demo fallback when no API keys
  const { memory } = input;
  return {
    content: `The day holds ${memory.title.toLowerCase()} like a photograph in amber — still, luminous, impossible to rush. ${
      memory.caption
        ? memory.caption
        : "You were there, fully, and that is the whole story."
    }`,
    provider: "anthropic",
  };
}
