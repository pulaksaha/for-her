import { format } from "date-fns";
import type { MemorySalience, RecapNarrativeArc } from "./types";
import { generateVoiceNarration } from "@/lib/elevenlabs/voice";
import { getOpenAI } from "@/lib/ai/providers";
import { env } from "@/lib/env";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export function buildNarrationScript(
  narrative: RecapNarrativeArc,
  ranked: MemorySalience[],
): string {
  const lines: string[] = [
    narrative.openingNarration,
    ...narrative.phases.map((p) => p.narration),
  ];

  for (const r of ranked) {
    lines.push(
      `${format(new Date(r.memory.occurredAt), "MMMM yyyy")}. ${r.memory.title}.`,
    );
  }

  lines.push(narrative.closingNarration);
  return lines.filter(Boolean).join("\n\n");
}

export async function synthesizeNarration(
  script: string,
  jobId: string,
): Promise<string | null> {
  const outDir = path.join(process.cwd(), "public", "recaps", jobId);
  await mkdir(outDir, { recursive: true });
  const outPath = path.join(outDir, "narration.mp3");
  const publicUrl = `/recaps/${jobId}/narration.mp3`;

  const eleven = await generateVoiceNarration({ text: script });
  if (eleven) {
    await writeFile(outPath, Buffer.from(eleven));
    return publicUrl;
  }

  if (env.OPENAI_API_KEY) {
    const openai = getOpenAI();
    if (openai) {
      const mp3 = await openai.audio.speech.create({
        model: "tts-1-hd",
        voice: "nova",
        input: script.slice(0, 4096),
      });
      const buffer = Buffer.from(await mp3.arrayBuffer());
      await writeFile(outPath, buffer);
      return publicUrl;
    }
  }

  return null;
}
