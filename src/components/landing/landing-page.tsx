"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HeroFilm } from "@/components/landing/hero-film";
import { ScrollNarrative } from "@/components/landing/scroll-narrative";
import { MemoryRail } from "@/components/landing/memory-rail";
import { RecapScene } from "@/components/landing/recap-scene";
import { VoiceScene } from "@/components/landing/voice-scene";
import { TimelineScene } from "@/components/landing/timeline-scene";
import { PricingScene } from "@/components/landing/pricing-scene";
import { ClosingScene } from "@/components/landing/closing-scene";
import { LandingFooter } from "@/components/landing/landing-footer";

gsap.registerPlugin(ScrollTrigger);

export function LandingPage() {
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const t = setTimeout(refresh, 500);

    return () => {
      window.removeEventListener("load", refresh);
      clearTimeout(t);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <main className="landing-film bg-verse-void selection:bg-verse-gold/20">
      <HeroFilm />
      <ScrollNarrative />
      <MemoryRail />
      <RecapScene />
      <VoiceScene />
      <TimelineScene />
      <PricingScene />
      <ClosingScene />
      <LandingFooter />
    </main>
  );
}
