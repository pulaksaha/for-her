"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";

// ─── PERSONALISE HERE ────────────────────────────────────────────────────────
const YOUR_NAME = "Pulak ";              // ← Replace with your name
const HER_NAME = "Pallabi Thakuri";         // ← Her name
const TOGETHER_SINCE = "October 5, 2025";       // ← Your anniversary date
const HERO_TAGLINE = "Our journey has just begun, aaur bhi bahut sare memories create karne hai hamein.";
const HERO_IMAGE = "/images/hero-bg.jpg";
// ─────────────────────────────────────────────────────────────────────────────

// ─── Petal SVG shapes ────────────────────────────────────────────────────────
const PETALS: Array<{
  left: string; dur: string; delay: string; size: number;
  color: string; cls: string; opacity: number;
}> = [
    { left: "8%", dur: "14s", delay: "0s", size: 18, color: "#f5c2d5", cls: "petal-1", opacity: 0.7 },
    { left: "18%", dur: "11s", delay: "3s", size: 12, color: "#e88aac", cls: "petal-2", opacity: 0.6 },
    { left: "28%", dur: "16s", delay: "1.5s", size: 22, color: "#f5c2d5", cls: "petal-3", opacity: 0.75 },
    { left: "38%", dur: "13s", delay: "5s", size: 14, color: "#d46090", cls: "petal-1", opacity: 0.55 },
    { left: "50%", dur: "18s", delay: "0.8s", size: 26, color: "#f0afc8", cls: "petal-2", opacity: 0.65 },
    { left: "60%", dur: "10s", delay: "4s", size: 10, color: "#c890c8", cls: "petal-3", opacity: 0.5 },
    { left: "70%", dur: "15s", delay: "2s", size: 20, color: "#f5c2d5", cls: "petal-1", opacity: 0.7 },
    { left: "80%", dur: "12s", delay: "6s", size: 16, color: "#e88aac", cls: "petal-2", opacity: 0.6 },
    { left: "90%", dur: "17s", delay: "1s", size: 24, color: "#c890c8", cls: "petal-3", opacity: 0.55 },
    { left: "14%", dur: "9s", delay: "7s", size: 11, color: "#d46090", cls: "petal-1", opacity: 0.65 },
    { left: "44%", dur: "13s", delay: "2.5s", size: 19, color: "#f5c2d5", cls: "petal-2", opacity: 0.7 },
    { left: "65%", dur: "11s", delay: "8s", size: 15, color: "#e88aac", cls: "petal-3", opacity: 0.6 },
    { left: "76%", dur: "16s", delay: "3.5s", size: 21, color: "#f0afc8", cls: "petal-1", opacity: 0.55 },
    { left: "55%", dur: "14s", delay: "9s", size: 13, color: "#c890c8", cls: "petal-2", opacity: 0.5 },
    { left: "32%", dur: "12s", delay: "0.3s", size: 17, color: "#f5c2d5", cls: "petal-3", opacity: 0.7 },
  ];

// ─── Single petal SVG ─────────────────────────────────────────────────────────
function Petal({ size, color }: { size: number; color: string }) {
  return (
    <svg
      width={size}
      height={size * 1.5}
      viewBox="0 0 30 45"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15 44 C 2 35, -4 18, 15 2 C 34 18, 28 35, 15 44 Z"
        fill={color}
        opacity="0.9"
      />
      <path
        d="M15 44 C 15 30, 15 14, 15 2"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="0.6"
        fill="none"
      />
    </svg>
  );
}

