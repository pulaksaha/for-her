"use client";

import { useEffect, useRef, useState } from "react";

// ─── PERSONALISE HERE ────────────────────────────────────────────────────────
// Place background music at /public/audio/background-music.mp3
const MUSIC_SRC = "/audio/background-music.mp3";
// ─────────────────────────────────────────────────────────────────────────────

export function GiftMusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [muted, setMuted] = useState(false); // Start unmuted

  const attemptedRef = useRef(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.22;
    audio.loop = true;

    const playAudio = () => {
      if (attemptedRef.current && !audio.paused) return;
      audio.play().then(() => {
        setMuted(false);
        attemptedRef.current = true;
        window.removeEventListener("click", playAudio);
        window.removeEventListener("scroll", playAudio);
        window.removeEventListener("touchstart", playAudio);
      }).catch(() => {
        setMuted(true);
      });
    };

    // 1. Try playing immediately (might be blocked)
    playAudio();

    // 2. Attach global listeners so the second she touches/scrolls the screen, it plays
    window.addEventListener("click", playAudio);
    window.addEventListener("scroll", playAudio, { passive: true });
    window.addEventListener("touchstart", playAudio, { passive: true });

    return () => {
      audio.pause();
      window.removeEventListener("click", playAudio);
      window.removeEventListener("scroll", playAudio);
      window.removeEventListener("touchstart", playAudio);
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (muted) {
      audio.play().catch(() => {});
      setMuted(false);
    } else {
      audio.pause();
      setMuted(true);
    }
  };

  return (
    <>
      <audio ref={audioRef} src={MUSIC_SRC} loop preload="none" />

      {/* Fixed mute/unmute toggle — bottom right, unobtrusive */}
      <div className="fixed bottom-6 right-6 z-[200]">
        <button
          onClick={toggle}
          id="music-toggle-btn"
          aria-label={muted ? "Play background music" : "Mute background music"}
          className="group flex h-11 w-11 items-center justify-center rounded-full border border-verse-gold/20 bg-verse-void/80 backdrop-blur-sm transition-all duration-300 hover:border-verse-gold/50 hover:bg-verse-void focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-verse-gold"
        >
          {muted ? (
            // Volume off icon
            <svg
              className="h-4 w-4 text-verse-cream-faint group-hover:text-verse-gold transition-colors duration-300"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
              />
            </svg>
          ) : (
            // Volume on icon — with animated pulse dots
            <svg
              className="h-4 w-4 text-verse-gold transition-colors duration-300"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
              />
            </svg>
          )}
        </button>

        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 pointer-events-none">
          <span className="whitespace-nowrap rounded-sm bg-verse-elevated px-2.5 py-1.5 text-[10px] tracking-wider text-verse-cream-faint opacity-0 group-hover:opacity-100 transition-opacity duration-200 border border-verse-gold/10">
            {muted ? "Play music" : "Mute"}
          </span>
        </div>
      </div>
    </>
  );
}
