"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Link2 } from "lucide-react";
import { SectionHeader } from "@/components/dashboard/section-header";
import { PhotoCard } from "@/components/dashboard/photo-card";
import { MemoryModal } from "@/components/dashboard/memory-modal";
import { DashboardScrollReveal } from "@/components/dashboard/dashboard-scroll-reveal";
import type { Memory } from "@/types/memory";

interface GalleryPhoto {
  id: string;
  url: string;
  thumbnailUrl: string;
  filename: string;
  mimeType: string;
  takenAt: string | null;
  isVideo: boolean;
}

interface GalleryViewProps {
  memories: Memory[];
  worldSlug: string;
  /** World UUID — needed to fetch the linked album photos */
  worldId?: string;
}

const aspects = [
  "portrait", "landscape", "tall", "square", "portrait", "landscape",
] as const;

export function GalleryView({ memories, worldSlug, worldId }: GalleryViewProps) {
  const [selected, setSelected] = useState<Memory | null>(null);
  const [open, setOpen] = useState(false);
  const [albumPhotos, setAlbumPhotos] = useState<GalleryPhoto[]>([]);
  const [albumTitle, setAlbumTitle] = useState<string | null>(null);
  const [loadingAlbum, setLoadingAlbum] = useState(false);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [albumError, setAlbumError] = useState<string | null>(null);

  const fetchAlbumPhotos = useCallback(async (pageToken?: string) => {
    if (!worldId) return;
    pageToken ? setLoadingMore(true) : setLoadingAlbum(true);

    try {
      const url = new URL("/api/google-photos/album-photos", window.location.origin);
      url.searchParams.set("worldId", worldId);
      if (pageToken) url.searchParams.set("pageToken", pageToken);

      const res = await fetch(url.toString());
      const data = await res.json();

      if (!res.ok) {
        if (data.error === "not_connected" || data.error === "token_expired") {
          // Silently skip — user hasn't connected Google yet
          return;
        }
        throw new Error(data.error ?? "Failed to load album");
      }

      if (!data.albumLinked) return; // No album linked, nothing to show

      setAlbumTitle(data.albumTitle);
      setAlbumPhotos((prev) => pageToken ? [...prev, ...data.photos] : data.photos);
      setNextPageToken(data.nextPageToken ?? null);
    } catch (err) {
      setAlbumError(err instanceof Error ? err.message : "Album load failed");
    } finally {
      setLoadingAlbum(false);
      setLoadingMore(false);
    }
  }, [worldId]);

  useEffect(() => {
    fetchAlbumPhotos();
  }, [fetchAlbumPhotos]);

  function openMemory(memory: Memory) {
    setSelected(memory);
    setOpen(true);
  }

  // Convert album photos into a Memory-like shape for the PhotoCard
  function albumPhotoToMemoryLike(photo: GalleryPhoto, index: number) {
    return {
      id: `gp-${photo.id}`,
      src: photo.url,
      alt: photo.filename,
      title: photo.filename.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " "),
      meta: photo.takenAt
        ? new Date(photo.takenAt).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          })
        : "Google Photos",
      aspect: aspects[index % aspects.length],
    };
  }

  const hasLocalMedia = memories.some((m) => m.media.length > 0);
  const hasAlbumPhotos = albumPhotos.length > 0;
  const isEmpty = !hasLocalMedia && !hasAlbumPhotos && !loadingAlbum;

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="Gallery"
          title="Seen the way you remember"
          description="Large, quiet, uninterrupted. Every photograph given room to breathe."
        />

        {/* ── Album banner ──────────────────────────────────────────── */}
        {albumTitle && !loadingAlbum && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex items-center gap-2.5 text-[11px] tracking-[0.2em] text-verse-gold uppercase"
          >
            <Link2 className="h-3.5 w-3.5" />
            {albumTitle}
            <span className="text-verse-cream-faint">·</span>
            <span className="text-verse-cream-faint normal-case tracking-normal">
              {albumPhotos.length} photos from Google Photos
            </span>
          </motion.div>
        )}

        {/* ── Loading skeleton ──────────────────────────────────────── */}
        {loadingAlbum && (
          <div className="mb-8 flex items-center gap-2 text-sm text-verse-cream-faint">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading album…
          </div>
        )}

        {/* ── Error state ───────────────────────────────────────────── */}
        {albumError && (
          <p className="mb-6 text-sm text-rose-300/70">{albumError}</p>
        )}

        {/* ── Main masonry grid ─────────────────────────────────────── */}
        {isEmpty ? (
          <div className="py-24 text-center">
            <p className="text-verse-cream-faint text-sm">
              No memories yet.{" "}
              <a href={`/worlds/${worldSlug}/memories/new`} className="text-verse-gold hover:text-verse-cream">
                Add your first →
              </a>
            </p>
          </div>
        ) : (
          <div className="columns-2 gap-3 sm:columns-3 sm:gap-4 lg:columns-3 lg:gap-5">

            {/* Local memories first */}
            {memories.flatMap((memory) =>
              memory.media
                .filter((m) => m.type === "photo" || m.type === "video")
                .map((media, mi) => (
                  <DashboardScrollReveal
                    key={`local-${memory.id}-${media.id}`}
                    className="mb-3 break-inside-avoid sm:mb-4"
                  >
                    <PhotoCard
                      src={media.url}
                      alt={memory.title}
                      title={memory.title}
                      meta={memory.mood}
                      aspect={aspects[(mi + memories.indexOf(memory)) % aspects.length]}
                      onClick={() => openMemory(memory)}
                    />
                  </DashboardScrollReveal>
                )),
            )}

            {/* Google Photos album photos */}
            {albumPhotos.map((photo, i) => {
              const card = albumPhotoToMemoryLike(photo, i + memories.length);
              return (
                <DashboardScrollReveal
                  key={`gp-${photo.id}`}
                  className="mb-3 break-inside-avoid sm:mb-4"
                >
                  <PhotoCard
                    src={card.src}
                    alt={card.alt}
                    title={card.title}
                    meta={card.meta}
                    aspect={card.aspect}
                  />
                </DashboardScrollReveal>
              );
            })}
          </div>
        )}

        {/* ── Load more ─────────────────────────────────────────────── */}
        {nextPageToken && !loadingAlbum && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={() => fetchAlbumPhotos(nextPageToken)}
              disabled={loadingMore}
              className="flex items-center gap-2 rounded-xl border border-verse-border bg-verse-surface/60 px-6 py-3 text-sm text-verse-cream-muted transition-all hover:border-verse-gold/30 hover:text-verse-cream disabled:opacity-50"
            >
              {loadingMore ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Loading more…</>
              ) : (
                "Load more photos"
              )}
            </button>
          </div>
        )}
      </div>

      <MemoryModal
        memory={selected}
        worldSlug={worldSlug}
        open={open}
        onOpenChange={setOpen}
      />
    </div>
  );
}
