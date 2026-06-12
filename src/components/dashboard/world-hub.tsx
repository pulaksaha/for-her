"use client";

import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { DashboardScrollReveal } from "@/components/dashboard/dashboard-scroll-reveal";
import { WorldHero } from "@/components/dashboard/world-hero";
import type { WorldDashboardData } from "@/lib/world/get-world-data";

const quickLinks = [
  { segment: "/timeline", label: "Timeline", desc: "Chapters of your story" },
  { segment: "/gallery", label: "Gallery", desc: "Every image, held large" },
  { segment: "/voice", label: "Voice notes", desc: "Hear what you saved" },
  { segment: "/vault", label: "Memory vault", desc: "The full archive" },
  { segment: "/films", label: "Anniversary films", desc: "Letters in motion" },
  { segment: "/recap", label: "AI recap", desc: "What the season meant" },
];

export function WorldHub({ data }: { data: WorldDashboardData }) {
  const { world, memories, recap, highlights } = data;
  const latest = [...memories].sort(
    (a, b) =>
      new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
  )[0];

  return (
    <div className="px-4 sm:px-6 lg:px-10 lg:py-8">
      <WorldHero world={world} />

      <div className="mx-auto max-w-6xl">
        <DashboardScrollReveal>
          <section className="rounded-sm border border-verse-border/40 bg-verse-surface/20 p-6 sm:p-10">
            <p className="text-[10px] tracking-[0.35em] text-verse-gold uppercase">
              Latest recap
            </p>
            <h2 className="mt-3 font-display text-2xl text-verse-cream sm:text-3xl">
              {recap.title}
            </h2>
            <p className="mt-4 line-clamp-3 font-display text-lg font-light leading-relaxed text-verse-cream-muted italic">
              &ldquo;{recap.story}&rdquo;
            </p>
            <Link
              href={`/worlds/${world.slug}/recap`}
              className="mt-6 inline-block text-[11px] tracking-[0.25em] text-verse-gold uppercase hover:text-verse-cream"
            >
              Read in recap center →
            </Link>
          </section>
        </DashboardScrollReveal>

        {latest && (
          <DashboardScrollReveal className="mt-12 sm:mt-16">
            <p className="text-[10px] tracking-[0.35em] text-verse-cream-faint uppercase">
              Last added
            </p>
            <Link
              href={`/worlds/${world.slug}/memories/${latest.id}`}
              className="group mt-4 block overflow-hidden rounded-sm"
            >
              <div className="relative aspect-[21/9] overflow-hidden">
                {latest.media[0] && (
                  <Image
                    src={latest.media[0].url}
                    alt={latest.title}
                    fill
                    className="object-cover transition-transform duration-[1.2s] group-hover:scale-[1.02]"
                    sizes="100vw"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-verse-void via-verse-void/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  <p className="font-display text-2xl text-verse-cream sm:text-3xl">
                    {latest.title}
                  </p>
                  <p className="mt-2 text-sm text-verse-cream-faint">
                    {format(new Date(latest.occurredAt), "MMMM d, yyyy")}
                  </p>
                </div>
              </div>
            </Link>
          </DashboardScrollReveal>
        )}

        <DashboardScrollReveal className="mt-16 sm:mt-20">
          <p className="text-[10px] tracking-[0.35em] text-verse-cream-faint uppercase">
            Enter
          </p>
          <div className="mt-6 grid gap-px bg-verse-border/30 sm:grid-cols-2 lg:grid-cols-3">
            {quickLinks.map((link) => (
              <Link
                key={link.segment}
                href={`/worlds/${world.slug}${link.segment}`}
                className="group bg-verse-surface/30 px-6 py-8 transition-colors hover:bg-verse-elevated/40 sm:px-8 sm:py-10"
              >
                <p className="font-display text-xl text-verse-cream transition-colors group-hover:text-verse-gold">
                  {link.label}
                </p>
                <p className="mt-2 text-sm text-verse-cream-faint">{link.desc}</p>
              </Link>
            ))}
          </div>
        </DashboardScrollReveal>

        {highlights.length > 0 && (
          <DashboardScrollReveal className="mt-16 pb-8 sm:mt-20">
            <p className="mb-6 text-[10px] tracking-[0.35em] text-verse-cream-faint uppercase">
              Highlights
            </p>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
              {highlights.map((m) => (
                <Link
                  key={m.id}
                  href={`/worlds/${world.slug}/memories/${m.id}`}
                  className="group relative aspect-[3/4] overflow-hidden rounded-sm"
                >
                  {m.media[0] && (
                    <Image
                      src={m.media[0].url}
                      alt={m.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="33vw"
                    />
                  )}
                  <div className="absolute inset-0 bg-verse-void/20 opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              ))}
            </div>
          </DashboardScrollReveal>
        )}
      </div>
    </div>
  );
}
