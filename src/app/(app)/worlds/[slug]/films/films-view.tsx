"use client";

import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Play } from "lucide-react";
import { SectionHeader } from "@/components/dashboard/section-header";
import { DashboardScrollReveal } from "@/components/dashboard/dashboard-scroll-reveal";
import { EmptyState } from "@/components/dashboard/empty-state";
import type { AnniversaryFilm } from "@/types/memory";

interface FilmsViewProps {
  films: AnniversaryFilm[];
  worldSlug: string;
}

export function FilmsView({ films, worldSlug }: FilmsViewProps) {
  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
      <div className="mx-auto max-w-5xl">
        <SectionHeader
          eyebrow="Anniversary films"
          title="Love letters in motion"
          description="Rendered from your archive — for anniversaries, milestones, and the years that changed you."
          action={
            <Link
              href={`/worlds/${worldSlug}/films/studio`}
              className="shrink-0 rounded-sm border border-verse-gold/40 bg-verse-gold/10 px-5 py-2.5 text-[10px] tracking-[0.3em] text-verse-gold uppercase transition-colors hover:bg-verse-gold/20"
            >
              Open recap studio
            </Link>
          }
        />

        {films.length === 0 ? (
          <EmptyState
            title="No films yet"
            description="When you're ready, Verse will weave your memories into a cinematic film — slow, warm, yours alone."
          />
        ) : (
          <div className="space-y-10">
            {films.map((film) => (
              <DashboardScrollReveal key={film.id}>
                <article className="group overflow-hidden rounded-sm border border-verse-border/40 bg-verse-surface/20">
                  <div className="relative aspect-[2.35/1] overflow-hidden">
                    {film.previewUrl && (
                      <Image
                        src={film.previewUrl}
                        alt={film.title}
                        fill
                        className="object-cover transition-transform duration-[1.4s] group-hover:scale-[1.02]"
                        sizes="(max-width: 1024px) 100vw, 896px"
                      />
                    )}
                    <div className="absolute inset-0 bg-verse-void/30 transition-colors group-hover:bg-verse-void/20" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-verse-cream/90 text-verse-void shadow-verse-soft">
                        <Play className="h-6 w-6 fill-current" />
                      </div>
                    </div>
                    <span className="absolute top-5 left-5 rounded-sm bg-verse-void/70 px-3 py-1 text-[10px] tracking-[0.25em] text-verse-gold uppercase backdrop-blur-sm">
                      {film.status}
                    </span>
                  </div>
                  <div className="p-6 sm:p-8">
                    <h2 className="font-display text-2xl font-light text-verse-cream sm:text-3xl">
                      {film.title}
                    </h2>
                    <p className="mt-3 text-sm text-verse-cream-faint">
                      {film.durationSeconds &&
                        `${Math.floor(film.durationSeconds / 60)} minutes · `}
                      {formatDistanceToNow(new Date(film.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </article>
              </DashboardScrollReveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
