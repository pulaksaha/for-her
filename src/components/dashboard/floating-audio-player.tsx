"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Pause, Play, X } from "lucide-react";
import { useAudioPlayer } from "@/contexts/audio-player-context";
import { cn } from "@/lib/utils/cn";

const WAVEFORM = [0.3, 0.55, 0.8, 0.5, 0.9, 0.65, 0.45, 0.75, 0.4, 0.6];

export function FloatingAudioPlayer() {
  const { track, isPlaying, toggle, clear } = useAudioPlayer();

  return (
    <AnimatePresence>
      {track && (
        <motion.div
          initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: 16, filter: "blur(6px)" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "fixed z-50 rounded-full border border-verse-border/80 bg-verse-night/90 shadow-verse-soft backdrop-blur-xl",
            "left-4 right-4 bottom-[5.5rem] lg:left-auto lg:right-8 lg:bottom-8 lg:w-[22rem]",
          )}
          role="region"
          aria-label="Now playing"
        >
          <div className="flex items-center gap-4 px-4 py-3 sm:px-5 sm:py-4">
            <button
              type="button"
              onClick={toggle}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-verse-cream/10 text-verse-cream transition-colors hover:bg-verse-cream/15"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" strokeWidth={1.5} />
              ) : (
                <Play className="ml-0.5 h-4 w-4" strokeWidth={1.5} />
              )}
            </button>

            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-base text-verse-cream">
                {track.title}
              </p>
              {track.subtitle && (
                <p className="truncate text-[11px] text-verse-cream-faint">
                  {track.subtitle}
                </p>
              )}
              {isPlaying && (
                <div className="mt-2 flex h-3 items-end gap-[2px]" aria-hidden>
                  {WAVEFORM.map((h, i) => (
                    <motion.span
                      key={i}
                      className="w-[3px] rounded-full bg-verse-gold/70"
                      animate={{ scaleY: [h * 0.4, h, h * 0.5] }}
                      transition={{
                        duration: 0.8 + i * 0.05,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                      }}
                      style={{ height: 12, transformOrigin: "bottom" }}
                    />
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={clear}
              className="shrink-0 p-2 text-verse-cream-faint transition-colors hover:text-verse-cream"
              aria-label="Close player"
            >
              <X className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
