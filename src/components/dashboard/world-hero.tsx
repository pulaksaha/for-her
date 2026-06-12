import Image from "next/image";
import type { MemoryWorld } from "@/types/memory";

interface WorldHeroProps {
  world: MemoryWorld;
  compact?: boolean;
}

export function WorldHero({ world, compact }: WorldHeroProps) {
  return (
    <div
      className={
        compact
          ? "relative mb-10 h-40 overflow-hidden rounded-sm sm:mb-12 sm:h-48"
          : "relative -mx-4 mb-12 h-[42vh] min-h-[280px] overflow-hidden sm:-mx-6 sm:mb-16 lg:-mx-0 lg:mb-20 lg:h-[48vh] lg:rounded-sm"
      }
    >
      {world.coverImageUrl && (
        <Image
          src={world.coverImageUrl}
          alt=""
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-verse-void via-verse-void/50 to-verse-void/20" />
      {!compact && (
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 lg:p-12">
          <p className="text-[10px] tracking-[0.4em] text-verse-gold/90 uppercase">
            {world.type} · private
          </p>
          <h1 className="mt-3 font-display text-4xl font-light text-verse-cream sm:text-5xl lg:text-6xl">
            {world.name}
          </h1>
          {world.tagline && (
            <p className="mt-4 max-w-lg text-sm text-verse-cream-muted sm:text-base">
              {world.tagline}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
