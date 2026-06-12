"use client";

import Link from "next/link";
import { format } from "date-fns";
import { SectionHeader } from "@/components/dashboard/section-header";
import { DashboardScrollReveal } from "@/components/dashboard/dashboard-scroll-reveal";
import type { Memory } from "@/types/memory";

interface VaultViewProps {
  memories: Memory[];
  worldSlug: string;
}

export function VaultView({ memories, worldSlug }: VaultViewProps) {
  const sorted = [...memories].sort(
    (a, b) =>
      new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
  );

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
      <div className="mx-auto max-w-3xl">
        <SectionHeader
          eyebrow="Memory vault"
          title="Everything, kept"
          description="The complete archive — searchable by heart, organized by time. No folders. No tasks. Only what was real."
        />

        <div className="relative">
          <div
            className="absolute top-3 bottom-3 left-[5px] w-px bg-gradient-to-b from-verse-gold/40 via-verse-border to-transparent"
            aria-hidden
          />
          <ul className="space-y-1">
            {sorted.map((memory) => (
              <li key={memory.id}>
                <DashboardScrollReveal>
                  <Link
                    href={`/worlds/${worldSlug}/memories/${memory.id}`}
                    className="group flex gap-6 rounded-sm py-5 pl-8 pr-4 transition-colors hover:bg-verse-surface/30"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] tracking-[0.25em] text-verse-cream-faint uppercase">
                        {format(new Date(memory.occurredAt), "MMMM yyyy")}
                      </p>
                      <p className="mt-1 font-display text-xl text-verse-cream-muted transition-colors group-hover:text-verse-cream sm:text-2xl">
                        {memory.title}
                      </p>
                      {memory.caption && (
                        <p className="mt-2 line-clamp-1 text-sm text-verse-cream-faint">
                          {memory.caption}
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-2 text-right">
                      {memory.isHighlight && (
                        <span className="text-[9px] tracking-[0.2em] text-verse-gold uppercase">
                          Highlight
                        </span>
                      )}
                      <span className="text-[11px] text-verse-cream-faint opacity-0 transition-opacity group-hover:opacity-100">
                        Open →
                      </span>
                    </div>
                  </Link>
                </DashboardScrollReveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
