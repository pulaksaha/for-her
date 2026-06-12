"use client";

import { BlurReveal } from "@/components/landing/blur-reveal";
import { demoRecap } from "@/lib/data/demo";

export function RecapScene() {
  return (
    <section
      id="recap"
      className="relative border-t border-verse-border/40 bg-verse-void py-32 sm:py-44 lg:py-56"
      aria-label="Memory recap"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-20">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-24">
          <div className="lg:col-span-4">
            <BlurReveal>
              <p className="text-[10px] tracking-[0.4em] text-verse-gold uppercase">
                Memory recap
              </p>
              <h2 className="mt-6 font-display text-4xl font-light leading-tight text-verse-cream sm:text-5xl">
                What the season
                <br />
                <span className="italic text-verse-cream-muted">was trying to say</span>
              </h2>
            </BlurReveal>
            <BlurReveal className="mt-10 max-w-sm text-sm leading-relaxed text-verse-cream-faint">
              Verse reads your moments — gently — and writes the reflection you
              might have written if you had stopped long enough.
            </BlurReveal>
          </div>

          <div className="lg:col-span-8">
            <BlurReveal>
              <div className="relative rounded-sm border border-verse-border/60 bg-verse-surface/30 p-10 sm:p-14 lg:p-16">
                <div className="absolute top-6 right-8 text-[10px] tracking-[0.35em] text-verse-cream-faint uppercase sm:top-8 sm:right-12">
                  {demoRecap.period} · generated
                </div>
                <p className="font-display text-2xl font-light text-verse-gold sm:text-3xl">
                  {demoRecap.title}
                </p>
                <blockquote className="mt-10 font-display text-[clamp(1.5rem,3.5vw,2.25rem)] leading-[1.45] font-light text-verse-cream">
                  &ldquo;{demoRecap.story}&rdquo;
                </blockquote>
                <div className="mt-12 flex items-center gap-4 border-t border-verse-border/50 pt-8">
                  <span className="h-px flex-1 bg-gradient-to-r from-verse-gold/40 to-transparent" />
                  <span className="text-[10px] tracking-[0.3em] text-verse-cream-faint uppercase">
                    AI narrative · private to your world
                  </span>
                </div>
              </div>
            </BlurReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
