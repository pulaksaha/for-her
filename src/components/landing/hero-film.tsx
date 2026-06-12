"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=2400&q=85&auto=format&fit=crop";

export function HeroFilm() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const lineRef = useRef<HTMLParagraphElement>(null);
  const markRef = useRef<HTMLParagraphElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.18]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], [0, 80]);

  useEffect(() => {
    const imageWrap = imageWrapRef.current;
    const title = titleRef.current;
    const line = lineRef.current;
    const mark = markRef.current;
    if (!imageWrap || !title || !line || !mark) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    gsap.set([title, line], { opacity: 0, y: 24, filter: "blur(8px)" });
    gsap.set(mark, { opacity: 0 });
    gsap.set(imageWrap, { scale: 1.12, opacity: 0 });

    tl.to(imageWrap, { opacity: 1, duration: 2.2, ease: "power2.inOut" })
      .to(imageWrap, { scale: 1, duration: 14, ease: "power1.inOut" }, 0.4)
      .to(mark, { opacity: 1, duration: 1.4 }, 1.2)
      .to(
        title,
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.8 },
        1.8,
      )
      .to(
        line,
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.4 },
        2.4,
      );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-[100svh] w-full overflow-hidden"
      aria-label="Introduction"
    >
      <motion.div
        style={{ scale: imageScale }}
        className="absolute inset-0 will-change-transform"
      >
        <div ref={imageWrapRef} className="absolute inset-0 opacity-0">
          <Image
            src={HERO_IMAGE}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-verse-void/50" />
          <div className="absolute inset-0 bg-gradient-to-b from-verse-void/30 via-transparent to-verse-void" />
          <div className="absolute inset-0 bg-gradient-to-r from-verse-void/40 via-transparent to-transparent" />
        </div>
      </motion.div>

      <div className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(ellipse_70%_60%_at_50%_100%,rgba(196,165,116,0.07),transparent_65%)]" />

      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="relative z-10 flex h-full flex-col justify-between px-6 pb-16 pt-28 sm:px-12 lg:px-20"
      >
        <p
          ref={markRef}
          className="font-display text-sm tracking-[0.45em] text-verse-cream/70 uppercase opacity-0"
        >
          Verse
        </p>

        <div className="max-w-5xl">
          <h1
            ref={titleRef}
            className="font-display text-[clamp(3.25rem,11vw,7.5rem)] leading-[0.95] font-light tracking-[-0.02em] text-verse-cream opacity-0"
          >
            Hold what
            <br />
            <span className="italic text-verse-cream-muted">mattered.</span>
          </h1>
          <p
            ref={lineRef}
            className="mt-10 max-w-md text-[15px] leading-relaxed tracking-wide text-verse-cream-muted opacity-0 sm:text-base"
          >
            A private cinema for the life you&apos;re still living.
          </p>
        </div>

        <div className="flex items-end justify-between">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.2, duration: 1.2 }}
            className="flex flex-col items-start gap-3"
          >
            <span className="text-[10px] tracking-[0.35em] text-verse-cream-faint uppercase">
              Scroll
            </span>
            <span className="block h-12 w-px origin-top bg-gradient-to-b from-verse-gold/60 to-transparent animate-pulse" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
