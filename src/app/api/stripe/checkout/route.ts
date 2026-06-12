import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe/client";
import { env } from "@/lib/env";
import { VERSE_PLANS } from "@/lib/stripe/plans";

export async function GET(request: Request) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.redirect(
      new URL("/pricing?error=stripe_not_configured", request.url),
    );
  }

  const { searchParams } = new URL(request.url);
  const plan = searchParams.get("plan") ?? "keeper";
  const planConfig = VERSE_PLANS[plan as keyof typeof VERSE_PLANS];

  if (!planConfig || plan === "free" || !("stripePriceId" in planConfig)) {
    return NextResponse.redirect(new URL("/signup", request.url));
  }

  const priceId = planConfig.stripePriceId;
  if (!priceId) {
    return NextResponse.redirect(
      new URL("/pricing?error=price_not_configured", request.url),
    );
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${env.NEXT_PUBLIC_APP_URL}/settings?success=1`,
    cancel_url: `${env.NEXT_PUBLIC_APP_URL}/pricing?canceled=1`,
    allow_promotion_codes: true,
  });

  if (!session.url) {
    return NextResponse.json({ error: "No checkout URL" }, { status: 500 });
  }

  return NextResponse.redirect(session.url);
}
