"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const CLOSING_IMAGE =
  "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=2000&q=85&auto=format&fit=crop";

export function ClosingScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const image = imageRef.current;
    const copy = copyRef.current;
    if (!section || !image || !copy) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        image,
        { scale: 1.15 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );

      gsap.fromTo(
        copy,
        { opacity: 0, y: 48, filter: "blur(10px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: copy,
            start: "top 75%",
          },
        },
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100svh] overflow-hidden"
      aria-label="Closing"
    >
      <div ref={imageRef} className="absolute inset-0">
        <Image
          src={CLOSING_IMAGE}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-verse-void/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-verse-void via-verse-void/40 to-verse-void/80" />
      </div>

      <div className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-6 text-center sm:px-12">
        <div ref={copyRef} className="max-w-3xl opacity-0">
          <p className="text-[10px] tracking-[0.45em] text-verse-gold uppercase">
            Begin
          </p>
          <h2 className="mt-8 font-display text-[clamp(2.5rem,8vw,5.5rem)] leading-[1.05] font-light text-verse-cream">
            Somewhere, your story
            <br />
            <span className="italic text-verse-cream-muted">
              is still unfolding.
            </span>
          </h2>
          <p className="mx-auto mt-8 max-w-md text-sm leading-relaxed text-verse-cream-muted sm:text-base">
            Start with one memory. Let the rest find its way home.
          </p>

          <motion.div
            className="mt-14 flex flex-col items-center gap-6 sm:flex-row sm:justify-center"
            initial={false}
          >
            <Link
              href="/signup"
              className="rounded-full bg-verse-cream px-10 py-4 text-[11px] tracking-[0.25em] text-verse-void uppercase transition-all duration-500 hover:bg-verse-cream/90"
            >
              Begin your world
            </Link>
            <Link
              href="/worlds/our-story"
              className="text-[11px] tracking-[0.25em] text-verse-cream-muted uppercase transition-colors hover:text-verse-cream"
            >
              Walk the demo first
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
