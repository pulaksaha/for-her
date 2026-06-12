"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── PERSONALISE HERE ────────────────────────────────────────────────────────
// Write your letter here. Use \n\n for new paragraphs.
const LETTER_LINES = [
  "My love,", // ← Salutation
  "Mujhe nahi pata ki yeh letter kahan se shuru karun, kyunki tumhare baare mein likhne baithta hoon toh har yaad ek saath saamne aa jaati hai.",
  // ↓ Replace every paragraph below with your own words
  "Kabhi socha nahi tha ki saalon baad tum meri zindagi ka itna bada hissa ban jaogi. Jo baat ek simple mulaqat se shuru hui thi, woh dheere dheere meri aadat ban gayi. Tumse baat karna, tumhara intezaar karna, tumhari khushi mein khush hona — sab kuch itna naturally hone laga ki mujhe pata hi nahi chala kab tum meri duniya ban gayi.Aaj bhi hamari pehli date yaad hai. Itni mushkilon ke baad hum mil paaye the, aur waqt bhi bahut kam tha. Lekin us chhote se waqt ne mujhe itni khushi di thi jitni shayad main lafzon mein kabhi bata nahi paunga. Kaash us din waqt thoda aur ruk jaata.",
  "Aur phir woh ride... woh safar aaj bhi meri sabse pasandida yaadon mein se ek hai. Mujhe raaste yaad nahi, mujhe bas tum yaad ho. Aur sabse zyada yaad hai woh aakhri hug. Shayad tumhare liye woh sirf ek hug tha, lekin mere liye usmein ek sukoon tha jo maine pehle kabhi mehsoos nahi kiya tha. Aaj bhi jab us pal ko yaad karta hoon, dil bhar aata hai.",
  "Tumhari wajah se maine bahut saari chhoti chhoti cheezon ko pyaar karna seekha. Random conversations, late replies ka intezaar, achanak aayi hui smile, aur woh moments jo shayad kisi aur ke liye normal honge, par mere liye bahut khaas the.Pata nahi aaj hum kahan khade hain. Shayad zindagi ne hume alag raaston par laakar khada kar diya hai. Lekin ek baat hamesha sach rahegi — tum meri zindagi ka woh hissa ho jise main kabhi bhool nahi paunga. Kuch log saath na rehkar bhi dil mein hamesha rehte hain, aur tum unmein se ho.",
  "Agar mujhe dobara sab kuch jeene ka mauka mile, toh main har woh pal phir se jeena chahunga — tumse milna, tumhare saath woh chhota sa waqt bitana, woh ride, aur woh aakhri hug.Thank you for being one of the most beautiful parts of my life.",
  "Always Yours,", // ← Sign-off
  "Pulak🤍🥹", // ← Replace with your name
];
// ─────────────────────────────────────────────────────────────────────────────

