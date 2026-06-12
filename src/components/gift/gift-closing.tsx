"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useScroll, useTransform } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

// ─── PERSONALISE HERE ────────────────────────────────────────────────────────
const CLOSING_LINE_1 = "And still,"; // ← Replace
const CLOSING_LINE_2 = "every single day,"; // ← Replace
const CLOSING_LINE_3 = "I choose you."; // ← Replace
const CLOSING_FOOTER = "I love you."; // ← Keep or replace
// Optional: countdown label. Set to null to hide.
// Format: { label: "Until we meet in", target: new Date("2025-12-25") }
const COUNTDOWN: { label: string; target: Date } | null = {
  label: "Until our next adventure",
  target: new Date("2025-12-31"), // ← Replace with meaningful date
};
// Closing background: place /public/images/closing-bg.jpg for a photo
// Falls back to a rich gradient.
const CLOSING_IMAGE = "/images/closing-bg.jpg";
// ─────────────────────────────────────────────────────────────────────────────

function useCountdown(target: Date | null) {
  const [parts, setParts] = React.useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  React.useEffect(() => {
    if (!target) return;
    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) {
        setParts({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      const s = Math.floor(diff / 1000) % 60;
      const m = Math.floor(diff / 60000) % 60;
      const h = Math.floor(diff / 3600000) % 24;
      const d = Math.floor(diff / 86400000);
      setParts({ days: d, hours: h, minutes: m, seconds: s });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  return parts;
}

import React from "react";

export function GiftClosing() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const countdown = useCountdown(COUNTDOWN?.target ?? null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end end"],
  });
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.08, 1.0]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.4], [0, 1]);
  const contentY = useTransform(scrollYProgress, [0, 0.4], [60, 0]);

  useEffect(() => {
    const text = textRef.current;
    if (!text) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        text.querySelectorAll(".closing-line"),
        { opacity: 0, y: 32, filter: "blur(8px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          stagger: 0.4,
          duration: 1.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: text,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        }
      );
    }, text);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden py-32 px-6 text-center"
      aria-label="Closing"
    >
      {/* Background image with Framer parallax */}
      <motion.div style={{ scale: imageScale }} className="absolute inset-0 will-change-transform">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(160deg, #140f07 0%, #1e1508 40%, #0e0c0a 100%)",
          }}
        />
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${CLOSING_IMAGE}')` }}
          role="img"
          aria-hidden
        />
        <div className="absolute inset-0 bg-verse-void/65" />
        <div className="absolute inset-0 bg-gradient-to-b from-verse-void via-transparent to-verse-void/80" />
      </motion.div>

      {/* Gold glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(201,169,110,0.07),transparent_70%)]" />

      {/* Text content */}
      <motion.div
        ref={textRef}
        style={{ opacity: contentOpacity, y: contentY }}
        className="relative z-10 max-w-3xl"
      >
        <p className="closing-line mb-8 font-display text-xs tracking-[0.55em] text-verse-gold/70 uppercase opacity-0">
          Always
        </p>

        <h2 className="font-display text-[clamp(3rem,10vw,7rem)] font-light leading-[0.92] tracking-[-0.02em] text-verse-cream">
          <span className="closing-line block opacity-0">{CLOSING_LINE_1}</span>
          <span className="closing-line block italic text-verse-cream-muted opacity-0">
            {CLOSING_LINE_2}
          </span>
          <span className="closing-line block opacity-0">{CLOSING_LINE_3}</span>
        </h2>

        <p className="closing-line mt-12 font-display text-2xl italic tracking-wide text-verse-gold opacity-0">
          {CLOSING_FOOTER}
        </p>

        {/* Countdown */}
        {COUNTDOWN && (
          <div className="closing-line mt-16 opacity-0">
            <p className="mb-5 text-xs tracking-[0.4em] text-verse-cream-faint uppercase">
              {COUNTDOWN.label}
            </p>
            <div className="flex items-start justify-center gap-6 sm:gap-10">
              {[
                { value: countdown.days, label: "Days" },
                { value: countdown.hours, label: "Hrs" },
                { value: countdown.minutes, label: "Min" },
                { value: countdown.seconds, label: "Sec" },
              ].map(({ value, label }) => (
                <div key={label} className="flex flex-col items-center gap-1">
                  <span className="font-display text-[clamp(2rem,6vw,3.5rem)] tabular-nums font-light text-verse-cream">
                    {String(value).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] tracking-[0.35em] text-verse-cream-faint uppercase">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Final mark */}
        <div className="closing-line mt-20 flex justify-center opacity-0">
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-verse-gold/50 to-transparent" />
        </div>
      </motion.div>
    </section>
  );
}
