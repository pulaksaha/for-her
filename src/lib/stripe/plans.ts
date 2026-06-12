export const VERSE_PLANS = {
  free: {
    id: "free",
    name: "Begin",
    price: 0,
    description: "One world, up to 50 memories",
    features: [
      "1 memory world",
      "50 memories",
      "Basic timeline",
      "AI stories (5/month)",
    ],
  },
  keeper: {
    id: "keeper",
    name: "Keeper",
    price: 12,
    stripePriceId: process.env.STRIPE_KEEPER_PRICE_ID,
    description: "For couples and families building something lasting",
    features: [
      "Unlimited worlds",
      "Unlimited memories",
      "Voice notes & music",
      "Unlimited AI stories",
      "Monthly memory recaps",
      "Anniversary films (2/year)",
    ],
  },
  legacy: {
    id: "legacy",
    name: "Legacy",
    price: 29,
    stripePriceId: process.env.STRIPE_LEGACY_PRICE_ID,
    description: "The complete cinematic archive",
    features: [
      "Everything in Keeper",
      "Unlimited anniversary films",
      "4K film exports",
      "Priority rendering",
      "Family vault (10 members)",
      "Printed annual book (1/year)",
    ],
  },
} as const;

export type VersePlanId = keyof typeof VERSE_PLANS;
