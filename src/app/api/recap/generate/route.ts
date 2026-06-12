import { NextResponse } from "next/server";
import { z } from "zod";
import { runRecapPipeline } from "@/lib/recap/pipeline";
import { getWorldDashboardData } from "@/lib/world/get-world-data";

const bodySchema = z.object({
  worldSlug: z.string(),
  aspectRatio: z.enum(["16:9", "9:16"]).optional(),
  maxScenes: z.number().min(3).max(12).optional(),
  periodLabel: z.string().optional(),
  render: z.boolean().optional(),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = bodySchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const data = getWorldDashboardData(parsed.data.worldSlug);
    if (!data) {
      return NextResponse.json({ error: "World not found" }, { status: 404 });
    }

    let job = await runRecapPipeline({
      worldId: data.world.id,
      worldSlug: parsed.data.worldSlug,
      worldName: data.world.name,
      memories: data.memories,
      aspectRatio: parsed.data.aspectRatio,
      maxScenes: parsed.data.maxScenes,
      periodLabel: parsed.data.periodLabel,
    });

    if (parsed.data.render && job.plan && job.status !== "failed") {
      const { renderRecapVideo } = await import("@/lib/recap/render");
      job = await renderRecapVideo(job, job.plan);
    }

    return NextResponse.json({ job });
  } catch (error) {
    console.error("[recap/generate]", error);
    return NextResponse.json(
      { error: "Failed to generate recap" },
      { status: 500 },
    );
  }
}
