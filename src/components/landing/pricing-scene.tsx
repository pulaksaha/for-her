"use client";

import Link from "next/link";
import { BlurReveal } from "@/components/landing/blur-reveal";
import { VERSE_PLANS } from "@/lib/stripe/plans";

const plans = [
  VERSE_PLANS.free,
  VERSE_PLANS.keeper,
  VERSE_PLANS.legacy,
];

export function PricingScene() {
  return (
    <section
      id="pricing"
      className="relative border-t border-verse-border/40 bg-verse-night py-32 sm:py-44"
      aria-label="Pricing"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-20">
        <BlurReveal className="text-center">
          <p className="text-[10px] tracking-[0.4em] text-verse-gold uppercase">
            Invest in what lasts
          </p>
          <h2 className="mx-auto mt-6 max-w-2xl font-display text-4xl font-light text-verse-cream sm:text-5xl">
            Quiet plans. No performance.
          </h2>
          <p className="mx-auto mt-6 max-w-md text-sm text-verse-cream-faint">
            Your memories are never sold. We charge for the room they live in.
          </p>
        </BlurReveal>

        <div className="mt-20 grid gap-px bg-verse-border/30 md:grid-cols-3">
          {plans.map((plan) => (
            <BlurReveal key={plan.id}>
              <article
                className={`flex h-full flex-col px-8 py-12 sm:px-10 sm:py-14 ${
                  plan.id === "keeper"
                    ? "bg-verse-elevated/80"
                    : "bg-verse-surface/40"
                }`}
              >
                <p className="font-display text-3xl text-verse-cream">
                  {plan.name}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-verse-cream-faint">
                  {plan.description}
                </p>
                <p className="mt-10 font-display text-5xl font-light text-verse-cream">
                  {plan.price === 0 ? (
                    "Free"
                  ) : (
                    <>
                      ${plan.price}
                      <span className="ml-1 text-lg text-verse-cream-faint">
                        /mo
                      </span>
                    </>
                  )}
                </p>
                <p className="mt-8 flex-1 text-sm leading-relaxed text-verse-cream-muted">
                  {plan.features.slice(0, 3).join(" · ")}
                </p>
                <Link
                  href={
                    plan.id === "free"
                      ? "/signup"
                      : `/api/stripe/checkout?plan=${plan.id}`
                  }
                  className="mt-10 inline-block text-[11px] tracking-[0.3em] text-verse-gold uppercase transition-colors hover:text-verse-cream"
                >
                  {plan.id === "free" ? "Begin →" : "Choose →"}
                </Link>
              </article>
            </BlurReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
