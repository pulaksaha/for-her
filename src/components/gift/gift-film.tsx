"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FilmGrain } from "@/components/cinematic/film-grain";
import { GiftHero } from "@/components/gift/gift-hero";
import { GiftTimeline } from "@/components/gift/gift-timeline";
import { GiftGallery } from "@/components/gift/gift-gallery";
import { GiftVoiceNote } from "@/components/gift/gift-voice-note";
import { GiftLetter } from "@/components/gift/gift-letter";
import { GiftClosing } from "@/components/gift/gift-closing";
import { GiftMusicPlayer } from "@/components/gift/gift-music-player";
import { BloomingBackground } from "@/components/gift/blooming-background";

gsap.registerPlugin(ScrollTrigger);

export function GiftFilm() {
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const t = setTimeout(refresh, 600);
    return () => {
      window.removeEventListener("load", refresh);
      clearTimeout(t);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <main className="gift-film relative bg-verse-void">
      {/* Blooming cherry blossom background */}
      <BloomingBackground />

      {/* Cinematic grain overlay */}
      <FilmGrain />

      {/* 1. Hero */}
      <GiftHero />

      {/* 2. Timeline */}
      <GiftTimeline />

      {/* 3. Photo Gallery */}
      <GiftGallery />

      {/* 4. Voice Note */}
      <GiftVoiceNote />

      {/* 5. Letter */}
      <GiftLetter />

      {/* 7. Closing */}
      <GiftClosing />

      {/* 6. Background music toggle (fixed, unobtrusive) */}
      <GiftMusicPlayer />
    </main>
  );
}
