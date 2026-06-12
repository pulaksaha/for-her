import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "For You ♡",
  description: "A private letter, in the shape of a film.",
  robots: { index: false, follow: false },
};

export default function ForHerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Deliberately naked — no site nav, no footer chrome, just the experience.
  return <>{children}</>;
}
