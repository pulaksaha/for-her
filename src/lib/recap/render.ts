import { spawn } from "child_process";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import type { RecapJob, RecapPlan } from "./types";
import { planToRemotionProps } from "./compose";
import { updateJob } from "./jobs";

export async function renderRecapVideo(
  job: RecapJob,
  plan: RecapPlan,
): Promise<RecapJob> {
  const jobId = job.id;
  updateJob(jobId, {
    status: "rendering",
    progress: 82,
    message: "Rendering cinematic frames…",
  });

  const outDir = path.join(process.cwd(), "public", "recaps", jobId);
  await mkdir(outDir, { recursive: true });

  const propsPath = path.join(outDir, "props.json");
  await writeFile(propsPath, JSON.stringify(planToRemotionProps(plan)));

  const compositionId = "AnniversaryRecap";
  const suffix = plan.aspectRatio === "9:16" ? "vertical" : "widescreen";
  const videoPath = path.join(outDir, `recap-${suffix}.mp4`);
  const silentPath = path.join(outDir, `recap-${suffix}-silent.mp4`);

  try {
    await runCommand("npx", [
      "remotion",
      "render",
      path.join("remotion", "index.ts"),
      compositionId,
      silentPath,
      `--props=${propsPath}`,
      `--width=${plan.width}`,
      `--height=${plan.height}`,
      `--frames=0-${plan.totalDurationFrames - 1}`,
    ]);

    updateJob(jobId, {
      status: "assembling",
      progress: 92,
      message: "Mixing narration and soundtrack…",
    });

    await assembleWithFfmpeg({
      videoPath: silentPath,
      outputPath: videoPath,
      narrationPath: plan.narrationAudioUrl
        ? path.join(process.cwd(), "public", plan.narrationAudioUrl)
        : undefined,
      soundtrackPath: plan.soundtrack?.url
        ? path.join(process.cwd(), "public", plan.soundtrack.url)
        : undefined,
      soundtrackVolume: plan.soundtrack?.volume ?? 0.35,
      durationSeconds: plan.totalDurationFrames / plan.fps,
    });

    const publicUrl = `/recaps/${jobId}/recap-${suffix}.mp4`;
    const outputUrls =
      plan.aspectRatio === "9:16"
        ? { vertical: publicUrl }
        : { widescreen: publicUrl };

    const merged = { ...job.outputUrls, ...outputUrls };

    return (
      updateJob(jobId, {
        status: "ready",
        progress: 100,
        message: "Your film is ready.",
        outputUrls: merged,
      }) ?? job
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Render failed";
    return (
      updateJob(jobId, {
        status: "failed",
        error: message,
        message: `Render unavailable: ${message}. Preview the plan in studio.`,
        progress: 78,
      }) ?? job
    );
  }
}

function runCommand(cmd: string, args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      cwd: process.cwd(),
      stdio: "pipe",
      shell: process.platform === "win32",
    });
    let stderr = "";
    child.stderr?.on("data", (d) => {
      stderr += d.toString();
    });
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(stderr || `Exit ${code}`));
    });
    child.on("error", reject);
  });
}

interface AssembleOptions {
  videoPath: string;
  outputPath: string;
  narrationPath?: string;
  soundtrackPath?: string;
  soundtrackVolume: number;
  durationSeconds: number;
}

export async function assembleWithFfmpeg(
  options: AssembleOptions,
): Promise<void> {
  const {
    videoPath,
    outputPath,
    narrationPath,
    soundtrackPath,
    soundtrackVolume,
  } = options;

  const inputs: string[] = ["-i", videoPath];
  let filter = "";
  let mapVideo = "0:v";
  let audioInputs = 0;

  if (narrationPath) {
    inputs.push("-i", narrationPath);
    audioInputs++;
  }
  if (soundtrackPath) {
    inputs.push("-i", soundtrackPath);
    audioInputs++;
  }

  if (audioInputs === 0) {
    await runCommand("ffmpeg", [
      "-y",
      "-i",
      videoPath,
      "-c:v",
      "copy",
      outputPath,
    ]);
    return;
  }

  const parts: string[] = [];
  let idx = 1;
  if (narrationPath) {
    parts.push(`[${idx}:a]volume=1[narr]`);
    idx++;
  }
  if (soundtrackPath) {
    parts.push(
      `[${idx}:a]volume=${soundtrackVolume},afade=t=in:st=0:d=2,afade=t=out:st=${Math.max(0, options.durationSeconds - 3)}:d=3[music]`,
    );
  }

  if (narrationPath && soundtrackPath) {
    filter = `${parts.join(";")};[narr][music]amix=inputs=2:duration=first[aout]`;
  } else if (narrationPath) {
    filter = `[1:a]volume=1[aout]`;
  } else {
    filter = parts[0].replace("[music]", "[aout]");
  }

  await runCommand("ffmpeg", [
    "-y",
    ...inputs,
    "-filter_complex",
    filter,
    "-map",
    mapVideo,
    "-map",
    "[aout]",
    "-c:v",
    "libx264",
    "-preset",
    "slow",
    "-crf",
    "18",
    "-c:a",
    "aac",
    "-b:a",
    "192k",
    "-shortest",
    outputPath,
  ]);
}
