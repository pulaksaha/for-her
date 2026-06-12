"use client";

import Image from "next/image";
import Link from "next/link";
import { FloatingAudioPlayer } from "@/components/dashboard/floating-audio-player";
import { PageTransition } from "@/components/dashboard/page-transition";
import { WorldNav } from "@/components/dashboard/world-nav";
import type { MemoryWorld } from "@/types/memory";

interface WorldShellProps {
  world: MemoryWorld;
  children: React.ReactNode;
}

export function WorldShell({ world, children }: WorldShellProps) {
  return (
    <div className="dashboard-world min-h-screen bg-verse-void">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[15.5rem] flex-col border-r border-verse-border/40 bg-verse-night/60 backdrop-blur-2xl lg:flex">
        <div className="border-b border-verse-border/30 px-5 py-6">
          <Link
            href="/worlds"
            className="text-[10px] tracking-[0.35em] text-verse-cream-faint uppercase transition-colors hover:text-verse-cream-muted"
          >
            All worlds
          </Link>
          <Link href={`/worlds/${world.slug}`} className="mt-4 block">
            <p className="font-display text-2xl font-light tracking-wide text-verse-cream">
              {world.name}
            </p>
            {world.tagline && (
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-verse-cream-faint">
                {world.tagline}
              </p>
            )}
          </Link>
        </div>
        <WorldNav world={world} variant="sidebar" />
        <div className="border-t border-verse-border/30 p-4">
          <Link
            href={`/worlds/${world.slug}/memories/new`}
            className="block w-full rounded-sm border border-verse-border/60 py-3 text-center text-[10px] tracking-[0.3em] text-verse-cream-muted uppercase transition-colors hover:border-verse-gold/30 hover:text-verse-cream"
          >
            Add memory
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-h-screen flex-col lg:pl-[15.5rem]">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-verse-border/30 bg-verse-void/80 px-4 py-4 backdrop-blur-xl lg:hidden">
          <Link href={`/worlds/${world.slug}`}>
            <p className="font-display text-xl text-verse-cream">{world.name}</p>
          </Link>
          <div className="flex items-center gap-4">
          <Link
            href="/settings"
            className="text-[10px] tracking-[0.25em] text-verse-cream-faint uppercase"
          >
            Settings
          </Link>
          {world.coverImageUrl && (
            <div className="relative h-9 w-9 overflow-hidden rounded-full ring-1 ring-verse-border">
              <Image
                src={world.coverImageUrl}
                alt=""
                fill
                className="object-cover"
                sizes="36px"
              />
            </div>
          )}
          </div>
        </header>

        <main className="flex-1 pb-[8.5rem] lg:pb-8">
          <PageTransition>{children}</PageTransition>
        </main>

        {/* Mobile bottom nav */}
        <div className="fixed inset-x-0 bottom-0 z-40 lg:hidden">
          <FloatingAudioPlayer />
          <WorldNav world={world} variant="mobile" />
        </div>
      </div>

      {/* Desktop floating player */}
      <div className="hidden lg:block">
        <FloatingAudioPlayer />
      </div>
    </div>
  );
}
