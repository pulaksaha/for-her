"use client";

import { format } from "date-fns";
import { Play } from "lucide-react";
import { SectionHeader } from "@/components/dashboard/section-header";
import { DashboardScrollReveal } from "@/components/dashboard/dashboard-scroll-reveal";
import { EmptyState } from "@/components/dashboard/empty-state";
import { useAudioPlayer } from "@/contexts/audio-player-context";
import type { DemoVoiceNote } from "@/lib/data/demo";

interface VoiceViewProps {
  voiceNotes: DemoVoiceNote[];
}

export function VoiceView({ voiceNotes }: VoiceViewProps) {
  const { play, track, isPlaying, toggle } = useAudioPlayer();

  if (voiceNotes.length === 0) {
    return (
      <div className="px-4 py-8 sm:px-6 lg:px-10">
        <EmptyState
          title="No voice yet"
          description="When you record a voice note, it will live here — beside the image, not instead of it."
        />
      </div>
    );
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
      <div className="mx-auto max-w-3xl">
        <SectionHeader
          eyebrow="Voice notes"
          title="The sound of remembering"
          description="Whispers, laughter, the way someone said your name. Press play and return."
        />

        <ul className="space-y-4">
          {voiceNotes.map((note) => {
            const active = track?.id === note.id;
            return (
              <li key={note.id}>
                <DashboardScrollReveal>
                <article className="group rounded-sm border border-verse-border/40 bg-verse-surface/25 p-6 transition-colors hover:border-verse-border hover:bg-verse-surface/50 sm:p-8">
                  <div className="flex gap-5">
                    <button
                      type="button"
                      onClick={() => {
                        if (active && isPlaying) {
                          toggle();
                        } else {
                          play({
                            id: note.id,
                            title: note.title,
                            subtitle: format(
                              new Date(note.occurredAt),
                              "MMMM d, yyyy",
                            ),
                            url: note.url,
                            durationSeconds: note.durationSeconds,
                          });
                        }
                      }}
                      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-verse-border/60 bg-verse-elevated/50 text-verse-cream transition-all duration-500 group-hover:border-verse-gold/40 group-hover:bg-verse-gold/10"
                      aria-label={`Play ${note.title}`}
                    >
                      <Play className="ml-0.5 h-5 w-5" strokeWidth={1.25} />
                    </button>
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-xl text-verse-cream sm:text-2xl">
                        {note.title}
                      </p>
                      <p className="mt-1 text-[11px] tracking-wider text-verse-cream-faint tabular-nums">
                        {format(new Date(note.occurredAt), "MMMM d, yyyy")} ·{" "}
                        {Math.floor(note.durationSeconds / 60)}:
                        {String(note.durationSeconds % 60).padStart(2, "0")}
                      </p>
                      <p className="mt-4 text-sm leading-relaxed text-verse-cream-muted italic">
                        &ldquo;{note.excerpt}&rdquo;
                      </p>
                    </div>
                  </div>
                </article>
                </DashboardScrollReveal>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
