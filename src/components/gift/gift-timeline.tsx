"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── PERSONALISE HERE ────────────────────────────────────────────────────────
// Each entry: date, title, caption (replace placeholder text), and an optional
// photo at /public/images/timeline-N.jpg (N = 1, 2, 3 …)
const TIMELINE_EVENTS = [
  {
    date: "February 22, 2026", // ← Replace with your date
    title: "The Beginning", // ← Replace with milestone title
    caption:
      "Kabhi kabhi kuch log zindagi mein achanak nahi aate, woh wapas aate hain. Aur jab aate hain, toh aisa lagta hai jaise waqt ne ek adhuri kahani ko phir se likhne ka mauka diya ho.Tumse milna bas ek mulaqat nahi thi. Woh ek ehsaas tha jo dheere dheere meri har muskurahat, har soch aur har yaad ka hissa ban gaya.Aur tab samajh aaya, kuch logon se milne mein der ho sakti hai, par unka asar dil par hamesha ke liye reh jaata hai. 🤍", // ← Your words
    image: "/images/timeline-1.jpg",
    side: "right" as const,
  },
  {
    date: "March 1, 2026", // ← Replace
    title: "Our First Date", // ← Replace
    caption:
      "Kaafi intezaar aur kaafi mushkilon ke baad yeh date possible hui thi.Humare paas zyada waqt nahi tha, par jitna bhi tha, mere liye bahut tha. Aaj bhi jab us din ke baare mein sochta hoon, toh lagta hai kaash thoda aur waqt mil jaata. Phir bhi, woh kuch ghante meri sabse pasandida yaadon mein se ek hain. 🤍", // ← Your words
    image: "/images/timeline-2.jpg",
    side: "left" as const,
  },
  {
    date: "June 20, 2022", // ← Replace
    title: "The Trip That Changed Everything", // ← Replace
    caption:
      "I still remember that ride like it was yesterday. The roads, the conversations, the silence between us—everything felt right because you were there.But what stayed with me the most was the last hug. For a few seconds, it felt like the whole world stopped. The warmth, the comfort, the feeling of being close to you—it's something I could never ask for again, yet never forget.Some memories fade with time, but that goodbye and that hug will always stay with me. 😭🤍", // ← Your words
    image: "/images/timeline-3.jpg",
    side: "right" as const,
  },

];
// ─────────────────────────────────────────────────────────────────────────────

function TimelineEntry({
  date,
  title,
  caption,
  image,
  side,
  index,
}: (typeof TIMELINE_EVENTS)[0] & { index: number }) {
  const entryRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const entry = entryRef.current;
    const img = imgRef.current;
    const text = textRef.current;
    const dot = dotRef.current;
    if (!entry || !img || !text || !dot) return;

    const xImg = side === "right" ? -40 : 40;
    const xText = side === "right" ? 40 : -40;

    gsap.set(img, { opacity: 0, x: xImg });
    gsap.set(text, { opacity: 0, x: xText });
    gsap.set(dot, { scale: 0, opacity: 0 });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: entry,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
      tl.to(dot, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(2)" })
        .to(img, { opacity: 1, x: 0, duration: 1.2, ease: "power3.out" }, "-=0.2")
        .to(text, { opacity: 1, x: 0, duration: 1.2, ease: "power3.out" }, "-=0.9");
    }, entry);

    return () => ctx.revert();
  }, [side]);

  const isRight = side === "right";

  return (
    <div ref={entryRef} className="relative grid grid-cols-1 gap-8 md:grid-cols-[1fr_auto_1fr] md:gap-0 items-center">
      {/* Left column */}
      <div className={`${isRight ? "md:order-1" : "md:order-3"} flex ${isRight ? "md:justify-end md:pr-16" : "md:justify-start md:pl-16"}`}>
        {isRight ? (
          // Image on left when "right" side entry
          <PhotoFrame ref={imgRef} image={image} title={title} index={index} />
        ) : (
          // Text on left when "left" side entry
          <div ref={textRef} className="max-w-sm text-right">
            <TextBlock date={date} title={title} caption={caption} />
          </div>
        )}
      </div>

      {/* Centre dot + spine */}
      <div className="md:order-2 flex flex-col items-center self-stretch hidden md:flex">
        <div ref={dotRef} className="relative z-10 scale-0 opacity-0">
          <div className="h-4 w-4 rounded-full border-2 border-verse-gold bg-verse-void ring-4 ring-verse-gold/20" />
        </div>
      </div>

      {/* Right column */}
      <div className={`${isRight ? "md:order-3" : "md:order-1"} flex ${isRight ? "md:justify-start md:pl-16" : "md:justify-end md:pr-16"}`}>
        {isRight ? (
          <div ref={textRef} className="max-w-sm">
            <TextBlock date={date} title={title} caption={caption} />
          </div>
        ) : (
          <PhotoFrame ref={imgRef} image={image} title={title} index={index} />
        )}
      </div>

      {/* Mobile-only dot (always shown) */}
      <div ref={dotRef} className="absolute left-0 top-0 flex h-4 w-4 items-center md:hidden scale-0 opacity-0">
        <div className="h-3 w-3 rounded-full border border-verse-gold bg-verse-void ring-2 ring-verse-gold/20" />
      </div>
    </div>
  );
}

