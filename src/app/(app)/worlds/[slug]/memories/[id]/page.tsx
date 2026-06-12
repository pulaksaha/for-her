import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft, Mic, Music } from "lucide-react";
import { GenerateStoryButton } from "@/components/memory/generate-story-button";
import { getWorldDashboardData } from "@/lib/world/get-world-data";

interface MemoryPageProps {
  params: Promise<{ slug: string; id: string }>;
}

export async function generateMetadata({ params }: MemoryPageProps) {
  const { slug, id } = await params;
  const data = getWorldDashboardData(slug);
  const memory = data?.memories.find((m) => m.id === id);
  return { title: memory?.title ?? "Memory" };
}

export default async function MemoryPage({ params }: MemoryPageProps) {
  const { slug, id } = await params;
  const data = getWorldDashboardData(slug);
  if (!data) notFound();

  const memory = data.memories.find((m) => m.id === id);
  if (!memory) notFound();

  const cover = memory.media[0];

  return (
    <article className="pb-8 lg:pb-4">
      <div className="relative min-h-[55vh] lg:min-h-[60vh]">
        {cover && (
          <Image
            src={cover.url}
            alt={memory.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-verse-void via-verse-void/60 to-verse-void/20" />
        <div className="relative mx-auto flex min-h-[55vh] max-w-6xl flex-col justify-between px-4 py-8 sm:px-6 lg:min-h-[60vh] lg:px-10">
          <Link
            href={`/worlds/${slug}`}
            className="inline-flex items-center gap-2 text-sm text-verse-cream-muted transition-colors hover:text-verse-cream"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
            Back to world
          </Link>
          <div className="pb-8">
            <p className="text-[10px] tracking-[0.3em] text-verse-gold uppercase">
              {memory.mood}
            </p>
            <h1 className="mt-4 font-display text-5xl font-light text-verse-cream sm:text-6xl">
              {memory.title}
            </h1>
            <p className="mt-4 text-verse-cream-muted">
              {format(new Date(memory.occurredAt), "EEEE, MMMM d, yyyy")}
              {memory.location && ` · ${memory.location}`}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-2xl px-4 sm:mt-16 sm:px-6 lg:px-10">
        {memory.caption && (
          <blockquote className="border-l-2 border-verse-gold/40 pl-8 font-display text-2xl font-light italic leading-relaxed text-verse-cream sm:text-3xl">
            {memory.caption}
          </blockquote>
        )}

        <div className="mt-12 flex flex-wrap gap-6 text-sm text-verse-cream-faint">
          {memory.voiceNoteUrl && (
            <span className="inline-flex items-center gap-2">
              <Mic className="h-4 w-4" strokeWidth={1.5} />
              Voice note attached
            </span>
          )}
          {memory.musicTrack && (
            <span className="inline-flex items-center gap-2">
              <Music className="h-4 w-4" strokeWidth={1.5} />
              {memory.musicTrack}
            </span>
          )}
        </div>

        {memory.media.length > 1 && (
          <div className="mt-16 grid gap-4 sm:grid-cols-2">
            {memory.media.slice(1).map((item) => (
              <div
                key={item.id}
                className="relative aspect-[4/3] overflow-hidden rounded-2xl"
              >
                <Image
                  src={item.url}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            ))}
          </div>
        )}

        <section className="mt-20 border-t border-verse-border pt-16">
          <div className="flex items-start justify-between gap-8">
            <div>
              <p className="text-[10px] tracking-[0.3em] text-verse-gold uppercase">
                The story
              </p>
              <h2 className="mt-4 font-display text-3xl text-verse-cream">
                As it lives in words
              </h2>
            </div>
            <GenerateStoryButton memory={memory} worldName={data.world.name} />
          </div>
          {memory.story ? (
            <p className="verse-prose mt-10 max-w-none text-lg leading-[1.9] text-verse-cream-muted">
              {memory.story.content}
            </p>
          ) : (
            <p className="mt-10 text-verse-cream-faint">
              No story yet. Generate one from this moment.
            </p>
          )}
        </section>
      </div>
    </article>
  );
}
