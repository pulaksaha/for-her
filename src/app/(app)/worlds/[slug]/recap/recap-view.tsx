"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Sparkles } from "lucide-react";
import { SectionHeader } from "@/components/dashboard/section-header";
import { DashboardScrollReveal } from "@/components/dashboard/dashboard-scroll-reveal";
import { Button } from "@/components/ui/button";
import type { Memory, MemoryRecap } from "@/types/memory";

interface RecapViewProps {
  recap: MemoryRecap;
  memories: Memory[];
  worldSlug: string;
}

const pastRecaps = [
  { period: "Autumn", title: "The year we learned to stay" },
  { period: "Summer", title: "Bodies of water, bodies close" },
];

export function RecapView({ recap, memories, worldSlug }: RecapViewProps) {
  const linked = memories.filter((m) => recap.memoryIds.includes(m.id));

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
      <div className="mx-auto max-w-4xl">
        <SectionHeader
          eyebrow="AI recap center"
          title="Reflections written with care"
          description="Verse gathers what you saved and writes the season back to you — literary, private, never performative."
          action={
            <Button variant="outline" size="sm" className="shrink-0">
              <Sparkles className="h-4 w-4" strokeWidth={1.25} />
              Generate new
            </Button>
          }
        />

        <DashboardScrollReveal>
          <article className="rounded-sm border border-verse-border/50 bg-gradient-to-br from-verse-surface/40 to-verse-night/80 p-8 sm:p-12 lg:p-14">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-[10px] tracking-[0.35em] text-verse-gold uppercase">
                Current · {recap.period}
              </p>
              <time
                dateTime={recap.generatedAt}
                className="text-[11px] text-verse-cream-faint"
              >
                {format(new Date(recap.generatedAt), "MMMM d, yyyy")}
              </time>
            </div>
            <h2 className="mt-6 font-display text-3xl font-light text-verse-cream sm:text-4xl">
              {recap.title}
            </h2>
            <blockquote className="mt-10 font-display text-xl leading-[1.55] font-light text-verse-cream-muted sm:text-2xl">
              &ldquo;{recap.story}&rdquo;
            </blockquote>

            {linked.length > 0 && (
              <div className="mt-12 border-t border-verse-border/40 pt-8">
                <p className="text-[10px] tracking-[0.3em] text-verse-cream-faint uppercase">
                  Drawn from
                </p>
                <ul className="mt-4 space-y-2">
                  {linked.map((m) => (
                    <li key={m.id}>
                      <Link
                        href={`/worlds/${worldSlug}/memories/${m.id}`}
                        className="text-sm text-verse-cream-muted transition-colors hover:text-verse-gold"
                      >
                        {m.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </article>
        </DashboardScrollReveal>

        <DashboardScrollReveal className="mt-16">
          <p className="text-[10px] tracking-[0.35em] text-verse-cream-faint uppercase">
            Archive
          </p>
          <ul className="mt-6 space-y-3">
            {pastRecaps.map((item) => (
              <li
                key={item.title}
                className="flex items-baseline justify-between border-b border-verse-border/30 py-4"
              >
                <span className="font-display text-lg text-verse-cream-muted">
                  {item.title}
                </span>
                <span className="text-[11px] tracking-wider text-verse-cream-faint uppercase">
                  {item.period}
                </span>
              </li>
            ))}
          </ul>
        </DashboardScrollReveal>
      </div>
    </div>
  );
}
