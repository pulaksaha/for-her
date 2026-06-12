"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── PERSONALISE HERE ────────────────────────────────────────────────────────
// Place your voice note at /public/audio/voice-note.mp3
const VOICE_NOTE_SRC = "/audio/voice-note.mp3";
const VOICE_NOTE_LABEL = "A message for you"; // ← Replace if you like
const VOICE_NOTE_HINT = "Put your headphones in."; // ← Replace
// ─────────────────────────────────────────────────────────────────────────────

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// Fake waveform bars — replace with actual WaveSurfer integration if desired
const BAR_COUNT = 48;
const BARS = Array.from({ length: BAR_COUNT }, (_, i) => {
  // Pseudo-random heights seeded by index for a natural look
  const h = 0.2 + 0.8 * Math.abs(Math.sin(i * 0.7 + Math.cos(i * 0.3)));
  return h;
});

export function GiftVoiceNote() {
  const sectionRef = useRef<HTMLElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0–1
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const animFrameRef = useRef<number>(0);

  // Reveal animation
  const contentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = contentRef.current;
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

  const tick = useCallback(function tickFn() {
    const audio = audioRef.current;
    if (!audio) return;
    setCurrentTime(audio.currentTime);
    setProgress(audio.duration ? audio.currentTime / audio.duration : 0);
    if (!audio.paused) {
      animFrameRef.current = requestAnimationFrame(tickFn);
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoaded = () => setDuration(audio.duration);
    const onEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    };

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("ended", onEnded);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setHasInteracted(true);
    if (audio.paused) {
      audio.play().then(() => {
        setIsPlaying(true);
        animFrameRef.current = requestAnimationFrame(tick);
      }).catch(() => {});
    } else {
      audio.pause();
      setIsPlaying(false);
      cancelAnimationFrame(animFrameRef.current);
    }
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    audio.currentTime = ratio * audio.duration;
    setProgress(ratio);
  };

  const activeBarCount = Math.round(progress * BAR_COUNT);

  return (
    <section
      ref={sectionRef}
      className="py-32 px-6 sm:px-12 lg:px-20 flex flex-col items-center"
      aria-label="Voice note"
    >
      <div ref={contentRef} className="w-full max-w-xl opacity-0">
        {/* Label */}
        <p className="mb-3 text-center font-display text-xs tracking-[0.55em] text-verse-gold/70 uppercase">
          {VOICE_NOTE_LABEL}
        </p>
        <p className="mb-12 text-center text-sm italic text-verse-cream-muted">{VOICE_NOTE_HINT}</p>

        {/* Player card */}
        <div className="rounded-sm border border-verse-gold/10 bg-verse-elevated p-8 shadow-[0_32px_80px_rgba(0,0,0,0.5)]">
          {/* Waveform */}
          <div
            className="mb-6 flex h-16 cursor-pointer items-end gap-[2px]"
            onClick={seek}
            role="slider"
            aria-label="Seek audio"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress * 100)}
            tabIndex={0}
            onKeyDown={(e) => {
              const audio = audioRef.current;
              if (!audio) return;
              if (e.key === "ArrowRight") audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
              if (e.key === "ArrowLeft") audio.currentTime = Math.max(0, audio.currentTime - 5);
            }}
          >
            {BARS.map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-full transition-colors duration-100"
                style={{
                  height: `${Math.round(h * 100)}%`,
                  backgroundColor:
                    i < activeBarCount
                      ? "rgba(201, 169, 110, 0.85)"
                      : "rgba(245, 240, 232, 0.12)",
                }}
              />
            ))}
          </div>

          {/* Controls row */}
          <div className="flex items-center justify-between gap-4">
            {/* Play/Pause button */}
            <button
              onClick={togglePlay}
              id="voice-note-play-btn"
              aria-label={isPlaying ? "Pause voice note" : "Play voice note"}
              className="group flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-verse-gold/30 bg-verse-gold/10 transition-all duration-300 hover:bg-verse-gold/25 hover:border-verse-gold/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-verse-gold"
            >
              {isPlaying ? (
                // Pause icon
                <svg className="h-5 w-5 text-verse-gold" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                // Play icon
                <svg className="h-5 w-5 translate-x-0.5 text-verse-gold" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5 3.868v16.264c0 1.036 1.152 1.638 2.015 1.07l12.928-8.132a1.25 1.25 0 0 0 0-2.14L7.015 2.797C6.152 2.23 5 2.832 5 3.868z" />
                </svg>
              )}
            </button>

            {/* Time display */}
            <div className="flex items-center gap-1 text-[11px] tabular-nums text-verse-cream-faint">
              <span>{formatTime(currentTime)}</span>
              <span>/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {!hasInteracted && (
            <p className="mt-5 text-center text-[11px] tracking-wide text-verse-cream-faint">
              Press play when you&apos;re ready.
            </p>
          )}
        </div>
      </div>

      {/* Hidden audio element */}
      <audio ref={audioRef} src={VOICE_NOTE_SRC} preload="metadata" />
    </section>
  );
}
