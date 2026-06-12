"use client";

import Image from "next/image";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import type { Memory, TimelineChapter } from "@/types/memory";
import { ScrollReveal } from "@/components/cinematic/scroll-reveal";

interface TimelineChapterProps {
  chapter: TimelineChapter;
  memories: Memory[];
  worldSlug: string;
  index: number;
}

export function TimelineChapterBlock({
  chapter,
  memories,
  worldSlug,
  index,
}: TimelineChapterProps) {
  const coverMemory = memories.find(
    (m) => m.id === (chapter.coverMemoryId ?? chapter.memoryIds[0]),
  );
  const chapterMemories = memories.filter((m) =>
    chapter.memoryIds.includes(m.id),
  );

  return (
    <ScrollReveal delay={index * 0.1}>
      <section className="relative grid gap-12 border-t border-verse-border py-20 md:grid-cols-2 md:gap-20">
        <div className={index % 2 === 1 ? "md:order-2" : ""}>
          <p className="text-[10px] tracking-[0.3em] text-verse-gold uppercase">
            {format(parseISO(chapter.startDate), "yyyy")}
            {chapter.endDate &&
              ` — ${format(parseISO(chapter.endDate), "yyyy")}`}
          </p>
          <h2 className="mt-4 font-display text-4xl font-light text-verse-cream sm:text-5xl">
            {chapter.title}
          </h2>
          {chapter.subtitle && (
            <p className="mt-3 text-lg text-verse-cream-muted">
              {chapter.subtitle}
            </p>
          )}
          <ul className="mt-10 space-y-4">
            {chapterMemories.map((memory) => (
              <li key={memory.id}>
                <Link
                  href={`/worlds/${worldSlug}/memories/${memory.id}`}
                  className="group flex items-baseline gap-4"
                >
                  <span className="text-xs text-verse-cream-faint tabular-nums">
                    {format(new Date(memory.occurredAt), "MMM d")}
                  </span>
                  <span className="font-display text-xl text-verse-cream-muted transition-colors group-hover:text-verse-cream">
                    {memory.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {coverMemory?.media[0] && (
          <div
            className={`relative aspect-[4/5] overflow-hidden rounded-3xl ${
              index % 2 === 1 ? "md:order-1" : ""
            }`}
          >
            <Image
              src={coverMemory.media[0].url}
              alt={chapter.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-verse-void/60 to-transparent" />
          </div>
        )}
      </section>
    </ScrollReveal>
  );
}
