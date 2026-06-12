import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { VERSE_PLANS } from "@/lib/stripe/plans";

export const metadata = {
  title: "Pricing",
};

export default function PricingPage() {
  const plans = Object.values(VERSE_PLANS);

  return (
    <main className="pt-32 pb-24">
      <Container size="md" className="text-center">
        <p className="text-[11px] tracking-[0.35em] text-verse-gold uppercase">
          Pricing
        </p>
        <h1 className="mt-6 font-display text-5xl font-light text-verse-cream sm:text-6xl">
          Invest in what lasts
        </h1>
        <p className="mx-auto mt-6 max-w-lg text-verse-cream-muted">
          No ads. No data selling. Your memories are yours — we simply give them
          a beautiful home.
        </p>
      </Container>

      <Container className="mt-20">
        <div className="grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.id}
              className={`flex flex-col rounded-3xl border p-10 ${
                plan.id === "keeper"
                  ? "border-verse-gold/30 bg-verse-elevated shadow-verse-glow"
                  : "border-verse-border bg-verse-surface/60"
              }`}
            >
              <h2 className="font-display text-3xl text-verse-cream">
                {plan.name}
              </h2>
              <p className="mt-2 text-sm text-verse-cream-muted">
                {plan.description}
              </p>
              <p className="mt-8 font-display text-5xl text-verse-cream">
                {plan.price === 0 ? (
                  "Free"
                ) : (
                  <>
                    ${plan.price}
                    <span className="text-lg text-verse-cream-faint">/mo</span>
                  </>
                )}
              </p>
              <ul className="mt-10 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="text-sm text-verse-cream-muted before:mr-2 before:text-verse-gold before:content-['—']"
                  >
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                className="mt-10 w-full"
                variant={plan.id === "keeper" ? "gold" : "outline"}
                asChild
              >
                <Link href={plan.id === "free" ? "/signup" : "/api/stripe/checkout"}>
                  {plan.id === "free" ? "Begin free" : "Choose plan"}
                </Link>
              </Button>
            </article>
          ))}
        </div>
      </Container>
    </main>
  );
}
