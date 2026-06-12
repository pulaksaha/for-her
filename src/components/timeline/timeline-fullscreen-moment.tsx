"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Memory } from "@/types/memory";

interface TimelineFullscreenMomentProps {
  memory: Memory | null;
  worldSlug: string;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

export function TimelineFullscreenMoment({
  memory,
  worldSlug,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: TimelineFullscreenMomentProps) {
  const cover = memory?.media.find(
    (m) => m.type === "photo" || m.type === "video",
  );

  return (
    <Dialog.Root open={Boolean(memory)} onOpenChange={(o) => !o && onClose()}>
      <AnimatePresence>
        {memory && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-[90] bg-verse-void/95 backdrop-blur-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount>
              <motion.div
                className="fixed inset-0 z-[91] flex flex-col outline-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45 }}
              >
                <Dialog.Title className="sr-only">{memory.title}</Dialog.Title>

                {cover && (
                  <div className="relative min-h-[45vh] flex-1 sm:min-h-[55vh]">
                    <Image
                      src={cover.url}
                      alt={memory.title}
                      fill
                      className="object-cover"
                      sizes="100vw"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-verse-void via-transparent to-verse-void/40" />
                  </div>
                )}

                <div className="shrink-0 border-t border-verse-border/30 bg-verse-night/90 px-6 py-8 backdrop-blur-xl sm:px-12 sm:py-10">
                  <p className="text-[10px] tracking-[0.35em] text-verse-gold uppercase">
                    {memory.mood}
                  </p>
                  <h2 className="mt-3 font-display text-3xl font-light text-verse-cream sm:text-5xl">
                    {memory.title}
                  </h2>
                  <p className="mt-2 text-sm text-verse-cream-faint">
                    {format(new Date(memory.occurredAt), "MMMM d, yyyy")}
                    {memory.location && ` · ${memory.location}`}
                  </p>
                  {memory.caption && (
                    <p className="mt-6 max-w-2xl text-base leading-relaxed text-verse-cream-muted italic">
                      {memory.caption}
                    </p>
                  )}
                  {memory.story && (
                    <p className="mt-4 max-w-2xl font-display text-lg leading-relaxed text-verse-cream-faint">
                      {memory.story.content}
                    </p>
                  )}
                  <Link
                    href={`/worlds/${worldSlug}/memories/${memory.id}`}
                    className="mt-8 inline-block text-[11px] tracking-[0.25em] text-verse-gold uppercase hover:text-verse-cream"
                  >
                    Full memory →
                  </Link>
                </div>

                <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-4 sm:p-6">
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      className="pointer-events-auto rounded-full bg-verse-void/60 p-3 text-verse-cream backdrop-blur-sm"
                      aria-label="Close"
                    >
                      <X className="h-5 w-5" strokeWidth={1.25} />
                    </button>
                  </Dialog.Close>
                </div>

                <div className="absolute inset-y-0 left-0 flex items-center pl-2 sm:pl-4">
                  {hasPrev && onPrev && (
                    <button
                      type="button"
                      onClick={onPrev}
                      className="rounded-full bg-verse-void/50 p-3 text-verse-cream backdrop-blur-sm transition-colors hover:bg-verse-void/70"
                      aria-label="Previous memory"
                    >
                      <ChevronLeft className="h-5 w-5" strokeWidth={1.25} />
                    </button>
                  )}
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-4">
                  {hasNext && onNext && (
                    <button
                      type="button"
                      onClick={onNext}
                      className="rounded-full bg-verse-void/50 p-3 text-verse-cream backdrop-blur-sm transition-colors hover:bg-verse-void/70"
                      aria-label="Next memory"
                    >
                      <ChevronRight className="h-5 w-5" strokeWidth={1.25} />
                    </button>
                  )}
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
