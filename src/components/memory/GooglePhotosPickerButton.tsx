"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Check, AlertCircle, ImagePlus } from "lucide-react";

interface Props {
  worldSlug: string;
  worldId: string;
  /** True when the user has a stored google_photos_tokens row */
  isConnected: boolean;
  /** Called after import completes with the count of newly imported memories */
  onImported?: (count: number) => void;
}

type PickerState =
  | "idle"
  | "connecting"
  | "picking"
  | "importing"
  | "done"
  | "error";

interface ImportSummary {
  imported: number;
  duplicates: number;
  failed: number;
}

export function GooglePhotosPickerButton({
  worldSlug,
  worldId,
  isConnected,
  onImported,
}: Props) {
  const [state, setState] = useState<PickerState>("idle");
  const [summary, setSummary] = useState<ImportSummary | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const popupRef = useRef<Window | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionIdRef = useRef<string>("");

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const handleImport = useCallback(async (sessionId: string) => {
    setState("importing");
    try {
      const res = await fetch("/api/google-photos/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ worldId, sessionId }),
      });

      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: "Import failed" }));
        throw new Error(error ?? "Import failed");
      }

      const { summary: s } = await res.json() as { summary: ImportSummary };
      setSummary(s);
      setState("done");
      onImported?.(s.imported);

      // Reset to idle after 4 s so user can import more if they want
      setTimeout(() => {
        setState("idle");
        setSummary(null);
      }, 4000);
    } catch (err) {
      console.error("[GooglePhotosPickerButton] import error:", err);
      setErrorMsg(err instanceof Error ? err.message : "Import failed");
      setState("error");
      setTimeout(() => setState("idle"), 4000);
    }
  }, [worldId, onImported]);

  async function handleClick() {
    if (state !== "idle") return;

    // ── Not yet connected → OAuth redirect ─────────────────────────
    if (!isConnected) {
      setState("connecting");
      window.location.href = `/api/google-photos/auth?world=${worldSlug}`;
      return;
    }

    setState("picking");
    setErrorMsg("");

    // ── Create picker session ───────────────────────────────────────
    let sessionId: string;
    let pickerUri: string;

    try {
      const sessionRes = await fetch("/api/google-photos/picker-session", {
        method: "POST",
      });

      if (!sessionRes.ok) {
        const { error } = await sessionRes.json().catch(() => ({}));
        if (error === "not_connected" || error === "token_expired") {
          // Token missing/expired — re-authenticate
          window.location.href = `/api/google-photos/auth?world=${worldSlug}`;
          return;
        }
        throw new Error(error ?? "Could not open picker");
      }

      const data = await sessionRes.json() as { sessionId: string; pickerUri: string };
      sessionId = data.sessionId;
      pickerUri = data.pickerUri;
    } catch (err) {
      console.error("[GooglePhotosPickerButton] session error:", err);
      setErrorMsg("Could not open Google Photos. Please try again.");
      setState("error");
      setTimeout(() => setState("idle"), 4000);
      return;
    }

    sessionIdRef.current = sessionId;

    // ── Open picker in a centred popup ──────────────────────────────
    const popupW = 640;
    const popupH = 720;
    const left = Math.round(window.screenX + (window.outerWidth - popupW) / 2);
    const top = Math.round(window.screenY + (window.outerHeight - popupH) / 2);

    popupRef.current = window.open(
      pickerUri,
      "verse-google-photos-picker",
      `width=${popupW},height=${popupH},left=${left},top=${top},toolbar=0,menubar=0,scrollbars=1`,
    );

    if (!popupRef.current) {
      setErrorMsg("Please allow popups for this site, then try again.");
      setState("error");
      setTimeout(() => setState("idle"), 5000);
      return;
    }

    // ── Poll until popup closes ─────────────────────────────────────
    // The user signals they are done by closing/submitting the picker popup.
    pollRef.current = setInterval(() => {
      if (popupRef.current?.closed) {
        if (pollRef.current) clearInterval(pollRef.current);
        handleImport(sessionIdRef.current);
      }
    }, 500);
  }

  const isDisabled = state !== "idle";

  return (
    <div className="flex flex-col gap-3">
      <button
        id="google-photos-picker-btn"
        onClick={handleClick}
        disabled={isDisabled}
        aria-busy={state === "picking" || state === "importing"}
        className={[
          "group relative flex items-center gap-3.5 rounded-2xl border px-5 py-4",
          "text-sm font-light transition-all duration-300",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-verse-gold/40 focus-visible:ring-offset-2 focus-visible:ring-offset-verse-void",
          state === "done"
            ? "border-verse-gold/40 bg-verse-gold/8 text-verse-gold"
            : state === "error"
            ? "border-rose-500/30 bg-rose-500/8 text-rose-300"
            : "border-verse-border bg-verse-surface/60 text-verse-cream-muted hover:border-verse-gold/30 hover:bg-verse-surface hover:text-verse-cream",
          isDisabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
        ].join(" ")}
      >
        {/* Google Photos logo mark */}
        <GooglePhotosIcon className="h-5 w-5 shrink-0" faded={isDisabled} />

        <span className="flex-1 text-left">
          <AnimatePresence mode="wait" initial={false}>
            {state === "idle" && (
              <FadeText key="idle">
                {isConnected ? "Import from Google Photos" : "Connect Google Photos"}
              </FadeText>
            )}
            {state === "connecting" && (
              <FadeText key="connecting">
                <Loader2 className="inline-block h-3.5 w-3.5 animate-spin mr-2 -mt-0.5" />
                Redirecting to Google…
              </FadeText>
            )}
            {state === "picking" && (
              <FadeText key="picking">
                <Loader2 className="inline-block h-3.5 w-3.5 animate-spin mr-2 -mt-0.5" />
                Choose your memories…
              </FadeText>
            )}
            {state === "importing" && (
              <FadeText key="importing">
                <Loader2 className="inline-block h-3.5 w-3.5 animate-spin mr-2 -mt-0.5" />
                Bringing them home…
              </FadeText>
            )}
            {state === "done" && summary && (
              <FadeText key="done">
                <Check className="inline-block h-3.5 w-3.5 mr-2 -mt-0.5 text-verse-gold" />
                {summary.imported > 0
                  ? `${summary.imported} ${summary.imported === 1 ? "memory" : "memories"} added`
                  : summary.duplicates > 0
                  ? "Already in your world ✦"
                  : "Nothing new to import"}
              </FadeText>
            )}
            {state === "error" && (
              <FadeText key="error">
                <AlertCircle className="inline-block h-3.5 w-3.5 mr-2 -mt-0.5 text-rose-400" />
                {errorMsg || "Something went wrong"}
              </FadeText>
            )}
          </AnimatePresence>
        </span>

        {/* Subtle chevron in idle */}
        {state === "idle" && (
          <ImagePlus className="h-4 w-4 shrink-0 opacity-40 group-hover:opacity-70 transition-opacity" />
        )}
      </button>

      {/* Fine-print below the button */}
      {state === "idle" && (
        <p className="text-[11px] leading-relaxed text-verse-cream-faint px-1">
          {isConnected
            ? "You choose exactly which photos come in — no bulk sync, ever."
            : "You'll be asked to sign in with Google. Only the photos you select are imported."}
        </p>
      )}

      {/* Duplicate detail (only when done and there were dupes) */}
      {state === "done" && summary && summary.duplicates > 0 && (
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[11px] text-verse-cream-faint px-1"
        >
          {summary.duplicates} already in your archive — skipped.
        </motion.p>
      )}
    </div>
  );
}

// ── Small helpers ──────────────────────────────────────────────────────────

function FadeText({ children, key: _key }: { children: React.ReactNode; key?: string }) {
  return (
    <motion.span
      className="flex items-center"
      initial={{ opacity: 0, y: 3 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -3 }}
      transition={{ duration: 0.18 }}
    >
      {children}
    </motion.span>
  );
}

function GooglePhotosIcon({
  className,
  faded,
}: {
  className?: string;
  faded?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      aria-hidden="true"
      style={{ opacity: faded ? 0.5 : 1 }}
    >
      {/* Simplified Google Photos pinwheel — four coloured circles */}
      <circle cx="9"  cy="9"  r="4.5" fill="#EA4335" />
      <circle cx="15" cy="9"  r="4.5" fill="#FBBC05" />
      <circle cx="15" cy="15" r="4.5" fill="#34A853" />
      <circle cx="9"  cy="15" r="4.5" fill="#4285F4" />
      {/* Central overlap to hint at the pinwheel shape */}
      <circle cx="12" cy="12" r="2.5" fill="rgba(0,0,0,0.18)" />
    </svg>
  );
}