import { forwardRef } from "react";

const PhotoFrame = forwardRef<
  HTMLDivElement,
  { image: string; title: string; index: number }
>(function PhotoFrame({ image, title, index }, ref) {
  return (
    <div
      ref={ref}
      className="group relative aspect-[4/5] w-full max-w-[280px] overflow-hidden rounded-sm opacity-0"
    >
      {/* Warm gradient placeholder */}
      <div
        className="absolute inset-0 transition-transform duration-[3000ms] ease-out group-hover:scale-110"
        style={{
          background: `linear-gradient(${120 + index * 30}deg, #1a1208, #2d1f0e, #0e0c0a)`,
        }}
      />
      {/* Actual photo — drop image into /public/images/ */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-[3000ms] ease-out group-hover:scale-110"
        style={{ backgroundImage: `url('${image}')` }}
        role="img"
        aria-label={title}
      />
      {/* Subtle vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-verse-void/60 via-transparent to-transparent" />
    </div>
  );
});

function TextBlock({
  date,
  title,
  caption,
}: {
  date: string;
  title: string;
  caption: string;
}) {
  return (
    <div>
      <p className="mb-3 font-display text-xs tracking-[0.4em] text-verse-gold uppercase">
        {date}
      </p>
      <h3 className="font-display text-[clamp(1.5rem,4vw,2.25rem)] font-light leading-tight text-verse-cream">
        {title}
      </h3>
      <p className="mt-4 text-sm leading-relaxed text-verse-cream-muted">{caption}</p>
    </div>
  );
}

export function GiftTimeline() {
  const spineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const spine = spineRef.current;
    if (!spine) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        spine,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: spine,
            start: "top 80%",
            end: "bottom 20%",
            scrub: true,
          },
        }
      );
    }, spine);

    return () => ctx.revert();
  }, []);

  return (
    <section
      className="relative py-32 px-6 sm:px-12 lg:px-20"
      aria-labelledby="timeline-heading"
    >
      {/* Section label */}
      <div className="mb-20 text-center">
        <p className="mb-4 font-display text-xs tracking-[0.55em] text-verse-gold/70 uppercase">
          Our Story
        </p>
        <h2
          id="timeline-heading"
          className="font-display text-[clamp(2.5rem,7vw,5rem)] font-light leading-[0.95] text-verse-cream"
        >
          The moments that
          <br />
          <span className="italic text-verse-cream-muted">made us.</span>
        </h2>
      </div>

      {/* Vertical spine */}
      <div className="relative mx-auto max-w-4xl">
        <div
          ref={spineRef}
          className="absolute left-1/2 top-0 bottom-0 w-px origin-top -translate-x-1/2 bg-gradient-to-b from-transparent via-verse-gold/30 to-transparent hidden md:block"
          style={{ transformOrigin: "top center" }}
        />

        {/* Timeline entries */}
        <div className="flex flex-col gap-20 md:gap-28">
          {TIMELINE_EVENTS.map((event, i) => (
            <TimelineEntry key={event.date + i} {...event} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
