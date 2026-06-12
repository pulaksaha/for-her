"use client";

import Image from "next/image";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { BlurReveal } from "@/components/landing/blur-reveal";
import { demoChapters, demoMemories, demoWorld } from "@/lib/data/demo";

export function TimelineScene() {
  return (
    <section
      id="timeline"
      className="relative border-t border-verse-border/40 bg-verse-void py-32 sm:py-44 lg:py-56"
      aria-label="Timeline"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-20">
        <BlurReveal className="max-w-2xl">
          <p className="text-[10px] tracking-[0.4em] text-verse-gold uppercase">
            Timeline
          </p>
          <h2 className="mt-6 font-display text-4xl font-light text-verse-cream sm:text-6xl">
            Chapters, not calendars
          </h2>
          <p className="mt-8 text-sm leading-relaxed text-verse-cream-muted sm:text-base">
            For couples and families — life organized the way memory actually
            works. Meaning first. Dates when they matter.
          </p>
        </BlurReveal>

        <div className="relative mt-24">
          <div
            className="absolute top-0 bottom-0 left-[7px] w-px bg-gradient-to-b from-verse-gold/50 via-verse-border to-transparent sm:left-1/2 sm:-translate-x-1/2"
            aria-hidden
          />

          <ol className="space-y-24 sm:space-y-32">
            {demoChapters.map((chapter, index) => {
              const cover = demoMemories.find(
                (m) => m.id === chapter.coverMemoryId,
              );
              const isEven = index % 2 === 0;

              return (
                <li key={chapter.id}>
                  <BlurReveal>
                  <article
                    className={`relative grid items-center gap-10 sm:grid-cols-2 sm:gap-16 ${
                      isEven ? "" : "sm:[&>div:first-child]:order-2"
                    }`}
                  >
                    <div className="sm:pr-12 sm:text-right">
                      <time
                        dateTime={chapter.startDate}
                        className="text-[10px] tracking-[0.35em] text-verse-cream-faint uppercase"
                      >
                        {format(parseISO(chapter.startDate), "yyyy")}
                        {chapter.endDate &&
                          ` — ${format(parseISO(chapter.endDate), "yyyy")}`}
                      </time>
                      <h3 className="mt-4 font-display text-3xl font-light text-verse-cream sm:text-4xl">
                        {chapter.title}
                      </h3>
                      {chapter.subtitle && (
                        <p className="mt-2 text-verse-cream-muted">
                          {chapter.subtitle}
                        </p>
                      )}
                    </div>

                    {cover?.media[0] && (
                      <div className="relative aspect-[4/3] overflow-hidden rounded-sm sm:aspect-[5/4]">
                        <Image
                          src={cover.media[0].url}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <div className="absolute inset-0 bg-verse-void/25" />
                      </div>
                    )}
                  </article>
                  </BlurReveal>
                </li>
              );
            })}
          </ol>
        </div>

        <BlurReveal className="mt-20 text-center">
          <Link
            href={`/worlds/${demoWorld.slug}/timeline`}
            className="inline-block border-b border-verse-gold/40 pb-1 text-[11px] tracking-[0.3em] text-verse-cream-muted uppercase transition-colors hover:border-verse-gold hover:text-verse-cream"
          >
            Walk the full timeline →
          </Link>
        </BlurReveal>
      </div>
    </section>
  );
}
