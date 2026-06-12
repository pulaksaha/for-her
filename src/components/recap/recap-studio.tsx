"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Sparkles, Film, Download, Loader2 } from "lucide-react";
import { SectionHeader } from "@/components/dashboard/section-header";
import { planToRemotionProps } from "@/lib/recap/compose";
import type { RecapJob } from "@/lib/recap/types";
import { cn } from "@/lib/utils/cn";

const RecapPreviewPlayer = dynamic(
  () => import("@/components/recap/recap-preview-player"),
  { ssr: false, loading: () => null },
);

interface RecapStudioProps {
  worldSlug: string;
}

const STATUS_LABEL: Record<string, string> = {
  queued: "Waiting",
  analyzing: "Reading memories",
  ranking: "Finding heart",
  storytelling: "Writing arc",
  captions: "Poetic captions",
  narration: "Narration script",
  composing: "Composing scenes",
  rendering: "Rendering film",
  assembling: "Mixing sound",
  ready: "Ready",
  failed: "Needs attention",
};

export function RecapStudio({ worldSlug }: RecapStudioProps) {
  const [job, setJob] = useState<RecapJob | null>(null);
  const [aspectRatio, setAspectRatio] = useState<"16:9" | "9:16">("16:9");
  const [loading, setLoading] = useState(false);
  const [rendering, setRendering] = useState(false);

  const poll = useCallback(async (jobId: string) => {
    const res = await fetch(`/api/recap/${jobId}`);
    const data = (await res.json()) as { job: RecapJob };
    setJob(data.job);
    return data.job;
  }, []);

  useEffect(() => {
    if (!job?.id || job.status === "ready" || job.status === "failed") return;
    if (job.progress >= 78 && job.plan) return;

    const interval = setInterval(() => {
      poll(job.id);
    }, 1500);
    return () => clearInterval(interval);
  }, [job?.id, job?.status, job?.progress, job?.plan, poll]);

  async function handleGenerate() {
    setLoading(true);
    setJob(null);
    try {
      const res = await fetch("/api/recap/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          worldSlug,
          aspectRatio,
          maxScenes: 8,
          periodLabel: "Anniversary",
        }),
      });
      const data = (await res.json()) as { job: RecapJob; error?: string };
      if (data.job) setJob(data.job);
    } finally {
      setLoading(false);
    }
  }

  async function handleRender(both = false) {
    if (!job?.id) return;
    setRendering(true);
    try {
      const res = await fetch(`/api/recap/${job.id}/render`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ both }),
      });
      const data = (await res.json()) as { job: RecapJob };
      setJob(data.job);
    } finally {
      setRendering(false);
    }
  }

  const previewProps = job?.plan ? planToRemotionProps(job.plan) : null;

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
      <div className="mx-auto max-w-4xl">
        <SectionHeader
          eyebrow="Anniversary recap"
          title="Commission your film"
          description="Verse analyzes your archive, finds the moments that matter most, writes a documentary arc, and renders a cinematic recap — narration, music, and all."
        />

        <div className="mt-10 flex flex-wrap gap-3">
          {(["16:9", "9:16"] as const).map((ratio) => (
            <button
              key={ratio}
              type="button"
              onClick={() => setAspectRatio(ratio)}
              className={cn(
                "rounded-sm border px-5 py-2.5 text-[10px] tracking-[0.25em] uppercase transition-colors",
                aspectRatio === ratio
                  ? "border-verse-gold/50 bg-verse-gold/10 text-verse-gold"
                  : "border-verse-border/50 text-verse-cream-faint hover:text-verse-cream",
              )}
            >
              {ratio === "16:9" ? "Widescreen" : "Vertical"}
            </button>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <button
            type="button"
            disabled={loading}
            onClick={handleGenerate}
            className="inline-flex items-center gap-2 rounded-sm bg-verse-cream px-6 py-3 text-[11px] tracking-[0.25em] text-verse-void uppercase transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" strokeWidth={1.25} />
            )}
            Generate recap
          </button>

          {job?.plan && (
            <>
              <button
                type="button"
                disabled={rendering}
                onClick={() => handleRender(false)}
                className="inline-flex items-center gap-2 rounded-sm border border-verse-border/60 px-6 py-3 text-[11px] tracking-[0.25em] text-verse-cream-muted uppercase hover:border-verse-gold/40 hover:text-verse-cream disabled:opacity-50"
              >
                {rendering ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Film className="h-4 w-4" strokeWidth={1.25} />
                )}
                Export MP4
              </button>
              <button
                type="button"
                disabled={rendering}
                onClick={() => handleRender(true)}
                className="inline-flex items-center gap-2 rounded-sm border border-verse-border/60 px-6 py-3 text-[11px] tracking-[0.25em] text-verse-cream-muted uppercase hover:border-verse-gold/40 hover:text-verse-cream disabled:opacity-50"
              >
                Both formats
              </button>
            </>
          )}
        </div>

        {job && (
          <div className="mt-12 rounded-sm border border-verse-border/40 bg-verse-surface/20 p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <p className="text-[10px] tracking-[0.35em] text-verse-gold uppercase">
                {STATUS_LABEL[job.status] ?? job.status}
              </p>
              <p className="text-sm tabular-nums text-verse-cream-faint">
                {job.progress}%
              </p>
            </div>
            <div className="mt-4 h-px overflow-hidden rounded-full bg-verse-border/40">
              <div
                className="h-full bg-verse-gold/70 transition-all duration-700 ease-out"
                style={{ width: `${job.progress}%` }}
              />
            </div>
            <p className="mt-4 text-sm text-verse-cream-muted">{job.message}</p>

            {job.plan && (
              <div className="mt-8 border-t border-verse-border/30 pt-8">
                <h3 className="font-display text-2xl text-verse-cream">
                  {job.plan.title}
                </h3>
                <p className="mt-2 text-sm italic text-verse-cream-muted">
                  {job.plan.narrative.openingNarration}
                </p>
                <p className="mt-4 text-[11px] text-verse-cream-faint">
                  {job.plan.scenes.length} scenes ·{" "}
                  {Math.round(job.plan.totalDurationFrames / job.plan.fps)}s
                </p>
              </div>
            )}

            {job.outputUrls?.widescreen && (
              <a
                href={job.outputUrls.widescreen}
                download
                className="mt-6 inline-flex items-center gap-2 text-[11px] tracking-[0.25em] text-verse-gold uppercase"
              >
                <Download className="h-4 w-4" />
                Download widescreen
              </a>
            )}
            {job.outputUrls?.vertical && (
              <a
                href={job.outputUrls.vertical}
                download
                className="mt-4 ml-0 inline-flex items-center gap-2 text-[11px] tracking-[0.25em] text-verse-gold uppercase sm:ml-6"
              >
                <Download className="h-4 w-4" />
                Download vertical
              </a>
            )}
          </div>
        )}

        {previewProps && job?.plan && (
          <div className="mt-12 overflow-hidden rounded-sm border border-verse-border/40">
            <RecapPreviewPlayer {...previewProps} />
          </div>
        )}
      </div>
    </div>
  );
}
