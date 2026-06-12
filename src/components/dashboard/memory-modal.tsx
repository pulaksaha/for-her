"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { Memory } from "@/types/memory";

interface MemoryModalProps {
  memory: Memory | null;
  worldSlug: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MemoryModal({
  memory,
  worldSlug,
  open,
  onOpenChange,
}: MemoryModalProps) {
  const cover = memory?.media[0];

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && memory && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-[80] bg-verse-void/85 backdrop-blur-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount>
              <motion.div
                className="fixed inset-x-4 top-[8%] z-[81] mx-auto max-h-[84vh] max-w-2xl overflow-hidden rounded-sm border border-verse-border/60 bg-verse-night shadow-verse-soft outline-none sm:inset-x-auto sm:w-full"
                initial={{ opacity: 0, y: 32, scale: 0.98, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: 20, scale: 0.99, filter: "blur(4px)" }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <Dialog.Title className="sr-only">{memory.title}</Dialog.Title>
                {cover && (
                  <div className="relative aspect-[16/10] w-full">
                    <Image
                      src={cover.url}
                      alt={memory.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 672px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-verse-night to-transparent" />
                  </div>
                )}
                <div className="p-6 sm:p-8">
                  <p className="text-[10px] tracking-[0.3em] text-verse-gold uppercase">
                    {memory.mood}
                  </p>
                  <h2 className="mt-2 font-display text-3xl font-light text-verse-cream">
                    {memory.title}
                  </h2>
                  <p className="mt-2 text-sm text-verse-cream-faint">
                    {format(new Date(memory.occurredAt), "MMMM d, yyyy")}
                    {memory.location && ` · ${memory.location}`}
                  </p>
                  {memory.caption && (
                    <p className="mt-6 text-sm leading-relaxed text-verse-cream-muted italic">
                      {memory.caption}
                    </p>
                  )}
                  <Link
                    href={`/worlds/${worldSlug}/memories/${memory.id}`}
                    className="mt-8 inline-block border-b border-verse-gold/50 pb-0.5 text-[11px] tracking-[0.25em] text-verse-gold uppercase transition-colors hover:text-verse-cream"
                    onClick={() => onOpenChange(false)}
                  >
                    Open memory →
                  </Link>
                </div>
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="absolute top-4 right-4 rounded-full bg-verse-void/60 p-2 text-verse-cream backdrop-blur-sm transition-colors hover:bg-verse-void/80"
                    aria-label="Close"
                  >
                    <X className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                </Dialog.Close>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
