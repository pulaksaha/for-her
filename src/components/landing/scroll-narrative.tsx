"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const BEATS = [
  {
    text: "You already know which moments matter.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1400&q=80&auto=format&fit=crop",
  },
  {
    text: "They were never meant for a feed.",
    image:
      "https://images.unsplash.com/photo-1494783367193-149034c05e8f?w=1400&q=80&auto=format&fit=crop",
  },
  {
    text: "Only for the people who were there.",
    image:
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=1400&q=80&auto=format&fit=crop",
  },
];

export function ScrollNarrative() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    const textEl = textRef.current;
    const imageEl = imageRef.current;
    if (!section || !pin || !textEl || !imageEl) return;

    const lines = textEl.querySelectorAll("[data-beat]");
    const images = imageEl.querySelectorAll("[data-frame]");

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=300%",
          pin: pin,
          scrub: 1.2,
          anticipatePin: 1,
        },
      });

      lines.forEach((line, i) => {
        if (i === 0) {
          gsap.set(line, { opacity: 1, y: 0, filter: "blur(0px)" });
          gsap.set(images[i], { opacity: 1, scale: 1 });
          return;
        }

        tl.to(
          lines[i - 1],
          {
            opacity: 0,
            y: -24,
            filter: "blur(6px)",
            duration: 1,
          },
          i,
        )
          .to(
            images[i - 1],
            { opacity: 0, scale: 1.06, duration: 1 },
            i,
          )
          .fromTo(
            line,
            { opacity: 0, y: 32, filter: "blur(10px)" },
            { opacity: 1, y: 0, filter: "blur(0px)", duration: 1 },
            i + 0.15,
          )
          .fromTo(
            images[i],
            { opacity: 0, scale: 1.08 },
            { opacity: 1, scale: 1, duration: 1.2 },
            i + 0.15,
          );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="story"
      className="relative bg-verse-void"
      aria-label="Story"
    >
      <div ref={pinRef} className="relative h-[100svh] w-full overflow-hidden">
        <div
          ref={imageRef}
          className="absolute inset-0"
          aria-hidden
        >
          {BEATS.map((beat, i) => (
            <div
              key={beat.text}
              data-frame
              className="absolute inset-0 opacity-0"
              style={{ opacity: i === 0 ? 1 : 0 }}
            >
              <Image
                src={beat.image}
                alt=""
                fill
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-verse-void/65" />
            </div>
          ))}
        </div>

        <div className="relative z-10 flex h-full items-center px-6 sm:px-12 lg:px-20">
          <div ref={textRef} className="relative max-w-4xl min-h-[12rem] sm:min-h-[14rem]">
            {BEATS.map((beat, i) => (
              <p
                key={beat.text}
                data-beat
                className="absolute inset-x-0 top-0 font-display text-[clamp(2rem,6vw,4.5rem)] leading-[1.15] font-light text-verse-cream"
                style={{ opacity: i === 0 ? 1 : 0 }}
              >
                {beat.text}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
