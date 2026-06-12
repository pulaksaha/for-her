import { randomUUID } from "crypto";
import { analyzeMemories } from "./analyze";
import { rankStrongestMoments } from "./rank";
import { generateNarrativeArc } from "./narrative";
import { generatePoeticCaptions } from "./captions";
import {
  buildNarrationScript,
  synthesizeNarration,
} from "./narration";
import { buildRecapPlan } from "./compose";
import { createJob, updateJob } from "./jobs";
import type { RecapGenerateInput, RecapJob } from "./types";

export async function runRecapPipeline(
  input: RecapGenerateInput,
): Promise<RecapJob> {
  const jobId = randomUUID();
  const aspectRatio = input.aspectRatio ?? "16:9";

  let job = createJob({
    id: jobId,
    worldId: input.worldId,
    worldSlug: input.worldSlug,
    worldName: input.worldName,
    status: "queued",
    progress: 0,
    message: "Preparing your anniversary film…",
    aspectRatio,
  });

  const step = async (
    status: RecapJob["status"],
    progress: number,
    message: string,
  ) => {
    job =
      updateJob(jobId, { status, progress, message }) ?? job;
  };

  try {
    await step("analyzing", 8, "Reading the light in your memories…");
    const analyzed = await analyzeMemories(input.memories, {
      useVision: true,
    });

    await step("ranking", 22, "Finding the moments that matter most…");
    const ranked = rankStrongestMoments(
      analyzed,
      input.maxScenes ?? 8,
    );

    await step("storytelling", 38, "Weaving your narrative arc…");
    const narrative = await generateNarrativeArc(
      input.worldName,
      ranked,
      input.periodLabel,
    );

    await step("captions", 52, "Writing poetic captions…");
    const captions = await generatePoeticCaptions(ranked, narrative);

    await step("narration", 65, "Crafting the narration script…");
    const fullNarrationScript = buildNarrationScript(narrative, ranked);

    await step("composing", 72, "Composing scenes and pacing…");
    const narrationAudioUrl = await synthesizeNarration(
      fullNarrationScript,
      jobId,
    );

    const plan = buildRecapPlan({
      jobId,
      worldId: input.worldId,
      worldName: input.worldName,
      aspectRatio,
      narrative,
      ranked,
      captions,
      fullNarrationScript,
      narrationAudioUrl: narrationAudioUrl ?? undefined,
    });

    job = updateJob(jobId, { plan, progress: 78, message: "Picture locked." }) ?? job;

    return job;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Pipeline failed";
    return (
      updateJob(jobId, {
        status: "failed",
        progress: 0,
        message,
        error: message,
      }) ?? job
    );
  }
}