export function GiftHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLParagraphElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.04, 1.16]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], [0, 60]);

  useEffect(() => {
    const img = imgRef.current;
    const date = dateRef.current;
    const name = nameRef.current;
    const tagline = taglineRef.current;
    const scroll = scrollRef.current;
    const photo = photoRef.current;
    if (!img || !date || !name || !tagline || !scroll || !photo) return;

    gsap.set([date, name, tagline], { opacity: 0, y: 30, filter: "blur(10px)" });
    gsap.set(img, { opacity: 0, scale: 1.14 });
    gsap.set(scroll, { opacity: 0 });
    gsap.set(photo, { opacity: 0, x: 40, rotation: 6 });

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.to(img, { opacity: 1, duration: 2.8, ease: "power2.inOut" })
      .to(img, { scale: 1.04, duration: 18, ease: "power1.inOut" }, 0.4)
      .to(date, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.6 }, 1.6)
      .to(name, { opacity: 1, y: 0, filter: "blur(0px)", duration: 2.0 }, 2.0)
      .to(photo, { opacity: 1, x: 0, rotation: 2, duration: 1.8, ease: "power2.out" }, 2.4)
      .to(tagline, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.6 }, 2.8)
      .to(scroll, { opacity: 1, duration: 1.2 }, 3.8);

    return () => { tl.kill(); };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-[100svh] w-full overflow-hidden"
      aria-label="Opening"
    >
      {/* ── Background ─────────────────────────────────────────────── */}
      <motion.div style={{ scale: imageScale }} className="absolute inset-0 will-change-transform">
        <div
          ref={imgRef}
          className="absolute inset-0 opacity-0"
          style={{
            background:
              "linear-gradient(135deg, #140810 0%, #220f1e 35%, #1a0a14 70%, #0a0608 100%)",
          }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
            role="img"
            aria-label={`${YOUR_NAME} and ${HER_NAME}`}
          />
          {/* Darkening layers with rose tint */}
          <div className="absolute inset-0" style={{ background: "rgba(10,4,8,0.58)" }} />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0608]/30 via-transparent to-[#0a0608]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0608]/55 via-transparent to-transparent" />
        </div>
      </motion.div>

      {/* ── Ambient rose glow ──────────────────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-0 z-[2] rose-glow-ambient"
        style={{
          background:
            "radial-gradient(ellipse 90% 60% at 50% 110%, rgba(220,96,144,0.18), transparent 65%)",
        }}
      />
      {/* Top blush halo */}
      <div
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{
          background:
            "radial-gradient(ellipse 70% 40% at 50% -10%, rgba(200,144,200,0.10), transparent 60%)",
        }}
      />

      {/* ── Floating petals ────────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 z-[3] overflow-hidden">
        {PETALS.map((p, i) => (
          <div
            key={i}
            className={`petal ${p.cls}`}
            style={{
              left: p.left,
              opacity: p.opacity,
              "--dur": p.dur,
              "--delay": p.delay,
            } as React.CSSProperties}
          >
            <Petal size={p.size} color={p.color} />
          </div>
        ))}
      </div>

      {/* ── Text content ───────────────────────────────────────────── */}
      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="relative z-10 flex h-full flex-col justify-between px-4 pb-12 pt-24 sm:px-10 lg:px-20"
      >
        {/* Date */}
        <p
          ref={dateRef}
          className="font-display text-xs tracking-[0.55em] uppercase opacity-0"
          style={{ color: "var(--petal-blush)", opacity: 0 }}
        >
          {TOGETHER_SINCE}
        </p>

        <div className="flex flex-col gap-8 w-full md:flex-row md:items-center md:justify-between">
          {/* Names */}
          <div className="max-w-3xl">
            <h1
              ref={nameRef}
              className="font-display text-[clamp(2.8rem,11vw,8rem)] leading-[0.88] font-light tracking-[-0.025em] text-verse-cream opacity-0"
            >
              <span className="italic" style={{ color: "var(--petal-soft)" }}>
                {HER_NAME}
              </span>
            </h1>
            <p
              ref={taglineRef}
              className="mt-8 max-w-lg text-[clamp(0.9rem,2vw,1.1rem)] leading-relaxed tracking-wide opacity-0"
              style={{ color: "var(--verse-cream-muted)" }}
            >
              {HERO_TAGLINE}
            </p>
          </div>

          {/* Childhood Photo */}
          <div 
            ref={photoRef} 
            className="relative w-44 h-60 sm:w-56 sm:h-72 md:w-72 md:h-[22rem] shrink-0 rounded-sm overflow-hidden border-4 border-[#1a0a14] shadow-[0_20px_60px_rgba(0,0,0,0.6)] opacity-0 transform rotate-2 self-start md:self-auto md:mr-16"
          >
            <div className="absolute inset-0 bg-verse-gold/5 animate-pulse" />
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] hover:scale-105"
              style={{ backgroundImage: `url('/images/childhood-photo.jpg')` }}
              role="img"
              aria-label="Childhood photo of us hugging"
            />
            <div className="absolute inset-0 ring-1 ring-inset ring-verse-gold/20" />
            <div className="absolute -bottom-3 right-4 bg-[#1a0a14]/90 backdrop-blur-sm px-4 py-2 font-display text-[11px] tracking-widest text-verse-cream-faint transform -rotate-3 rounded-sm border border-verse-gold/20 shadow-lg">
              US
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div ref={scrollRef} className="flex flex-col items-start gap-3 opacity-0">
          <span
            className="text-[10px] tracking-[0.4em] uppercase"
            style={{ color: "var(--verse-cream-faint)" }}
          >
            Scroll to begin
          </span>
          <span
            className="block h-14 w-px origin-top animate-pulse"
            style={{
              background:
                "linear-gradient(to bottom, var(--petal-soft), transparent)",
            }}
          />
        </div>
      </motion.div>
    </section>
  );
}