export function GiftLetter() {
  const sectionRef = useRef<HTMLElement>(null);
  const envelopeRef = useRef<HTMLButtonElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Reveal the envelope card on scroll
  useEffect(() => {
    const el = envelopeRef.current;
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

  // Animate letter open
  useEffect(() => {
    const letter = letterRef.current;
    if (!letter) return;

    if (isOpen) {
      gsap.set(letter, { display: "block", opacity: 0, y: 24, scale: 0.98 });
      gsap.to(letter, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.15,
      });
    } else {
      gsap.to(letter, {
        opacity: 0,
        y: 16,
        scale: 0.97,
        duration: 0.6,
        ease: "power2.in",
        onComplete: () => {
          gsap.set(letter, { display: "none" });
        },
      });
    }
  }, [isOpen]);

  return (
    <section
      ref={sectionRef}
      className="py-32 px-6 sm:px-12 lg:px-20 flex flex-col items-center"
      aria-labelledby="letter-heading"
    >
      <p className="mb-4 text-center font-display text-xs tracking-[0.55em] text-verse-gold/70 uppercase">
        A Letter
      </p>
      <h2
        id="letter-heading"
        className="mb-16 font-display text-[clamp(2.5rem,7vw,5rem)] font-light leading-[0.95] text-center text-verse-cream"
      >
        Written for
        <br />
        <span className="italic text-verse-cream-muted">you alone.</span>
      </h2>

      {/* Envelope trigger */}
      {!isOpen && (
        <button
          ref={envelopeRef}
          id="letter-open-btn"
          onClick={() => setIsOpen(true)}
          aria-label="Open the letter"
          className="group relative opacity-0 cursor-pointer"
        >
          {/* Envelope card */}
          <div className="relative flex flex-col items-center justify-center rounded-sm border border-verse-gold/20 bg-verse-elevated px-16 py-14 shadow-[0_32px_80px_rgba(0,0,0,0.55)] transition-all duration-500 group-hover:border-verse-gold/40 group-hover:shadow-[0_40px_100px_rgba(0,0,0,0.65),0_0_80px_rgba(201,169,110,0.06)]">
            {/* Envelope flap lines */}
            <svg
              className="mb-6 h-16 w-20 text-verse-gold/40 transition-all duration-500 group-hover:text-verse-gold/70"
              viewBox="0 0 80 64"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            >
              {/* Envelope body */}
              <rect x="2" y="14" width="76" height="48" rx="2" />
              {/* Envelope flap */}
              <path d="M2 14 L40 42 L78 14" />
              {/* Fold lines */}
              <path d="M2 62 L28 36" strokeOpacity="0.5" />
              <path d="M78 62 L52 36" strokeOpacity="0.5" />
            </svg>
            <p className="font-display text-sm italic tracking-wide text-verse-cream-muted transition-colors duration-300 group-hover:text-verse-cream">
              Tap to open
            </p>
            {/* Wax seal dot */}
            <div className="mt-5 h-5 w-5 rounded-full bg-verse-gold/30 ring-4 ring-verse-gold/10 transition-all duration-500 group-hover:bg-verse-gold/55 group-hover:ring-verse-gold/20" />
          </div>
        </button>
      )}

      {/* The Letter — hidden until opened */}
      <div
        ref={letterRef}
        className="hidden w-full max-w-2xl"
        aria-live="polite"
      >
        {/* Close button */}
        <div className="mb-8 flex justify-center">
          <button
            onClick={() => setIsOpen(false)}
            id="letter-close-btn"
            aria-label="Close the letter"
            className="text-[11px] tracking-[0.4em] text-verse-cream-faint uppercase hover:text-verse-cream-muted transition-colors"
          >
            ✕ Close
          </button>
        </div>

        {/* Letter paper */}
        <article className="relative rounded-sm border border-verse-gold/10 bg-[#100d09] px-8 py-12 sm:px-14 sm:py-16 shadow-[0_40px_120px_rgba(0,0,0,0.6)]">
          {/* Decorative top rule */}
          <div className="mx-auto mb-10 h-px w-16 bg-verse-gold/30" />

          <div className="space-y-6">
            {LETTER_LINES.map((line, i) => {
              if (i === 0) {
                // Salutation
                return (
                  <p key={i} className="font-display text-2xl italic text-verse-cream">
                    {line}
                  </p>
                );
              }
              if (i === LETTER_LINES.length - 2) {
                // Sign-off
                return (
                  <p key={i} className="mt-10 font-display text-lg italic text-verse-cream-muted">
                    {line}
                  </p>
                );
              }
              if (i === LETTER_LINES.length - 1) {
                // Name
                return (
                  <p key={i} className="font-display text-xl text-verse-gold">
                    {line}
                  </p>
                );
              }
              return (
                <p key={i} className="font-display text-lg leading-[1.8] text-verse-cream-muted">
                  {line}
                </p>
              );
            })}
          </div>

          {/* Decorative bottom rule */}
          <div className="mx-auto mt-10 h-px w-16 bg-verse-gold/30" />
        </article>
      </div>
    </section>
  );
}
