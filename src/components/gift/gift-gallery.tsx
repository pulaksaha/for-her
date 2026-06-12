"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

// ─── PASTE YOUR GOOGLE PHOTOS ALBUM LINK HERE ───────────────────────────────
// Works with: https://photos.app.goo.gl/... or https://photos.google.com/share/...
const ALBUM_URL = "https://photos.app.goo.gl/hm69FVR5QjtfJzzd8"; // ← Replace this
// ─────────────────────────────────────────────────────────────────────────────

const STORAGE_KEY = "gift_album_url";
const PHOTO_SIZE = "=w1600"; // high-res — simpler suffix is more reliable

// ─── Types ───────────────────────────────────────────────────────────────────
type VideoItem = { thumbnail: string; src: string };
type MediaItem =
  | { kind: "photo"; url: string }
  | { kind: "video"; thumbnail: string; src: string };

// ─── Warm gradient placeholders ───────────────────────────────────────────────
const GRADIENTS = [
  "linear-gradient(155deg,#1c1307,#2e1c0a,#0e0c0a)",
  "linear-gradient(195deg,#1a0f0a,#291608,#0e0c0a)",
  "linear-gradient(135deg,#110e07,#241a0c,#0e0c0a)",
  "linear-gradient(165deg,#1e1207,#2b1a0b,#0e0c0a)",
  "linear-gradient(185deg,#170d07,#231508,#0e0c0a)",
  "linear-gradient(145deg,#1a1108,#27190c,#0e0c0a)",
];

// ─── Seeded organic layout values ─────────────────────────────────────────────
function seedValues(i: number) {
  const rotations = [-2.2, 1.8, -1.2, 3.1, -2.8, 1.4, -3.3, 2.0, -1.6, 2.7];
  const nudges = [0, 28, -16, 40, -8, 32, 12, -24, 20, -12];
  const dirs = ["bottom", "left", "right", "bottom", "right", "left"] as const;
  return {
    rot: rotations[i % rotations.length],
    nudge: nudges[i % nudges.length],
    dir: dirs[i % dirs.length],
  };
}

// ─── Cinematic row layout patterns ────────────────────────────────────────────
const ROW_PATTERNS: Array<Array<{ span: string; aspect: string }>> = [
  [{ span: "col-span-12", aspect: "aspect-[21/9]" }],
  [{ span: "col-span-7", aspect: "aspect-[4/3]" }, { span: "col-span-5", aspect: "aspect-[3/4]" }],
  [{ span: "col-span-5", aspect: "aspect-[3/4]" }, { span: "col-span-7", aspect: "aspect-[4/3]" }],
  [{ span: "col-span-4", aspect: "aspect-[4/5]" }, { span: "col-span-4", aspect: "aspect-[4/5]" }, { span: "col-span-4", aspect: "aspect-[4/5]" }],
  [{ span: "col-span-12", aspect: "aspect-[16/7]" }],
  [{ span: "col-span-6", aspect: "aspect-[3/4]" }, { span: "col-span-6", aspect: "aspect-[3/4]" }],
];

function buildRows(items: MediaItem[]) {
  const rows: Array<{ items: MediaItem[]; pattern: (typeof ROW_PATTERNS)[0] }> = [];
  let i = 0, pi = 0;
  while (i < items.length) {
    const pattern = ROW_PATTERNS[pi % ROW_PATTERNS.length];
    const count = pattern.length;
    const slice = items.slice(i, i + count);
    if (!slice.length) break;
    if (slice.length < count && count > 1) {
      rows.push({ items: slice, pattern: [{ span: "col-span-12", aspect: "aspect-[16/9]" }] });
    } else {
      rows.push({ items: slice, pattern: pattern.slice(0, slice.length) });
    }
    i += slice.length;
    pi++;
  }
  return rows;
}

// ─── Shared film-print wrapper animation ─────────────────────────────────────
function useFilmEntrance(
  rotation: number,
  dir: "bottom" | "left" | "right",
  delay: number
) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fromX = dir === "left" ? -60 : dir === "right" ? 60 : 0;
    const fromY = dir === "bottom" ? 70 : 20;
    gsap.set(el, { opacity: 0, x: fromX, y: fromY, rotate: rotation * 1.6 });
    const ctx = gsap.context(() => {
      gsap.to(el, {
        opacity: 1, x: 0, y: 0, rotate: rotation,
        duration: 1.6, delay, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
      });
    }, el);
    return () => ctx.revert();
  }, [rotation, dir, delay]);
  return ref;
}

