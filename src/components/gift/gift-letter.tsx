"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── PERSONALISE HERE ────────────────────────────────────────────────────────
// Write your letter here. Use \n\n for new paragraphs.
const LETTER_LINES = [
  "My love,", // ← Salutation
  "I wanted to write this down somewhere beautiful, because the words I say out loud never come out right. They get tangled up in how much I mean them.",
  // ↓ Replace every paragraph below with your own words
  "[Write your opening paragraph here. Tell her what made you want to create this. Keep it honest — the imperfect sentences are the ones that land.]",
  "[Second paragraph. A specific memory, a feeling, something only she would understand. Maybe the moment you knew. Maybe just a Tuesday.]",
  "[Tell her what you love about her — not in a list, but in the way you actually feel it. The small things. The big things. The everything.]",
  "[What you're looking forward to. What you hope for. The life you're building sentence by sentence, day by day.]",
  "I love you. More than I know how to say, but I tried.",
  "Yours,", // ← Sign-off
  "Your Name", // ← Replace with your name
];
// ─────────────────────────────────────────────────────────────────────────────

export function GiftLetter() {
  const sectionRef = useRef<HTMLElement>(null);
  const envelopeRef = useRef<HTMLButtonElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Reveal the envelope card on scroll
  useEffect(() => {
    const el = envelopeRef.current;
    if (!el) return;
    gsap.set(el, { opacity: 0, y: 40 });
    const ctx = gsap.context(() => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 1.4,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 80%", toggleActions: "play none none none" },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  // Animate letter open
  useEffect(() => {
    const letter = letterRef.current;
    if (!letter) return;

    if (isOpen) {
      gsap.set(letter, { display: "block", opacity: 0, y: 24, scale: 0.98 });
      gsap.to(letter, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.15,
      });
    } else {
      gsap.to(letter, {
        opacity: 0,
        y: 16,
        scale: 0.97,
        duration: 0.6,
        ease: "power2.in",
        onComplete: () => {
          gsap.set(letter, { display: "none" });
        },
      });
    }
  }, [isOpen]);

  return (
    <section
      ref={sectionRef}
      className="py-32 px-6 sm:px-12 lg:px-20 flex flex-col items-center"
      aria-labelledby="letter-heading"
    >
      <p className="mb-4 text-center font-display text-xs tracking-[0.55em] text-verse-gold/70 uppercase">
        A Letter
      </p>
      <h2
        id="letter-heading"
        className="mb-16 font-display text-[clamp(2.5rem,7vw,5rem)] font-light leading-[0.95] text-center text-verse-cream"
      >
        Written for
        <br />
        <span className="italic text-verse-cream-muted">you alone.</span>
      </h2>

      {/* Envelope trigger */}
      {!isOpen && (
        <button
          ref={envelopeRef}
          id="letter-open-btn"
          onClick={() => setIsOpen(true)}
          aria-label="Open the letter"
          className="group relative opacity-0 cursor-pointer"
        >
          {/* Envelope card */}
          <div className="relative flex flex-col items-center justify-center rounded-sm border border-verse-gold/20 bg-verse-elevated px-16 py-14 shadow-[0_32px_80px_rgba(0,0,0,0.55)] transition-all duration-500 group-hover:border-verse-gold/40 group-hover:shadow-[0_40px_100px_rgba(0,0,0,0.65),0_0_80px_rgba(201,169,110,0.06)]">
            {/* Envelope flap lines */}
            <svg
              className="mb-6 h-16 w-20 text-verse-gold/40 transition-all duration-500 group-hover:text-verse-gold/70"
              viewBox="0 0 80 64"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            >
              {/* Envelope body */}
              <rect x="2" y="14" width="76" height="48" rx="2" />
              {/* Envelope flap */}
              <path d="M2 14 L40 42 L78 14" />
              {/* Fold lines */}
              <path d="M2 62 L28 36" strokeOpacity="0.5" />
              <path d="M78 62 L52 36" strokeOpacity="0.5" />
            </svg>
            <p className="font-display text-sm italic tracking-wide text-verse-cream-muted transition-colors duration-300 group-hover:text-verse-cream">
              Tap to open
            </p>
            {/* Wax seal dot */}
            <div className="mt-5 h-5 w-5 rounded-full bg-verse-gold/30 ring-4 ring-verse-gold/10 transition-all duration-500 group-hover:bg-verse-gold/55 group-hover:ring-verse-gold/20" />
          </div>
        </button>
      )}

      {/* The Letter — hidden until opened */}
      <div
        ref={letterRef}
        className="hidden w-full max-w-2xl"
        aria-live="polite"
      >
        {/* Close button */}
        <div className="mb-8 flex justify-center">
          <button
            onClick={() => setIsOpen(false)}
            id="letter-close-btn"
            aria-label="Close the letter"
            className="text-[11px] tracking-[0.4em] text-verse-cream-faint uppercase hover:text-verse-cream-muted transition-colors"
          >
            ✕ Close
          </button>
        </div>

        {/* Letter paper */}
        <article className="relative rounded-sm border border-verse-gold/10 bg-[#100d09] px-8 py-12 sm:px-14 sm:py-16 shadow-[0_40px_120px_rgba(0,0,0,0.6)]">
          {/* Decorative top rule */}
          <div className="mx-auto mb-10 h-px w-16 bg-verse-gold/30" />

          <div className="space-y-6">
            {LETTER_LINES.map((line, i) => {
              if (i === 0) {
                // Salutation
                return (
                  <p key={i} className="font-display text-2xl italic text-verse-cream">
                    {line}
                  </p>
                );
              }
              if (i === LETTER_LINES.length - 2) {
                // Sign-off
                return (
                  <p key={i} className="mt-10 font-display text-lg italic text-verse-cream-muted">
                    {line}
                  </p>
                );
              }
              if (i === LETTER_LINES.length - 1) {
                // Name
                return (
                  <p key={i} className="font-display text-xl text-verse-gold">
                    {line}
                  </p>
                );
              }
              return (
                <p key={i} className="font-display text-lg leading-[1.8] text-verse-cream-muted">
                  {line}
                </p>
              );
            })}
          </div>

          {/* Decorative bottom rule */}
          <div className="mx-auto mt-10 h-px w-16 bg-verse-gold/30" />
        </article>
      </div>
    </section>
  );
}
