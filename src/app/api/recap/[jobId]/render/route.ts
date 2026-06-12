import { NextResponse } from "next/server";
import { z } from "zod";
import { clonePlanForAspect } from "@/lib/recap/compose";
import { getJob } from "@/lib/recap/jobs";
import { renderRecapVideo } from "@/lib/recap/render";
import type { RecapAspectRatio } from "@/lib/recap/types";

const bodySchema = z.object({
  aspectRatio: z.enum(["16:9", "9:16"]).optional(),
  both: z.boolean().optional(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ jobId: string }> },
) {
  try {
    const { jobId } = await params;
    let job = getJob(jobId);

    if (!job?.plan) {
      return NextResponse.json(
        { error: "Recap plan not ready. Run generate first." },
        { status: 400 },
      );
    }

    const json = await request.json().catch(() => ({}));
    const parsed = bodySchema.safeParse(json);
    const both = parsed.success ? parsed.data.both : false;

    const ratios: RecapAspectRatio[] = both
      ? ["16:9", "9:16"]
      : [parsed.success && parsed.data.aspectRatio
          ? parsed.data.aspectRatio
          : job.aspectRatio];

    for (const ratio of ratios) {
      const plan =
        ratio === job.plan!.aspectRatio
          ? job.plan!
          : clonePlanForAspect(job.plan!, ratio);
      job = await renderRecapVideo(job, plan);
      if (job.status === "failed") break;
    }

    return NextResponse.json({ job });
  } catch (error) {
    console.error("[recap/render]", error);
    return NextResponse.json({ error: "Render failed" }, { status: 500 });
  }
}