// ─── Photo card ───────────────────────────────────────────────────────────────
function PhotoCard({
  url, gradient, rotation, nudge, dir, delay, aspect, span,
}: {
  url: string; gradient: string; rotation: number; nudge: number;
  dir: "bottom" | "left" | "right"; delay: number; aspect: string; span: string;
}) {
  const wrapRef = useFilmEntrance(rotation, dir, delay);
  const [errored, setErrored] = useState(false);

  // Silently drop the card if the image 403s or fails
  if (errored) return null;

  return (
    <div className={span} style={{ marginTop: `${nudge}px` }}>
      <div
        ref={wrapRef}
        className="group relative cursor-pointer opacity-0"
        style={{ transition: "transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)", willChange: "transform" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "rotate(0deg) scale(1.02)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = `rotate(${rotation}deg) scale(1)`; }}
      >
        <div
          className={`relative ${aspect} overflow-hidden`}
          style={{
            boxShadow: "0 8px 40px rgba(0,0,0,0.55), 0 2px 8px rgba(0,0,0,0.35)",
            padding: "5px 5px 18px 5px",
            background: "#f5f0e8",
          }}
        >
          <div className="relative h-full w-full overflow-hidden">
            {/* Warm gradient — visible beneath image while it loads */}
            <div className="absolute inset-0" style={{ background: gradient }} />
            {/* referrerPolicy stops Google's hotlink 403 */}
            <img
              src={`${url}${PHOTO_SIZE}`}
              alt=""
              referrerPolicy="no-referrer"
              loading="lazy"
              decoding="async"
              onError={() => setErrored(true)}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[5s] ease-out group-hover:scale-[1.08]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Video card ───────────────────────────────────────────────────────────────
function VideoCard({
  thumbnail, src, gradient, rotation, nudge, dir, delay, aspect, span,
}: {
  thumbnail: string; src: string; gradient: string; rotation: number; nudge: number;
  dir: "bottom" | "left" | "right"; delay: number; aspect: string; span: string;
}) {
  const wrapRef = useFilmEntrance(rotation, dir, delay);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [errored, setErrored] = useState(false);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().then(() => setPlaying(true)).catch(() => setErrored(true));
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  return (
    <div className={span} style={{ marginTop: `${nudge}px` }}>
      <div
        ref={wrapRef}
        className="group relative cursor-pointer opacity-0"
        style={{ transition: "transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)", willChange: "transform" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "rotate(0deg) scale(1.02)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = `rotate(${rotation}deg) scale(1)`; }}
      >
        {/* Film-print border — slightly thicker bottom like a cine frame */}
        <div
          className={`relative ${aspect} overflow-hidden`}
          style={{
            boxShadow: "0 8px 40px rgba(0,0,0,0.65), 0 2px 8px rgba(0,0,0,0.45)",
            padding: "5px 5px 22px 5px",
            background: "#e8e4dc",
          }}
        >
          <div className="relative h-full w-full overflow-hidden bg-black">
            {/* Gradient fallback */}
            <div className="absolute inset-0" style={{ background: gradient }} />

            {/* Video element */}
            {!errored ? (
              <video
                src={src}
                poster={thumbnail}
                muted
                playsInline
                loop
                preload="none"
                crossOrigin="anonymous"
                onError={() => setErrored(true)}
                ref={(el) => {
                  // @ts-expect-error referrerPolicy valid in DOM but missing from React video types
                  if (el) el.referrerPolicy = "no-referrer";
                  (videoRef as React.MutableRefObject<HTMLVideoElement | null>).current = el;
                }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              /* Fallback: show thumbnail if video fails to load */
              /* Fallback img — also no-referrer */
              <img
                src={thumbnail}
                alt="Video thumbnail"
                referrerPolicy="no-referrer"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}

            {/* Dark vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />

            {/* Play / pause overlay */}
            {!errored && (
              <button
                onClick={togglePlay}
                aria-label={playing ? "Pause video" : "Play video"}
                className="absolute inset-0 flex items-center justify-center transition-opacity duration-300"
                style={{ opacity: playing ? 0 : 1 }}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-black/50 backdrop-blur-sm transition-all duration-300 hover:bg-black/70 hover:scale-110">
                  {/* Play triangle */}
                  <svg className="h-5 w-5 translate-x-0.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M5 3.868v16.264c0 1.036 1.152 1.638 2.015 1.07l12.928-8.132a1.25 1.25 0 0 0 0-2.14L7.015 2.797C6.152 2.23 5 2.832 5 3.868z" />
                  </svg>
                </div>
              </button>
            )}

            {/* Bottom controls — visible when playing */}
            {playing && !errored && (
              <div className="absolute bottom-2 right-2 flex items-center gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {/* Mute toggle */}
                <button
                  onClick={toggleMute}
                  aria-label={muted ? "Unmute" : "Mute"}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm hover:bg-black/80 transition-colors"
                >
                  {muted ? (
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                    </svg>
                  ) : (
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                    </svg>
                  )}
                </button>
                {/* Pause button */}
                <button
                  onClick={togglePlay}
                  aria-label="Pause"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm hover:bg-black/80 transition-colors"
                >
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                </button>
              </div>
            )}

            {/* "Video" label badge — subtle cine frame marker */}
            <div className="absolute left-2 top-2 flex items-center gap-1 rounded-sm bg-black/50 px-2 py-0.5 backdrop-blur-sm">
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-verse-gold" />
              <span className="text-[9px] tracking-[0.3em] text-white/80 uppercase">Video</span>
            </div>
          </div>

          {/* Film strip perforations on bottom strip */}
          <div className="absolute bottom-0 left-0 right-0 h-[22px] flex items-center justify-center gap-2 px-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-2.5 w-3 rounded-[2px] border border-[#8a8279]/40 bg-transparent" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Loading skeleton card ────────────────────────────────────────────────────
function SkeletonCard({ aspect, span }: { aspect: string; span: string }) {
  return (
    <div className={span}>
      <div className={`relative ${aspect} overflow-hidden`} style={{ padding: "5px 5px 18px 5px", background: "#f5f0e8" }}>
        <div className="h-full w-full animate-pulse" style={{ background: "linear-gradient(135deg,#1c1307,#2e1c0a)" }} />
      </div>
    </div>
  );
}

// ─── Main gallery component ───────────────────────────────────────────────────
export function GiftGallery() {
  const [items, setItems]         = useState<MediaItem[]>([]);
  const [loading, setLoading]     = useState(true);
  const [albumUrl, setAlbumUrl]   = useState<string | null>(null);
  const [error, setError]         = useState<string | null>(null);
  const [counts, setCounts]       = useState({ photos: 0, videos: 0 });
  const hasFetched = useRef(false);

  const fetchMedia = useCallback(async (url: string) => {
    setLoading(true);
    setError(null);
    try {
      const res  = await fetch(`/api/album-photos?url=${encodeURIComponent(url)}`);
      const data = await res.json();

      const photos: string[]   = data.photos ?? [];
      const videos: VideoItem[] = data.videos ?? [];

      if (photos.length === 0 && videos.length === 0) {
        setError(data.error ?? "No media found in this album.");
        return;
      }

      setCounts({ photos: photos.length, videos: videos.length });

      // Interleave videos every ~8 photos for a natural mix
      const mixed: MediaItem[] = [];
      let vi = 0;
      for (let pi = 0; pi < photos.length; pi++) {
        if (vi < videos.length && pi > 0 && pi % 8 === 0) {
          mixed.push({ kind: "video", ...videos[vi++] });
        }
        mixed.push({ kind: "photo", url: photos[pi] });
      }
      // Append any remaining videos at the end
      while (vi < videos.length) {
        mixed.push({ kind: "video", ...videos[vi++] });
      }
      setItems(mixed);
    } catch {
      setError("Could not load media. Check your connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    const url = ALBUM_URL.trim() || localStorage.getItem(STORAGE_KEY) || "";
    if (url) {
      // Defer synchronous state updates to avoid React 19 / strict lint cascading render errors
      setTimeout(() => {
        setAlbumUrl(url);
      }, 0);
      fetchMedia(url);
    } else {
      setTimeout(() => setLoading(false), 0);
    }
  }, [fetchMedia]);

  const rows = buildRows(items);
  let globalIdx = 0;

  // ── No album configured yet ──
  if (!loading && !albumUrl) {
    return (
      <section className="py-32 px-6 sm:px-12 lg:px-20 flex flex-col items-center" aria-label="Gallery">
        <div className="mb-16 text-center">
          <p className="mb-4 font-display text-xs tracking-[0.55em] text-verse-gold/70 uppercase">Us</p>
          <h2 className="font-display text-[clamp(2.5rem,7vw,5rem)] font-light leading-[0.95] text-verse-cream">
            Frozen in<br /><span className="italic text-verse-cream-muted">light.</span>
          </h2>
        </div>
        <div className="mt-4 rounded-sm border border-verse-gold/15 bg-verse-elevated px-10 py-12 text-center max-w-sm shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
          <p className="mb-2 font-display text-lg italic text-verse-cream">No album connected</p>
          <p className="mb-7 text-sm text-verse-cream-muted leading-relaxed">Paste your Google Photos album link to fill this gallery automatically.</p>
          <Link href="/for-her/setup" className="inline-block rounded-sm border border-verse-gold/30 bg-verse-gold/15 px-6 py-3 text-sm text-verse-gold hover:bg-verse-gold/25 transition-colors duration-200">
            Add album link →
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-32 px-4 sm:px-10 lg:px-16" aria-labelledby="gallery-heading">
      {/* Header */}
      <div className="mb-20 text-center">
        <p className="mb-4 font-display text-xs tracking-[0.55em] text-verse-gold/70 uppercase">Us</p>
        <h2 id="gallery-heading" className="font-display text-[clamp(2.5rem,7vw,5rem)] font-light leading-[0.95] text-verse-cream">
          Frozen in<br /><span className="italic text-verse-cream-muted">light.</span>
        </h2>
        {!loading && items.length > 0 && (
          <p className="mt-4 text-[11px] tracking-[0.4em] text-verse-cream-faint uppercase">
            {counts.photos} photos{counts.videos > 0 ? ` · ${counts.videos} video${counts.videos > 1 ? "s" : ""}` : ""}
          </p>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="mx-auto mb-16 max-w-md rounded-sm border border-red-900/30 bg-red-950/20 px-6 py-4 text-center">
          <p className="text-sm text-red-400">{error}</p>
          <Link href="/for-her/setup" className="mt-3 inline-block text-xs text-verse-gold hover:underline">Update album link →</Link>
        </div>
      )}

      {/* Skeleton loaders */}
      {loading && (
        <div className="mx-auto max-w-5xl space-y-5">
          {ROW_PATTERNS.slice(0, 3).map((pattern, ri) => (
            <div key={ri} className="grid grid-cols-12 gap-4 sm:gap-5">
              {pattern.map((cell, ci) => <SkeletonCard key={ci} aspect={cell.aspect} span={cell.span} />)}
            </div>
          ))}
        </div>
      )}

      {/* Media wall — photos + videos interleaved */}
      {!loading && items.length > 0 && (
        <div className="mx-auto max-w-5xl space-y-5">
          {rows.map((row, rowIdx) => {
            const rowDelay = rowIdx * 0.06;
            return (
              <div
                key={rowIdx}
                className="grid grid-cols-12 gap-4 sm:gap-5"
                style={{
                  marginLeft: rowIdx % 3 === 1 ? "clamp(0px,2vw,24px)" : 0,
                  marginRight: rowIdx % 3 === 2 ? "clamp(0px,2vw,24px)" : 0,
                }}
              >
                {row.items.map((item, colIdx) => {
                  const idx = globalIdx++;
                  const { rot, nudge, dir } = seedValues(idx);
                  const cell = row.pattern[colIdx] ?? { span: "col-span-12", aspect: "aspect-square" };
                  const delay = rowDelay + colIdx * 0.12;

                  if (item.kind === "video") {
                    return (
                      <VideoCard
                        key={item.src}
                        thumbnail={item.thumbnail}
                        src={item.src}
                        gradient={GRADIENTS[idx % GRADIENTS.length]}
                        rotation={rot}
                        nudge={nudge}
                        dir={dir}
                        delay={delay}
                        aspect={cell.aspect}
                        span={cell.span}
                      />
                    );
                  }
                  return (
                    <PhotoCard
                      key={item.url}
                      url={item.url}
                      gradient={GRADIENTS[idx % GRADIENTS.length]}
                      rotation={rot}
                      nudge={nudge}
                      dir={dir}
                      delay={delay}
                      aspect={cell.aspect}
                      span={cell.span}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      )}

      {!loading && items.length > 0 && (
        <div className="mx-auto mt-24 h-px max-w-xs bg-gradient-to-r from-transparent via-verse-gold/30 to-transparent" />
      )}

      {albumUrl && !loading && (
        <div className="mt-10 text-center opacity-20 hover:opacity-60 transition-opacity duration-300">
          <Link href="/for-her/setup" className="text-[10px] tracking-[0.35em] text-verse-cream-faint uppercase">
            Change album
          </Link>
        </div>
      )}
    </section>
  );
}
