"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BlurReveal } from "@/components/landing/blur-reveal";

gsap.registerPlugin(ScrollTrigger);

const WAVEFORM = [
  0.2, 0.35, 0.55, 0.8, 0.65, 0.9, 0.7, 0.45, 0.6, 0.85, 0.5, 0.75, 0.4,
  0.6, 0.95, 0.7, 0.5, 0.65, 0.35, 0.55, 0.8, 0.45, 0.7, 0.3, 0.5, 0.75,
  0.6, 0.4, 0.55, 0.7, 0.45, 0.25,
];

export function VoiceScene() {
  const barsRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const bars = barsRef.current?.querySelectorAll("[data-bar]");
    if (!bars?.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        bars,
        { scaleY: 0.15, opacity: 0.3 },
        {
          scaleY: 1,
          opacity: 1,
          duration: 1.2,
          stagger: 0.02,
          ease: "power2.out",
          scrollTrigger: {
            trigger: barsRef.current,
            start: "top 80%",
          },
        },
      );
    }, barsRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!playing) return;
    const bars = barsRef.current?.querySelectorAll("[data-bar]");
    if (!bars) return;

    const tween = gsap.to(bars, {
      scaleY: () => 0.2 + Math.random() * 0.85,
      duration: 0.35,
      stagger: { each: 0.02, from: "random" },
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    return () => {
      tween.kill();
    };
  }, [playing]);

  return (
    <section
      id="voice"
      className="relative overflow-hidden border-t border-verse-border/40 bg-verse-night py-32 sm:py-44"
      aria-label="Voice notes"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-20">
        <div className="grid items-center gap-20 lg:grid-cols-2 lg:gap-28">
          <BlurReveal>
            <p className="text-[10px] tracking-[0.4em] text-verse-gold uppercase">
              Voice
            </p>
            <h2 className="mt-6 font-display text-4xl font-light text-verse-cream sm:text-5xl">
              Hear it the way
              <br />
              you remember it
            </h2>
            <p className="mt-8 max-w-md text-sm leading-relaxed text-verse-cream-muted">
              A whispered message. Laughter in the kitchen. The sound of someone
              saying your name. Voice notes sit beside the image — not instead of
              it.
            </p>
          </BlurReveal>

          <BlurReveal>
            <div className="rounded-sm border border-verse-border/50 bg-verse-surface/40 p-8 sm:p-12">
              <p className="text-sm leading-relaxed text-verse-cream-muted italic">
                &ldquo;I still think about that morning — you laughing before the
                coffee even arrived.&rdquo;
              </p>

              <div
                ref={barsRef}
                className="mt-10 flex h-16 items-end justify-between gap-[3px]"
                role="img"
                aria-label="Voice waveform visualization"
              >
                {WAVEFORM.map((h, i) => (
                  <span
                    key={i}
                    data-bar
                    className="w-full max-w-[6px] origin-bottom rounded-full bg-verse-gold/70"
                    style={{ height: `${h * 100}%`, transform: "scaleY(0.15)" }}
                  />
                ))}
              </div>

              <div className="mt-8 flex items-center justify-between">
                <span className="text-[11px] tracking-widest text-verse-cream-faint tabular-nums">
                  0:42
                </span>
                <motion.button
                  type="button"
                  onClick={() => setPlaying((p) => !p)}
                  className="rounded-full border border-verse-border px-6 py-2.5 text-[11px] tracking-[0.25em] text-verse-cream uppercase transition-colors hover:border-verse-gold/40 hover:bg-verse-elevated/50"
                  whileTap={{ scale: 0.98 }}
                >
                  {playing ? "Pause" : "Listen"}
                </motion.button>
              </div>
            </div>
          </BlurReveal>
        </div>
      </div>
    </section>
  );
}
