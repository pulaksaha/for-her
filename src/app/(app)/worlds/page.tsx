import Image from "next/image";
import Link from "next/link";
import { MinimalShell } from "@/components/dashboard/minimal-shell";
import { demoWorld } from "@/lib/data/demo";

export const metadata = {
  title: "Your worlds",
};

export default function WorldsPage() {
  return (
    <MinimalShell title="Enter a world">
      <p className="max-w-md text-sm leading-relaxed text-verse-cream-muted">
        Each world is a private room for memory — yours alone, or shared with
        those you trust.
      </p>

      <div className="mt-16 grid gap-8 sm:grid-cols-2">
        <Link
          href={`/worlds/${demoWorld.slug}`}
          className="group relative block overflow-hidden rounded-sm"
        >
          <div className="relative aspect-[4/5] sm:aspect-[3/4]">
            {demoWorld.coverImageUrl && (
              <Image
                src={demoWorld.coverImageUrl}
                alt=""
                fill
                className="object-cover transition-transform duration-[1.4s] group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-verse-void via-verse-void/40 to-transparent" />
          </div>
          <div className="absolute inset-x-0 bottom-0 p-8">
            <p className="text-[10px] tracking-[0.3em] text-verse-gold uppercase">
              {demoWorld.type}
            </p>
            <h2 className="mt-2 font-display text-3xl font-light text-verse-cream">
              {demoWorld.name}
            </h2>
            {demoWorld.tagline && (
              <p className="mt-2 text-sm text-verse-cream-muted">
                {demoWorld.tagline}
              </p>
            )}
          </div>
        </Link>

        <Link
          href="/signup"
          className="flex min-h-[320px] flex-col items-center justify-center rounded-sm border border-dashed border-verse-border/50 p-8 text-center transition-colors hover:border-verse-gold/25 hover:bg-verse-surface/20"
        >
          <span className="font-display text-5xl font-light text-verse-cream-faint">
            +
          </span>
          <p className="mt-6 font-display text-xl text-verse-cream-muted">
            Begin another world
          </p>
        </Link>
      </div>

      <p className="mt-16">
        <Link
          href={`/worlds/${demoWorld.slug}`}
          className="border-b border-verse-gold/40 pb-0.5 text-[11px] tracking-[0.3em] text-verse-gold uppercase hover:text-verse-cream"
        >
          Continue to {demoWorld.name} →
        </Link>
      </p>
    </MinimalShell>
  );
}
