import { format } from "date-fns";
import type {
  MemorySalience,
  RecapAspectRatio,
  RecapNarrativeArc,
  RecapPlan,
  RecapScene,
  RecapTransition,
} from "./types";

const FPS = 30;
const OPENING_FRAMES = 150;
const CLOSING_FRAMES = 120;
const MIN_SCENE_FRAMES = 105;
const MAX_SCENE_FRAMES = 210;

function dimensions(aspect: RecapAspectRatio) {
  return aspect === "9:16"
    ? { width: 1080, height: 1920 }
    : { width: 1920, height: 1080 };
}

function pickTransition(index: number, salience: number): RecapTransition {
  if (salience > 0.85) return "slow-zoom";
  if (index % 3 === 0) return "dissolve";
  return "fade";
}

function sceneDurationFrames(salience: number, captionLength: number): number {
  const base = MIN_SCENE_FRAMES + Math.round(salience * 60);
  const captionBoost = Math.min(Math.floor(captionLength / 4), 45);
  return Math.min(base + captionBoost, MAX_SCENE_FRAMES);
}

export function buildRecapPlan(params: {
  jobId: string;
  worldId: string;
  worldName: string;
  aspectRatio: RecapAspectRatio;
  narrative: RecapNarrativeArc;
  ranked: MemorySalience[];
  captions: Map<string, string>;
  fullNarrationScript: string;
  narrationAudioUrl?: string;
}): RecapPlan {
  const {
    jobId,
    worldId,
    worldName,
    aspectRatio,
    narrative,
    ranked,
    captions,
    fullNarrationScript,
    narrationAudioUrl,
  } = params;

  const { width, height } = dimensions(aspectRatio);
  let cursor = OPENING_FRAMES;
  const scenes: RecapScene[] = [];

  ranked.forEach((r, index) => {
    const cover = r.memory.media.find(
      (m) => m.type === "photo" || m.type === "video",
    );
    if (!cover) return;

    const poeticCaption =
      captions.get(r.memoryId) ??
      r.memory.caption ??
      r.memory.title;

    const durationFrames = sceneDurationFrames(
      r.score,
      poeticCaption.length,
    );

    const phaseNarration =
      narrative.phases[Math.min(index, narrative.phases.length - 1)]
        ?.narration ?? "";

    scenes.push({
      id: `scene-${r.memoryId}`,
      memoryId: r.memoryId,
      imageUrl: cover.url,
      title: r.memory.title,
      dateLabel: format(new Date(r.memory.occurredAt), "MMMM d, yyyy"),
      poeticCaption,
      narrationLine: phaseNarration.split(".")[0] ?? r.memory.title,
      salienceScore: r.score,
      mood: r.mood,
      durationFrames,
      transition: pickTransition(index, r.score),
      startFrame: cursor,
    });

    cursor += durationFrames;
  });

  const totalDurationFrames = cursor + CLOSING_FRAMES;

  return {
    id: jobId,
    worldId,
    worldName,
    aspectRatio,
    fps: FPS,
    width,
    height,
    totalDurationFrames,
    title: narrative.title,
    narrative,
    scenes,
    fullNarrationScript,
    narrationAudioUrl,
    soundtrack: undefined,
  };
}

export function clonePlanForAspect(
  plan: RecapPlan,
  aspectRatio: RecapAspectRatio,
): RecapPlan {
  const { width, height } = dimensions(aspectRatio);
  return {
    ...plan,
    aspectRatio,
    width,
    height,
    id: `${plan.id}-${aspectRatio.replace(":", "x")}`,
  };
}

export function planToRemotionProps(plan: RecapPlan) {
  return {
    worldName: plan.worldName,
    title: plan.title,
    subtitle: plan.narrative.subtitle,
    fps: plan.fps,
    width: plan.width,
    height: plan.height,
    totalDurationFrames: plan.totalDurationFrames,
    openingNarration: plan.narrative.openingNarration,
    closingNarration: plan.narrative.closingNarration,
    scenes: plan.scenes,
    narrationAudioUrl: plan.narrationAudioUrl,
    soundtrackUrl: plan.soundtrack?.url,
    soundtrackVolume: plan.soundtrack?.volume ?? 0.35,
  };
}
