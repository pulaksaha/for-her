"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Memory } from "@/types/memory";

interface GenerateStoryButtonProps {
  memory: Memory;
  worldName: string;
}

export function GenerateStoryButton({
  memory,
  worldName,
}: GenerateStoryButtonProps) {
  const [story, setStory] = useState(memory.story?.content ?? "");
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    try {
      const res = await fetch("/api/stories/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memory: {
            title: memory.title,
            caption: memory.caption,
            location: memory.location,
            mood: memory.mood,
            occurredAt: memory.occurredAt,
          },
          worldName,
        }),
      });
      const data = (await res.json()) as { content?: string; error?: string };
      if (data.content) setStory(data.content);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-4">
      <Button
        variant="outline"
        size="sm"
        onClick={handleGenerate}
        disabled={loading}
      >
        <Sparkles className="h-4 w-4" strokeWidth={1.5} />
        {loading ? "Writing…" : memory.story ? "Regenerate" : "Generate story"}
      </Button>
      {story && story !== memory.story?.content && (
        <p className="max-w-md text-right text-sm text-verse-cream-muted italic">
          {story}
        </p>
      )}
    </div>
  );
}
