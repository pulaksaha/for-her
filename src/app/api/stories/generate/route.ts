import { NextResponse } from "next/server";
import { z } from "zod";
import { generateMemoryStory } from "@/lib/ai/story";

const bodySchema = z.object({
  memory: z.object({
    title: z.string(),
    caption: z.string().optional(),
    location: z.string().optional(),
    mood: z.enum(["tender", "joyful", "nostalgic", "quiet", "celebration"]),
    occurredAt: z.string(),
  }),
  worldName: z.string().optional(),
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

    const result = await generateMemoryStory({
      memory: parsed.data.memory,
      worldName: parsed.data.worldName,
    });

    return NextResponse.json({
      content: result.content,
      provider: result.provider,
    });
  } catch (error) {
    console.error("[stories/generate]", error);
    return NextResponse.json(
      { error: "Failed to generate story" },
      { status: 500 },
    );
  }
}
