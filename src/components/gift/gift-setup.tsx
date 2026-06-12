"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const STORAGE_KEY = "gift_album_url";

export function GiftSetup() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [photoCount, setPhotoCount] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  // mounted guard — prevents any localStorage access during SSR
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(STORAGE_KEY) ?? "";
    setUrl(saved);
    inputRef.current?.focus();
  }, []);

  const handleTest = async () => {
    const trimmed = url.trim();
    if (!trimmed) return;
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch(`/api/album-photos?url=${encodeURIComponent(trimmed)}`);
      const data = await res.json();
      if (data.photos?.length > 0) {
        setPhotoCount(data.photos.length);
        setStatus("ok");
      } else {
        setErrorMsg(data.error ?? "No photos found. Is the album public?");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error — make sure the dev server is running.");
      setStatus("error");
    }
  };

  const handleSave = () => {
    const trimmed = url.trim();
    if (!trimmed || status !== "ok") return;
    localStorage.setItem(STORAGE_KEY, trimmed);
    router.push("/for-her");
  };

  const handleClear = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUrl("");
    setStatus("idle");
    setPhotoCount(0);
    inputRef.current?.focus();
  };

  return (
    <main
      className="min-h-[100svh] flex flex-col items-center justify-center bg-verse-void px-4 py-12 sm:px-6"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(201,169,110,0.06), transparent 70%), #080706",
      }}
    >
      <div className="relative z-10 w-full max-w-xl">
        <p className="mb-3 text-center font-display text-xs tracking-[0.5em] text-verse-gold/70 uppercase">
          Setup
        </p>
        <h1 className="mb-2 text-center font-display text-[clamp(1.8rem,6vw,3.5rem)] font-light leading-tight text-verse-cream">
          Album Link
        </h1>
        <p className="mb-10 text-center text-sm leading-relaxed text-verse-cream-muted">
          Paste any <span className="italic text-verse-cream">public</span> Google Photos album link.
          <br />
          Photos will appear automatically in the gallery.
        </p>

        <div className="rounded-sm border border-verse-gold/10 bg-verse-elevated p-6 sm:p-8 shadow-[0_32px_80px_rgba(0,0,0,0.55)]">
          <label className="mb-2 block text-xs tracking-[0.3em] text-verse-cream-faint uppercase">
            Google Photos URL
          </label>
          <input
            ref={inputRef}
            id="album-url-input"
            type="url"
            value={url}
            onChange={(e) => { setUrl(e.target.value); setStatus("idle"); setPhotoCount(0); }}
            onKeyDown={(e) => e.key === "Enter" && handleTest()}
            placeholder="https://photos.app.goo.gl/..."
            className="w-full rounded-sm border border-verse-gold/15 bg-verse-void px-4 py-3.5 text-sm text-verse-cream placeholder:text-verse-cream-faint/50 focus:border-verse-gold/40 focus:outline-none transition-colors duration-200"
          />

          {status === "ok" && (
            <div className="mt-3 flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <p className="text-xs text-emerald-400">Found <strong>{photoCount}</strong> photos — ready to save.</p>
            </div>
          )}
          {status === "error" && (
            <div className="mt-3 flex items-start gap-2">
              <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
              <p className="text-xs text-red-400">{errorMsg}</p>
            </div>
          )}
          {status === "loading" && (
            <div className="mt-3 flex items-center gap-2">
              <div className="h-3 w-3 animate-spin rounded-full border border-verse-gold/40 border-t-verse-gold" />
              <p className="text-xs text-verse-cream-faint">Fetching photos…</p>
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              id="test-album-btn"
              onClick={handleTest}
              disabled={!url.trim() || status === "loading"}
              className="flex-1 rounded-sm border border-verse-gold/25 bg-verse-gold/10 px-5 py-3.5 text-sm text-verse-gold transition-all duration-200 hover:border-verse-gold/50 hover:bg-verse-gold/20 disabled:pointer-events-none disabled:opacity-40"
            >
              {status === "loading" ? "Fetching…" : "Test Album"}
            </button>
            <button
              id="save-album-btn"
              onClick={handleSave}
              disabled={status !== "ok"}
              className="flex-1 rounded-sm border border-verse-gold/40 bg-verse-gold/25 px-5 py-3.5 text-sm font-medium text-verse-gold transition-all duration-200 hover:bg-verse-gold/40 disabled:pointer-events-none disabled:opacity-40"
            >
              Save &amp; Open →
            </button>
          </div>

          {/* Only rendered after mount to avoid SSR crash */}
          {mounted && (
            <div className="mt-5 text-center">
              <button
                onClick={handleClear}
                className="text-[11px] tracking-wide text-verse-cream-faint hover:text-verse-cream-muted transition-colors py-2 px-4"
              >
                Clear saved link
              </button>
            </div>
          )}
        </div>

        <p className="mt-8 text-center text-[11px] leading-relaxed text-verse-cream-faint">
          This page is only for you — she&apos;ll never see it.
          <br />
          The album link is saved in your browser.
        </p>
      </div>
    </main>
  );
}
