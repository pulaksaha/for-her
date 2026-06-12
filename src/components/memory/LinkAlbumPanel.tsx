"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Link2, Link2Off, ChevronRight, Check, AlertCircle } from "lucide-react";

interface Album {
  id: string;
  title: string;
  mediaItemsCount?: string;
  coverPhotoBaseUrl?: string;
}

interface Props {
  worldId: string;
  worldSlug: string;
  /** Currently linked album ID (from world row, server-rendered) */
  linkedAlbumId?: string | null;
  linkedAlbumName?: string | null;
  isConnected: boolean;
}

type PanelState = "idle" | "loading-albums" | "browsing" | "linking" | "done" | "error";

export function LinkAlbumPanel({
  worldId,
  worldSlug,
  linkedAlbumId,
  linkedAlbumName,
  isConnected,
}: Props) {
  const [panelState, setPanelState] = useState<PanelState>("idle");
  const [albums, setAlbums] = useState<Album[]>([]);
  const [urlInput, setUrlInput] = useState("");
  const [linkedId, setLinkedId] = useState(linkedAlbumId ?? null);
  const [linkedName, setLinkedName] = useState(linkedAlbumName ?? null);
  const [errorMsg, setErrorMsg] = useState("");
  const [showBrowse, setShowBrowse] = useState(false);
  const [isLinkingAlbum, setIsLinkingAlbum] = useState(false);

  const loadAlbums = useCallback(async () => {
    setPanelState("loading-albums");
    try {
      const res = await fetch("/api/google-photos/albums");
      if (!res.ok) {
        const { error } = await res.json().catch(() => ({}));
        if (error === "not_connected" || error === "token_expired") {
          window.location.href = `/api/google-photos/auth?world=${worldSlug}`;
          return;
        }
        throw new Error(error ?? "Could not load albums");
      }
      const { albums: data } = await res.json() as { albums: Album[] };
      setAlbums(data);
      setPanelState("browsing");
      setShowBrowse(true);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to load albums");
      setPanelState("error");
      setTimeout(() => setPanelState("idle"), 4000);
    }
  }, [worldSlug]);

  async function linkAlbum(albumId: string, albumTitle?: string) {
    setPanelState("linking");
    setIsLinkingAlbum(true);
    setShowBrowse(false);
    try {
      const res = await fetch("/api/google-photos/link-album", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ worldId, albumId, albumTitle }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Link failed");

      setLinkedId(data.albumId);
      setLinkedName(data.albumTitle ?? albumTitle ?? "Linked album");
      setPanelState("done");
      setUrlInput("");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Could not link album");
      setPanelState("error");
      setTimeout(() => setPanelState("idle"), 4000);
    } finally {
      setIsLinkingAlbum(false);
    }
  }

  async function linkByUrl() {
    if (!urlInput.trim()) return;
    setPanelState("linking");
    try {
      const res = await fetch("/api/google-photos/link-album", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ worldId, albumUrl: urlInput.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Link failed");

      setLinkedId(data.albumId);
      setLinkedName(data.albumTitle ?? "Linked album");
      setPanelState("done");
      setUrlInput("");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Could not link album");
      setPanelState("error");
      setTimeout(() => setPanelState("idle"), 4000);
    }
  }

  async function unlinkAlbum() {
    const res = await fetch(
      `/api/google-photos/link-album?worldId=${worldId}`,
      { method: "DELETE" },
    );
    if (res.ok) {
      setLinkedId(null);
      setLinkedName(null);
      setPanelState("idle");
    }
  }

  const isConnecting = !isConnected;

  return (
    <div className="space-y-5">
      {/* ── Currently linked album ─────────────────────────────────── */}
      {linkedId && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between rounded-2xl border border-verse-gold/20 bg-verse-gold/5 px-5 py-4"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-verse-gold/10">
              <Link2 className="h-4 w-4 text-verse-gold" />
            </div>
            <div>
              <p className="text-[10px] tracking-[0.25em] text-verse-gold uppercase">
                Linked album
              </p>
              <p className="mt-0.5 text-sm text-verse-cream">{linkedName}</p>
            </div>
          </div>
          <button
            onClick={unlinkAlbum}
            className="flex items-center gap-1.5 text-[11px] tracking-wider text-verse-cream-faint uppercase hover:text-rose-300 transition-colors"
          >
            <Link2Off className="h-3.5 w-3.5" />
            Unlink
          </button>
        </motion.div>
      )}

      {/* ── Link a new album ───────────────────────────────────────── */}
      {!linkedId && (
        <div className="space-y-4">

          {/* Paste URL method */}
          <div>
            <label className="text-[10px] tracking-[0.25em] text-verse-cream-faint uppercase">
              Paste album link
            </label>
            <div className="mt-2 flex gap-2">
              <input
                id="album-url-input"
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && linkByUrl()}
                placeholder="https://photos.google.com/album/..."
                disabled={panelState === "linking"}
                className="flex-1 rounded-xl border border-verse-border bg-verse-surface px-4 py-3 text-sm text-verse-cream placeholder:text-verse-cream-faint/50 focus:border-verse-gold-soft/40 focus:outline-none disabled:opacity-50"
              />
              <button
                id="link-album-url-btn"
                onClick={linkByUrl}
                disabled={!urlInput.trim() || panelState === "linking"}
                className="flex items-center gap-2 rounded-xl border border-verse-border bg-verse-surface px-4 py-3 text-sm text-verse-cream-muted transition-all hover:border-verse-gold/30 hover:text-verse-cream disabled:cursor-not-allowed disabled:opacity-40"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {panelState === "linking" ? (
                    <motion.span key="linking" className="flex items-center gap-2"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    </motion.span>
                  ) : (
                    <motion.span key="link"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      Link
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-verse-cream-faint">
              Open Google Photos → select your album → copy the URL from the address bar.
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 border-t border-verse-border/40" />
            <span className="text-[10px] tracking-[0.2em] text-verse-cream-faint uppercase">or</span>
            <div className="flex-1 border-t border-verse-border/40" />
          </div>

          {/* Browse albums button */}
          <button
            id="browse-albums-btn"
            onClick={isConnecting
              ? () => { window.location.href = `/api/google-photos/auth?world=${worldSlug}`; }
              : loadAlbums
            }
            disabled={panelState === "loading-albums" || panelState === "linking"}
            className="group flex w-full items-center justify-between rounded-xl border border-verse-border bg-verse-surface/60 px-5 py-3.5 text-sm text-verse-cream-muted transition-all hover:border-verse-gold/30 hover:bg-verse-surface hover:text-verse-cream disabled:opacity-50"
          >
            <span className="flex items-center gap-3">
              <GooglePhotosIcon className="h-4.5 w-4.5 shrink-0" />
              <AnimatePresence mode="wait" initial={false}>
                {panelState === "loading-albums" ? (
                  <motion.span key="loading" className="flex items-center gap-2"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading albums…
                  </motion.span>
                ) : (
                  <motion.span key="idle"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {isConnecting ? "Connect Google Photos to browse" : "Browse my albums"}
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
            <ChevronRight className="h-4 w-4 opacity-40 group-hover:opacity-70 transition-opacity" />
          </button>
        </div>
      )}

      {/* ── Done state ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {panelState === "done" && (
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-[13px] text-verse-gold"
          >
            <Check className="h-4 w-4" />
            Album linked — photos will appear in your gallery.
          </motion.p>
        )}
        {panelState === "error" && (
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-[13px] text-rose-300"
          >
            <AlertCircle className="h-4 w-4" />
            {errorMsg}
          </motion.p>
        )}
      </AnimatePresence>

      {/* ── Album browser grid ─────────────────────────────────────── */}
      <AnimatePresence>
        {showBrowse && panelState === "browsing" && albums.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="mb-3 text-[10px] tracking-[0.25em] text-verse-cream-faint uppercase">
              {albums.length} albums
            </p>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {albums.map((album) => (
                <AlbumCard
                  key={album.id}
                  album={album}
                  onSelect={() => linkAlbum(album.id, album.title)}
                  isLinking={isLinkingAlbum}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Album card ───────────────────────────────────────────────────────────────

function AlbumCard({
  album,
  onSelect,
  isLinking,
}: {
  album: Album;
  onSelect: () => void;
  isLinking: boolean;
}) {
  return (
    <button
      onClick={onSelect}
      disabled={isLinking}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-verse-border bg-verse-surface text-left transition-all hover:border-verse-gold/40 disabled:opacity-50"
    >
      {/* Cover thumbnail */}
      <div className="aspect-square w-full overflow-hidden bg-verse-elevated">
        {album.coverPhotoBaseUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`${album.coverPhotoBaseUrl}=w300-h300-c`}
            alt={album.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <GooglePhotosIcon className="h-8 w-8 opacity-20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-verse-night/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Album info */}
      <div className="p-3">
        <p className="truncate text-[12px] font-medium text-verse-cream leading-tight">
          {album.title}
        </p>
        {album.mediaItemsCount && (
          <p className="mt-0.5 text-[10px] text-verse-cream-faint">
            {album.mediaItemsCount} photos
          </p>
        )}
      </div>
    </button>
  );
}

// ── Google Photos icon ────────────────────────────────────────────────────────

function GooglePhotosIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <circle cx="9"  cy="9"  r="4.5" fill="#EA4335" />
      <circle cx="15" cy="9"  r="4.5" fill="#FBBC05" />
      <circle cx="15" cy="15" r="4.5" fill="#34A853" />
      <circle cx="9"  cy="15" r="4.5" fill="#4285F4" />
      <circle cx="12" cy="12" r="2.5" fill="rgba(0,0,0,0.18)" />
    </svg>
  );
}
