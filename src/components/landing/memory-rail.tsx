"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { demoMemories } from "@/lib/data/demo";

gsap.registerPlugin(ScrollTrigger);

const RAIL_ITEMS = [
  ...demoMemories.map((m) => ({
    title: m.title,
    place: m.location,
    url: m.media[0]?.url ?? "",
    mood: m.mood,
  })),
  {
    title: "Late summer light",
    place: "Provence",
    url: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=900&q=80&auto=format&fit=crop",
    mood: "nostalgic",
  },
  {
    title: "Before the vows",
    place: "Tuscany",
    url: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=900&q=80&auto=format&fit=crop",
    mood: "tender",
  },
];

export function MemoryRail() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const header = headerRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      const scrollWidth = track.scrollWidth - window.innerWidth;

      gsap.fromTo(
        header,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          scrollTrigger: {
            trigger: header,
            start: "top 88%",
          },
        },
      );

      gsap.to(track, {
        x: -scrollWidth,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${scrollWidth + window.innerHeight * 0.5}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="memories"
      className="relative overflow-hidden bg-verse-night"
      aria-label="Memories"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_0%_50%,rgba(196,165,116,0.06),transparent)]" />

      <div
        ref={headerRef}
        className="pointer-events-none absolute top-24 left-6 z-10 sm:left-12 lg:left-20"
      >
        <p className="text-[10px] tracking-[0.4em] text-verse-gold uppercase">
          Your archive
        </p>
        <h2 className="mt-4 max-w-xs font-display text-4xl font-light text-verse-cream sm:text-5xl">
          Moments, not albums
        </h2>
      </div>

      <div className="flex h-[100svh] items-center pt-32">
        <div
          ref={trackRef}
          className="flex gap-6 px-6 will-change-transform sm:gap-8 sm:px-12 lg:px-20"
        >
          {RAIL_ITEMS.map((item, i) => (
            <MemoryRailCard key={`${item.title}-${i}`} item={item} index={i} />
          ))}
          <div className="w-[20vw] shrink-0" aria-hidden />
        </div>
      </div>
    </section>
  );
}

function MemoryRailCard({
  item,
  index,
}: {
  item: (typeof RAIL_ITEMS)[number];
  index: number;
}) {
  return (
    <motion.article
      className="group relative shrink-0 w-[72vw] sm:w-[42vw] md:w-[32vw] lg:w-[26vw]"
      whileHover={{ y: -8 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-verse-surface shadow-verse-soft">
        <Image
          src={item.url}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.04]"
          sizes="(max-width: 768px) 72vw, 32vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-verse-void via-verse-void/20 to-transparent opacity-80 transition-opacity duration-700 group-hover:opacity-90" />
        <div className="absolute inset-0 ring-1 ring-inset ring-verse-cream/5" />

        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
          <p className="text-[10px] tracking-[0.3em] text-verse-gold/90 uppercase">
            {item.mood}
          </p>
          <h3 className="mt-3 font-display text-2xl font-light text-verse-cream sm:text-3xl">
            {item.title}
          </h3>
          {item.place && (
            <p className="mt-2 text-sm text-verse-cream-faint">{item.place}</p>
          )}
        </div>
      </div>
      <p className="mt-4 text-[11px] tracking-[0.2em] text-verse-cream-faint tabular-nums">
        {String(index + 1).padStart(2, "0")} / {String(RAIL_ITEMS.length).padStart(2, "0")}
      </p>
    </motion.article>
  );
}
